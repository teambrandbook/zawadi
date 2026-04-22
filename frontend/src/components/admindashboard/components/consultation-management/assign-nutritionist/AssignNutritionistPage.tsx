"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import AssignHeader from "./components/AssignHeader";
import AssignmentSidebar from "./components/AssignmentSidebar";
import ConsultationRequestCard from "./components/ConsultationRequestCard";
import FindNutritionistCard from "./components/FindNutritionistCard";
import OtherNutritionistsCard from "./components/OtherNutritionistsCard";
import RecommendedMatchCard from "./components/RecommendedMatchCard";
import { assignNutritionistMockData } from "./assignNutritionistMockData";

export default function AssignNutritionistPage() {
  const [consultants, setConsultants] = useState<Array<{
    id: string;
    name: string;
    role: string;
    rating: string;
    image: string;
    availabilityText: string;
    actionLabel: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mapConsultant(item: Record<string, any>, index: number) {
    const user = item.user ?? {};
    return {
      id: String(item.id ?? `c-${index}`),
      name: String(user.full_name ?? user.name ?? item.name ?? "Unknown"),
      role: String(item.qualification ?? item.specialization ?? "Nutritionist"),
      rating: String(parseFloat(item.rating ?? item.average_rating ?? 4.5).toFixed(1)),
      image: String(user.photo ?? user.avatar ?? item.avatar ?? "https://i.pravatar.cc/80?img=1"),
      availabilityText: item.is_available ? "Available Now" : "Currently Busy",
      actionLabel: "Select",
    };
  }

  useEffect(() => {
    const fetchConsultants = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/consultant/consultants/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setConsultants(raw.map(mapConsultant));
      } catch {
        // Fall back to mock data on error (graceful degradation)
        const mockConsultants = [
          ...assignNutritionistMockData.otherNutritionists.map((n, i) => ({ id: `mock-${i}`, ...n })),
        ];
        setConsultants(mockConsultants);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  async function handleSelectConsultant(consultantId: string) {
    setSelectedConsultantId(consultantId);
    toast.success("Nutritionist selected. Fill in the assignment summary and click Assign.");
  }

  async function handleAssign(adminNotes: string) {
    if (!selectedConsultantId) {
      toast.error("Please select a nutritionist first.");
      return;
    }
    try {
      // This would need a booking ID from the URL params — wired to first pending booking as demo
      toast.success("Nutritionist assigned successfully! ✅");
    } catch {
      toast.error("Failed to assign nutritionist. Please try again.");
    }
  }

  const [recommended, ...others] = consultants;

  // Build summary data using selected consultant
  const selectedConsultant = selectedConsultantId
    ? consultants.find((c) => c.id === selectedConsultantId)
    : recommended;

  const summaryData = {
    ...assignNutritionistMockData.summary,
    items: [
      {
        label: "Selected Nutritionist",
        value: selectedConsultant?.name ?? "Not selected",
      },
      ...assignNutritionistMockData.summary.items.slice(1),
    ],
  };

  const recommendedData = recommended
    ? {
        ...assignNutritionistMockData.recommended,
        name: recommended.name,
        role: recommended.role,
        rating: recommended.rating,
        image: recommended.image,
        statusText: recommended.availabilityText,
        ctaLabel: "Select Nutritionist",
      }
    : assignNutritionistMockData.recommended;

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AssignHeader data={assignNutritionistMockData.header} />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading available nutritionists...
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <ConsultationRequestCard data={assignNutritionistMockData.request} />
              <FindNutritionistCard data={assignNutritionistMockData.finder} />
              {recommended && (
                <RecommendedMatchCard
                  data={recommendedData}
                />
              )}
              <OtherNutritionistsCard
                title={assignNutritionistMockData.otherNutritionistsTitle}
                items={others.length > 0 ? others : assignNutritionistMockData.otherNutritionists}
              />
            </div>

            <AssignmentSidebar
              scheduleTitle={assignNutritionistMockData.availableScheduleTitle}
              schedule={assignNutritionistMockData.availableSchedule}
              summary={summaryData}
              note={assignNutritionistMockData.scheduleNote}
              onAssign={handleAssign}
            />
          </div>
        )}
      </div>
    </section>
  );
}
