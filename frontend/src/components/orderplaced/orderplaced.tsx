"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import api from "@/services/api";
import { toast } from "sonner";

type OrderDetail = {
  order_id: string;
  product_name: string;
  pack_name: string;
  quantity: number;
  total_amount: string;
  delivery_charge: string;
  status: string;
  payment_method: string;
  created_at: string;
  full_name: string;
  address: string;
  city: string;
  postal_code: string;
};

export default function OrderPlaced() {
  const tickRef = useRef<SVGSVGElement>(null);
  const yellowRef = useRef<HTMLSpanElement>(null);
  const greenRef = useRef<HTMLSpanElement>(null);
  const outerCircleRef = useRef<HTMLDivElement>(null);
  const middleCircleRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    api
      .get(`/orders/${orderId}/`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        toast.error("Could not load order details.");
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (loading || !order) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // Tick mark drawing animation (opposite direction)
    if (tickRef.current) {
      const paths = tickRef.current.querySelectorAll("path, polyline, line");
      paths.forEach((node) => {
        const path = node as SVGGeometryElement;
        // Add a small padding (2px) to prevent the rounded linecap dot from showing up
        const length = path.getTotalLength() + 2;

        // Negative length starts drawing from the opposite end
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: -length, opacity: 1 });
      });

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    // Shadow circles expanding from behind the main center circle
    const circleElements = [middleCircleRef.current, outerCircleRef.current].filter(Boolean);
    if (circleElements.length > 0) {
      tl.fromTo(
        circleElements,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)", stagger: 0.15 },
        "-=0.6"
      );
    }

    // Small rounds from center (behind the big round)
    if (yellowRef.current) {
      tl.fromTo(
        yellowRef.current,
        { scale: 0.5, x: -70, y: 70, opacity: 0 },
        { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.5)" },
        "-=0.4"
      );
    }

    if (greenRef.current) {
      tl.fromTo(
        greenRef.current,
        { scale: 0.5, x: 70, y: -50, opacity: 0 },
        { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.5)" },
        "-=0.5"
      );
    }

    return () => {
      tl.kill();
    };
  }, [loading, order]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#6b7280]">Order not found.</p>
        <Link
          href="/products"
          className="rounded-lg bg-[#0a4833] px-6 py-2 text-sm text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-28 sm:px-6 md:pt-32 lg:px-12 xl:px-24">
      <section className="mx-auto flex min-h-[520px] max-w-[1440px] flex-col items-center justify-center text-center md:min-h-[620px]">
        <div className="relative mb-8 size-[160px] sm:size-[190px] md:size-[220px]">
          {/* Main circles wrapper with z-10 to stay above small circles */}
          <div className="absolute inset-0 z-10">
            <div ref={outerCircleRef} className="absolute inset-0 rounded-full bg-[rgba(31,77,58,0.05)]" />
            <div ref={middleCircleRef} className="absolute inset-3 rounded-full bg-[rgba(31,77,58,0.1)] sm:inset-4" />
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-[#1f4d3a] text-white sm:inset-8">
              <Check ref={tickRef} size={48} strokeWidth={3} className="md:size-[60px]" />
            </div>
          </div>
          <span ref={yellowRef} className="absolute right-1 top-0 size-6 rounded-full bg-[#b47800] sm:-right-2 sm:-top-2 sm:size-[36px] z-0" />
          <span ref={greenRef} className="absolute bottom-6 left-1 size-5 rounded-full bg-[#2f735b] sm:bottom-8 sm:left-[-8px] sm:size-8 z-0" />
        </div>

        <div className="mx-auto max-w-[800px]">
          <h1 className="font-dm text-[28px] font-bold leading-tight text-[#1f4d3a] sm:text-4xl lg:text-[48px] lg:leading-[56px]">
            Order Successfully Placed!
          </h1>
          <p className="mx-auto mt-3 max-w-[600px] text-sm font-medium leading-6 text-[#121414]/70 sm:text-lg">
            Thank you for choosing Zewadi. Your journey to wellness continues.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-[#d8c29a] bg-[#f6f5f0] px-5 py-2.5 text-sm font-bold leading-5 text-[#1f4d3a]">
            Order ID: #{order.order_id}
          </div>

          {/* Product summary */}
          <div className="mx-auto mt-4 w-full max-w-[600px] rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
            <p className="text-sm font-semibold text-[#111827]">{order.product_name}</p>
            {order.pack_name && (
              <p className="mt-0.5 text-xs text-[#6b7280]">{order.pack_name} · Qty {order.quantity}</p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-[#6b7280]">Total</span>
              <span className="text-sm font-bold text-[#0a4833]">₹{order.total_amount}</span>
            </div>
          </div>

          {order.full_name && (
            <p className="mt-4 text-sm text-[#6b7280]">
              Delivering to {order.full_name} — {order.city}
            </p>
          )}
        </div>

        <Link
          href={`/trackorder?highlight=${order.order_id}`}
          className="mt-8 inline-flex h-[60px] w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-[#b47800] px-6 text-base font-bold leading-6 text-white transition hover:bg-[#9c6900] active:scale-[0.99]"
        >
          Track Order
          <ArrowRight size={20} />
        </Link>

        <div className="mt-10 flex flex-col items-center gap-4 text-base font-bold leading-6 text-[#1f4d3a] sm:flex-row sm:gap-6">
          <Link href="/products" className="inline-flex items-center gap-2 transition hover:text-[#1a4331]">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          <span className="hidden h-6 w-px bg-[#d8c29a] sm:block" />
          <Link
            href="/communityDashBorde/myorders"
            className="transition hover:text-[#1a4331]"
          >
            View All Orders
          </Link>
        </div>
      </section>
    </main>
  );
}
