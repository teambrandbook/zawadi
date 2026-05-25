from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.db import OperationalError, ProgrammingError
from django.db.models import Sum, Count, F, DecimalField, ExpressionWrapper
from django.db.models.functions import TruncDay, TruncWeek
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime, time, timedelta
from io import BytesIO
from xml.sax.saxutils import escape
from zipfile import ZIP_DEFLATED, ZipFile
from accounts.models import User
from .serializer import UserSerializer, UserUpdateSerializer, RoleSerializer
from .utils.permissions import has_permission, IsAdminRole
from .models import Role, SiteSettings
from zewadi.pagination import StandardPagination
from rest_framework.decorators import api_view, permission_classes


def format_serializer_errors(errors):
    messages = []

    for field, detail in errors.items():
        if isinstance(detail, (list, tuple)):
            messages.append(f"{field}: {', '.join(str(item) for item in detail)}")
        elif isinstance(detail, dict):
            messages.append(f"{field}: {format_serializer_errors(detail)}")
        else:
            messages.append(f"{field}: {detail}")

    return " ".join(messages) or "Invalid request data."


class AdminReportsAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        report = build_admin_reports_payload(request)
        if "error" in report:
            return Response({"error": report["error"]}, status=status.HTTP_400_BAD_REQUEST)
        return Response(report, status=status.HTTP_200_OK)


ACTIVE_REVENUE_STATUSES = [
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
]


def safe_report(fn, default):
    try:
        return fn()
    except (ProgrammingError, OperationalError):
        return default


def parse_report_filters(request):
    now = timezone.localtime()
    today = now.date()
    period = request.query_params.get("period", "month")
    module = request.query_params.get("module", "all")
    valid_periods = {"today", "week", "month", "last_3_months", "custom", "all"}
    valid_modules = {"all", "orders", "users", "consultations", "events", "content"}

    if period not in valid_periods:
        return {"error": "Invalid period."}
    if module not in valid_modules:
        return {"error": "Invalid module."}

    if period == "all":
        start_date = None
        end_date = None
    elif period == "today":
        start_date = end_date = today
    elif period == "week":
        start_date = today - timedelta(days=today.weekday())
        end_date = today
    elif period == "month":
        start_date = today.replace(day=1)
        end_date = today
    elif period == "last_3_months":
        start_date = today - timedelta(days=90)
        end_date = today
    else:
        start_date = parse_date(request.query_params.get("start_date", ""))
        end_date = parse_date(request.query_params.get("end_date", ""))
        if not start_date or not end_date:
            return {"error": "Custom range requires start_date and end_date."}
        if start_date > end_date:
            return {"error": "start_date cannot be after end_date."}

    start_dt = timezone.make_aware(datetime.combine(start_date, time.min)) if start_date else None
    end_dt = timezone.make_aware(datetime.combine(end_date + timedelta(days=1), time.min)) if end_date else None
    return {
        "period": period,
        "module": module,
        "start_date": start_date,
        "end_date": end_date,
        "start_dt": start_dt,
        "end_dt": end_dt,
        "date_range_label": "All Time" if period == "all" else f"{start_date.strftime('%b %d, %Y')} - {end_date.strftime('%b %d, %Y')}",
    }


def filter_datetime_range(qs, field, filters):
    if filters["period"] == "all":
        return qs
    return qs.filter(**{f"{field}__gte": filters["start_dt"], f"{field}__lt": filters["end_dt"]})


def money_total(qs, expression):
    return float(qs.aggregate(t=Sum(expression))["t"] or 0)


def profit_expression():
    return ExpressionWrapper(
        (F("selling_price") - F("cost_price")) * F("quantity"),
        output_field=DecimalField(max_digits=12, decimal_places=2),
    )


def discount_expression():
    return ExpressionWrapper(
        F("discount_amount") * F("quantity"),
        output_field=DecimalField(max_digits=12, decimal_places=2),
    )


def xlsx_col_name(index):
    name = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        name = chr(65 + remainder) + name
    return name


def xlsx_cell(value, row_index, col_index):
    ref = f"{xlsx_col_name(col_index)}{row_index}"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f'<c r="{ref}"><v>{value}</v></c>'
    text = "" if value is None else str(value)
    return f'<c r="{ref}" t="inlineStr"><is><t>{escape(text)}</t></is></c>'


def xlsx_sheet_xml(rows):
    row_xml = []
    for row_index, row in enumerate(rows, start=1):
        cells = "".join(xlsx_cell(value, row_index, col_index) for col_index, value in enumerate(row, start=1))
        row_xml.append(f'<row r="{row_index}">{cells}</row>')
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        f'<sheetData>{"".join(row_xml)}</sheetData>'
        '</worksheet>'
    )


def build_xlsx_workbook(sheets):
    output = BytesIO()
    sheet_entries = []
    workbook_rels = []
    content_overrides = []

    for index, sheet in enumerate(sheets, start=1):
        safe_name = sheet["name"][:31]
        sheet_entries.append(
            f'<sheet name="{escape(safe_name)}" sheetId="{index}" r:id="rId{index}"/>'
        )
        workbook_rels.append(
            f'<Relationship Id="rId{index}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{index}.xml"/>'
        )
        content_overrides.append(
            f'<Override PartName="/xl/worksheets/sheet{index}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        )

    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<sheets>{"".join(sheet_entries)}</sheets>'
        '</workbook>'
    )
    workbook_rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f'{"".join(workbook_rels)}'
        '</Relationships>'
    )
    root_rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        '</Relationships>'
    )
    content_types_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        f'{"".join(content_overrides)}'
        '</Types>'
    )

    with ZipFile(output, "w", ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types_xml)
        archive.writestr("_rels/.rels", root_rels_xml)
        archive.writestr("xl/workbook.xml", workbook_xml)
        archive.writestr("xl/_rels/workbook.xml.rels", workbook_rels_xml)
        for index, sheet in enumerate(sheets, start=1):
            archive.writestr(f"xl/worksheets/sheet{index}.xml", xlsx_sheet_xml(sheet["rows"]))

    output.seek(0)
    return output.getvalue()


def build_admin_reports_payload(request):
    from orders.models import Order
    from consultant.models import ConsultationBooking
    from events.models import Event, EventRegistration
    from recipes.models import Recipe
    from blog.models import Blog

    filters = parse_report_filters(request)
    if "error" in filters:
        return filters

    module = filters["module"]
    include_orders = module in {"all", "orders"}
    include_users = module in {"all", "users"}
    include_consultations = module in {"all", "consultations"}
    include_events = module in {"all", "events"}
    include_content = module in {"all", "content"}

    orders = filter_datetime_range(
        Order.objects.filter(status__in=ACTIVE_REVENUE_STATUSES),
        "created_at",
        filters,
    )
    users = filter_datetime_range(User.objects.all(), "date_joined", filters)
    consultations = filter_datetime_range(ConsultationBooking.objects.all(), "created_at", filters)
    events = filter_datetime_range(Event.objects.all(), "created_at", filters)
    registrations = filter_datetime_range(EventRegistration.objects.all(), "registered_at", filters)
    recipes = filter_datetime_range(Recipe.objects.all(), "created_at", filters)
    blogs = filter_datetime_range(Blog.objects.all(), "created_at", filters)

    def revenue_trend():
        if not include_orders:
            return []
        trunc = TruncWeek("created_at") if (filters["end_date"] - filters["start_date"]).days > 45 else TruncDay("created_at")
        qs = (
            orders.annotate(bucket=trunc)
            .values("bucket")
            .annotate(value=Sum("subtotal"))
            .order_by("bucket")
        )
        return [
            {"label": row["bucket"].strftime("%b %d"), "value": float(row["value"] or 0)}
            for row in qs
            if row["bucket"]
        ]

    def user_growth():
        if not include_users:
            return []
        trunc = TruncWeek("date_joined") if (filters["end_date"] - filters["start_date"]).days > 45 else TruncDay("date_joined")
        qs = (
            users.annotate(bucket=trunc)
            .values("bucket")
            .annotate(value=Count("id"))
            .order_by("bucket")
        )
        return [
            {"label": row["bucket"].strftime("%b %d"), "value": row["value"]}
            for row in qs
            if row["bucket"]
        ]

    def consultation_analytics():
        if not include_consultations:
            return {"total": 0, "completed": 0, "cancelled": 0, "completion_rate": 0}
        total = consultations.count()
        completed = consultations.filter(status="completed").count()
        cancelled = consultations.filter(status="cancelled").count()
        rate = round((completed / total * 100), 1) if total else 0
        return {"total": total, "completed": completed, "cancelled": cancelled, "completion_rate": rate}

    def events_analytics():
        if not include_events:
            return {"total": 0, "registrations": 0, "avg_per_event": 0}
        total = events.count()
        registration_count = registrations.count()
        avg = round(registration_count / total, 1) if total else 0
        return {"total": total, "registrations": registration_count, "avg_per_event": avg}

    def content_analytics():
        if not include_content:
            return {"recipes": 0, "blogs": 0, "approval_rate": 0, "recipes_published_pct": 0}
        recipe_count = recipes.count()
        blog_count = blogs.count()
        published_recipes = recipes.filter(status="published").count()
        published_blogs = blogs.filter(status="published").count()
        total = recipe_count + blog_count
        published = published_recipes + published_blogs
        approval_rate = round((published / total * 100), 1) if total else 0
        return {
            "recipes": recipe_count,
            "blogs": blog_count,
            "approval_rate": approval_rate,
            "recipes_published_pct": round((published_recipes / recipe_count * 100), 0) if recipe_count else 0,
        }

    def report_rows():
        order_count = orders.count() if include_orders else 0
        user_count = users.count() if include_users else 0
        content_count = (recipes.count() + blogs.count()) if include_content else 0
        total_revenue = money_total(orders, "subtotal") if include_orders else 0
        total_profit = money_total(orders, profit_expression()) if include_orders else 0
        total_discount = money_total(orders, discount_expression()) if include_orders else 0
        total_tax_shipping = (
            money_total(orders, "tax_amount") + money_total(orders, "delivery_charge")
            if include_orders
            else 0
        )
        updated_at = timezone.localtime().strftime("%b %d, %Y")
        return [
            {"id": "revenue", "report_type": "Revenue Report", "date_range": filters["date_range_label"],
             "records": order_count, "total": total_revenue, "status": "Ready", "updated_at": updated_at},
            {"id": "gross_profit", "report_type": "Gross Profit Report", "date_range": filters["date_range_label"],
             "records": order_count, "total": total_profit, "status": "Ready", "updated_at": updated_at},
            {"id": "discounts", "report_type": "Discounts Given", "date_range": filters["date_range_label"],
             "records": order_count, "total": total_discount, "status": "Ready", "updated_at": updated_at},
            {"id": "charges", "report_type": "Tax & Shipping", "date_range": filters["date_range_label"],
             "records": order_count, "total": total_tax_shipping, "status": "Ready", "updated_at": updated_at},
            {"id": "user_analytics", "report_type": "User Analytics", "date_range": filters["date_range_label"],
             "records": user_count, "total": user_count, "status": "Ready", "updated_at": updated_at},
            {"id": "content", "report_type": "Content Performance", "date_range": filters["date_range_label"],
             "records": content_count, "total": content_count, "status": "Ready", "updated_at": updated_at},
        ]

    total_revenue = safe_report(lambda: money_total(orders, "subtotal") if include_orders else 0, 0)
    return {
        "filters": {
            "period": filters["period"],
            "module": module,
            "start_date": filters["start_date"].isoformat(),
            "end_date": filters["end_date"].isoformat(),
            "date_range": filters["date_range_label"],
        },
        "stats": {
            "total_revenue": total_revenue,
            "total_orders": safe_report(lambda: orders.count() if include_orders else 0, 0),
            "total_users": safe_report(lambda: users.count() if include_users else 0, 0),
            "total_consultations": safe_report(lambda: consultations.count() if include_consultations else 0, 0),
        },
        "revenue_trend": safe_report(revenue_trend, []),
        "user_growth": safe_report(user_growth, []),
        "analytics": {
            "consultations": safe_report(consultation_analytics, {"total": 0, "completed": 0, "cancelled": 0, "completion_rate": 0}),
            "events": safe_report(events_analytics, {"total": 0, "registrations": 0, "avg_per_event": 0}),
            "content": safe_report(content_analytics, {"recipes": 0, "blogs": 0, "approval_rate": 0, "recipes_published_pct": 0}),
        },
        "report_rows": safe_report(report_rows, []),
    }


class AdminReportsExportAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        from orders.models import Order
        from consultant.models import ConsultationBooking
        from events.models import Event, EventRegistration
        from recipes.models import Recipe
        from blog.models import Blog

        filters = parse_report_filters(request)
        if "error" in filters:
            return Response({"error": filters["error"]}, status=status.HTTP_400_BAD_REQUEST)

        report_type = request.query_params.get("report_type", "all")
        valid_report_types = {
            "revenue",
            "gross_profit",
            "discounts",
            "charges",
            "user_analytics",
            "content",
            "all",
        }
        if report_type not in valid_report_types:
            return Response({"error": "Invalid report_type."}, status=status.HTTP_400_BAD_REQUEST)

        export_all = report_type == "all"
        include_orders = export_all or filters["module"] in {"all", "orders"}
        include_users = export_all or filters["module"] in {"all", "users"}
        include_consultations = export_all or filters["module"] in {"all", "consultations"}
        include_events = export_all or filters["module"] in {"all", "events"}
        include_content = export_all or filters["module"] in {"all", "content"}

        orders = filter_datetime_range(
            Order.objects.filter(status__in=ACTIVE_REVENUE_STATUSES),
            "created_at",
            filters,
        ).order_by("-created_at")
        users = filter_datetime_range(User.objects.all(), "date_joined", filters).order_by("-date_joined")
        consultations = filter_datetime_range(ConsultationBooking.objects.all(), "created_at", filters).order_by("-created_at")
        events = filter_datetime_range(Event.objects.all(), "created_at", filters).order_by("-created_at")
        registrations = filter_datetime_range(EventRegistration.objects.all(), "registered_at", filters).order_by("-registered_at")
        recipes = filter_datetime_range(Recipe.objects.all(), "created_at", filters).order_by("-created_at")
        blogs = filter_datetime_range(Blog.objects.all(), "created_at", filters).order_by("-created_at")
        if not include_orders:
            orders = Order.objects.none()
        if not include_users:
            users = User.objects.none()
        if not include_consultations:
            consultations = ConsultationBooking.objects.none()
        if not include_events:
            events = Event.objects.none()
            registrations = EventRegistration.objects.none()
        if not include_content:
            recipes = Recipe.objects.none()
            blogs = Blog.objects.none()

        def revenue_trend_rows():
            rows = [["Period", "Revenue"]]
            trunc = TruncWeek("created_at") if (filters["end_date"] - filters["start_date"]).days > 45 else TruncDay("created_at")
            trend = (
                orders.annotate(bucket=trunc)
                .values("bucket")
                .annotate(value=Sum("subtotal"))
                .order_by("bucket")
            )
            for row in trend:
                if row["bucket"]:
                    rows.append([row["bucket"].strftime("%Y-%m-%d"), float(row["value"] or 0)])
            return rows

        def summary_rows():
            total_orders = orders.count()
            total_users = users.count()
            total_consultations = consultations.count()
            total_events = events.count()
            total_registrations = registrations.count()
            total_recipes = recipes.count()
            total_blogs = blogs.count()
            total_revenue = money_total(orders, "subtotal") if include_orders else 0
            total_profit = money_total(orders, profit_expression()) if include_orders else 0
            total_discount = money_total(orders, discount_expression()) if include_orders else 0
            return [
                ["Metric", "Value"],
                ["Date Range", filters["date_range_label"]],
                ["Total Orders", total_orders],
                ["Total Revenue", total_revenue],
                ["Gross Profit", total_profit],
                ["Discounts Given", total_discount],
                ["New Users", total_users],
                ["Consultations", total_consultations],
                ["Events", total_events],
                ["Event Registrations", total_registrations],
                ["Recipes", total_recipes],
                ["Blogs", total_blogs],
            ]

        def financial_rows():
            rows = [[
                "Order ID",
                "Date",
                "Product Name",
                "Quantity",
                "Selling Price",
                "Cost Price",
                "Discount Amount",
                "Subtotal",
                "Gross Profit",
                "Tax Amount",
                "Shipping Charge",
                "Status",
            ]]
            for order in orders:
                gross_profit = (order.selling_price - order.cost_price) * order.quantity
                rows.append([
                    order.order_id,
                    timezone.localtime(order.created_at).strftime("%Y-%m-%d"),
                    order.product_name,
                    order.quantity,
                    float(order.selling_price),
                    float(order.cost_price),
                    float(order.discount_amount * order.quantity),
                    float(order.subtotal),
                    float(gross_profit),
                    float(order.tax_amount),
                    float(order.delivery_charge),
                    order.status,
                ])
            return rows

        def user_rows():
            rows = [["User ID", "Name", "Email", "Role", "Date Joined", "Status"]]
            for user in users:
                rows.append([
                    user.user_id,
                    user.full_name,
                    user.email,
                    user.role,
                    timezone.localtime(user.date_joined).strftime("%Y-%m-%d"),
                    "Active" if user.is_active else "Inactive",
                ])
            return rows

        def user_growth_rows():
            rows = [["Period", "Users"]]
            trunc = TruncWeek("date_joined") if (filters["end_date"] - filters["start_date"]).days > 45 else TruncDay("date_joined")
            growth = (
                users.annotate(bucket=trunc)
                .values("bucket")
                .annotate(value=Count("id"))
                .order_by("bucket")
            )
            for row in growth:
                if row["bucket"]:
                    rows.append([row["bucket"].strftime("%Y-%m-%d"), row["value"]])
            return rows

        def consultation_rows():
            total = consultations.count()
            completed = consultations.filter(status="completed").count()
            cancelled = consultations.filter(status="cancelled").count()
            rate = round((completed / total * 100), 1) if total else 0
            rows = [
                ["Metric", "Value"],
                ["Total Consultations", total],
                ["Completed", completed],
                ["Cancelled", cancelled],
                ["Completion Rate", f"{rate}%"],
                [],
                ["Booking ID", "User", "Consultant", "Booked Date", "Slot", "Status", "Created At"],
            ]
            for booking in consultations:
                rows.append([
                    booking.id,
                    getattr(booking.user, "email", ""),
                    getattr(getattr(booking.consultant, "user", None), "email", ""),
                    booking.booked_date.strftime("%Y-%m-%d") if booking.booked_date else "",
                    booking.booked_slot,
                    booking.status,
                    timezone.localtime(booking.created_at).strftime("%Y-%m-%d"),
                ])
            return rows

        def event_rows():
            total = events.count()
            registration_count = registrations.count()
            avg = round(registration_count / total, 1) if total else 0
            rows = [
                ["Metric", "Value"],
                ["Total Events", total],
                ["Registrations", registration_count],
                ["Avg. per Event", avg],
                [],
                ["Type", "ID", "Title/Event", "User", "Status", "Date"],
            ]
            for event in events:
                rows.append([
                    "Event",
                    event.id,
                    event.title,
                    "",
                    event.status,
                    event.event_date.strftime("%Y-%m-%d") if event.event_date else "",
                ])
            for registration in registrations:
                rows.append([
                    "Registration",
                    registration.id,
                    getattr(registration.event, "title", ""),
                    getattr(registration.user, "email", ""),
                    registration.status,
                    timezone.localtime(registration.registered_at).strftime("%Y-%m-%d"),
                ])
            return rows

        def content_rows():
            recipe_count = recipes.count()
            blog_count = blogs.count()
            published_recipes = recipes.filter(status="published").count()
            published_blogs = blogs.filter(status="published").count()
            total = recipe_count + blog_count
            published = published_recipes + published_blogs
            approval_rate = round((published / total * 100), 1) if total else 0
            rows = [
                ["Metric", "Value"],
                ["Recipes", recipe_count],
                ["Blogs", blog_count],
                ["Approval Rate", f"{approval_rate}%"],
                ["Recipes Published", published_recipes],
                [],
                ["Type", "ID", "Title", "Status", "Author", "Created At"],
            ]
            for recipe in recipes:
                rows.append([
                    "Recipe",
                    recipe.id,
                    recipe.title,
                    recipe.status,
                    getattr(recipe.author, "email", ""),
                    timezone.localtime(recipe.created_at).strftime("%Y-%m-%d"),
                ])
            for blog in blogs:
                rows.append([
                    "Blog",
                    blog.id,
                    blog.title,
                    blog.status,
                    getattr(blog.author, "email", ""),
                    timezone.localtime(blog.created_at).strftime("%Y-%m-%d"),
                ])
            return rows

        sheets = []

        def add_sheet(name, rows_builder):
            try:
                rows = rows_builder()
            except Exception as exc:
                rows = [
                    ["Report", "Status"],
                    [name, "Could not generate this sheet"],
                    ["Error", str(exc)],
                ]
            sheets.append({"name": name, "rows": rows})

        if report_type == "all":
            add_sheet("Summary", summary_rows)
            add_sheet("Revenue Trend", revenue_trend_rows)
            add_sheet("User Growth", user_growth_rows)
            add_sheet("Consultation Analytics", consultation_rows)
            add_sheet("Events Analytics", event_rows)
            add_sheet("Content Analytics", content_rows)
        if report_type in {"revenue", "all"}:
            add_sheet("Revenue", financial_rows)
        if report_type in {"gross_profit", "all"}:
            add_sheet("Gross Profit", financial_rows)
        if report_type in {"discounts", "all"}:
            add_sheet("Discounts Given", financial_rows)
        if report_type in {"charges", "all"}:
            add_sheet("Tax & Shipping", financial_rows)
        if report_type in {"user_analytics", "all"}:
            add_sheet("User Analytics", user_rows)
        if report_type in {"content", "all"}:
            add_sheet("Content Performance", content_rows)

        try:
            workbook = build_xlsx_workbook(sheets)
        except Exception as exc:
            fallback = [{"name": "Export Error", "rows": [["Error"], [str(exc)]]}]
            workbook = build_xlsx_workbook(fallback)

        response = HttpResponse(
            workbook,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        safe_range = f"{filters['start_date'].isoformat()}-to-{filters['end_date'].isoformat()}"
        response["Content-Disposition"] = f'attachment; filename="{report_type}-report-{safe_range}.xlsx"'
        return response


class AdminStatsAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        from orders.models import Order
        from product.models import Product
        from events.models import Event
        from consultant.models import ConsultationBooking

        def safe_query(query_fn, default=0):
            try:
                return query_fn()
            except (ProgrammingError, OperationalError):
                # Some apps in this project currently have no DB migrations.
                # Return zero stats instead of failing the entire dashboard API.
                return default

        total_users = safe_query(lambda: User.objects.count())
        total_orders = safe_query(lambda: Order.objects.count())
        total_products = safe_query(lambda: Product.objects.count())
        total_events = safe_query(lambda: Event.objects.count())
        total_consultations = safe_query(lambda: ConsultationBooking.objects.count())
        total_revenue = safe_query(
            lambda: float(
                Order.objects.filter(
                    status__in=["confirmed", "processing", "shipped", "delivered"]
                ).aggregate(t=Sum("subtotal"))["t"] or 0
            )
        )
        total_shipping = safe_query(
            lambda: float(
                Order.objects.filter(
                    status__in=["confirmed", "processing", "shipped", "delivered"]
                ).aggregate(t=Sum("delivery_charge"))["t"] or 0
            )
        )
        total_tax = safe_query(
            lambda: float(
                Order.objects.filter(
                    status__in=["confirmed", "processing", "shipped", "delivered"]
                ).aggregate(t=Sum("tax_amount"))["t"] or 0
            )
        )

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_events": total_events,
            "total_consultations": total_consultations,
            "total_revenue": float(total_revenue),
            "total_shipping": float(total_shipping),
            "total_tax": float(total_tax),
        }, status=status.HTTP_200_OK)


class UserListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not has_permission(user, "users", "view"):
            return Response(
                {"error": "You do not have permission to view users"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # exclude consultants; select_related to avoid N+1 on communityuser
        users = User.objects.exclude(role="CONSULTANT").select_related("communityuser")

        paginator = StandardPagination()
        page = paginator.paginate_queryset(users, request)

        if page is not None:
            return paginator.get_paginated_response(
                UserSerializer(page, many=True).data
            )

        return Response(
            UserSerializer(users, many=True).data,
            status=status.HTTP_200_OK
        )


class UserDetailAPIView(APIView):
    """GET /supperadmin/users/{id}/ — single user detail
    PATCH /supperadmin/users/{id}/ — partial update (admin only)
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, user_id):
        try:
            return User.objects.select_related("communityuser").get(pk=user_id)
        except User.DoesNotExist:
            return None

    def get(self, request, user_id):
        if not has_permission(request.user, "users", "view"):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        obj = self.get_object(user_id)
        if obj is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(obj).data)

    def patch(self, request, user_id):
        if not has_permission(request.user, "users", "edit"):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        obj = self.get_object(user_id)
        if obj is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserUpdateSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(obj).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        if not has_permission(request.user, "users", "delete"):
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        obj = self.get_object(user_id)

        if obj is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()

        return Response(
            {"message": "User deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )
    
class RoleAPIView(APIView):
    permission_classes = [IsAdminRole]
    
    def get_user(self, id):
        try:
            return Role.objects.get(id=id)
        except Role.DoesNotExist:
            return None

    def post(self, request):

        user = request.user

        if not user.role == "ADMIN":
            return Response(
                {"detail": "You do not have permission to create roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = RoleSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Role created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "message": format_serializer_errors(serializer.errors),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    def get(self, request, id=None):

        user = request.user

        if not user.role == "ADMIN":
            return Response(
                {"detail": "You do not have permission to view roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if id:
            role = self.get_user(id)

            if not role:
                return Response(
                    {"error": "Role not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = RoleSerializer(role)

            return Response(serializer.data)

        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)

        return Response(serializer.data)
    
    def patch(self, request, id):

        user = request.user

        if not user.role == "ADMIN":
            return Response(
                {"detail": "You do not have permission to update roles."},
                status=status.HTTP_403_FORBIDDEN,
            )

        role = self.get_user(id)

        if not role:
            return Response(
                {"error": "Role not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RoleSerializer(
            role,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Role updated successfully",
                    "data": serializer.data
                }
            )

        return Response(
            {
                "message": format_serializer_errors(serializer.errors),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )



def _config_to_dict(cfg):
    return {
        "platform_name": cfg.platform_name,
        "support_email": cfg.support_email,
        "support_phone": cfg.support_phone,
        "maintenance_mode": cfg.maintenance_mode,
    }


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def site_config(request):
    cfg = SiteSettings.get()

    if request.method == "GET":
        return Response(_config_to_dict(cfg))

    if not (request.user.is_superuser or getattr(request.user, "role", "") == "ADMIN"):
        return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

    changed = False
    if "platform_name" in request.data:
        cfg.platform_name = str(request.data["platform_name"]).strip()[:100]
        changed = True
    if "support_email" in request.data:
        cfg.support_email = str(request.data["support_email"]).strip()
        changed = True
    if "support_phone" in request.data:
        cfg.support_phone = str(request.data["support_phone"]).strip()[:30]
        changed = True
    if "maintenance_mode" in request.data:
        cfg.maintenance_mode = bool(request.data["maintenance_mode"])
        changed = True
        from django.core.cache import cache
        cache.delete("zawadi:maintenance_mode")

    if changed:
        cfg.save()

    return Response(_config_to_dict(cfg))
