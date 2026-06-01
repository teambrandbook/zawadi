"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
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
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type Product = {
  id: number;
  product_name: string;
  product_subtitle: string;
  short_description?: string;
  category: string;
  base_price: string;
  sale_price: string | null;
  mrp_price?: string | number;
  selling_price?: string | number;
  display_price?: string | number;
  currency_code?: string;
  currency_decimal_places?: number;
  discount_percent?: string | number;
  average_rating?: string | number | null;
  review_count?: number;
  image: string | null;
  stock_status: string;
  stock_quantity: number;
  created_at?: string;
};

type ProductCardStrings = typeof translations.en.productsPage.productCards;

function productImageUrl(path: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  return getImageUrl(path);
}

function RatingStars({ averageRating, reviewCount }: { averageRating?: string | number | null; reviewCount?: number }) {
  const rating = Number(averageRating ?? 0);
  const roundedRating = Math.round(rating);
  const hasReviews = Boolean(reviewCount);

  return (
    <div
      className="flex flex-wrap items-center gap-x-1.5 gap-y-1"
      aria-label={hasReviews ? `Rated ${rating.toFixed(1)} out of 5 from ${reviewCount} reviews` : "No reviews yet"}
    >
      <span className="flex items-center gap-0.5 text-[#f2c94c]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={cn(index < roundedRating ? "fill-current" : "fill-transparent", "stroke-current")}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-[#6b7280]">
        {hasReviews ? `${rating.toFixed(1)} (${reviewCount} review${reviewCount === 1 ? "" : "s"})` : "No reviews yet"}
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

function formatCategoryLabel(category: string): string {
  return category
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ProductCard({
  product,
  onAddToCart,
  strings,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  strings: ProductCardStrings;
}) {
  const router = useRouter();
  const detailHref = `/products/details?id=${product.id}`;
  const price = product.selling_price ?? product.sale_price ?? product.base_price;
  const mrp = Number(product.mrp_price ?? 0);
  const selling = Number(price);
  const discounted = mrp > selling;
  const outOfStock = product.stock_status === "out_of_stock" || product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 5;
  const badgeText = isNewProduct(product.created_at) ? strings.newBadge : formatCategoryLabel(product.category);
  const description = product.short_description || product.product_subtitle || "";

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(detailHref)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(detailHref);
        }
      }}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30 sm:p-3.5 lg:rounded-3xl lg:p-4 xl:p-5"
    >
      <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f8f8f8] lg:mb-4 lg:rounded-2xl">
        <Image
          src={productImageUrl(product.image)}
          alt={product.product_name}
          fill
          unoptimized
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 30vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#f2c94c] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black sm:left-3 sm:top-3 sm:text-[10px] lg:left-4 lg:top-4 lg:px-3 lg:py-1 lg:text-[11px]">
          {badgeText}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2 lg:gap-4">
          <h2 className="min-w-0 text-[14px] font-bold capitalize leading-tight text-[#1a1a1a] sm:text-[16px] lg:text-[19px] xl:text-[21px]">
            {product.product_name}
          </h2>
          <div className="flex flex-col items-end">
            <span className="whitespace-nowrap text-[14px] font-bold leading-tight text-[#1a1a1a] sm:text-[16px] lg:text-[19px] xl:text-[21px]">
              {product.display_price
                ? formatPrice(product.display_price, product.currency_code || "SAR", product.currency_decimal_places || 2)
                : formatPrice(price, "SAR")}
            </span>
            <span className="text-xs text-gray-400">incl. VAT</span>
          </div>
        </div>
        {discounted ? (
          <div className="mt-1 flex flex-wrap items-center gap-1.5 lg:gap-2">
            <span className="text-xs text-[#9ca3af] line-through lg:text-sm">
              {formatPrice(product.mrp_price ?? price, product.currency_code || "SAR", product.currency_decimal_places || 2)}
            </span>
            <span className="text-xs font-bold text-[#15803D]">
              {Number(product.discount_percent ?? 0).toFixed(0)}% {strings.off}
            </span>
          </div>
        ) : null}

        <div className="mt-2.5">
          <RatingStars averageRating={product.average_rating} reviewCount={product.review_count ?? 0} />
        </div>

        {description ? (
          <p className="mt-2.5 line-clamp-2 text-[12px] leading-[1.5] text-[#6b7280] lg:mt-3 lg:text-[13px] lg:leading-[1.55]">
            {description}
          </p>
        ) : null}
        <p className={`mt-2.5 text-xs font-semibold ${outOfStock ? "text-red-600" : lowStock ? "text-[#EA580C]" : "text-[#16A34A]"}`}>
          {outOfStock ? strings.outOfStock : lowStock ? strings.onlyLeft.replace("{count}", String(product.stock_quantity)) : strings.inStock}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3.5 lg:flex-row lg:pt-5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart(product);
            }}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1f4d3a] py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-brand-green active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#9CA3AF] sm:text-[13px] lg:gap-2 lg:py-3 lg:text-[14px] xl:text-[15px]"
          >
            <FaBagShopping size={16} />
            {outOfStock ? strings.outOfStockButton : strings.addToCart}
          </button>
          <Link
            href={detailHref}
            onClick={(event) => event.stopPropagation()}
            className="flex items-center justify-center rounded-full border border-[#1f4d3a] px-3 py-2.5 text-xs font-bold text-[#1f4d3a] transition hover:bg-[#1f4d3a] hover:text-white lg:px-4 lg:py-3 lg:text-sm"
          >
            {strings.view}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProductCards() {
  const { locale } = useLocale();
  const strings = translations[locale]?.productsPage?.productCards || translations.en.productsPage.productCards;
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
      .catch(() => toast.error(strings.loadError))
      .finally(() => setLoading(false));
  }, [strings.loadError]);

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
        currency: product.currency_code || "SAR",
      });
      dispatch(setCartCount(getGuestCartCount()));
      toast.success(strings.addSuccess);
      return;
    }

    try {
      const res = await api.post("/orders/cart/items/", { product_id: product.id, quantity: 1 });
      toast.success(strings.addSuccess);
      dispatch(setCartCount(res.data.summary?.item_count ?? 0));
    } catch {
      toast.error(strings.addError);
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
          {strings.loading}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fffef5] px-4 py-20 sm:px-6 lg:px-20">
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
                {category === "All Products" ? strings.allProducts : formatCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-9 flex min-h-50 items-center justify-center text-sm text-[#6b7280]">
            {strings.noProducts}
          </div>
        ) : (
          <div className="mt-9 grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 md:gap-x-5 md:gap-y-12 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-16">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} strings={strings} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
