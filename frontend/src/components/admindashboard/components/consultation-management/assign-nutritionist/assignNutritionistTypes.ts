export type LabelValue = {
  label: string;
  value: string;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U> ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type HeaderData = {
  breadcrumbParent: string;
  breadcrumbCurrent: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
};

export type ConsultationRequestData = {
  patientName: string;
  patientId: string;
  patientImage: string;
  leftDetails: LabelValue[];
  rightDetails: LabelValue[];
};

export type FindNutritionistData = {
  title: string;
  searchPlaceholder: string;
  specializationLabel: string;
  availabilityLabel: string;
  chips: Array<{ label: string; active?: boolean }>;
};

export type RecommendedMatchData = {
  title: string;
  name: string;
  role: string;
  rating: string;
  reviewsText: string;
  statusText: string;
  nextSlotText: string;
  description: string;
  activeConsultationsText: string;
  ctaLabel: string;
  image: string;
};

export type OtherNutritionistItem = {
  name: string;
  role: string;
  rating: string;
  availabilityText: string;
  actionLabel: string;
  availabilityTone?: "default" | "warning";
  image: string;
};

export type ScheduleBlock = {
  dayLabel: string;
  slots: Array<{ text: string; highlighted?: boolean }>;
};

export type AssignmentSummaryData = {
  title: string;
  items: LabelValue[];
  notesLabel: string;
  notesPlaceholder: string;
  assignButtonLabel: string;
  draftButtonLabel: string;
};

export type ScheduleNoteData = {
  title: string;
  description: string;
};

export type AssignNutritionistPageData = {
  header: HeaderData;
  request: ConsultationRequestData;
  finder: FindNutritionistData;
  recommended: RecommendedMatchData;
  otherNutritionistsTitle: string;
  otherNutritionists: OtherNutritionistItem[];
  availableScheduleTitle: string;
  availableSchedule: ScheduleBlock[];
  summary: AssignmentSummaryData;
  scheduleNote: ScheduleNoteData;
};
