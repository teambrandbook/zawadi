import BlogFilters from "./BlogFilters";
import BlogHeader from "./BlogHeader";
import BlogList from "./BlogList";
import BlogStats from "./BlogStats";
import RecentWritingActivity from "./RecentWritingActivity";
import type { BlogPost, WritingActivity } from "./blogTypes";

type Props = {
  posts: BlogPost[];
  recentActivity: WritingActivity[];
  isLoading?: boolean;
  statusMessage?: string;
};

export type { BlogPost, BlogStatus, WritingActivity } from "./blogTypes";

export default function CommunityBlogPage({ posts, recentActivity, isLoading = false, statusMessage = "" }: Props) {
  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <BlogHeader />
        <BlogStats posts={posts} />
        <BlogFilters />
        {statusMessage ? (
          <div className="rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
            {statusMessage}
          </div>
        ) : null}
        <BlogList posts={posts} isLoading={isLoading} />
        {recentActivity.length > 0 ? <RecentWritingActivity recentActivity={recentActivity} /> : null}
      </div>
    </main>
  );
}
