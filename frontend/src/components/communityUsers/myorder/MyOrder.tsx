"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleX,
  Clock3,
  Download,
  Eye,
  Filter,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Star,
  Truck,
  Package,
} from "lucide-react";
import api from "@/services/api";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { getImageUrl } from "@/lib/utils";

type ApiOrderListItem = {
  order_id: string;
  product_name: string;
  product_image?: string | null;
  pack_name?: string;
  quantity?: number;
  total_amount: string | number;
  charged_currency?: string;
  status: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at?: string;
};

type ApiCustomGiftListItem = {
  custom_gift_id: string;
  box_name: string;
  items?: Array<{
    name?: string;
    quantity?: number;
  }>;
  total_amount: string | number;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at?: string;
};

type OrderLifecycleStatus = "Pending" | "Confirmed" | "Conformed" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
type TabFilter = "All Orders" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
type SortMode = "latest" | "oldest" | "amount";

type OrderItem = {
  id: string;
  title: string;
  orderId: string;
  image: string;
  isCustomGift?: boolean;
  orderDate: string;
  quantity: string;
  totalAmount: string;
  totalValue: number;
  dateLabel: string;
  dateValue: string;
  lifecycleStatus: OrderLifecycleStatus;
  createdAt: number;
};

type ApiOrderResponse = ApiOrderListItem[] | { results?: ApiOrderListItem[] };
type ApiCustomGiftResponse = ApiCustomGiftListItem[] | { results?: ApiCustomGiftListItem[] };

const ITEMS_PER_PAGE = 4;
const tabs: TabFilter[] = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];
const progressStages = [
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];
const fallbackImages = ["/product/p-1.webp", "/product/p-2.webp", "/product/p-3.webp", "/product/p-4.webp"];
const customGiftImage = "/userdash/custom-gift-box.svg";

function toList<T>(data: T[] | { results?: T[] }): T[] {
  return Array.isArray(data) ? data : data.results ?? [];
}

function toLifecycleStatus(status: string): OrderLifecycleStatus {
  const normalized = status.toLowerCase().replace(/[_\s-]+/g, "_");
  if (normalized === "pending") return "Pending";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "conformed") return "Conformed";
  if (normalized === "delivered") return "Delivered";
  if (normalized === "cancelled") return "Cancelled";
  if (normalized === "shipped") return "Shipped";
  if (normalized === "out_for_delivery") return "Out for Delivery";
  return "Processing";
}

function toOrderTitle(productName: string): string {
  return productName?.trim() || "ZEWADI Buckwheat Product";
}

function toCurrency(value: string | number, currency = "SAR"): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return `${currency} 0.00`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
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

function addDaysLabel(value: string, days: number): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  parsed.setDate(parsed.getDate() + days);
  return toDateLabel(parsed.toISOString());
}

function getStatusPercent(status: OrderLifecycleStatus) {
  if (status === "Cancelled") return "Cancelled";
  if (status === "Pending") return "Pending";
  if (status === "Confirmed" || status === "Conformed") return "0% Complete";
  if (status === "Processing") return "25% Complete";
  if (status === "Shipped") return "50% Complete";
  if (status === "Out for Delivery") return "75% Complete";
  return "100% Complete";
}

function getCompletedStageIndex(status: OrderLifecycleStatus) {
  if (status === "Pending") return -1;
  if (status === "Confirmed" || status === "Conformed") return 0;
  if (status === "Processing") return 1;
  if (status === "Shipped") return 2;
  if (status === "Out for Delivery") return 3;
  if (status === "Delivered") return 4;
  return 0;
}

function getBadgeData(status: OrderLifecycleStatus) {
  if (status === "Pending") {
    return { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", Icon: Clock3, label: "Pending" };
  }
  if (status === "Confirmed") {
    return { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]", Icon: CheckCircle2, label: "Confirmed" };
  }
  if (status === "Conformed") {
    return { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]", Icon: CheckCircle2, label: "Conformed" };
  }
  if (status === "Out for Delivery") {
    return { bg: "bg-[#DCFCE7]", text: "text-[#047857]", Icon: Truck, label: "Out for Delivery" };
  }
  if (status === "Delivered") {
    return { bg: "bg-[#D1FAE5]", text: "text-[#047857]", Icon: CheckCircle2, label: "Delivered" };
  }
  if (status === "Cancelled") {
    return { bg: "bg-[#E5E7EB]", text: "text-[#9CA3AF]", Icon: CircleX, label: "Cancelled" };
  }
  if (status === "Shipped") {
    return { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", Icon: PackageCheck, label: "Shipped" };
  }
  return { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]", Icon: Package, label: "Processing" };
}

function matchesTab(order: OrderItem, activeTab: TabFilter) {
  if (activeTab === "All Orders") return true;
  if (activeTab === "Shipped") return order.lifecycleStatus === "Shipped" || order.lifecycleStatus === "Out for Delivery";
  return order.lifecycleStatus === activeTab;
}

function getDateMeta(order: OrderItem) {
  if (order.lifecycleStatus === "Delivered") {
    return { label: "Delivered On", value: order.dateValue };
  }
  if (order.lifecycleStatus === "Cancelled") {
    return { label: "Status", value: "Cancelled" };
  }
  return { label: "Expected Delivery", value: order.dateValue };
}

function toOrderImageUrl(imagePath: string | null | undefined, index: number): string {
  if (!imagePath) return fallbackImages[index % fallbackImages.length];
  return getImageUrl(imagePath);
}

function mapRegularOrder(item: ApiOrderListItem, index: number): OrderItem {
  const lifecycleStatus = toLifecycleStatus(item.status);
  const createdAt = new Date(item.created_at).getTime();
  const dateLabel = lifecycleStatus === "Delivered" ? "Delivered On" : "Expected Delivery";
  return {
    id: item.order_id,
    title: toOrderTitle(item.product_name),
    orderId: item.order_id,
    image: toOrderImageUrl(item.product_image, index),
    orderDate: toDateLabel(item.created_at),
    quantity: `${item.quantity ?? 1} x ${item.pack_name || "pack"}`,
    totalAmount: toCurrency(item.total_amount, item.charged_currency || "SAR"),
    totalValue: Number(item.total_amount) || 0,
    dateLabel,
    dateValue: lifecycleStatus === "Delivered" ? toDateLabel(item.updated_at || item.created_at) : addDaysLabel(item.created_at, 4),
    lifecycleStatus,
    createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
  };
}

function mapCustomGiftOrder(item: ApiCustomGiftListItem): OrderItem {
  const lifecycleStatus = toLifecycleStatus(item.status);
  const createdAt = new Date(item.created_at).getTime();
  const quantity = item.items?.reduce((sum, product) => sum + Number(product.quantity ?? 0), 0) || 1;
  return {
    id: item.custom_gift_id,
    title: item.box_name || "Custom Gift Box",
    orderId: item.custom_gift_id,
    image: customGiftImage,
    isCustomGift: true,
    orderDate: toDateLabel(item.created_at),
    quantity: `${quantity} x gift box`,
    totalAmount: toCurrency(item.total_amount),
    totalValue: Number(item.total_amount) || 0,
    dateLabel: "Expected Delivery",
    dateValue: addDaysLabel(item.created_at, 4),
    lifecycleStatus,
    createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
  };
}

export default function MyOrder() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("All Orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [last30DaysOnly, setLast30DaysOnly] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const [ordersResponse, customGiftsResponse] = await Promise.all([
          api.get<ApiOrderResponse>("/orders/"),
          api.get<ApiCustomGiftResponse>("/orders/custom-gifts/"),
        ]);
        if (!isMounted) return;

        const mapped = [
          ...toList(ordersResponse.data).map(mapRegularOrder),
          ...toList(customGiftsResponse.data).map(mapCustomGiftOrder),
        ];

        setOrders(mapped);
        setExpandedOrderId(mapped.find((item) => item.lifecycleStatus === "Out for Delivery")?.id ?? null);
      } catch {
        if (isMounted) setLoadError("Failed to load orders.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const deliveredCount = orders.filter((item) => item.lifecycleStatus === "Delivered").length;
    const cancelledCount = orders.filter((item) => item.lifecycleStatus === "Cancelled").length;
    const activeCount = orders.filter((item) =>
      ["Pending", "Confirmed", "Conformed", "Processing", "Shipped", "Out for Delivery"].includes(item.lifecycleStatus)
    ).length;

    return [
      { label: "Total Orders", value: String(orders.length), tag: "All Time", Icon: ShoppingBag, valueClass: "text-[#0A4833]" },
      { label: "Active Orders", value: String(activeCount), tag: "In Progress", Icon: Clock3, valueClass: "text-[#9F8151]" },
      { label: "Delivered Orders", value: String(deliveredCount), tag: "Completed", Icon: CheckCircle2, valueClass: "text-[#0A4833]" },
      { label: "Cancelled Orders", value: String(cancelledCount), tag: "Cancelled", Icon: CircleX, valueClass: "text-[#9CA3AF]" },
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return orders
      .filter((order) => matchesTab(order, activeTab))
      .filter((order) => !last30DaysOnly || now - order.createdAt <= thirtyDays)
      .sort((a, b) => {
        if (sortMode === "oldest") return a.createdAt - b.createdAt;
        if (sortMode === "amount") return b.totalValue - a.totalValue;
        return b.createdAt - a.createdAt;
      });
  }, [activeTab, last30DaysOnly, orders, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  function onTabClick(tab: TabFilter) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function toggleOrderExpansion(orderId: string) {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  }

  function onActionClick(e: React.MouseEvent, orderId: string, actionLabel: string) {
    e.stopPropagation();
    if (actionLabel === "Track Order") {
      router.push(`/communityDashBoard/myorders/order-tracking?orderId=${encodeURIComponent(orderId)}`);
      return;
    }
    if (actionLabel === "View Details") {
      router.push(`/communityDashBoard/myorders/order-placed?orderId=${encodeURIComponent(orderId)}`);
      return;
    }
    if (actionLabel === "Write Review") {
      router.push(`/communityDashBoard/myorders/review/${encodeURIComponent(orderId)}`);
      return;
    }
    if (actionLabel === "Reorder") {
      router.push("/communityDashBoard/products");
      return;
    }
    setStatusMessage("Invoice download is not available in the MVP.");
  }

  function getActions(status: OrderLifecycleStatus) {
    if (status === "Delivered") {
      return [
        { label: "Reorder", variant: "primary" as const, Icon: RefreshCw },
        { label: "Write Review", variant: "secondary" as const, Icon: Star },
        { label: "Invoice", variant: "secondary" as const, Icon: Download },
      ];
    }
    if (status === "Pending" || status === "Confirmed" || status === "Conformed" || status === "Processing") {
      return [
        { label: "View Details", variant: "secondary" as const, Icon: Eye },
        { label: "Reorder", variant: "secondary" as const, Icon: RefreshCw },
        { label: "Invoice", variant: "secondary" as const, Icon: Download },
      ];
    }
    if (status === "Cancelled") {
      return [
        { label: "Reorder", variant: "primary" as const, Icon: RefreshCw },
        { label: "Invoice", variant: "secondary" as const, Icon: Download },
      ];
    }
    return [
      { label: "Track Order", variant: "primary" as const, Icon: Truck },
      { label: "View Details", variant: "secondary" as const, Icon: Eye },
      { label: "Invoice", variant: "secondary" as const, Icon: Download },
    ];
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold leading-10 tracking-[-0.02em] text-[#0A4833]">My Orders</h1>
          <p className="text-base leading-6 tracking-[-0.02em] text-[#9F8151]">
            Track your buckwheat purchases, delivery updates, and order history.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {stats.map(({ label, value, tag, valueClass, Icon }) => (
            <article key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <div className="flex h-12 items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EBE1CF] text-[#0A4833]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium tracking-[-0.02em] text-[#9F8151]">{tag}</span>
              </div>
              <p className={`mt-4 text-[30px] font-bold leading-9 tracking-[-0.02em] ${valueClass}`}>{value}</p>
              <p className="mt-2 text-sm leading-5 tracking-[-0.02em] text-[#9F8151]">{label}</p>
            </article>
          ))}
        </div>

        <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabClick(tab)}
                  className={`h-9 rounded-lg px-4 text-sm font-medium tracking-[-0.02em] transition-colors ${
                    activeTab === tab ? "bg-[#0A4833] text-white" : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E4D7C1]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block">
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="h-10 min-w-[180px] appearance-none rounded-lg border-0 bg-[#EBE1CF] px-4 pr-10 text-sm font-medium tracking-[-0.02em] text-[#0A4833] outline-none"
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="amount">Sort by: Amount</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A4833]" />
              </label>
              <button
                type="button"
                onClick={() => {
                  setLast30DaysOnly((v) => !v);
                  setCurrentPage(1);
                }}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium tracking-[-0.02em] transition-colors ${
                  last30DaysOnly ? "bg-[#0A4833] text-white" : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E4D7C1]"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filter by Date
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-xl border border-[#DFDFDF] bg-[#F9FAFB] px-4 py-3 text-sm text-[#4B5563]">
            {statusMessage}
          </div>
        )}

        <ErrorBoundary>
          <div className="space-y-4">
            {isLoading && <div className="p-6 text-sm text-[#9F8151]">Loading orders...</div>}
            {loadError && !isLoading && <div className="rounded-xl border border-[#F3D7D7] bg-[#FFF7F7] p-6 text-sm text-[#9B1C1C]">{loadError}</div>}
            
            {!isLoading && paginatedOrders.map((order) => {
              const badge = getBadgeData(order.lifecycleStatus);
              const actions = getActions(order.lifecycleStatus);
              const dateMeta = getDateMeta(order);
              const isExpanded = expandedOrderId === order.id;
              const showTracking = isExpanded && order.lifecycleStatus !== "Delivered" && order.lifecycleStatus !== "Cancelled";
              const currentStageIndex = getCompletedStageIndex(order.lifecycleStatus);

              return (
                <article
                  key={order.orderId}
                  onClick={() => toggleOrderExpansion(order.id)}
                  className={`overflow-hidden rounded-xl border border-[#DFDFDF] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-all ${
                    isExpanded ? "ring-1 ring-[#0A4833]" : "hover:border-[#0A4833]"
                  }`}
                >
                  <div className="p-5 lg:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#EBE1CF]">
                        <Image src={order.image} alt={order.title} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h2 className="truncate text-lg font-semibold leading-7 tracking-[-0.02em] text-[#0A4833]">{order.title}</h2>
                            <p className="text-sm leading-5 tracking-[-0.02em] text-[#9F8151]">Order ID: #{order.orderId}</p>
                          </div>
                          <span className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-medium ${badge.bg} ${badge.text}`}>
                            <badge.Icon className="h-3 w-3" />
                            {badge.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm md:grid-cols-4">
                          <OrderMeta label="Order Date" value={order.orderDate} />
                          {!order.isCustomGift && <OrderMeta label="Quantity" value={order.quantity} />}
                          <OrderMeta label="Total Amount" value={order.totalAmount} />
                          <OrderMeta label={dateMeta.label} value={dateMeta.value} />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {actions.map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              onClick={(e) => onActionClick(e, order.id, action.label)}
                              className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium ${
                                action.variant === "primary" ? "bg-[#0A4833] text-white hover:bg-[#083B2A]" : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E4D7C1]"
                              }`}
                            >
                              <action.Icon className="h-4 w-4" />
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {showTracking && (
                    <div className="border-t border-[#DFDFDF] bg-[#EBE1CF] px-5 py-6 lg:px-6">
                      <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#0A4833]">
                        <span>DELIVERY PROGRESS</span>
                        <span className="rounded-full bg-white px-2 py-0.5">{getStatusPercent(order.lifecycleStatus)}</span>
                      </div>
                      <div className="grid grid-cols-5 items-start gap-2">
                        {progressStages.map((stage, index) => {
                          const isDone = index <= currentStageIndex;
                          const isCurrent = index === currentStageIndex;
                          const StageIcon = stage === "Out for Delivery" ? Truck : isDone ? Check : Circle;
                          return (
                            <div key={stage} className="relative flex flex-col items-center gap-2 text-center">
                              {index < progressStages.length - 1 && (
                                <span className={`absolute left-[calc(50%+16px)] top-4 h-0.5 w-[calc(100%-32px)] ${index < currentStageIndex ? "bg-[#0A4833]" : "bg-white"}`} />
                              )}
                              <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${isCurrent ? "bg-[#9F8151] text-white" : isDone ? "bg-[#0A4833] text-white" : "bg-white text-[#CBD5E1]"}`}>
                                <StageIcon className="h-3.5 w-3.5" />
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-tight sm:text-xs ${isDone || isCurrent ? "text-[#0A4833]" : "text-[#9F8151]"}`}>
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {!isLoading && paginatedOrders.length === 0 && (
              <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#9F8151]">No orders found for this filter.</div>
            )}
          </div>
        </ErrorBoundary>

        {!isLoading && filteredOrders.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <PaginationButton label="Previous" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </PaginationButton>
            {pageNumbers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={`h-10 w-10 rounded-lg border text-sm font-medium ${currentPage === p ? "border-[#0A4833] bg-[#0A4833] text-white" : "border-[#DFDFDF] bg-white text-[#0A4833]"}`}
              >
                {p}
              </button>
            ))}
            <PaginationButton label="Next" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight className="h-4 w-4" />
            </PaginationButton>
          </div>
        )}
      </div>
    </section>
  );
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs leading-4 text-[#9F8151]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#0A4833]">{value}</p>
    </div>
  );
}

function PaginationButton({ children, disabled, label, onClick }: { children: ReactNode; disabled: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DFDFDF] bg-white text-[#0A4833] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
