# Group 3 — Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically notify users via email and in-app bell when order or booking status changes. The in-app system (models, receipts, inbox endpoints) already exists — this plan wires Django signals to it and adds the frontend bell.

**Architecture:** `post_save` signals on `Order` and `ConsultationBooking` detect status changes using a `_status_before_save` attribute set in `__init__`. Signals call the existing `send_user_notification()` utility and a new `send_notification_email()` function. A new `unread-count` endpoint supports the bell badge. The frontend bell polls every 60 seconds.

**Tech Stack:** Django 6 (signals), Django's `send_mail`, DRF, Next.js 16 (TypeScript), React polling with `useEffect`

---

## File Map

| Action | File |
|--------|------|
| Modify | `backend/zewadi/orders/models.py` |
| Create | `backend/zewadi/orders/signals.py` |
| Modify | `backend/zewadi/orders/apps.py` |
| Modify | `backend/zewadi/consultant/models.py` |
| Create | `backend/zewadi/consultant/signals.py` |
| Modify | `backend/zewadi/consultant/apps.py` |
| Create | `backend/zewadi/notifications/email.py` |
| Modify | `backend/zewadi/notifications/views.py` |
| Modify | `backend/zewadi/notifications/urls.py` |
| Modify | `frontend/src/components/communityUsers/commen/Navbar.tsx` (or equivalent) |
| Create | `frontend/src/components/notifications/NotificationDropdown.tsx` |

---

### Task 1: Add unread-count endpoint to notifications

The bell badge needs a lightweight endpoint that returns `{"count": N}` without fetching all notifications.

**Files:**
- Modify: `backend/zewadi/notifications/views.py`
- Modify: `backend/zewadi/notifications/urls.py`

- [ ] **Step 1: Add UserNotificationUnreadCountView to notifications/views.py**

At the bottom of `backend/zewadi/notifications/views.py`, add:

```python
class UserNotificationUnreadCountView(APIView):
    """
    GET /api/notifications/inbox/unread-count/
    Returns {"count": N} — the number of unread notifications for the current user.
    """
    permission_classes = [IsCommunityUser]

    def get(self, request):
        count = UserNotificationReceipt.objects.filter(
            user=request.user,
            is_read=False,
            notification__status="SENT",
            notification__target_role__in=["ALL", "community_user"],
        ).count()
        return Response({"count": count}, status=status.HTTP_200_OK)
```

- [ ] **Step 2: Register the route in notifications/urls.py**

Open `backend/zewadi/notifications/urls.py`. Add the import and route. The final file should be:

```python
from django.urls import path
from .views import (
    NotificationDetailView,
    NotificationListCreateView,
    UserNotificationListView,
    UserNotificationMarkAllReadView,
    UserNotificationMarkReadView,
    UserNotificationUnreadCountView,
)

urlpatterns = [
    path("", NotificationListCreateView.as_view()),
    path("<int:pk>/", NotificationDetailView.as_view()),
    path("inbox/", UserNotificationListView.as_view()),
    path("inbox/unread-count/", UserNotificationUnreadCountView.as_view()),
    path("inbox/mark-all-read/", UserNotificationMarkAllReadView.as_view()),
    path("inbox/<int:pk>/read/", UserNotificationMarkReadView.as_view()),
]
```

- [ ] **Step 3: Verify**

```bash
cd backend/zewadi
python manage.py check
```

- [ ] **Step 4: Commit**

```bash
git add backend/zewadi/notifications/views.py backend/zewadi/notifications/urls.py
git commit -m "feat: add unread-count endpoint to notifications inbox"
```

---

### Task 2: Create notifications email service

**Files:**
- Create: `backend/zewadi/notifications/email.py`

- [ ] **Step 1: Create notifications/email.py**

Create `backend/zewadi/notifications/email.py`:

```python
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger("notifications.email")


def send_notification_email(user_email: str, subject: str, body: str) -> None:
    if not user_email:
        return
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.error("Failed to send notification email to %s: %s", user_email, exc)
```

- [ ] **Step 2: Commit**

```bash
git add backend/zewadi/notifications/email.py
git commit -m "feat: add notification email service"
```

---

### Task 3: Add status tracking to Order model and create order signals

**Files:**
- Modify: `backend/zewadi/orders/models.py`
- Create: `backend/zewadi/orders/signals.py`
- Modify: `backend/zewadi/orders/apps.py`

- [ ] **Step 1: Add __init__ to Order model for status tracking**

Open `backend/zewadi/orders/models.py`. Find the `Order` class definition. Add an `__init__` method to track the status before save. Add this method inside the `Order` class, before the `save()` method or at the top of the class body after the fields:

```python
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._status_before_save = self.status
```

- [ ] **Step 2: Create orders/signals.py**

Create `backend/zewadi/orders/signals.py`:

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.utils import send_user_notification
from notifications.email import send_notification_email

ORDER_STATUS_MESSAGES = {
    "confirmed": (
        "Order confirmed",
        "Great news! Your order {order_id} has been confirmed and is being processed.",
    ),
    "processing": (
        "Order is being prepared",
        "Your order {order_id} is now being prepared for shipment.",
    ),
    "shipped": (
        "Order shipped",
        "Your order {order_id} has been shipped and is on its way to you.",
    ),
    "delivered": (
        "Order delivered",
        "Your order {order_id} has been delivered. Enjoy your purchase!",
    ),
    "cancelled": (
        "Order cancelled",
        "Your order {order_id} has been cancelled. Contact support if you have questions.",
    ),
}


@receiver(post_save, sender="orders.Order")
def handle_order_status_change(sender, instance, created, **kwargs):
    from orders.models import Order  # local import to avoid circular

    if created:
        # New order placed notification
        send_user_notification(
            instance.user,
            "Order placed",
            f"Your order {instance.order_id} has been placed successfully.",
            "ALERT",
        )
        send_notification_email(
            instance.user.email,
            "Order placed — Zawadi",
            f"Your order {instance.order_id} has been placed successfully.\n\nThank you for shopping with Zawadi!",
        )
        return

    old_status = getattr(instance, "_status_before_save", None)
    if old_status is None or old_status == instance.status:
        return

    title, body_template = ORDER_STATUS_MESSAGES.get(instance.status, (None, None))
    if title is None:
        return

    body = body_template.format(order_id=instance.order_id)
    send_user_notification(instance.user, title, body, "ALERT")
    send_notification_email(
        instance.user.email,
        f"{title} — Zawadi",
        body,
    )
```

- [ ] **Step 3: Register signals in orders/apps.py**

Open `backend/zewadi/orders/apps.py`. If it doesn't exist, create it. The final content:

```python
from django.apps import AppConfig


class OrdersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "orders"

    def ready(self):
        import orders.signals  # noqa: F401
```

- [ ] **Step 4: Ensure orders/__init__.py sets default_app_config if needed**

Open `backend/zewadi/orders/__init__.py`. If it is empty or doesn't set `default_app_config`, add:

```python
default_app_config = "orders.apps.OrdersConfig"
```

If the file doesn't exist, create it with that single line.

- [ ] **Step 5: Run Django check**

```bash
cd backend/zewadi
python manage.py check
```

Expected: `System check identified no issues (0 silenced).`

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/orders/models.py backend/zewadi/orders/signals.py backend/zewadi/orders/apps.py backend/zewadi/orders/__init__.py
git commit -m "feat: add order status change signals with in-app and email notifications"
```

---

### Task 4: Add status tracking to ConsultationBooking and create booking signals

**Files:**
- Modify: `backend/zewadi/consultant/models.py`
- Create: `backend/zewadi/consultant/signals.py`
- Modify: `backend/zewadi/consultant/apps.py`

- [ ] **Step 1: Add __init__ to ConsultationBooking model**

Open `backend/zewadi/consultant/models.py`. Find the `ConsultationBooking` class. Add `__init__` for status tracking:

```python
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._status_before_save = self.status
```

- [ ] **Step 2: Create consultant/signals.py**

Create `backend/zewadi/consultant/signals.py`:

```python
from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.utils import send_user_notification
from notifications.email import send_notification_email

BOOKING_STATUS_MESSAGES = {
    "confirmed": (
        "Consultation confirmed",
        "Your consultation on {date} has been confirmed. We look forward to seeing you!",
    ),
    "cancelled": (
        "Consultation cancelled",
        "Your consultation scheduled for {date} has been cancelled. Contact support if you have questions.",
    ),
    "completed": (
        "Consultation completed",
        "Your consultation on {date} has been marked as completed. We hope it was helpful!",
    ),
}


@receiver(post_save, sender="consultant.ConsultationBooking")
def handle_booking_status_change(sender, instance, created, **kwargs):
    if created:
        return  # No notification on booking creation (pending state)

    old_status = getattr(instance, "_status_before_save", None)
    if old_status is None or old_status == instance.status:
        return

    title, body_template = BOOKING_STATUS_MESSAGES.get(instance.status, (None, None))
    if title is None:
        return

    date_str = instance.booked_date.strftime("%d %b %Y") if instance.booked_date else "your scheduled date"
    body = body_template.format(date=date_str)

    send_user_notification(instance.user, title, body, "REMINDER")
    send_notification_email(
        instance.user.email,
        f"{title} — Zawadi",
        body,
    )
```

- [ ] **Step 3: Register signals in consultant/apps.py**

Open or create `backend/zewadi/consultant/apps.py`:

```python
from django.apps import AppConfig


class ConsultantConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "consultant"

    def ready(self):
        import consultant.signals  # noqa: F401
```

- [ ] **Step 4: Ensure consultant/__init__.py sets default_app_config**

Open or create `backend/zewadi/consultant/__init__.py`:

```python
default_app_config = "consultant.apps.ConsultantConfig"
```

- [ ] **Step 5: Run Django check**

```bash
cd backend/zewadi
python manage.py check
```

- [ ] **Step 6: Commit**

```bash
git add backend/zewadi/consultant/models.py backend/zewadi/consultant/signals.py backend/zewadi/consultant/apps.py backend/zewadi/consultant/__init__.py
git commit -m "feat: add consultation booking status change signals with notifications"
```

---

### Task 5: Add notification bell to the frontend Navbar

**Files:**
- Modify: `frontend/src/components/communityUsers/commen/Navbar.tsx` (or equivalent community navbar)
- Create: `frontend/src/components/notifications/NotificationDropdown.tsx`

- [ ] **Step 1: Find the correct Navbar component**

```bash
grep -r "unread\|notification\|bell" frontend/src/components/ --include="*.tsx" -l
```

Also check which Navbar the community dashboard uses:
```bash
grep -r "Navbar" frontend/src/app/communityDashBoard/ --include="*.tsx" | head -5
```

Note the file path — use it in steps below.

- [ ] **Step 2: Create NotificationDropdown.tsx**

Create `frontend/src/components/notifications/NotificationDropdown.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";

interface NotificationItem {
  receipt_id: number;
  notification: {
    id: number;
    title: string;
    body: string;
  };
  is_read: boolean;
  read_at: string | null;
  created_at: string;  // from receipt
}

interface Props {
  onClose: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationDropdown({ onClose }: Props) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/notifications/inbox/?limit=10")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setItems(list.slice(0, 10));
        // Mark all as read on open
        api.post("/notifications/inbox/mark-all-read/").catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <div className="px-4 py-3 border-b font-semibold text-sm text-gray-700">Notifications</div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <p className="text-center text-sm text-gray-500 py-6">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">No notifications yet</p>
        ) : (
          items.map((item) => (
            <div
              key={item.receipt_id}
              className={`px-4 py-3 border-b last:border-0 ${item.is_read ? "bg-white" : "bg-green-50"}`}
            >
              <p className="text-sm font-medium text-gray-800">{item.notification.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.notification.body}</p>
              <p className="text-xs text-gray-400 mt-1">{timeAgo(item.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add bell icon and polling to the community Navbar**

Open the community Navbar file identified in Step 1. Add the following to the component:

At the top of the component (with existing imports), add:
```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import api from "@/services/api";
```

Inside the component function body (alongside existing state), add:
```tsx
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications/inbox/unread-count/");
      setUnreadCount(data.count ?? 0);
    } catch {
      // silently ignore — user may not be logged in
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);
```

In the JSX, find the area with user avatar or top-right icons, and add the bell button:

```tsx
  {/* Notification bell */}
  <div className="relative">
    <button
      onClick={() => {
        setShowNotifications((v) => !v);
        if (!showNotifications) setUnreadCount(0);
      }}
      className="relative p-2 rounded-full hover:bg-gray-100"
      aria-label="Notifications"
    >
      {/* Bell SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
    {showNotifications && (
      <NotificationDropdown onClose={() => setShowNotifications(false)} />
    )}
  </div>
```

- [ ] **Step 4: Run frontend lint**

```bash
cd frontend
npm run lint
```

Fix any lint errors before committing.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/notifications/ frontend/src/components/communityUsers/
git commit -m "feat: add notification bell with unread badge and dropdown panel"
```

---

## Verification

```bash
# Backend
cd backend/zewadi
python manage.py check

# Manual test:
# 1. Place an order (POST /api/orders/create/) → check inbox at GET /api/notifications/inbox/
# 2. Change order status (PATCH /api/orders/admin/<id>/status/) → inbox should have new item
# 3. GET /api/notifications/inbox/unread-count/ → should return { count: 1 }
# 4. POST /api/notifications/inbox/mark-all-read/ → then count should be 0

# Frontend
cd frontend
npm run build
npm run dev
# Log in as community user → bell icon should appear in Navbar
# After placing order, within 60 seconds bell badge should show 1
```
