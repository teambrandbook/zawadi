"use client";

import { DeliveryForm } from "./types";

type Props = {
  form: DeliveryForm;
  onChange: <K extends keyof DeliveryForm>(field: K, value: DeliveryForm[K]) => void;
};

const inputClass =
  "h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F4F6] px-3 text-sm text-[#0A4833] placeholder:text-[#8A8A8A] outline-none focus:border-[#0A4833]";

export default function DeliveryInformation({ form, onChange }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h3 className="text-xl font-semibold text-[#0A4833]">Delivery Information</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">Full Name</label>
          <input className={inputClass} value={form.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">Phone Number</label>
          <input className={inputClass} value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Email Address</label>
          <input className={inputClass} value={form.email} onChange={(e) => onChange("email", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">City</label>
          <input className={inputClass} value={form.city} onChange={(e) => onChange("city", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-[#0A4833]">Postal Code</label>
          <input className={inputClass} value={form.postalCode} onChange={(e) => onChange("postalCode", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Delivery Address</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-[#DFDFDF] bg-[#F3F4F6] p-3 text-sm text-[#0A4833] placeholder:text-[#8A8A8A] outline-none focus:border-[#0A4833]"
            value={form.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-[#0A4833]">Delivery Instructions (Optional)</label>
          <input
            className={inputClass}
            value={form.instructions}
            onChange={(e) => onChange("instructions", e.target.value)}
            placeholder="e.g. Ring the doorbell"
          />
        </div>
      </div>
    </section>
  );
}
