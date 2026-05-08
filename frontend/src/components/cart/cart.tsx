"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, Minus, Plus, Trash2 } from "lucide-react";
import { FaCcMastercard, FaCcVisa, FaCcPaypal, FaCcApplePay } from "react-icons/fa";
import { useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
};

type SuggestedProduct = {
  name: string;
  variant: string;
  image: string;
  price: number;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Zewadi Buckwheat",
    description:
      "Wireless Noise Cancelling. Zewadi Buckwheat is a wholesome, naturally gluten-free grain packed with fiber, protein, and essential nutrients.",
    image: "/product/buckwheat.webp",
    price: 348,
    quantity: 7,
  },
  {
    id: 2,
    name: "Zewadi Oats",
    description:
      "A nutritious whole grain rich in fiber, especially beta-glucan, that supports heart health, aids digestion, and keeps you full for longer.",
    image: "/product/oats.webp",
    price: 348,
    quantity: 1,
  },
  {
    id: 3,
    name: "Zewadi Flaxseed",
    description:
      "A small but powerful seed packed with omega-3 fatty acids, fiber, and antioxidants. It supports digestion, heart health, and overall wellness.",
    image: "/product/flaxseed.webp",
    price: 348,
    quantity: 1,
  },
];

const suggestions: SuggestedProduct[] = [
  {
    name: "Organic Dates",
    variant: "Sandstone",
    image: "/product/p-4.webp",
    price: 349.99,
  },
  {
    name: "Red Quinoa",
    variant: "Space Gray",
    image: "/product/quinoa.webp",
    price: 549,
  },
  {
    name: "Broken wheat",
    variant: "Sandstone",
    image: "/product/broken wheet.webp",
    price: 349.99,
  },
  {
    name: "Chia Seed",
    variant: "Space Gray",
    image: "/product/chia.webp",
    price: 549,
  },
  {
    name: "White Quinoa",
    variant: "Space Gray",
    image: "/product/quinoa.webp",
    price: 549,
  },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function QuantityControl({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex h-8 items-center rounded-full bg-[#f3f4f6] px-3 text-[#1f4d3a]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        className="flex size-5 items-center justify-center rounded-full transition hover:bg-white"
      >
        <Minus size={13} strokeWidth={2.8} />
      </button>
      <span className="min-w-8 text-center text-sm font-bold leading-5">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
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
}: {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="grid gap-4 rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)] sm:grid-cols-[108px_1fr] sm:p-6 lg:grid-cols-[108px_1fr_128px]">
      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-[#f9fafb] sm:w-[108px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="108px"
          className="object-cover mix-blend-multiply"
        />
      </div>

      <div className="min-w-0 self-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between lg:block">
          <h2 className="text-base font-bold leading-7 text-[#1f4d3a]">{item.name}</h2>
          <p className="text-lg font-bold leading-7 text-[#1f4d3a] lg:hidden">
            {money.format(item.price)}
          </p>
        </div>
        <p className="max-w-[650px] text-xs leading-5 text-[#6b7280] sm:text-sm">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <QuantityControl value={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280] transition hover:text-red-600"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>

      <p className="hidden self-start justify-self-end pt-3 text-xl font-bold leading-7 text-[#1f4d3a] lg:block">
        {money.format(item.price)}
      </p>
    </article>
  );
}

function OrderSummary({
  subtotal,
  tax,
  total,
}: {
  subtotal: number;
  tax: number;
  total: number;
}) {
  return (
    <aside className="h-fit rounded-[20px] border border-[#f3f4f6] bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
      <h2 className="text-xl font-bold leading-7 text-[#1f4d3a]">Order Summary</h2>

      <div className="mt-7 space-y-5 text-sm">
        <div className="flex items-center justify-between text-[#6b7280]">
          <span>Subtotal</span>
          <span className="font-bold text-[#1f4d3a]">{money.format(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[#6b7280]">
          <span>Shipping</span>
          <span className="font-bold text-[#1f4d3a]">Free</span>
        </div>
        <div className="flex items-center justify-between text-[#6b7280]">
          <span>Estimated Tax</span>
          <span className="font-bold text-[#1f4d3a]">{money.format(tax)}</span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#f3f4f6] pt-6">
        <span className="text-base font-bold text-[#1f4d3a]">Total</span>
        <span className="text-[28px] font-bold leading-9 text-[#1f4d3a]">{money.format(total)}</span>
      </div>

      <Link
        href="/payment"
        className="mt-7 flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-[#1f4d3a] px-6 text-sm font-bold text-white shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition hover:bg-[#1a4331] active:scale-[0.99]"
      >
        Proceed to Checkout
        <ArrowRight size={17} />
      </Link>

      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-[#9ca3af]">
        <FaCcVisa size={20} />
        <FaCcMastercard size={20} />
        <FaCcPaypal size={20} />
        <FaCcApplePay size={20} />
      </div>
    </aside>
  );
}

function SuggestedCard({ product }: { product: SuggestedProduct }) {
  return (
    <article className="rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
      <div className="relative h-48 overflow-hidden rounded-xl bg-[#f9fafb]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 255px, (min-width: 768px) 30vw, 90vw"
          className="object-cover mix-blend-multiply transition duration-500 hover:scale-105"
        />
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-[#9ca3af] shadow-sm transition hover:text-[#1f4d3a]"
        >
          <Heart size={16} />
        </button>
      </div>

      <h3 className="mt-4 text-base font-bold leading-6 text-[#1f4d3a]">{product.name}</h3>
      <p className="mt-1 text-sm leading-5 text-[#6b7280]">{product.variant}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold leading-7 text-[#1f4d3a]">{money.format(product.price)}</p>
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          className="flex size-10 items-center justify-center rounded-full border border-[#e5e7eb] text-[#1f4d3a] transition hover:border-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white"
        >
          <Plus size={16} strokeWidth={2.8} />
        </button>
      </div>
    </article>
  );
}

export default function Cart() {
  const [items, setItems] = useState(initialCartItems);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const tax = subtotal * 0.0772;
  const total = subtotal + tax;

  const updateQuantity = (id: number, direction: 1 | -1) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + direction) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-10">
          <section>
            <div className="mb-7 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold leading-9 text-[#1f4d3a]">Your Cart</h1>
              <p className="text-base font-medium leading-6 text-[#6b7280]">
                {items.length} items
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onDecrease={() => updateQuantity(item.id, -1)}
                  onIncrease={() => updateQuantity(item.id, 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f4d3a] transition hover:text-[#1a4331]"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </section>

          <div className="lg:mt-[64px]">
            <OrderSummary subtotal={subtotal} tax={tax} total={total} />
          </div>
        </div>

        <section className="mt-10 lg:mt-14">
          <h2 className="text-2xl font-bold leading-8 text-[#1f4d3a]">You might also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {suggestions.map((product) => (
              <SuggestedCard key={product.name} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
