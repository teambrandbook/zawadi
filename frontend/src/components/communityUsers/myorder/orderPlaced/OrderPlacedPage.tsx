import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Download,
  Heart,
  Headset,
  RefreshCcw,
  Truck,
  type LucideIcon,
  WalletCards,
} from "lucide-react";

type SummaryItem = {
  label: string;
  value: string;
  valueClass?: string;
};

type TimelineItem = {
  title: string;
  description: string;
  date: string;
  status: "completed" | "current" | "upcoming";
  icon: "check" | "truck" | "home";
};

type SupportItem = {
  label: string;
  icon: "support" | "issue" | "invoice" | "reorder";
  href?: string;
};

type OrderPlacedData = {
  heading: string;
  subheading: string;
  orderId: string;
  summary: {
    image: string;
    name: string;
    subtitle: string;
    quantity: string;
    orderDate: string;
    payment: string;
    expected: string;
  };
  address: {
    name: string;
    phone: string;
    lines: string[];
    note: string;
  };
  details: SummaryItem[];
  paymentMethod: string;
  timeline: TimelineItem[];
  liveStatus: {
    title: string;
    description: string;
    courier: string;
    trackingId: string;
    lastUpdate: string;
    expectedWindow: string;
  };
  support: SupportItem[];
  promo: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

type Props = {
  order: OrderPlacedData;
};

const timelineIcons: Record<TimelineItem["icon"], LucideIcon> = {
  check: Check,
  truck: Truck,
  home: WalletCards,
};

const supportIcons: Record<SupportItem["icon"], LucideIcon> = {
  support: Headset,
  issue: AlertTriangle,
  invoice: Download,
  reorder: RefreshCcw,
};

const cardClass = "rounded-xl border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

export default function OrderPlacedPage({ order }: Props) {
  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <header className="space-y-1">
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-[#0A4833]">{order.heading}</h1>
          <p className="text-sm text-[#4B5563]">{order.subheading}</p>
          <p className="text-xs text-[#6B7280]">Order {order.orderId}</p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#0A4833]">Order Summary</h2>
              <div className="mt-4 flex flex-col gap-4 lg:flex-row">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EBE1CF]">
                    <Image src={order.summary.image} alt={order.summary.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-medium text-[#0A4833]">{order.summary.name}</h3>
                    <p className="text-sm text-[#4B5563]">{order.summary.subtitle}</p>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Quantity:</span>
                    <span className="font-medium text-[#111827]">{order.summary.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Order Date:</span>
                    <span className="font-medium text-[#111827]">{order.summary.orderDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Payment:</span>
                    <span className="font-medium text-[#16A34A]">{order.summary.payment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Expected:</span>
                    <span className="font-medium text-[#111827]">{order.summary.expected}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#0A4833]">Delivery Progress</h2>
              <div className="mt-5 space-y-5">
                {order.timeline.map((item, index) => {
                  const Icon = timelineIcons[item.icon];
                  const isCompleted = item.status === "completed";
                  const isCurrent = item.status === "current";

                  return (
                    <div key={item.title} className="relative flex gap-4 pl-1">
                      {index < order.timeline.length - 1 && (
                        <span className="absolute left-[23px] top-12 h-[calc(100%+8px)] w-px bg-[#DFDFDF]" />
                      )}
                      <span
                        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                          isCompleted
                            ? "bg-[#0A5A3F] text-white"
                            : isCurrent
                              ? "bg-[#A98751] text-white"
                              : "bg-[#E5E7EB] text-[#9CA3AF]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="space-y-0.5 pt-1">
                        <h3 className={`text-base font-medium ${item.status === "upcoming" ? "text-[#9CA3AF]" : "text-[#0A4833]"}`}>
                          {item.title}
                        </h3>
                        <p className={`text-sm ${item.status === "upcoming" ? "text-[#C0C7D2]" : "text-[#4B5563]"}`}>
                          {item.description}
                        </p>
                        <p className={`text-xs ${item.status === "upcoming" ? "text-[#D1D5DB]" : "text-[#6B7280]"}`}>{item.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#0A4833]">Live Delivery Status</h2>
              <div className="mt-4 rounded-lg bg-[#EBE1CF] p-4">
                <div className="flex items-center gap-2 text-[#0A4833]">
                  <span className="h-3 w-3 rounded-full bg-[#9F8151]" />
                  <h3 className="text-base font-medium">{order.liveStatus.title}</h3>
                </div>
                <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#4B5563]">{order.liveStatus.description}</p>
                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Courier:</span>
                    <span className="font-medium text-[#111827]">{order.liveStatus.courier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Tracking ID:</span>
                    <span className="font-medium text-[#111827]">{order.liveStatus.trackingId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Last Update:</span>
                    <span className="font-medium text-[#111827]">{order.liveStatus.lastUpdate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280]">Expected Window:</span>
                    <span className="font-medium text-[#111827]">{order.liveStatus.expectedWindow}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#0A4833]">Delivery Address</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-[#111827]">{order.address.name}</p>
                  <p className="text-[#4B5563]">{order.address.phone}</p>
                </div>
                <div className="space-y-1 text-[#4B5563]">
                  {order.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className="border-t border-[#DFDFDF] pt-3 text-xs text-[#6B7280]">{order.address.note}</div>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#0A4833]">Order Details</h2>
              <div className="mt-4 space-y-3 text-sm">
                {order.details.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4">
                    <span className="text-[#4B5563]">{item.label}</span>
                    <span className={`font-medium ${item.valueClass ?? "text-[#111827]"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-[#DFDFDF] pt-4 text-xs text-[#6B7280]">
                Payment Method: <span className="font-medium text-[#4B5563]">{order.paymentMethod}</span>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-semibold text-[#0A4833]">Need Help?</h2>
              <div className="mt-4 space-y-2.5">
                {order.support.map((item) => {
                  const Icon = supportIcons[item.icon];

                  return (
                    <Link
                      key={item.label}
                      href={item.href ?? "#"}
                      className="flex h-11 items-center gap-3 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F8F3E9]"
                    >
                      <Icon className="h-4 w-4 text-[#0A4833]" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl bg-[#0A4833] p-6 text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex items-start gap-3">
                <Heart className="mt-0.5 h-5 w-5 fill-white text-white" />
                <div>
                  <h2 className="text-base font-semibold leading-6">{order.promo.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/85">{order.promo.description}</p>
                  <Link href={order.promo.ctaHref} className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
                    {order.promo.ctaLabel}
                  </Link>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

export type { OrderPlacedData };
