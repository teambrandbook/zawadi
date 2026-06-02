import time
from datetime import timedelta

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = "Continuously dispatch scheduled notifications and prune stale push devices."

    def handle(self, *args, **options):
        next_prune_at = timezone.now()
        while True:
            call_command("send_scheduled_notifications")
            now = timezone.now()
            if now >= next_prune_at:
                call_command("prune_stale_push_devices")
                next_prune_at = now + timedelta(days=1)
            time.sleep(60)
