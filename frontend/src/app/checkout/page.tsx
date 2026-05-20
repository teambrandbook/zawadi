"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { setCartCount } from "@/redux/userSlice";
import { formatPrice } from "@/utils/formatPrice";

type CartSummary = {
  item_count: number;
  subtotal: string;
  shipping: string;
  tax: string;
  tax_rate: string;
  tax_country: string;
  currency_code: string;
  currency_symbol: string;
  currency_decimal_places: number;
  total: string;
  free_shipping_unlocked: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    country: "SA",
    instructions: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    api
      .get(`/orders/cart/?country=${form.country}`)
      .then((res) => {
        const s: CartSummary = res.data.summary;
        if (!s || s.item_count === 0) {
          router.replace("/cart");
          return;
        }
        setSummary(s);
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 401 || status === 403) {
          router.replace("/login?next=/checkout");
        } else {
          toast.error("Could not load cart.");
          router.replace("/cart");
        }
      })
      .finally(() => setLoadingCart(false));
  }, [router, form.country]);

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.full_name.trim()) e.full_name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.postal_code.trim()) e.postal_code = "Postal code is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await api.post("/orders/cart/checkout/", {
        ...form,
        payment_method: "cod",
      });
      dispatch(setCartCount(0));
      router.push(`/orderplaced?order_id=${res.data.primary_order_id}`);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string; missing?: string[] } } })
        .response?.data;
      if (detail?.detail) {
        toast.error(detail.detail);
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function field(name: keyof typeof form) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [name]: e.target.value })),
    };
  }

  if (loadingCart) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#0A4833]">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-[#1a4331]"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-[#1f4d3a]">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Delivery form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <h2 className="text-lg font-bold text-[#1f4d3a]">Delivery Details</h2>

            {[
              { name: "full_name" as const, label: "Full Name", type: "text", placeholder: "Priya Sharma" },
              { name: "phone" as const, label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
              { name: "email" as const, label: "Email Address", type: "email", placeholder: "priya@example.com" },
              { name: "city" as const, label: "City", type: "text", placeholder: "Bengaluru" },
              { name: "postal_code" as const, label: "Postal Code", type: "text", placeholder: "560001" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  {...field(name)}
                  className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#1f4d3a] focus:ring-2 focus:ring-[#1f4d3a]/20"
                />
                {errors[name] && (
                  <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1f4d3a] focus:ring-2 focus:ring-[#1f4d3a]/20"
              >
                <option value="SA">Saudi Arabia (SAR)</option>
                <option value="AE">United Arab Emirates (AED)</option>
                <option value="BH">Bahrain (BHD)</option>
                <option value="OM">Oman (OMR)</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="House / Flat no., Street, Area"
                {...field("address")}
                className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#1f4d3a] focus:ring-2 focus:ring-[#1f4d3a]/20"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#374151]">
                Delivery Instructions (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Leave at door, ring bell, etc."
                {...field("instructions")}
                className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#1f4d3a] focus:ring-2 focus:ring-[#1f4d3a]/20"
              />
            </div>

            {/* Payment method — COD only */}
            <div className="rounded-xl border border-[#1f4d3a]/30 bg-[#f0f7f4] p-4">
              <h2 className="mb-3 text-base font-bold text-[#1f4d3a]">Payment Method</h2>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  defaultChecked
                  readOnly
                  className="accent-[#1f4d3a]"
                />
                <span className="flex items-center gap-2 text-sm font-semibold text-[#1f4d3a]">
                  <ShoppingBag size={16} />
                  Cash on Delivery
                </span>
              </label>
              <p className="mt-1.5 pl-7 text-xs text-[#6b7280]">
                Pay when your order arrives. No advance payment required.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-[58px] w-full rounded-xl bg-[#1f4d3a] text-sm font-bold text-white shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition hover:bg-[#1a4331] active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </form>

          {/* Order summary sidebar */}
          {summary && (
            <aside className="h-fit rounded-[20px] border border-[#f3f4f6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-bold text-[#1f4d3a]">Order Summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1f4d3a]">
                    {formatPrice(summary.subtotal, summary.currency_code || "SAR", summary.currency_decimal_places || 2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#1f4d3a]">
                    {parseFloat(summary.shipping) === 0
                      ? "Free"
                      : formatPrice(summary.shipping, summary.currency_code || "SAR", summary.currency_decimal_places || 2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>
                    VAT ({summary.tax_rate ? `${(parseFloat(summary.tax_rate) * 100).toFixed(0)}%` : "estimated"})
                  </span>
                  <span className="font-bold text-[#1f4d3a]">
                    {formatPrice(summary.tax, summary.currency_code || "SAR", summary.currency_decimal_places || 2)}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-between border-t border-[#f3f4f6] pt-5">
                <span className="text-base font-bold text-[#1f4d3a]">Total</span>
                <span className="text-2xl font-bold text-[#1f4d3a]">
                  {formatPrice(summary.total, summary.currency_code || "SAR", summary.currency_decimal_places || 2)}
                </span>
              </div>
              {process.env.NEXT_PUBLIC_ZATCA_TRN && (
                <p className="text-xs text-gray-500 mt-2">
                  VAT Registration No: {process.env.NEXT_PUBLIC_ZATCA_TRN}
                </p>
              )}
              <p className="mt-4 text-center text-[10px] font-bold uppercase text-[#9ca3af]">
                COD · Free Returns
              </p>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
