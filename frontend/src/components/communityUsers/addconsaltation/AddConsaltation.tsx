"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import ChooseExpertSection, { type SessionType } from "./components/ChooseExpertSection";
import SelectDateTimeSection from "./components/SelectDateTimeSection";
import HealthDetailsSection, { type HealthDetails } from "./components/HealthDetailsSection";
import ConfirmBookingSection from "./components/ConfirmBookingSection";

type Expert = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: string;
};

const experts: Expert[] = [
  { id: "e1", name: "Dr. Sarah Wilson", specialty: "Certified Nutritionist", experience: "8+ years", rating: "4.9" },
  { id: "e2", name: "Dr. Emma Rodriguez", specialty: "Holistic Nutrition Expert", experience: "10+ years", rating: "5.0" },
  { id: "e3", name: "Dr. Michael Chen", specialty: "Sports Nutrition", experience: "6+ years", rating: "4.8" },
  { id: "e4", name: "Dr. James Thompson", specialty: "Weight Management Specialist", experience: "9+ years", rating: "4.8" },
];

const initialHealthDetails: HealthDetails = {
  healthGoal: "",
  conditions: "",
  notes: "",
};

export default function AddConsaltation() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExpertId] = useState<string | null>(experts[0].id);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | "">("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [creditUsed, setCreditUsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [healthDetails, setHealthDetails] = useState<HealthDetails>(initialHealthDetails);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const stepLabels = ["Choose Expert", "Select Date & Time", "Health Details", "Confirm Booking"];

  const selectedExpert = useMemo(
    () => experts.find((item) => item.id === selectedExpertId) ?? null,
    [selectedExpertId]
  );

  function onChangeHealthDetails<K extends keyof HealthDetails>(field: K, value: HealthDetails[K]) {
    setHealthDetails((prev) => ({ ...prev, [field]: value }));
  }

  function goNext() {
    if (currentStep === 1 && (!selectedSessionType || !selectedGoal || !selectedLanguage)) {
      setStatusMessage("Please select session type, primary goal, and language.");
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedSlot)) {
      setStatusMessage("Please select both date and time.");
      return;
    }
    if (currentStep === 3 && !healthDetails.healthGoal.trim()) {
      setStatusMessage("Please enter your primary health goal.");
      return;
    }
    setStatusMessage("");
    setCurrentStep((prev) => Math.min(4, prev + 1));
  }

  function goBack() {
    setStatusMessage("");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }

  async function onConfirmBooking() {
    if (!isAgreed) {
      setStatusMessage("Please confirm details before booking.");
      return;
    }
    setIsSubmitting(true);
    setStatusMessage("Confirming your booking...");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    setStatusMessage("Consultation booked successfully.");
  }

  return (
    <section className="w-full min-h-screen bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">

        <header className="rounded-xl  bg-white p-4 lg:p-5">


          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              {stepLabels.map((label, index) => {
                const step = index + 1;
                const completed = currentStep > step;
                const active = currentStep === step;

                return (
                  <div key={label} className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold ${completed
                            ? "bg-[#0A5A3F] text-white"
                            : active
                              ? "bg-[#A88751] text-white"
                              : "bg-[#E5E7EB] text-[#6B7280]"
                          }`}
                      >
                        {completed ? <Check className="h-5.5 w-5.5" /> : step}
                      </span>

                      <span
                        className={`text-base font-medium ${completed || active ? "text-[#0A4833]" : "text-[#9CA3AF]"
                          }`}
                      >
                        {label}
                      </span>
                    </div>

                    {step < stepLabels.length && (
                      <span
                        className={`hidden h-[2px] w-8 rounded-full sm:block ${currentStep > step ? "bg-[#0A5A3F]" : "bg-[#D1D5DB]"
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div className="space-y-4">
          {currentStep === 1 && (
            <ChooseExpertSection
              selectedSessionType={selectedSessionType}
              selectedGoal={selectedGoal}
              selectedLanguage={selectedLanguage}
              onSelectSessionType={setSelectedSessionType}
              onSelectGoal={setSelectedGoal}
              onSelectLanguage={setSelectedLanguage}
              onUseCredit={() => setCreditUsed((prev) => !prev)}
              onContinue={goNext}
              creditUsed={creditUsed}
            />
          )}
          {currentStep === 2 && (
            <SelectDateTimeSection
              expertName={selectedExpert?.name ?? "Dr. Sarah Chen"}
              expertRole={selectedExpert?.specialty ?? "Certified Buckwheat Nutrition Specialist"}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              sessionType={selectedSessionType || "Video Call"}
              onSelectDate={setSelectedDate}
              onSelectSlot={setSelectedSlot}
              onContinue={goNext}
              onBack={goBack}
              onSaveForLater={() => setStatusMessage("Booking details saved for later.")}
            />
          )}
          {currentStep === 3 && (
            <HealthDetailsSection value={healthDetails} onChange={onChangeHealthDetails} />
          )}
          {currentStep === 4 && (
            <ConfirmBookingSection
              selectedExpert={selectedExpert}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              healthDetails={healthDetails}
              isAgreed={isAgreed}
              onToggleAgreement={() => setIsAgreed((prev) => !prev)}
              onConfirm={onConfirmBooking}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-[#DFDFDF] bg-[#F8F9FA] px-4 py-3 text-sm text-[#6B7280]">
            {statusMessage}
          </div>
        )}
      </div>
    </section>
  );
}
