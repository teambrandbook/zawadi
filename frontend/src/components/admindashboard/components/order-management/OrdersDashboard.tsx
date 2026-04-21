"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import OrderFilters from "./components/OrderFilters";
import OrdersHeader from "./components/OrdersHeader";
import OrderStats from "./components/OrderStats";
import OrderStatusModal from "./components/OrderStatusModal";
import RecentOrdersTable from "./components/RecentOrdersTable";

type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  pack: string;
  date: string;
  amount: string;
  status: string;
  payment: "Paid" | "Pending" | "Refunded";
  avatar: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiOrder(item: Record<string, any>, index: number): Order {
  return {
    id: String(item.order_id ?? item.id ?? `ORD-${index + 1}`),
    customer: String(item.full_name ?? item.customer_name ?? item.customer ?? "Unknown"),
    email: String(item.email ?? ""),
    product: String(item.product_name ?? item.product ?? "—"),
    pack: String(item.pack ?? item.variant ?? ""),
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : String(item.date ?? ""),
    amount: item.total_amount != null ? `$${parseFloat(item.total_amount).toFixed(2)}` : String(item.amount ?? "$0.00"),
    status: String(item.status ?? "Pending"),
    payment:
      item.payment_method === "Refunded" || item.payment_status === "refunded"
        ? "Refunded"
        : item.payment_method === "Pending" || item.payment_status === "pending"
        ? "Pending"
        : "Paid",
    avatar: String(item.avatar ?? item.customer_avatar ?? ""),
  };
}

function toCsv(rows: Order[]) {
  const header = ["Order ID", "Customer", "Email", "Product", "Pack", "Date", "Amount", "Status", "Payment"];
  const body = rows.map((o) => [o.id, o.customer, o.email, o.product, o.pack, o.date, o.amount, o.status, o.payment]);
  return [header, ...body].map((line) => line.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [payment, setPayment] = useState("Payment Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/orders/admin/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: Record<string, any>[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setOrders(raw.map(mapApiOrder));
    } catch {
      setFetchError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const bySearch =
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const byStatus = status === "All Status" || o.status === status;
      const byPayment = payment === "Payment Status" || o.payment === payment;
      const orderTime = new Date(o.date).getTime();
      const fromTime = fromDate ? new Date(fromDate).getTime() : null;
      const toTime = toDate ? new Date(toDate).getTime() : null;
      const validDate = !Number.isNaN(orderTime);
      const afterFrom = fromTime === null || (!Number.isNaN(fromTime) && validDate && orderTime >= fromTime);
      const beforeTo = toTime === null || (!Number.isNaN(toTime) && validDate && orderTime <= toTime);
      return bySearch && byStatus && byPayment && afterFrom && beforeTo;
    });
  }, [orders, search, status, payment, fromDate, toDate]);

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function handleExport() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function openStatusModal(orderId: string) {
    setActiveOrderId(orderId);
    setModalOpen(true);
  }

  async function saveStatus(nextStatus: string) {
    try {
      await api.patch(`/orders/admin/${activeOrderId}/status/`, { status: nextStatus });
      setOrders((prev) => prev.map((o) => (o.id === activeOrderId ? { ...o, status: nextStatus } : o)));
    } catch {
      window.alert("Failed to update order status. Please try again.");
    } finally {
      setModalOpen(false);
    }
  }

  const activeOrder = orders.find((o) => o.id === activeOrderId);

  return (
    <section className="w-full min-h-screen bg-white p-4 lg:p-6 overflow-x-hidden">
      <div className="mx-auto max-w-[1180px] w-full space-y-6">
        <OrdersHeader
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onFilterClick={() => setStatus((s) => (s === "All Status" ? "Processing" : "All Status"))}
          onExport={handleExport}
        />

        <div className="w-full overflow-hidden">
          <OrderStats />
        </div>

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading orders...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}
        {!isLoading && !fetchError && orders.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No orders found.
          </div>
        )}

        <OrderFilters
          status={status}
          payment={payment}
          fromDate={fromDate}
          toDate={toDate}
          onChange={(field, value) => {
            if (field === "status") setStatus(value);
            if (field === "payment") setPayment(value);
            if (field === "fromDate") setFromDate(value);
            if (field === "toDate") setToDate(value);
          }}
          onApply={() => setPage(1)}
          onClear={() => {
            setStatus("All Status");
            setPayment("Payment Status");
            setFromDate("");
            setToDate("");
            setSearch("");
            setPage(1);
          }}
        />

        <div className="w-full overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <div className="min-w-[800px] lg:min-w-full">
            <RecentOrdersTable
              rows={paged}
              page={safePage}
              perPage={perPage}
              total={filtered.length}
              onPageChange={(nextPage) => setPage(Math.max(1, Math.min(nextPage, totalPages)))}
              onOpenStatus={openStatusModal}
            />
          </div>
        </div>
      </div>

      <OrderStatusModal
        open={modalOpen}
        currentStatus={activeOrder?.status ?? ""}
        onClose={() => setModalOpen(false)}
        onSave={saveStatus}
      />
    </section>
  );
}