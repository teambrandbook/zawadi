import {
  Apple,
  Bike,
  BookOpenText,
  Dumbbell,
  Heart,
  LayoutGrid,
  Lightbulb,
  RefreshCcw,
  Salad,
  Save,
  Sparkles,
  Stethoscope,
  Tv,
  Video,
  Phone,
  CalendarDays,
  HeartPulse,
  ChevronDown,
} from "lucide-react";

type SelectableOption = {
  id: string;
  label: string;
  icon: "weight" | "healthy" | "energy" | "digestive" | "lifestyle" | "fitness" | "recipes" | "tips" | "blogs" | "events" | "articles";
  selected?: boolean;
};

type DietOption = {
  id: string;
  label: string;
  selected?: boolean;
};

type WidgetOption = {
  id: string;
  label: string;
  selected?: boolean;
};

type PreferencesPanelData = {
  wellnessInterests: SelectableOption[];
  dietPreferences: DietOption[];
  dashboardLayout: {
    defaultView: string;
    preferredWidgets: WidgetOption[];
  };
  consultationSettings: {
    preferredMethod: "video" | "phone";
    preferredTime: string;
  };
  contentPreferences: SelectableOption[];
};

type Props = {
  data: PreferencesPanelData;
};

const optionIconMap = {
  weight: Heart,
  healthy: Apple,
  energy: Sparkles,
  digestive: Salad,
  lifestyle: Bike,
  fitness: Dumbbell,
  recipes: BookOpenText,
  tips: Lightbulb,
  blogs: Tv,
  events: CalendarDays,
  articles: HeartPulse,
};

function CardTitle({
  title,
  Icon,
}: {
  title: string;
  Icon: typeof Heart;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <Icon className="h-5 w-5 text-[#A7864E]" />
      <h2 className="text-[30px] font-semibold leading-none tracking-[-0.02em] text-[#0A4833]">{title}</h2>
    </div>
  );
}

function SelectableTile({
  option,
  compact = false,
}: {
  option: SelectableOption;
  compact?: boolean;
}) {
  const Icon = optionIconMap[option.icon];

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl px-4 text-center ${
        compact ? "h-[84px]" : "h-[74px]"
      } ${option.selected ? "bg-[#A7864E] text-white" : "bg-[#F3F4F6] text-[#374151]"}`}
    >
      <Icon className={`mb-2 h-4 w-4 ${option.selected ? "text-white" : "text-[#374151]"}`} />
      <span className="text-sm font-medium leading-5">{option.label}</span>
    </div>
  );
}

export default function PreferencesPanel({ data }: Props) {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <CardTitle title="Wellness Interests" Icon={Heart} />
          <div className="grid grid-cols-2 gap-3">
            {data.wellnessInterests.map((option) => (
              <SelectableTile key={option.id} option={option} />
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <CardTitle title="Diet Preferences" Icon={Salad} />
          <div className="space-y-3">
            {data.dietPreferences.map((option) => (
              <label
                key={option.id}
                className={`flex h-14 items-center gap-3 rounded-xl border px-4 text-base ${
                  option.selected
                    ? "border-[#A7864E] bg-[#FBF8F2] text-[#A7864E]"
                    : "border-transparent bg-[#F5F6F8] text-[#374151]"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full border ${
                    option.selected ? "border-[#2563EB] border-[5px]" : "border-[#9CA3AF]"
                  }`}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <CardTitle title="Dashboard Layout" Icon={LayoutGrid} />

          <div>
            <p className="mb-2 text-sm font-medium text-[#374151]">Default View</p>
            <div className="flex h-14 items-center justify-between rounded-xl border border-[#DFDFDF] px-4 text-base text-[#111827]">
              <span>{data.dashboardLayout.defaultView}</span>
              <ChevronDown className="h-5 w-5 text-[#111827]" />
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-[#374151]">Preferred Widgets</p>
            <div className="space-y-3">
              {data.dashboardLayout.preferredWidgets.map((widget) => (
                <label key={widget.id} className="flex items-center gap-3 text-base text-[#374151]">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-[2px] border ${
                      widget.selected ? "border-[#2563EB] bg-[#2563EB]" : "border-[#9CA3AF] bg-white"
                    }`}
                  >
                    {widget.selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  {widget.label}
                </label>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <CardTitle title="Consultation Settings" Icon={Stethoscope} />

          <div>
            <p className="mb-2 text-sm font-medium text-[#374151]">Preferred Method</p>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`flex h-[76px] flex-col items-center justify-center rounded-xl ${
                  data.consultationSettings.preferredMethod === "video"
                    ? "bg-[#A7864E] text-white"
                    : "bg-[#F3F4F6] text-[#374151]"
                }`}
              >
                <Video className="mb-2 h-4 w-4" />
                <span className="text-sm font-medium">Video Call</span>
              </div>
              <div
                className={`flex h-[76px] flex-col items-center justify-center rounded-xl ${
                  data.consultationSettings.preferredMethod === "phone"
                    ? "bg-[#A7864E] text-white"
                    : "bg-[#F3F4F6] text-[#374151]"
                }`}
              >
                <Phone className="mb-2 h-4 w-4" />
                <span className="text-sm font-medium">Phone Call</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-[#374151]">Preferred Time</p>
            <div className="flex h-14 items-center justify-between rounded-xl border border-[#DFDFDF] px-4 text-base text-[#111827]">
              <span>{data.consultationSettings.preferredTime}</span>
              <ChevronDown className="h-5 w-5 text-[#111827]" />
            </div>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <CardTitle title="Content Preferences" Icon={BookOpenText} />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {data.contentPreferences.map((option) => (
            <SelectableTile key={option.id} option={option} compact />
          ))}
        </div>
      </article>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#0A4833] px-8 text-base font-medium text-white shadow-[0px_2px_4px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#DFDFDF] bg-white px-8 text-base font-medium text-[#374151]"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset to Default
        </button>
      </div>
    </section>
  );
}

export type { PreferencesPanelData };
