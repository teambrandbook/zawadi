"use client";

import Image from "next/image";

type Row = {
  id: string;
  nutritionist: string;
  profileImage: string;
  date: string;
  type: string;
  status: string;
};

export default function ConsultationHistory({ rows }: { rows: Row[] }) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-lg font-semibold text-[#0A4833]">Consultation History</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[#E9E1D2] text-[#6B7280]">
              <th className="px-3 py-2 font-medium">Nutritionist</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#F0F0F0] text-[#374151]">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#D8D8D8]">
                      <Image src={row.profileImage} alt={row.nutritionist} fill className="object-cover" />
                    </div>
                    <span>{row.nutritionist}</span>
                  </div>
                </td>
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2">
                  <span className="rounded bg-[#DCFCE7] px-2 py-0.5 text-[10px] text-[#15803D]">{row.status}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button className="text-[#A88751] hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
