"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  UserRound,
  ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import api from "@/services/api";

const menuItems = [
  { label: "My Profile", Icon: UserRound, href: "/guestprofile#personal-info" },
  { label: "Orders", Icon: ReceiptText, href: "/guestprofile/history", active: true },
  { label: "My Recipes", iconSrc: "/userdash/myrecipy/my-recipes-icon.png", href: "/guestprofile#my-recipes" },
];

type UserProfile = {
  full_name?: string;
  email?: string;
  photo?: string | null;
};

type ApiOrderListItem = {
  order_id: string;
  product_name?: string;
  total_amount: string | number;
  status: string;
  created_at: string;
};

type ApiOrderResponse = ApiOrderListItem[] | { results?: ApiOrderListItem[] };

type HistoryOrder = {
  id: string;
  date: string;
  status: string;
  total: string;
  tone: keyof typeof statusStyles;
  title: string;
};

const statusStyles = {
  processing: "bg-[#3b82f6] text-[#2563eb]",
  delivered: "bg-[#22c55e] text-[#16a34a]",
  cancelled: "bg-[#ef4444] text-[#dc2626]",
} as const;

const ITEMS_PER_PAGE = 5;

function toList(data: ApiOrderResponse): ApiOrderListItem[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

function toCurrency(value: string | number): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function toDateLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toStatusLabel(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function toStatusTone(value: string): keyof typeof statusStyles {
  const normalized = value.toLowerCase().replace(/[_\s-]+/g, "_");
  if (normalized === "delivered") return "delivered";
  if (normalized === "cancelled") return "cancelled";
  return "processing";
}

function mapOrder(item: ApiOrderListItem): HistoryOrder {
  return {
    id: item.order_id,
    date: toDateLabel(item.created_at),
    status: toStatusLabel(item.status || "processing"),
    total: toCurrency(item.total_amount),
    tone: toStatusTone(item.status || "processing"),
    title: item.product_name?.trim() || "Your Zewadi order",
  };
}

function ProfileSidebar({ profile }: { profile: UserProfile | null }) {
  return (
    <aside className="space-y-4 w-full">
      <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 size-32">
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-[#d8c29a]">
              <Image
                src={profile?.photo || "/about/testimonial.webp"}
                alt={profile?.full_name || "Profile"}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-[#1f4d3a] text-white"
            >
              <Camera size={15} />
            </button>
          </div>

          <h1 className="text-2xl font-bold leading-9 tracking-[0.001em] text-[#121414]">
            {profile?.full_name || "Guest User"}
          </h1>
          <p className="text-base leading-6 text-[#3f4e50]">{profile?.email || ""}</p>
        </div>

        <nav className="mt-8 space-y-2 sm:mt-10">
          {menuItems.map(({ label, Icon, iconSrc, href, active }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex w-full items-center gap-4 rounded-[15px] p-4 text-left text-base font-semibold transition",
                active ? "bg-[#1f4d3a] text-white" : "text-[#1f4d3a] hover:bg-[#f6f5f0]"
              )}
            >
              {iconSrc ? (
                <Image src={iconSrc} alt="" width={16} height={16} className="size-4" />
              ) : Icon ? (
                <Icon size={16} />
              ) : null}
              {label}
            </Link>
          ))}
        </nav>
      </section>
    </aside>
  );
}

function LatestOrderCard({ latestOrder }: { latestOrder: HistoryOrder | null }) {
  if (!latestOrder) {
    return (
      <section className="rounded-[25px] border border-[rgba(216,194,154,0.3)] bg-[#f6f5f0] p-6 sm:p-8 lg:p-10">
        <p className="text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#1f4d3a]">
          No Orders Yet
        </p>
        <h2 className="mt-4 max-w-[720px] text-[28px] font-bold leading-tight text-[#121414] sm:text-[32px] sm:leading-10">
          Start your wellness journey
        </h2>
        <Link
          href="/products"
          className="mt-7 inline-flex h-[60px] items-center gap-4 rounded-full bg-[#1f4d3a] px-7 text-base font-semibold text-white transition hover:bg-[#1a4331] sm:px-8"
        >
          Shop Now
          <span className="flex h-8 w-12 items-center justify-center rounded-full bg-[#b47800]">
            <ArrowRight size={18} strokeWidth={1.5} />
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-[25px] border border-[rgba(216,194,154,0.3)] bg-[#f6f5f0] p-6 sm:p-8 lg:p-10">
      <p className="text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#1f4d3a]">
        Latest Order: #{latestOrder.id}
      </p>
      <h2 className="mt-4 max-w-[720px] text-[28px] font-bold leading-tight text-[#121414] sm:text-[32px] sm:leading-10">
        {latestOrder.title}
      </h2>
      <p className="mt-3 text-base leading-6 text-[#3f4e50] capitalize">
        Status: {latestOrder.status}
      </p>
      <Link
        href={`/trackorder?highlight=${encodeURIComponent(latestOrder.id)}`}
        className="mt-7 inline-flex h-[60px] items-center gap-4 rounded-full bg-[#1f4d3a] px-7 text-base font-semibold text-white transition hover:bg-[#1a4331] sm:px-8"
      >
        View Order Tracking
        <span className="flex h-8 w-12 items-center justify-center rounded-full bg-[#b47800]">
          <ArrowRight size={18} strokeWidth={1.5} />
        </span>
      </Link>
    </section>
  );
}

function StatusBadge({ tone, label }: { tone: keyof typeof statusStyles; label: string }) {
  const [dotClass, textClass] = statusStyles[tone].split(" ");

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", textClass)}>
      <span className={cn("size-2 rounded-full", dotClass)} />
      {label}
    </span>
  );
}

function OrderTable({ orders, isLoading, loadError }: { orders: HistoryOrder[]; isLoading: boolean; loadError: string }) {
  if (isLoading) {
    return <div className="p-6 text-center text-sm text-[#1f4d3a]">Loading orders...</div>;
  }

  if (loadError) {
    return <div className="rounded-xl bg-[#fff5f5] p-6 text-center text-sm font-semibold text-[#dc2626]">{loadError}</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6 text-center text-sm text-[#3f4e50]">No orders yet.</div>;
  }

  return (
    <>
      <div className="hidden space-y-4 md:block">
        <div className="grid grid-cols-[1.1fr_1.05fr_1.05fr_0.85fr_1fr] border-b border-[#f6f5f0] px-6 pb-4 text-sm font-bold uppercase leading-5 tracking-[0.05em] text-[#acacac]">
          <span>Order ID</span>
          <span>Date</span>
          <span>Status</span>
          <span>Total</span>
          <span className="text-right">Action</span>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="grid min-h-14 grid-cols-[1.1fr_1.05fr_1.05fr_0.85fr_1fr] items-center rounded-xl bg-[rgba(246,245,240,0.3)] px-6 py-4"
          >
            <span className="text-base font-bold leading-6 text-[#121414]">{order.id}</span>
            <span className="text-base leading-6 text-[#3f4e50]">{order.date}</span>
            <StatusBadge tone={order.tone as keyof typeof statusStyles} label={order.status} />
            <span className="text-base font-bold leading-6 text-[#121414]">{order.total}</span>
            <Link
              href={`/trackorder?highlight=${encodeURIComponent(order.id)}`}
              className="text-right text-base font-bold leading-6 text-[#1f4d3a] transition hover:text-[#b47800]"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl bg-[rgba(246,245,240,0.45)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#121414]">{order.id}</h3>
                <p className="mt-1 text-sm text-[#3f4e50]">{order.date}</p>
              </div>
              <p className="text-base font-bold text-[#121414]">{order.total}</p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <StatusBadge tone={order.tone as keyof typeof statusStyles} label={order.status} />
              <Link href={`/trackorder?highlight=${encodeURIComponent(order.id)}`} className="text-sm font-bold text-[#1f4d3a]">
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function OrderHistoryPanel({ orders, isLoading, loadError }: { orders: HistoryOrder[]; isLoading: boolean; loadError: string }) {
  return (
    <section className="overflow-hidden rounded-[25px] border border-[#e3dbd8] bg-white shadow-sm">
      <div className="flex border-b border-[#e3dbd8]">
        <Link
          href="/guestprofile"
          className="px-6 py-5 text-lg font-bold text-[#acacac] transition hover:text-[#1f4d3a] sm:px-10"
        >
          My Recipes
        </Link>
        <span className="border-b-4 border-[#1f4d3a] px-6 py-5 text-lg font-semibold text-[#1f4d3a] sm:px-10">
          Order History
        </span>
      </div>

      <div className="space-y-6 p-5 sm:p-8 lg:p-10">
        <OrderTable orders={orders} isLoading={isLoading} loadError={loadError} />
      </div>
    </section>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Order history pages" className="flex items-center justify-center gap-2 pt-3">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={cn(
            "flex size-10 items-center justify-center rounded-lg border text-sm font-bold transition",
            page === currentPage
              ? "border-[#1f4d3a] bg-[#1f4d3a] text-white"
              : "border-[#e3dbd8] text-[#3f4e50] hover:border-[#1f4d3a] hover:text-[#1f4d3a]"
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex size-10 items-center justify-center rounded-lg border border-[#e3dbd8] text-[#3f4e50] transition hover:border-[#1f4d3a] hover:text-[#1f4d3a]"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default function History() {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.user.isAuthenticated);
  const isRehydrating = useSelector((s: RootState) => s.user.isRehydrating);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const redirectToLogin = useCallback(() => {
    router.replace(`/login?next=${encodeURIComponent("/guestprofile/history")}`);
  }, [router]);

  useEffect(() => {
    // Wait until rehydration completes before making routing decisions.
    if (isRehydrating) return;

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    let isMounted = true;

    async function loadHistory() {
      try {
        const [meRes, ordersRes] = await Promise.all([
          api.get("/account/me/"),
          api.get<ApiOrderResponse>("/orders/?page_size=100"),
        ]);

        if (!isMounted) return;
        setProfile(meRes.data);
        setOrders(toList(ordersRes.data).map(mapOrder));
      } catch {
        if (!isMounted) return;
        setLoadError("Failed to load orders.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [isRehydrating, isAuthenticated, redirectToLogin]);

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const paginatedOrders = useMemo(
    () => orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [currentPage, orders]
  );

  if (isRehydrating || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProfileSidebar profile={profile} />

        <div className="space-y-4 sm:space-y-6">
          <LatestOrderCard latestOrder={orders[0] ?? null} />
          <OrderHistoryPanel orders={paginatedOrders} isLoading={isLoading} loadError={loadError} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </main>
  );
}
