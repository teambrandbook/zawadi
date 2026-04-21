import BlogCard from "./BlogCard";
import type { BlogPost } from "./blogTypes";

type Props = {
  posts: BlogPost[];
};

export default function BlogList({ posts }: Props) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </section>
  );
}
