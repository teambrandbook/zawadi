import { Bold, Italic, List, ListOrdered, Quote } from "lucide-react";

export default function BlogContentEditor() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#06402B]">Blog Content</h2>
        <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#6B7280]">Est. 5 min read</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-md border border-[#E5E7EB]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-[#4B5563]">
          <button className="rounded p-2 hover:bg-white" aria-label="Bold">
            <Bold className="h-4 w-4" />
          </button>
          <button className="rounded p-2 hover:bg-white" aria-label="Italic">
            <Italic className="h-4 w-4" />
          </button>
          <button className="rounded p-2 hover:bg-white" aria-label="Bulleted list">
            <List className="h-4 w-4" />
          </button>
          <button className="rounded p-2 hover:bg-white" aria-label="Numbered list">
            <ListOrdered className="h-4 w-4" />
          </button>
          <button className="rounded p-2 hover:bg-white" aria-label="Quote">
            <Quote className="h-4 w-4" />
          </button>
        </div>
        <textarea
          placeholder="Start writing your story here... Share your wellness journey, buckwheat discoveries, or lifestyle transformations with our community."
          className="h-72 w-full resize-none px-4 py-4 text-sm leading-6 text-[#111827] outline-none"
        />
      </div>
    </section>
  );
}
