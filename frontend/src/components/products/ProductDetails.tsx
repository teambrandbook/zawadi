"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import AddToCartModal from "@/components/shared/AddToCartModal";
import PackSelector from "@/components/communityUsers/myorder/orderDetails/PackSelector";
import type { PackOption } from "@/components/communityUsers/myorder/orderDetails/types";
import { setCartCount } from "@/redux/userSlice";
import gsap, { animateFadeInLeft, animateSwipeReveal } from "@/lib/gsap";

type ProductVariant = {
  id: number;
  variant_name?: string;
  variant_value?: string;
  variant_unit?: string;
  cost?: string | number | null;
  sku: string;
  price: string;
  stock: number;
};

type Product = {
  id: number;
  product_name: string;
  product_subtitle: string;
  short_description: string;
  full_description: string;
  health_benefits: string;
  base_price: string;
  sale_price: string | null;
  cost_price?: string | number;
  mrp_price?: string | number;
  selling_price?: string | number;
  discount_percent?: string | number;
  currency: string;
  image: string | null;
  product_unit?: string;
  unit_quantity?: string;
  stock_quantity: number;
  stock_status: string;
  variants?: ProductVariant[];
};

function productImageUrl(path: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  return getImageUrl(path);
}

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

function toPacks(product: Product | null): PackOption[] {
  if (!product) return [];

  const productUnit = [product.unit_quantity, product.product_unit].filter(Boolean).join(" ");
  const packs: PackOption[] = [
    {
      id: `product-${product.id}-default`,
      name: productUnit || "Standard Pack",
      price: toNumber(product.selling_price ?? product.sale_price ?? product.base_price),
      unitNote:
        product.mrp_price && toNumber(product.mrp_price) > toNumber(product.selling_price ?? product.sale_price ?? product.base_price)
          ? `MRP ${toCurrency(product.mrp_price, product.currency || "INR")}`
          : "Single SKU",
    },
  ];

  return packs;
}

function stockMessage(product: Product): { text: string; className: string } {
  if (product.stock_status === "out_of_stock" || product.stock_quantity <= 0) {
    return { text: "Out of stock", className: "text-red-600" };
  }
  if (product.stock_quantity <= 5) {
    return { text: `Only ${product.stock_quantity} left`, className: "text-[#EA580C]" };
  }
  return { text: "In stock", className: "text-[#16A34A]" };
}

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedPackId, setSelectedPackId] = useState("");
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    api
      .get(`/products/${productId}/`)
      .then((res) => {
        setProduct(res.data);
        setSelectedPackId(`product-${res.data.id}-default`);
      })
      .catch(() => {
        toast.error("Could not load product.");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!mounted || !product) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.set(mainImageRef.current, { opacity: 1 });
      animateSwipeReveal(mainImageRef.current, {}, tl);
      animateFadeInLeft(".product-info-stagger", {}, tl, "-=1");

      animateFadeInLeft(".description-stagger", {
        scrollTrigger: {
          trigger: ".description-section",
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted, product]);

  async function handleAddToCart() {
    if (!product) return;
    if (!isAuthenticated) {
      setModalOpen(true);
      return;
    }
    try {
      const res = await api.post("/orders/cart/items/", {
        product_id: product.id,
        quantity,
      });
      toast.success("Added to cart!");
      dispatch(setCartCount(res.data.summary?.item_count ?? 0));
    } catch {
      toast.error("Could not add to cart.");
    }
  }

  if (!mounted || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#6b7280]">Product not found.</p>
        <Link href="/products" className="rounded-lg bg-[#0a4833] px-6 py-2 text-sm text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  const displayPrice = product.selling_price ?? product.sale_price ?? product.base_price;
  const isDiscounted = toNumber(product.mrp_price) > toNumber(displayPrice);
  const packs = toPacks(product);
  const stock = stockMessage(product);
  const benefits = product.health_benefits
    ? product.health_benefits.split("\n").filter(Boolean)
    : [];

  return (
    <section ref={sectionRef} className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left: Product Image */}
          <div className="space-y-6">
            <div
              ref={mainImageRef}
              className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gray-100 opacity-0 shadow-sm transition-all duration-700 hover:shadow-2xl"
            >
              <Image
                src={productImageUrl(product.image)}
                alt={product.product_name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div className="product-info-stagger opacity-0">
              <h1 className="mb-4 font-playfair text-4xl font-bold text-black md:text-5xl">
                {product.product_name}
              </h1>
              {product.product_subtitle && (
                <p className="text-base text-[#6b7280]">{product.product_subtitle}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-xl font-bold text-gray-900">
                  {toCurrency(displayPrice, product.currency || "INR")}
                </p>
                {isDiscounted ? (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {toCurrency(product.mrp_price, product.currency || "INR")}
                    </span>
                    <span className="rounded-full bg-[#EAFBF0] px-2 py-1 text-xs font-semibold text-[#15803D]">
                      {toNumber(product.discount_percent).toFixed(0)}% off
                    </span>
                  </>
                ) : null}
              </div>
              <p className={`mt-3 text-sm font-semibold ${stock.className}`}>
                {stock.text}
              </p>
            </div>

            {product.short_description && (
              <p className="product-info-stagger max-w-lg font-inter text-sm leading-relaxed text-[#1A4331] opacity-0">
                {product.short_description}
              </p>
            )}

            {benefits.length > 0 && (
              <div className="product-info-stagger space-y-4 opacity-0">
                <h3 className="font-bold text-black">Benefits</h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 font-inter text-sm text-[#1A4331]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A4331]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pack selector */}
            {packs.length > 0 && (
              <div className="product-info-stagger opacity-0">
                <PackSelector
                  packs={packs}
                  selectedPackId={selectedPackId || packs[0].id}
                  onSelectPack={setSelectedPackId}
                  currency={product.currency || "INR"}
                  locale="en-IN"
                />
              </div>
            )}

            <div className="product-info-stagger grid grid-cols-[auto_1fr] items-center gap-3 pt-4 opacity-0 sm:flex sm:flex-wrap sm:gap-6">
              {/* Quantity Selector */}
              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 transition-colors hover:bg-gray-50"
                >
                  <Minus size={18} strokeWidth={3} className="text-[#1A4331]" />
                </button>
                <div className="border-x border-gray-200 px-6 py-2 font-semibold text-gray-900">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 transition-colors hover:bg-gray-50"
                >
                  <Plus size={18} strokeWidth={3} className="text-[#1A4331]" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0 || product.stock_status === "out_of_stock"}
                className="col-span-2 row-start-2 flex w-full items-center justify-center rounded-lg bg-[#1A4331] px-8 py-3.5 text-center font-bold text-white shadow-lg transition-all hover:bg-[#1A4331]/90 active:scale-[0.98] sm:col-span-1 sm:row-auto sm:w-auto sm:flex-1 sm:px-10"
              >
                {product.stock_quantity <= 0 || product.stock_status === "out_of_stock" ? "Out of Stock" : "Add To Cart"}
              </button>

              <button
                type="button"
                aria-label="Save to wishlist"
                onClick={() => toast.info("Wishlist coming soon!")}
                className="justify-self-end rounded-lg border border-gray-200 p-3.5 text-[#1A4331] transition-all hover:bg-gray-50"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Full Description */}
        {product.full_description && (
          <div className="description-section mt-24 space-y-8">
            <div className="description-stagger space-y-4 opacity-0">
              <h2 className="border-b border-gray-200 pb-4 text-xl font-bold text-black">
                Description
              </h2>
              <p className="max-w-4xl font-inter text-sm leading-relaxed text-[#1A4331]">
                {product.full_description}
              </p>
            </div>

            <Link
              href="/recipes"
              className="description-stagger inline-block rounded-lg bg-[#1A4331] px-8 py-3.5 font-bold text-white opacity-0 shadow-md transition-all hover:bg-[#1A4331]/90 active:scale-[0.98]"
            >
              Try Recipes
            </Link>
          </div>
        )}

        {modalOpen && product && (
          <AddToCartModal
            isOpen={modalOpen}
            productId={product.id}
            quantity={quantity}
            onClose={() => setModalOpen(false)}
            onSuccess={() => setModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
