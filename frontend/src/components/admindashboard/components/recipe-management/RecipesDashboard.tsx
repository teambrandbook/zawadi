"use client";

import Image from "next/image";
import { Check, ChefHat, CircleAlert, Eye, Filter, Globe, Plus, Search, ShieldAlert, Sparkles, Star, Trash2, Upload, X,Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

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
  userPhoto: string;
  category: string;
  date: string;
  status: string;
  featured: boolean;
};

type RecipeDetail = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
  difficulty_level: string;
  prep_time_minutes: number | string;
  cooking_time_minutes: number | string;
  servings: number | string;
  cover_image: string;
  health_benefits: string;
  buckwheat_wellness_value: string;
  is_gluten_free: boolean;
  is_high_fiber: boolean;
  is_weight_management: boolean;
  is_energy_boosting: boolean;
  is_featured: boolean;
  show_in_community: boolean;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  author_id: number | string;
  author_name: string;
  author_email: string;
  author_photo: string;
  ingredients: Array<{ id?: string | number; ingredient_name: string; quantity: string; unit: string; note?: string | null }>;
  steps: Array<{ id?: string | number; step_no: number | string; description: string }>;
};

type DeleteTarget = {
  id: string;
  name: string;
};

function toImageUrl(value?: string | null) {
  if (!value) return "";
  return getImageUrl(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiRecipe(item: Record<string, any>, index: number): RecipeRow {
  return {
    id: String(item.id ?? `r-${index}`),
    image: toImageUrl(String(item.image ?? item.cover_image ?? "")) || "/recipe/recipe-2.webp",
    name: String(item.title ?? item.name ?? "Untitled Recipe"),
    meta: `Prep: ${item.prep_time_minutes ?? "—"} min | Serves: ${item.servings ?? "—"}`,
    user: String(item.author_name ?? item.author ?? item.submitted_by ?? item.user ?? "Unknown"),
    userPhoto: toImageUrl(String(item.author_photo ?? "")),
    category: String(item.category ?? "—"),
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : String(item.date ?? ""),
    status: String(item.status ?? "Pending"),
    featured: Boolean(item.is_featured ?? false),
  };
}

function statusBadge(status: string) {
  if (status === "pending") return "bg-[#FFF6D8] text-[#A16207]";
  if (status === "published") return "bg-[#E7F7EC] text-[#15803D]";
  if (status === "draft") return "bg-[#F3F4F6] text-[#4B5563]";
  return "bg-[#FFF6D8] text-[#A16207]";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiRecipeDetail(item: Record<string, any>): RecipeDetail {
  return {
    id: String(item.id ?? ""),
    slug: String(item.slug ?? ""),
    title: String(item.title ?? "Untitled Recipe"),
    short_description: String(item.short_description ?? ""),
    category: String(item.category ?? ""),
    difficulty_level: String(item.difficulty_level ?? ""),
    prep_time_minutes: item.prep_time_minutes ?? "",
    cooking_time_minutes: item.cooking_time_minutes ?? "",
    servings: item.servings ?? "",
    cover_image: toImageUrl(String(item.cover_image ?? "")) || "/recipe/recipe-2.webp",
    health_benefits: String(item.health_benefits ?? ""),
    buckwheat_wellness_value: String(item.buckwheat_wellness_value ?? ""),
    is_gluten_free: Boolean(item.is_gluten_free),
    is_high_fiber: Boolean(item.is_high_fiber),
    is_weight_management: Boolean(item.is_weight_management),
    is_energy_boosting: Boolean(item.is_energy_boosting),
    is_featured: Boolean(item.is_featured),
    show_in_community: Boolean(item.show_in_community),
    status: String(item.status ?? ""),
    published_at: String(item.published_at ?? ""),
    created_at: String(item.created_at ?? ""),
    updated_at: String(item.updated_at ?? ""),
    author_id: item.author_id ?? "",
    author_name: String(item.author_name ?? "Unknown"),
    author_email: String(item.author_email ?? ""),
    author_photo: toImageUrl(String(item.author_photo ?? "")),
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    steps: Array.isArray(item.steps) ? item.steps : [],
  };
}

function RecipeDetailModal({
  recipe,
  isLoading,
  onClose,
}: {
  recipe: RecipeDetail | null;
  isLoading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0A4833]">Recipe Details</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Full recipe information</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-[#D1D5DB] px-3 py-1.5 text-sm text-[#374151]">
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">
            Loading recipe details...
          </div>
        ) : recipe ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="h-[220px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.cover_image}
                  alt={recipe.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Title</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.title}</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Author</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.author_name || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Email</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.author_email || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Category</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.category || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Difficulty</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.difficulty_level || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Prep Time</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.prep_time_minutes || "—"} min</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Cooking Time</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.cooking_time_minutes || "—"} min</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Servings</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.servings || "—"}</p>
                </div>
                <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Status</p>
                  <p className="mt-1 text-sm text-[#0A4833]">{recipe.status || "—"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-4 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Short Description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[#0A4833]">{recipe.short_description || "—"}</p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Health Benefits</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[#0A4833]">{recipe.health_benefits || "—"}</p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Buckwheat Wellness Value</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[#0A4833]">{recipe.buckwheat_wellness_value || "—"}</p>
              </div>
            </div>

            <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Dietary Flags</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#475467]">Gluten Free: {recipe.is_gluten_free ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#475467]">High Fiber: {recipe.is_high_fiber ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#475467]">Weight Management: {recipe.is_weight_management ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#475467]">Energy Boosting: {recipe.is_energy_boosting ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#475467]">Featured: {recipe.is_featured ? "Yes" : "No"}</span>
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#475467]">Show in Community: {recipe.show_in_community ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Ingredients</p>
                <div className="mt-3 space-y-2">
                  {recipe.ingredients.length > 0 ? recipe.ingredients.map((ingredient, index) => (
                    <div key={ingredient.id ?? index} className="rounded-md bg-white p-3 text-sm text-[#0A4833]">
                      {ingredient.ingredient_name} - {ingredient.quantity} {ingredient.unit}{ingredient.note ? ` (${ingredient.note})` : ""}
                    </div>
                  )) : <p className="text-sm text-[#6B7280]">No ingredients</p>}
                </div>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Preparation Steps</p>
                <div className="mt-3 space-y-2">
                  {recipe.steps.length > 0 ? recipe.steps.map((step, index) => (
                    <div key={step.id ?? index} className="rounded-md bg-white p-3 text-sm text-[#0A4833]">
                      <span className="font-medium">Step {step.step_no}:</span> {step.description}
                    </div>
                  )) : <p className="text-sm text-[#6B7280]">No steps</p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            Failed to load recipe details.
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteRecipeModal({
  recipe,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  recipe: DeleteTarget | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#0A4833]">Delete Recipe</h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          Are you sure you want to delete <span className="font-medium text-[#0A4833]">{recipe.name}</span>?
        </p>
        <p className="mt-1 text-sm text-[#B42318]">This action cannot be undone.</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border border-[#D0D5DD] px-4 py-2 text-sm text-[#344054] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeRowActions({
  recipeId,
  recipeName,
  status,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
}: {
  recipeId: string;
  recipeName: string;
  status: string;
  onStatusChange: (id: string, newStatus: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (recipe: DeleteTarget) => void;
}) {
  const isPending = status === "pending" || status === "Pending";

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onView(recipeId)} className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
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
      <button type="button" onClick={() => onView(recipeId)} className="grid h-7 w-7 place-items-center rounded-md bg-[#EEF2F6] text-[#475467]">
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onEdit(recipeId)}
        className="grid h-7 w-7 place-items-center rounded-md bg-[#DFEBFF] text-[#2563EB]"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete({ id: recipeId, name: recipeName })}
        className="grid h-7 w-7 place-items-center rounded-md bg-red-100 text-red-600 hover:bg-red-200"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function RecipesDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<RecipeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [needsRevisionOnly, setNeedsRevisionOnly] = useState(false);
  const [mostEngagedOnly, setMostEngagedOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<DeleteTarget | null>(null);
  const [isDeletingRecipe, setIsDeletingRecipe] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/recipes/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
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
  const categoryOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [rows]
  );
  const filteredRows = useMemo(() => {
    const query = `${headerSearch} ${searchQuery}`.trim().toLowerCase();
    let next = rows.filter((row) => {
      const matchesQuery =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.user.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || row.status.toLowerCase() === statusFilter;
      const matchesCategory = categoryFilter === "all" || row.category.toLowerCase() === categoryFilter;
      const matchesFeatured = !featuredOnly || row.featured;
      const matchesNeedsRevision = !needsRevisionOnly || row.status.toLowerCase() === "draft" || row.status.toLowerCase() === "rejected";
      const matchesMostEngaged = !mostEngagedOnly || row.status.toLowerCase() === "published";
      return matchesQuery && matchesStatus && matchesCategory && matchesFeatured && matchesNeedsRevision && matchesMostEngaged;
    });

    if (sortBy === "oldest") {
      next = [...next].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "title") {
      next = [...next].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      next = [...next].sort((a, b) => a.category.localeCompare(b.category));
    } else {
      next = [...next].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return next;
  }, [rows, headerSearch, searchQuery, statusFilter, categoryFilter, sortBy, featuredOnly, needsRevisionOnly, mostEngagedOnly]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await api.patch(`/recipes/admin/${id}/status/`, { status: newStatus });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    } catch {
      toast.error("Failed to update recipe status. Please try again.");
    }
  }

  async function handleViewRecipe(id: string) {
    setIsDetailLoading(true);
    setSelectedRecipe(null);
    try {
      const response = await api.get(`/recipes/${id}/`);
      const payload = response.data?.data ?? response.data;
      setSelectedRecipe(mapApiRecipeDetail(payload));
    } catch {
      toast.error("Failed to load recipe details.");
    } finally {
      setIsDetailLoading(false);
    }
  }

  async function handleDeleteRecipe() {
    if (!recipeToDelete) return;

    setIsDeletingRecipe(true);
    try {
      await api.delete(`/recipes/${recipeToDelete.id}/`);
      setRows((prev) => prev.filter((row) => row.id !== recipeToDelete.id));
      toast.success("Recipe deleted successfully.");
      setRecipeToDelete(null);
    } catch {
      toast.error("Failed to delete recipe.");
    } finally {
      setIsDeletingRecipe(false);
    }
  }

  function handleEditRecipe(id: string) {
    router.push(`/admindashboard/recipes/add?id=${id}`);
  }

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <DeleteRecipeModal
        recipe={recipeToDelete}
        isDeleting={isDeletingRecipe}
        onCancel={() => {
          if (!isDeletingRecipe) setRecipeToDelete(null);
        }}
        onConfirm={handleDeleteRecipe}
      />
      {(isDetailLoading || selectedRecipe) ? (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isLoading={isDetailLoading}
          onClose={() => {
            if (!isDetailLoading) setSelectedRecipe(null);
          }}
        />
      ) : null}
      <div className="mx-auto max-w-[1180px] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold leading-tight text-[#0A4833]">Recipes</h1>
            <p className="max-w-[620px] text-sm text-[#6B7280]">Review community submissions, manage approvals, and publish curated buckwheat recipes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                value={headerSearch}
                onChange={(event) => setHeaderSearch(event.target.value)}
                placeholder="Search recipes..."
                className="h-10 w-[220px] rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 text-sm text-[#111827] outline-none"
              />
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

              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, user, category, or tag..."
                className="h-10 w-[300px] rounded-lg border border-[#E5E7EB] bg-white pl-8 pr-3 text-sm outline-none placeholder:text-[#98A2B3]"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="title">Sort: Title</option>
              <option value="category">Sort: Category</option>
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
            <button
              type="button"
              onClick={() => setFeaturedOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] ${featuredOnly ? "bg-[#E7F7EC] text-[#15803D]" : "bg-[#F2F4F7] text-[#475467]"}`}
            >
              <Filter className="h-3 w-3" />
              Featured Only
            </button>
            <button
              type="button"
              onClick={() => setNeedsRevisionOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] ${needsRevisionOnly ? "bg-[#FFF6D8] text-[#A16207]" : "bg-[#F2F4F7] text-[#475467]"}`}
            >
              <ShieldAlert className="h-3 w-3" />
              Needs Revision
            </button>
            <button
              type="button"
              onClick={() => setMostEngagedOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] ${mostEngagedOnly ? "bg-[#EAF1FE] text-[#2563EB]" : "bg-[#F2F4F7] text-[#475467]"}`}
            >
              <Sparkles className="h-3 w-3" />
              Most Engaged
            </button>
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
          {!isLoading && !fetchError && filteredRows.length === 0 && (
            <div className="p-8 text-center text-sm text-[#6B7280]">No recipe submissions found.</div>
          )}

          {!isLoading && filteredRows.length > 0 && (
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
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="border-t border-[#F2F4F7]">
                      <td className="px-3 py-3">
                        <input type="checkbox" className="h-4 w-4 rounded border-[#D0D5DD]" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.image} alt={row.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium text-[#0F172A]">{row.name}</p>
                            <p className="text-[12px] text-[#6B7280]">{row.meta}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {row.userPhoto ? (
                            <Image src={row.userPhoto} alt={row.user} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#E5E7EB] text-[11px] font-medium text-[#475467]">
                              {row.user.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <span className="text-[#475467]">{row.user}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[#8B5E2A]">{row.category}</td>
                      <td className="px-3 py-3 text-[#475467]">{row.date}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <RecipeRowActions
                          recipeId={row.id}
                          recipeName={row.name}
                          status={row.status}
                          onStatusChange={handleStatusChange}
                          onView={handleViewRecipe}
                          onEdit={handleEditRecipe}
                          onDelete={setRecipeToDelete}
                        />
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
