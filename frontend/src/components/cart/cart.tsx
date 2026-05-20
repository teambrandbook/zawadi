"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import api from "@/services/api";
import { toast } from "sonner";
import {
  getGuestCart,
  updateGuestCartQty,
  removeFromGuestCart,
  getGuestCartCount,
  type GuestCartItem,
} from "@/lib/guestCart";
import CheckoutAuthModal from "@/components/shared/CheckoutAuthModal";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_subtitle: string;
  category: string;
  image: string;
  unit_price: string;
  line_total: string;
  quantity: number;
  stock_quantity: number;
  currency: string;
};

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  free_shipping_unlocked: boolean;
};

type SuggestedProduct = {
  id: number;
  product_name: string;
  product_subtitle: string;
  category: string;
  image: string | null;
  base_price: string;
  sale_price: string | null;
  selling_price?: string | null;
  currency: string;
};

type ProductListResponse = SuggestedProduct[] | { results?: SuggestedProduct[] };

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(
  /\/api\/?$/,
  ""
);

function resolveProductImage(image?: string | null) {
  if (!image) return "/product/buckwheat.webp";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/media/")) return `${apiOrigin}${image}`;
  return image;
}

function QuantityControl({
  value,
  onDecrease,
  onIncrease,
  labels,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  labels: {
    decreaseQuantity: string;
    increaseQuantity: string;
  };
}) {
  return (
    <div className="inline-flex h-8 items-center rounded-full bg-[#f3f4f6] px-3 text-[#1f4d3a]">
      <button
        type="button"
        aria-label={labels.decreaseQuantity}
        onClick={onDecrease}
        className="flex size-5 items-center justify-center rounded-full transition hover:bg-white"
      >
        <Minus size={13} strokeWidth={2.8} />
      </button>
      <span className="min-w-8 text-center text-sm font-bold leading-5">{value}</span>
      <button
        type="button"
        aria-label={labels.increaseQuantity}
        onClick={onIncrease}
        className="flex size-5 items-center justify-center rounded-full transition hover:bg-white"
      >
        <Plus size={13} strokeWidth={2.8} />
      </button>
    </div>
  );
}

function CartRow({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  labels,
}: {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  labels: {
    remove: string;
    decreaseQuantity: string;
    increaseQuantity: string;
  };
}) {
  return (
    <article className="grid gap-4 rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:grid-cols-[108px_1fr] sm:p-6 lg:grid-cols-[108px_1fr_128px]">
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-[#f9fafb] sm:w-[108px]">
        <Image
          src={resolveProductImage(item.image)}
          alt={item.product_name}
          fill
          unoptimized
          sizes="108px"
          className="object-cover mix-blend-multiply"
        />
      </div>

      <div className="min-w-0 self-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between lg:block">
          <h2 className="text-base font-bold leading-7 text-[#1f4d3a]">{item.product_name}</h2>
          <p className="text-lg font-bold leading-7 text-[#1f4d3a] lg:hidden">
            {money.format(parseFloat(item.unit_price))}
          </p>
        </div>
        <p className="max-w-[650px] text-xs leading-5 text-[#6b7280] sm:text-sm">
          {item.product_subtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <QuantityControl value={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} labels={labels} />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] transition hover:text-red-600"
          >
            <Trash2 size={13} />
            {labels.remove}
          </button>
        </div>
      </div>

      <p className="hidden self-start justify-self-end pt-3 text-xl font-bold leading-7 text-[#1f4d3a] lg:block">
        {money.format(parseFloat(item.unit_price))}
      </p>
    </article>
  );
}

function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  onProceed,
  labels,
}: {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  onProceed?: () => void;
  labels: {
    orderSummary: string;
    subtotal: string;
    shipping: string;
    free: string;
    estimatedTax: string;
    total: string;
    proceedToPayment: string;
    secureCheckout: string;
  };
}) {
  return (
    <aside className="h-fit rounded-[20px] border border-[#f3f4f6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-bold leading-7 text-[#1f4d3a]">{labels.orderSummary}</h2>

      <div className="mt-7 space-y-5 text-sm">
        <div className="flex items-center justify-between text-[#6b7280]">
          <span>{labels.subtotal}</span>
          <span className="font-bold text-[#1f4d3a]">{money.format(parseFloat(subtotal))}</span>
        </div>
        <div className="flex items-center justify-between text-[#6b7280]">
          <span>{labels.shipping}</span>
          <span className="font-bold text-[#1f4d3a]">
            {parseFloat(shipping) === 0 ? labels.free : money.format(parseFloat(shipping))}
          </span>
        </div>
        <div className="flex items-center justify-between text-[#6b7280]">
          <span>{labels.estimatedTax}</span>
          <span className="font-bold text-[#1f4d3a]">{money.format(parseFloat(tax))}</span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#f3f4f6] pt-6">
        <span className="text-base font-bold text-[#1f4d3a]">{labels.total}</span>
        <span className="text-[28px] font-bold leading-9 text-[#1f4d3a]">{money.format(parseFloat(total))}</span>
      </div>

      {onProceed ? (
        <button
          type="button"
          onClick={onProceed}
          className="mt-7 flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-[#1f4d3a] px-6 text-sm font-bold text-white shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition hover:bg-[#1a4331] active:scale-[0.99]"
        >
          {labels.proceedToPayment}
          <ArrowRight size={17} />
        </button>
      ) : (
        <Link
          href="/payment"
          className="mt-7 flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-[#1f4d3a] px-6 text-sm font-bold text-white shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition hover:bg-[#1a4331] active:scale-[0.99]"
        >
          {labels.proceedToPayment}
          <ArrowRight size={17} />
        </Link>
      )}

      <p className="mt-6 text-center text-[10px] font-bold uppercase text-[#9ca3af]">
        {labels.secureCheckout}
      </p>
    </aside>
  );
}

function SuggestedCard({
  product,
  onAddToCart,
  labels,
}: {
  product: SuggestedProduct;
  onAddToCart: () => void;
  labels: {
    addProductToCart: string;
  };
}) {
  const displayPrice = parseFloat(product.selling_price || product.sale_price || product.base_price || "0");

  return (
    <article className="rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
      <div className="relative h-48 overflow-hidden rounded-xl bg-[#f9fafb]">
        <Link href={`/products/details?id=${product.id}`} className="block h-full w-full">
          <Image
            src={resolveProductImage(product.image)}
            alt={product.product_name}
            fill
            unoptimized
            sizes="(min-width: 1280px) 255px, (min-width: 768px) 30vw, 90vw"
            className="object-cover mix-blend-multiply transition duration-500 hover:scale-105"
          />
        </Link>
      </div>

      <Link href={`/products/details?id=${product.id}`}>
        <h3 className="mt-4 text-base font-bold leading-6 text-[#1f4d3a]">
          {product.product_name}
        </h3>
      </Link>
      <p className="mt-1 text-sm leading-5 text-[#6b7280]">
        {product.product_subtitle || product.category}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold leading-7 text-[#1f4d3a]">{money.format(displayPrice)}</p>
        <button
          type="button"
          onClick={onAddToCart}
          aria-label={labels.addProductToCart.replace("{name}", product.product_name)}
          className="flex size-10 items-center justify-center rounded-full border border-[#e5e7eb] text-[#1f4d3a] transition hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white"
        >
          <Plus size={16} strokeWidth={2.8} />
        </button>
      </div>
    </article>
  );
}

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { locale } = useLocale();
  const cartText = translations[locale]?.cartPage || translations.en.cartPage;
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SuggestedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  function guestToCartItem(g: GuestCartItem, index: number): CartItem {
    return {
      id: -(index + 1),
      product_id: g.productId,
      product_name: g.productName,
      product_subtitle: g.productSubtitle,
      category: "",
      image: g.image ?? "",
      unit_price: String(g.unitPrice),
      line_total: String(g.unitPrice * g.quantity),
      quantity: g.quantity,
      stock_quantity: 999,
      currency: g.currency,
    };
  }

  function updateCartState(data: { items?: CartItem[]; summary?: CartSummary | null }) {
    setItems(data.items ?? []);
    setSummary(data.summary ?? null);
  }

  async function fetchRelatedProducts(cartItems: CartItem[]) {
    const cartProductIds = new Set(cartItems.map((item) => item.product_id));
    const cartCategories = new Set(
      cartItems.map((item) => item.category).filter(Boolean).map((category) => category.toLowerCase())
    );

    if (cartCategories.size === 0) {
      setRelatedProducts([]);
      return;
    }

    try {
      const res = await api.get<ProductListResponse>("/products/");
      const products = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      const related = products
        .filter((product) => !cartProductIds.has(product.id))
        .filter((product) => cartCategories.has(String(product.category ?? "").toLowerCase()))
        .slice(0, 4);

      setRelatedProducts(related);
    } catch {
      setRelatedProducts([]);
    }
  }

  async function fetchCart() {
    try {
      const res = await api.get("/orders/cart/");
      const nextItems = res.data.items ?? [];
      updateCartState(res.data);
      await fetchRelatedProducts(nextItems);
    } catch {
      toast.error(cartText.loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setGuestItems(getGuestCart());
      setLoading(false);
    }
  }, [isAuthenticated]);

  async function handleQuantityChange(itemId: number, newQty: number) {
    if (newQty < 1) return;
    try {
      const res = await api.patch(`/orders/cart/items/${itemId}/`, { quantity: newQty });
      const nextItems = res.data.items ?? [];
      updateCartState(res.data);
      await fetchRelatedProducts(nextItems);
    } catch {
      toast.error(cartText.updateError);
    }
  }

  async function handleRemove(itemId: number) {
    try {
      const res = await api.delete(`/orders/cart/items/${itemId}/`);
      const nextItems = res.data.items ?? [];
      updateCartState(res.data);
      await fetchRelatedProducts(nextItems);
      toast.success(cartText.removeSuccess);
    } catch {
      toast.error(cartText.removeError);
    }
  }

  async function handleAddRelatedProduct(productId: number) {
    try {
      const res = await api.post("/orders/cart/items/", { product_id: productId, quantity: 1 });
      const nextItems = res.data.items ?? [];
      updateCartState(res.data);
      await fetchRelatedProducts(nextItems);
      toast.success(cartText.addSuccess);
    } catch {
      toast.error(cartText.addError);
    }
  }

  function handleGuestQuantityChange(productId: number, variantId: number | undefined, newQty: number) {
    if (newQty < 1) return;
    updateGuestCartQty(productId, variantId, newQty);
    setGuestItems(getGuestCart());
    dispatch(setCartCount(getGuestCartCount()));
  }

  function handleGuestRemove(productId: number, variantId?: number) {
    removeFromGuestCart(productId, variantId);
    setGuestItems(getGuestCart());
    dispatch(setCartCount(getGuestCartCount()));
    toast.success(cartText.removeSuccess);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        {cartText.loading}
      </div>
    );
  }

  if (!isAuthenticated) {
    const guestSubtotal = guestItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    if (guestItems.length === 0) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-[#0A4833]">{cartText.emptyTitle}</p>
          <Link href="/products" className="rounded-lg bg-[#0A4833] px-6 py-2 text-sm text-white">
            {cartText.shopNow}
          </Link>
        </div>
      );
    }

    return (
      <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-10">
            <section>
              <div className="mb-7 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold leading-9 text-[#1f4d3a]">{cartText.title}</h1>
                <p className="text-base font-medium leading-6 text-[#6b7280]">
                  {guestItems.length} {cartText.itemLabel}
                </p>
              </div>
              <div className="space-y-4">
                {guestItems.map((gItem, idx) => (
                  <CartRow
                    key={`${gItem.productId}-${gItem.variantId ?? "none"}`}
                    item={guestToCartItem(gItem, idx)}
                    onDecrease={() =>
                      handleGuestQuantityChange(gItem.productId, gItem.variantId, gItem.quantity - 1)
                    }
                    onIncrease={() =>
                      handleGuestQuantityChange(gItem.productId, gItem.variantId, gItem.quantity + 1)
                    }
                    onRemove={() => handleGuestRemove(gItem.productId, gItem.variantId)}
                    labels={cartText}
                  />
                ))}
              </div>
              <Link
                href="/products"
                className="mt-5 hidden items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-brand-green lg:inline-flex"
              >
                <ArrowLeft size={16} />
                {cartText.continueShopping}
              </Link>
            </section>

            <div className="lg:mt-16">
              <OrderSummary
                subtotal={String(guestSubtotal)}
                shipping="0"
                tax="0"
                total={String(guestSubtotal)}
                onProceed={() => setCheckoutModalOpen(true)}
                labels={cartText}
              />
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-brand-green lg:hidden"
              >
                <ArrowLeft size={16} />
                {cartText.continueShopping}
              </Link>
            </div>
          </div>
        </div>

        <CheckoutAuthModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
        />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-[#0A4833]">{cartText.emptyTitle}</p>
        <Link href="/products" className="rounded-lg bg-[#0A4833] px-6 py-2 text-sm text-white">
          {cartText.shopNow}
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-10">
          <section>
            <div className="mb-7 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold leading-9 text-[#1f4d3a]">{cartText.title}</h1>
              <p className="text-base font-medium leading-6 text-[#6b7280]">
                {items.length} {cartText.itemLabel}
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                  onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                  onRemove={() => handleRemove(item.id)}
                  labels={cartText}
                />
              ))}
            </div>

            <Link
              href="/products"
              className="mt-5 hidden items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-brand-green lg:inline-flex"
            >
              <ArrowLeft size={16} />
              {cartText.continueShopping}
            </Link>
          </section>

          <div className="lg:mt-16">
            {summary && (
              <OrderSummary
                subtotal={summary.subtotal}
                shipping={summary.shipping}
                tax={summary.tax}
                total={summary.total}
                labels={cartText}
              />
            )}
            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-brand-green lg:hidden"
            >
              <ArrowLeft size={16} />
              {cartText.continueShopping}
            </Link>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-10 lg:mt-14">
            <h2 className="text-2xl font-bold leading-8 text-[#1f4d3a]">{cartText.relatedTitle}</h2>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-3 sm:gap-5 lg:gap-6">
              {relatedProducts.map((product) => (
                <div key={product.id} className="min-w-0 flex-[0_0_calc((100%-1rem)/2)] md:flex-[0_0_calc((100%-2.5rem)/3)] lg:flex-[0_0_calc((100%-4.5rem)/4)]">
                  <SuggestedCard
                    product={product}
                    onAddToCart={() => handleAddRelatedProduct(product.id)}
                    labels={cartText}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
