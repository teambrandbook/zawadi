"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
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
  X,
} from "lucide-react";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import OrderStatusModal from "@/components/admindashboard/components/order-management/components/OrderStatusModal";
import type { RootState } from "@/redux/store";
import { useInternalStaffPermissions } from "@/components/admindashboard/shared/InternalStaffPermissionsBootstrap";

type GiftProduct = {
  id?: number | string;
  name?: string;
  size?: string;
  price?: number | string;
  quantity?: number | string;
};

type GiftOrder = {
  id: string;
  customer: string;
  email: string;
  avatar: string;
  boxSize: string;
  products: number;
  amount: string;
  status: "Pending" | "Confirmed" | "Processing" | "Delivered" | "Shipped" | "Pending Packing" | "Out for Delivery" | "Cancelled";
  rawStatus: string;
  createdAt: string;
  giftType: string;
  boxName: string;
  boxCapacity: string;
  items: GiftProduct[];
  message: string;
  occasion: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  subtotal: string;
  deliveryCharge: string;
  taxAmount: string;
  paymentMethod: string;
  paymentStatus: string;
};

type ApiCustomGiftOrder = {
  id?: number | string;
  custom_gift_id?: string;
  full_name: string;
  email?: string;
  user_image?: string;
  box_name?: string;
  box_capacity?: string;
  items?: GiftProduct[];
  gift_type?: string;
  message?: string;
  occasion?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  subtotal?: number | string;
  delivery_charge?: number | string;
  tax_amount?: number | string;
  total_amount?: number | string;
  payment_method?: string;
  payment_status?: string;
  status?: string;
  created_at?: string;
};

const statusOptions = ["All Status", "Pending", "Pending Packing", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
const boxSizeOptions = ["All Size", "0.5 kg", "1kg"];

function money(value: unknown) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value || "$0.00");
  return `$${amount.toFixed(2)}`;
}

function normalizeStatus(value: unknown): GiftOrder["status"] {
  const status = String(value || "").toLowerCase().replace(/_/g, " ");
  if (status.includes("out for delivery")) return "Out for Delivery";
  if (status.includes("deliver")) return "Delivered";
  if (status.includes("ship")) return "Shipped";
  if (status.includes("cancel")) return "Cancelled";
  if (status.includes("pack")) return "Pending Packing";
  if (status.includes("pending")) return "Pending";
  if (status.includes("confirm")) return "Confirmed";
  return "Processing";
}

function normalizeBoxSize(value: unknown) {
  const text = String(value || "").toLowerCase();
  if (text.includes("0.5") || text.includes("500")) return "0.5 kg";
  return "1kg";
}

function mapApiOrder(order: ApiCustomGiftOrder, index: number): GiftOrder {
  const products = (order.items ?? []).reduce((total, item) => total + (Number(item.quantity) || 0), 0);

  return {
    id: String(order.custom_gift_id || order.id || `CG-${String(index + 1).padStart(3, "0")}`),
    customer: String(order.full_name || "Unknown Customer"),
    email: String(order.email || "-"),
    avatar: order.user_image ? getImageUrl(order.user_image) : "/default-avatar.svg",
    boxSize: normalizeBoxSize(order.box_name),
    products,
    amount: money(order.total_amount),
    status: normalizeStatus(order.status),
    rawStatus: String(order.status || "confirmed"),
    createdAt: String(order.created_at || ""),
    giftType: String(order.gift_type || "-"),
    boxName: String(order.box_name || "-"),
    boxCapacity: String(order.box_capacity || "-"),
    items: order.items ?? [],
    message: String(order.message || "-"),
    occasion: String(order.occasion || "-"),
    phone: String(order.phone || "-"),
    address: String(order.address || "-"),
    city: String(order.city || "-"),
    postalCode: String(order.postal_code || "-"),
    subtotal: money(order.subtotal),
    deliveryCharge: money(order.delivery_charge),
    taxAmount: money(order.tax_amount),
    paymentMethod: String(order.payment_method || "-").replace(/_/g, " "),
    paymentStatus: String(order.payment_status || "-").replace(/_/g, " "),
  };
}

function statusClass(status: GiftOrder["status"]) {
  if (status === "Pending") return "text-[#DC2626]";
  if (status === "Delivered") return "text-[#166534]";
  if (status === "Shipped") return "text-[#1E40AF]";
  if (status === "Out for Delivery") return "text-[#1E40AF]";
  if (status === "Cancelled") return "text-[#B91C1C]";
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
  const role = useSelector((state: RootState) => state.user.role);
  const permissions = useInternalStaffPermissions();
  const [orders, setOrders] = useState<GiftOrder[]>([]);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [boxSize, setBoxSize] = useState("All Size");
  const [sortBy, setSortBy] = useState("Newest First");
  const [pageSize, setPageSize] = useState("10 per page");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGift, setSelectedGift] = useState<GiftOrder | null>(null);
  const [giftToDelete, setGiftToDelete] = useState<GiftOrder | null>(null);
  const [giftToUpdate, setGiftToUpdate] = useState<GiftOrder | null>(null);
  const [deleting, setDeleting] = useState(false);
  const giftPermission = permissions.find(({ module }) => module === "gifts");
  const canEditGifts = role !== "internal_staff" || Boolean(giftPermission?.full_access || giftPermission?.can_edit);
  const canDeleteGifts = role !== "internal_staff" || Boolean(giftPermission?.full_access || giftPermission?.can_delete);

  useEffect(() => {
    let mounted = true;

    api
      .get("/orders/admin/custom-gifts/")
      .then((res) => {
        if (!mounted) return;
        const raw: ApiCustomGiftOrder[] = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        setOrders(raw.map(mapApiOrder));
      })
      .catch(() => {
        if (mounted) setLoadError("Failed to load gift orders.");
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
  const pageLimit = Number.parseInt(pageSize, 10) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageLimit));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * pageLimit;
  const paginatedOrders = filteredOrders.slice(pageStart, pageStart + pageLimit);

  async function deleteGiftOrder() {
    if (!giftToDelete) return;

    setDeleting(true);
    setLoadError("");
    try {
      await api.delete(`/orders/admin/custom-gifts/${encodeURIComponent(giftToDelete.id)}/`);
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== giftToDelete.id));
      setGiftToDelete(null);
    } catch {
      setLoadError("Failed to delete gift order.");
    } finally {
      setDeleting(false);
    }
  }

  async function saveStatus(nextStatus: string) {
    if (!giftToUpdate) return;

    try {
      await api.patch(`/orders/admin/custom-gifts/${encodeURIComponent(giftToUpdate.id)}/`, {
        status: nextStatus,
      });
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === giftToUpdate.id
            ? { ...order, rawStatus: nextStatus, status: normalizeStatus(nextStatus) }
            : order
        )
      );
      toast.success("Gift order status updated");
    } catch {
      toast.error("Failed to update gift order status. Please try again.");
    } finally {
      setGiftToUpdate(null);
    }
  }

  return (
    <>
    <section className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Gift Orders" value={String(orders.length)} icon={Gift} />
          <StatCard label="Active Gift Orders" value={String(active)} icon={CheckCircle2} iconTone="bg-[#E8F5EA] text-[#16A34A]" />
          <StatCard label="0.5 KG Boxes" value={String(halfKgBoxes)} icon={Package} iconTone="bg-[#ECEFEA] text-[#9F8151]" />
          <StatCard label="1 KG Boxes" value={String(oneKgBoxes)} icon={Package} iconTone="bg-[#F3F4F6] text-[#111827]" />
          <StatCard label="Pending Packing" value={String(pendingPacking)} note="Needs attention" icon={Hourglass} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Delivered Orders" value={String(delivered)} icon={Truck} iconTone="bg-[#EEF6F1] text-[#0A4833]" />
        </div>

        {loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>
        ) : null}

        <section className="rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <label className="space-y-2">
              <span className="text-xs font-semibold text-[#0A4833]">Search order</span>
              <span className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Name, SKU, Category..."
                  className="h-11 w-full rounded-md border border-transparent bg-[#E9E0D0] pl-10 pr-3 text-sm text-[#111827] outline-none focus:border-[#0A4833]"
                />
              </span>
            </label>

            <FilterSelect label="Status" value={status} options={statusOptions} onChange={(value) => { setStatus(value); setCurrentPage(1); }} />
            <FilterSelect label="Box Size" value={boxSize} options={boxSizeOptions} onChange={(value) => { setBoxSize(value); setCurrentPage(1); }} />
            <FilterSelect label="Sort By" value={sortBy} options={["Newest First", "Oldest First"]} onChange={(value) => { setSortBy(value); setCurrentPage(1); }} />
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
                setCurrentPage(1);
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
              {canEditGifts && (
                <button className="rounded-md bg-[#E5E7EB] px-4 py-2 text-xs text-[#374151]">Bulk Actions</button>
              )}
              <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(event.target.value);
                    setCurrentPage(1);
                  }}
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
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[#DFDFDF]">
                    <td className="px-5 py-5"><input type="checkbox" /></td>
                    <td className="px-5 py-5 font-semibold text-[#0A4833]">{order.id}</td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.avatar}
                          alt={order.customer}
                          onError={(event) => {
                            event.currentTarget.src = "/default-avatar.svg";
                          }}
                          className="h-9 w-9 rounded-full bg-[#EFE7D6] object-cover"
                        />
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
                        <IconButton label="View" onClick={() => setSelectedGift(order)}><Eye className="h-4 w-4" /></IconButton>
                        {canEditGifts && (
                          <IconButton label="Edit" tone="gold" onClick={() => setGiftToUpdate(order)}><Pencil className="h-4 w-4" /></IconButton>
                        )}
                        {canDeleteGifts && (
                          <IconButton label="Delete" tone="muted" onClick={() => setGiftToDelete(order)}><Trash2 className="h-4 w-4" /></IconButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#DFDFDF] px-5 py-4 text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {filteredOrders.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + pageLimit, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-2 text-xs text-[#111827]">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded border border-[#DFDFDF] px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded px-3 py-2 ${safeCurrentPage === page ? "bg-[#0A4833] text-white" : "border border-[#DFDFDF]"}`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="rounded border border-[#DFDFDF] px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
    {selectedGift ? <GiftDetailsModal gift={selectedGift} onClose={() => setSelectedGift(null)} /> : null}
    {giftToDelete ? (
      <DeleteGiftModal
        deleting={deleting}
        onCancel={() => setGiftToDelete(null)}
        onDelete={deleteGiftOrder}
      />
    ) : null}
    <OrderStatusModal
      open={Boolean(giftToUpdate)}
      currentStatus={giftToUpdate?.rawStatus ?? ""}
      onClose={() => setGiftToUpdate(null)}
      onSave={saveStatus}
    />
    </>
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

function GiftDetailsModal({ gift, onClose }: { gift: GiftOrder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <section className="max-h-full w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-[#DFDFDF] px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#9F8151]">Custom Gift Order</p>
            <h2 className="mt-1 text-xl font-bold text-[#0A4833]">{gift.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gift details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#4B5563] hover:bg-[#F3F4F6]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 px-6 py-5 text-sm">
          <div className="flex items-center gap-3">
            <img
              src={gift.avatar}
              alt={gift.customer}
              onError={(event) => {
                event.currentTarget.src = "/default-avatar.svg";
              }}
              className="h-12 w-12 rounded-full bg-[#EFE7D6] object-cover"
            />
            <div>
              <p className="font-semibold text-[#111827]">{gift.customer}</p>
              <p className="text-[#6B7280]">{gift.email}</p>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-4 border-y border-[#DFDFDF] py-4 sm:grid-cols-3">
            <Detail label="Gift Type" value={gift.giftType} />
            <Detail label="Box" value={gift.boxName} />
            <Detail label="Capacity" value={gift.boxCapacity} />
            <Detail label="Occasion" value={gift.occasion} />
            <Detail label="Phone" value={gift.phone} />
            <Detail label="Payment" value={`${gift.paymentMethod} - ${gift.paymentStatus}`} />
          </div>

          <div>
            <h3 className="font-bold text-[#0A4833]">Products in Gift Box</h3>
            <div className="mt-3 divide-y divide-[#DFDFDF] border-y border-[#DFDFDF]">
              {gift.items.map((item, index) => (
                <div key={`${item.id || item.name}-${index}`} className="grid grid-cols-[1fr_auto] gap-4 py-3">
                  <div>
                    <p className="font-medium text-[#111827]">{item.name || "Gift product"}</p>
                    <p className="text-xs text-[#6B7280]">{item.size || "Standard size"}</p>
                  </div>
                  <p className="text-right text-[#4B5563]">
                    {Number(item.quantity) || 0} x {money(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <Detail label="Delivery Address" value={`${gift.address}, ${gift.city} ${gift.postalCode}`} />
            <Detail label="Message" value={gift.message} />
          </div>

          <div className="ml-auto grid max-w-xs grid-cols-[1fr_auto] gap-x-8 gap-y-2 border-t border-[#DFDFDF] pt-4">
            <span className="text-[#6B7280]">Subtotal</span><strong>{gift.subtotal}</strong>
            <span className="text-[#6B7280]">Delivery</span><strong>{gift.deliveryCharge}</strong>
            <span className="text-[#6B7280]">Tax</span><strong>{gift.taxAmount}</strong>
            <span className="font-bold text-[#0A4833]">Total</span><strong className="text-[#0A4833]">{gift.amount}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="mt-1 font-medium capitalize text-[#111827]">{value}</p>
    </div>
  );
}

function DeleteGiftModal({
  deleting,
  onCancel,
  onDelete,
}: {
  deleting: boolean;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <section className="w-full max-w-[480px] rounded-2xl bg-white px-7 py-7 shadow-xl">
        <p className="text-lg leading-7 text-[#475569]">
          Are you sure you want to delete this gift order? This cannot be undone.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="rounded-md border border-[#CBD5E1] px-5 py-3 text-[#475569] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="rounded-md bg-[#DC2626] px-5 py-3 font-semibold text-white hover:bg-[#B91C1C] disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}

function IconButton({
  label,
  tone = "green",
  onClick,
  children,
}: {
  label: string;
  tone?: "green" | "gold" | "muted";
  onClick?: () => void;
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
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition ${toneClass}`}
      aria-label={label}
    >
      {children}
    </button>
  );
}
