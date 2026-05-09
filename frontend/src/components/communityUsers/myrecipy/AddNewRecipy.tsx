"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import {
  ActionArea,
  AddLinkSection,
  BasicInformationSection,
  ChooseDishCountrySection,
  CoverImageSection,
  HealthWellnessSection,
  IngredientsSection,
  PreparationStepsSection,
  RecipePreviewSection,
  RecipeTagsSection,
  ReviewProcessSection,
  type DraftModel,
  type ReviewChecklist,
} from "./addnew/AddNewRecipySections";

const DRAFT_KEY = "myrecipy-add-draft-v2";

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
  health_benefits?: string | null;
  buckwheat_wellness_value?: string | null;
  is_gluten_free?: boolean;
  is_high_fiber?: boolean;
  is_weight_management?: boolean;
  is_energy_boosting?: boolean;
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
    ingredients: [""],
    steps: [""],
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    wellnessNotes: "",
    nutritionNotes: "",
    dietFriendlyTags: [],
    tags: [],
    videoUrl: "",
    sourceUrl: "",
    country: "India",
  };
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
  const [draft, setDraft] = useState<DraftModel>(emptyDraft);
  const [tagInput, setTagInput] = useState("");
  const [checklist, setChecklist] = useState<ReviewChecklist>({
    isOriginal: false,
    hasExactMeasurements: false,
    hasClearSteps: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  useEffect(() => {
    if (isEditMode) return;

    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { draft: DraftModel; checklist: ReviewChecklist; tagInput: string };
      setDraft({
        ...emptyDraft(),
        ...parsed.draft,
        ingredients: parsed.draft?.ingredients?.length ? parsed.draft.ingredients : [""],
        steps: parsed.draft?.steps?.length ? parsed.draft.steps : [""],
      });
      if (parsed.checklist) setChecklist(parsed.checklist);
      setTagInput(parsed.tagInput ?? "");
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

        const dietFriendlyTags = [
          recipe.is_gluten_free ? "Gluten-Free" : null,
          recipe.is_high_fiber ? "High Fiber" : null,
          recipe.is_weight_management ? "Weight Management" : null,
          recipe.is_energy_boosting ? "Energy Boosting" : null,
        ].filter(Boolean) as string[];

        setDraft({
          ...emptyDraft(),
          title: recipe.title ?? "",
          description: recipe.short_description ?? "",
          category: toSelectLabel(recipe.category, "Breakfast"),
          prepTime: recipe.prep_time_minutes ? String(recipe.prep_time_minutes) : "",
          cookTime: recipe.cooking_time_minutes ? String(recipe.cooking_time_minutes) : "",
          servings: recipe.servings ? String(recipe.servings) : "",
          difficulty: toSelectLabel(recipe.difficulty_level, "Easy"),
          wellnessNotes: recipe.health_benefits ?? "",
          nutritionNotes: recipe.buckwheat_wellness_value ?? "",
          dietFriendlyTags,
          ingredients: recipe.ingredients?.length
            ? recipe.ingredients.map((ingredient) => ingredient.ingredient_name ?? "").filter(Boolean)
            : [""],
          steps: recipe.steps?.length
            ? recipe.steps.map((step) => step.description ?? "").filter(Boolean)
            : [""],
        });
        setImageFile(null);
        setImagePreview(toRecipeImageUrl(recipe.cover_image));
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
    () => draft.ingredients.map((item) => item.trim()).filter(Boolean),
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
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const preview = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(preview);
    setMessage("Image selected.");
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
    setImagePreview(null);
    setMessage("Image removed.");
  }

  function updateIngredient(index: number, value: string) {
    setDraft((prev) => {
      const next = [...prev.ingredients];
      next[index] = value;
      return { ...prev, ingredients: next };
    });
  }

  function addIngredient() {
    setDraft((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
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

  function addTag() {
    const normalized = tagInput.trim().replace(/\s+/g, "-");
    if (!normalized) return;
    if (draft.tags.includes(normalized)) {
      setMessage("Tag already added.");
      return;
    }
    setDraft((prev) => ({ ...prev, tags: [...prev.tags, normalized] }));
    setTagInput("");
    setMessage("Tag added.");
  }

  function removeTag(tag: string) {
    setDraft((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
    setMessage("Tag removed.");
  }

  function toggleChecklist(field: keyof ReviewChecklist) {
    setChecklist((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function saveDraft() {
    if (isEditMode) {
      void saveRecipe("draft");
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ draft, checklist, tagInput }));
    setMessage("Draft saved.");
  }

  function resetForm() {
    setDraft(emptyDraft());
    setTagInput("");
    setChecklist({
      isOriginal: false,
      hasExactMeasurements: false,
      hasClearSteps: false,
    });
    removeImage();
    setMessage("Form cleared.");
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
    formData.append("health_benefits", draft.wellnessNotes.trim());
    formData.append("buckwheat_wellness_value", draft.nutritionNotes.trim());
    formData.append("is_gluten_free", String(draft.dietFriendlyTags.includes("Gluten-Free")));
    formData.append("is_high_fiber", String(draft.dietFriendlyTags.includes("High Fiber")));
    formData.append("is_weight_management", String(draft.dietFriendlyTags.includes("Weight Management")));
    formData.append("is_energy_boosting", String(draft.dietFriendlyTags.includes("Energy Boosting")));
    formData.append("status", status);
    if (imageFile) formData.append("cover_image", imageFile);
    formData.append(
      "ingredients",
      JSON.stringify(
        cleanedIngredients.map((ingredient) => ({
          ingredient_name: ingredient,
          quantity: "1",
          unit: "piece",
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
    if (cleanedSteps.length === 0) {
      setMessage("Please add at least one preparation step.");
      return;
    }
    setIsSubmitting(true);
    setMessage(status === "pending" ? "Submitting recipe for approval..." : "Saving recipe as draft...");
    const formData = buildRecipeFormData(status);

    try {
      if (isEditMode && recipeId) {
        await api.patch(`/recipes/${recipeId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/recipes/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      localStorage.removeItem(DRAFT_KEY);
      setMessage(status === "pending" ? "Recipe submitted for approval." : "Recipe saved as draft.");
      router.push("/communityDashBorde/myrecipy");
    } catch (error: unknown) {
      const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail = Object.entries(data ?? {})
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
            <HealthWellnessSection draft={draft} updateField={updateField} />
            <RecipeTagsSection
              tags={draft.tags}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
            <AddLinkSection draft={draft} updateField={updateField} />
            <ReviewProcessSection checklist={checklist} onToggle={toggleChecklist} />
            <ActionArea
              message={message}
              isSubmitting={isSubmitting || isLoadingRecipe}
              isEditMode={isEditMode}
              onSaveDraft={saveDraft}
              onSubmit={submitRecipe}
              onCancel={() => router.push("/communityDashBorde/myrecipy")}
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
