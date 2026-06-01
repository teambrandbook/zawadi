"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  ChevronRight,
  CreditCard,
  MapPin,
  Plus,
} from "lucide-react";
import { FaCcApplePay, FaCcMastercard, FaCcPaypal, FaCcVisa } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import api from "@/services/api";
import { toast } from "sonner";
import { z } from "zod";
import type { AppDispatch } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import { getImageUrl } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";

// address field is named "address" (not "address_line") in the local form state
const checkoutSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z.string().min(7, "Enter a valid phone number").max(20, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(3, "Enter a valid postal code").max(20, "Enter a valid postal code"),
});

type SavedAddress = {
  id: number;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
};

type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_subtitle?: string;
  category?: string;
  image?: string | null;
  currency?: string;
  quantity: number;
  line_total: string | number;
};

type CartSummary = {
  item_count?: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  currency_code?: string;
  currency_decimal_places?: number;
};

type RelatedProduct = {
  id: number;
  product_name: string;
  product_subtitle?: string;
  category?: string;
  image?: string | null;
  base_price: string;
  sale_price?: string | null;
  selling_price?: string | number | null;
  currency?: string;
  currency_code?: string;
  currency_decimal_places?: number;
  stock_quantity?: number;
  stock_status?: string;
};

type ProductListResponse = RelatedProduct[] | { results?: RelatedProduct[] };

const emptySummary: CartSummary = {
  subtotal: "0.00",
  shipping: "0.00",
  tax: "0.00",
  total: "0.00",
};

const paymentIcons = [
  { label: "Visa", Icon: FaCcVisa, className: "text-[#1a1f71]" },
  { label: "Mastercard", Icon: FaCcMastercard, className: "text-[#eb001b]" },
  { label: "PayPal", Icon: FaCcPaypal, className: "text-[#003087]" },
  { label: "Apple Pay", Icon: FaCcApplePay, className: "text-[#111827]" },
];

function formatMoney(value: string | number, currency = "SAR", decimalPlaces = 2) {
  return formatPrice(value, currency, decimalPlaces);
}

function productImageUrl(path?: string | null): string {
  if (!path) return "/product/buckwheat.webp";
  return getImageUrl(path);
}

function productPrice(product: RelatedProduct): string | number {
  return product.selling_price ?? product.sale_price ?? product.base_price ?? 0;
}

function normalizePhone(value: string) {
  return value.trim().replace(/[^\d+]/g, "");
}

function firstApiErrorMessage(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(firstApiErrorMessage).find(Boolean) ?? "";
  }
  if (typeof value === "object") {
    const data = value as Record<string, unknown>;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.missing) && data.missing.length > 0) {
      return `Missing required fields: ${data.missing.join(", ")}`;
    }
    for (const [key, item] of Object.entries(data)) {
      if (key === "detail" || key === "missing") continue;
      const message = firstApiErrorMessage(item);
      if (message) return key === "non_field_errors" ? message : `${key}: ${message}`;
    }
  }
  return "";
}

function CheckoutBreadcrumb() {
  return (
    <nav aria-label="Checkout progress" className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
      <Link href="/cart" className="text-[#8B918A] transition hover:text-[#1f4d3a]">
        Cart
      </Link>
      <ChevronRight size={11} className="text-[#A6ADA5]" />
      <span className="text-[#1f4d3a]">Payment</span>
      <ChevronRight size={11} className="text-[#A6ADA5]" />
      <span className="text-[#A6ADA5]">Confirmation</span>
    </nav>
  );
}

function RelatedProductCard({
  product,
  onAddToCart,
}: {
  product: RelatedProduct;
  onAddToCart: () => void;
}) {
  const outOfStock = product.stock_status === "out_of_stock" || Number(product.stock_quantity ?? 1) <= 0;

  return (
    <article className="rounded-[12px] border border-[#ECEDE7] bg-white p-3 shadow-[0_10px_24px_rgba(15,65,45,0.06)]">
      <Link href={`/products/details?id=${product.id}`} className="block">
        <div className="relative flex h-[118px] items-center justify-center overflow-hidden rounded-[10px] bg-[#F6F7F5] p-4">
          <Image
            src={productImageUrl(product.image)}
            alt={product.product_name}
            fill
            unoptimized
            sizes="(min-width: 1024px) 220px, 90vw"
            className="object-cover mix-blend-multiply transition duration-500 hover:scale-105"
          />
        </div>
        <div className="mt-3">
          <h3 className="line-clamp-2 text-[12px] font-bold leading-4 text-[#143F2F]">{product.product_name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-[#8A928C]">
            {product.product_subtitle || product.category}
          </p>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[12px] font-bold leading-4 text-[#143F2F]">
          {formatMoney(productPrice(product), product.currency_code || product.currency || "SAR", product.currency_decimal_places ?? 2)}
        </p>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={outOfStock}
          aria-label={`Add ${product.product_name} to cart`}
          className="flex size-6 items-center justify-center rounded-full border border-[#DDE2DA] text-[#1f4d3a] transition hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#DDE2DA] disabled:hover:bg-white disabled:hover:text-[#1f4d3a]"
        >
          <Plus size={11} strokeWidth={2.8} />
        </button>
      </div>
    </article>
  );
}

export default function Payment() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>(emptySummary);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    instructions: "",
  });

  useEffect(() => {
    api
      .get("/community/addresses/")
      .then((res) => {
        setSavedAddresses(res.data ?? []);
        if (res.data?.length > 0) {
          setSelectedAddressId(res.data[0].id);
        } else {
          setShowForm(true);
        }
      })
      .catch(() => {
        setShowForm(true);
      });

    fetchCart();
  }, []);

  async function fetchRelatedProducts(nextCartItems: CartItem[]) {
    const primaryCategory = String(nextCartItems[0]?.category ?? "").toLowerCase();

    if (!primaryCategory) {
      setRelatedProducts([]);
      return;
    }

    const cartProductIds = new Set(nextCartItems.map((item) => item.product_id).filter(Boolean));

    try {
      const res = await api.get<ProductListResponse>("/products/");
      const products = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      const related = products
        .filter((product) => !cartProductIds.has(product.id))
        .filter((product) => String(product.category ?? "").toLowerCase() === primaryCategory)
        .slice(0, 4);

      setRelatedProducts(related);
    } catch {
      setRelatedProducts([]);
    }
  }

  async function fetchCart() {
    try {
      const res = await api.get<{ items?: CartItem[]; summary?: CartSummary }>("/orders/cart/");
      const nextItems = res.data.items ?? [];
      const nextSummary = res.data.summary ?? emptySummary;

      setCartItems(nextItems);
      setCartSummary(nextSummary);
      dispatch(setCartCount(nextSummary.item_count ?? nextItems.length));
      await fetchRelatedProducts(nextItems);
    } catch {
      setCartItems([]);
      setCartSummary(emptySummary);
      setRelatedProducts([]);
    }
  }

  async function handleAddRelatedProduct(productId: number) {
    try {
      const res = await api.post("/orders/cart/items/", { product_id: productId, quantity: 1 });
      toast.success("Added to cart.");
      dispatch(setCartCount(res.data.summary?.item_count ?? 0));
      await fetchCart();
    } catch {
      toast.error("Could not add product to cart.");
    }
  }

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder() {
    // Validate the new-address form only when the user is entering a new address
    if (showForm) {
      const result = checkoutSchema.safeParse({
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code,
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
    }

    setSubmitting(true);
    try {
      const cartRes = await api.get("/orders/cart/");
      const cartItems = cartRes.data?.items ?? [];
      if (cartItems.length === 0) {
        toast.error("Your cart is empty. Add products before checkout.");
        router.push("/cart");
        return;
      }

      const meRes = await api.get("/account/me/");
      let addressPayload = form;

      if (selectedAddressId && !showForm) {
        const addr = savedAddresses.find((a) => a.id === selectedAddressId);
        if (addr) {
          addressPayload = {
            full_name: addr.full_name || meRes.data.full_name || "",
            phone: addr.phone || meRes.data.phone || "",
            address: addr.address_line,
            city: addr.city,
            postal_code: addr.postal_code,
            instructions: "",
          };
        }
      } else if (saveAddress) {
        try {
          await api.post("/community/addresses/", {
            full_name: form.full_name.trim(),
            phone: normalizePhone(form.phone),
            address_line: form.address.trim(),
            city: form.city.trim(),
            postal_code: form.postal_code.trim(),
          });
        } catch {
          toast.warning("Address could not be saved, but checkout will continue.");
        }
      }

      const requiredDeliveryFields = [
        addressPayload.full_name,
        addressPayload.phone,
        addressPayload.address,
        addressPayload.city,
        addressPayload.postal_code,
      ];
      if (requiredDeliveryFields.some((value) => !String(value ?? "").trim())) {
        toast.error("Please complete all delivery details before placing the order.");
        setShowForm(true);
        return;
      }

      const res = await api.post("/orders/cart/checkout/", {
        full_name: addressPayload.full_name.trim(),
        phone: normalizePhone(addressPayload.phone),
        email: meRes.data.email,
        city: addressPayload.city.trim(),
        postal_code: addressPayload.postal_code.trim(),
        address: addressPayload.address.trim(),
        instructions: addressPayload.instructions?.trim() || "",
        payment_method: "cod",
      });

      const createdOrderId = res.data?.primary_order_id ?? res.data?.order_id ?? res.data?.order_ids?.[0];
      if (!createdOrderId) {
        toast.error("Order was created, but confirmation details were not returned.");
        return;
      }

      dispatch(setCartCount(0));
      router.replace(`/orderplaced?order_id=${encodeURIComponent(createdOrderId)}`);
    } catch (err: unknown) {
      const data =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: unknown } }).response?.data
          : null;
      const msg = firstApiErrorMessage(data) || "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-24 pt-28 sm:px-6 md:pt-36 lg:px-12 xl:px-24">
      <div className="mx-auto max-w-[980px]">
        <CheckoutBreadcrumb />

        <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="space-y-5">
            <header>
              <h1 className="text-[24px] font-bold leading-8 text-[#1f4d3a]">Payment Method</h1>
              <p className="mt-1 text-[12px] leading-5 text-[#7C857E]">
                Complete your purchase by providing your delivery details.
              </p>
            </header>

            <section className="rounded-[14px] border border-[#ECEDE7] bg-white p-4 shadow-[0_12px_28px_rgba(15,65,45,0.07)] sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[13px] font-bold leading-5 text-[#143F2F]">Shipping Address</h2>
                {savedAddresses.length > 0 && !showForm && (
                  <button
                    type="button"
                    onClick={() => { setShowForm(true); setSelectedAddressId(null); }}
                    className="inline-flex items-center gap-1 self-start text-[11px] font-bold text-[#1f4d3a] transition hover:text-[#1a4331]"
                  >
                    <Plus size={12} strokeWidth={2.8} />
                    Add New Address
                  </button>
                )}
              </div>

              {savedAddresses.length > 0 && !showForm && (
                <div className="mt-3">
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-3 py-3 transition-all ${
                          selectedAddressId === addr.id
                            ? "border-[#D7E5DC] bg-[#F7FAF6]"
                            : "border-[#ECEDE7] bg-[#F8F9F7]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="saved_address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 accent-[#0a4833]"
                        />
                        <MapPin size={14} className="mt-0.5 shrink-0 text-[#1f4d3a]" />
                        <div className="text-[11px] leading-4 text-[#6B746E]">
                          <p className="font-bold text-[#143F2F]">{addr.label || "Saved Address"}</p>
                          <p className="mt-0.5">
                            {addr.full_name} - {addr.phone}
                          </p>
                          <p>
                            {addr.address_line}, {addr.city} - {addr.postal_code}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {showForm && (
                <div className="mt-4 space-y-3">
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setSelectedAddressId(savedAddresses[0].id); }}
                      className="text-[11px] font-semibold text-[#0a4833] underline"
                    >
                      Use a saved address
                    </button>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[11px] font-medium leading-4 text-[#66706A]">Full Name</span>
                      <span className="mt-1.5 flex min-h-[42px] items-center rounded-[9px] border border-[#E7EAE5] bg-[#F7F8F7] px-3 py-2 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-[12px] leading-5 text-[#1f4d3a] outline-none placeholder:text-[#A0A7A2]"
                          placeholder="Jane Doe"
                          value={form.full_name}
                          onChange={(e) => handleFormChange("full_name", e.target.value)}
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-medium leading-4 text-[#66706A]">Phone</span>
                      <span className="mt-1.5 flex min-h-[42px] items-center rounded-[9px] border border-[#E7EAE5] bg-[#F7F8F7] px-3 py-2 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-[12px] leading-5 text-[#1f4d3a] outline-none placeholder:text-[#A0A7A2]"
                          placeholder="+91 9876543210"
                          value={form.phone}
                          onChange={(e) => handleFormChange("phone", e.target.value)}
                        />
                      </span>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[11px] font-medium leading-4 text-[#66706A]">Address</span>
                    <span className="mt-1.5 flex min-h-[42px] items-center rounded-[9px] border border-[#E7EAE5] bg-[#F7F8F7] px-3 py-2 focus-within:border-[#1f4d3a]">
                      <input
                        className="min-w-0 flex-1 bg-transparent text-[12px] leading-5 text-[#1f4d3a] outline-none placeholder:text-[#A0A7A2]"
                        placeholder="123 Main Street"
                        value={form.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                      />
                    </span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[11px] font-medium leading-4 text-[#66706A]">City</span>
                      <span className="mt-1.5 flex min-h-[42px] items-center rounded-[9px] border border-[#E7EAE5] bg-[#F7F8F7] px-3 py-2 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-[12px] leading-5 text-[#1f4d3a] outline-none placeholder:text-[#A0A7A2]"
                          placeholder="Mumbai"
                          value={form.city}
                          onChange={(e) => handleFormChange("city", e.target.value)}
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-medium leading-4 text-[#66706A]">Postal Code</span>
                      <span className="mt-1.5 flex min-h-[42px] items-center rounded-[9px] border border-[#E7EAE5] bg-[#F7F8F7] px-3 py-2 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-[12px] leading-5 text-[#1f4d3a] outline-none placeholder:text-[#A0A7A2]"
                          placeholder="400001"
                          value={form.postal_code}
                          onChange={(e) => handleFormChange("postal_code", e.target.value)}
                        />
                      </span>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[11px] font-medium leading-4 text-[#66706A]">Delivery Instructions (optional)</span>
                    <span className="mt-1.5 flex min-h-[42px] items-center rounded-[9px] border border-[#E7EAE5] bg-[#F7F8F7] px-3 py-2 focus-within:border-[#1f4d3a]">
                      <input
                        className="min-w-0 flex-1 bg-transparent text-[12px] leading-5 text-[#1f4d3a] outline-none placeholder:text-[#A0A7A2]"
                        placeholder="Leave at door, etc."
                        value={form.instructions}
                        onChange={(e) => handleFormChange("instructions", e.target.value)}
                      />
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="size-3.5 accent-[#0a4833]"
                    />
                    <span className="text-[11px] leading-4 text-[#66706A]">Save address for future purchases</span>
                  </label>
                </div>
              )}
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex min-h-[72px] items-center justify-center gap-2 rounded-[12px] border border-[#1f4d3a] bg-white px-4 text-center text-[#1f4d3a] shadow-[0_8px_18px_rgba(15,65,45,0.04)]">
                <Banknote size={18} />
                <div>
                  <p className="text-[12px] font-bold leading-4">COD</p>
                  <p className="text-[10px] leading-4 text-[#8A928C]">Pay on delivery</p>
                </div>
              </div>
              <div className="flex min-h-[72px] items-center justify-center gap-2 rounded-[12px] border border-[#E7EAE5] bg-white px-4 text-center text-[#9AA39D] shadow-[0_8px_18px_rgba(15,65,45,0.04)]">
                <CreditCard size={18} />
                <div>
                  <p className="text-[12px] font-bold leading-4">Card</p>
                  <p className="text-[10px] leading-4">Coming soon</p>
                </div>
              </div>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-[12px] font-bold leading-5 text-[#1f4d3a] transition hover:text-[#1a4331]"
            >
              <ArrowLeft size={13} />
              Back to Cart
            </Link>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <section className="rounded-[14px] border border-[#ECEDE7] bg-white p-5 shadow-[0_16px_36px_rgba(15,65,45,0.08)]">
              <h2 className="text-[16px] font-bold leading-6 text-[#143F2F]">Order Summary</h2>

              <div className="mt-5 space-y-3 text-[11px] leading-4 text-[#7C857E]">
                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#143F2F]">{formatMoney(cartSummary.subtotal, cartSummary.currency_code, cartSummary.currency_decimal_places)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Shipping</span>
                  <span className="font-bold text-[#143F2F]">
                    {Number(cartSummary.shipping) === 0 ? "Free" : formatMoney(cartSummary.shipping, cartSummary.currency_code, cartSummary.currency_decimal_places)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-[#143F2F]">{formatMoney(cartSummary.tax, cartSummary.currency_code, cartSummary.currency_decimal_places)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-[9px] bg-[#F5F7F4] p-1.5">
                <input
                  aria-label="Promo code"
                  placeholder="Promo code"
                  className="min-w-0 flex-1 bg-transparent px-2 text-[11px] text-[#143F2F] outline-none placeholder:text-[#A3AAA5]"
                />
                <button type="button" className="rounded-[7px] bg-[#1f4d3a] px-3 py-1.5 text-[10px] font-bold text-white">
                  Apply
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#ECEDE7] pt-4">
                <span className="text-[12px] font-bold text-[#143F2F]">Total</span>
                <span className="text-[22px] font-bold leading-7 text-[#1f4d3a]">{formatMoney(cartSummary.total, cartSummary.currency_code, cartSummary.currency_decimal_places)}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="mt-4 flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#1f4d3a] text-[12px] font-bold text-white transition hover:bg-[#1a4331] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Placing Order..." : "Complete Payment"}
                {!submitting && <ArrowRight size={13} />}
              </button>

              <div
                className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[#9AA39D]"
                aria-label="Accepted payment methods"
              >
                {paymentIcons.map(({ label, Icon, className }) => (
                  <span
                    key={label}
                    className="inline-flex h-4 min-w-5 items-center justify-center"
                    title={label}
                    aria-label={label}
                  >
                    <Icon className={`text-base opacity-45 ${className}`} aria-hidden="true" />
                  </span>
                ))}
              </div>
            </section>

            {cartItems[0] ? (
              <section className="rounded-[12px] border border-[#ECEDE7] bg-white p-3 shadow-[0_10px_24px_rgba(15,65,45,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-[8px] bg-[#F5F7F4]">
                    <Image
                      src={productImageUrl(cartItems[0].image)}
                      alt={cartItems[0].product_name}
                      fill
                      unoptimized
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold leading-4 text-[#143F2F]">{cartItems[0].product_name}</p>
                    <p className="text-[10px] leading-4 text-[#8A928C]">Quantity: {cartItems[0].quantity}</p>
                  </div>
                  <p className="text-[10px] font-bold text-[#143F2F]">{formatMoney(cartItems[0].line_total, cartItems[0].currency)}</p>
                </div>
                {cartItems.length > 1 ? (
                  <p className="mt-2 text-center text-[10px] text-[#8A928C]">+{cartItems.length - 1} more item{cartItems.length > 2 ? "s" : ""}</p>
                ) : null}
              </section>
            ) : null}
          </aside>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-14 pt-2">
            <h2 className="text-[16px] font-bold leading-6 text-[#143F2F]">
              Complete your order with these
            </h2>
            <div className="mt-5 flex gap-3 overflow-x-auto pb-3 sm:gap-4">
              {relatedProducts.map((product) => (
                <div key={product.id} className="min-w-0 flex-[0_0_calc((100%-0.75rem)/2)] md:flex-[0_0_calc((100%-2rem)/3)] lg:flex-[0_0_calc((100%-3rem)/4)]">
                  <RelatedProductCard
                    product={product}
                    onAddToCart={() => handleAddRelatedProduct(product.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
