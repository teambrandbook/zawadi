import AssignHeader from "./components/AssignHeader";
import AssignmentSidebar from "./components/AssignmentSidebar";
import ConsultationRequestCard from "./components/ConsultationRequestCard";
import FindNutritionistCard from "./components/FindNutritionistCard";
import OtherNutritionistsCard from "./components/OtherNutritionistsCard";
import RecommendedMatchCard from "./components/RecommendedMatchCard";
import { assignNutritionistMockData } from "./assignNutritionistMockData";
import type { AssignNutritionistPageData, DeepPartial } from "./assignNutritionistTypes";

type AssignNutritionistPageProps = {
  data?: DeepPartial<AssignNutritionistPageData>;
};

function mergeAssignNutritionistData(data?: DeepPartial<AssignNutritionistPageData>): AssignNutritionistPageData {
  if (!data) {
    return assignNutritionistMockData;
  }

  return {
    ...assignNutritionistMockData,
    ...data,
    header: { ...assignNutritionistMockData.header, ...data.header },
    request: { ...assignNutritionistMockData.request, ...data.request },
    finder: { ...assignNutritionistMockData.finder, ...data.finder },
    recommended: { ...assignNutritionistMockData.recommended, ...data.recommended },
    summary: { ...assignNutritionistMockData.summary, ...data.summary },
    scheduleNote: { ...assignNutritionistMockData.scheduleNote, ...data.scheduleNote },
  };
}

export default function AssignNutritionistPage({ data }: AssignNutritionistPageProps) {
  const pageData = mergeAssignNutritionistData(data);

  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AssignHeader data={pageData.header} />

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <ConsultationRequestCard data={pageData.request} />
            <FindNutritionistCard data={pageData.finder} />
            <RecommendedMatchCard data={pageData.recommended} />
            <OtherNutritionistsCard title={pageData.otherNutritionistsTitle} items={pageData.otherNutritionists} />
          </div>

          <AssignmentSidebar
            scheduleTitle={pageData.availableScheduleTitle}
            schedule={pageData.availableSchedule}
            summary={pageData.summary}
            note={pageData.scheduleNote}
          />
        </div>
      </div>
    </section>
  );
}
