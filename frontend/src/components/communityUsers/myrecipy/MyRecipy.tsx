"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Search,
  Star,
  PlayCircle,
} from "lucide-react";

type ApiRecipe = {
  id: number;
  title: string;
  short_description: string;
  cover_image: string | null;
  status: string;
  is_featured?: boolean;
  prep_time_minutes: number | null;
  created_at: string;
  category?: string;
  video_url?: string | null;
};

type RecipesResponse = ApiRecipe[] | {
  data?: ApiRecipe[];
  results?: ApiRecipe[];
};

type StatItem = {
  label: string;
  value: string;
  Icon: ComponentType<{ className?: string }>;
  iconBoxClass: string;
  valueClass: string;
};

type RecipeFilter = "All Recipes" | "Approved" | "Pending" | "Rejected" | "Drafts";
type SortOrder = "newest" | "oldest";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: "Approved", cls: "bg-[#F0FDF4] text-[#16A34A]" },
  PENDING: { label: "Pending", cls: "bg-[#FEFCE8] text-[#CA8A04]" },
  DRAFT: { label: "Draft", cls: "bg-[#F3F4F6] text-[#6B7280]" },
  REJECTED: { label: "Rejected", cls: "bg-[#FEF2F2] text-[#DC2626]" },
};

const filters: RecipeFilter[] = ["All Recipes", "Approved", "Pending", "Rejected", "Drafts"];

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

function toRecipeImageUrl(value?: string | null): string {
  if (!value) return "/userdash/myrecipy/r1.webp";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/media/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    return `${apiBase.replace(/\/api\/?$/, "")}${value}`;
  }
  if (value.startsWith("/")) return value;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return `${apiBase.replace(/\/api\/?$/, "")}/${value.replace(/^\/+/, "")}`;
}

function statusKey(status: string): string {
  return status.trim().toUpperCase();
}

function getRecipeList(data: RecipesResponse): ApiRecipe[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export default function MyRecipy() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<ApiRecipe[]>([]);
  const [activeFilter, setActiveFilter] = useState<RecipeFilter>("All Recipes");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    api
      .get<RecipesResponse>("/recipes/")
      .then(({ data }) => {
        const list = getRecipeList(data);
        setRecipes(list);
      })
      .catch(() => { });
  }, []);

  const total = recipes.length;
  const approved = recipes.filter((r) => statusKey(r.status) === "PUBLISHED").length;
  const pending = recipes.filter((r) => statusKey(r.status) === "PENDING").length;
  const rejected = recipes.filter((r) => statusKey(r.status) === "REJECTED").length;

  const filteredRecipes = recipes
    .filter((recipe) => {
      const currentStatus = statusKey(recipe.status);

      if (activeFilter === "Approved") return currentStatus === "PUBLISHED";
      if (activeFilter === "Pending") return currentStatus === "PENDING";
      if (activeFilter === "Rejected") return currentStatus === "REJECTED";
      if (activeFilter === "Drafts") return currentStatus === "DRAFT";

      return true;
    })
    .filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .sort((a, b) => {
      const firstDate = new Date(a.created_at).getTime();
      const secondDate = new Date(b.created_at).getTime();

      return sortOrder === "newest" ? secondDate - firstDate : firstDate - secondDate;
    });

  const stats: StatItem[] = [
    { label: "Total Recipes", value: String(total), Icon: BookOpen, iconBoxClass: "bg-[#EBE1CF] text-[#0A4833]", valueClass: "text-[#0A4833]" },
    { label: "Approved Recipes", value: String(approved), Icon: CheckCircle2, iconBoxClass: "bg-[#F0FDF4] text-[#16A34A]", valueClass: "text-[#16A34A]" },
    { label: "Pending Approval", value: String(pending), Icon: Clock3, iconBoxClass: "bg-[#FEFCE8] text-[#CA8A04]", valueClass: "text-[#CA8A04]" },
    { label: "Needs Changes", value: String(rejected), Icon: AlertCircle, iconBoxClass: "bg-[#FEF2F2] text-[#DC2626]", valueClass: "text-[#DC2626]" },
  ];

  // const featured = recipes.find((r) => r.is_featured) ?? recipes.find((r) => statusKey(r.status) === "PUBLISHED") ?? recipes[0];

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

        {/* Featured
        {featured && (
          <div className="rounded-xl bg-gradient-to-r from-[#0A4833] to-[#047857] p-6 lg:p-8">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
              <div className="relative h-44 w-44 overflow-hidden rounded-lg">
                <Image
                  src={toRecipeImageUrl(featured.cover_image)}
                  alt={featured.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-white">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#9F8151] px-3 py-1 text-sm font-medium text-white">
                  <Star className="h-4 w-4 fill-white text-white" />
                  Most Like Recipy
                </div>
                <h2 className="text-3xl font-bold">{featured.title}</h2>
                <p className="mt-2 text-[15px] text-white/90">Your most popular recipe with 247 likes and 89 saves from the community. Keep inspiring others with your healthy creations!</p>

              </div>
            </div>
          </div>
        )} */}

        {/* Filters */}
        <div className="rounded-xl border border-[#DFDFDF] bg-white p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`rounded-md px-4 py-2 text-xs font-medium ${activeFilter === tab ? "bg-[#0A4833] text-white" : "bg-[#F3EEE3] text-[#6B7280] hover:bg-[#EEE6D6]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex h-10 items-center gap-2 rounded-md bg-[#F3EEE3] px-3 text-sm text-[#6B7280]">
                <Search className="h-4 w-4" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title..."
                  className="h-full w-full bg-transparent text-sm text-[#4B5563] outline-none placeholder:text-[#6B7280] sm:w-40"
                />
              </label>
              <button
                type="button"
                onClick={() => setSortOrder((current) => (current === "newest" ? "oldest" : "newest"))}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#F3EEE3] px-4 text-sm text-[#4B5563]"
              >
                {sortOrder === "newest" ? "Newest First" : "Oldest First"} <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recipe Cards */}
        {recipes.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No recipes yet. Add your first one!</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No recipes found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecipes.map((recipe) => {
              const currentStatus = statusKey(recipe.status);
              const badge = STATUS_BADGE[currentStatus] ?? { label: recipe.status, cls: "bg-gray-100 text-gray-600" };
              const isPublished = currentStatus === "PUBLISHED";
              return (
                <article key={recipe.id} className="flex flex-col overflow-hidden rounded-xl border border-[#DFDFDF] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                  {/* Image height stays the same */}
                  <div className="relative h-[300px] w-full">
                    <Image
                      src={toRecipeImageUrl(recipe.cover_image)}
                      alt={recipe.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {recipe.video_url ? (
                      <a
                        href={recipe.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Watch video for ${recipe.title}`}
                        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0A4833] text-white shadow-lg transition hover:bg-[#083B2A]"
                      >
                        <PlayCircle className="h-5 w-5" />
                      </a>
                    ) : null}
                  </div>

                  {/* Changed: Removed h-full to stop the forced expansion */}
                  <div className="flex flex-col flex-1 p-4 space-y-3">

                    <div className="flex items-center justify-between gap-3">
                      <InfoBadge text={recipe.category || "Recipe"} className="bg-[#EBE1CF] text-[#0A4833]" />
                      <InfoBadge text={badge.label} className={badge.cls} />
                    </div>

                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-[#0A4833]">{recipe.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#4B5563]">{recipe.short_description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs leading-none text-[#6B7280]">
                      {recipe.prep_time_minutes && (
                        <span className="inline-flex items-center gap-1">
                          {recipe.prep_time_minutes} min <Clock3 className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        {formatDate(recipe.created_at)} <Star className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    {/* mt-auto ensures these stay at the bottom of the container */}
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/communityDashBorde/myrecipy/${recipe.id}`)}
                        className="h-9 flex-1 rounded-lg bg-[#0A4833] text-sm font-semibold text-white hover:bg-[#083B2A]"
                      >
                        {isPublished ? "View Recipe" : "View Details"}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/communityDashBorde/myrecipy/add?id=${recipe.id}`)}
                        className="h-9 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]"
                      >
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
