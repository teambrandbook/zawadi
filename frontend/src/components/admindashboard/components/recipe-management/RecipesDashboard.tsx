"use client";

import Image from "next/image";
import { Check, ChefHat, CircleAlert, Eye, Filter, Globe, Plus, Search, ShieldAlert, Sparkles, Star, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ USE THIS
const statCards = [
  { title: "Total Recipes", value: "1,247", note: "+12%", icon: ChefHat, accent: "text-[#16A34A]", iconBg: "bg-[#E9F7EE]" },
  { title: "Pending Review", value: "48", note: "Review", icon: CircleAlert, accent: "text-[#B45309]", iconBg: "bg-[#F8F0E4]" },
  { title: "Approved Recipes", value: "1,173", note: "94%", icon: Check, accent: "text-[#16A34A]", iconBg: "bg-[#E9F7EE]" },
  { title: "Featured Recipes", value: "24", note: "Featured", icon: Star, accent: "text-[#B45309]", iconBg: "bg-[#F8F0E4]" },
  { title: "Published Recipes", value: "1,089", note: "Live", icon: Globe, accent: "text-[#2563EB]", iconBg: "bg-[#EAF1FE]" },
  { title: "Draft Recipes", value: "26", note: "Draft", icon: Upload, accent: "text-[#4B5563]", iconBg: "bg-[#F3F4F6]" },
  { title: "Rejected Recipes", value: "74", note: "Rejected", icon: X, accent: "text-[#DC2626]", iconBg: "bg-[#FEEAEA]" },
  { title: "New Submissions", value: "32", note: "This Week", icon: Sparkles, accent: "text-[#7C3AED]", iconBg: "bg-[#F2ECFF]" },
];

const rows = [
  {
    id: "r1",
    image: "/recipe/recipe-2.webp",
    name: "Buckwheat Pancakes with Berries",
    meta: "Prep: 15 min | Serves: 4",
    user: "Sarah Mitchell",
    category: "Breakfast",
    date: "Dec 18, 2024",
    status: "Pending",
  },
  {
    id: "r2",
    image: "/recipe/recipe-3.webp",
    name: "Buckwheat Power Bowl",
    meta: "Prep: 20 min | Serves: 2",
    user: "James Anderson",
    category: "Lunch",
    date: "Dec 17, 2024",
    status: "Approved",
  },
  {
    id: "r3",
    image: "/recipe/recipe-4.webp",
    name: "Buckwheat Chocolate Delight",
    meta: "Prep: 30 min | Serves: 6",
    user: "James Anderson",
    category: "Lunch",
    date: "Dec 17, 2024",
    status: "Approved",
  },
];

function statusBadge(status: string) {
  if (status === "Pending") return "bg-[#FFF6D8] text-[#A16207]";
  return "bg-[#E7F7EC] text-[#15803D]";
}

function RecipeRowActions({ status }: { status: string }) {
  if (status === "Pending") {
    return (
      <div className="flex items-center gap-2">
        <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#CFF2DD] text-[#15803D]">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#FEE2E2] text-[#DC2626]">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#DFEBFF] text-[#2563EB]">
        <Globe className="h-3.5 w-3.5" />
      </button>
      <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#F4ECD9] text-[#9A7A3A]">
        <Star className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function RecipesDashboard() {
  const router = useRouter();
  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold leading-tight text-[#0A4833]">Recipes</h1>
            <p className="max-w-[620px] text-sm text-[#6B7280]">Review community submissions, manage approvals, and publish curated buckwheat recipes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input placeholder="Search recipes..." className="h-10 w-[220px] rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 text-sm text-[#111827] outline-none" />
            </label>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#0A4833]">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#0A4833]">
              <Upload className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <div className="mb-3 flex items-start justify-between">
                  <span className={`grid h-9 w-9 place-items-center rounded-md ${card.iconBg}`}>
                    <Icon className={`h-4 w-4 ${card.accent}`} />
                  </span>
                  <span className={`text-[11px] font-medium ${card.accent}`}>{card.note}</span>
                </div>
                <p className="text-[30px] font-semibold leading-none text-[#0A4833]">{card.value}</p>
                <p className="mt-2 text-[13px] text-[#6B7280]">{card.title}</p>
              </article>
            );
          })}
        </div>

        <section className="rounded-xl border border-[#E5E7EB] bg-white p-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#98A2B3]" />
              <input placeholder="Search by title, user, category, or tag..." className="h-10 w-[300px] rounded-lg border border-[#E5E7EB] bg-white pl-8 pr-3 text-sm outline-none" />
            </label>
            <select className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none">
              <option>All Status</option>
            </select>
            <select className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none">
              <option>All Categories</option>
            </select>
            <select className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none">
              <option>Sort: Newest</option>
            </select>
            <button
              type="button"
              onClick={() => router.push("/admindashboard/recipes/add")}
              className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-[#0A4833] px-4 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add Recipe
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#F2F4F7] px-2.5 py-1 text-[11px] text-[#475467]">
              <Filter className="h-3 w-3" />
              Featured Only
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#F2F4F7] px-2.5 py-1 text-[11px] text-[#475467]">
              <ShieldAlert className="h-3 w-3" />
              Needs Revision
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#F2F4F7] px-2.5 py-1 text-[11px] text-[#475467]">
              <Sparkles className="h-3 w-3" />
              Most Engaged
            </span>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] p-3">
            <h2 className="text-[18px] font-semibold text-[#0A4833]">Recipe Submissions</h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="inline-flex items-center gap-1 rounded-md bg-[#E7F7EC] px-3 py-1.5 text-[12px] text-[#15803D]">
                <Check className="h-3.5 w-3.5" />
                Approve Selected
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-md bg-[#FEEAEA] px-3 py-1.5 text-[12px] text-[#DC2626]">
                <X className="h-3.5 w-3.5" />
                Reject Selected
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-md bg-[#FFF6D8] px-3 py-1.5 text-[12px] text-[#A16207]">
                <CircleAlert className="h-3.5 w-3.5" />
                Request Changes
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-md bg-[#E7F7EC] px-3 py-1.5 text-[12px] text-[#15803D]">
                <Check className="h-3.5 w-3.5" />
                Bulk Approve
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-md bg-[#F3F4F6] px-3 py-1.5 text-[12px] text-[#475467]">
                <Upload className="h-3.5 w-3.5" />
                Bulk Archive
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F9FAFB] text-[12px] text-[#475467]">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#D0D5DD]" />
                  </th>
                  <th className="px-3 py-3">Recipe</th>
                  <th className="px-3 py-3">Submitted By</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[#F2F4F7]">
                    <td className="px-3 py-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#D0D5DD]" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Image src={row.image} alt={row.name} width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-[#0F172A]">{row.name}</p>
                          <p className="text-[12px] text-[#6B7280]">{row.meta}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#475467]">{row.user}</td>
                    <td className="px-3 py-3 text-[#8B5E2A]">{row.category}</td>
                    <td className="px-3 py-3 text-[#475467]">{row.date}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <RecipeRowActions status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
