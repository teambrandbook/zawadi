"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ImagePlus, Plus, Trash2 } from "lucide-react";
import api from "@/services/api";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Smoothies", "Salads", "Soups"];
const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD", "EXPERT"];

type Ingredient = { ingredient_name: string; quantity: string; unit: string };
type Step = { description: string };

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#E4E7EC] bg-white p-4">
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-[#374151]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-10 rounded-full transition-colors ${checked ? "bg-[#0A4833]" : "bg-[#D1D5DB]"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded accent-[#0A4833]"
      />
      <span className="text-sm text-[#374151]">{label}</span>
    </label>
  );
}

export default function AddRecipePage() {
  const router = useRouter();
  const coverRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [prepTime, setPrepTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [healthBenefits, setHealthBenefits] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Flags
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isHighFiber, setIsHighFiber] = useState(false);
  const [isWeightManagement, setIsWeightManagement] = useState(false);
  const [isEnergyBoosting, setIsEnergyBoosting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient_name: "", quantity: "", unit: "" },
  ]);

  // Steps
  const [steps, setSteps] = useState<Step[]>([{ description: "" }]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { ingredient_name: "", quantity: "", unit: "" }]);
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

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("short_description", shortDescription.trim());
    fd.append("category", category);
    fd.append("difficulty_level", difficulty);
    if (prepTime) fd.append("prep_time", prepTime);
    if (cookingTime) fd.append("cooking_time", cookingTime);
    if (servings) fd.append("servings", servings);
    fd.append("health_benefits", healthBenefits.trim());
    fd.append("is_gluten_free", String(isGlutenFree));
    fd.append("is_high_fiber", String(isHighFiber));
    fd.append("is_weight_management", String(isWeightManagement));
    fd.append("is_energy_boosting", String(isEnergyBoosting));
    fd.append("is_featured", String(isFeatured));
    if (coverFile) fd.append("cover_image", coverFile);

    // Ingredients & steps as JSON strings (backend can parse)
    const validIngredients = ingredients.filter((i) => i.ingredient_name.trim());
    fd.append("ingredients", JSON.stringify(validIngredients.map((ing, idx) => ({ ...ing, order: idx + 1 }))));

    const validSteps = steps.filter((s) => s.description.trim());
    fd.append("steps", JSON.stringify(validSteps.map((s, idx) => ({ step_no: idx + 1, description: s.description.trim() }))));

    setIsSubmitting(true);
    try {
      await api.post("/recipes/create/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Recipe created successfully! ✅");
      router.push("/admindashboard/recipes");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg ?? "Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight text-[#0A4833]">Add Recipe</h1>
            <p className="text-[12px] text-[#6B7280]">Create a new recipe for the ZEWADI community.</p>
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
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
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-[11px] font-medium text-[#344054]">Difficulty Level</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#374151] outline-none"
                  >
                    {DIFFICULTY_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <InputRow label="Prep Time (minutes)" value={prepTime} onChange={setPrepTime} placeholder="15" type="number" />
                <InputRow label="Cooking Time (minutes)" value={cookingTime} onChange={setCookingTime} placeholder="30" type="number" />
                <InputRow label="Servings" value={servings} onChange={setServings} placeholder="4" type="number" />
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

            {/* Tags */}
            <FormCard title="Dietary Tags">
              <div className="grid gap-3 sm:grid-cols-2">
                <Checkbox label="Gluten Free" checked={isGlutenFree} onChange={setIsGlutenFree} />
                <Checkbox label="High Fiber" checked={isHighFiber} onChange={setIsHighFiber} />
                <Checkbox label="Weight Management" checked={isWeightManagement} onChange={setIsWeightManagement} />
                <Checkbox label="Energy Boosting" checked={isEnergyBoosting} onChange={setIsEnergyBoosting} />
              </div>
              <div className="mt-4 border-t border-[#E4E7EC] pt-4">
                <Toggle label="Featured Recipe" checked={isFeatured} onChange={setIsFeatured} />
              </div>
            </FormCard>

            {/* Ingredients */}
            <FormCard title="Ingredients">
              <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2">
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
                      className="h-9 w-16 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[12px] text-[#374151] outline-none"
                    />
                    <input
                      value={ing.unit}
                      onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                      placeholder="Unit"
                      className="h-9 w-16 rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-2 text-[12px] text-[#374151] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={ingredients.length === 1}
                      className="grid h-9 w-9 place-items-center rounded-md text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-30"
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
            </FormCard>

            {/* Steps */}
            <FormCard title="Preparation Steps">
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
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
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="h-8 rounded-md bg-[#0A4833] px-3 text-[11px] text-white disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Recipe"}
          </button>
        </div>
      </div>
    </section>
  );
}