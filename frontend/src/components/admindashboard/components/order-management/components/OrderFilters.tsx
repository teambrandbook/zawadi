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
      <div className="flex flex-wrap items-center gap-3">
        <select className={fieldClass} value={status} onChange={(e) => onChange("status", e.target.value)}>
          <option>All Status</option>
          <option>Processing</option>
          <option>Packed</option>
          <option>Shipped</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>

        <select className={fieldClass} value={payment} onChange={(e) => onChange("payment", e.target.value)}>
          <option>Payment Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Refunded</option>
        </select>

        <label className="relative">
          <input type="date" className={`${fieldClass} pr-9`} value={fromDate} onChange={(e) => onChange("fromDate", e.target.value)} />
          <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
        </label>

        <span className="text-[#6B7280]">-</span>

        <label className="relative">
          <input type="date" className={`${fieldClass} pr-9`} value={toDate} onChange={(e) => onChange("toDate", e.target.value)} />
          <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
        </label>

        <button type="button" onClick={onApply} className="h-10 rounded-md bg-[#0A4833] px-4 text-sm font-medium text-white hover:bg-[#083927]">Apply</button>
        <button type="button" onClick={onClear} className="h-10 rounded-md border border-[#DFDFDF] bg-white px-4 text-sm font-medium text-[#374151] hover:bg-[#F7F7F7]">Clear</button>
      </div>
    </section>
  );
}
