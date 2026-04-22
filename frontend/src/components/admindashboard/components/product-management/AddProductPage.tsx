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
    name: "",
    subtitle: "",
    sku: "",
    category: "",
    status: "Draft",
    description: "",
    full_description: "",
    price: "",
    stock_quantity: "",
  });

  async function handleSubmit() {
    if (!formData.name || !formData.price) {
      toast.error("Product name and price are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/products/", {
        name: formData.name,
        description: formData.subtitle || formData.description,
        sku: formData.sku,
        category: formData.category,
        status: formData.status.toLowerCase(),
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
      });
      router.push("/admindashboard/products");
    } catch {
      toast.error("Failed to create product. Please check your inputs and try again.");
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
