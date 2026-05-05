from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver


BOOKING_MESSAGES = {
    "confirmed": (
        "Consultation Confirmed",
        "Your consultation has been confirmed. Check your schedule for the details.",
    ),
    "cancelled": (
        "Consultation Cancelled",
        "Your consultation has been cancelled. Please rebook if you'd like to reschedule.",
    ),
    "completed": (
        "Consultation Completed",
        "Your consultation is marked as completed. Check your diet plan for updates.",
    ),
}


@receiver(pre_save, sender="consultant.ConsultationBooking")
def _track_booking_prev_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._prev_status = sender.objects.get(pk=instance.pk).status
        except sender.DoesNotExist:
            instance._prev_status = None
    else:
        instance._prev_status = None


@receiver(post_save, sender="consultant.ConsultationBooking")
def _notify_booking_status_change(sender, instance, created, **kwargs):
    prev = getattr(instance, "_prev_status", None)
    current = instance.status

    if created:
        # Notify the client that their booking was received.
        from notifications.utils import send_user_notification
        send_user_notification(
            instance.user,
            "Booking Received",
            "Your consultation booking has been received and is pending confirmation.",
        )
        return

    if prev == current:
        return

    if current in BOOKING_MESSAGES:
        from notifications.utils import send_user_notification
        title, body = BOOKING_MESSAGES[current]
        send_user_notification(instance.user, title, body)
