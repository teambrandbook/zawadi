"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  nutritionist: string;
  profileImage: string;
  date: string;
  type: string;
  status: string;
};

export default function ConsultationHistory({ rows }: { rows: Row[] }) {
  const router = useRouter();

  return (
    <section className="overflow-hidden rounded-[10px] border border-[#E1E4E8] bg-white">
      <div className="px-6 py-6">
        <h3 className="text-[18px] font-bold text-[#0A4833]">Consultation History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[#E9DFC9] text-[#4B5563]">
              <th className="px-8 py-3 text-center font-medium">Nutritionist</th>
              <th className="px-8 py-3 text-center font-medium">Date</th>
              <th className="px-8 py-3 text-center font-medium">Type</th>
              <th className="px-8 py-3 text-center font-medium">Status</th>
              <th className="px-8 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#E8EAEE] text-[#374151] last:border-b-0">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#D8D8D8]">
                      <Image src={row.profileImage} alt={row.nutritionist} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-[#111827]">{row.nutritionist}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-center">{row.date}</td>
                <td className="px-8 py-4 text-center">
                  <span className={`${row.type === "Video Call" ? "bg-[#07533D]" : "bg-[#A88751]"} rounded-[3px] px-2 py-1 text-[11px] font-medium text-white`}>
                    {row.type}
                  </span>
                </td>
                <td className="px-8 py-4 text-center">
                  <span className="rounded-[3px] bg-[#DCFCE7] px-2 py-1 text-[11px] text-[#15803D]">{row.status}</span>
                </td>
                <td className="px-8 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/communityDashBoard/consultation/consultationhistory?id=${row.id}`)}
                    className="text-[13px] text-[#A88751] hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-8 py-6 text-center text-sm text-[#6B7280]" colSpan={5}>
                  Consultation history will appear here.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
