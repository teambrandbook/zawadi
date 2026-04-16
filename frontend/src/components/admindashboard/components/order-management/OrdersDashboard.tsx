"use client";

import { useMemo, useState } from "react";
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

const allOrders: Order[] = [
  { id: "ZW-2024-001", customer: "Sarah Johnson", email: "sarah.j@email.com", product: "Organic Buckwheat Flour", pack: "2kg Pack", date: "Dec 28, 2024", amount: "$45.99", status: "Processing", payment: "Pending", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-002", customer: "Michael Chen", email: "m.chen@email.com", product: "Buckwheat Groats", pack: "1kg Pack", date: "Dec 27, 2024", amount: "$29.99", status: "Delivered", payment: "Paid", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-003", customer: "Emma Wilson", email: "emma.w@email.com", product: "Buckwheat Pancake Mix", pack: "500g Pack", date: "Dec 26, 2024", amount: "$19.99", status: "Shipped", payment: "Paid", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-004", customer: "Noah Patel", email: "noah.p@email.com", product: "Buckwheat Noodles", pack: "1kg Pack", date: "Dec 25, 2024", amount: "$24.49", status: "Packed", payment: "Paid", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-005", customer: "Sophia Lee", email: "sophia.l@email.com", product: "Buckwheat Cookies", pack: "400g Pack", date: "Dec 24, 2024", amount: "$14.99", status: "Out for Delivery", payment: "Paid", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-006", customer: "David Kim", email: "david.k@email.com", product: "Buckwheat Flour", pack: "5kg Pack", date: "Dec 23, 2024", amount: "$79.90", status: "Processing", payment: "Pending", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-007", customer: "Ava Brown", email: "ava.b@email.com", product: "Buckwheat Pasta", pack: "750g Pack", date: "Dec 22, 2024", amount: "$21.75", status: "Shipped", payment: "Paid", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-008", customer: "Liam Scott", email: "liam.s@email.com", product: "Buckwheat Granola", pack: "600g Pack", date: "Dec 21, 2024", amount: "$17.60", status: "Delivered", payment: "Paid", avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-009", customer: "Mia Taylor", email: "mia.t@email.com", product: "Buckwheat Energy Bar", pack: "12 pcs", date: "Dec 20, 2024", amount: "$12.80", status: "Packed", payment: "Paid", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-010", customer: "Ethan Ray", email: "ethan.r@email.com", product: "Buckwheat Mix", pack: "3kg Pack", date: "Dec 19, 2024", amount: "$39.00", status: "Processing", payment: "Refunded", avatar: "https://images.unsplash.com/photo-1542204625-de293a3b0b7b?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-011", customer: "Olivia Stone", email: "olivia.s@email.com", product: "Buckwheat Tea", pack: "20 bags", date: "Dec 18, 2024", amount: "$11.50", status: "Out for Delivery", payment: "Paid", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  { id: "ZW-2024-012", customer: "James Cole", email: "james.c@email.com", product: "Buckwheat Crackers", pack: "300g Pack", date: "Dec 17, 2024", amount: "$9.95", status: "Delivered", payment: "Paid", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face" },
];

function toCsv(rows: Order[]) {
  const header = ["Order ID", "Customer", "Email", "Product", "Pack", "Date", "Amount", "Status", "Payment"];
  const body = rows.map((o) => [o.id, o.customer, o.email, o.product, o.pack, o.date, o.amount, o.status, o.payment]);
  return [header, ...body].map((line) => line.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(allOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [payment, setPayment] = useState("Payment Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const bySearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
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

  function saveStatus(nextStatus: string) {
    setOrders((prev) => prev.map((o) => (o.id === activeOrderId ? { ...o, status: nextStatus } : o)));
    setModalOpen(false);
  }

  const activeOrder = orders.find((o) => o.id === activeOrderId);

  return (
    <section className="w-full bg-[#F3F4F6] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <OrdersHeader
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onFilterClick={() => setStatus((s) => (s === "All Status" ? "Processing" : "All Status"))}
          onExport={handleExport}
        />

        <OrderStats />

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

        <RecentOrdersTable
          rows={paged}
          page={safePage}
          perPage={perPage}
          total={filtered.length}
          onPageChange={(nextPage) => setPage(Math.max(1, Math.min(nextPage, totalPages)))}
          onOpenStatus={openStatusModal}
        />
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
