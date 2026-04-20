"use client";

import { useRouter } from "next/navigation";
import AddProductActions from "./components/AddProductActions";
import AddProductForm from "./components/AddProductForm";
import AddProductHeader from "./components/AddProductHeader";
import ProductPreviewCard from "./components/ProductPreviewCard";

export default function AddProductPage() {
  const router = useRouter();

  return (
    <section className="w-full bg-[#F6F7F9] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AddProductHeader onBackToProducts={() => router.push("/admindashboard/products")} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <AddProductForm />
          <ProductPreviewCard />
        </div>

        <AddProductActions />
      </div>
    </section>
  );
}
