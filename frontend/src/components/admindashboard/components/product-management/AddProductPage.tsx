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
  alternative_images?: string[];
  short_description?: string;
  full_description?: string | null;
  key_ingredients?: string | null;
  health_benefits?: string | null;
  base_price?: string | number;
  sale_price?: string | number | null;
  cost_price?: string | number;
  mrp_price?: string | number;
  selling_price?: string | number;
  currency?: string;
  stock_quantity?: number;
  low_stock_alert?: number;
  stock_status?: string;
  product_unit?: string;
  unit_quantity?: string;
  alternative_unit_enabled?: boolean;
  allow_out_of_stock?: boolean;
  enable_low_stock_alerts?: boolean;
  variants?: {
    variant_value?: string;
    variant_name?: string;
    variant_unit?: string;
    cost?: string | number;
    price?: string | number;
    stock?: number;
  }[];
};

const initialFormData: ProductFormData = {
  product_name: "",
  product_subtitle: "",
  product_code: "",
  category: "",
  product_status: "draft",
  image: null,
  alternative_images: [null, null, null, null],
  alternative_image_urls: [],
  short_description: "",
  full_description: "",
  key_ingredients: "",
  health_benefits: "",
  base_price: "",
  sale_price: "",
  cost_price: "",
  mrp_price: "",
  selling_price: "",
  currency: "USD",
  stock_quantity: "",
  low_stock_alert: "5",
  stock_status: "in_stock",
  unit_quantity: "",
  product_unit: "",
  alternative_unit_enabled: false,
  allow_out_of_stock: false,
  enable_low_stock_alerts: false,
  variants: [{ variant_value: "", variant_unit: "", cost: "", price: "", stock: "" }],
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
          alternative_images: [null, null, null, null],
          alternative_image_urls: (data.alternative_images ?? []).slice(0, 4).map((image) => toProductImageUrl(image) ?? image),
          short_description: String(data.short_description ?? ""),
          full_description: String(data.full_description ?? ""),
          key_ingredients: String(data.key_ingredients ?? ""),
          health_benefits: String(data.health_benefits ?? ""),
          base_price: String(data.base_price ?? ""),
          sale_price: String(data.sale_price ?? ""),
          cost_price: String(data.cost_price ?? data.base_price ?? ""),
          mrp_price: String(data.mrp_price ?? data.sale_price ?? data.base_price ?? ""),
          selling_price: String(data.selling_price ?? data.sale_price ?? data.base_price ?? ""),
          currency: String(data.currency ?? "USD"),
          stock_quantity: String(data.stock_quantity ?? ""),
          low_stock_alert: String(data.low_stock_alert ?? "5"),
          stock_status: String(data.stock_status ?? "in_stock"),
          unit_quantity: String(data.unit_quantity ?? ""),
          product_unit: String(data.product_unit ?? ""),
          alternative_unit_enabled: Boolean(data.alternative_unit_enabled),
          allow_out_of_stock: Boolean(data.allow_out_of_stock),
          enable_low_stock_alerts: Boolean(data.enable_low_stock_alerts),
          variants: data.variants?.length
            ? data.variants.map((variant) => ({
                variant_value: String(variant.variant_value ?? variant.variant_name ?? ""),
                variant_unit: String(variant.variant_unit ?? ""),
                cost: String(variant.cost ?? ""),
                price: String(variant.price ?? ""),
                stock: String(variant.stock ?? ""),
              }))
            : [{ variant_value: "", variant_unit: "", cost: "", price: "", stock: "" }],
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

  async function handleSubmit(overrideStatus?: string) {
    if (!formData.product_name.trim()) { toast.error("Product name is required."); return; }
    if (!formData.product_code.trim()) { toast.error("SKU / Product Code is required."); return; }
    if (!formData.cost_price) { toast.error("Cost price is required."); return; }
    if (!formData.mrp_price) { toast.error("MRP is required."); return; }
    if (!formData.selling_price) { toast.error("Selling price is required."); return; }
    if (Number(formData.selling_price) > Number(formData.mrp_price)) {
      toast.error("Selling price cannot be greater than MRP.");
      return;
    }
    if (!formData.short_description.trim()) { toast.error("Short description is required."); return; }
    if (!formData.category) { toast.error("Category is required."); return; }

    const fd = new FormData();
    fd.append("product_name", formData.product_name.trim());
    fd.append("product_code", formData.product_code.trim());
    fd.append("category", formData.category);
    fd.append("product_status", overrideStatus || formData.product_status);
    fd.append("short_description", formData.short_description.trim());
    fd.append("cost_price", formData.cost_price);
    fd.append("mrp_price", formData.mrp_price);
    fd.append("selling_price", formData.selling_price);
    fd.append("base_price", formData.cost_price);
    fd.append("sale_price", formData.selling_price);
    fd.append("stock_quantity", formData.stock_quantity || "0");
    fd.append("stock_status", formData.stock_status);
    fd.append("currency", formData.currency);
    fd.append("product_unit", formData.product_unit);
    fd.append("unit_quantity", formData.unit_quantity);
    fd.append("alternative_unit_enabled", "false");
    fd.append("allow_out_of_stock", String(formData.allow_out_of_stock));
    fd.append("enable_low_stock_alerts", String(formData.enable_low_stock_alerts));
    if (formData.product_subtitle.trim()) fd.append("product_subtitle", formData.product_subtitle.trim());
    if (formData.image) fd.append("image", formData.image);
    formData.alternative_images.filter((image): image is File => Boolean(image)).forEach((image) => {
      fd.append("alternative_images", image);
    });
    if (formData.full_description.trim()) fd.append("full_description", formData.full_description.trim());
    if (formData.key_ingredients.trim()) fd.append("key_ingredients", formData.key_ingredients.trim());
    if (formData.health_benefits.trim()) fd.append("health_benefits", formData.health_benefits.trim());
    if (formData.low_stock_alert) fd.append("low_stock_alert", formData.low_stock_alert);

    setIsSubmitting(true);
    try {
      if (isEditMode && productId) {
        await api.patch(`/products/${productId}/`, fd);
        toast.success(`Product updated successfully${overrideStatus === "draft" ? " as draft" : ""}.`);
      } else {
        await api.post("/products/", fd);
        toast.success(`Product created successfully${overrideStatus === "draft" ? " as draft" : ""}.`);
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
    <section className="w-full bg-white px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-[1184px] space-y-4">
        <AddProductHeader
          title={isEditMode ? "Edit Product" : "Add Product"}
          onBackToProducts={() => router.push("/admindashboard/products")}
        />

        {isLoadingProduct ? (
          <div className="rounded-lg border border-[#E4E7EC] bg-white p-4 text-sm text-[#667085]">
            Loading product details...
          </div>
        ) : null}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,816px)_272px]">
          <div className="space-y-4">
            <AddProductForm formData={formData} onChange={setFormData} />
            <AddProductActions
              onSubmit={() => handleSubmit("active")}
              onDraft={() => handleSubmit("draft")}
              isSubmitting={isSubmitting}
              submitLabel={isEditMode ? "Update Product" : "Create Product"}
            />
          </div>
          <ProductPreviewCard
            productName={formData.product_name}
            subtitle={formData.product_subtitle || formData.short_description}
            price={formData.selling_price}
            stock={formData.stock_quantity}
            status={formData.product_status}
            imageUrl={previewImageUrl}
          />
        </div>
      </div>
    </section>
  );
}
