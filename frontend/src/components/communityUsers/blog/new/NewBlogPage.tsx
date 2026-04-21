import BlogContentEditor from "./BlogContentEditor";
import BlogCoverImage from "./BlogCoverImage";
import BlogInformationForm from "./BlogInformationForm";
import BlogPreviewCard from "./BlogPreviewCard";
import BlogTagsField from "./BlogTagsField";
import NewBlogActions from "./NewBlogActions";
import NewBlogHeader from "./NewBlogHeader";
import PublicationStatusCard from "./PublicationStatusCard";
import ReviewProcessCard from "./ReviewProcessCard";
import WritingInspirationCard from "./WritingInspirationCard";

export default function NewBlogPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <NewBlogHeader />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <BlogCoverImage />
            <BlogInformationForm />
            <BlogContentEditor />
            <BlogTagsField />
          </div>

          <aside className="space-y-6">
            <PublicationStatusCard />
            <BlogPreviewCard />
            <WritingInspirationCard />
            <ReviewProcessCard />
          </aside>
        </div>

        <NewBlogActions />
      </div>
    </main>
  );
}
