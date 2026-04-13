"use client";

type Expert = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: string;
};

type HealthDetails = {
  healthGoal: string;
  conditions: string;
  notes: string;
};

type Props = {
  selectedExpert: Expert | null;
  selectedDate: string;
  selectedSlot: string;
  healthDetails: HealthDetails;
  isAgreed: boolean;
  onToggleAgreement: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export default function ConfirmBookingSection({
  selectedExpert,
  selectedDate,
  selectedSlot,
  healthDetails,
  isAgreed,
  onToggleAgreement,
  onConfirm,
  isSubmitting,
}: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h2 className="text-xl font-semibold text-[#0A4833]">4. Confirm Booking</h2>
      <p className="mt-1 text-sm text-[#6B7280]">Review your details before final confirmation.</p>

      <div className="mt-4 rounded-lg border border-[#EAEAEA] bg-[#F9FAFB] p-4 text-sm">
        <p className="font-semibold text-[#0A4833]">Consultation Summary</p>
        <p className="mt-2 text-[#4B5563]">
          <span className="font-medium text-[#0A4833]">Expert:</span> {selectedExpert?.name || "Not selected"}
        </p>
        <p className="text-[#4B5563]">
          <span className="font-medium text-[#0A4833]">Specialty:</span> {selectedExpert?.specialty || "Not selected"}
        </p>
        <p className="text-[#4B5563]">
          <span className="font-medium text-[#0A4833]">Date:</span> {selectedDate || "Not selected"}
        </p>
        <p className="text-[#4B5563]">
          <span className="font-medium text-[#0A4833]">Time:</span> {selectedSlot || "Not selected"}
        </p>
        <p className="text-[#4B5563]">
          <span className="font-medium text-[#0A4833]">Goal:</span> {healthDetails.healthGoal || "Not provided"}
        </p>
      </div>

      <label className="mt-4 inline-flex items-center gap-2 text-sm text-[#4B5563]">
        <input type="checkbox" checked={isAgreed} onChange={onToggleAgreement} />
        I confirm all details are correct.
      </label>

      <div className="mt-4">
        <button
          onClick={onConfirm}
          disabled={!isAgreed || isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0A4833] px-5 text-sm font-medium text-white hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </section>
  );
}
