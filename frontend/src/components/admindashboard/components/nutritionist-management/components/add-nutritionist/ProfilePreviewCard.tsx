import { Eye, User } from "lucide-react";

type ProfilePreviewCardProps = {
  activeExpertise: string[];
  fullName: string;
  qualification: string;
  yearsExp: string;
  consultationFee: string;
  sessionDuration: string;
  photoPreviewUrl: string;
};

function Row({ label, value, valueClassName = "text-[#111827]" }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[#6B7280]">{label}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

export default function ProfilePreviewCard({
  activeExpertise,
  fullName,
  qualification,
  yearsExp,
  consultationFee,
  sessionDuration,
  photoPreviewUrl,
}: ProfilePreviewCardProps) {
  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4 shadow-sm">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#0A4833]">
          <Eye size={16} />
          Profile Preview
        </h3>

        <div className="mt-4 text-center">
          {photoPreviewUrl ? (
            <img
              src={photoPreviewUrl}
              alt={fullName || "Profile preview"}
              className="mx-auto h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DFDFDF] text-[#9CA3AF]">
              <User size={28} />
            </div>
          )}
          <p className="mt-3 text-sm font-semibold text-[#0A4833]">{fullName || "Nutritionist Name"}</p>
          <p className="text-xs text-[#6B7280]">{qualification || "Qualification"}</p>
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <Row label="Experience:" value={`${yearsExp || "0"} years`} />
          <Row label="Session Fee:" value={`$${consultationFee || "0"}`} valueClassName="text-[#9F8151]" />
          <Row label="Duration:" value={`${sessionDuration} min`} />
          <div>
            <p className="text-[#6B7280]">Expertise:</p>
            {activeExpertise.length === 0 && <p className="mt-1 text-[#9CA3AF]">No expertise selected</p>}
            {activeExpertise.slice(0, 2).map((item) => (
              <p key={item} className="mt-1 text-[#9F8151]">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-[#DFDFDF] pt-3 text-xs">
          <Row label="Status:" value="Active" valueClassName="text-[#166534]" />
        </div>
      </article>
    </aside>
  );
}
