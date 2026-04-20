export default function CreateNotificationLivePreview() {
  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <article className="space-y-3 rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-sm font-semibold text-[#0A4833]">Live Preview</h3>

        <div>
          <p className="mb-1 text-[11px] text-[#6B7280]">In-App Notification</p>
          <div className="rounded-md border border-[#DFDFDF] bg-[#F8F8F8] p-3 text-xs">
            <p className="font-semibold text-[#0A4833]">New Buckwheat Recipe</p>
            <p className="mt-1 text-[#6B7280]">Taste our newest buckwheat recipes with amazing nutrients.</p>
            <button type="button" className="mt-2 rounded bg-[#0A4833] px-2 py-1 text-[10px] text-white">
              View Details
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[11px] text-[#6B7280]">Email Preview</p>
          <div className="rounded-md border border-[#DFDFDF] p-3 text-xs">
            <div className="rounded bg-[#0A4833] px-2 py-1 text-white">ZEWADI</div>
            <p className="mt-2 font-semibold text-[#0A4833]">New Buckwheat Recipe Collection</p>
            <p className="mt-1 text-[#6B7280]">Short and attractive notification snippet shown in inbox preview.</p>
            <button type="button" className="mt-2 rounded bg-[#9F8151] px-2 py-1 text-[10px] text-white">
              View Details
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[11px] text-[#6B7280]">Delivery Summary</p>
          <div className="rounded-md border border-[#DFDFDF] p-3 text-[11px] text-[#4B5563]">
            <p>Recipients: 2,847 users</p>
            <p>Channels: In-App</p>
            <p>Priority: Medium</p>
            <p>Delivery: Immediate</p>
          </div>
        </div>
      </article>
    </aside>
  );
}

