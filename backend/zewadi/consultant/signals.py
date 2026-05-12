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
