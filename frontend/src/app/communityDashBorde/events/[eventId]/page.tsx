import EventReviewPage from "@/components/communityUsers/events/details/EventReviewPage";
import { EventReviewData } from "@/components/communityUsers/events/details/types";

const eventDetailsById: Record<string, EventReviewData> = {
  "buckwheat-nutrition-masterclass": {
    slug: "buckwheat-nutrition-masterclass",
    category: "Nutrition Workshop",
    status: "Upcoming",
    registrationLabel: "You’re Registered!",
    countdown: "Event starts in 2 days",
    title: "Buckwheat Nutrition Masterclass: Ancient Grains for Modern Health",
    summary:
      "Discover the complete nutritional benefits of buckwheat and learn how to incorporate this superfood into your daily wellness routine.",
    date: "March 15, 2024",
    time: "2:00 PM - 3:30 PM EST",
    mode: "Online Event",
    heroImage: "/events/event-1.webp",
    about: [
      "Join our comprehensive masterclass on buckwheat nutrition, where you'll discover why this ancient grain is considered one of nature's most complete foods. This interactive session will guide you through the science-backed benefits of buckwheat and practical ways to make it a cornerstone of your healthy lifestyle.",
      "Whether you're new to buckwheat or looking to deepen your understanding, this workshop will provide you with actionable insights, delicious recipes, and expert tips from our certified nutritionists.",
      "Perfect for health enthusiasts, home cooks, and anyone interested in sustainable nutrition and wellness.",
    ],
    agenda: [
      {
        title: "Introduction to Buckwheat",
        duration: "15 min",
        description: "History, varieties, and why it’s not actually wheat",
      },
      {
        title: "Nutritional Powerhouse",
        duration: "25 min",
        description: "Complete amino acid profile, minerals, and health benefits",
      },
      {
        title: "Cooking & Preparation",
        duration: "30 min",
        description: "Practical recipes, cooking methods, and meal planning",
      },
      {
        title: "Q&A Session",
        duration: "20 min",
        description: "Interactive discussion and personalized advice",
      },
    ],
    host: {
      name: "Dr. Emily Chen",
      role: "Certified Nutritionist & Wellness Expert",
      bio: "Dr. Chen is a board-certified nutritionist with over 12 years of experience in plant-based nutrition and sustainable eating. She specializes in ancient grains and their role in modern wellness, having published numerous research papers on buckwheat’s health benefits.",
      image: "/community/community-2.webp",
    },
    joinInfo: {
      title: "Online via Zoom",
      description:
        "Meeting link and access details will be sent to your registered email 1 hour before the event starts.",
      platform: "Zoom (no account required)",
      duration: "90 minutes",
      recording: "Available for 7 days after the event",
    },
    details: {
      attendees: "127 joined",
      duration: "90 minutes",
      language: "English",
      level: "Beginner Friendly",
    },
    sidebarActions: [
      { label: "Add to Calendar", variant: "primary" },
      { label: "Set Reminder", variant: "gold" },
      { label: "Share Event", variant: "outline" },
      { label: "Cancel Registration", variant: "danger" },
    ],
    communityCard: {
      title: "Join Our Community",
      description:
        "Connect with fellow buckwheat enthusiasts and continue the conversation after the event.",
      ctaLabel: "Join Discussion",
      ctaHref: "/communityDashBorde",
    },
  },
};

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function CommunityEventReviewRoute({ params }: Props) {
  const { eventId } = await params;
  const event = eventDetailsById[eventId] ?? eventDetailsById["buckwheat-nutrition-masterclass"];

  return <EventReviewPage event={event} />;
}
