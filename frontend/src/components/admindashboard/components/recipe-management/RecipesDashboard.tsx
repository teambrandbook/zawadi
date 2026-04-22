"use client";

import Image from "next/image";
import { Check, ChefHat, CircleAlert, Eye, Filter, Globe, Plus, Search, ShieldAlert, Sparkles, Star, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";

type StatCardDef = {
  title: string;
  value: string;
  note: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  accent: string;
  iconBg: string;
};

function buildStatCards(rows: RecipeRow[]): StatCardDef[] {
  const total = rows.length;
  const pending = rows.filter((r) => r.status === "pending" || r.status === "Pending").length;
  const published = rows.filter((r) => r.status === "published").length;
  const draft = rows.filter((r) => r.status === "draft").length;
  const rejected = rows.filter((r) => r.status === "rejected").length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return [
    { title: "Total Recipes", value: String(total), note: "", icon: ChefHat, accent: "text-[#16A34A]", iconBg: "bg-[#E9F7EE]" },
    { title: "Pending Review", value: String(pending), note: "Review", icon: CircleAlert, accent: "text-[#B45309]", iconBg: "bg-[#F8F0E4]" },
    { title: "Approved Recipes", value: String(published), note: "", icon: Check, accent: "text-[#16A34A]", iconBg: "bg-[#E9F7EE]" },
    { title: "Featured Recipes", value: "—", note: "Featured", icon: Star, accent: "text-[#B45309]", iconBg: "bg-[#F8F0E4]" },
    { title: "Published Recipes", value: String(published), note: "Live", icon: Globe, accent: "text-[#2563EB]", iconBg: "bg-[#EAF1FE]" },
    { title: "Draft Recipes", value: String(draft), note: "Draft", icon: Upload, accent: "text-[#4B5563]", iconBg: "bg-[#F3F4F6]" },
    { title: "Rejected Recipes", value: String(rejected), note: "Rejected", icon: X, accent: "text-[#DC2626]", iconBg: "bg-[#FEEAEA]" },
    { title: "New Submissions", value: String(pending), note: "This Week", icon: Sparkles, accent: "text-[#7C3AED]", iconBg: "bg-[#F2ECFF]" },
  ];
}

type RecipeRow = {
  id: string;
  image: string;
  name: string;
  meta: string;
  user: string;
  category: string;
  date: string;
  status: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiRecipe(item: Record<string, any>, index: number): RecipeRow {
  return {
    id: String(item.id ?? `r-${index}`),
    image: String(item.image ?? item.cover_image ?? "/recipe/recipe-2.webp"),
    name: String(item.title ?? item.name ?? "Untitled Recipe"),
    meta: `Prep: ${item.prep_time ?? "—"} | Serves: ${item.servings ?? "—"}`,
    user: String(item.author ?? item.submitted_by ?? item.user ?? "Unknown"),
    category: String(item.category ?? "—"),
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : String(item.date ?? ""),
    status: String(item.status ?? "Pending"),
  };
}

function statusBadge(status: string) {
  if (status === "pending") return "bg-[#FFF6D8] text-[#A16207]";
  if (status === "published") return "bg-[#E7F7EC] text-[#15803D]";
  if (status === "draft") return "bg-[#F3F4F6] text-[#4B5563]";
  return "bg-[#FFF6D8] text-[#A16207]";
}

function RecipeRowActions({
  recipeId,
  status,
  onStatusChange,
}: {
  recipeId: string;
  status: string;
  onStatusChange: (id: string, newStatus: string) => void;
}) {
  const isPending = status === "pending" || status === "Pending";

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onStatusChange(recipeId, "published")}
          className="grid h-7 w-7 place-items-center rounded-md bg-[#CFF2DD] text-[#15803D]"
          title="Approve"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onStatusChange(recipeId, "draft")}
          className="grid h-7 w-7 place-items-center rounded-md bg-[#FEE2E2] text-[#DC2626]"
          title="Reject"
        >
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
  const [rows, setRows] = useState<RecipeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/recipes/admin/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setRows(raw.map(mapApiRecipe));
      } catch {
        setFetchError("Failed to load recipes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const statCards = useMemo(() => buildStatCards(rows), [rows]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await api.patch(`/recipes/admin/${id}/status/`, { status: newStatus });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    } catch {
      toast.error("Failed to update recipe status. Please try again.");
    }
  }

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

          {isLoading && (
            <div className="p-6 text-center text-sm text-[#6B7280]">Loading recipes...</div>
          )}
          {fetchError && (
            <div className="p-6 text-center text-sm text-[#B91C1C]">{fetchError}</div>
          )}
          {!isLoading && !fetchError && rows.length === 0 && (
            <div className="p-8 text-center text-sm text-[#6B7280]">No recipe submissions found.</div>
          )}

          {!isLoading && rows.length > 0 && (
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
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <RecipeRowActions recipeId={row.id} status={row.status} onStatusChange={handleStatusChange} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
