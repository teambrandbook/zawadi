import Image from "next/image";
import { Eye, MessageCircle } from "lucide-react";
import BlogActions from "./BlogActions";
import { blogStatusClassNames, blogStatusLabels } from "./blogStatusMeta";
import type { BlogPost } from "./blogTypes";

type Props = {
  post: BlogPost;
};

export default function BlogCard({ post }: Props) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#DFDFDF] bg-white">
      <div className="relative h-40">
        <Image src={post.image} alt={post.title} fill unoptimized sizes="360px" className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className={`font-semibold ${blogStatusClassNames[post.status]}`}>{blogStatusLabels[post.status]}</span>
          <span className="text-[#6B7280]">{post.date}</span>
        </div>
        <h3 className="mt-4 text-base font-bold text-[#06402B]">{post.title}</h3>
        <p className="mt-2 min-h-10 text-xs leading-5 text-[#4B5563]">{post.excerpt}</p>

        {post.status === "continue_writing" && (
          <p className="mt-4 text-xs font-semibold text-[#A88751]">Continue writing...</p>
        )}
        {post.status === "waiting_review" && (
          <p className="mt-4 text-xs font-semibold text-[#2563EB]">Waiting for admin review</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.comments}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BlogActions status={post.status} />
          </div>
        </div>
      </div>
    </article>
  );
}
