"use client";

import type { ReactNode } from "react";
import { Heart, Lock, Shield } from "lucide-react";

type Props = {
  selectedDate: string;
  selectedTime: string;
};

function InfoBlock({
  title,
  description,
  icon,
  iconColorClass,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  iconColorClass: string;
}) {
  return (
    <div className="border-b border-[#D7DDDA] pb-5">
      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E7ECE9]">
        <span className={iconColorClass}>{icon}</span>
      </span>
      <h3 className="text-sm font-semibold text-[#0A4833]">{title}</h3>
      <p className="mt-3 text-[14px] leading-7 text-[#54726A]">{description}</p>
    </div>
  );
}

export default function HealthDetailsInfoPanel({ selectedDate, selectedTime }: Props) {
  return (
    <aside className="rounded-lg border border-[#D7DDDA] bg-white p-5">
      <div className="space-y-5">
        <InfoBlock
          title="Why We Ask"
          description="Your health information helps our experts create a personalized wellness plan tailored specifically to your needs and goals."
          icon={<Shield className="h-4 w-4" />}
          iconColorClass="text-[#A88751]"
        />
        <InfoBlock
          title="Your Privacy Matters"
          description="All information shared is confidential and used only to provide you with the best possible guidance."
          icon={<Lock className="h-4 w-4" />}
          iconColorClass="text-[#0A5A3F]"
        />
        <InfoBlock
          title="Personalized Care"
          description="Our nutritionists will review your details before the session to make the most of your consultation time."
          icon={<Heart className="h-4 w-4" />}
          iconColorClass="text-[#A88751]"
        />
      </div>

      <div className="pt-5">
        <h4 className="text-sm font-semibold text-[#0A4833]">Booking Summary</h4>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-[#6B847B]">
            <span>Date</span>
            <span className="font-medium text-[#0A4833]">{selectedDate}</span>
          </div>
          <div className="flex items-center justify-between text-[#6B847B]">
            <span>Time</span>
            <span className="font-medium text-[#0A4833]">{selectedTime}</span>
          </div>
          <div className="flex items-center justify-between text-[#6B847B]">
            <span>Duration</span>
            <span className="font-medium text-[#0A4833]">60 minutes</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
