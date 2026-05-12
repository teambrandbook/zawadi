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
