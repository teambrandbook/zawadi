import BlogCard from "./BlogCard";
import type { BlogPost } from "./blogTypes";

type Props = {
  posts: BlogPost[];
  isLoading?: boolean;
};

export default function BlogList({ posts, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[320px] animate-pulse rounded-lg border border-[#DFDFDF] bg-white">
            <div className="h-40 bg-[#F3F4F6]" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-24 rounded bg-[#F3F4F6]" />
              <div className="h-5 w-3/4 rounded bg-[#F3F4F6]" />
              <div className="h-4 w-full rounded bg-[#F3F4F6]" />
              <div className="h-4 w-2/3 rounded bg-[#F3F4F6]" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-[#DFDFDF] bg-[#F9FAFB] px-6 text-center">
        <h2 className="text-lg font-semibold text-[#06402B]">No blogs created yet</h2>
        <p className="mt-2 max-w-md text-sm text-[#6B7280]">
          Blogs you create will appear here after saving or submitting them.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </section>
  );
}
