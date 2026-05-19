"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { FaBagShopping } from "react-icons/fa6";
import { cn, getImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import { addToGuestCart, getGuestCartCount } from "@/lib/guestCart";
import { formatPrice } from "@/utils/formatPrice";

type Product = {
  id: number;
  product_name: string;
  product_subtitle: string;
  category: string;
  base_price: string;
  sale_price: string | null;
  mrp_price?: string | number;
  selling_price?: string | number;
  display_price?: string | number;
  currency_code?: string;
  currency_decimal_places?: number;
  discount_percent?: string | number;
  image: string | null;
  stock_status: string;
  stock_quantity: number;
  created_at?: string;
};

function productImageUrl(path: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  return getImageUrl(path);
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

function isNewProduct(createdAt?: string): boolean {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
  return createdDate.getTime() >= thirtyDaysAgo;
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  const price = product.selling_price ?? product.sale_price ?? product.base_price;
  const mrp = Number(product.mrp_price ?? 0);
  const selling = Number(price);
  const discounted = mrp > selling;
  const outOfStock = product.stock_status === "out_of_stock" || product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 5;
  const badgeText = isNewProduct(product.created_at) ? "New" : product.category;
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] sm:p-6">
      <div className="relative mb-5 aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#f8f8f8]">
        <Image
          src={productImageUrl(product.image)}
          alt={product.product_name}
          fill
          unoptimized
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#f2c94c] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
          {badgeText}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-bold capitalize text-[#1a1a1a] sm:text-[22px]">
            {product.product_name}
          </h2>
          <div className="flex flex-col items-end">
            <span className="whitespace-nowrap text-[20px] font-bold text-[#1a1a1a] sm:text-[22px]">
              {product.display_price
                ? formatPrice(product.display_price, product.currency_code || "SAR", product.currency_decimal_places || 2)
                : formatPrice(price, "SAR")}
            </span>
            <span className="text-xs text-gray-400">incl. VAT</span>
          </div>
        </div>
        {discounted ? (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-[#9ca3af] line-through">₹{product.mrp_price}</span>
            <span className="text-xs font-bold text-[#15803D]">
              {Number(product.discount_percent ?? 0).toFixed(0)}% off
            </span>
          </div>
        ) : null}

        <div className="mt-2.5">
          <Rating />
        </div>

        <p className="mt-4 text-[13px] leading-[1.6] text-[#6b7280] sm:text-[14px]">
          {product.product_subtitle || "Premium quality product for your wellness journey."}
        </p>
        <p className={`mt-3 text-xs font-semibold ${outOfStock ? "text-red-600" : lowStock ? "text-[#EA580C]" : "text-[#16A34A]"}`}>
          {outOfStock ? "Out of stock" : lowStock ? `Only ${product.stock_quantity} left` : "In stock"}
        </p>

        <div className="mt-auto flex gap-2 pt-6">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f4d3a] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-green active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9CA3AF] sm:text-[16px]"
          >
            <FaBagShopping size={18} />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
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
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
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

  async function handleAddToCart(product: Product) {
    if (!isAuthenticated) {
      const unitPrice = Number(
        product.selling_price ?? product.sale_price ?? product.base_price ?? 0
      );
      addToGuestCart({
        productId: product.id,
        quantity: 1,
        productName: product.product_name,
        productSubtitle: product.product_subtitle,
        image: product.image,
        unitPrice,
        currency: "INR",
      });
      dispatch(setCartCount(getGuestCartCount()));
      toast.success("Added to cart!");
      return;
    }
    try {
      const res = await api.post("/orders/cart/items/", { product_id: product.id, quantity: 1 });
      toast.success("Added to cart!");
      dispatch(setCartCount(res.data.summary?.item_count ?? 0));
    } catch {
      toast.error("Could not add to cart.");
    }
  }

  const filtered =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <section className="bg-[#fffef5] px-6 py-20 sm:px-8 lg:px-20">
        <div className="flex min-h-75 items-center justify-center text-sm text-[#0A4833]">
          Loading products...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fffef5] px-6 py-20 sm:px-8 lg:px-20">
      <div className="mx-auto max-w-355.5">
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
          <div className="mt-9 flex min-h-50 items-center justify-center text-sm text-[#6b7280]">
            No products found.
          </div>
        ) : (
          <div className="mt-9 grid grid-cols-1 justify-items-center gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}


      </div>
    </section>
  );
}
