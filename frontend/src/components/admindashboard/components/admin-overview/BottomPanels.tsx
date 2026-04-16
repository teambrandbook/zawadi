"use client";

import Image from "next/image";
import { CookingPot, RotateCcw } from "lucide-react";

const approvals = [
  { id: "a1", title: "Buckwheat Pancakes Recipe", author: "Maria Garcia", ago: "2 hours ago", icon: CookingPot, bg: "bg-[#FFF7ED]" },
  { id: "a2", title: "Benefits of Buckwheat Diet", author: "Dr. James Smith", ago: "4 hours ago", icon: RotateCcw, bg: "bg-[#FEFCE8]" },
  { id: "a3", title: "Gluten-Free Buckwheat Bread", author: "Lisa Thompson", ago: "6 hours ago", icon: CookingPot, bg: "bg-[#FFF7ED]" },
];

const consultations = [
  { id: "c1", name: "Dr. Alex Rodriguez", slot: "10:00 AM - Weight Management", status: "Active", image: "/recipe/recipe-2.webp" },
  { id: "c2", name: "Dr. Emily Davis", slot: "2:00 PM - Diet Planning", status: "Upcoming", image: "/recipe/recipe-3.webp" },
];

function statusBg(status: string) {
  return status === "Active" ? "text-[#15803D]" : "text-[#A88751]";
}

export default function BottomPanels() {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-xl font-semibold text-[#0A4833]">Pending Approvals</h3>
        <div className="mt-3 space-y-2">
          {approvals.map((item) => (
            <div key={item.id} className={`rounded-md border border-[#E5E7EB] p-3 ${item.bg}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-start gap-2">
                  <item.icon className="mt-0.5 h-4 w-4 text-[#A88751]" />
                  <div>
                    <p className="text-sm text-[#0A4833]">{item.title}</p>
                    <p className="text-xs text-[#6B7280]">By {item.author} - {item.ago}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded bg-[#16A34A] px-2 py-1 text-[10px] text-white">Approve</button>
                  <button className="rounded bg-[#DC2626] px-2 py-1 text-[10px] text-white">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-xl font-semibold text-[#0A4833]">Today&apos;s Consultations</h3>
        <div className="mt-3 space-y-2">
          {consultations.map((item) => (
            <div key={item.id} className="rounded-md bg-[#F4F6F8] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#D8D8D8]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A4833]">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">{item.slot}</p>
                  </div>
                </div>
                <p className={`text-xs font-medium ${statusBg(item.status)}`}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

