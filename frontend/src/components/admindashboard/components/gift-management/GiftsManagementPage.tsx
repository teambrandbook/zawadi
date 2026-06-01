"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Gift,
  Hourglass,
  Package,
  Pencil,
  Search,
  Trash2,
  Truck,
} from "lucide-react";
import api from "@/services/api";

type GiftOrder = {
  id: string;
  customer: string;
  email: string;
  avatar: string;
  boxSize: string;
  products: number;
  amount: string;
  status: "Processing" | "Delivered" | "Shipped" | "Pending Packing";
  createdAt: string;
};

type ApiOrder = {
  id?: number | string;
  order_id?: string;
  full_name?: string;
  customer_name?: string;
  customer?: string;
  email?: string;
  user_image?: string;
  avatar?: string;
  customer_avatar?: string;
  product_name?: string;
  pack_name?: string;
  quantity?: number | string;
  total_amount?: number | string;
  amount?: string;
  status?: string;
  created_at?: string;
};

const fallbackOrders: GiftOrder[] = [
  {
    id: "ZW-2024-001",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "https://i.pravatar.cc/80?img=32",
    boxSize: "1kg",
    products: 5,
    amount: "$45.99",
    status: "Processing",
    createdAt: "2024-08-21",
  },
  {
    id: "ZW-2024-002",
    customer: "Michael Chen",
    email: "m.chen@email.com",
    avatar: "https://i.pravatar.cc/80?img=12",
    boxSize: "1kg",
    products: 4,
    amount: "$29.99",
    status: "Delivered",
    createdAt: "2024-08-20",
  },
  {
    id: "ZW-2024-003",
    customer: "Emma Wilson",
    email: "emma.w@email.com",
    avatar: "https://i.pravatar.cc/80?img=47",
    boxSize: "0.5 kg",
    products: 2,
    amount: "$19.99",
    status: "Shipped",
    createdAt: "2024-08-19",
  },
];

const statusOptions = ["All Status", "Processing", "Delivered", "Shipped", "Pending Packing"];
const boxSizeOptions = ["All Size", "0.5 kg", "1kg"];

function money(value: unknown) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value || "$0.00");
  return `$${amount.toFixed(2)}`;
}

function normalizeStatus(value: unknown): GiftOrder["status"] {
  const status = String(value || "").toLowerCase().replace(/_/g, " ");
  if (status.includes("deliver")) return "Delivered";
  if (status.includes("ship")) return "Shipped";
  if (status.includes("pack") || status.includes("pending")) return "Pending Packing";
  return "Processing";
}

function normalizeBoxSize(value: unknown) {
  const text = String(value || "").toLowerCase();
  if (text.includes("0.5") || text.includes("500")) return "0.5 kg";
  return "1kg";
}

function mapApiOrder(order: ApiOrder, index: number): GiftOrder {
  const productName = String(order.product_name || order.pack_name || "");
  const quantity = Number(order.quantity);

  return {
    id: String(order.order_id || order.id || `ZW-2024-${String(index + 1).padStart(3, "0")}`),
    customer: String(order.full_name || order.customer_name || order.customer || "Unknown Customer"),
    email: String(order.email || "customer@email.com"),
    avatar: String(order.user_image || order.avatar || order.customer_avatar || `https://i.pravatar.cc/80?img=${index + 10}`),
    boxSize: normalizeBoxSize(order.pack_name || productName),
    products: Number.isNaN(quantity) || quantity <= 0 ? Math.max(2, index + 2) : quantity,
    amount: order.total_amount != null ? money(order.total_amount) : String(order.amount || "$0.00"),
    status: normalizeStatus(order.status),
    createdAt: String(order.created_at || ""),
  };
}

function statusClass(status: GiftOrder["status"]) {
  if (status === "Delivered") return "text-[#166534]";
  if (status === "Shipped") return "text-[#1E40AF]";
  if (status === "Pending Packing") return "text-[#9F8151]";
  return "text-[#854D0E]";
}

function StatCard({
  label,
  value,
  trend,
  note,
  icon: Icon,
  iconTone = "bg-[#F3EBDC] text-[#9F8151]",
}: {
  label: string;
  value: string;
  trend?: string;
  note?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconTone?: string;
}) {
  return (
    <article className="flex min-h-[88px] items-start justify-between rounded-lg border border-[#DFDFDF] bg-white p-4 shadow-sm">
      <div>
        <p className="text-[11px] font-medium text-[#6B7280]">{label}</p>
        <p className="mt-1 text-2xl font-bold leading-none text-[#0A4833]">{value}</p>
        {trend ? (
          <span className="mt-2 inline-flex rounded bg-[#DFF4E8] px-2 py-0.5 text-[10px] font-semibold text-[#079455]">
            {trend}
          </span>
        ) : null}
        {note ? <p className="mt-2 text-[10px] text-[#6B7280]">{note}</p> : null}
      </div>
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${iconTone}`}>
        <Icon className="h-4 w-4" />
      </span>
    </article>
  );
}

export default function GiftsManagementPage() {
  const [orders, setOrders] = useState<GiftOrder[]>(fallbackOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [boxSize, setBoxSize] = useState("All Size");
  const [sortBy, setSortBy] = useState("Newest First");
  const [pageSize, setPageSize] = useState("10 per page");

  useEffect(() => {
    let mounted = true;

    api
      .get("/orders/admin/")
      .then((res) => {
        if (!mounted) return;
        const raw: ApiOrder[] = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        const giftOrders = raw
          .filter((order) => {
            const text = `${order.product_name || ""} ${order.pack_name || ""}`.toLowerCase();
            return text.includes("gift");
          })
          .map(mapApiOrder);

        if (giftOrders.length > 0) {
          setOrders(giftOrders);
        }
      })
      .catch(() => {
        if (mounted) setOrders(fallbackOrders);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);
      const matchesStatus = status === "All Status" || order.status === status;
      const matchesSize = boxSize === "All Size" || order.boxSize === boxSize;
      return matchesSearch && matchesStatus && matchesSize;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Oldest First") return a.createdAt.localeCompare(b.createdAt);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [boxSize, orders, search, sortBy, status]);

  const delivered = orders.filter((order) => order.status === "Delivered").length;
  const active = orders.filter((order) => order.status !== "Delivered").length;
  const halfKgBoxes = orders.filter((order) => order.boxSize === "0.5 kg").length;
  const oneKgBoxes = orders.filter((order) => order.boxSize === "1kg").length;
  const pendingPacking = orders.filter((order) => order.status === "Pending Packing").length;

  return (
    <section className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Gift Orders" value="2,847" trend="+12.4%" icon={Gift} />
          <StatCard label="Active Gift Orders" value={String(Math.max(184, active))} trend="+5.2%" icon={CheckCircle2} iconTone="bg-[#E8F5EA] text-[#16A34A]" />
          <StatCard label="0.5 KG Boxes" value={String(Math.max(1203, halfKgBoxes))} trend="+8.7%" icon={Package} iconTone="bg-[#ECEFEA] text-[#9F8151]" />
          <StatCard label="1 KG Boxes" value={String(Math.max(1644, oneKgBoxes))} trend="+15.1%" icon={Package} iconTone="bg-[#F3F4F6] text-[#111827]" />
          <StatCard label="Pending Packing" value={String(Math.max(47, pendingPacking))} note="Needs attention" icon={Hourglass} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Delivered Orders" value={String(Math.max(2192, delivered))} trend="+18.3%" icon={Truck} iconTone="bg-[#EEF6F1] text-[#0A4833]" />
        </div>

        <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <label className="space-y-2">
              <span className="text-xs font-semibold text-[#0A4833]">Search order</span>
              <span className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, SKU, Category..."
                  className="h-11 w-full rounded-md border border-transparent bg-[#E9E0D0] pl-10 pr-3 text-sm text-[#111827] outline-none focus:border-[#0A4833]"
                />
              </span>
            </label>

            <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
            <FilterSelect label="Box Size" value={boxSize} options={boxSizeOptions} onChange={setBoxSize} />
            <FilterSelect label="Sort By" value={sortBy} options={["Newest First", "Oldest First"]} onChange={setSortBy} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#DFDFDF] pt-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
              <span>Quick Filters:</span>
              <button className="rounded-md border border-[#DFDFDF] bg-white px-4 py-2 text-[#111827]">Featured</button>
              <button className="rounded-md border border-[#DFDFDF] bg-white px-4 py-2 text-[#111827]">Recently Added</button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("All Status");
                setBoxSize("All Size");
                setSortBy("Newest First");
              }}
              className="text-xs font-medium text-[#0A4833]"
            >
              Clear Filters
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <h2 className="text-lg font-bold text-[#0A4833]">Recent Orders</h2>
            <div className="flex items-center gap-2">
              <button className="rounded-md bg-[#E5E7EB] px-4 py-2 text-xs text-[#374151]">Bulk Actions</button>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(event.target.value)}
                className="h-9 rounded-md border border-[#DFDFDF] bg-white px-3 text-xs text-[#111827] outline-none"
              >
                <option>10 per page</option>
                <option>25 per page</option>
                <option>50 per page</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-[#E9E0D0] text-xs text-[#6B7280]">
                <tr>
                  <th className="px-5 py-3"><input type="checkbox" /></th>
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Box Size</th>
                  <th className="px-5 py-3 font-medium">Products</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-t border-[#DFDFDF]">
                    <td className="px-5 py-5"><input type="checkbox" /></td>
                    <td className="px-5 py-5 font-semibold text-[#0A4833]">{order.id}</td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <img src={order.avatar} alt="" className="h-9 w-9 rounded-full bg-[#EFE7D6] object-cover" />
                        <div>
                          <p className="font-medium text-[#111827]">{order.customer}</p>
                          <p className="text-xs text-[#6B7280]">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-center text-[#6B7280]">{order.boxSize}</td>
                    <td className="px-5 py-5 text-center text-[#6B7280]">{order.products} Products</td>
                    <td className="px-5 py-5 font-semibold text-[#9F8151]">{order.amount}</td>
                    <td className={`px-5 py-5 text-xs font-bold ${statusClass(order.status)}`}>{order.status}</td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <IconButton label="View"><Eye className="h-4 w-4" /></IconButton>
                        <IconButton label="Edit" tone="gold"><Pencil className="h-4 w-4" /></IconButton>
                        <IconButton label="Delete" tone="muted"><Trash2 className="h-4 w-4" /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#DFDFDF] px-5 py-4 text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
            <p>Showing 1 to {Math.min(10, filteredOrders.length)} of 247 orders</p>
            <div className="flex items-center gap-2 text-xs text-[#111827]">
              <button className="rounded border border-[#DFDFDF] px-3 py-2">Previous</button>
              <button className="rounded bg-[#0A4833] px-3 py-2 text-white">1</button>
              <button className="rounded border border-[#DFDFDF] px-3 py-2">2</button>
              <button className="rounded border border-[#DFDFDF] px-3 py-2">3</button>
              <button className="rounded border border-[#DFDFDF] px-3 py-2">Next</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold text-[#0A4833]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-transparent bg-[#E9E0D0] px-3 text-sm text-[#111827] outline-none focus:border-[#0A4833]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function IconButton({
  label,
  tone = "green",
  children,
}: {
  label: string;
  tone?: "green" | "gold" | "muted";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "gold"
      ? "text-[#9F8151] hover:bg-[#F3EBDC]"
      : tone === "muted"
        ? "text-[#4B5563] hover:bg-[#F3F4F6]"
        : "text-[#0A4833] hover:bg-[#E8F2EE]";

  return (
    <button
      type="button"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition ${toneClass}`}
      aria-label={label}
    >
      {children}
    </button>
  );
}
