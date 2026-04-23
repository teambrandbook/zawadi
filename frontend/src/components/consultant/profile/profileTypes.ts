export type ProfileDetailItem = {
  label: string;
  value: string;
};

export type ProfessionalProfileData = {
  bio: string;
  expertise: string;
  languages: string;
  consultationModes: string;
  specializationTags: string[];
};

export type AvailabilityConfig = {
  consultationDuration: string;
  timeZone: string;
};

export type AvailabilitySlot = {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export type VisibilityControl = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type BlockedDate = {
  label: string;
};

export type ConsultantProfileData = {
  name: string;
  imageSrc: string;
  imageAlt: string;
  photoHint: string;
  basicDetails: ProfileDetailItem[];
  professionalProfile: ProfessionalProfileData;
  availability: AvailabilityConfig;
  weeklyAvailability: AvailabilitySlot[];
  visibilityControls: VisibilityControl[];
  blockedDates: BlockedDate[];
};
