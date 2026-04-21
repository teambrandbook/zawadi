const suggestedTags = ["Healthy Living", "Weight Management", "Buckwheat Meals", "Morning Routine", "Energy Boost"];

export default function BlogTagsField() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Tags</h2>
      <input
        type="text"
        placeholder="Add tags separated by commas..."
        className="mt-4 h-12 w-full rounded-md border border-[#E5E7EB] px-4 text-sm text-[#111827] outline-none focus:border-[#06402B]"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedTags.map((tag) => (
          <span key={tag} className="rounded-full bg-[#E9DFCC] px-3 py-1 text-xs font-medium text-[#A88751]">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
