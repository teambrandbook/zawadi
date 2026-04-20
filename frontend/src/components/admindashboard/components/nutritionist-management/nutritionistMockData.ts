import type { NutritionistPageData } from "./nutritionistTypes";

export const nutritionistMockData: NutritionistPageData = {
  stats: [
    { id: "total", label: "Total", value: "47", subText: "Total Nutritionists", icon: "users", iconTone: "green" },
    { id: "active", label: "Active", value: "42", subText: "Active Experts", icon: "check", iconTone: "gold" },
    { id: "today", label: "Today", value: "28", subText: "Available Today", icon: "calendar", iconTone: "gold" },
    { id: "top", label: "4.9", value: "Dr. Sarah", subText: "Highest Rated Expert", icon: "star", iconTone: "teal" },
    { id: "busy", label: "Busy", value: "14", subText: "Fully Booked", icon: "clock", iconTone: "gold" },
    { id: "inactive", label: "Inactive", value: "5", subText: "Inactive Experts", icon: "pause", iconTone: "gray" },
    { id: "assigned", label: "Assigned", value: "186", subText: "Assigned Consultations", icon: "list", iconTone: "teal" },
    { id: "done", label: "Done", value: "1,247", subText: "Completed Sessions", icon: "done", iconTone: "gold" },
  ],
  rows: [
    {
      id: "dr-sarah-mitchell",
      name: "Dr. Sarah Mitchell",
      avatar: "https://i.pravatar.cc/100?img=47",
      status: "Active",
      availability: "Available",
      qualification: "PhD Nutrition Science",
      email: "sarah.mitchell@zewadi.com",
      phone: "+1 234 567 8900",
      expertiseTags: ["Weight Management", "Digestive Health"],
      sessions: 12,
      rating: 4.9,
      supportChannels: ["video", "audio", "chat"],
    },
    {
      id: "dr-james-anderson",
      name: "Dr. James Anderson",
      avatar: "https://i.pravatar.cc/100?img=12",
      status: "Active",
      availability: "Busy",
      qualification: "MSc Clinical Nutrition",
      email: "james.anderson@zewadi.com",
      phone: "+1 234 567 8901",
      expertiseTags: ["Fitness Support", "Balanced Nutrition"],
      sessions: 18,
      rating: 4.8,
      supportChannels: ["video", "audio"],
    },
  ],
};
