export type AvailabilitySummaryItem = {
  label: string;
  value: string;
  accent: string;
};

export type WeeklyAvailabilityItem = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakTime: string;
};

export type TimeSlotChip = {
  label: string;
  tone: string;
};

export type BookingControlItem = {
  title: string;
  description: string;
  enabled: boolean;
};

export const availabilitySummary: AvailabilitySummaryItem[] = [
  { label: "Status", value: "Available", accent: "text-[#17914F]" },
  { label: "Working Days", value: "5 days/week", accent: "text-[#8A6A33]" },
  { label: "Available Slots", value: "24 this week", accent: "text-[#0A4833]" },
  { label: "Session Duration", value: "45 minutes", accent: "text-[#8A6A33]" },
];

export const weeklyAvailability: WeeklyAvailabilityItem[] = [
  { day: "Monday", enabled: true, startTime: "08:00", endTime: "17:00", breakTime: "Break 12:00 - 13:30" },
  { day: "Tuesday", enabled: true, startTime: "09:00", endTime: "17:00", breakTime: "Break 12:00 - 13:30" },
  { day: "Wednesday", enabled: true, startTime: "09:00", endTime: "17:00", breakTime: "Break 12:00 - 13:00" },
  { day: "Thursday", enabled: true, startTime: "09:00", endTime: "17:00", breakTime: "Break 12:00 - 13:00" },
  { day: "Friday", enabled: true, startTime: "08:00", endTime: "14:00", breakTime: "Break 12:00 - 12:30" },
  { day: "Saturday", enabled: false, startTime: "", endTime: "", breakTime: "Not available" },
  { day: "Sunday", enabled: false, startTime: "", endTime: "", breakTime: "Not available" },
];

export const timeSlotChips: TimeSlotChip[] = [
  { label: "09:00 AM", tone: "bg-[#0A4833] text-white" },
  { label: "10:00 AM", tone: "bg-[#0A4833] text-white" },
  { label: "11:00 AM", tone: "bg-[#0A4833] text-white" },
  { label: "01:00 PM", tone: "bg-[#A38355] text-white" },
  { label: "02:00 PM", tone: "bg-[#0A4833] text-white" },
  { label: "03:00 PM", tone: "bg-[#0A4833] text-white" },
  { label: "04:00 PM", tone: "bg-[#0A4833] text-white" },
  { label: "05:00 PM", tone: "bg-[#A38355] text-white" },
];

export const bookingControls: BookingControlItem[] = [
  {
    title: "Accept New Consultations",
    description: "Allow new clients to book consultations",
    enabled: true,
  },
  {
    title: "Allow Same-Day Bookings",
    description: "Clients can book consultations for today",
    enabled: false,
  },
  {
    title: "Show Profile on Booking Page",
    description: "Display your profile publicly for bookings",
    enabled: true,
  },
  {
    title: "Auto-Close Fully Booked Days",
    description: "Hide days with no available slots",
    enabled: true,
  },
  {
    title: "Follow-Up Priority Slots",
    description: "Reserve slots for existing client follow-ups",
    enabled: true,
  },
];
