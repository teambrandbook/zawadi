"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Loader2, Package, Search } from "lucide-react";
import api from "@/services/api";

type ApiProduct = {
  id: number;
  name?: string;
  product_name?: string;
  description?: string;
  short_description?: string;
  image: string | null;
  variants?: Array<{
    id: number;
    variant_name?: string;
    weight?: string;
    price?: number | string;
  }>;
  price?: number | string;
  base_price?: number | string;
  sale_price?: number | string;
  selling_price?: number | string;
  weight?: string;
  stock_quantity?: number | string;
  stock_status?: string;
};

type CartProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  stockStatus: string;
};

type BoxSize = {
  id: "small" | "large";
  name: string;
  description: string;
  capacity: string;
  capacityGrams: number;
};

type CommunityProfile = {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: {
    address_line?: string;
    city?: string;
    postal_code?: string;
  } | null;
};

const giftBoxSizes: BoxSize[] = [
  {
    id: "small",
    name: "0.5 KG Gift Box",
    description: "Perfect for a thoughtful wellness starter gift",
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

function formatStock(value: number | string | undefined): number {
  const stock = Number(value ?? 0);
  return Number.isNaN(stock) ? 0 : stock;
}

function mapApiProduct(p: ApiProduct): CartProduct {
  const firstVariant = p.variants?.[0];
  const productName = p.name ?? p.product_name ?? "ZEWADI Product";
  const size = firstVariant?.weight ?? firstVariant?.variant_name ?? p.weight ?? "250g";
  const price = formatPrice(p.selling_price ?? p.sale_price ?? p.price ?? p.base_price);

  return {
    id: p.id,
    name: productName,
    description: p.description ?? p.short_description ?? "",
    image: p.image ?? "/product/product-1.webp",
    size,
    price,
    quantity: 0,
    stockQuantity: formatStock(p.stock_quantity),
    stockStatus: p.stock_status ?? "in_stock",
  };
}

export default function CustomGiftsPage() {
  const router = useRouter();

  const [selectedBox, setSelectedBox] = useState<BoxSize>(giftBoxSizes[0]);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [giftType, setGiftType] = useState<"self" | "recipient">("recipient");
  const [recipient, setRecipient] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    postalCode: "",
    address: "",
    occasion: "Birthday",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const isSelfGifting = giftType === "self";

  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);

    api
      .get("/products/")
      .then((res) => {
        if (cancelled) return;
        const raw: ApiProduct[] = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
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

  useEffect(() => {
    let cancelled = false;

    api
      .get<CommunityProfile>("/community/profile/")
      .then((res) => {
        if (cancelled) return;
        const profile = res.data;
        setRecipient((prev) => ({
          ...prev,
          fullName: prev.fullName || profile.full_name || "",
          phone: prev.phone || profile.phone || "",
          email: prev.email || profile.email || "",
          city: prev.city || profile.address?.city || "",
          postalCode: prev.postalCode || profile.address?.postal_code || "",
          address: prev.address || profile.address?.address_line || "",
        }));
      })
      .catch(() => {
        // Profile data is only used to prefill self-gifting checkout details.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addedProducts = products.filter((p) => p.quantity > 0);
  const usedGrams = addedProducts.reduce((acc, p) => acc + parseGrams(p.size) * p.quantity, 0);
  const remainingGrams = Math.max(0, selectedBox.capacityGrams - usedGrams);
  const capacityPercent = Math.min(100, Math.round((usedGrams / selectedBox.capacityGrams) * 100));
  const packPrice = BOX_PRICES[selectedBox.id];
  const productsTotal = addedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const totalPrice = productsTotal;
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const changeQuantity = useCallback((id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.stockStatus === "out_of_stock" || p.stockQuantity <= 0) return p;

        const nextQuantity = Math.max(0, p.quantity + delta);
        if (delta > 0) {
          const currentUsedGrams = prev.reduce((acc, item) => acc + parseGrams(item.size) * item.quantity, 0);
          const nextUsedGrams = currentUsedGrams + parseGrams(p.size);
          if (nextUsedGrams > selectedBox.capacityGrams) return p;
        }

        return {
          ...p,
          quantity: Math.min(nextQuantity, p.stockQuantity),
        };
      })
    );
  }, [selectedBox.capacityGrams]);

  const onRecipientChange = (field: keyof typeof recipient, value: string) => {
    setRecipient((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (addedProducts.length === 0) {
      setSubmitError("Please add at least one product to your gift box.");
      return;
    }
    if (usedGrams > selectedBox.capacityGrams) {
      setSubmitError("Your selected products exceed the gift box capacity.");
      return;
    }

    let delivery = {
      full_name: recipient.fullName.trim(),
      phone: recipient.phone.trim(),
      email: recipient.email.trim(),
      city: recipient.city.trim(),
      postal_code: recipient.postalCode.trim(),
      address: recipient.address.trim(),
    };

    if (isSelfGifting) {
      delivery.full_name = delivery.full_name || "Self";
    } else {
      if (!delivery.full_name) {
        setSubmitError("Please enter the recipient's name.");
        return;
      }
      if (!delivery.phone) {
        setSubmitError("Please enter a phone number.");
        return;
      }
      if (!delivery.address) {
        setSubmitError("Please enter a delivery address.");
        return;
      }
    }

    const checkout = {
      mode: "customGift" as const,
      gift: {
        giftType: isSelfGifting ? "self" : "recipient",
        box: {
          id: selectedBox.id,
          name: selectedBox.name,
          price: packPrice.toFixed(2),
          capacity: selectedBox.capacity,
        },
        items: addedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          size: product.size,
          price: product.price.toFixed(2),
          quantity: product.quantity,
        })),
        message: message.trim(),
        occasion: recipient.occasion,
        delivery,
        subtotal: totalPrice.toFixed(2),
        deliveryCharge: "0.00",
        taxAmount: "0.00",
        totalAmount: totalPrice.toFixed(2),
      },
    };

    setSubmitting(true);
    try {
      sessionStorage.setItem("zewadi_checkout", JSON.stringify(checkout));
      router.push("/communityDashBoard/payment-method");
    } catch {
      setSubmitError("Failed to start checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex-1 bg-white px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[980px] space-y-4">
        <h1 className="text-xl font-bold text-[#06402B]">Customize Your Gift Box</h1>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-3 text-base font-bold text-[#06402B]">Choose Your Gift Box Size</h2>
          <div className="grid grid-cols-2 gap-3">
            {giftBoxSizes.map((box) => {
              const isSelected = selectedBox.id === box.id;

              return (
                <article
                  key={box.id}
                  onClick={() => setSelectedBox(box)}
                  className={`cursor-pointer rounded-md border-2 p-3 transition-all ${
                    isSelected ? "border-[#A88751] bg-[#FBF8F1]" : "border-[#DADDE1] bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${
                        isSelected ? "bg-[#A88751] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                    </span>
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-[#A88751] bg-[#A88751] text-white" : "border-gray-300 text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </div>
                  <h3 className="mt-3 text-xs font-bold text-gray-900">{box.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-gray-500">{box.description}</p>
                  <p className="mt-3 rounded bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600">
                    Capacity: {box.capacity}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-4 text-base font-bold text-[#06402B]">Box Capacity</h2>
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-gray-500">
            <span>Used: {usedGrams}g</span>
            <span>Remaining: {remainingGrams}g</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#A88751] transition-all duration-300"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-gray-400">
            {remainingGrams > 0 ? `You can still add ${remainingGrams}g to your gift box` : "Your gift box is full!"}
          </p>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 space-y-2">
            <h2 className="text-base font-bold text-[#06402B]">Select Products</h2>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product"
                className="h-8 w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-xs outline-none transition-all focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B]"
              />
            </div>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm">Loading products...</span>
            </div>
          ) : productsError ? (
            <p className="py-8 text-center text-sm text-red-600">{productsError}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No products found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stockStatus === "out_of_stock" || product.stockQuantity <= 0;
                const isAtStockLimit = product.quantity >= product.stockQuantity;
                const productGrams = parseGrams(product.size);
                const isAtBoxLimit = productGrams > 0 && productGrams > remainingGrams;

                return (
                <article
                  key={product.id}
                  className={`rounded-md border bg-white p-2 transition-all hover:shadow-md ${
                    product.quantity > 0 ? "border-[#A88751] ring-1 ring-[#A88751]" : "border-gray-200"
                  }`}
                >
                  <div className="relative mb-2 h-28 overflow-hidden rounded bg-gray-50 sm:h-32">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="line-clamp-2 min-h-[28px] text-[10px] font-bold leading-[14px] text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 min-h-[24px] text-[9px] leading-3 text-gray-500">
                    {product.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-600">
                      {product.size}
                    </span>
                    {product.price > 0 && (
                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[8px] font-bold text-[#06402B]">
                        Rs.{product.price}
                      </span>
                    )}
                  </div>
                  {product.quantity > 0 ? (
                    <div className="mt-2 flex h-8 items-center justify-between rounded-md border border-[#A88751] bg-[#FBF8F1] px-1.5">
                      <button
                        onClick={() => changeQuantity(product.id, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-[#A88751] transition-colors hover:bg-[#A88751] hover:text-white"
                      >
                        -
                      </button>
                      <span className="text-[9px] font-bold text-[#06402B]">Added ({product.quantity})</span>
                      <button
                        onClick={() => changeQuantity(product.id, 1)}
                        disabled={isAtStockLimit || isAtBoxLimit}
                        className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-[#A88751] transition-colors hover:bg-[#A88751] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#A88751]"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => changeQuantity(product.id, 1)}
                      disabled={isOutOfStock || isAtBoxLimit}
                      className="mt-2 h-8 w-full rounded-md bg-[#06402B] text-[9px] font-semibold text-white shadow-sm transition-colors hover:bg-[#053020] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                    >
                      {isOutOfStock ? "Out of Stock" : isAtBoxLimit ? "Box Full" : "Add to Box"}
                    </button>
                  )}
                </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-3 text-base font-bold text-[#06402B]">Personal Message</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a heartfelt message for your gift recipient..."
            className="h-16 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-xs text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#06402B] focus:ring-1 focus:ring-[#06402B]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {["Wellness wishes", "Happy Birthday", "Thank you"].map((tag) => (
              <button
                key={tag}
                onClick={() => setMessage((prev) => (prev ? `${prev} ${tag}` : tag))}
                className="rounded-full border border-[#E9DFCC] bg-[#FBF8F1] px-2 py-0.5 text-[9px] font-bold text-[#A88751] transition-colors hover:bg-[#E9DFCC]"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-3 shadow-sm sm:p-4">
          <h2 className="mb-3 text-base font-bold text-[#06402B]">Gift Type</h2>
          <label className="flex cursor-pointer items-center justify-between rounded-md border border-[#A88751] bg-[#FBF8F1] px-3 py-2">
            <span>
              <span className="block text-xs font-bold text-[#06402B]">Self Gifting</span>
              <span className="block text-[9px] text-gray-500">Gift to someone special</span>
            </span>
            <input
              type="checkbox"
              checked={isSelfGifting}
              onChange={(e) => setGiftType(e.target.checked ? "self" : "recipient")}
              className="h-6 w-6 appearance-none rounded-full border border-[#8A8A8A] bg-white checked:border-[#0D8BFF] checked:bg-[#0D8BFF] checked:shadow-[inset_0_0_0_3px_#FFFFFF] checked:outline checked:outline-1 checked:outline-[#0D8BFF]"
            />
          </label>
        </section>

        {!isSelfGifting && (
        <section className="rounded-[12px] border border-[#DFDFDF] bg-white px-5 py-5 shadow-sm">
          <h2 className="mb-5 text-base font-bold text-[#06402B]">Recipient Details</h2>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#06402B]">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipient.fullName}
                onChange={(e) => onRecipientChange("fullName", e.target.value)}
                placeholder="Enter recipient name"
                className="h-12 w-full rounded-[9px] border border-[#DFDFDF] bg-white px-3.5 text-base text-black outline-none focus:border-[#06402B]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#06402B]">
                Phone Number
              </label>
              <input
                type="tel"
                value={recipient.phone}
                onChange={(e) => onRecipientChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="h-12 w-full rounded-[9px] border border-[#DFDFDF] bg-white px-3.5 text-base text-black outline-none focus:border-[#06402B]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#06402B]">
                Delivery Address
              </label>
              <textarea
                value={recipient.address}
                onChange={(e) => onRecipientChange("address", e.target.value)}
                placeholder="Enter complete delivery address"
                className="h-20 w-full resize-none rounded-[9px] border border-[#DFDFDF] bg-white px-3.5 py-3 text-base text-black outline-none focus:border-[#06402B]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#06402B]">Occasion</label>
              <select
                value={recipient.occasion}
                onChange={(e) => onRecipientChange("occasion", e.target.value)}
                className="h-12 w-full rounded-[9px] border border-[#DFDFDF] bg-[#F1F1F1] px-3.5 text-base text-black outline-none focus:border-[#06402B] sm:w-1/2"
              >
                <option>Birthday</option>
                <option>Thank You</option>
                <option>Wellness Gift</option>
              </select>
            </div>
          </div>
        </section>
        )}

        {addedProducts.length > 0 && (
          <section className="space-y-1 rounded-lg border border-[#DFDFDF] bg-white p-3 text-xs text-gray-700 shadow-sm sm:p-4">
            <div className="flex justify-between">
              <span>Box ({selectedBox.name})</span>
              <span>Included</span>
            </div>
            {addedProducts.map((p) => (
              <div key={p.id} className="flex justify-between text-[10px] text-gray-500">
                <span>
                  {p.name} x{p.quantity}
                </span>
                <span>Rs.{(p.price * p.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-1 flex justify-between border-t pt-1 font-bold text-[#06402B]">
              <span>Total</span>
              <span>Rs.{totalPrice.toFixed(2)}</span>
            </div>
          </section>
        )}

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Order placed successfully! Redirecting to your orders...
          </div>
        )}

        <div className="grid grid-cols-2 gap-10 pt-1 font-semibold">
          <button
            onClick={handleSubmit}
            disabled={submitting || submitSuccess}
            className="flex h-8 w-full items-center justify-center gap-2 rounded-sm bg-[#06402B] text-[10px] text-white shadow-md transition-all hover:bg-[#053020] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Continue to Checkout"
            )}
          </button>
          <button
            onClick={() => router.push("/communityDashBoard")}
            className="h-8 w-full rounded-sm bg-[#A88751] text-[10px] font-bold text-white transition-all hover:bg-[#927243]"
          >
            Save Gift Box
          </button>
        </div>
      </div>
    </main>
  );
}
