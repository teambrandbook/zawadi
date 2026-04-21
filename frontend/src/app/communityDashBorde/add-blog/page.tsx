import CommunityBlogPage, {
  type BlogPost,
  type WritingActivity,
} from "@/components/communityUsers/blog/CommunityBlogPage";

const posts: BlogPost[] = [
  {
    id: "post-1",
    title: "My 30-Day Buckwheat Journey",
    excerpt: "Sharing my incredible transformation after incorporating buckwheat into my daily routine. The energy boost was amazing...",
    image: "/home/section4-1.webp",
    status: "completed",
    date: "Nov 15, 2024",
    views: 245,
    comments: 18,
  },
  {
    id: "post-2",
    title: "Perfect Buckwheat Pancakes Recipe",
    excerpt: "A foolproof recipe for fluffy, nutritious buckwheat pancakes that will change your breakfast game forever...",
    image: "/home/section2-1.webp",
    status: "continue_writing",
    date: "Nov 12, 2024",
    views: 0,
    comments: 0,
  },
  {
    id: "post-3",
    title: "Working with ZEWADI Nutritionists",
    excerpt: "My experience getting personalized nutrition advice and how it transformed my relationship with food...",
    image: "/community/community-3.webp",
    status: "completed",
    date: "Nov 8, 2024",
    views: 189,
    comments: 24,
  },
  {
    id: "post-4",
    title: "Understanding Buckwheat Origins",
    excerpt: "A deep dive into the history and nutritional science behind this amazing superfood that changed my life...",
    image: "/home/section5-2.webp",
    status: "waiting_review",
    date: "Nov 10, 2024",
    views: 0,
    comments: 0,
  },
];

const recentActivity: WritingActivity[] = [
  {
    id: "activity-1",
    title: "Perfect Buckwheat Pancakes Recipe",
    note: "Draft saved - 2 hours ago",
    status: "continue_writing",
  },
  {
    id: "activity-2",
    title: "My 30-Day Buckwheat Journey",
    note: "Received 3 new hearts - 4 hours ago",
    status: "completed",
  },
  {
    id: "activity-3",
    title: "Understanding Buckwheat Origins",
    note: "Submitted for review - 1 day ago",
    status: "waiting_review",
  },
];

export default function CommunityBlogRoute() {
  return <CommunityBlogPage posts={posts} recentActivity={recentActivity} />;
}
