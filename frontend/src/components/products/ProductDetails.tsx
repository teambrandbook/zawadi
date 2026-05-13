"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import AddToCartModal from "@/components/shared/AddToCartModal";
import { setCartCount } from "@/redux/userSlice";
import gsap, { animateFadeInLeft, animateSwipeReveal } from "@/lib/gsap";

type ProductVariant = {
  id: number;
  variant_name: string;
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
  currency: string;
  image: string | null;
  stock_status: string;
  variants: ProductVariant[];
};

function productImageUrl(path: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  return getImageUrl(path);
}

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
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
        if (res.data.variants?.length > 0) {
          setSelectedVariantId(res.data.variants[0].id);
        }
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
        ...(selectedVariantId ? { variant_id: selectedVariantId } : {}),
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

  const displayPrice = product.sale_price || product.base_price;
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
              <p className="mt-2 text-xl font-bold text-gray-900">₹{displayPrice}</p>
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

            {/* Variant selector */}
            {product.variants.length > 0 && (
              <div className="product-info-stagger space-y-2 opacity-0">
                <h3 className="font-bold text-black">Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition",
                        selectedVariantId === v.id
                          ? "border-[#1A4331] bg-[#1A4331] text-white"
                          : "border-gray-200 text-[#1A4331] hover:border-[#1A4331]"
                      )}
                    >
                      {v.variant_name} — ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-info-stagger flex flex-wrap items-center gap-6 pt-4 opacity-0">
              {/* Quantity Selector */}
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
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
                className="flex flex-1 items-center justify-center rounded-lg bg-[#1A4331] px-10 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-[#1A4331]/90 active:scale-[0.98]"
              >
                Add To Cart
              </button>

              <button
                type="button"
                aria-label="Save to wishlist"
                onClick={() => toast.info("Wishlist coming soon!")}
                className="rounded-lg border border-gray-200 p-3.5 text-[#1A4331] transition-all hover:bg-gray-50"
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
            variantId={selectedVariantId ?? undefined}
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
