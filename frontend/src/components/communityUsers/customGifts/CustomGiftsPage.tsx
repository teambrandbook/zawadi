"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Crown, Package, Search, Loader2 } from "lucide-react";
import api from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApiProduct = {
  id: number;
  name?: string;
  product_name?: string;
  description?: string;
  short_description?: string;
  image: string | null;
  // backend may return variants with price/weight; fall back gracefully
  variants?: Array<{
    id: number;
    variant_name?: string;
    weight?: string;
    price?: number | string;
  }>;
  price?: number | string;
  base_price?: number | string;
  sale_price?: number | string;
  weight?: string;
};

type CartProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

type BoxSize = {
  id: "small" | "large";
  name: string;
  description: string;
  capacity: string;
  capacityGrams: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const giftBoxSizes: BoxSize[] = [
  {
    id: "small",
    name: "0.5 KG Gift Box",
    description: "Perfect for sharing the wellness starter gift",
    capacity: "500g",
    capacityGrams: 500,
  },
  {
    id: "large",
    name: "1 KG Gift Box",
    description: "Ideal for comprehensive wellness journey gifts",
    capacity: "1000g",
    capacityGrams: 1000,
  },
];

const BOX_PRICES: Record<"small" | "large", number> = {
  small: 249,
  large: 449,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGrams(size: string): number {
  const match = size.match(/(\d+(?:\.\d+)?)\s*(kg|g)/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  return match[2].toLowerCase() === "kg" ? value * 1000 : value;
}

function formatPrice(p: number | string | undefined): number {
  if (p === undefined || p === null) return 0;
  return typeof p === "string" ? parseFloat(p) || 0 : p;
}

function mapApiProduct(p: ApiProduct): CartProduct {
  const firstVariant = p.variants?.[0];
  const productName = p.name ?? p.product_name ?? "ZEWADI Product";
  const size = firstVariant?.weight ?? firstVariant?.variant_name ?? p.weight ?? "250g";
  const price = formatPrice(firstVariant?.price ?? p.sale_price ?? p.price ?? p.base_price);
  return {
    id: p.id,
    name: productName,
    description: p.description ?? p.short_description ?? "",
    image: p.image ?? "/product/product-1.webp",
    size,
    price,
    quantity: 0,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomGiftsPage() {
  const router = useRouter();

  // Box size selection
  const [selectedBox, setSelectedBox] = useState<BoxSize>(giftBoxSizes[0]);

  // Products from API
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");

  // Personal message
  const [message, setMessage] = useState("");

  // Recipient info
  const [recipient, setRecipient] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    postalCode: "",
    address: "",
    occasion: "Birthday",
  });

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Load products from API ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    api
      .get("/products/")
      .then((res) => {
        if (cancelled) return;
        const raw: ApiProduct[] = Array.isArray(res.data)
          ? res.data
          : res.data?.results ?? [];
        setProducts(raw.map(mapApiProduct));
      })
      .catch(() => {
        if (!cancelled) setProductsError("Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const addedProducts = products.filter((p) => p.quantity > 0);

  const usedGrams = addedProducts.reduce(
    (acc, p) => acc + parseGrams(p.size) * p.quantity,
    0
  );
  const remainingGrams = Math.max(0, selectedBox.capacityGrams - usedGrams);
  const capacityPercent = Math.min(
    100,
    Math.round((usedGrams / selectedBox.capacityGrams) * 100)
  );

  const packPrice = BOX_PRICES[selectedBox.id];
  const productsTotal = addedProducts.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );
  const totalPrice = packPrice + productsTotal;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Product actions ────────────────────────────────────────────────────────

  const changeQuantity = useCallback((id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
      )
    );
  }, []);

  // ── Recipient field helper ─────────────────────────────────────────────────

  const onRecipientChange = (
    field: keyof typeof recipient,
    value: string
  ) => {
    setRecipient((prev) => ({ ...prev, [field]: value }));
  };

  // ── Submit order ───────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!recipient.fullName.trim()) {
      setSubmitError("Please enter the recipient's name.");
      return;
    }
    if (!recipient.phone.trim()) {
      setSubmitError("Please enter a phone number.");
      return;
    }
    if (!recipient.email.trim()) {
      setSubmitError("Please enter an email address.");
      return;
    }
    if (!recipient.address.trim()) {
      setSubmitError("Please enter a delivery address.");
      return;
    }
    if (addedProducts.length === 0) {
      setSubmitError("Please add at least one product to your gift box.");
      return;
    }

    const productSummary = addedProducts
      .map((p) => `${p.name} x${p.quantity}`)
      .join(", ");

    const payload = {
      product_name: `Custom Gift Box — ${productSummary}`,
      pack_name: selectedBox.name,
      pack_price: packPrice.toFixed(2),
      quantity: 1,
      subtotal: totalPrice.toFixed(2),
      delivery_charge: "0.00",
      total_amount: totalPrice.toFixed(2),
      full_name: recipient.fullName,
      phone: recipient.phone,
      email: recipient.email,
      city: recipient.city,
      postal_code: recipient.postalCode,
      address: recipient.address,
      instructions: message
        ? `Occasion: ${recipient.occasion}. Message: ${message}`
        : `Occasion: ${recipient.occasion}`,
      payment_method: "cod",
    };

    setSubmitting(true);
    try {
      await api.post("/orders/create/", payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/communityDashBoard/myorders");
      }, 2000);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: Record<string, string[]> | string };
      };
      const data = error.response?.data;
      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setSubmitError(messages);
      } else {
        setSubmitError("Failed to place order. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="flex-1 p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="rounded-lg border border-[#E8E8E8] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#06402B]">
                Customize Your Gift Box
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a personalized wellness gift box by choosing the box size
                and filling it with your preferred ZEWADI products.
              </p>
            </div>
            <span className="inline-flex h-8 items-center gap-2 rounded-md bg-[#A88751] px-4 text-xs font-semibold text-white shadow-sm">
              <Crown className="h-4 w-4" />
              Member Exclusive
            </span>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left Column ── */}
          <div className="flex-1 space-y-6">
            {/* Box Size */}
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#06402B] mb-4">
                Choose Your Gift Box Size
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {giftBoxSizes.map((box) => {
                  const isSelected = selectedBox.id === box.id;
                  return (
                    <article
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      className={`rounded-lg border-2 p-5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#A88751] bg-[#FBF8F1]"
                          : "border-[#DADDE1] bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                            isSelected
                              ? "bg-[#A88751] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Package className="h-6 w-6" />
                        </span>
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-[#A88751] bg-[#A88751] text-white"
                              : "border-gray-300 text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                      </div>
                      <h3 className="mt-5 text-base font-bold text-gray-900">
                        {box.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">
                        {box.description}
                      </p>
                      <p className="mt-5 text-xs font-semibold text-[#A88751]">
                        Capacity: {box.capacity}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Product Selection */}
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-[#06402B]">
                  Select Products
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search product..."
                    className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B] transition-all"
                  />
                </div>
              </div>

              {productsLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm">Loading products…</span>
                </div>
              ) : productsError ? (
                <p className="text-sm text-red-600 py-8 text-center">
                  {productsError}
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">
                  No products found.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className={`rounded-xl border bg-white p-4 transition-all hover:shadow-md ${
                        product.quantity > 0
                          ? "border-[#A88751] ring-1 ring-[#A88751]"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="relative h-40 overflow-hidden rounded-lg bg-gray-50 mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                          {product.size}
                        </span>
                        {product.price > 0 && (
                          <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-[#06402B]">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      {product.quantity > 0 ? (
                        <div className="mt-4 flex h-9 items-center justify-between rounded-lg border border-[#A88751] bg-[#FBF8F1] px-3">
                          <button
                            onClick={() => changeQuantity(product.id, -1)}
                            className="text-[#A88751] hover:bg-[#A88751] hover:text-white rounded w-6 h-6 flex items-center justify-center transition-colors font-bold"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-[#06402B]">
                            Added ({product.quantity})
                          </span>
                          <button
                            onClick={() => changeQuantity(product.id, 1)}
                            className="text-[#A88751] hover:bg-[#A88751] hover:text-white rounded w-6 h-6 flex items-center justify-center transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => changeQuantity(product.id, 1)}
                          className="mt-4 h-9 w-full rounded-lg bg-[#06402B] text-sm font-semibold text-white hover:bg-[#053020] transition-colors shadow-sm"
                        >
                          Add to Box
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:w-96 space-y-6">
            <section className="rounded-lg border border-[#DFDFDF] bg-white p-6 shadow-sm sticky top-6">
              <div className="space-y-6">
                {/* Capacity bar */}
                <div>
                  <h2 className="text-base font-bold text-[#06402B] mb-4">
                    Box Capacity
                  </h2>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span>Used: {usedGrams}g</span>
                    <span>Remaining: {remainingGrams}g</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#A88751] transition-all duration-300"
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400 italic">
                    {remainingGrams > 0
                      ? `You can still add ${remainingGrams}g to your gift box`
                      : "Your gift box is full!"}
                  </p>
                </div>

                {/* Personal message */}
                <div className="border-t pt-6">
                  <h2 className="text-base font-bold text-[#06402B] mb-4">
                    Personal Message
                  </h2>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a heartfelt message..."
                    className="h-28 w-full resize-none rounded-lg border border-gray-200 p-4 text-sm outline-none focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B] transition-all bg-gray-50"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Wellness wishes", "Happy Birthday", "Thank you"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            setMessage((prev) =>
                              prev ? `${prev} ${tag}` : tag
                            )
                          }
                          className="rounded-full bg-[#FBF8F1] border border-[#E9DFCC] px-3 py-1 text-[10px] font-bold text-[#A88751] hover:bg-[#E9DFCC] transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Recipient details */}
                <div className="border-t pt-6">
                  <h2 className="text-base font-bold text-[#06402B] mb-4">
                    Recipient Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Recipient Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={recipient.fullName}
                        onChange={(e) =>
                          onRecipientChange("fullName", e.target.value)
                        }
                        placeholder="Name"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={recipient.phone}
                        onChange={(e) =>
                          onRecipientChange("phone", e.target.value)
                        }
                        placeholder="Phone"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={recipient.email}
                        onChange={(e) =>
                          onRecipientChange("email", e.target.value)
                        }
                        placeholder="Email"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={recipient.city}
                        onChange={(e) =>
                          onRecipientChange("city", e.target.value)
                        }
                        placeholder="City"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={recipient.postalCode}
                        onChange={(e) =>
                          onRecipientChange("postalCode", e.target.value)
                        }
                        placeholder="Postal Code"
                        className="h-10 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={recipient.address}
                        onChange={(e) =>
                          onRecipientChange("address", e.target.value)
                        }
                        placeholder="Address"
                        className="h-20 w-full resize-none rounded-lg border border-gray-200 p-4 text-sm outline-none focus:border-[#06402B] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">
                        Occasion
                      </label>
                      <select
                        value={recipient.occasion}
                        onChange={(e) =>
                          onRecipientChange("occasion", e.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-[#06402B]"
                      >
                        <option>Birthday</option>
                        <option>Thank You</option>
                        <option>Wellness Gift</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price summary */}
                {addedProducts.length > 0 && (
                  <div className="border-t pt-4 space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Box ({selectedBox.name})</span>
                      <span>₹{packPrice}</span>
                    </div>
                    {addedProducts.map((p) => (
                      <div key={p.id} className="flex justify-between text-xs text-gray-500">
                        <span>
                          {p.name} x{p.quantity}
                        </span>
                        <span>₹{(p.price * p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-[#06402B] border-t pt-1 mt-1">
                      <span>Total</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Feedback messages */}
                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    Order placed successfully! Redirecting to your orders…
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2 font-semibold">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || submitSuccess}
                    className="h-12 w-full rounded-lg bg-[#06402B] text-sm text-white hover:bg-[#053020] transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      "Continue to Checkout"
                    )}
                  </button>
                  <button
                    onClick={() => router.push("/communityDashBoard")}
                    className="h-12 w-full rounded-lg border border-[#A88751] text-sm text-[#A88751] hover:bg-[#FBF8F1] transition-all font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
