"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import api from "@/services/api";
import ChooseExpertSection, { type SessionType } from "./components/ChooseExpertSection";
import SelectDateTimeSection from "./components/SelectDateTimeSection";
import HealthDetailsSection, { type HealthDetails } from "./components/HealthDetailsSection";
import ConfirmBookingSection, { type ConsultationFormData } from "./components/ConfirmBookingSection";

type MatchedConsultant = {
  consultant_id: string | number;
  consultant_name: string;
  photo: string | null;
  qualification: string | null;
  consultation_fee?: number | null;
};

type FindConsultantError = {
  error?: string;
  detail?: string;
};

type CreateBookingResponse = {
  message?: string;
  booking_id?: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getTodayIsoDate() {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
}

function getDefaultBookingTime() {
  return "09:00 AM";
}

const experts = [
  { id: "e1", name: "Dr. Sarah Wilson", specialty: "Certified Nutritionist", experience: "8+ years", rating: "4.9" },
  { id: "e2", name: "Dr. Emma Rodriguez", specialty: "Holistic Nutrition Expert", experience: "10+ years", rating: "5.0" },
  { id: "e3", name: "Dr. Michael Chen", specialty: "Sports Nutrition", experience: "6+ years", rating: "4.8" },
  { id: "e4", name: "Dr. James Thompson", specialty: "Weight Management Specialist", experience: "9+ years", rating: "4.8" },
];

const initialHealthDetails: HealthDetails = {
  primaryWellnessGoal: "fitness",
  mainConcern: "belly",
  dietPreferences: ["vegetarian"],
  allergies: "peanuts",
  lifestyle: "moderate",
  buckwheatGoals: "lose 5kg",
  additionalMessage: "Need help",
};

const initialFormData: ConsultationFormData = {
  choose_section: "weight_loss",
  primary_goal: "lose fat",
  language: "english",
  date: getTodayIsoDate(),
  time: getDefaultBookingTime(),
  primary_wellness_goal: "fitness",
  focus_area: "belly",
  allergies: "peanuts",
  diet_restriction: "vegetarian",
  lifestyle_activity: "moderate",
  journey_goal: "lose 5kg",
  additional_message: "Need help",
};

export default function AddConsaltation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rescheduleBookingId = searchParams.get("rescheduleBookingId");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExpertId] = useState<string | null>(experts[0].id);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | "">("Video Call");
  const [selectedGoal, setSelectedGoal] = useState("lose fat");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate());
  const [selectedSlot, setSelectedSlot] = useState(getDefaultBookingTime());
  const [healthDetails, setHealthDetails] = useState<HealthDetails>(initialHealthDetails);
  const [formData, setFormData] = useState<ConsultationFormData>(initialFormData);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFindingConsultant, setIsFindingConsultant] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [matchedConsultant, setMatchedConsultant] = useState<MatchedConsultant | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpRequestKey, setOtpRequestKey] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const statusToastId = useRef<string | number | null>(null);
  const stepLabels = ["Choose Session Type", "Select Date & Time", "Health Details", "Confirm Booking"];

  const selectedExpert = experts.find((item) => item.id === selectedExpertId) ?? null;
  const isStatusLoading = isSubmitting || isFindingConsultant || isRequestingOtp;
  const isStatusError = /^(please|unable|no |could not|invalid|consultant details)/i.test(statusMessage.trim());

  useEffect(() => {
    if (!statusMessage) {
      if (statusToastId.current) {
        toast.dismiss(statusToastId.current);
        statusToastId.current = null;
      }
      return;
    }

    if (statusToastId.current) {
      toast.dismiss(statusToastId.current);
      statusToastId.current = null;
    }

    if (isStatusLoading) {
      statusToastId.current = toast.loading(statusMessage);
      return;
    }

    if (isStatusError) {
      toast.error(statusMessage);
      return;
    }

    toast.success(statusMessage);
  }, [isStatusError, isStatusLoading, statusMessage]);

  function formatTimeForApi(value: string) {
    const twelveHourMatch = value.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/i);
    if (twelveHourMatch) return value.toUpperCase().replace(/\s+/g, " ");

    const twentyFourHourMatch = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!twentyFourHourMatch) return value;

    const hour = Number(twentyFourHourMatch[1]);
    const minute = twentyFourHourMatch[2];
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
  }

  function formatDateForDisplay(value: string) {
    if (!value) return value;

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function updateFormData(field: keyof ConsultationFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function mapSessionTypeForApi(value: string) {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.includes("audio")) return "audio";
    if (normalizedValue.includes("chat")) return "chat";
    return "video";
  }

  function getBookingPayload() {
    return {
      consultant_id: Number(matchedConsultant?.consultant_id),
      time: formatTimeForApi(formData.time || selectedSlot),
      booked_date: formData.date || selectedDate,
      session_type: mapSessionTypeForApi(selectedSessionType || "Video Call"),
      primary_goal: selectedGoal || formData.primary_goal,
      primary_wellness_goal: formData.primary_wellness_goal || healthDetails.primaryWellnessGoal,
      focuses_area: formData.focus_area || healthDetails.mainConcern,
      diet_preferences: formData.diet_restriction || healthDetails.dietPreferences.join(", "),
      lifestyle_activity_level: formData.lifestyle_activity || healthDetails.lifestyle,
      buckwheat_journey_goal: formData.journey_goal || healthDetails.buckwheatGoals,
      message: formData.additional_message || healthDetails.additionalMessage,
      language: selectedLanguage || formData.language,
      is_agreed: isAgreed,
    };
  }

  function getReschedulePayload() {
    return {
      booking_id: Number(rescheduleBookingId),
      consultant_id: Number(matchedConsultant?.consultant_id),
      booked_date: formData.date || selectedDate,
      booked_slot: formatTimeForApi(formData.time || selectedSlot),
    };
  }

  function getOtpRequestKey() {
    const action = rescheduleBookingId ? "reschedule" : "create";
    const payload = rescheduleBookingId ? getReschedulePayload() : getBookingPayload();
    return JSON.stringify({ action, payload });
  }

  async function requestBookingOtp(force = false) {
    if (!matchedConsultant?.consultant_id) return;

    const action = rescheduleBookingId ? "reschedule" : "create";
    const booking = rescheduleBookingId ? getReschedulePayload() : getBookingPayload();
    const nextKey = JSON.stringify({ action, payload: booking });

    if (!force && otpRequestKey === nextKey) return;

    setIsRequestingOtp(true);
    setStatusMessage(force ? "Sending a new verification code..." : "Sending verification code to your email...");

    try {
      const response = await api.post<{ message?: string }>("/consultant/community/booking-otp/request/", {
        action,
        booking,
      });
      setOtpRequestKey(nextKey);
      setOtpCode("");
      setStatusMessage(response.data.message || "A verification code has been sent to your email.");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string; detail?: string; time?: string; booking_id?: string }>;
      const backendMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.time ||
        axiosError.response?.data?.booking_id ||
        "Unable to send verification code. Please try again.";
      setStatusMessage(backendMessage);
    } finally {
      setIsRequestingOtp(false);
    }
  }

  useEffect(() => {
    if (currentStep !== 4 || !matchedConsultant?.consultant_id) return;

    const nextKey = getOtpRequestKey();
    if (otpRequestKey === nextKey) return;

    void requestBookingOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, matchedConsultant?.consultant_id]);

  function onSelectGoal(goal: string) {
    setSelectedGoal(goal);
    updateFormData("primary_goal", goal);
  }

  function onSelectLanguage(language: string) {
    setSelectedLanguage(language);
    updateFormData("language", language.toLowerCase());
  }

  function onSelectDate(date: string) {
    setSelectedDate(date);
    updateFormData("date", date);
  }

  function onSelectSlot(slot: string) {
    setSelectedSlot(slot);
    updateFormData("time", slot);
  }

  function onChangeHealthDetails<K extends keyof HealthDetails>(field: K, value: HealthDetails[K]) {
    setHealthDetails((prev) => ({ ...prev, [field]: value }));

    if (field === "primaryWellnessGoal") updateFormData("primary_wellness_goal", value as string);
    if (field === "mainConcern") updateFormData("focus_area", value as string);
    if (field === "allergies") updateFormData("allergies", value as string);
    if (field === "dietPreferences") updateFormData("diet_restriction", (value as string[]).join(", "));
    if (field === "lifestyle") updateFormData("lifestyle_activity", value as string);
    if (field === "buckwheatGoals") updateFormData("journey_goal", value as string);
    if (field === "additionalMessage") updateFormData("additional_message", value as string);
  }

  async function goNext() {
    if (currentStep === 1 && (!selectedSessionType || !selectedGoal || !selectedLanguage)) {
      setStatusMessage("Please select session type, primary goal, and language.");
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedSlot)) {
      setStatusMessage("Please select both date and time.");
      return;
    }
    if (currentStep === 3 && !healthDetails.primaryWellnessGoal.trim()) {
      setStatusMessage("Please select your primary wellness goal.");
      return;
    }

    if (currentStep === 3) {
      setIsFindingConsultant(true);
      setStatusMessage("Finding an available consultant for your selected date and time...");

      try {
        const payload = {
          date: formData.date || selectedDate,
          time: formatTimeForApi(formData.time || selectedSlot),
        };

        const response = await api.post("/consultant/find-consultant/", payload);
        setMatchedConsultant(response.data as MatchedConsultant);
      } catch (error: unknown) {
        const axiosError = error as AxiosError<FindConsultantError>;
        const backendMessage =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          "No consultant is available for the selected date and time.";
        setStatusMessage(backendMessage);
        setIsFindingConsultant(false);
        return;
      }
    }

    setStatusMessage("");
    setCurrentStep((prev) => Math.min(4, prev + 1));
    setIsFindingConsultant(false);
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
    if (otpCode.length !== 6) {
      setStatusMessage("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    if (!matchedConsultant?.consultant_id) {
      setStatusMessage("Consultant details are missing. Please go back and try again.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Confirming your booking...");

    try {
      const action = rescheduleBookingId ? "reschedule" : "create";
      const booking = rescheduleBookingId ? getReschedulePayload() : getBookingPayload();

      const response = await api.post<CreateBookingResponse>("/consultant/community/booking-otp/confirm/", {
        action,
        booking,
        code: otpCode,
      });
      setStatusMessage(response.data.message || "Consultation booked successfully.");
      router.push("/communityDashBoard/consultation");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string; detail?: string }>;
      const backendMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        "Unable to confirm booking right now. Please try again.";

      setStatusMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full min-h-screen bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <header className="rounded-xl bg-white p-4 lg:p-5">


          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-max items-center gap-3">
              {stepLabels.map((label, index) => {
                const step = index + 1;
                const completed = currentStep > step;
                const active = currentStep === step;

                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold ${completed
                            ? "bg-[#0A5A3F] text-white"
                            : active
                              ? "bg-[#A88751] text-white"
                              : "bg-[#E5E7EB] text-[#6B7280]"
                          }`}
                      >
                        {completed ? <Check className="h-5.5 w-5.5" /> : step}
                      </span>

                      <span
                        className={`whitespace-nowrap text-sm font-medium leading-5 sm:text-base ${completed || active ? "text-[#0A4833]" : "text-[#9CA3AF]"
                          }`}
                      >
                        {label}
                      </span>
                    </div>

                    {step < stepLabels.length && (
                      <span
                        className={`h-[2px] w-8 shrink-0 rounded-full ${currentStep > step ? "bg-[#0A5A3F]" : "bg-[#D1D5DB]"
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
              onSelectGoal={onSelectGoal}
              onSelectLanguage={onSelectLanguage}
              onContinue={goNext}
            />
          )}
          {currentStep === 2 && (
            <SelectDateTimeSection
              expertName={selectedExpert?.name ?? "Dr. Sarah Chen"}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              sessionType={selectedSessionType || "Video Call"}
              onSelectDate={onSelectDate}
              onSelectSlot={onSelectSlot}
              onContinue={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === 3 && (
            <HealthDetailsSection
              value={healthDetails}
              onChange={onChangeHealthDetails}
              onContinue={goNext}
              onBack={goBack}
              selectedDate={formatDateForDisplay(selectedDate) || "May 15, 2024"}
              selectedTime={formatTimeForApi(selectedSlot) || "2:00 PM"}
              sessionType={selectedSessionType || "Video Call"}
            />
          )}
          {currentStep === 4 && (
            <ConfirmBookingSection
              selectedExpert={selectedExpert}
              matchedConsultant={matchedConsultant}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              sessionType={selectedSessionType || "Video Call"}
              selectedGoal={selectedGoal}
              selectedLanguage={selectedLanguage}
              healthDetails={healthDetails}
              formData={formData}
              isAgreed={isAgreed}
              onToggleAgreement={() => setIsAgreed((prev) => !prev)}
              otpCode={otpCode}
              onOtpChange={setOtpCode}
              onResendOtp={() => requestBookingOtp(true)}
              onConfirm={onConfirmBooking}
              onBack={goBack}
              isSubmitting={isSubmitting || isFindingConsultant || isRequestingOtp}
            />
          )}
        </div>

      </div>
    </section>
  );
}
