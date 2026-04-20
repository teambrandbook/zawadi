import type { AssignNutritionistPageData } from "./assignNutritionistTypes";

export const assignNutritionistMockData: AssignNutritionistPageData = {
  header: {
    breadcrumbParent: "Consultations",
    breadcrumbCurrent: "Assign Nutritionist",
    title: "Assign Nutritionist",
    subtitle:
      "Match the consultation request with the most suitable nutrition expert based on goals, expertise, and availability.",
    searchPlaceholder: "Search...",
  },
  request: {
    patientName: "Sarah Johnson",
    patientId: "#CON-2024-1847",
    patientImage: "https://i.pravatar.cc/80?img=5",
    leftDetails: [
      { label: "Health Goal", value: "Weight management & digestive health" },
      { label: "Session Type", value: "Video consultation" },
      { label: "Diet Preference", value: "Plant-based, gluten-free" },
    ],
    rightDetails: [
      { label: "Preferred Date", value: "March 25, 2024" },
      { label: "Preferred Time", value: "2:00 PM - 3:00 PM" },
      { label: "Allergies", value: "Nuts, dairy" },
      { label: "Additional Notes", value: "Looking for buckwheat-based meal plans" },
    ],
  },
  finder: {
    title: "Find Nutritionist",
    searchPlaceholder: "Search by name...",
    specializationLabel: "All Specializations",
    availabilityLabel: "All Availability",
    chips: [
      { label: "Best Match", active: true },
      { label: "Video Support" },
      { label: "High Rated" },
      { label: "Least Busy" },
    ],
  },
  recommended: {
    title: "Recommended Match",
    name: "Dr. Michael Chen",
    role: "Certified Clinical Nutritionist",
    rating: "4.9",
    reviewsText: "(127 reviews)",
    statusText: "Available",
    nextSlotText: "Next: Today 2:30 PM",
    description:
      "Specialized in plant-based nutrition with extensive experience in buckwheat-based diets and digestive wellness.",
    activeConsultationsText: "Active consultations: 8",
    ctaLabel: "Select Nutritionist",
    image: "https://i.pravatar.cc/80?img=12",
  },
  otherNutritionistsTitle: "Other Available Nutritionists",
  otherNutritionists: [
    {
      name: "Dr. Emily Rodriguez",
      role: "Registered Dietitian",
      rating: "4.8",
      availabilityText: "Next: Tomorrow 10 AM",
      actionLabel: "Select",
      image: "https://i.pravatar.cc/80?img=32",
    },
    {
      name: "Dr. James Wilson",
      role: "Sports Nutritionist",
      rating: "4.2",
      availabilityText: "Busy until Wed",
      actionLabel: "Select",
      availabilityTone: "warning",
      image: "https://i.pravatar.cc/80?img=15",
    },
  ],
  availableScheduleTitle: "Available Schedule",
  availableSchedule: [
    {
      dayLabel: "Today - March 24",
      slots: [{ text: "2:30 PM - 3:30 PM" }, { text: "4:00 PM - 5:00 PM" }],
    },
    {
      dayLabel: "Tomorrow - March 25",
      slots: [{ text: "2:00 PM - 3:00 PM", highlighted: true }, { text: "3:30 PM - 4:30 PM" }],
    },
  ],
  summary: {
    title: "Assignment Summary",
    items: [
      { label: "Selected Nutritionist", value: "Dr. Michael Chen" },
      { label: "Consultation Date", value: "March 25, 2024" },
      { label: "Time Slot", value: "2:00 PM - 3:00 PM" },
      { label: "Session Type", value: "Video Consultation" },
    ],
    notesLabel: "Admin Notes",
    notesPlaceholder: "Add internal notes or special instructions...",
    assignButtonLabel: "Assign Nutritionist",
    draftButtonLabel: "Save as Draft",
  },
  scheduleNote: {
    title: "Schedule Note",
    description: "The selected time matches user's preference. No conflicts detected.",
  },
};
