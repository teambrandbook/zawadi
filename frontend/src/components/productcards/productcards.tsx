"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";

type Product = {
  id: number;
  product_name: string;
  product_subtitle: string;
  category: string;
  base_price: string;
  sale_price: string | null;
  image: string | null;
  stock_status: string;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api").replace(/\/api$/, "");

function productImageUrl(path: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function Rating() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-[#f2c94c]" aria-label="Rated 4.8 out of 5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={cn(index === 4 ? "fill-transparent" : "fill-current", "stroke-current")}
          />
        ))}
      </div>
      <span className="text-sm font-medium leading-5 tracking-[0.01em] text-[#6b7280]">
        4.8 (124 reviews)
      </span>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: number) => void;
}) {
  const price = product.sale_price || product.base_price;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] sm:p-6">
      <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#f8f8f8]">
        <Image
          src={productImageUrl(product.image)}
          alt={product.product_name}
          fill
          sizes="(min-width: 1280px) 402px, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#f2c94c] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-bold capitalize text-[#1a1a1a] sm:text-[22px]">
            {product.product_name}
          </h2>
          <p className="whitespace-nowrap text-[20px] font-bold text-[#1a1a1a] sm:text-[22px]">
            ₹{price}
          </p>
        </div>

        <div className="mt-2.5">
          <Rating />
        </div>

        <p className="mt-4 text-[13px] leading-[1.6] text-[#6b7280] sm:text-[14px]">
          {product.product_subtitle || "Premium quality product for your wellness journey."}
        </p>

        <div className="mt-auto flex gap-2 pt-6">
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f4d3a] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#1a4331] active:scale-[0.99] sm:text-[16px]"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
          <Link
            href={`/products/details?id=${product.id}`}
            className="flex items-center justify-center rounded-full border border-[#1f4d3a] px-5 py-3.5 text-sm font-bold text-[#1f4d3a] transition hover:bg-[#1f4d3a] hover:text-white"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProductCards() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Products"]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products/")
      .then((res) => {
        const list: Product[] = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        setProducts(list);
        const unique = ["All Products", ...Array.from(new Set(list.map((p) => p.category).filter(Boolean)))];
        setCategories(unique);
      })
      .catch(() => toast.error("Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddToCart(productId: number) {
    try {
      await api.post("/orders/cart/items/", { product_id: productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 401 || status === 403) {
        router.push(`/login?next=/products`);
      } else {
        toast.error("Could not add to cart.");
      }
    }
  }

  const filtered =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <section className="bg-[#fbfaf2] px-6 py-20 sm:px-8 lg:px-20">
        <div className="flex min-h-[300px] items-center justify-center text-sm text-[#0A4833]">
          Loading products...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fbfaf2] px-6 py-20 sm:px-8 lg:px-20">
      <div className="mx-auto max-w-[1422px]">
        <div className="flex justify-center overflow-x-auto pb-2">
          <div className="flex min-w-max items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium leading-5 tracking-[0.002em] transition",
                  activeCategory === category
                    ? "bg-[#1f4d3a] text-white"
                    : "text-[#6b7280] hover:bg-white hover:text-[#1f4d3a]"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-9 flex min-h-[200px] items-center justify-center text-sm text-[#6b7280]">
            No products found.
          </div>
        ) : (
          <div className="mt-9 grid grid-cols-1 justify-items-center gap-x-9 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
