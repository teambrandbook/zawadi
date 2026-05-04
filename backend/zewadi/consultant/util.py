# utils.py

from datetime import datetime, timedelta
from .models import WeeklySlot, Availability,ConsultationBooking,BlockedDate,ConsultantSettings
from .models import Client



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


def is_slot_available(consultant, date, time_str):
    """
    Full slot validation. Returns (True, None) on success or (False, error_message) on failure.
    time_str must be in "%I:%M %p" format, e.g. "10:00 AM".
    """
    from datetime import date as date_cls

    # 1. Consultant accepting new bookings?
    settings, _ = ConsultantSettings.objects.get_or_create(consultant=consultant)
    if not settings.accept_new:
        return False, "This consultant is not accepting new bookings."

    # 2. Same-day booking policy
    if not settings.allow_same_day and date == date_cls.today():
        return False, "This consultant does not accept same-day bookings."

    # 3. Consultant on leave / blocked date?
    if BlockedDate.objects.filter(
        consultant=consultant,
        from_date__lte=date,
        to_date__gte=date
    ).exists():
        return False, "The consultant is unavailable on this date."

    # 4. Does this slot actually exist in the consultant's schedule?
    day = date.strftime("%A").lower()
    time_obj = convert_time(time_str)
    if not WeeklySlot.objects.filter(
        consultant=consultant,
        day=day,
        start_time=time_obj
    ).exists():
        return False, "No available slot for this consultant at the requested time."

    # 5. Already booked by someone else?
    if ConsultationBooking.objects.filter(
        consultant=consultant,
        booked_date=date,
        booked_slot=time_str,
        status__in=["pending", "confirmed"]
    ).exists():
        return False, "This time slot is already booked."

    return True, None



def create_or_update_client_from_booking(booking):
    client, created = Client.objects.get_or_create(
        consultant=booking.consultant,
        user=booking.user,
        defaults={
            "primary_goal": booking.primary_goal,
            "primary_wellness_goal": booking.primary_wellness_goal,
            "focuses_area": booking.focuses_area,
            "diet_preferences": booking.diet_preferences,
            "lifestyle_activity_level": booking.lifestyle_activity_level,
            "buckwheat_journey_goal": booking.buckwheat_journey_goal,
            "message": booking.message,
            "language": booking.language,
            "booking": booking,
            "is_active": True
        }
    )

    # 🔥 IF ALREADY EXISTS → UPDATE
    if not created:
        client.primary_goal = booking.primary_goal
        client.primary_wellness_goal = booking.primary_wellness_goal
        client.focuses_area = booking.focuses_area
        client.diet_preferences = booking.diet_preferences
        client.lifestyle_activity_level = booking.lifestyle_activity_level
        client.buckwheat_journey_goal = booking.buckwheat_journey_goal
        client.message = booking.message
        client.language = booking.language
        client.booking = booking
        client.is_active = True

        client.save()

    return client
