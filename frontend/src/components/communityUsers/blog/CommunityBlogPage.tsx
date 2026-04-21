import BlogFilters from "./BlogFilters";
import BlogHeader from "./BlogHeader";
import BlogList from "./BlogList";
import BlogStats from "./BlogStats";
import RecentWritingActivity from "./RecentWritingActivity";
import type { BlogPost, WritingActivity } from "./blogTypes";

type Props = {
  posts: BlogPost[];
  recentActivity: WritingActivity[];
};

export type { BlogPost, WritingActivity } from "./blogTypes";

export default function CommunityBlogPage({ posts, recentActivity }: Props) {
  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <BlogHeader />
        <BlogStats />
        <BlogFilters />
        <BlogList posts={posts} />
        <RecentWritingActivity recentActivity={recentActivity} />
      </div>
    </main>
  );
}
