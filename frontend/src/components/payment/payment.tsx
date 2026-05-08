"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  HelpCircle,
  MapPin,
  Plus,
  Truck,
} from "lucide-react";
import { FaCreditCard, FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCcMastercard, FaCcVisa, FaCcPaypal, FaCcApplePay } from "react-icons/fa";

const orderItem = {
  name: "Zewadi Buckwheat",
  image: "/product/p-main.webp",
  quantity: 1,
  price: 348,
};

const summary = {
  subtotal: 722,
  shipping: "Free",
  tax: 57.76,
  total: 779.76,
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

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
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

function AddressCard() {
  return (
    <section className="rounded-2xl border border-[#f3f4f6] bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold leading-7 text-[#1f4d3a]">Shipping Address</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 self-start text-sm font-bold text-[#1f4d3a] transition hover:text-[#1a4331]"
        >
          <Plus size={14} strokeWidth={2.8} />
          Add New Address
        </button>
      </div>

      <div className="mt-4 flex gap-4 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
        <MapPin className="mt-1 shrink-0 text-[#1f4d3a]" size={18} fill="currentColor" />
        <div>
          <p className="font-bold leading-6 text-[#1f4d3a]">Jane Doe</p>
          <p className="text-sm leading-5 text-[#6b7280]">123 Safari Lane, Nairobi, Kenya</p>
          <p className="text-sm leading-5 text-[#6b7280]">+254 712 345 678</p>
        </div>
      </div>
    </section>
  );
}

function MethodTiles() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:max-w-[420px]">
      <button
        type="button"
        className="flex h-24 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[#1f4d3a] bg-white px-5 text-center text-[#1f4d3a]"
      >
        <FaCreditCard size={22} />
        <span className="text-[13px] font-bold leading-[18px]">Credit/Debit Card</span>
      </button>
      <button
        type="button"
        className="flex h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-[#e5e7eb] bg-white px-5 text-center text-[#6b7280] transition hover:border-[#1f4d3a]"
      >
        <FaMoneyBillTransfer size={23} />
        <span className="mt-2 text-[13px] font-medium leading-[14px]">COD</span>
        <span className="text-[10px] leading-3 text-[#9ca3af]">Pay on delivery</span>
      </button>
    </div>
  );
}

function Field({
  label,
  placeholder,
  trailing,
}: {
  label: string;
  placeholder: string;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium leading-[21px] text-[#4b5563]">{label}</span>
      <span className="mt-2 flex min-h-[54px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 focus-within:border-[#1f4d3a]">
        <input
          className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f4d3a] outline-none placeholder:text-[#9ca3af]"
          placeholder={placeholder}
          aria-label={label}
        />
        {trailing}
      </span>
    </label>
  );
}

function CardForm() {
  return (
    <section className="rounded-2xl border border-[#f3f4f6] bg-white p-5 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Cardholder Name" placeholder="John Doe" />
        <Field
          label="Card Number"
          placeholder="0000 0000 0000 0000"
          trailing={
            <span className="ml-3 flex items-center gap-2">
              <FaCcVisa size={24} className="text-[#1f4d3a]" />
              <FaCcMastercard size={24} className="text-[#9ca3af] opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0" />
            </span>
          }
        />
        <Field label="Expiry Date" placeholder="MM/YY" />
        <Field
          label="CVV"
          placeholder="123"
          trailing={<HelpCircle size={16} className="ml-3 shrink-0 text-[#9ca3af]" />}
        />
      </div>

      <label className="mt-8 flex items-center gap-3">
        <span className="flex size-5 items-center justify-center rounded bg-[#1f4d3a] text-white">
          <Check size={13} strokeWidth={3} />
        </span>
        <input type="checkbox" defaultChecked className="sr-only" />
        <span className="text-sm leading-[21px] text-[#4b5563]">Save card for future purchases</span>
      </label>
    </section>
  );
}

function OrderSummary() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      <section className="rounded-3xl border border-[#f3f4f6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:p-8">
        <h2 className="text-2xl font-bold leading-9 text-[#1f4d3a]">Order Summary</h2>

        <div className="mt-7 space-y-4 border-b border-[#f3f4f6] pb-6 text-base">
          <div className="flex justify-between gap-4">
            <span className="text-[#4b5563]">Subtotal</span>
            <span className="font-semibold text-[#1f4d3a]">{money.format(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#4b5563]">Shipping</span>
            <span className="font-semibold text-[#1f4d3a]">{summary.shipping}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#4b5563]">Estimated Tax</span>
            <span className="font-semibold text-[#1f4d3a]">{money.format(summary.tax)}</span>
          </div>
        </div>

        <div className="relative mt-6">
          <input
            aria-label="Promo code"
            placeholder="Promo code"
            className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 pr-24 text-sm font-medium text-[#1f4d3a] outline-none placeholder:text-[#9ca3af] focus:border-[#1f4d3a]"
          />
          <button
            type="button"
            className="absolute bottom-2 right-2 top-2 rounded-lg bg-[#1f4d3a] px-4 text-sm font-semibold text-white transition hover:bg-[#1a4331]"
          >
            Apply
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 py-2">
          <span className="text-lg font-bold text-[#1f4d3a]">Total</span>
          <span className="text-[30px] font-bold leading-[45px] text-[#1f4d3a]">
            {money.format(summary.total)}
          </span>
        </div>

        <Link
          href="/orderplaced"
          className="mt-5 flex h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1f4d3a] text-lg font-bold text-white transition hover:bg-[#1a4331] active:scale-[0.99]"
        >
          Complete Payment
          <ArrowRight size={17} />
        </Link>

        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-bold uppercase text-[#9ca3af]">
          <FaCcVisa size={20} />
          <FaCcMastercard size={20} />
          <FaCcPaypal size={20} />
          <FaCcApplePay size={20} />
        </div>
      </section>

      <section className="flex items-center gap-4 rounded-2xl border border-[#f3f4f6] bg-white p-4 opacity-75">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f9fafb] p-2">
          <Image src={orderItem.image} alt={orderItem.name} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-[21px] text-[#1f4d3a]">{orderItem.name}</p>
          <p className="text-xs leading-[18px] text-[#6b7280]">Quantity: {orderItem.quantity}</p>
        </div>
        <p className="text-sm font-bold leading-[21px] text-[#1f4d3a]">
          {money.format(orderItem.price)}
        </p>
      </section>
    </aside>
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
  return (
    <main className="bg-[#fffef5] px-4 pb-24 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-[1100px]">
        <CheckoutBreadcrumb />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-8">
            <header>
              <h1 className="text-3xl font-bold leading-9 text-[#1f4d3a]">Payment Method</h1>
              <p className="mt-2 text-base leading-6 text-[#6b7280]">
                Complete your purchase by providing your payment details.
              </p>
            </header>

            <AddressCard />
            <MethodTiles />
            <CardForm />

            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-base font-bold leading-6 text-[#1f4d3a] transition hover:text-[#1a4331]"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>
          </div>

          <OrderSummary />
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
