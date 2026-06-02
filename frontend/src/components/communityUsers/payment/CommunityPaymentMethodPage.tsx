"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CreditCard,
  Edit2,
  Lock,
  Package,
  Plus,
  TicketPercent,
  Trash2,
  Truck,
} from "lucide-react";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

type DeliveryPayload = {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  postal_code: string;
  address: string;
  instructions: string;
  country?: string;
};

type SingleCheckoutSession = {
  mode: "single";
  item: {
    productId: number;
    variantId?: number | null;
    productName: string;
    productImage?: string | null;
    packName: string;
    quantity: number;
    subtotal: string;
    deliveryCharge: string;
    totalAmount: string;
    currency?: string;
  };
  order: DeliveryPayload & {
    product_id: number;
    variant_id?: number | null;
    product_name: string;
    pack_name: string;
    pack_price: string;
    quantity: number;
    subtotal: string;
    delivery_charge: string;
    total_amount: string;
    payment_method: "cod";
  };
};

type CartCheckoutSession = {
  mode: "cart";
  delivery: DeliveryPayload;
};

type PaymentMethod = "cod" | "bank_transfer";

type CustomGiftCheckoutSession = {
  mode: "customGift";
  gift: {
    giftType: "self" | "recipient";
    box: {
      id: string;
      name: string;
      price: string;
      capacity: string;
    };
    items: Array<{
      id: number;
      name: string;
      image?: string | null;
      size: string;
      price: string;
      currency?: string;
      currencyDecimalPlaces?: number;
      quantity: number;
    }>;
    message: string;
    occasion: string;
    delivery: DeliveryPayload;
    subtotal: string;
    deliveryCharge: string;
    taxAmount: string;
    totalAmount: string;
    currency?: string;
    currencyDecimalPlaces?: number;
  };
};

type CheckoutSession = SingleCheckoutSession | CartCheckoutSession | CustomGiftCheckoutSession;

type CartItem = {
  id: number;
  product_name: string;
  image?: string | null;
  variant_name?: string | null;
  quantity: number;
  line_total: string | number;
  currency: string;
};

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
};

type CartResponse = {
  items: CartItem[];
  summary: CartSummary;
};

type DisplayItem = {
  name: string;
  image?: string | null;
  quantity: number;
  price: string | number;
  subtitle: string;
};

type DeliveryAddress = {
  id: number;
  label?: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
};

type AddressForm = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
};

const fallbackImage = "/product/p-1.webp";
const emptyAddressForm: AddressForm = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  postal_code: "",
};

function toNumber(value: string | number | null | undefined): number {
  const amount = Number(value);
  return Number.isNaN(amount) ? 0 : amount;
}

function toCurrency(value: string | number | null | undefined, currency = "SAR"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(toNumber(value));
  } catch {
    return `$${toNumber(value).toFixed(2)}`;
  }
}

function toImageUrl(imagePath?: string | null): string {
  if (!imagePath) return fallbackImage;
  return getImageUrl(imagePath);
}

function readCheckoutSession(): CheckoutSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem("zewadi_checkout");
    return value ? (JSON.parse(value) as CheckoutSession) : null;
  } catch {
    return null;
  }
}

export default function CommunityPaymentMethodPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("cod");
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm);
  const [addressesLoading, setAddressesLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const session = readCheckoutSession();
    setCheckout(session);

    async function loadCart() {
      if (!session || session.mode !== "cart") {
        setIsLoading(false);
        return;
      }

      try {
        const country = session.delivery.country ?? "SA";
        const response = await api.get<CartResponse>(`/orders/cart/?country=${country}`);
        if (!isMounted) return;
        setCartItems(response.data.items);
        setCartSummary(response.data.summary);
      } catch {
        if (isMounted) setStatusMessage("Unable to load your cart summary.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCart();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAddresses() {
      try {
        const response = await api.get<DeliveryAddress[]>("/community/addresses/");
        if (!isMounted) return;
        const addresses = Array.isArray(response.data) ? response.data : [];
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          const firstAddress = addresses[0];
          setSelectedAddressId(firstAddress.id);
          setCheckout((current) => {
            const currentDelivery = getCheckoutDelivery(current);
            if (!current || isDeliveryComplete(currentDelivery)) return current;
            const nextCheckout = withCheckoutDelivery(current, {
              full_name: firstAddress.full_name,
              phone: firstAddress.phone,
              email: currentDelivery?.email ?? "",
              city: firstAddress.city,
              postal_code: firstAddress.postal_code,
              address: firstAddress.address_line,
              instructions: currentDelivery?.instructions ?? "",
              country: currentDelivery?.country,
            });
            sessionStorage.setItem("zewadi_checkout", JSON.stringify(nextCheckout));
            return nextCheckout;
          });
        }
      } catch {
        if (isMounted) setStatusMessage("Unable to load saved addresses.");
      } finally {
        if (isMounted) setAddressesLoading(false);
      }
    }

    void loadAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    if (!checkout) {
      return { subtotal: "0.00", shipping: "0.00", tax: "0.00", total: "0.00", itemCount: 0 };
    }

    if (checkout.mode === "single") {
      return {
        subtotal: checkout.item.subtotal,
        shipping: checkout.item.deliveryCharge,
        tax: "0.00",
        total: checkout.item.totalAmount,
        itemCount: checkout.item.quantity,
      };
    }

    if (checkout.mode === "customGift") {
      return {
        subtotal: checkout.gift.subtotal,
        shipping: checkout.gift.deliveryCharge,
        tax: checkout.gift.taxAmount,
        total: checkout.gift.totalAmount,
        itemCount: checkout.gift.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    return {
      subtotal: cartSummary?.subtotal ?? "0.00",
      shipping: cartSummary?.shipping ?? "0.00",
      tax: cartSummary?.tax ?? "0.00",
      total: cartSummary?.total ?? "0.00",
      itemCount: cartSummary?.item_count ?? 0,
    };
  }, [cartSummary, checkout]);

  const displayItem = useMemo<DisplayItem | null>(() => {
    if (!checkout) return null;
    if (checkout.mode === "single") {
      return {
        name: checkout.item.productName,
        image: checkout.item.productImage,
        quantity: checkout.item.quantity,
        price: checkout.item.totalAmount,
        subtitle: checkout.item.packName,
      };
    }

    if (checkout.mode === "customGift") {
      const firstGiftItem = checkout.gift.items[0];
      return {
        name: firstGiftItem?.name ?? checkout.gift.box.name,
        image: firstGiftItem?.image,
        quantity: summary.itemCount,
        price: checkout.gift.totalAmount,
        subtitle: checkout.gift.box.name,
      };
    }

    const firstCartItem = cartItems[0];
    if (!firstCartItem) return null;
    return {
      name: firstCartItem.product_name,
      image: firstCartItem.image,
      quantity: firstCartItem.quantity,
      price: firstCartItem.line_total,
      subtitle: firstCartItem.variant_name || "Standard Pack",
    };
  }, [cartItems, checkout, summary.itemCount]);

  const currency = checkout?.mode === "cart"
    ? cartItems[0]?.currency ?? "SAR"
    : checkout?.mode === "single"
      ? checkout.item.currency ?? "SAR"
      : checkout?.gift.currency ?? checkout?.gift.items[0]?.currency ?? "SAR";

  function getCheckoutDelivery(session: CheckoutSession | null): DeliveryPayload | null {
    if (!session) return null;
    if (session.mode === "cart") return session.delivery;
    if (session.mode === "customGift") return session.gift.delivery;
    return session.order;
  }

  function isDeliveryComplete(value: DeliveryPayload | null): boolean {
    return Boolean(
      value?.full_name?.trim() &&
      value?.phone?.trim() &&
      value?.address?.trim() &&
      value?.city?.trim() &&
      value?.postal_code?.trim()
    );
  }

  function withCheckoutDelivery(session: CheckoutSession, nextDelivery: DeliveryPayload): CheckoutSession {
    if (session.mode === "cart") return { ...session, delivery: nextDelivery };
    if (session.mode === "customGift") return { ...session, gift: { ...session.gift, delivery: nextDelivery } };
    return { ...session, order: { ...session.order, ...nextDelivery } };
  }

  const delivery = getCheckoutDelivery(checkout);
  const selectedAddress = savedAddresses.find((address) => address.id === selectedAddressId) ?? null;

  function persistCheckout(nextCheckout: CheckoutSession) {
    setCheckout(nextCheckout);
    sessionStorage.setItem("zewadi_checkout", JSON.stringify(nextCheckout));
  }

  function updateCheckoutDelivery(nextDelivery: DeliveryPayload) {
    if (!checkout) return;
    persistCheckout(withCheckoutDelivery(checkout, nextDelivery));
  }

  function toDeliveryPayload(address: DeliveryAddress): DeliveryPayload {
    return {
      full_name: address.full_name,
      phone: address.phone,
      email: delivery?.email ?? "",
      city: address.city,
      postal_code: address.postal_code,
      address: address.address_line,
      instructions: delivery?.instructions ?? "",
      country: delivery?.country,
    };
  }

  function selectAddress(address: DeliveryAddress) {
    setSelectedAddressId(address.id);
    updateCheckoutDelivery(toDeliveryPayload(address));
  }

  function openAddressForm(address?: DeliveryAddress | null) {
    setEditingAddressId(address?.id ?? null);
    setAddressForm(
      address
        ? {
            full_name: address.full_name,
            phone: address.phone,
            address_line: address.address_line,
            city: address.city,
            postal_code: address.postal_code,
          }
        : emptyAddressForm
    );
    setShowAddressForm(true);
  }

  function onAddressFormChange(field: keyof AddressForm, value: string) {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveAddress() {
    const required = [
      addressForm.full_name,
      addressForm.phone,
      addressForm.address_line,
      addressForm.city,
      addressForm.postal_code,
    ];
    if (required.some((value) => !value.trim())) {
      setStatusMessage("Please complete all address fields.");
      return;
    }

    const payload = {
      full_name: addressForm.full_name.trim(),
      phone: addressForm.phone.trim(),
      address_line: addressForm.address_line.trim(),
      city: addressForm.city.trim(),
      postal_code: addressForm.postal_code.trim(),
    };

    try {
      const response = editingAddressId
        ? await api.patch<DeliveryAddress>(`/community/addresses/${editingAddressId}/`, payload)
        : await api.post<DeliveryAddress>("/community/addresses/", payload);
      const saved = response.data;
      setSavedAddresses((prev) =>
        editingAddressId
          ? prev.map((address) => (address.id === saved.id ? saved : address))
          : [saved, ...prev]
      );
      selectAddress(saved);
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm);
      setStatusMessage("");
    } catch {
      setStatusMessage("Unable to save this address.");
    }
  }

  async function deleteAddress(addressId: number) {
    try {
      await api.delete(`/community/addresses/${addressId}/`);
      const nextAddresses = savedAddresses.filter((address) => address.id !== addressId);
      setSavedAddresses(nextAddresses);
      if (selectedAddressId === addressId) {
        const nextAddress = nextAddresses[0] ?? null;
        setSelectedAddressId(nextAddress?.id ?? null);
        if (nextAddress) updateCheckoutDelivery(toDeliveryPayload(nextAddress));
      }
    } catch {
      setStatusMessage("Unable to delete this address.");
    }
  }

  async function completePayment() {
    if (!checkout) {
      setStatusMessage("Start checkout before choosing payment.");
      return;
    }

    const currentDelivery = getCheckoutDelivery(checkout);
    if (!isDeliveryComplete(currentDelivery)) {
      setStatusMessage("Please add or select a delivery address before completing payment.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Completing payment...");
    try {
      if (checkout.mode === "customGift") {
        const response = await api.post<{ custom_gift_id?: string }>("/orders/custom-gifts/", {
          gift_type: checkout.gift.giftType,
          box_id: checkout.gift.box.id,
          box_name: checkout.gift.box.name,
          box_price: checkout.gift.box.price,
          box_capacity: checkout.gift.box.capacity,
          items: checkout.gift.items,
          message: checkout.gift.message,
          occasion: checkout.gift.occasion,
          full_name: checkout.gift.delivery.full_name,
          phone: checkout.gift.delivery.phone,
          email: checkout.gift.delivery.email,
          city: checkout.gift.delivery.city,
          postal_code: checkout.gift.delivery.postal_code,
          address: checkout.gift.delivery.address,
          subtotal: checkout.gift.subtotal,
          delivery_charge: checkout.gift.deliveryCharge,
          tax_amount: checkout.gift.taxAmount,
          total_amount: checkout.gift.totalAmount,
          payment_method: selectedPaymentMethod,
        });
        sessionStorage.removeItem("zewadi_checkout");
        router.push(
          response.data?.custom_gift_id
            ? `/communityDashBoard/myorders/order-placed?orderId=${encodeURIComponent(response.data.custom_gift_id)}`
            : "/communityDashBoard/myorders/order-placed"
        );
        return;
      }

      if (checkout.mode === "cart") {
        const response = await api.post<{ primary_order_id?: string; order_ids?: string[] }>(
          "/orders/cart/checkout/",
          {
            ...checkout.delivery,
            payment_method: "cod",
          }
        );
        const createdOrderId = response.data?.primary_order_id ?? response.data?.order_ids?.[0];
        sessionStorage.removeItem("zewadi_checkout");
        router.push(
          createdOrderId
            ? `/communityDashBoard/myorders/order-placed?orderId=${encodeURIComponent(createdOrderId)}`
            : "/communityDashBoard/myorders/order-placed"
        );
        return;
      }

      const response = await api.post<{ order_id?: string }>("/orders/create/", {
        ...checkout.order,
        payment_method: "cod",
      });
      sessionStorage.removeItem("zewadi_checkout");
      router.push(
        response.data?.order_id
          ? `/communityDashBoard/myorders/order-placed?orderId=${encodeURIComponent(response.data.order_id)}`
          : "/communityDashBoard/myorders/order-placed"
      );
    } catch (error: unknown) {
      const detail =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail === "string"
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
            ?? "Unable to complete this order."
          : "Unable to complete this order.";
      setStatusMessage(detail);
    } finally {
      setIsSubmitting(false);
    }
  }

  function applyPromo() {
    setStatusMessage(
      promoCode.trim()
        ? "Promo code validation is not available in the MVP checkout."
        : "Enter a promo code to apply it."
    );
  }

  if (!checkout && !isLoading) {
    return (
      <section className="min-h-screen bg-white px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-[720px] flex-col items-center justify-center rounded-3xl border border-[#DFDFDF] bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Package className="h-10 w-10 text-[#0A4833]" />
          <h1 className="mt-4 text-xl font-semibold text-[#1F2124]">No checkout in progress</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
            Add products to your cart or start an order before choosing a payment method.
          </p>
          <button
            type="button"
            onClick={() => router.push("/communityDashBoard/cart")}
            className="mt-6 rounded-xl bg-[#0A4833] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Cart
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1184px] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,800px)_392px]">
        <div className="space-y-5">
          <h1 className="text-xl font-semibold leading-7 text-[#1F2124]">Payment Method</h1>

          <section className="rounded-2xl border border-[#DFDFDF] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#06402B]">Delivery Address and contact details</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAddressForm(selectedAddress)}
                  className="grid h-7 w-7 place-items-center rounded-md text-[#06402B] hover:bg-[#F3F7F4]"
                  aria-label="Edit address"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {selectedAddress ? (
                  <button
                    type="button"
                    onClick={() => void deleteAddress(selectedAddress.id)}
                    className="grid h-7 w-7 place-items-center rounded-md text-red-500 hover:bg-red-50"
                    aria-label="Delete address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {addressesLoading ? (
              <div className="mt-5 flex items-center gap-2 text-sm text-[#6B7280]">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#CBD5E1] border-t-[#06402B]" />
                Loading addresses...
              </div>
            ) : (
              <>
                {savedAddresses.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {savedAddresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => selectAddress(address)}
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          selectedAddressId === address.id
                            ? "border-[#06402B] bg-[#F3F7F4] text-[#06402B]"
                            : "border-[#DFDFDF] text-[#6B7280]"
                        }`}
                      >
                        {address.label || address.city || "Saved Address"}
                      </button>
                    ))}
                  </div>
                )}

                {!showAddressForm && (
                  <div className="mt-5 grid grid-cols-1 gap-6 text-sm leading-6 text-[#4B5563] sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#6B7280]">Delivery Address</p>
                      <p>{delivery?.address || "No address selected"}</p>
                      <p>{[delivery?.city, delivery?.postal_code].filter(Boolean).join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Contact</p>
                      <p>{delivery?.full_name || "-"}</p>
                      <p>{delivery?.phone || "-"}</p>
                    </div>
                  </div>
                )}

                {showAddressForm && (
                  <div className="mt-5 space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        value={addressForm.full_name}
                        onChange={(e) => onAddressFormChange("full_name", e.target.value)}
                        placeholder="Full name"
                        className="h-10 rounded-md border border-gray-200 px-3 text-xs text-[#111827] outline-none focus:border-[#06402B]"
                      />
                      <input
                        value={addressForm.phone}
                        onChange={(e) => onAddressFormChange("phone", e.target.value)}
                        placeholder="Phone"
                        className="h-10 rounded-md border border-gray-200 px-3 text-xs text-[#111827] outline-none focus:border-[#06402B]"
                      />
                    </div>
                    <input
                      value={addressForm.address_line}
                      onChange={(e) => onAddressFormChange("address_line", e.target.value)}
                      placeholder="Delivery address"
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-xs text-[#111827] outline-none focus:border-[#06402B]"
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        value={addressForm.city}
                        onChange={(e) => onAddressFormChange("city", e.target.value)}
                        placeholder="City"
                        className="h-10 rounded-md border border-gray-200 px-3 text-xs text-[#111827] outline-none focus:border-[#06402B]"
                      />
                      <input
                        value={addressForm.postal_code}
                        onChange={(e) => onAddressFormChange("postal_code", e.target.value)}
                        placeholder="Postal code"
                        className="h-10 rounded-md border border-gray-200 px-3 text-xs text-[#111827] outline-none focus:border-[#06402B]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void saveAddress()}
                        className="inline-flex h-9 items-center rounded-md bg-[#06402B] px-4 text-xs font-bold text-white"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                          setAddressForm(emptyAddressForm);
                        }}
                        className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs font-bold text-[#06402B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => openAddressForm(null)}
                    className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#06402B]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add New Address
                  </button>
                )}
              </>
            )}
          </section>

          <div className="rounded-3xl border border-[#DFDFDF] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod("cod")}
                className={`flex min-h-[58px] items-center justify-center gap-3 rounded-xl border-2 px-4 py-4 text-sm font-medium text-[#1F2124] ${
                  selectedPaymentMethod === "cod"
                    ? "border-[#9F8151] bg-[#F9FAFB]"
                    : "border-[#DFDFDF] bg-white"
                }`}
              >
                <Banknote className="h-5 w-5 text-[#0D6E2E]" />
                Cash on Delivery
              </button>
              <button
                type="button"
                onClick={() => checkout?.mode === "customGift" && setSelectedPaymentMethod("bank_transfer")}
                disabled={checkout?.mode !== "customGift"}
                className={`flex min-h-[58px] items-center justify-center gap-3 rounded-xl border px-4 py-4 text-sm font-medium ${
                  selectedPaymentMethod === "bank_transfer"
                    ? "border-2 border-[#9F8151] bg-[#F9FAFB] text-[#1F2124]"
                    : "border-[#DFDFDF] bg-white text-[#6B7280]"
                } ${checkout?.mode !== "customGift" ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <CreditCard className="h-5 w-5 text-[#9F8151]" />
                Bank Transfer
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-[#DFDFDF] bg-[#F9FAFB] p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0D6E2E] text-white">
                  {selectedPaymentMethod === "cod" ? <Banknote className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#0A4833]">
                    {selectedPaymentMethod === "cod" ? "Cash on Delivery selected" : "Bank Transfer selected"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#4B5563]">
                    {selectedPaymentMethod === "cod"
                      ? "Pay the courier when your ZEWADI order arrives."
                      : "Your custom gift payment will be marked as pending until bank transfer confirmation."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoCard icon={<Truck className="h-4 w-4" />} title="Standard Delivery" text="3-5 business days" />
              <InfoCard icon={<BadgeCheck className="h-4 w-4" />} title="Secure Payment" text="Confirm before dispatch" />
              <InfoCard icon={<Lock className="h-4 w-4" />} title="Order Review" text="Confirm before dispatch" />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-[#F3F4F6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
            <h2 className="text-2xl font-bold leading-9 text-[#1F4D3A]">Order Summary</h2>

            <div className="mt-6 space-y-4 border-b border-[#F3F4F6] pb-6">
              <SummaryRow label="Subtotal" value={toCurrency(summary.subtotal, currency)} />
              <SummaryRow
                label="Shipping"
                value={toNumber(summary.shipping) === 0 ? "Free" : toCurrency(summary.shipping, currency)}
              />
              <SummaryRow label="Estimated Tax" value={toCurrency(summary.tax, currency)} />
            </div>

            <div className="mt-5 flex items-center justify-between py-2">
              <span className="text-lg font-bold text-[#1F4D3A]">Total</span>
              <span className="text-3xl font-bold text-[#1F4D3A]">{toCurrency(summary.total, currency)}</span>
            </div>

            <div className="mt-6 flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-2">
              <input
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Promo code"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#1F2124] outline-none placeholder:text-[#9CA3AF]"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#1F4D3A] px-4 text-sm font-semibold text-white"
              >
                <TicketPercent className="h-3.5 w-3.5" />
                Apply
              </button>
            </div>

            <button
              type="button"
              onClick={completePayment}
              disabled={isSubmitting || isLoading}
              className="mt-7 inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1F4D3A] text-lg font-bold text-white transition hover:bg-[#173B2C] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Completing Payment..." : "Complete Payment"}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#6B7280]">
              {checkout?.mode === "customGift"
                ? "Cash on delivery is confirmed immediately. Bank transfer remains pending."
                : "Payment gateway integration is reserved for the next phase."}
            </p>
          </div>

          {displayItem ? (
            <div className="flex items-center gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-4 opacity-90">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F9FAFB]">
                <Image src={toImageUrl(displayItem.image)} alt={displayItem.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-[#1F4D3A]">{displayItem.name}</h3>
                <p className="text-xs text-[#6B7280]">Quantity: {summary.itemCount}</p>
              </div>
              <span className="text-sm font-bold text-[#1F4D3A]">{toCurrency(displayItem.price, currency)}</span>
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-xl border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280]">
              {statusMessage}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-base text-[#4B5563]">{label}</span>
      <span className="text-base font-semibold text-[#1F4D3A]">{value}</span>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2 text-[#0A4833]">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-1 text-xs text-[#6B7280]">{text}</p>
    </div>
  );
}
