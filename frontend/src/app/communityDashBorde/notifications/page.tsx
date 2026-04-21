import NotificationsPage from "@/components/communityUsers/notifications/NotificationsPage";
import { NotificationsPageData } from "@/components/communityUsers/notifications/types";

const notificationsPageData: NotificationsPageData = {
  title: "Notifications",
  subtitle:
    "Stay updated with your orders, consultations, events, approvals, and community activity.",
  stats: [
    { label: "Total Notifications", value: "24", icon: "bell" },
    { label: "Unread", value: "8", icon: "unread", accent: "gold" },
    { label: "Order Updates", value: "5", icon: "orders" },
    { label: "Consultation Alerts", value: "3", icon: "consultation" },
    { label: "Event Reminders", value: "2", icon: "events" },
    { label: "Community Updates", value: "6", icon: "community" },
  ],
  tabs: [
    { label: "All", active: true },
    { label: "Unread" },
    { label: "Orders" },
    { label: "Consultations" },
    { label: "Events" },
    { label: "Recipes" },
    { label: "Blogs" },
    { label: "Announcements" },
  ],
  notifications: [
    {
      id: "order-shipped",
      title: "Order Shipped",
      message: "Your order #ZW-4521 has been shipped and is on its way. Expected delivery: Tomorrow",
      time: "2 hours ago",
      icon: "orders",
      tone: "gold",
      actions: [
        { label: "View Order", href: "/communityDashBorde/myorders/order-placed", variant: "primary" },
        { label: "Dismiss", variant: "secondary" },
      ],
    },
    {
      id: "event-reminder",
      title: "Event Starting Soon",
      message: "Wellness Workshop: Buckwheat Cooking starts in 1 hour. Don’t forget to join!",
      time: "3 hours ago",
      icon: "events",
      tone: "gold",
      actions: [
        { label: "Join Event", href: "/communityDashBorde/events", variant: "primary" },
        { label: "Dismiss", variant: "secondary" },
      ],
    },
    {
      id: "consultation-reminder",
      title: "Consultation Reminder",
      message: "Your consultation with Dr. Sarah Miller is scheduled for tomorrow at 10:00 AM",
      time: "5 hours ago",
      icon: "consultation",
      tone: "gold",
      actions: [
        { label: "View Details", href: "/communityDashBorde/consultation", variant: "primary" },
        { label: "Mark Read", variant: "secondary" },
      ],
    },
    {
      id: "recipe-approved",
      title: "Recipe Approved",
      message: "Your recipe “Buckwheat Pancakes with Honey” has been approved and published!",
      time: "Yesterday",
      icon: "recipes",
      actions: [{ label: "View Recipe", href: "/communityDashBorde/myrecipy", variant: "primary" }],
    },
    {
      id: "diet-uploaded",
      title: "Diet Plan Uploaded",
      message: "Your personalized diet plan has been uploaded by your nutritionist",
      time: "Yesterday",
      icon: "diet",
      tone: "gold",
      actions: [
        { label: "View Plan", href: "/communityDashBorde/diet-plan", variant: "primary" },
        { label: "Mark Read", variant: "secondary" },
      ],
    },
    {
      id: "order-confirmed",
      title: "Order Confirmed",
      message: "Order #ZW-4521 confirmed. Your buckwheat products are being prepared",
      time: "2 days ago",
      icon: "confirmed",
      actions: [{ label: "View Order", href: "/communityDashBorde/myorders/order-placed", variant: "primary" }],
    },
    {
      id: "community-announcement",
      title: "Community Announcement",
      message: "New wellness challenge starting next week: 30-Day Buckwheat Journey",
      time: "3 days ago",
      icon: "announcement",
      actions: [{ label: "Learn More", href: "/communityDashBorde/events", variant: "primary" }],
    },
    {
      id: "blog-published",
      title: "Blog Published",
      message: "Your blog post “Health Benefits of Buckwheat” is now live on the platform",
      time: "4 days ago",
      icon: "blog",
      actions: [{ label: "View Blog", href: "/communityDashBorde/new-blog", variant: "primary" }],
    },
  ],
  priorityAlerts: [
    {
      title: "Order Delivery Today",
      description: "Order #ZW-4521 arriving between 2-4 PM",
      icon: "orders",
    },
    {
      title: "Event Starting Soon",
      description: "Wellness Workshop in 1 hour",
      icon: "events",
    },
    {
      title: "Consultation Tomorrow",
      description: "Dr. Sarah Miller at 10:00 AM",
      icon: "consultation",
    },
  ],
  quickActions: [
    { label: "Mark All as Read", variant: "primary" },
    { label: "Filter Unread Only", variant: "outline" },
    { label: "Clear All Read", variant: "subtle" },
  ],
  preferences: {
    title: "Notification Preferences",
    description: "Manage how you receive notifications and stay updated",
    ctaLabel: "Manage Preferences",
    ctaHref: "/communityDashBorde/settings",
  },
  activitySummary: {
    title: "Activity Summary",
    description: "You’ve completed 12 actions this week",
    ctaLabel: "View Dashboard",
    ctaHref: "/communityDashBorde",
  },
};

export default function CommunityNotificationsRoute() {
  return <NotificationsPage data={notificationsPageData} />;
}
