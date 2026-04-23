export type ClientStatus = "Active" | "Follow-up Due" | "High Priority" | "New";

export type ClientGoal = "Weight Loss" | "General Health" | "Muscle Gain" | "Digestive Health";

export type BackendClientItem = {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  status: ClientStatus;
  goal: ClientGoal;
  allergies: string[];
  dietPreference: string;
  lastConsultation: string;
  planName: string;
  activeSince: string;
  currentWeight: string;
  targetWeight: string;
  bmi: string;
  latestNotes: string;
  healthSummary: string;
  weightLost: string;
  adherence: number;
  progressSummary: string;
  email: string;
  phone: string;
  nextSession: string;
};

export type ClientStatCard = {
  id: string;
  label: string;
  value: number;
  tone: string;
};
