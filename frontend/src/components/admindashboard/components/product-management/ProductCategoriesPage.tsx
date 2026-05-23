"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
};

type CategoryResponse = {
  data?: ProductCategory;
  message?: string;
};

type DialogMode = "create" | "edit" | "view";

const inputClass =
  "h-12 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F9FAFB] px-4 text-[15px] text-[#0A4833] outline-none transition placeholder:text-[#8A8F98] focus:border-[#0A4833]";

function slugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function categoryError(error: unknown) {
  const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
  if (!data) return "Category action failed.";
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(" | ");
}

function CategoryDialog({
  mode,
  category,
  onClose,
  onSaved,
}: {
  mode: DialogMode;
  category: ProductCategory | null;
  onClose: () => void;
  onSaved: (category: ProductCategory, mode: Exclude<DialogMode, "view">) => void;
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const title = mode === "create" ? "Add Category" : mode === "edit" ? "Edit Category" : "Category Details";

  async function saveCategory() {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugFromName(name),
        is_active: isActive,
      };
      const response = isEdit && category
        ? await api.patch<CategoryResponse>(`/products/categories/${category.id}/`, payload)
        : await api.post<CategoryResponse>("/products/categories/", payload);

      const saved = response.data.data;
      if (!saved) throw new Error("Missing category response.");
      onSaved(saved, isEdit ? "edit" : "create");
      toast.success(isEdit ? "Category updated successfully." : "Category created successfully.");
      onClose();
    } catch (error) {
      toast.error(categoryError(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[520px] rounded-[8px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-5">
          <div>
            <h2 className="text-[22px] font-bold tracking-[-0.5px] text-[#0A4833]">{title}</h2>
            <p className="mt-1 text-[13px] text-[#6B7280]">Manage product categories used in product creation.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-[#0A4833] hover:bg-[#F3F4F6]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <label className="block space-y-2">
            <span className="text-[14px] font-semibold tracking-[-0.4px] text-[#0A4833]">Category name</span>
            <input
              value={name}
              disabled={isView}
              onChange={(event) => {
                setName(event.target.value);
                if (!isEdit) setSlug(slugFromName(event.target.value));
              }}
              placeholder="Enter category name"
              className={inputClass}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[14px] font-semibold tracking-[-0.4px] text-[#0A4833]">Slug</span>
            <input
              value={slug}
              disabled={isView}
              onChange={(event) => setSlug(slugFromName(event.target.value))}
              placeholder="category_slug"
              className={inputClass}
            />
          </label>

          <label className="flex items-center justify-between rounded-[8px] border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3">
            <span className="text-[14px] font-semibold tracking-[-0.4px] text-[#0A4833]">Active</span>
            <input
              type="checkbox"
              checked={isActive}
              disabled={isView}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 accent-[#0A4833]"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E5E7EB] px-6 py-4">
          <button type="button" onClick={onClose} className="h-10 rounded-[8px] border border-[#D1D5DB] px-4 text-[14px] font-medium text-[#374151]">
            {isView ? "Close" : "Cancel"}
          </button>
          {!isView ? (
            <button
              type="button"
              onClick={saveCategory}
              disabled={isSaving}
              className="h-10 rounded-[8px] bg-[#0A4833] px-5 text-[14px] font-medium text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : isEdit ? "Update Category" : "Add Category"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [dialog, setDialog] = useState<{ mode: DialogMode; category: ProductCategory | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const allSelected = categories.length > 0 && selectedIds.length === categories.length;

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
    [categories]
  );

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const response = await api.get<ProductCategory[]>("/products/categories/");
      setCategories(response.data);
    } catch {
      toast.error("Failed to load product categories.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchCategories();
  }, []);

  function toggleSelected(id: number) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function upsertCategory(category: ProductCategory, mode: Exclude<DialogMode, "view">) {
    setCategories((prev) => {
      if (mode === "create") return [...prev, category];
      return prev.map((item) => (item.id === category.id ? category : item));
    });
  }

  async function deleteCategory(category: ProductCategory) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await api.delete(`/products/categories/${category.id}/`);
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      setSelectedIds((prev) => prev.filter((id) => id !== category.id));
      toast.success("Category deleted successfully.");
    } catch (error) {
      toast.error(categoryError(error));
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-white px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1184px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold leading-8 tracking-[-0.5px] text-[#0A4833]">Category</h1>
          </div>

          <button
            type="button"
            onClick={() => setDialog({ mode: "create", category: null })}
            className="inline-flex h-12 items-center gap-2 rounded-[8px] bg-[#0A4833] px-5 text-[16px] font-medium tracking-[-0.5px] text-white"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        <div className="mx-auto mt-14 w-full max-w-[614px] overflow-x-auto rounded-[5px] border border-[#DFDFDF] bg-white">
          <div className="grid min-h-[82px] min-w-[520px] grid-cols-[44px_minmax(120px,1fr)_88px_120px] items-center bg-[#EBE1CF] px-3 text-[14px] font-semibold tracking-[-0.5px] text-[#0A4833] sm:grid-cols-[58px_minmax(0,1fr)_120px_148px] sm:px-6">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(event) => setSelectedIds(event.target.checked ? categories.map((category) => category.id) : [])}
              className="h-4 w-4"
              aria-label="Select all categories"
            />
            <span className="text-center">Category name</span>
            <span className="text-center">Status</span>
            <span className="text-center">Actions</span>
          </div>

          {isLoading ? (
            <div className="px-6 py-10 text-center text-[14px] text-[#6B7280]">Loading categories...</div>
          ) : sortedCategories.length ? (
            sortedCategories.map((category) => (
              <div
                key={category.id}
                className="grid min-h-[78px] min-w-[520px] grid-cols-[44px_minmax(120px,1fr)_88px_120px] items-center border-t border-[#DFDFDF] px-3 text-[12px] font-medium tracking-[-0.5px] text-[#0A4833] sm:grid-cols-[58px_minmax(0,1fr)_120px_148px] sm:px-6"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(category.id)}
                  onChange={() => toggleSelected(category.id)}
                  className="h-4 w-4"
                  aria-label={`Select ${category.name}`}
                />
                <span className="text-center">{category.name}</span>
                <span className={`text-center ${category.is_active ? "text-[#15803D]" : "text-[#B45309]"}`}>
                  {category.is_active ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center justify-center gap-3 text-[#0A4833] sm:gap-5">
                  <button type="button" onClick={() => setDialog({ mode: "view", category })} aria-label={`View ${category.name}`}>
                    <Eye className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" onClick={() => setDialog({ mode: "edit", category })} aria-label={`Edit ${category.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => deleteCategory(category)} aria-label={`Delete ${category.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-[14px] text-[#6B7280]">
              No categories yet. Add a category to use it in product creation.
            </div>
          )}
        </div>
      </div>

      {dialog ? (
        <CategoryDialog
          mode={dialog.mode}
          category={dialog.category}
          onClose={() => setDialog(null)}
          onSaved={upsertCategory}
        />
      ) : null}
    </section>
  );
}
