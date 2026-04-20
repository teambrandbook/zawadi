import type { ConsultationRequestData } from "../assignNutritionistTypes";

type ConsultationRequestCardProps = {
  data: ConsultationRequestData;
};

export default function ConsultationRequestCard({ data }: ConsultationRequestCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-lg font-semibold text-[#0A4833]">Consultation Request</h2>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={data.patientImage} alt={data.patientName} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">{data.patientName}</p>
              <p className="text-xs text-[#6B7280]">ID: {data.patientId}</p>
            </div>
          </div>

          {data.leftDetails.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-[#6B7280]">{item.label}</p>
              <p className="text-sm text-[#111827]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {data.rightDetails.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-[#6B7280]">{item.label}</p>
              <p className="text-sm text-[#111827]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
