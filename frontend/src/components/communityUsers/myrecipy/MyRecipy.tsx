"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  AlertCircle,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Heart,
  Plus,
  Search,
  Star,
} from "lucide-react";

type ApiRecipe = {
  id: number;
  title: string;
  short_description: string;
  cover_image: string | null;
  status: string;
  prep_time_minutes: number | null;
  created_at: string;
  category?: string;
};

type StatItem = {
  label: string;
  value: string;
  Icon: ComponentType<{ className?: string }>;
  iconBoxClass: string;
  valueClass: string;
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: "Approved", cls: "bg-[#F0FDF4] text-[#16A34A]" },
  PENDING:   { label: "Pending",  cls: "bg-[#FEFCE8] text-[#CA8A04]" },
  DRAFT:     { label: "Draft",    cls: "bg-[#F3F4F6] text-[#6B7280]" },
  REJECTED:  { label: "Rejected", cls: "bg-[#FEF2F2] text-[#DC2626]" },
};

const filters = ["All Recipes", "Approved", "Pending", "Rejected", "Drafts"];

function InfoBadge({ text, className }: { text: string; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {text}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function MyRecipy() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<ApiRecipe[]>([]);

  useEffect(() => {
    api
      .get<{ results?: ApiRecipe[] } | ApiRecipe[]>("/recipes/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setRecipes(list);
      })
      .catch(() => {});
  }, []);

  const total     = recipes.length;
  const approved  = recipes.filter((r) => r.status === "PUBLISHED").length;
  const pending   = recipes.filter((r) => r.status === "PENDING" || r.status === "DRAFT").length;
  const rejected  = recipes.filter((r) => r.status === "REJECTED").length;

  const stats: StatItem[] = [
    { label: "Total Recipes",    value: String(total),    Icon: BookOpen,    iconBoxClass: "bg-[#EBE1CF] text-[#0A4833]", valueClass: "text-[#0A4833]" },
    { label: "Approved Recipes", value: String(approved), Icon: CheckCircle2, iconBoxClass: "bg-[#F0FDF4] text-[#16A34A]", valueClass: "text-[#16A34A]" },
    { label: "Pending Approval", value: String(pending),  Icon: Clock3,      iconBoxClass: "bg-[#FEFCE8] text-[#CA8A04]", valueClass: "text-[#CA8A04]" },
    { label: "Needs Changes",    value: String(rejected), Icon: AlertCircle, iconBoxClass: "bg-[#FEF2F2] text-[#DC2626]", valueClass: "text-[#DC2626]" },
  ];

  const featured = recipes.find((r) => r.status === "PUBLISHED") ?? recipes[0];

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0A4833]">My Recipes</h1>
            <p className="mt-1 text-base text-[#4B5563]">
              Share your buckwheat recipes, inspire the community, and track your submissions.
            </p>
          </div>
          <button
            onClick={() => router.push("/communityDashBorde/myrecipy/add")}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0A4833] px-6 text-sm font-semibold text-white hover:bg-[#083B2A]"
          >
            <Plus className="h-4 w-4" />
            Add New Recipe
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, Icon, iconBoxClass, valueClass }) => (
            <div key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBoxClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
              </div>
              <p className="text-base font-medium text-[#4B5563]">{label}</p>
            </div>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <div className="rounded-xl bg-gradient-to-r from-[#0A4833] to-[#047857] p-6 lg:p-8">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
              <div className="relative h-44 w-44 overflow-hidden rounded-lg">
                <Image
                  src={featured.cover_image || "/userdash/myrecipy/r1.webp"}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-white">
                <InfoBadge text="Featured Recipe" className="mb-3 bg-[#9F8151] text-white" />
                <h2 className="text-3xl font-bold">{featured.title}</h2>
                <p className="mt-2 text-[15px] text-white/90">{featured.short_description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-white">
                  <span className="inline-flex items-center gap-1">— <Heart className="h-4 w-4" /></span>
                  <span className="inline-flex items-center gap-1">— <Bookmark className="h-4 w-4" /></span>
                  <span className="inline-flex items-center gap-1">— <Eye className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-xl border border-[#DFDFDF] bg-white p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((tab, index) => (
                <button
                  key={tab}
                  className={`rounded-md px-4 py-2 text-xs font-medium ${index === 0 ? "bg-[#0A4833] text-white" : "bg-[#F3EEE3] text-[#6B7280] hover:bg-[#EEE6D6]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-10 items-center gap-2 rounded-md bg-[#F3EEE3] px-3 text-sm text-[#6B7280]">
                <Search className="h-4 w-4" />
                <span>Search by title...</span>
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#F3EEE3] px-4 text-sm text-[#4B5563]">
                Newest First <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recipe Cards */}
        {recipes.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No recipes yet. Add your first one!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => {
              const badge = STATUS_BADGE[recipe.status] ?? { label: recipe.status, cls: "bg-gray-100 text-gray-600" };
              const isPublished = recipe.status === "PUBLISHED";
              return (
                <article key={recipe.id} className="flex flex-col overflow-hidden rounded-xl border border-[#DFDFDF] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                  <div className="relative h-55 w-full">
                    <Image src={recipe.cover_image || "/userdash/myrecipy/r1.webp"} alt={recipe.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col space-y-2 p-5 h-full">
                    <div className="flex items-center justify-between gap-3">
                      <InfoBadge text={recipe.category || "Recipe"} className="bg-[#EBE1CF] text-[#0A4833]" />
                      <InfoBadge text={badge.label} className={badge.cls} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-[#0A4833]">{recipe.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#4B5563]">{recipe.short_description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      {recipe.prep_time_minutes && (
                        <span className="inline-flex items-center gap-1">
                          {recipe.prep_time_minutes} min <Clock3 className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        {formatDate(recipe.created_at)} <Star className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                      <button className="h-10 flex-1 rounded-lg bg-[#0A4833] text-sm font-semibold text-white hover:bg-[#083B2A]">
                        {isPublished ? "View Recipe" : "View Details"}
                      </button>
                      <button className="h-10 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]">
                        Edit
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 pt-2">
          <button className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-[#4B5563]"><ChevronLeft className="mx-auto h-4 w-4" /></button>
          <button className="h-10 w-10 rounded-lg bg-[#0A4833] text-sm font-medium text-white">1</button>
          <button className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-[#4B5563]"><ChevronRight className="mx-auto h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}
