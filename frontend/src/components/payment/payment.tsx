"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  ChevronRight,
  Plus,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";
import { z } from "zod";

// address field is named "address" (not "address_line") in the local form state
const checkoutSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
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

const addOns = [
  {
    name: "Organic Dates",
    variant: "Sandstone",
    image: "/product/p-4.webp",
    price: 349.99,
  },
  {
    name: "First Quality Cashew",
    variant: "Space Gray",
    image: "/product/p-2.webp",
    price: 549,
  },
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

function CheckoutBreadcrumb() {
  return (
    <nav aria-label="Checkout progress" className="flex flex-wrap items-center gap-2 text-sm">
      <Link href="/cart" className="font-medium text-[#6b7280] transition hover:text-[#1f4d3a]">
        Cart
      </Link>
      <ChevronRight size={13} className="text-[#9ca3af]" />
      <span className="font-bold text-[#1f4d3a]">Payment</span>
      <ChevronRight size={13} className="text-[#9ca3af]" />
      <span className="font-medium text-[#6b7280] opacity-50">Confirmation</span>
    </nav>
  );
}

function AddOnCard({ product }: { product: (typeof addOns)[number] }) {
  return (
    <article className="rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
      <div className="relative flex h-[172px] items-center justify-center overflow-hidden rounded-xl bg-[#f9fafb] p-5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 360px, 90vw"
          className="object-cover mix-blend-multiply transition duration-500 hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-base font-bold leading-6 text-[#1f4d3a]">{product.name}</h3>
        <p className="text-xs leading-[18px] text-[#6b7280]">{product.variant}</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-base font-bold leading-6 text-[#1f4d3a]">{money.format(product.price)}</p>
        <button
          type="button"
          aria-label={`Add ${product.name}`}
          className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#1f4d3a] transition hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white"
        >
          <Plus size={14} strokeWidth={2.8} />
        </button>
      </div>
    </article>
  );
}

export default function Payment() {
  const router = useRouter();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
  }, []);

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
        toast.error(result.error.errors[0].message);
        return;
      }
    }

    setSubmitting(true);
    try {
      let addressPayload = form;

      if (selectedAddressId && !showForm) {
        const addr = savedAddresses.find((a) => a.id === selectedAddressId);
        if (addr) {
          addressPayload = {
            full_name: addr.full_name,
            phone: addr.phone,
            address: addr.address_line,
            city: addr.city,
            postal_code: addr.postal_code,
            instructions: "",
          };
        }
      } else if (saveAddress) {
        await api.post("/community/addresses/", {
          full_name: form.full_name,
          phone: form.phone,
          address_line: form.address,
          city: form.city,
          postal_code: form.postal_code,
        });
      }

      const meRes = await api.get("/account/me/");
      const res = await api.post("/orders/cart/checkout/", {
        full_name: addressPayload.full_name,
        phone: addressPayload.phone,
        email: meRes.data.email,
        city: addressPayload.city,
        postal_code: addressPayload.postal_code,
        address: addressPayload.address,
        instructions: addressPayload.instructions || "",
        payment_method: "cod",
      });

      router.push(`/orderplaced?order_id=${res.data.primary_order_id}`);
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? JSON.stringify((err as { response?: { data?: unknown } }).response?.data)
          : "Checkout failed.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-24 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-[1100px]">
        <CheckoutBreadcrumb />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-8">
            <header>
              <h1 className="text-3xl font-bold leading-9 text-[#1f4d3a]">Shipping & Payment</h1>
              <p className="mt-2 text-base leading-6 text-[#6b7280]">
                Complete your purchase by providing your delivery details.
              </p>
            </header>

            {/* Shipping Address Section */}
            <section className="rounded-2xl border border-[#f3f4f6] bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold leading-7 text-[#1f4d3a]">Shipping Address</h2>
                {savedAddresses.length > 0 && !showForm && (
                  <button
                    type="button"
                    onClick={() => { setShowForm(true); setSelectedAddressId(null); }}
                    className="inline-flex items-center gap-1 self-start text-sm font-bold text-[#1f4d3a] transition hover:text-[#1a4331]"
                  >
                    <Plus size={14} strokeWidth={2.8} />
                    Use Different Address
                  </button>
                )}
              </div>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && !showForm && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase text-[#374151] mb-2">Saved Addresses</p>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-[#0a4833] bg-[#f0faf5]"
                            : "border-gray-200 bg-white"
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
                        <div className="text-xs text-[#374151]">
                          <p className="font-semibold">{addr.label || "Saved Address"}</p>
                          <p>
                            {addr.full_name} · {addr.phone}
                          </p>
                          <p>
                            {addr.address_line}, {addr.city} — {addr.postal_code}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* New address form */}
              {showForm && (
                <div className="mt-4 space-y-4">
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setSelectedAddressId(savedAddresses[0].id); }}
                      className="text-xs text-[#0a4833] underline"
                    >
                      Use a saved address
                    </button>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium leading-[21px] text-[#4b5563]">Full Name</span>
                      <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
                          placeholder="Jane Doe"
                          value={form.full_name}
                          onChange={(e) => handleFormChange("full_name", e.target.value)}
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium leading-[21px] text-[#4b5563]">Phone</span>
                      <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
                          placeholder="+91 9876543210"
                          value={form.phone}
                          onChange={(e) => handleFormChange("phone", e.target.value)}
                        />
                      </span>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium leading-[21px] text-[#4b5563]">Address</span>
                    <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
                      <input
                        className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
                        placeholder="123 Main Street"
                        value={form.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                      />
                    </span>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium leading-[21px] text-[#4b5563]">City</span>
                      <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
                          placeholder="Mumbai"
                          value={form.city}
                          onChange={(e) => handleFormChange("city", e.target.value)}
                        />
                      </span>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium leading-[21px] text-[#4b5563]">Postal Code</span>
                      <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
                        <input
                          className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
                          placeholder="400001"
                          value={form.postal_code}
                          onChange={(e) => handleFormChange("postal_code", e.target.value)}
                        />
                      </span>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium leading-[21px] text-[#4b5563]">Delivery Instructions (optional)</span>
                    <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
                      <input
                        className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
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
                      className="accent-[#0a4833] size-4"
                    />
                    <span className="text-sm leading-[21px] text-[#4b5563]">Save this address for future orders</span>
                  </label>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-[#f3f4f6] bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
              <h2 className="text-lg font-bold leading-7 text-[#1f4d3a] mb-4">Payment Method</h2>
              <div className="flex h-24 w-full max-w-[200px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-[#1f4d3a] bg-white px-5 text-center text-[#1f4d3a]">
                <Banknote size={23} />
                <span className="mt-2 text-[13px] font-medium leading-[14px]">COD</span>
                <span className="text-[10px] leading-3 text-[#9ca3af]">Pay on delivery</span>
              </div>
            </section>

            {/* Place Order Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1f4d3a] text-lg font-bold text-white transition hover:bg-[#1a4331] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing Order..." : "Place Order"}
              {!submitting && <ArrowRight size={17} />}
            </button>

            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-base font-bold leading-6 text-[#1f4d3a] transition hover:text-[#1a4331]"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-28">
            <section className="rounded-3xl border border-[#f3f4f6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
              <h2 className="text-2xl font-bold leading-9 text-[#1f4d3a]">Order Summary</h2>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <Truck size={18} className="text-[#1f4d3a]" />
                <p className="text-sm text-[#4b5563]">
                  Cash on Delivery — Pay when your order arrives
                </p>
              </div>

              <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                Visa · Mastercard · PayPal · Apple Pay
              </p>
            </section>
          </aside>
        </div>

        <section className="mt-16 pt-4">
          <h2 className="text-2xl font-bold leading-8 text-[#1f4d3a]">
            Complete your order with these
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {addOns.map((product) => (
              <AddOnCard key={product.name} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
