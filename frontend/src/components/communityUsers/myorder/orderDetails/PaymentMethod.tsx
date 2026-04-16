"use client";

import { Wallet, Landmark } from "lucide-react";
import { PaymentMethod } from "./types";

type Props = {
  selectedMethod: PaymentMethod;
  onChangeMethod: (method: PaymentMethod) => void;
};

function MethodCard({
  active,
  title,
  subtitle,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-left ${
        active ? "border-[#A88751] bg-[#FBF8F1]" : "border-[#DFDFDF] bg-white hover:bg-[#FAFAFA]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2">
          <span className="mt-0.5">{icon}</span>
          <div>
            <p className="text-sm font-semibold text-[#0A4833]">{title}</p>
            <p className="text-xs text-[#6B7280]">{subtitle}</p>
          </div>
        </div>
        <span
          className={`mt-1 inline-flex h-4 w-4 rounded-full border ${active ? "border-[#A88751] bg-[#A88751]" : "border-[#CFCFCF]"}`}
        />
      </div>
    </button>
  );
}

export default function PaymentMethodSection({ selectedMethod, onChangeMethod }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h3 className="text-xl font-semibold text-[#0A4833]">Payment Method</h3>
      <div className="mt-4 space-y-3">
        <MethodCard
          active={selectedMethod === "cod"}
          title="Cash on Delivery"
          subtitle="Pay when you receive your order"
          icon={<Wallet className="h-4 w-4 text-[#A88751]" />}
          onClick={() => onChangeMethod("cod")}
        />
        <MethodCard
          active={selectedMethod === "upi"}
          title="UPI / Card / Online Payment"
          subtitle="Secure payment gateway"
          icon={<Landmark className="h-4 w-4 text-[#A88751]" />}
          onClick={() => onChangeMethod("upi")}
        />
      </div>
      <p className="mt-3 text-xs text-[#6B7280]">Your payment information is secure and encrypted.</p>
    </section>
  );
}
