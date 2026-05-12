"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  ChevronDown,
  Eye,
  Filter,
  Heart,
  Package,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import type { AppDispatch } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

type ProductVariant = {
  id: number;
  variant_name: string;
  price: string | number;
  stock: number;
};

type Product = {
  id: number;
  product_name: string;
  product_subtitle?: string | null;
  product_code: string;
  category: string;
  product_status: string;
  image?: string | null;
  short_description: string;
  base_price: string | number;
  sale_price?: string | number | null;
  currency: string;
  stock_quantity: number;
  stock_status: string;
  variants: ProductVariant[];
  created_at?: string;
};

type PaginatedResponse<T> = {
  results?: T[];
};

type SortOption = "featured" | "newest" | "price-low" | "price-high";

const fallbackImages = [
  "/product/p-1.webp",
  "/product/p-2.webp",
  "/product/p-4.webp",
  "/product/p-main.webp",
];

const categoryLabels: Record<string, string> = {
  food: "Buckwheat Collection",
  seed: "Wellness Essentials",
  supplement: "Wellness Essentials",
  other: "Buckwheat Collection",
};

function toList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(toNumber(value));
  } catch {
    return `$${toNumber(value).toFixed(2)}`;
  }
}

function toImageUrl(imagePath: string | null | undefined, index: number): string {
  if (!imagePath) return fallbackImages[index % fallbackImages.length];
  return getImageUrl(imagePath);
}

function toCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isNewProduct(createdAt?: string): boolean {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
  return createdDate.getTime() >= thirtyDaysAgo;
}

function getPackLabel(product: Product): string {
  const variant = getCartVariant(product);
  if (variant?.variant_name) return variant.variant_name;
  if (product.stock_status === "out_of_stock") return "Out of stock";
  if (product.stock_quantity <= 0) return "Stock pending";
  return `${product.stock_quantity} in stock`;
}

function getCartVariant(product: Product): ProductVariant | undefined {
  return product.variants?.find((variant) => variant.stock > 0) ?? product.variants?.[0];
}

function isProductOutOfStock(product: Product): boolean {
  if (product.variants?.length) {
    return product.variants.every((variant) => variant.stock <= 0);
  }
  return product.stock_status === "out_of_stock" || product.stock_quantity <= 0;
}

export default function CommunityProductsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [busyProductId, setBusyProductId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await api.get<Product[] | PaginatedResponse<Product>>("/products/");
        if (!isMounted) return;

        const activeProducts = toList(response.data).filter(
          (product) => product.product_status === "active"
        );
        setProducts(activeProducts);
      } catch {
        if (isMounted) {
          setLoadError("Unable to load products right now.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "new") return isNewProduct(product.created_at);
      return product.category === activeFilter;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      }

      const aPrice = toNumber(a.sale_price ?? a.base_price);
      const bPrice = toNumber(b.sale_price ?? b.base_price);
      if (sortBy === "price-low") return aPrice - bPrice;
      if (sortBy === "price-high") return bPrice - aPrice;
      return a.id - b.id;
    });
  }, [activeFilter, products, sortBy]);

  async function addToCart(product: Product) {
    setBusyProductId(product.id);
    setStatusMessage("");
    try {
      const variant = getCartVariant(product);
      const payload: { product_id: number; quantity: number; variant_id?: number } = {
        product_id: product.id,
        quantity: 1,
      };
      if (variant) payload.variant_id = variant.id;

      const response = await api.post("/orders/cart/items/", payload);
      const itemCount = response.data?.summary?.item_count;
      if (typeof itemCount === "number") {
        dispatch(setCartCount(itemCount));
      }
      toast.success("Added to cart!");
    } catch (error: unknown) {
      const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(detail || "Unable to add this product to your cart.");
      setStatusMessage("Unable to add this product to your cart.");
    } finally {
      setBusyProductId(null);
    }
  }

  function goToCheckout(productId: number) {
    router.push(`/communityDashBoard/myorders/order?productId=${productId}&quantity=1`);
  }

  return (
    <section className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1184px] space-y-7">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A4833] to-[#047857] px-6 py-7 sm:px-8 lg:h-[276px] lg:py-8">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/5" />
          <div className="relative z-10 flex h-full max-w-xl flex-col items-start justify-center">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              Buckwheat Collection
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">
              Premium Organic Buckwheat
            </h1>
            <p className="mt-3 max-w-[520px] text-sm leading-6 text-white/90 sm:text-base">
              Discover the nutritional power of our premium buckwheat products,
              carefully sourced and crafted for your wellness journey.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="mt-5 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0A4833] transition hover:bg-white/90"
            >
              Explore Collection
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DFDFDF] bg-white px-4 text-sm text-[#374151]"
            >
              <Filter className="h-4 w-4 text-[#0A4833]" />
              Filters
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`h-10 rounded-lg px-4 text-sm transition ${
                activeFilter === "all"
                  ? "bg-[#0A4833] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563] hover:bg-[#DDE1E4]"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`h-10 rounded-lg px-4 text-sm transition ${
                  activeFilter === category
                    ? "bg-[#0A4833] text-white"
                    : "bg-[#E5E7EB] text-[#4B5563] hover:bg-[#DDE1E4]"
                }`}
              >
                {toCategoryLabel(category)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveFilter("new")}
              className={`h-10 rounded-lg px-4 text-sm transition ${
                activeFilter === "new"
                  ? "bg-[#0A4833] text-white"
                  : "bg-[#E5E7EB] text-[#4B5563] hover:bg-[#DDE1E4]"
              }`}
            >
              New Arrivals
            </button>
          </div>

          <label className="relative w-full sm:w-[168px]">
            <span className="sr-only">Sort products</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-10 w-full appearance-none rounded-lg border border-[#DFDFDF] bg-white px-4 pr-9 text-sm text-[#111827] outline-none focus:border-[#0A4833]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#111827]" />
          </label>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[440px] animate-pulse rounded-xl border border-[#DFDFDF] bg-white"
              >
                <div className="h-48 rounded-t-xl bg-[#F3F4F6]" />
                <div className="space-y-4 p-4">
                  <div className="h-5 w-28 rounded bg-[#F3F4F6]" />
                  <div className="h-5 w-40 rounded bg-[#F3F4F6]" />
                  <div className="h-16 rounded bg-[#F3F4F6]" />
                  <div className="h-9 rounded bg-[#F3F4F6]" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <EmptyState message={loadError} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState message="No products match this filter yet." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product, index) => {
              const price = product.sale_price ?? product.base_price;
              const outOfStock = isProductOutOfStock(product);
              const productIsNew = isNewProduct(product.created_at);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white"
                >
                  <div className="relative h-48 overflow-hidden bg-[#F3F4F6]">
                    <Image
                      src={toImageUrl(product.image, index)}
                      alt={product.product_name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(min-width: 1280px) 266px, (min-width: 640px) 50vw, 100vw"
                    />
                    {productIsNew ? (
                      <span className="absolute left-3 top-3 rounded-full bg-[#22C55E] px-2 py-1 text-xs font-medium text-white">
                        New
                      </span>
                    ) : index === 0 && activeFilter === "all" ? (
                      <span className="absolute left-3 top-3 rounded-full bg-[#9F8151] px-2 py-1 text-xs font-medium text-white">
                        Featured
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#4B5563] transition hover:bg-white hover:text-[#0A4833]"
                      aria-label={`Save ${product.product_name}`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex h-[248px] flex-col p-4">
                    <span className="w-fit rounded-full bg-[#9F8151]/10 px-2 py-1 text-xs font-medium text-[#9F8151]">
                      {toCategoryLabel(product.category)}
                    </span>
                    <h2 className="mt-3 line-clamp-1 text-base font-semibold leading-6 text-[#111827]">
                      {product.product_name}
                    </h2>
                    <p className="mt-1 line-clamp-3 min-h-[60px] text-sm leading-5 text-[#4B5563]">
                      {product.short_description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <strong className="text-lg font-bold text-[#0A4833]">
                        {toCurrency(price, product.currency)}
                      </strong>
                      <span className="text-xs text-[#6B7280]">{getPackLabel(product)}</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={outOfStock || busyProductId === product.id}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0A4833] px-3 text-sm font-medium text-white transition hover:bg-[#073826] disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {outOfStock ? "Out of stock" : busyProductId === product.id ? "Adding..." : "Add to cart"}
                      </button>
                      <button
                        type="button"
                        onClick={() => goToCheckout(product.id)}
                        className="flex h-9 w-11 items-center justify-center rounded-lg border border-[#DFDFDF] text-[#0A4833] transition hover:bg-[#F9FAFB]"
                        aria-label={`View ${product.product_name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#4B5563]">
          <SlidersHorizontal className="h-4 w-4 text-[#0A4833]" />
          Products, pricing, stock, and images are loaded from the product catalog.
        </div>
        {statusMessage ? (
          <div className="rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
            {statusMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[#DFDFDF] bg-[#F9FAFB] px-6 text-center">
      <Package className="h-10 w-10 text-[#0A4833]" />
      <h2 className="mt-4 text-lg font-semibold text-[#111827]">No products to show</h2>
      <p className="mt-1 max-w-md text-sm text-[#6B7280]">{message}</p>
    </div>
  );
}
