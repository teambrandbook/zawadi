from django.contrib import admin
from .models import Consultant, ConsultationBooking


@admin.register(Consultant)
class ConsultantAdmin(admin.ModelAdmin):
    list_display = ["user", "years_of_experience", "qualification", "consiltation_fee", "created_at"]
    search_fields = ["user__email", "qualification"]
    list_filter = ["years_of_experience"]


@admin.register(ConsultationBooking)
class ConsultationBookingAdmin(admin.ModelAdmin):
    list_display = ["user", "consultant", "session_type", "booked_date", "booked_slot", "status", "created_at"]
    list_filter = ["status", "session_type", "booked_date"]
    search_fields = ["user__email", "consultant__user__email"]
    readonly_fields = ["created_at", "updated_at"]

# admin.site.register(ConsultationBooking)