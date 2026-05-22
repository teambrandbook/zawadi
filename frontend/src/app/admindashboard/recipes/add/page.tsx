"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ImagePlus, Plus, Trash2 } from "lucide-react";
import api from "@/services/api";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

const CATEGORIES = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
  { label: "Dessert", value: "dessert" },
  { label: "Drink", value: "drink" },
  { label: "Other", value: "other" },
];
const DIFFICULTY_LEVELS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];
const INGREDIENT_UNITS = ["cups", "tbsp", "tsp", "g", "kg", "ml", "l", "piece"];

type Ingredient = { ingredient_name: string; quantity: string; unit: string };
type Step = { description: string };
type RecipeDetailResponse = {
  id: string | number;
  title?: string;
  short_description?: string;
  category?: string;
  difficulty_level?: string;
  prep_time_minutes?: number | string;
  cooking_time_minutes?: number | string;
  servings?: number | string;
  health_benefits?: string;
  optional_ingredients?: string | null;
  calories?: string | number | null;
  fat?: string | number | null;
  carbs?: string | number | null;
  protein?: string | number | null;
  video_url?: string | null;
  cover_image?: string | null;
  status?: string;
  ingredients?: Array<{ ingredient_name?: string; quantity?: string; unit?: string }>;
  steps?: Array<{ description?: string }>;
};

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#E4E7EC] bg-white p-3 sm:p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#0A4833]">{title}</h3>
      {children}
    </section>
  );
}

function InputRow({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium text-[#344054]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
      />
    </label>
  );
}

export default function AddRecipePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coverRef = useRef<HTMLInputElement>(null);
  const recipeId = searchParams.get("id");
  const isEditMode = Boolean(recipeId);
  const { upload: uploadCoverImage, isUploading: isImageUploading } = useCloudinaryUpload("recipe_cover");

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [prepTime, setPrepTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("1");
  const [healthBenefits, setHealthBenefits] = useState("");
  const [optionalIngredients, setOptionalIngredients] = useState("");
  const [calories, setCalories] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient_name: "", quantity: "", unit: "piece" },
  ]);

  // Steps
  const [steps, setSteps] = useState<Step[]>([{ description: "" }]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      setIsLoadingRecipe(true);
      try {
        const response = await api.get(`/recipes/${recipeId}/`);
        const recipe: RecipeDetailResponse = response.data?.data ?? response.data;
        setTitle(recipe.title ?? "");
        setShortDescription(recipe.short_description ?? "");
        setCategory(recipe.category ?? "");
        setDifficulty(recipe.difficulty_level ?? "easy");
        setPrepTime(recipe.prep_time_minutes ? String(recipe.prep_time_minutes) : "");
        setCookingTime(recipe.cooking_time_minutes ? String(recipe.cooking_time_minutes) : "");
        setServings(recipe.servings ? String(recipe.servings) : "1");
        setHealthBenefits(recipe.health_benefits ?? "");
        setOptionalIngredients(recipe.optional_ingredients ?? "");
        setCalories(recipe.calories ? String(recipe.calories) : "");
        setFat(recipe.fat ? String(recipe.fat) : "");
        setCarbs(recipe.carbs ? String(recipe.carbs) : "");
        setProtein(recipe.protein ? String(recipe.protein) : "");
        setVideoUrl(recipe.video_url ?? "");
        setCoverFile(null);
        setCoverPreview(recipe.cover_image ?? null);
        if (recipe.cover_image) setCoverImageUrl(recipe.cover_image);
        setIngredients(
          Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
            ? recipe.ingredients.map((ingredient) => ({
                ingredient_name: ingredient.ingredient_name ?? "",
                quantity: ingredient.quantity ?? "",
                unit: ingredient.unit ?? "piece",
              }))
            : [{ ingredient_name: "", quantity: "", unit: "piece" }]
        );
        setSteps(
          Array.isArray(recipe.steps) && recipe.steps.length > 0
            ? recipe.steps.map((step) => ({ description: step.description ?? "" }))
            : [{ description: "" }]
        );
      } catch {
        toast.error("Failed to load recipe details.");
        router.push("/admindashboard/recipes");
      } finally {
        setIsLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [recipeId, router]);

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isImageUploading) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const blobUrl = URL.createObjectURL(file);
    setCoverPreview(blobUrl);
    try {
      const url = await uploadCoverImage(file);
      setCoverImageUrl(url);
      setCoverPreview(url);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // error handled in hook
    }
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { ingredient_name: "", quantity: "", unit: "piece" }]);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { description: value } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, { description: "" }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!title.trim()) { toast.error("Recipe title is required."); return; }
    if (!category) { toast.error("Please select a category."); return; }
    if (!shortDescription.trim()) { toast.error("Short description is required."); return; }
    if (!prepTime || Number(prepTime) < 1) { toast.error("Prep time must be at least 1 minute."); return; }
    if (!cookingTime || Number(cookingTime) < 1) { toast.error("Cooking time must be at least 1 minute."); return; }
    if (!servings || Number(servings) < 1) { toast.error("Servings must be at least 1."); return; }
    if (!calories.trim() || !fat.trim() || !carbs.trim() || !protein.trim()) { toast.error("Nutrition facts are required."); return; }
    if (isImageUploading) { toast.error("Image is still uploading, please wait."); return; }
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("short_description", shortDescription.trim());
    fd.append("category", category);
    fd.append("difficulty_level", difficulty);
    if (prepTime) fd.append("prep_time_minutes", prepTime);
    if (cookingTime) fd.append("cooking_time_minutes", cookingTime);
    if (servings) fd.append("servings", servings);
    fd.append("health_benefits", healthBenefits.trim());
    fd.append("optional_ingredients", optionalIngredients.trim());
    fd.append("calories", calories.trim());
    fd.append("fat", fat.trim());
    fd.append("carbs", carbs.trim());
    fd.append("protein", protein.trim());
    fd.append("video_url", videoUrl.trim());
    if (coverImageUrl) fd.append("cover_image", coverImageUrl);

    // Ingredients & steps as JSON strings (backend can parse)
    const validIngredients = ingredients.filter((i) => i.ingredient_name.trim());
    if (validIngredients.length === 0) { toast.error("Please add at least one ingredient."); return; }
    if (validIngredients.some((i) => !i.quantity.trim())) { toast.error("Each ingredient needs a quantity."); return; }
    fd.append("ingredients", JSON.stringify(validIngredients));

    const validSteps = steps.filter((s) => s.description.trim());
    if (validSteps.length === 0) { toast.error("Please add at least one preparation step."); return; }
    fd.append("steps", JSON.stringify(validSteps.map((s, idx) => ({ step_no: idx + 1, description: s.description.trim() }))));

    setIsSubmitting(true);
    try {
      if (isEditMode && recipeId) {
        await api.patch(`/recipes/${recipeId}/`, fd);
      } else {
        await api.post("/recipes/create/", fd);
      }
      toast.success(isEditMode ? "Recipe updated successfully!" : "Recipe created successfully! ✅");
      router.push("/admindashboard/recipes");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const msg =
        (typeof data?.message === "string" && data.message) ||
        (data?.errors && typeof data.errors === "object"
          ? Object.entries(data.errors as Record<string, unknown>)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
              .join(" | ")
          : "");
      toast.error(msg || (isEditMode ? "Failed to update recipe. Please try again." : "Failed to create recipe. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold leading-tight text-[#0A4833] sm:text-[30px]">{isEditMode ? "Edit Recipe" : "Add Recipe"}</h1>
            <p className="text-[12px] text-[#6B7280]">
              {isEditMode ? "Update the selected recipe for the ZEWADI community." : "Create a new recipe for the ZEWADI community."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admindashboard/recipes"
              className="inline-flex h-9 items-center gap-1 rounded-md border border-[#D9DEE3] bg-white px-3 text-[12px] text-[#344054]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        </header>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-4">
            {isLoadingRecipe ? (
              <section className="rounded-lg border border-[#E4E7EC] bg-white p-4 text-sm text-[#6B7280]">
                Loading recipe details...
              </section>
            ) : null}
            {/* Basic Info */}
            <FormCard title="Basic Information">
              <div className="grid gap-3 sm:grid-cols-2">
                <InputRow label="Recipe Title *" value={title} onChange={setTitle} placeholder="e.g., Buckwheat Porridge" />
                <label className="block space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Category *</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Difficulty Level</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
                  >
                    {DIFFICULTY_LEVELS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </label>
                <InputRow label="Prep Time (minutes)" value={prepTime} onChange={setPrepTime} placeholder="15" type="number" />
                <InputRow label="Cooking Time (minutes)" value={cookingTime} onChange={setCookingTime} placeholder="30" type="number" />
              </div>
              <div className="mt-3">
                <label className="block space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Short Description</span>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief description of the recipe..."
                    rows={2}
                    className="w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#374151] outline-none"
                  />
                </label>
              </div>
            </FormCard>

            {/* Cover Image */}
            <FormCard title="Cover Image">
              <input type="file" ref={coverRef} accept="image/*" className="hidden" onChange={handleCoverChange} />
              <div className="grid place-items-center rounded-md border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-6 text-center">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverPreview} alt="Cover" className="mb-3 h-32 w-full rounded-md object-cover" />
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5 text-[#A1844F]" />
                    <p className="mt-2 text-[12px] font-medium text-[#344054]">Upload Cover Image</p>
                    <p className="text-[11px] text-[#98A2B3]">JPG, PNG recommended</p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  className="mt-3 rounded-md bg-[#0A4833] px-3 py-1.5 text-[11px] font-medium text-white"
                >
                  {coverPreview ? "Change Image" : "Choose File"}
                </button>
              </div>
            </FormCard>

            {/* Health Benefits */}
            <FormCard title="Health Benefits">
              <label className="block space-y-1">
                <span className="text-[11px] font-medium text-[#344054]">Health Benefits</span>
                <textarea
                  value={healthBenefits}
                  onChange={(e) => setHealthBenefits(e.target.value)}
                  placeholder="Describe the health benefits of this recipe..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#374151] outline-none"
                />
              </label>
            </FormCard>

            {/* Ingredients */}
            <FormCard title="Ingredients">
              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="grid grid-cols-[minmax(0,1fr)_72px] gap-2 sm:grid-cols-[minmax(0,1fr)_64px_80px_36px]">
                    <input
                      value={ing.ingredient_name}
                      onChange={(e) => updateIngredient(idx, "ingredient_name", e.target.value)}
                      placeholder="Ingredient"
                      className="h-9 min-w-0 flex-1 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
                    />
                    <input
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                      placeholder="Qty"
                      className="h-9 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[12px] text-[#374151] outline-none"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                      className="h-9 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[12px] text-[#374151] outline-none"
                    >
                      {INGREDIENT_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={ingredients.length === 1}
                      className="grid h-9 w-9 place-items-center justify-self-end rounded-md text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-[#D0D5DD] px-3 py-1.5 text-[11px] text-[#344054] hover:bg-[#F3F4F6]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Ingredient
              </button>
              <label className="mt-4 block space-y-1">
                <span className="text-[11px] font-medium text-[#344054]">Optional Ingredients</span>
                <textarea
                  value={optionalIngredients}
                  onChange={(e) => setOptionalIngredients(e.target.value)}
                  placeholder="Mushrooms, spinach, egg, grilled Chicken etc."
                  rows={3}
                  className="w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#374151] outline-none"
                />
              </label>
            </FormCard>

            {/* Steps */}
            <FormCard title="Preparation Steps">
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex min-w-0 items-start gap-2 sm:gap-3">
                    <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A4833] text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(idx, e.target.value)}
                      placeholder={`Step ${idx + 1} description...`}
                      rows={2}
                      className="min-w-0 flex-1 resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#374151] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      disabled={steps.length === 1}
                      className="mt-1.5 grid h-8 w-8 place-items-center rounded-md text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStep}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-[#D0D5DD] px-3 py-1.5 text-[11px] text-[#344054] hover:bg-[#F3F4F6]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Step
              </button>
            </FormCard>

            <FormCard title="Nutrition fact">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputRow label="Calories *" value={calories} onChange={setCalories} placeholder="Enter the calories..." />
                <InputRow label="Fat *" value={fat} onChange={setFat} placeholder="Enter the fat..." />
                <InputRow label="Carbs *" value={carbs} onChange={setCarbs} placeholder="Enter the carbs..." />
                <InputRow label="Protein *" value={protein} onChange={setProtein} placeholder="Enter the protein..." />
              </div>
            </FormCard>

            <FormCard title="Add Link Section">
              <InputRow
                label="Video Link"
                value={videoUrl}
                onChange={setVideoUrl}
                placeholder="YouTube/Video URL"
                type="url"
              />
            </FormCard>
          </div>

          {/* Sidebar preview */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
              <h3 className="mb-3 text-[12px] font-semibold text-[#0A4833]">Recipe Preview</h3>
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Preview" className="mb-3 h-28 w-full rounded-md object-cover" />
              ) : (
                <div className="mb-3 h-28 rounded-md border border-[#E4E7EC] bg-[#F9FAFB]" />
              )}
              <div className="space-y-1.5 text-[11px] text-[#475467]">
                <p><span className="font-semibold text-[#344054]">Title:</span> {title || "..."}</p>
                <p><span className="font-semibold text-[#344054]">Category:</span> {category || "..."}</p>
                <p><span className="font-semibold text-[#344054]">Difficulty:</span> {difficulty}</p>
                <p><span className="font-semibold text-[#344054]">Prep:</span> {prepTime ? `${prepTime} min` : "—"}</p>
                <p><span className="font-semibold text-[#344054]">Servings:</span> {servings || "—"}</p>
                <p><span className="font-semibold text-[#344054]">Ingredients:</span> {ingredients.filter((i) => i.ingredient_name).length}</p>
                <p><span className="font-semibold text-[#344054]">Steps:</span> {steps.filter((s) => s.description).length}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-[#E4E7EC] bg-white p-3">
          <Link
            href="/admindashboard/recipes"
            className="h-8 inline-flex items-center rounded-md border border-[#D0D5DD] bg-white px-3 text-[11px] text-[#344054]"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={isSubmitting || isLoadingRecipe}
            onClick={handleSubmit}
            className="h-8 rounded-md bg-[#0A4833] px-3 text-[11px] text-white disabled:opacity-50"
          >
            {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Edit" : "Create Recipe")}
          </button>
        </div>
      </div>
    </section>
  );
}
