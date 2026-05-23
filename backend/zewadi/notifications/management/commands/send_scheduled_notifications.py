from django.core.management.base import BaseCommand
from django.utils import timezone

from notifications.models import Notification
from notifications.utils import deliver_notification


class Command(BaseCommand):
    help = "Send due scheduled notifications."

    def handle(self, *args, **options):
        due_notifications = Notification.objects.filter(
            status="SCHEDULED",
            scheduled_at__lte=timezone.now(),
        )
        sent_count = 0

        for notification in due_notifications:
            notification.status = "SENT"
            notification.sent_at = timezone.now()
            notification.save(update_fields=["status", "sent_at"])
            deliver_notification(notification)
            sent_count += 1

        self.stdout.write(self.style.SUCCESS(f"Sent {sent_count} scheduled notification(s)."))
