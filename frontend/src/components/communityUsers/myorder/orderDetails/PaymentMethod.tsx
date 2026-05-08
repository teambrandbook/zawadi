"use client";

import type { ReactNode } from "react";
import { BadgeCheck, CreditCard, Wallet } from "lucide-react";
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
  disabled = false,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg border px-4 py-3 text-left ${
        active ? "border-[#A88751] bg-[#FBF8F1]" : "border-[#DFDFDF] bg-white hover:bg-[#FAFAFA]"
      } ${disabled ? "cursor-not-allowed opacity-60 hover:bg-white" : ""}`}
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
          active={false}
          title="Online Payment"
          subtitle="Payment gateway will be available in the next phase"
          icon={<CreditCard className="h-4 w-4 text-[#A88751]" />}
          disabled
          onClick={() => undefined}
        />
      </div>
      <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#6B7280]">
        <BadgeCheck className="h-3.5 w-3.5 text-[#0A4833]" />
        MVP checkout is cash on delivery only.
      </p>
    </section>
  );
}
