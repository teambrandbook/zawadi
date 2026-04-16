"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  CircleX,
  Clock3,
  Download,
  Eye,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { myorders } from "../../../../lib/datafile"
type StatCardItem = {
  label: string;
  value: string;
  tag: string;
  valueClass: string;
  Icon: LucideIcon;
};

type ActionItem = {
  label: string;
  variant: "primary" | "secondary";
  Icon: LucideIcon;
};

type OrderLifecycleStatus =
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type TabFilter = "All Orders" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type OrderItem = {
  id: string;
  title: string;
  orderId: string;
  image: string;
  orderDate: string;
  quantity: string;
  totalAmount: string;
  dateLabel: string;
  dateValue: string;
  lifecycleStatus: OrderLifecycleStatus;
};

const orderLifecycleStatuses: OrderLifecycleStatus[] = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function isOrderLifecycleStatus(value: string): value is OrderLifecycleStatus {
  return orderLifecycleStatuses.includes(value as OrderLifecycleStatus);
}

const normalizedOrders: OrderItem[] = myorders.map((order) => ({
  ...order,
  lifecycleStatus: isOrderLifecycleStatus(order.lifecycleStatus) ? order.lifecycleStatus : "Confirmed",
}));

const ITEMS_PER_PAGE = 4;
const tabs: TabFilter[] = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];
const progressStages: Exclude<OrderLifecycleStatus, "Cancelled">[] = [
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const stats: StatCardItem[] = [
  {
    label: "Total Orders",
    value: "24",
    tag: "All Time",
    valueClass: "text-[#0A4833]",
    Icon: ShoppingBag,
  },
  {
    label: "Active Orders",
    value: "3",
    tag: "In Progress",
    valueClass: "text-[#9F8151]",
    Icon: Clock3,
  },
  {
    label: "Delivered Orders",
    value: "19",
    tag: "Completed",
    valueClass: "text-[#0A4833]",
    Icon: CheckCircle2,
  },
  {
    label: "Cancelled Orders",
    value: "2",
    tag: "Cancelled",
    valueClass: "text-[#9CA3AF]",
    Icon: CircleX,
  },
];



function getBadgeData(status: OrderLifecycleStatus) {
  if (status === "Out for Delivery") {
    return {
      bg: "bg-[#DCFCE7]",
      text: "text-[#047857]",
      Icon: Truck,
      label: status,
    };
  }

  if (status === "Delivered") {
    return {
      bg: "bg-[#D1FAE5]",
      text: "text-[#047857]",
      Icon: CheckCircle2,
      label: status,
    };
  }

  if (status === "Cancelled") {
    return {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      Icon: CircleX,
      label: status,
    };
  }

  if (status === "Shipped") {
    return {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      Icon: Truck,
      label: status,
    };
  }

  return {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    Icon: Clock3,
    label: status,
  };
}

function getActions(status: OrderLifecycleStatus): ActionItem[] {
  if (status === "Delivered") {
    return [
      { label: "Reorder", variant: "primary", Icon: ShoppingCart },
      { label: "Write Review", variant: "secondary", Icon: Star },
      { label: "Invoice", variant: "secondary", Icon: Download },
    ];
  }

  if (status === "Cancelled") {
    return [
      { label: "Reorder", variant: "primary", Icon: ShoppingCart },
      { label: "Invoice", variant: "secondary", Icon: Download },
    ];
  }

  return [
    { label: "Track Order", variant: "primary", Icon: Truck },
    { label: "View Details", variant: "secondary", Icon: Eye },
    { label: "Invoice", variant: "secondary", Icon: Download },
  ];
}

function getStatusPercent(status: OrderLifecycleStatus) {
  if (status === "Cancelled") return "Cancelled";

  const current = progressStages.indexOf(status);
  const percent = Math.round(((current + 1) / progressStages.length) * 100);
  return `${percent}% Complete`;
}

function shouldShowTrack(status: OrderLifecycleStatus) {
  return status === "Confirmed" || status === "Packed" || status === "Shipped" || status === "Out for Delivery";
}

function matchesTab(order: OrderItem, activeTab: TabFilter) {
  if (activeTab === "All Orders") return true;
  if (activeTab === "Cancelled") return order.lifecycleStatus === "Cancelled";
  if (activeTab === "Delivered") return order.lifecycleStatus === "Delivered";
  if (activeTab === "Shipped") {
    return order.lifecycleStatus === "Shipped" || order.lifecycleStatus === "Out for Delivery";
  }

  return order.lifecycleStatus === "Confirmed" || order.lifecycleStatus === "Packed";
}

export default function MyOrder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [activeActionByOrder, setActiveActionByOrder] = useState<Record<string, string>>({});

  const filteredOrders = useMemo(() => {
    return normalizedOrders.filter((order) => {
      const tabMatch = matchesTab(order, activeTab);
      const searchMatch =
        searchTerm.trim().length === 0 ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.title.toLowerCase().includes(searchTerm.toLowerCase());

      return tabMatch && searchMatch;
    });
  }, [activeTab, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredOrders]);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  function onTabClick(tab: TabFilter) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function onTrackClick(orderDataId: string) {
    setTrackedOrderId((prev) => (prev === orderDataId ? null : orderDataId));
    setActiveActionByOrder((prev) => ({ ...prev, [orderDataId]: "Track Order" }));
  }

  function onActionClick(orderDataId: string, actionLabel: string) {
    if (actionLabel === "Write Review") {
      const encodedOrderDataId = encodeURIComponent(orderDataId);
      router.push(`/communityDashBorde/myorders/review/${encodedOrderDataId}`);
      return;
    }
    if (actionLabel === "View Details") {
      router.push("/communityDashBorde/myorders/order-buckwheat");
      return;
    }
    setActiveActionByOrder((prev) => ({ ...prev, [orderDataId]: actionLabel }));
  }

  function onPrevPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function onNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }

  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0A4833]">My Orders</h1>
            <p className="mt-1 text-base text-[#9F8151]">
              Track your buckwheat purchases, delivery updates, and order history.
            </p>
          </div>
          <button
            onClick={() => router.push("/communityDashBorde/myorders/order-buckwheat")}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0A4833] px-6 text-sm font-medium text-white shadow-[0px_2px_4px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] hover:bg-[#083B2A]"
          >
            <ShoppingCart className="h-4 w-4" />
            Order Buckwheat
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, tag, valueClass, Icon }) => (
            <article
              key={label}
              className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EBE1CF] text-[#0A4833]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-[#9F8151]">{tag}</span>
              </div>
              <p className={`text-[30px] font-bold leading-none ${valueClass}`}>{value}</p>
              <p className="mt-3 text-sm text-[#9F8151]">{label}</p>
            </article>
          ))}
        </div>

        <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabClick(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-[#0A4833] text-white"
                      : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E3D7C2]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search order ID..."
                className="h-10 rounded-lg border border-[#DFDFDF] bg-[#EBE1CF] px-3 text-sm text-[#0A4833] placeholder:text-[#9F8151] focus:border-[#0A4833] focus:outline-none"
              />
              <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DFDFDF] bg-[#EBE1CF] px-4 text-sm font-medium text-[#0A4833] hover:bg-[#E3D7C2]">
                <CalendarDays className="h-4 w-4" />
                Filter by Date
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const badge = getBadgeData(order.lifecycleStatus);
            const actions = getActions(order.lifecycleStatus);
            const isTrackingThisOrder = trackedOrderId === order.id;
            const showTrackingSection = isTrackingThisOrder && shouldShowTrack(order.lifecycleStatus);
            const currentStatusIndex =
              order.lifecycleStatus === "Cancelled" ? -1 : progressStages.indexOf(order.lifecycleStatus);

            return (
              <article
                key={order.orderId}
                className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-[#EBE1CF]">
                      <Image src={order.image} alt={order.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold leading-tight text-[#0A4833]">{order.title}</h3>
                          <p className="text-sm text-[#9F8151]">Order ID: {order.orderId}</p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}
                        >
                          <badge.Icon className="h-3 w-3" />
                          {badge.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                        <div>
                          <p className="text-xs text-[#9F8151]">Order Date</p>
                          <p className="font-medium text-[#0A4833]">{order.orderDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9F8151]">Quantity</p>
                          <p className="font-medium text-[#0A4833]">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9F8151]">Total Amount</p>
                          <p className="font-medium text-[#0A4833]">{order.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9F8151]">{order.dateLabel}</p>
                          <p className="font-medium text-[#0A4833]">{order.dateValue}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {actions.map((action) => {
                          const isActive = activeActionByOrder[order.id] === action.label;

                          return (
                            <button
                              key={action.label}
                              onClick={() => {
                                if (action.label === "Track Order") {
                                  onTrackClick(order.id);
                                  return;
                                }
                                onActionClick(order.id, action.label);
                              }}
                              className={`inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-medium transition-colors ${
                                isActive
                                  ? "bg-[#0A4833] text-white"
                                  : action.variant === "primary"
                                    ? "bg-[#0A4833] text-white hover:bg-[#083B2A]"
                                    : "bg-[#EBE1CF] text-[#0A4833] hover:bg-[#E3D7C2]"
                              }`}
                            >
                              <action.Icon className="h-3.5 w-3.5" />
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {showTrackingSection && (
                  <div className="bg-[#EBE1CF] px-4 py-4 lg:px-6">
                    <div className="mb-3 flex items-center justify-between text-xs text-[#9F8151]">
                      <span>Delivery Progress</span>
                      <span className="font-medium text-[#0A4833]">{getStatusPercent(order.lifecycleStatus)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-5">
                      {progressStages.map((stage, index) => {
                        const done = index <= currentStatusIndex;
                        const active = index === currentStatusIndex;
                        const StageIcon = stage === "Out for Delivery" ? Truck : Check;

                        return (
                          <div key={stage} className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                  active
                                    ? "bg-[#9F8151] text-white"
                                    : done
                                      ? "bg-[#0A4833] text-white"
                                      : "bg-white text-[#9CA3AF]"
                                }`}
                              >
                                <StageIcon className="h-3.5 w-3.5" />
                              </span>
                              <span className="mt-2 whitespace-nowrap text-[11px] text-[#0A4833]">{stage}</span>
                            </div>

                            {index < progressStages.length - 1 && (
                              <span
                                className={`mt-[-14px] hidden h-[3px] w-full rounded-full sm:block ${
                                  done ? "bg-[#0A4833]" : "bg-white"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {paginatedOrders.length === 0 && (
            <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#9F8151]">
              No orders found for this filter.
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-[#0A4833] disabled:cursor-not-allowed disabled:opacity-50"
          >
            &lt;
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-10 w-10 rounded-lg border text-sm font-medium ${
                currentPage === page
                  ? "border-[#0A4833] bg-[#0A4833] text-white"
                  : "border-[#DFDFDF] bg-white text-[#0A4833]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-[#0A4833] disabled:cursor-not-allowed disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
