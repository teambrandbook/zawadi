"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import {
  ActionArea,
  AddLinkSection,
  BasicInformationSection,
  ChooseDishCountrySection,
  CoverImageSection,
  IngredientsSection,
  NutritionFactsSection,
  PreparationStepsSection,
  RecipePreviewSection,
  ReviewProcessSection,
  type DraftModel,
  type IngredientDraft,
  type ReviewChecklist,
} from "./addnew/AddNewRecipySections";

const DRAFT_KEY = "myrecipy-add-draft-v2";
const EMPTY_INGREDIENT: IngredientDraft = { ingredient_name: "", quantity: "", unit: "piece" };

type RecipeDetailResponse = {
  id: number | string;
  title?: string;
  short_description?: string;
  category?: string;
  difficulty_level?: string;
  prep_time_minutes?: number | string | null;
  cooking_time_minutes?: number | string | null;
  servings?: number | string | null;
  cover_image?: string | null;
  calories?: string | number | null;
  fat?: string | number | null;
  carbs?: string | number | null;
  protein?: string | number | null;
  video_url?: string | null;
  ingredients?: Array<{ ingredient_name?: string; quantity?: string; unit?: string }>;
  steps?: Array<{ description?: string }>;
};

function emptyDraft(): DraftModel {
  return {
    title: "",
    description: "",
    category: "Breakfast",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Easy",
    ingredients: [{ ...EMPTY_INGREDIENT }],
    steps: [""],
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    videoUrl: "",
    sourceUrl: "",
    country: "India",
  };
}

function normalizeIngredients(value: unknown): IngredientDraft[] {
  if (!Array.isArray(value)) return [{ ...EMPTY_INGREDIENT }];

  const ingredients = value
    .map((item) => {
      if (typeof item === "string") {
        return { ...EMPTY_INGREDIENT, ingredient_name: item };
      }
      if (item && typeof item === "object") {
        const ingredient = item as Partial<IngredientDraft>;
        return {
          ingredient_name: ingredient.ingredient_name ?? "",
          quantity: ingredient.quantity ?? "",
          unit: ingredient.unit ?? "piece",
        };
      }
      return { ...EMPTY_INGREDIENT };
    })
    .filter((item) => item.ingredient_name.trim() || item.quantity.trim());

  return ingredients.length ? ingredients : [{ ...EMPTY_INGREDIENT }];
}

function toSelectLabel(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  return value
    .replace(/_/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function toRecipeImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/media/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    return `${apiBase.replace(/\/api\/?$/, "")}${value}`;
  }
  if (value.startsWith("/")) return value;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return `${apiBase.replace(/\/api\/?$/, "")}/${value.replace(/^\/+/, "")}`;
}

export default function AddNewRecipy() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");
  const isEditMode = Boolean(recipeId);
  const { upload: uploadCoverImage, isUploading: isImageUploading } = useCloudinaryUpload("recipe_cover");
  const [draft, setDraft] = useState<DraftModel>(emptyDraft);
  const [checklist, setChecklist] = useState<ReviewChecklist>({
    isOriginal: false,
    hasExactMeasurements: false,
    hasClearSteps: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  useEffect(() => {
    if (isEditMode) return;

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { draft: DraftModel; checklist: ReviewChecklist };
      setDraft({
        ...emptyDraft(),
        ...parsed.draft,
        ingredients: normalizeIngredients(parsed.draft?.ingredients),
        steps: parsed.draft?.steps?.length ? parsed.draft.steps : [""],
      });
      if (parsed.checklist) setChecklist(parsed.checklist);
      setMessage("Draft loaded.");
    } catch {
      setMessage("Could not load draft.");
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!recipeId) return;

    let isMounted = true;

    async function loadRecipe() {
      setIsLoadingRecipe(true);
      setMessage("Loading recipe...");
      try {
        const response = await api.get(`/recipes/${recipeId}/`);
        const recipe: RecipeDetailResponse = response.data?.data ?? response.data;
        if (!isMounted) return;

        setDraft({
          ...emptyDraft(),
          title: recipe.title ?? "",
          description: recipe.short_description ?? "",
          category: toSelectLabel(recipe.category, "Breakfast"),
          prepTime: recipe.prep_time_minutes ? String(recipe.prep_time_minutes) : "",
          cookTime: recipe.cooking_time_minutes ? String(recipe.cooking_time_minutes) : "",
          servings: recipe.servings ? String(recipe.servings) : "",
          difficulty: toSelectLabel(recipe.difficulty_level, "Easy"),
          calories: recipe.calories ? String(recipe.calories) : "",
          fat: recipe.fat ? String(recipe.fat) : "",
          carbs: recipe.carbs ? String(recipe.carbs) : "",
          protein: recipe.protein ? String(recipe.protein) : "",
          videoUrl: recipe.video_url ?? "",
          ingredients: recipe.ingredients?.length
            ? recipe.ingredients.map((ingredient) => ({
                ingredient_name: ingredient.ingredient_name ?? "",
                quantity: ingredient.quantity ?? "",
                unit: ingredient.unit ?? "piece",
              }))
            : [{ ...EMPTY_INGREDIENT }],
          steps: recipe.steps?.length
            ? recipe.steps.map((step) => step.description ?? "").filter(Boolean)
            : [""],
        });
        setImageFile(null);
        const existingImageUrl = toRecipeImageUrl(recipe.cover_image);
        setImagePreview(existingImageUrl);
        if (existingImageUrl) setCoverImageUrl(existingImageUrl);
        setMessage("");
      } catch {
        if (isMounted) {
          setMessage("Failed to load recipe details.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecipe(false);
        }
      }
    }

    void loadRecipe();
    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const cleanedIngredients = useMemo(
    () =>
      draft.ingredients
        .map((item) => ({
          ingredient_name: item.ingredient_name.trim(),
          quantity: item.quantity.trim(),
          unit: item.unit.trim() || "piece",
        }))
        .filter((item) => item.ingredient_name),
    [draft.ingredients]
  );

  const cleanedSteps = useMemo(
    () => draft.steps.map((item) => item.trim()).filter(Boolean),
    [draft.steps]
  );

  function updateField<K extends keyof DraftModel>(field: K, value: DraftModel[K]) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function setImageFromFile(file: File) {
    if (isImageUploading) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const preview = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(preview);
    setMessage("Image selected.");
    uploadCoverImage(file)
      .then((url) => setCoverImageUrl(url))
      .catch(() => { /* error handled in hook */ });
  }

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFromFile(file);
    event.target.value = "";
  }

  function onDropImage(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please drop an image file.");
      return;
    }
    setImageFromFile(file);
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setCoverImageUrl("");
    setImagePreview(null);
    setMessage("Image removed.");
  }

  function updateIngredient(index: number, field: keyof IngredientDraft, value: string) {
    setDraft((prev) => {
      const next = [...prev.ingredients];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, ingredients: next };
    });
  }

  function addIngredient() {
    setDraft((prev) => ({ ...prev, ingredients: [...prev.ingredients, { ...EMPTY_INGREDIENT }] }));
    setMessage("Ingredient row added.");
  }

  function removeIngredient(index: number) {
    setDraft((prev) => {
      if (prev.ingredients.length === 1) return prev;
      return { ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) };
    });
    setMessage("Ingredient removed.");
  }

  function updateStep(index: number, value: string) {
    setDraft((prev) => {
      const next = [...prev.steps];
      next[index] = value;
      return { ...prev, steps: next };
    });
  }

  function addStep() {
    setDraft((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
    setMessage("Step row added.");
  }

  function removeStep(index: number) {
    setDraft((prev) => {
      if (prev.steps.length === 1) return prev;
      return { ...prev, steps: prev.steps.filter((_, i) => i !== index) };
    });
    setMessage("Step removed.");
  }

  function toggleChecklist(field: keyof ReviewChecklist) {
    setChecklist((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function saveDraft() {
    if (isEditMode) {
      void saveRecipe("draft");
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft, checklist }));
    setMessage("Draft saved.");
  }

  function buildRecipeFormData(status: "pending" | "draft") {
    const formData = new FormData();
    formData.append("title", draft.title.trim());
    formData.append("short_description", draft.description.trim());
    formData.append("category", draft.category.toLowerCase().replace(/\s+/g, "_"));
    formData.append("difficulty_level", draft.difficulty.toLowerCase());
    formData.append("prep_time_minutes", String(parseInt(draft.prepTime, 10) || 1));
    formData.append("cooking_time_minutes", String(parseInt(draft.cookTime, 10) || 1));
    formData.append("servings", String(parseInt(draft.servings, 10) || 1));
    formData.append("calories", draft.calories.trim());
    formData.append("fat", draft.fat.trim());
    formData.append("carbs", draft.carbs.trim());
    formData.append("protein", draft.protein.trim());
    formData.append("video_url", draft.videoUrl.trim());
    formData.append("status", status);
    if (coverImageUrl) formData.append("cover_image", coverImageUrl);
    formData.append(
      "ingredients",
      JSON.stringify(
        cleanedIngredients.map((ingredient) => ({
          ingredient_name: ingredient.ingredient_name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }))
      )
    );
    formData.append(
      "steps",
      JSON.stringify(cleanedSteps.map((description, index) => ({ step_no: index + 1, description })))
    );
    return formData;
  }

  async function saveRecipe(status: "pending" | "draft") {
    if (!draft.title.trim()) {
      setMessage("Recipe title is required.");
      return;
    }
    if (!draft.description.trim()) {
      setMessage("Description is required.");
      return;
    }
    if (cleanedIngredients.length === 0) {
      setMessage("Please add at least one ingredient.");
      return;
    }
    if (cleanedIngredients.some((ingredient) => !ingredient.quantity)) {
      setMessage("Each ingredient needs a quantity.");
      return;
    }
    if (cleanedSteps.length === 0) {
      setMessage("Please add at least one preparation step.");
      return;
    }
    if (!draft.calories.trim() || !draft.fat.trim() || !draft.carbs.trim() || !draft.protein.trim()) {
      setMessage("Nutrition facts are required.");
      return;
    }
    if (isImageUploading) { toast.error("Image is still uploading, please wait."); return; }
    setIsSubmitting(true);
    setMessage(status === "pending" ? "Submitting recipe for approval..." : "Saving recipe as draft...");
    const formData = buildRecipeFormData(status);

    try {
      if (isEditMode && recipeId) {
        await api.patch(`/recipes/${recipeId}/`, formData);
      } else {
        await api.post("/recipes/create/", formData);
      }
      localStorage.removeItem(DRAFT_KEY);
      setMessage(status === "pending" ? "Recipe submitted for approval." : "Recipe saved as draft.");
      router.push("/communityDashBoard/myrecipy");
    } catch (error: unknown) {
      const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const errors =
        data?.errors && typeof data.errors === "object"
          ? (data.errors as Record<string, unknown>)
          : data ?? {};
      const detail = Object.entries(errors)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
        .join(" | ");
      setMessage(detail || "Recipe submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function submitRecipe() {
    void saveRecipe("pending");
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1280px] space-y-6">
        

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {isLoadingRecipe && (
              <div className="rounded-xl border border-[#DFDFDF] bg-white p-5 text-sm text-[#6B7280]">
                Loading recipe details...
              </div>
            )}
            <CoverImageSection
              imagePreview={imagePreview}
              imageFileName={imageFile?.name ?? null}
              onImageChange={onImageChange}
              onDropImage={onDropImage}
              onRemoveImage={removeImage}
            />
            <BasicInformationSection draft={draft} updateField={updateField} />
            <IngredientsSection
              ingredients={draft.ingredients}
              onAdd={addIngredient}
              onUpdate={updateIngredient}
              onRemove={removeIngredient}
            />
            <PreparationStepsSection steps={draft.steps} onAdd={addStep} onUpdate={updateStep} onRemove={removeStep} />
            <NutritionFactsSection draft={draft} updateField={updateField} />
            <AddLinkSection draft={draft} updateField={updateField} />
            <ReviewProcessSection checklist={checklist} onToggle={toggleChecklist} />
            <ActionArea
              message={message}
              isSubmitting={isSubmitting || isLoadingRecipe}
              isEditMode={isEditMode}
              onSaveDraft={saveDraft}
              onSubmit={submitRecipe}
              onCancel={() => router.push("/communityDashBoard/myrecipy")}
            />
          </div>

          <div className="space-y-6">
            <RecipePreviewSection
              draft={draft}
              ingredientsCount={cleanedIngredients.length}
              stepsCount={cleanedSteps.length}
              imagePreview={imagePreview}
            />
            <ChooseDishCountrySection country={draft.country} onChangeCountry={(value) => updateField("country", value)} />
          </div>
        </div>
      </div>
    </section>
  );
}
