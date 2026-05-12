"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import AddProductActions from "./components/AddProductActions";
import AddProductForm, { ProductFormData } from "./components/AddProductForm";
import AddProductHeader from "./components/AddProductHeader";
import ProductPreviewCard from "./components/ProductPreviewCard";

type ApiProduct = {
  id: number;
  product_name?: string;
  product_subtitle?: string | null;
  product_code?: string;
  category?: string;
  product_status?: string;
  image?: string | null;
  short_description?: string;
  full_description?: string | null;
  key_ingredients?: string | null;
  health_benefits?: string | null;
  base_price?: string | number;
  sale_price?: string | number | null;
  currency?: string;
  stock_quantity?: number;
  low_stock_alert?: number;
  stock_status?: string;
};

const initialFormData: ProductFormData = {
  product_name: "",
  product_subtitle: "",
  product_code: "",
  category: "",
  product_status: "draft",
  image: null,
  short_description: "",
  full_description: "",
  key_ingredients: "",
  health_benefits: "",
  base_price: "",
  sale_price: "",
  currency: "USD",
  stock_quantity: "",
  low_stock_alert: "5",
  stock_status: "in_stock",
};

function toProductImageUrl(imagePath?: string | null) {
  if (!imagePath) return null;
  return getImageUrl(imagePath);
}

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditMode = Boolean(productId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  useEffect(() => {
    if (!productId) {
      setFormData(initialFormData);
      setExistingImageUrl(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoadingProduct(true);
      try {
        const response = await api.get<ApiProduct>(`/products/${productId}/`);
        const data = response.data;
        setFormData({
          product_name: String(data.product_name ?? ""),
          product_subtitle: String(data.product_subtitle ?? ""),
          product_code: String(data.product_code ?? ""),
          category: String(data.category ?? ""),
          product_status: String(data.product_status ?? "draft"),
          image: null,
          short_description: String(data.short_description ?? ""),
          full_description: String(data.full_description ?? ""),
          key_ingredients: String(data.key_ingredients ?? ""),
          health_benefits: String(data.health_benefits ?? ""),
          base_price: String(data.base_price ?? ""),
          sale_price: String(data.sale_price ?? ""),
          currency: String(data.currency ?? "USD"),
          stock_quantity: String(data.stock_quantity ?? ""),
          low_stock_alert: String(data.low_stock_alert ?? "5"),
          stock_status: String(data.stock_status ?? "in_stock"),
        });
        setExistingImageUrl(toProductImageUrl(data.image));
      } catch {
        toast.error("Failed to load product details.");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    void fetchProduct();
  }, [productId]);

  const previewImageUrl = useMemo(() => {
    if (formData.image) {
      return URL.createObjectURL(formData.image);
    }
    return existingImageUrl;
  }, [existingImageUrl, formData.image]);

  useEffect(() => {
    return () => {
      if (formData.image && previewImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [formData.image, previewImageUrl]);

  async function handleSubmit() {
    if (!formData.product_name.trim()) { toast.error("Product name is required."); return; }
    if (!formData.product_code.trim()) { toast.error("SKU / Product Code is required."); return; }
    if (!formData.base_price) { toast.error("Base price is required."); return; }
    if (!formData.short_description.trim()) { toast.error("Short description is required."); return; }
    if (!formData.category) { toast.error("Category is required."); return; }

    const fd = new FormData();
    fd.append("product_name", formData.product_name.trim());
    fd.append("product_code", formData.product_code.trim());
    fd.append("category", formData.category);
    fd.append("product_status", formData.product_status);
    fd.append("short_description", formData.short_description.trim());
    fd.append("base_price", formData.base_price);
    fd.append("stock_quantity", formData.stock_quantity || "0");
    fd.append("stock_status", formData.stock_status);
    fd.append("currency", formData.currency);
    if (formData.product_subtitle.trim()) fd.append("product_subtitle", formData.product_subtitle.trim());
    if (formData.image) fd.append("image", formData.image);
    if (formData.full_description.trim()) fd.append("full_description", formData.full_description.trim());
    if (formData.key_ingredients.trim()) fd.append("key_ingredients", formData.key_ingredients.trim());
    if (formData.health_benefits.trim()) fd.append("health_benefits", formData.health_benefits.trim());
    if (formData.sale_price) fd.append("sale_price", formData.sale_price);
    if (formData.low_stock_alert) fd.append("low_stock_alert", formData.low_stock_alert);

    setIsSubmitting(true);
    try {
      if (isEditMode && productId) {
        await api.patch(`/products/${productId}/`, fd);
        toast.success("Product updated successfully.");
      } else {
        await api.post("/products/", fd);
        toast.success("Product created successfully.");
      }
      router.push("/admindashboard/products");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : Object.entries(data ?? {})
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
              .join(" | ");
      toast.error(detail || `Failed to ${isEditMode ? "update" : "create"} product. Please check your inputs.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#F6F7F9] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AddProductHeader
          title={isEditMode ? "Edit Product" : "Add Product"}
          onBackToProducts={() => router.push("/admindashboard/products")}
        />

        {isLoadingProduct ? (
          <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 text-sm text-[#667085]">
            Loading product details...
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <AddProductForm formData={formData} onChange={setFormData} />
          <ProductPreviewCard
            productName={formData.product_name}
            subtitle={formData.product_subtitle || formData.short_description}
            price={formData.base_price}
            stock={formData.stock_quantity}
            status={formData.product_status}
            imageUrl={previewImageUrl}
          />
        </div>

        <AddProductActions
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEditMode ? "Update Product" : "Create Product"}
        />
      </div>
    </section>
  );
}
