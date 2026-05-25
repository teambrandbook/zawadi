"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Download,
  Headphones,
  Leaf,
  MapPin,
  Package,
  ReceiptText,
  RefreshCw,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";

type Order = {
  id?: number;
  order_id: string;
  product_code?: string;
  product_name: string;
  product_image?: string | null;
  pack_name: string;
  pack_price?: string;
  selling_price?: string;
  quantity: number;
  subtotal?: string;
  delivery_charge?: string;
  tax_amount?: string;
  total_amount: string;
  charged_currency?: string;
  charged_amount?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  city?: string;
  postal_code?: string;
  address?: string;
  instructions?: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
};

type TrackingStep = {
  key: string;
  label: string;
  detail: string;
};

const STATUS_STEPS: TrackingStep[] = [
  { key: "confirmed", label: "Order Placed", detail: "Confirmed" },
  { key: "processing", label: "Processing", detail: "Preparing" },
  { key: "shipped", label: "In Transit", detail: "Shipped" },
  { key: "delivered", label: "Delivered", detail: "Complete" },
];

const STATUS_PROGRESS: Record<string, number> = {
  pending: 0,
  confirmed: 0,
  processing: 1,
  shipped: 2,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: -1,
};

function formatDate(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", options ?? { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function titleCase(value?: string) {
  return String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function money(order: Pick<Order, "charged_currency" | "total_amount">, value?: string | number | null) {
  const amount = Number(value ?? 0);
  const formatted = Number.isFinite(amount) ? amount.toFixed(2) : String(value ?? "-");
  return `${order.charged_currency || "SAR"} ${formatted}`;
}

function getOrderProgress(status: string) {
  return STATUS_PROGRESS[status] ?? 0;
}

function productImageSrc(order: Order) {
  return order.product_image ? getImageUrl(order.product_image) : "";
}

function selectedOrderFromList(orders: Order[], highlight: string | null) {
  if (highlight) {
    return orders.find((order) => order.order_id === highlight) ?? orders[0];
  }
  return orders[0];
}

function uniqueOrders(orders: Order[]) {
  const seen = new Set<string>();
  return orders.filter((order) => {
    if (seen.has(order.order_id)) return false;
    seen.add(order.order_id);
    return true;
  });
}

function downloadInvoice(order: Order, items: Order[]) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal ?? item.total_amount ?? 0), 0);
  const deliveryFee = items.reduce((sum, item) => sum + Number(item.delivery_charge ?? 0), 0);
  const tax = items.reduce((sum, item) => sum + Number(item.tax_amount ?? 0), 0);
  const total = items.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0);
  const itemLines = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.product_name}
   Pack: ${item.pack_name}
   Qty: ${item.quantity}
   Amount: ${money(order, item.total_amount)}`
    )
    .join("\n\n");

  const invoiceText = `ZEWADI INVOICE

Order ID: #${order.order_id}
Order Placed: ${formatDate(order.created_at)}
Last Update: ${formatDateTime(order.updated_at || order.created_at)}
Payment Method: ${titleCase(order.payment_method)}
Invoice Status: ${titleCase(order.payment_status)}
Delivery Status: ${titleCase(order.status)}

Shipping Address:
${order.full_name || "-"}
${order.address || "-"}
${[order.city, order.postal_code].filter(Boolean).join(", ") || "-"}
${order.phone || "-"}
${order.email || "-"}

Items:
${itemLines || "-"}

Subtotal: ${money(order, subtotal)}
Delivery Fee: ${deliveryFee === 0 ? "FREE" : money(order, deliveryFee)}
Tax: ${money(order, tax)}
Total Amount: ${money(order, total)}
`;

  const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `zewadi-invoice-${order.order_id}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function EmptyOrders() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-28 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4ef] text-[#1f4d3a]">
        <Package className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xl font-bold text-[#1f4d3a]">No orders yet</p>
        <p className="mt-2 max-w-md text-sm text-[#64706c]">Your order tracking details will appear here after checkout.</p>
      </div>
      <Link href="/products" className="rounded-full bg-[#1f4d3a] px-6 py-3 text-sm font-bold text-white">
        Shop Now
      </Link>
    </div>
  );
}

export default function TrackOrder() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const highlightRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(highlight);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/")
      .then((res) => {
        const data = res.data;
        setOrders(Array.isArray(data) ? data : data.results ?? []);
      })
      .catch(() => {
        toast.error("Could not load orders.");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || orders.length === 0) return;
    const highlightedOrder = highlight ? orders.find((order) => order.order_id === highlight) : null;
    if (highlightedOrder) {
      setSelectedOrderId(highlightedOrder.order_id);
      return;
    }
    setSelectedOrderId((current) => {
      if (current && orders.some((order) => order.order_id === current)) return current;
      return orders[0].order_id;
    });
  }, [highlight, loading, orders]);

  const orderList = useMemo(() => uniqueOrders(orders), [orders]);
  const selectedOrder = useMemo(() => {
    if (selectedOrderId) {
      return orders.find((order) => order.order_id === selectedOrderId) ?? selectedOrderFromList(orders, highlight);
    }
    return selectedOrderFromList(orders, highlight);
  }, [highlight, orders, selectedOrderId]);
  const selectedItems = useMemo(() => {
    if (!selectedOrder) return [];
    return orders.filter((order) => order.order_id === selectedOrder.order_id);
  }, [orders, selectedOrder]);

  useEffect(() => {
    if (!loading && highlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, highlight]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-28 text-sm font-semibold text-[#1f4d3a]">
        Loading order tracking...
      </div>
    );
  }

  if (!selectedOrder) return <EmptyOrders />;

  const progress = getOrderProgress(selectedOrder.status);
  const isCancelled = selectedOrder.status === "cancelled";
  const subtotal = selectedItems.reduce((sum, item) => sum + Number(item.subtotal ?? item.total_amount ?? 0), 0);
  const deliveryFee = selectedItems.reduce((sum, item) => sum + Number(item.delivery_charge ?? 0), 0);
  const tax = selectedItems.reduce((sum, item) => sum + Number(item.tax_amount ?? 0), 0);
  const total = selectedItems.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0);

  return (
    <main className="bg-[#fffef5] px-3 pb-12 pt-36 text-[#121414] sm:px-5 sm:pt-40 lg:px-8 lg:pt-44">
      <div className="mx-auto max-w-[1120px] space-y-5 sm:space-y-6">
        {orderList.length > 1 ? (
          <section className="rounded-[18px] border border-[#e3dbd8] bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#121414]">Recent Orders</h2>
                <p className="text-xs text-[#64706c]">Select an order to view its tracking details.</p>
              </div>
              <span className="text-xs font-bold text-[#1f4d3a]">{orderList.length} orders</span>
            </div>

            <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {orderList.map((order) => {
                const isActive = order.order_id === selectedOrder.order_id;
                return (
                  <button
                    key={order.order_id}
                    type="button"
                    onClick={() => setSelectedOrderId(order.order_id)}
                    className={`min-w-[220px] rounded-[14px] border p-3 text-left transition sm:min-w-[240px] ${
                      isActive
                        ? "border-[#1f4d3a] bg-[#f3f8f4] ring-2 ring-[#1f4d3a]/10"
                        : "border-[#e3dbd8] bg-[#fffef5] hover:border-[#d8c29a]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-[#121414]">#{order.order_id}</p>
                        <p className="mt-1 truncate text-xs text-[#64706c]">{order.product_name}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold capitalize ${
                        isActive ? "bg-[#1f4d3a] text-white" : "bg-[#f6f5f0] text-[#3f4e50]"
                      }`}>
                        {titleCase(order.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-[#64706c]">{formatDate(order.created_at, { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="font-extrabold text-[#1f4d3a]">{money(order, order.total_amount)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section
          ref={selectedOrder.order_id === highlight ? highlightRef : undefined}
          className="rounded-[18px] border border-[#e3dbd8] bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-6 lg:p-7"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#acacac]">Order ID</span>
                <h1 className="break-words text-2xl font-extrabold tracking-tight text-[#121414] sm:text-[28px]">
                  #{selectedOrder.order_id}
                </h1>
              </div>
              <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3 sm:text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#acacac]">Order Placed</p>
                  <p className="mt-1 font-semibold text-[#3f4e50]">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#acacac]">Last Update</p>
                  <p className="mt-1 font-semibold text-[#3f4e50]">{formatDateTime(selectedOrder.updated_at || selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#acacac]">Payment</p>
                  <p className="mt-1 font-semibold text-[#3f4e50]">
                    {titleCase(selectedOrder.payment_method)} / {titleCase(selectedOrder.payment_status)}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => downloadInvoice(selectedOrder, selectedItems)}
              className="flex w-full items-center gap-3 rounded-[10px] bg-[#f6f5f0] p-3 text-left transition hover:bg-[#efede6] lg:w-auto lg:min-w-[200px]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#d8c29a]/35 text-[#b47800]">
                <ReceiptText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#121414]">Invoice Status</p>
                <p className="truncate text-xs text-[#3f4e50]">{titleCase(selectedOrder.payment_status)}</p>
              </div>
              <Download className="h-4 w-4 text-[#1f4d3a]" />
            </button>
          </div>
        </section>

        <section className="rounded-[18px] border border-[#e3dbd8] bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-6 lg:p-7">
          <h2 className="text-base font-extrabold text-[#121414]">Delivery Status</h2>
          {isCancelled ? (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">This order has been cancelled.</div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-5">
              {STATUS_STEPS.map((step, index) => {
                const done = index <= progress;
                const active = index === progress;
                return (
                  <div key={step.key} className="relative flex flex-col items-center text-center">
                    {index < STATUS_STEPS.length - 1 ? (
                      <div className={`absolute left-1/2 top-4 hidden h-0.5 w-full sm:block ${index < progress ? "bg-[#1f4d3a]" : "bg-[#e3dbd8]"}`} />
                    ) : null}
                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${
                        done ? "border-[#1f4d3a] bg-[#1f4d3a] text-white" : "border-[#e3dbd8] bg-white text-[#acacac]"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : active ? <Truck className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#121414] sm:text-sm">{step.label}</p>
                    <p className="mt-1 text-xs text-[#acacac]">{done ? step.detail : "Pending"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-[18px] border border-[#e3dbd8] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-[#e3dbd8] px-4 py-3 sm:px-6">
              <h2 className="text-sm font-extrabold text-[#1f4d3a]">Items in this Order</h2>
              <span className="text-xs text-[#3f4e50] sm:text-sm">{selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"}</span>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              {selectedItems.map((item) => {
                const imageSrc = productImageSrc(item);
                return (
                  <article key={`${item.order_id}-${item.id ?? item.product_name}`} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:gap-5">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#f6f5f0] sm:h-[76px] sm:w-[76px]">
                      {imageSrc ? (
                        <Image src={imageSrc} alt={item.product_name} fill unoptimized className="object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-[#1f4d3a]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-extrabold text-[#121414] sm:text-base">{item.product_name}</h3>
                      <p className="mt-1 break-words text-xs leading-5 text-[#3f4e50] sm:text-sm">{item.pack_name}</p>
                      {item.product_code ? <p className="mt-1 text-[11px] font-semibold text-[#acacac]">{item.product_code}</p> : null}
                    </div>
                    <div className="col-span-2 flex items-center justify-between text-left sm:col-span-1 sm:block sm:text-right">
                      <p className="text-sm font-extrabold text-[#121414] sm:text-base">{money(selectedOrder, item.total_amount)}</p>
                      <p className="mt-1 text-xs text-[#acacac]">Qty: {item.quantity}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="space-y-3 bg-[#f6f5f0] p-4 sm:p-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#3f4e50]">Subtotal</span>
                <span className="font-semibold text-[#121414]">{money(selectedOrder, subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#3f4e50]">Delivery Fee</span>
                <span className="font-bold text-[#1f4d3a]">{deliveryFee === 0 ? "FREE" : money(selectedOrder, deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#3f4e50]">Tax</span>
                <span className="font-semibold text-[#121414]">{money(selectedOrder, tax)}</span>
              </div>
              <div className="h-px bg-[#e3dbd8]" />
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-[#121414]">Total Amount</span>
                <span className="text-xl font-extrabold text-[#1f4d3a]">{money(selectedOrder, total)}</span>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[18px] border border-[#e3dbd8] bg-white p-5 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f5f0] text-[#1f4d3a]">
                  <MapPin className="h-4 w-4" />
                </span>
                <h2 className="text-base font-extrabold text-[#121414]">Shipping Address</h2>
              </div>
              <div className="mt-4 space-y-1 text-sm leading-6 text-[#3f4e50]">
                <p className="font-extrabold text-[#121414]">{selectedOrder.full_name || "-"}</p>
                <p>{selectedOrder.address || "-"}</p>
                <p>{[selectedOrder.city, selectedOrder.postal_code].filter(Boolean).join(", ") || "-"}</p>
                <p className="pt-2">{selectedOrder.phone || "-"}</p>
                {selectedOrder.email ? <p>{selectedOrder.email}</p> : null}
                {selectedOrder.instructions ? <p className="pt-2 text-sm italic">{selectedOrder.instructions}</p> : null}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[18px] bg-[#1f4d3a] p-6 text-white">
              <Leaf className="absolute -bottom-6 -right-6 h-24 w-24 text-white/20" />
              <div className="relative">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#d8c29a]">Order Care</p>
                <h3 className="mt-2 text-lg font-extrabold">Fresh Delivery Support</h3>
                <p className="mt-2 max-w-sm text-xs leading-5 text-white/80 sm:text-sm">
                  Track status updates and contact support for this order when you need help.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-3 rounded-[12px] border-2 border-[#1f4d3a] bg-white py-3 text-sm font-extrabold text-[#1f4d3a]"
              >
                <Headphones className="h-4 w-4" />
                Contact Support
              </Link>
              <Link
                href="/guestprofile/history"
                className="flex w-full items-center justify-center gap-3 rounded-[12px] border border-[#e3dbd8] bg-[#f6f5f0] py-3 text-sm font-extrabold text-[#3f4e50]"
              >
                <RefreshCw className="h-4 w-4" />
                Modify Delivery
              </Link>
            </div>
          </aside>
        </section>

        <div className="flex justify-center py-2">
          <Link href="/guestprofile/history" className="inline-flex items-center gap-2 text-xs font-bold text-[#b47800] sm:text-sm">
            <ChevronLeft className="h-4 w-4" />
            Back to Order History
          </Link>
        </div>

        <section className="rounded-[18px] border border-[#e3dbd8] bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#d8c29a] bg-[#f6f5f0] text-[#1f4d3a]">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#121414] sm:text-lg">Looking for more fresh ideas?</h2>
                <p className="mt-1 text-xs text-[#3f4e50] sm:text-sm">Check out personalized recipes based on your current harvest.</p>
              </div>
            </div>
            <Link href="/recipes" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1f4d3a] px-5 py-3 text-sm font-bold text-white">
              Explore Recipes
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b47800]">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
