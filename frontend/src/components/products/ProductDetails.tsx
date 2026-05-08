"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import productsData from "@/data/products.json";
import gsap, { animateFadeInLeft, animateSwipeReveal } from "@/lib/gsap";
import api from "@/services/api";

type ApiProduct = {
  id: number;
  product_name: string;
  product_subtitle?: string | null;
  product_status: string;
  image?: string | null;
  short_description: string;
  full_description?: string | null;
  health_benefits?: string | null;
  base_price: string | number;
  sale_price?: string | number | null;
  currency: string;
  stock_quantity: number;
  stock_status: string;
};

type PaginatedResponse<T> = {
  results: T[];
};

function toList<T>(data: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

function toImageUrl(imagePath?: string | null): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");
  return `${apiOrigin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

function splitBenefits(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const ProductDetails = () => {
  const router = useRouter();
  const { details } = productsData;
  const [quantity, setQuantity] = useState(3);
  const [activeThumb, setActiveThumb] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const selectedProduct =
    products.find((product) => String(product.id) === selectedProductId) ?? products[0] ?? null;
  const displayTitle = selectedProduct?.product_name ?? details.title;
  const displayPrice = selectedProduct
    ? toCurrency(selectedProduct.sale_price ?? selectedProduct.base_price, selectedProduct.currency)
    : details.price;
  const displayDescription = selectedProduct?.short_description ?? details.description;
  const displayFullDescription = selectedProduct?.full_description ?? details.fullDescription;
  const displayBenefits = splitBenefits(selectedProduct?.health_benefits);
  const benefits = displayBenefits.length ? displayBenefits : details.benefits;
  const backendImage = toImageUrl(selectedProduct?.image);
  const images = backendImage ? [backendImage, ...details.images.slice(1)] : details.images;
  const stockLabel =
    selectedProduct && selectedProduct.stock_status === "out_of_stock"
      ? "Out of stock"
      : selectedProduct
        ? `${selectedProduct.stock_quantity} in stock`
        : "";
  const canOrder = !selectedProduct || selectedProduct.stock_status !== "out_of_stock";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      try {
        const response = await api.get<ApiProduct[] | PaginatedResponse<ApiProduct>>("/products/");
        if (!isActive) return;
        const productList = toList(response.data).filter((product) => product.product_status === "active");
        setProducts(productList);
        setSelectedProductId(productList[0] ? String(productList[0].id) : "");
      } catch {
        if (isActive) setStatusMessage("Product information is temporarily unavailable.");
      }
    }

    void loadProducts();
    return () => {
      isActive = false;
    };
  }, []);

  function handleProductChange(productId: string) {
    setSelectedProductId(productId);
    setActiveThumb(0);
  }

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      // Main image swipe steal
      tl.set(mainImageRef.current, { opacity: 1 });
      animateSwipeReveal(mainImageRef.current, {}, tl);

      // Thumbnails fade in from right
      tl.fromTo(".product-thumb-stagger",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.6"
      );

      animateFadeInLeft(".product-info-stagger", {}, tl, "-=1");

      // Bottom description reveal
      animateFadeInLeft(".description-stagger", {
        scrollTrigger: {
          trigger: ".description-section",
          start: "top 85%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  function handleBuyNow() {
    if (!selectedProduct) {
      router.push("/communityDashBorde/myorders/order");
      return;
    }
    router.push(`/communityDashBorde/myorders/order?productId=${selectedProduct.id}&quantity=${quantity}`);
  }

  if (!mounted) return null;

  return (
    <section ref={sectionRef} className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Product Images */}
          <div className="space-y-6">
            <div
              ref={mainImageRef}
              className="opacity-0 relative aspect-[4/3] rounded-[1rem] overflow-hidden bg-gray-100 shadow-sm transition-all duration-700 hover:shadow-2xl"
            >
              <Image
                src={images[activeThumb] ?? images[0]}
                alt={displayTitle}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setActiveThumb(index)}
                  className={cn(
                    "product-thumb-stagger opacity-0 relative aspect-square rounded-[1.2rem] overflow-hidden border-2 transition-all duration-300",
                    activeThumb === index ? "border-[#1A4331]" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={thumb} alt={`${displayTitle} thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div className="product-info-stagger opacity-0">
              {products.length > 1 && (
                <select
                  value={selectedProductId}
                  onChange={(event) => handleProductChange(event.target.value)}
                  className="mb-5 h-11 w-full max-w-sm rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1A4331] outline-none focus:border-[#1A4331]"
                >
                  {products.map((product) => (
                    <option key={product.id} value={String(product.id)}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              )}
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-black mb-4">
                {displayTitle}
              </h1>
              <p className="text-xl font-bold text-gray-900">{displayPrice}</p>
              {stockLabel && <p className="mt-2 text-sm text-[#1A4331]">{stockLabel}</p>}
            </div>

            <p className="product-info-stagger opacity-0 text-[#1A4331] text-sm leading-relaxed max-w-lg font-inter">
              {displayDescription}
            </p>

            <div className="product-info-stagger opacity-0 space-y-4">
              <h3 className="font-bold text-black">Benefits</h3>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#1A4331] font-inter">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1A4331] shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-info-stagger opacity-0 flex flex-wrap items-center gap-6 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors group"
                >
                  <Minus size={18} strokeWidth={3} className="text-[#1A4331] group-hover:scale-110 transition-transform" />
                </button>
                <div className="px-6 py-2 font-semibold text-gray-900 border-x border-gray-200">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors group"
                >
                  <Plus size={18} strokeWidth={3} className="text-[#1A4331] group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleBuyNow}
                disabled={!canOrder}
                className="flex-1 bg-[#1A4331] text-white font-bold py-3.5 px-10 rounded-lg hover:bg-[#1A4331]/90 transition-all shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Buy Now
              </button>

              <button className="p-3.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-[#1A4331]">
                <Heart size={20} />
              </button>
            </div>
            {statusMessage && <p className="product-info-stagger opacity-0 text-sm text-[#8A6E42]">{statusMessage}</p>}
          </div>
        </div>

        {/* Bottom: Description Section */}
        <div className="description-section mt-24 space-y-8">
          <div className="description-stagger opacity-0 space-y-4">
            <h2 className="text-xl font-bold text-black border-b border-gray-200 pb-4">Description</h2>
            <p className="text-[#1A4331] text-sm leading-relaxed max-w-4xl font-inter">
              {displayFullDescription}
            </p>
          </div>

          <button className="description-stagger opacity-0 bg-[#1A4331] text-white font-bold py-3.5 px-8 rounded-lg hover:bg-[#1A4331]/90 transition-all shadow-md active:scale-[0.98]">
            Try Recipes
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
