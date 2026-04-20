export default function CreateEventPreview() {
  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-sm font-semibold text-[#0A4833]">Event Preview</h3>
        <div className="mt-3 rounded-md border border-[#DFDFDF] bg-[#F7F7F7] p-4 text-center text-xs text-[#9CA3AF]">
          Image
        </div>
        <div className="mt-3 space-y-1 text-xs text-[#4B5563]">
          <p className="font-semibold text-[#0A4833]">Event Title</p>
          <p>1. Category: N/A</p>
          <p>2. Type: N/A</p>
          <p>3. Host: N/A</p>
          <p>4. Event Fee: N/A</p>
          <p>5. Save as Draft</p>
        </div>
      </article>
    </aside>
  );
}

