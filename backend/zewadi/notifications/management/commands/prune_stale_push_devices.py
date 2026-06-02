from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from notifications.models import PushDevice


class Command(BaseCommand):
    help = "Deactivate web push devices that have not refreshed recently."

    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(days=30)
        updated = PushDevice.objects.filter(
            is_active=True,
            last_seen_at__lt=cutoff,
        ).update(is_active=False)
        self.stdout.write(self.style.SUCCESS(f"Deactivated {updated} stale push device(s)."))
