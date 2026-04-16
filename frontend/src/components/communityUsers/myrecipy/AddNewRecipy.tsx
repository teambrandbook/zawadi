"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
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

export default function AddNewRecipy() {
  const router = useRouter();
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

  useEffect(() => {
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
  }, []);

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

  async function submitRecipe() {
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
    setMessage("Submitting recipe...");
    await new Promise((resolve) => setTimeout(resolve, 700));

    const submitted = {
      ...draft,
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
      imageName: imageFile?.name ?? null,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("myrecipy-last-submitted", JSON.stringify(submitted));
    localStorage.removeItem(DRAFT_KEY);
    setIsSubmitting(false);
    setMessage("Recipe submitted successfully.");
  }

  return (
    <section className="w-full bg-[#F3F4F6] px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <button
          onClick={() => router.push("/communityDashBorde/myrecipy")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4833] hover:text-[#083B2A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Recipes
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
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
              isSubmitting={isSubmitting}
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
