"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import AddProductActions from "./components/AddProductActions";
import AddProductForm from "./components/AddProductForm";
import AddProductHeader from "./components/AddProductHeader";
import ProductPreviewCard from "./components/ProductPreviewCard";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_subtitle: "",
    product_code: "",
    category: "",
    product_status: "draft",
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
  });

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
    if (formData.full_description.trim()) fd.append("full_description", formData.full_description.trim());
    if (formData.key_ingredients.trim()) fd.append("key_ingredients", formData.key_ingredients.trim());
    if (formData.health_benefits.trim()) fd.append("health_benefits", formData.health_benefits.trim());
    if (formData.sale_price) fd.append("sale_price", formData.sale_price);
    if (formData.low_stock_alert) fd.append("low_stock_alert", formData.low_stock_alert);

    setIsSubmitting(true);
    try {
      await api.post("/products/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product created successfully.");
      router.push("/admindashboard/products");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : Object.entries(data ?? {})
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
              .join(" | ");
      toast.error(detail || "Failed to create product. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-[#F6F7F9] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AddProductHeader onBackToProducts={() => router.push("/admindashboard/products")} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <AddProductForm formData={formData} onChange={setFormData} />
          <ProductPreviewCard />
        </div>

        <AddProductActions onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}
