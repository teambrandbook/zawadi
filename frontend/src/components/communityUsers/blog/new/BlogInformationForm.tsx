type Props = {
  title: string;
  excerpt: string;
  category: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export default function BlogInformationForm({
  title,
  excerpt,
  category,
  onTitleChange,
  onExcerptChange,
  onCategoryChange,
}: Props) {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Blog Information</h2>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-[#06402B]">
          Blog Title
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Enter your blog title..."
            className="mt-2 h-12 w-full rounded-md border border-[#E5E7EB] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>

        <label className="block text-sm font-semibold text-[#06402B]">
          Short Excerpt
          <textarea
            value={excerpt}
            onChange={(event) => onExcerptChange(event.target.value)}
            placeholder="Write a brief summary of your blog post..."
            className="mt-2 h-24 w-full resize-none rounded-md border border-[#E5E7EB] px-4 py-3 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>

        <label className="block text-sm font-semibold text-[#06402B]">
          Category
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="mt-2 h-12 w-full rounded-md border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-[#6B7280] outline-none focus:border-[#06402B]">
            <option value="healthy_living">Healthy Living</option>
            <option value="nutrition">Nutrition</option>
            <option value="wellness">Wellness</option>
            <option value="diet_tips">Diet Tips</option>
            <option value="community">Community</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
    </section>
  );
}
