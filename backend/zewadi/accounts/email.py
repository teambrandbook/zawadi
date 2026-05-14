import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger("accounts.email")


def send_otp_email(user_email: str, code: str, purpose: str) -> None:
    if purpose == "EMAIL_VERIFICATION":
        subject = "Verify your Zawadi account"
        body = (
            f"Your Zawadi verification code is: {code}\n\n"
            f"This code expires in 10 minutes.\n\n"
            f"If you did not create a Zawadi account, you can ignore this email."
        )
    else:
        subject = "Your Zawadi password reset code"
        body = (
            f"Your Zawadi password reset code is: {code}\n\n"
            f"This code expires in 10 minutes.\n\n"
            f"If you did not request a password reset, you can ignore this email."
        )

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.error("Failed to send OTP email to %s: %s", user_email, exc)
