"use client";

import Image from "next/image";
import { ChangeEvent, ReactNode } from "react";
import { ImagePlus, Info, Plus, Trash2, Upload } from "lucide-react";

type IngredientDraft = {
  ingredient_name: string;
  quantity: string;
  unit: string;
};

type DraftModel = {
  title: string;
  description: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  healthBenefits: string;
  ingredients: IngredientDraft[];
  optionalIngredients: string;
  steps: string[];
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  videoUrl: string;
  country: string;
};

type ReviewChecklist = {
  isOriginal: boolean;
  hasExactMeasurements: boolean;
  hasClearSteps: boolean;
};

const inputClass =
  "h-11 w-full rounded-lg border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833] placeholder:text-[#9CA3AF] outline-none focus:border-[#0A4833]";
const textareaClass =
  "w-full rounded-lg border border-[#DFDFDF] bg-white p-3 text-sm text-[#0A4833] placeholder:text-[#9CA3AF] outline-none focus:border-[#0A4833]";
const ingredientUnits = ["cups", "tbsp", "tsp", "g", "kg", "ml", "l", "piece"];

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#DFDFDF] bg-white p-5 lg:p-6">
      <h2 className="text-xl font-semibold text-[#0A4833]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function CoverImageSection({
  imagePreview,
  imageFileName,
  onImageChange,
  onDropImage,
  onRemoveImage,
}: {
  imagePreview: string | null;
  imageFileName: string | null;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDropImage: (event: React.DragEvent<HTMLLabelElement>) => void;
  onRemoveImage: () => void;
}) {
  return (
    <SectionCard title="Recipe Cover Image">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropImage}
        className="block cursor-pointer rounded-lg border-2 border-dashed border-[#D5C7AE] bg-[#F9F4EA] p-5 text-center"
      >
        <Upload className="mx-auto h-7 w-7 text-[#9F8151]" />
        <p className="mt-2 text-sm font-medium text-[#0A4833]">Drag and drop image here</p>
        <p className="text-xs text-[#6B7280]">or click to browse</p>
        <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
      </label>

      {imagePreview && (
        <div className="mt-4">
          <div className="relative h-52 w-full overflow-hidden rounded-lg border border-[#DFDFDF]">
            <Image src={imagePreview} alt={imageFileName ?? "Recipe cover"} fill unoptimized className="object-cover" />
          </div>
          <div className="mt-2 flex gap-2">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#E3D7C2]">
              <ImagePlus className="h-4 w-4" />
              Replace Image
              <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            </label>
            <button
              type="button"
              onClick={onRemoveImage}
              className="h-10 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#9B1C1C] hover:bg-[#FEF2F2]"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

export function BasicInformationSection({
  draft,
  updateField,
}: {
  draft: DraftModel;
  updateField: <K extends keyof DraftModel>(field: K, value: DraftModel[K]) => void;
}) {
  return (
    <SectionCard title="Basic Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Recipe Title</label>
          <input
            value={draft.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Enter recipe title"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Description</label>
          <textarea
            rows={4}
            value={draft.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe the recipe and flavor profile"
            className={textareaClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Category</label>
          <select
            value={draft.category}
            onChange={(e) => updateField("category", e.target.value)}
            className={inputClass}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
            <option>Dessert</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Servings</label>
          <input
            value={draft.servings}
            onChange={(e) => updateField("servings", e.target.value)}
            placeholder="e.g. 4"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Prep Time</label>
          <input
            value={draft.prepTime}
            onChange={(e) => updateField("prepTime", e.target.value)}
            placeholder="e.g. 15 min"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Cook Time</label>
          <input
            value={draft.cookTime}
            onChange={(e) => updateField("cookTime", e.target.value)}
            placeholder="e.g. 25 min"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Difficulty</label>
          <select
            value={draft.difficulty}
            onChange={(e) => updateField("difficulty", e.target.value)}
            className={inputClass}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>
    </SectionCard>
  );
}

export function IngredientsSection({
  ingredients,
  optionalIngredients,
  onAdd,
  onUpdate,
  onRemove,
  onOptionalIngredientsChange,
}: {
  ingredients: IngredientDraft[];
  optionalIngredients: string;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof IngredientDraft, value: string) => void;
  onRemove: (index: number) => void;
  onOptionalIngredientsChange: (value: string) => void;
}) {
  return (
    <SectionCard title="Ingredients">
      <div className="mb-3">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#E3D7C2]"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </button>
      </div>
      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div key={`ingredient-${index}`} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_110px_120px_44px]">
              <input
                value={ingredient.ingredient_name}
                onChange={(e) => onUpdate(index, "ingredient_name", e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className={inputClass}
              />
              <input
                value={ingredient.quantity}
                onChange={(e) => onUpdate(index, "quantity", e.target.value)}
                placeholder="Qty"
                className={inputClass}
              />
              <select
                value={ingredient.unit}
                onChange={(e) => onUpdate(index, "unit", e.target.value)}
                className={inputClass}
              >
                {ingredientUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#DFDFDF] text-[#9B1C1C] hover:bg-[#FEF2F2]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-[#0A4833]">Optional Ingredients</span>
        <textarea
          rows={3}
          value={optionalIngredients}
          onChange={(e) => onOptionalIngredientsChange(e.target.value)}
          placeholder="Mushrooms, spinach, egg, grilled Chicken etc."
          className={textareaClass}
        />
      </label>
    </SectionCard>
  );
}

export function HealthBenefitsSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SectionCard title="Health Benefits">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#0A4833]">Health Benefits</span>
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the health benefits of this recipe..."
          className={textareaClass}
        />
      </label>
    </SectionCard>
  );
}

export function PreparationStepsSection({
  steps,
  onAdd,
  onUpdate,
  onRemove,
}: {
  steps: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <SectionCard title="Preparation Steps">
      <div className="mb-3">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#E3D7C2]"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </button>
      </div>
      <div className="space-y-3">
        {steps.map((value, index) => (
          <div key={`step-${index}`} className="flex gap-2">
              <textarea
                rows={3}
                value={value}
                onChange={(e) => onUpdate(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className={`${textareaClass} flex-1`}
              />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#DFDFDF] text-[#9B1C1C] hover:bg-[#FEF2F2]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function NutritionFactsSection({
  draft,
  updateField,
}: {
  draft: DraftModel;
  updateField: <K extends keyof DraftModel>(field: K, value: DraftModel[K]) => void;
}) {
  return (
    <SectionCard title="Nutrition fact">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Calories *</label>
          <input
            value={draft.calories}
            onChange={(e) => updateField("calories", e.target.value)}
            placeholder="Enter the calories..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Fat *</label>
          <input
            value={draft.fat}
            onChange={(e) => updateField("fat", e.target.value)}
            placeholder="Enter the fat..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Carbs *</label>
          <input
            value={draft.carbs}
            onChange={(e) => updateField("carbs", e.target.value)}
            placeholder="Enter the carbs..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0A4833]">Protein *</label>
          <input
            value={draft.protein}
            onChange={(e) => updateField("protein", e.target.value)}
            placeholder="Enter the protein..."
            className={inputClass}
          />
        </div>
      </div>
    </SectionCard>
  );
}

export function AddLinkSection({
  draft,
  updateField,
}: {
  draft: DraftModel;
  updateField: <K extends keyof DraftModel>(field: K, value: DraftModel[K]) => void;
}) {
  return (
    <SectionCard title="Add Link Section">
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-[#0A4833]">Video Link</label>
          <input
            value={draft.videoUrl}
            onChange={(e) => updateField("videoUrl", e.target.value)}
            placeholder="YouTube/Video URL"
            className={inputClass}
          />
        </div>
      </div>
    </SectionCard>
  );
}

export function ReviewProcessSection({
  checklist: _checklist,
  onToggle: _onToggle,
}: {
  checklist: ReviewChecklist;
  onToggle: (field: keyof ReviewChecklist) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#D1C7B6] bg-[#F6F4EE] p-4 lg:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E5DFD2] text-[#9F8151]">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#0A4833]">Review Process</h3>
          <p className="mt-1 text-sm leading-6 text-[#4B5563]">
            Your recipe will be reviewed by the admin team before it is published to the community.
            This usually takes 24-48 hours. You&apos;ll receive a notification once your recipe is approved.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ActionArea({
  message,
  isSubmitting,
  isEditMode,
  onSaveDraft,
  onSubmit,
  onCancel,
}: {
  message: string;
  isSubmitting: boolean;
  isEditMode?: boolean;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#DFDFDF] bg-white p-5 lg:p-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-xl bg-[#0A5A3F] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#084A34] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : isEditMode ? "Set for Approval" : "Submit for Approval"}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-xl bg-[#A88751] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#8E7346]"
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </button>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg bg-[#E5E7EB] px-6 text-sm font-medium text-[#374151] hover:bg-[#DDE1E7]"
        >
          Cancel
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-[#6B7280]">{message}</p>}
    </div>
  );
}

export function RecipePreviewSection({ draft, ingredientsCount, stepsCount, imagePreview }: { draft: DraftModel; ingredientsCount: number; stepsCount: number; imagePreview: string | null }) {
  return (
    <SectionCard title="Recipe Preview">
      <div className="space-y-4 text-sm">
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#E2D8C7] bg-[#E7DECD]">
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9CA3AF]">
              <ImagePlus className="h-7 w-7" />
              <span className="text-xs">Cover image preview</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-[#6B7280]">Title</p>
          <p className="mt-1 text-2xl font-semibold leading-tight text-[#0A4833]">
            {draft.title.trim() || "Recipe title will appear here"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#ECE7DC] p-3">
            <p className="text-xs text-[#6B7280]">Category</p>
            <p className="mt-1 font-medium text-[#0A4833]">{draft.category || "Not selected"}</p>
          </div>
          <div className="rounded-lg bg-[#ECE7DC] p-3">
            <p className="text-xs text-[#6B7280]">Prep Time</p>
            <p className="mt-1 font-medium text-[#0A4833]">{draft.prepTime || "—"}</p>
          </div>
          <div className="col-span-2 rounded-lg bg-[#ECE7DC] p-3">
            <p className="text-xs text-[#6B7280]">Servings</p>
            <p className="mt-1 font-medium text-[#0A4833]">{draft.servings || "—"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-[#6B7280]">Status</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E2C17D] px-3 py-1 text-xs font-medium text-[#6E4F1D]">
            <span className="h-2 w-2 rounded-full bg-[#A77724]" />
            Draft
          </span>
        </div>

        <div className="rounded-lg bg-[#EEF1F3] p-3">
          <p className="text-sm font-semibold text-[#0A4833]">Quick Tip</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Add high-quality images and detailed steps to increase approval chances.
          </p>
        </div>

        <div className="rounded-lg bg-[#F9FAFB] p-3 text-xs text-[#6B7280]">
          {ingredientsCount} ingredients, {stepsCount} preparation steps
        </div>
      </div>
    </SectionCard>
  );
}

export function ChooseDishCountrySection({
  country,
  onChangeCountry,
}: {
  country: string;
  onChangeCountry: (value: string) => void;
}) {
  return (
    <SectionCard title="Choose Your Dish Country">
      <select
        value={country}
        onChange={(e) => onChangeCountry(e.target.value)}
        className={inputClass}
      >
        <option>India</option>
        <option>Italy</option>
        <option>Japan</option>
        <option>Mexico</option>
        <option>Thailand</option>
        <option>United States</option>
      </select>
      <p className="mt-2 text-xs text-[#6B7280]">This helps users discover recipes by cuisine and region.</p>
    </SectionCard>
  );
}

export type { DraftModel, IngredientDraft, ReviewChecklist };
