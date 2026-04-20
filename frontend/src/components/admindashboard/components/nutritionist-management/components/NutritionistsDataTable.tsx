import {
  Check,
  CircleEllipsis,
  Download,
  Eye,
  MessageCircle,
  Mic,
  Pause,
  Phone,
  SquarePen,
  Star,
  Video,
} from "lucide-react";
import type { NutritionistRow } from "../nutritionistTypes";

type NutritionistsDataTableProps = {
  rows: NutritionistRow[];
};

function channelIcon(channel: "video" | "audio" | "chat") {
  if (channel === "video") return Video;
  if (channel === "audio") return Mic;
  return MessageCircle;
}

function availabilityTone(availability: string) {
  return availability === "Available" ? "text-[#0A7A44]" : "text-[#9F8151]";
}

export default function NutritionistsDataTable({ rows }: NutritionistsDataTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
      <div className="flex flex-col gap-2 border-b border-[#E8E8E8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-[#C9C9C9]" />
          <p className="text-sm font-semibold text-[#0A4833]">{rows.length} Nutritionists</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-8 items-center gap-1 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-xs font-medium text-[#0A4833]">
            <Check size={12} />
            Activate
          </button>
          <button className="inline-flex h-8 items-center gap-1 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-xs font-medium text-[#0A4833]">
            <Pause size={12} />
            Deactivate
          </button>
          <button className="inline-flex h-8 items-center gap-1 rounded-md border border-[#D9D9D9] bg-white px-2.5 text-xs font-medium text-[#0A4833]">
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1060px] text-left">
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#E8E8E8] last:border-0">
                <td className="w-[36px] px-4 py-4 align-top">
                  <input type="checkbox" className="mt-5 h-4 w-4 rounded border-[#C9C9C9]" />
                </td>

                <td className="px-2 py-4">
                  <div className="flex items-start gap-3">
                    <img src={row.avatar} alt={row.name} className="h-12 w-12 rounded-full object-cover" />

                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-[24px] font-semibold leading-[1.1] text-[#0A4833]">{row.name}</p>
                        <p className="text-xs font-medium text-[#0A7A44]">{row.status}</p>
                        <p className={`text-xs font-medium ${availabilityTone(row.availability)}`}>{row.availability}</p>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-5 text-xs text-[#6D8B81]">
                        <span>{row.qualification}</span>
                        <span>{row.email}</span>
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} />
                          {row.phone}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-5 text-xs text-[#9F8151]">
                        {row.expertiseTags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="w-[160px] px-2 py-4 align-top">
                  <div className="text-xs text-[#6D8B81]">Sessions</div>
                  <div className="mt-1 text-2xl font-semibold leading-none text-[#0A4833]">{row.sessions}</div>

                  <div className="mt-1 text-xs text-[#6D8B81]">Rating</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-xl font-semibold leading-none text-[#9F8151]">
                    <Star size={14} className="fill-[#9F8151]" />
                    {row.rating.toFixed(1)}
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-[#0A4833]">
                    {row.supportChannels.map((channel) => {
                      const Icon = channelIcon(channel);
                      return <Icon key={`${row.id}-${channel}`} size={12} />;
                    })}
                  </div>
                </td>

                <td className="w-[140px] px-2 py-4 align-top">
                  <div className="mt-4 flex items-center gap-2">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#DFDFDF] text-[#0A4833]">
                      <Eye size={14} />
                    </button>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#DFDFDF] text-[#0A4833]">
                      <SquarePen size={14} />
                    </button>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#DFDFDF] text-[#0A4833]">
                      <CircleEllipsis size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
