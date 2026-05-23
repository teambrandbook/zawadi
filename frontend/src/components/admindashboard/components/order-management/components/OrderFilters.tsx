import { CalendarDays } from "lucide-react";

type Props = {
  status: string;
  payment: string;
  fromDate: string;
  toDate: string;
  onChange: (field: string, value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

const fieldClass = "h-10 rounded-md border border-[#DFDFDF] bg-[#E9E0D0] px-3 text-sm text-[#111827] outline-none";

export default function OrderFilters({ status, payment, fromDate, toDate, onChange, onApply, onClear }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-3">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="space-y-3 lg:flex lg:items-center lg:gap-3 lg:space-y-0">
        <div className="hide-scrollbar overflow-x-auto lg:overflow-visible">
          <div className="flex min-w-max items-center gap-3 md:w-full md:min-w-0">
            <select className={`${fieldClass} w-[142px] shrink-0 md:flex-1`} value={status} onChange={(e) => onChange("status", e.target.value)}>
              <option value="All Status">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select className={`${fieldClass} w-[142px] shrink-0 md:flex-1`} value={payment} onChange={(e) => onChange("payment", e.target.value)}>
              <option>Payment Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>

            <label className="relative shrink-0 md:flex-1">
              <input type="date" className={`${fieldClass} w-[176px] pr-9 md:w-full`} value={fromDate} onChange={(e) => onChange("fromDate", e.target.value)} />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
            </label>

            <span className="shrink-0 text-[#6B7280]">-</span>

            <label className="relative shrink-0 md:flex-1">
              <input type="date" className={`${fieldClass} w-[176px] pr-9 md:w-full`} value={toDate} onChange={(e) => onChange("toDate", e.target.value)} />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 lg:justify-start">
          <button type="button" onClick={onApply} className="h-10 rounded-md bg-[#0A4833] px-4 text-sm font-medium text-white hover:bg-[#083927]">Apply</button>
          <button type="button" onClick={onClear} className="h-10 rounded-md border border-[#DFDFDF] bg-white px-4 text-sm font-medium text-[#374151] hover:bg-[#F7F7F7]">Clear</button>
        </div>
      </div>
    </section>
  );
}
