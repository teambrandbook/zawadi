# utils.py

from datetime import datetime, timedelta
from .models import WeeklySlot, Availability,ConsultationBooking,BlockedDate,ConsultantSettings


SLOT_DURATION = 30

def generate_weekly_slots(consultant):
    WeeklySlot.objects.filter(consultant=consultant).delete()

    availabilities = Availability.objects.filter(consultant=consultant)

    for av in availabilities:
        current = datetime.combine(datetime.today(), av.start_time)
        end = datetime.combine(datetime.today(), av.end_time)

        breaks = [(b.start_time, b.end_time) for b in av.breaks.all()]

        while current < end:
            slot_end = current + timedelta(minutes=SLOT_DURATION)

            in_break = False
            for b_start, b_end in breaks:
                b_start_dt = datetime.combine(datetime.today(), b_start)
                b_end_dt = datetime.combine(datetime.today(), b_end)

                if current < b_end_dt and slot_end > b_start_dt:
                    in_break = True
                    break

            if not in_break:
                WeeklySlot.objects.create(
                    consultant=consultant,
                    day=av.day,
                    start_time=current.time(),
                    end_time=slot_end.time()
                )

            current = slot_end

def convert_time(time_str):
    return datetime.strptime(time_str, "%I:%M %p").time()



# for find consultent


def find_available_consultant(date, start_time, exclude=None):
    """
    Returns one available consultant for given date & time
    """

    # 🔹 Convert date → weekday (0 = Monday)
    if exclude is None:
        exclude = []

    day = date.strftime("%A").lower()

    # 🔹 Get matching weekly slots
    slots = WeeklySlot.objects.filter(
        day=day,
        start_time=start_time
    )

    for slot in slots:
        consultant = slot.consultant

        # 🔹 Skip already tried consultants (for reassign)
        if consultant in exclude:
            continue

        # 🔹 Check if already booked
        is_booked = ConsultationBooking.objects.filter(
            consultant=consultant,
            booked_date=date,
            booked_slot=start_time.strftime("%I:%M %p"),
            status__in=["pending", "confirmed"]
        ).exists()

        if is_booked:
            continue

        # 🔹 Check blocked dates (leave)
        is_blocked = BlockedDate.objects.filter(
            consultant=consultant,
            from_date__lte=date,
            to_date__gte=date
        ).exists()

        if is_blocked:
            continue

        # 🔹 Check settings (accepting bookings or not)
        settings, _ = ConsultantSettings.objects.get_or_create(
            consultant=consultant
        )

        if not settings.accept_new:
            continue

        # ✅ Found available consultant
        return consultant

    # ❌ No consultant available
    return None


# to confor is slote is availble 


def is_slot_available(consultant, date, time):
    """
    Check if consultant is free at given date and time
    """

    # 🔹 Check existing booking
    exists = ConsultationBooking.objects.filter(
        consultant=consultant,
        booked_date=date,
        booked_slot=time,
        status__in=["pending", "confirmed"]  # active bookings only
    ).exists()

    return not exists