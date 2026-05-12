from django.core.management.base import BaseCommand
from django.utils import timezone
from consultant.models import ConsultationBooking


class Command(BaseCommand):
    help = "Mark CONFIRMED bookings with a past booked_date as COMPLETED."

    def handle(self, *args, **options):
        now = timezone.now()

        updated = ConsultationBooking.objects.filter(
            status="confirmed",
            booked_date__lt=now.date(),
        ).update(status="completed")

        self.stdout.write(
            self.style.SUCCESS(f"Marked {updated} booking(s) as COMPLETED.")
        )
