"use client";

import { useEffect, useState } from "react";
import CustomGiftsPage, { type GiftProduct } from "@/components/communityUsers/customGifts/CustomGiftsPage";
import api from "@/services/api";

type ApiProduct = {
  id: number;
  product_name: string;
  short_description: string;
  base_price: string | number;
  variants?: Array<{ variant_name?: string }>;
};

const fallbackProducts: GiftProduct[] = [
  {
    id: "fallback-1",
    name: "Organic Buckwheat Flour",
    description: "Premium stone-ground flour",
    image: "/product/product-1.webp",
    size: "500g",
    price: "$12.00",
  },
];

function toPrice(value: string | number): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function CustomGiftsRoute() {
  const [products, setProducts] = useState<GiftProduct[]>(fallbackProducts);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const response = await api.get<ApiProduct[]>("/products/");
        if (!isMounted) return;

        const mapped = response.data.map((item, index) => ({
          id: String(item.id),
          name: item.product_name,
          description: item.short_description || "ZEWADI product",
          image: `/product/product-${(index % 6) + 1}.webp`,
          size: item.variants?.[0]?.variant_name || "Standard Pack",
          price: toPrice(item.base_price),
        }));
        if (mapped.length > 0) setProducts(mapped);
      } catch {
        // Keep fallback products when API is unavailable.
      }
    }
    void loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return <CustomGiftsPage products={products} />;
}
