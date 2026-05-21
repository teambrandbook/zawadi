"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { addToGuestCart, getGuestCartCount } from "@/lib/guestCart";
import { setCartCount } from "@/redux/userSlice";

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

type ProductImageItem =
  | string
  | null
  | undefined
  | {
      image?: string | null;
      url?: string | null;
      image_url?: string | null;
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
  alternative_images?: ProductImageItem[];
  inner_images?: ProductImageItem[];
  images?: ProductImageItem[];
  product_images?: ProductImageItem[];
};

function productImageUrl(path: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  return getImageUrl(path);
}

function mainProductImage(product: Product): string {
  return productImageUrl(product.image);
}

function imagePathFromItem(item: ProductImageItem): string | null {
  if (!item) return null;
  if (typeof item === "string") return item;
  return item.image ?? item.image_url ?? item.url ?? null;
}

function productGalleryImages(product: Product): string[] {
  const imageItems: ProductImageItem[] = [
    ...(product.alternative_images ?? []),
    ...(product.inner_images ?? []),
    ...(product.images ?? []),
    ...(product.product_images ?? []),
  ];
  const gallery = new Set<string>([mainProductImage(product)]);

  imageItems
    .map(imagePathFromItem)
    .filter((image): image is string => Boolean(image))
    .map(productImageUrl)
    .forEach((image) => gallery.add(image));

  return Array.from(gallery);
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
  const [selectedImage, setSelectedImage] = useState("");
  const [mounted, setMounted] = useState(false);

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
      })
      .catch(() => {
        toast.error("Could not load product.");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    setSelectedImage(mainProductImage(product));
  }, [product]);

  async function handleAddToCart() {
    if (!product) return;
    if (!isAuthenticated) {
      const unitPrice = Number(
        product.selling_price ?? product.sale_price ?? product.base_price ?? 0
      );
      addToGuestCart({
        productId: product.id,
        quantity,
        productName: product.product_name,
        productSubtitle: product.product_subtitle,
        image: product.image,
        unitPrice,
        currency: product.currency || "INR",
      });
      dispatch(setCartCount(getGuestCartCount()));
      toast.success("Added to cart!");
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
  const stock = stockMessage(product);
  const benefits = product.health_benefits
    ? product.health_benefits.split("\n").filter(Boolean)
    : [];
  const galleryImages = productGalleryImages(product);
  const activeImage = selectedImage || mainProductImage(product);
  const thumbnailImages = galleryImages.filter((image) => image !== activeImage);

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left: Product Image */}
          <div className="space-y-6">
            <div
              className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-700 hover:shadow-2xl"
            >
              <Image
                src={activeImage}
                alt={product.product_name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            {thumbnailImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {thumbnailImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`View ${product.product_name} image ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100 transition hover:border-[#1A4331] hover:ring-2 hover:ring-[#1A4331]/20"
                  >
                    <Image
                      src={image}
                      alt={`${product.product_name} thumbnail ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="88px"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="mb-4 font-playfair text-4xl font-bold text-black md:text-5xl">
                {product.product_name}
              </h1>
              {product.product_subtitle && (
                <p className="text-base text-[#6b7280]">{product.product_subtitle}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {toCurrency(displayPrice, product.currency || "INR")}
                </p>
                {isDiscounted ? (
                  <>
                    <span className="text-base text-gray-400 line-through md:text-lg">
                      {toCurrency(product.mrp_price, product.currency || "INR")}
                    </span>
                    <span className="rounded-full bg-[#EAFBF0] px-2.5 py-1 text-xs font-semibold text-[#15803D] md:text-sm">
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
              <p className="max-w-lg font-inter text-sm leading-relaxed text-[#1A4331]">
                {product.short_description}
              </p>
            )}

            {benefits.length > 0 && (
              <div className="space-y-4">
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

            <div className="grid grid-cols-[auto_1fr] items-center gap-3 pt-4 sm:flex sm:flex-wrap sm:gap-6">
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
                className="col-span-2 row-start-2 flex w-full items-center justify-center rounded-lg bg-[#1A4331] px-8 py-3.5 text-center font-bold text-white shadow-lg transition-all hover:bg-[#1A4331]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1 sm:row-auto sm:w-auto sm:flex-1 sm:px-10"
              >
                {product.stock_quantity <= 0 || product.stock_status === "out_of_stock" ? "Out of Stock" : "Add To Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Full Description */}
        {product.full_description && (
          <div className="description-section mt-24 space-y-8">
            <div className="space-y-4">
              <h2 className="border-b border-gray-200 pb-4 text-xl font-bold text-black">
                Description
              </h2>
              <p className="max-w-4xl font-inter text-sm leading-relaxed text-[#1A4331]">
                {product.full_description}
              </p>
            </div>

            <Link
              href="/recipes"
              className="inline-block rounded-lg bg-[#1A4331] px-8 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#1A4331]/90 active:scale-[0.98]"
            >
              Try Recipes
            </Link>
          </div>
        )}


      </div>
    </section>
  );
};

export default ProductDetails;
