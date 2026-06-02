from django.core.management.base import BaseCommand
from django.utils import timezone

from notifications.models import Notification
from notifications.utils import deliver_notification


class Command(BaseCommand):
    help = "Send due scheduled notifications."

    def handle(self, *args, **options):
        due_notification_ids = Notification.objects.filter(
            status="SCHEDULED",
            scheduled_at__lte=timezone.now(),
        ).values_list("pk", flat=True)
        sent_count = 0

        for notification_id in due_notification_ids:
            sent_at = timezone.now()
            updated = Notification.objects.filter(
                pk=notification_id,
                status="SCHEDULED",
            ).update(status="SENT", sent_at=sent_at)
            if not updated:
                continue
            notification = Notification.objects.get(pk=notification_id)
            deliver_notification(notification)
            sent_count += 1

        self.stdout.write(self.style.SUCCESS(f"Sent {sent_count} scheduled notification(s)."))
