"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import AvailabilityCard from "./AvailabilityCard";
import BasicDetailsCard from "./BasicDetailsCard";
import ProfessionalDetailsCard from "./ProfessionalDetailsCard";
import ProfilePhotoCard from "./ProfilePhotoCard";
import VisibilityControlsCard from "./VisibilityControlsCard";
import type { AvailabilitySlot, BlockedDate, ConsultantProfileData, VisibilityControl } from "./profileTypes";

type ConsultantProfileApiResponse = {
  id: number;
  user_id: string;
  user_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: string | null;
  location: string | null;
  photo: string | null;
  role: string;
  years_of_experience: number;
  qualification: string;
  certifications: string | null;
  short_bio: string | null;
  languages_spoken: string;
  session_type: string;
  consultation_fee: number;
  session_duration: number;
  experience_areas: string;
  created_at: string;
};

type ConsultantSettingsApiResponse = {
  accept_new: boolean;
  allow_same_day: boolean;
  show_profile: boolean;
  auto_close_full_day: boolean;
  followup_priority: boolean;
};

type AvailabilityApiResponse = {
  day: string;
  start_time: string;
  end_time: string;
};

type BlockedDateApiResponse = {
  id: number;
  from_date: string;
  to_date: string;
  reason: string;
};

type ConsultantProfileUpdateResponse = {
  message: string;
  data: ConsultantProfileApiResponse;
};

const fallbackProfile: ConsultantProfileData = {
  name: "Consultant",
  imageSrc: "/about/about-1.1.webp",
  imageAlt: "Consultant profile portrait",
  photoHint: "Upload a professional photo to build trust with clients",
  basicDetails: [
    { label: "Full Name", value: "-" },
    { label: "Email", value: "-" },
    { label: "Phone", value: "-" },
    { label: "Location", value: "-" },
    { label: "Qualification", value: "-" },
    { label: "Years of Experience", value: "-" },
  ],
  professionalProfile: {
    bio: "-",
    expertise: "-",
    languages: "-",
    consultationModes: "-",
    specializationTags: [],
  },
  availability: {
    consultationDuration: "-",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  weeklyAvailability: [],
  visibilityControls: [
    {
      id: "available-booking",
      title: "Available for Booking",
      description: "Allow clients to book consultations",
      enabled: true,
    },
    {
      id: "show-consultation-page",
      title: "Show on Consultation Page",
      description: "Display in public consultant listing",
      enabled: true,
    },
    {
      id: "featured-consultant",
      title: "Featured Consultant",
      description: "Highlight profile in searches",
      enabled: false,
    },
  ],
  blockedDates: [],
};

const dayLabels: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function formatMode(value: string) {
  return value
    ? value
        .split(/[,/&]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(", ")
    : "-";
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDateRange(fromDate: string, toDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${fromDate} - ${toDate}`;
  }

  return `${formatter.format(from)} - ${formatter.format(to)}`;
}

function normalizePhotoUrl(photo: string | null) {
  if (!photo) return fallbackProfile.imageSrc;
  return getImageUrl(photo);
}

function mapProfile(profile: ConsultantProfileApiResponse): ConsultantProfileData {
  const name = displayValue(profile.full_name || profile.user_name);

  return {
    ...fallbackProfile,
    name,
    imageSrc: normalizePhotoUrl(profile.photo),
    imageAlt: `Profile portrait for ${name}`,
    basicDetails: [
      { label: "Full Name", value: name },
      { label: "Email", value: displayValue(profile.email) },
      { label: "Phone", value: displayValue(profile.phone) },
      { label: "Location", value: displayValue(profile.location) },
      { label: "Qualification", value: displayValue(profile.qualification) },
      { label: "Years of Experience", value: displayValue(profile.years_of_experience) },
    ],
    professionalProfile: {
      bio: displayValue(profile.short_bio),
      expertise: displayValue(profile.experience_areas),
      languages: displayValue(profile.languages_spoken),
      consultationModes: formatMode(profile.session_type),
      specializationTags: splitTags(profile.experience_areas),
    },
    availability: {
      consultationDuration: `${displayValue(profile.session_duration)} minutes`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

function mapSettings(settings: ConsultantSettingsApiResponse): VisibilityControl[] {
  return [
    {
      id: "available-booking",
      title: "Available for Booking",
      description: "Allow clients to book consultations",
      enabled: settings.accept_new,
    },
    {
      id: "show-consultation-page",
      title: "Show on Consultation Page",
      description: "Display in public consultant listing",
      enabled: settings.show_profile,
    },
    {
      id: "featured-consultant",
      title: "Featured Consultant",
      description: "Prioritize follow-up clients in booking flow",
      enabled: settings.followup_priority,
    },
  ];
}

function mapAvailability(availability: AvailabilityApiResponse[]): AvailabilitySlot[] {
  if (!availability.length) return fallbackProfile.weeklyAvailability;

  return availability.map((slot) => ({
    day: dayLabels[slot.day] || slot.day,
    enabled: true,
    startTime: slot.start_time.slice(0, 5),
    endTime: slot.end_time.slice(0, 5),
  }));
}

function mapBlockedDates(blockedDates: BlockedDateApiResponse[]): BlockedDate[] {
  return blockedDates.map((item) => ({
    label: item.reason
      ? `${formatDateRange(item.from_date, item.to_date)} - ${item.reason}`
      : formatDateRange(item.from_date, item.to_date),
  }));
}

export default function ConsultantProfilePage() {
  const [consultantProfile, setConsultantProfile] = useState<ConsultantProfileData>(fallbackProfile);
  const [visibilityControls, setVisibilityControls] = useState<VisibilityControl[]>(fallbackProfile.visibilityControls);
  const [consultantSettings, setConsultantSettings] = useState<ConsultantSettingsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadConsultantProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const profileResponse = await api.get<ConsultantProfileApiResponse>("/consultant/profile/");

        const [settingsResponse, availabilityResponse, blockedDatesResponse] = await Promise.allSettled([
          api.get<ConsultantSettingsApiResponse>("/consultant/settings/"),
          api.get<AvailabilityApiResponse[]>("/consultant/availability/"),
          api.get<BlockedDateApiResponse[]>("/consultant/blocked-dates/"),
        ]);

        const mappedProfile = mapProfile(profileResponse.data);

        if (settingsResponse.status === "fulfilled") {
          mappedProfile.visibilityControls = mapSettings(settingsResponse.value.data);
          setConsultantSettings(settingsResponse.value.data);
        }

        if (availabilityResponse.status === "fulfilled") {
          mappedProfile.weeklyAvailability = mapAvailability(availabilityResponse.value.data || []);
        }

        if (blockedDatesResponse.status === "fulfilled") {
          mappedProfile.blockedDates = mapBlockedDates(blockedDatesResponse.value.data || []);
        }

        setConsultantProfile(mappedProfile);
        setVisibilityControls(mappedProfile.visibilityControls);
      } catch {
        setErrorMessage("Unable to load consultant profile. Please login with a consultant account.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadConsultantProfile();
  }, []);

  async function handlePhotoChange(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setIsUploadingPhoto(true);
    setErrorMessage("");

    try {
      const response = await api.patch<ConsultantProfileUpdateResponse>("/consultant/profile/", formData);
      const updatedProfile = mapProfile(response.data.data);

      setConsultantProfile((current) => ({
        ...current,
        name: updatedProfile.name,
        imageSrc: updatedProfile.imageSrc,
        imageAlt: updatedProfile.imageAlt,
        basicDetails: updatedProfile.basicDetails,
        professionalProfile: updatedProfile.professionalProfile,
        availability: updatedProfile.availability,
      }));
    } catch {
      setErrorMessage("Unable to update profile photo. Please try another image.");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  async function handleToggleVisibilityControl(controlId: string) {
    const settingsKeyByControlId: Record<string, keyof ConsultantSettingsApiResponse> = {
      "available-booking": "accept_new",
      "show-consultation-page": "show_profile",
      "featured-consultant": "followup_priority",
    };
    const settingsKey = settingsKeyByControlId[controlId];

    if (!settingsKey || !consultantSettings) return;

    const previousSettings = consultantSettings;
    const nextSettings = {
      ...consultantSettings,
      [settingsKey]: !consultantSettings[settingsKey],
    };

    setConsultantSettings(nextSettings);
    setVisibilityControls((current) =>
      current.map((control) =>
        control.id === controlId
          ? {
              ...control,
              enabled: !control.enabled,
            }
          : control,
      ),
    );

    try {
      await api.put("/consultant/settings/", nextSettings);
      setErrorMessage("");
    } catch {
      setConsultantSettings(previousSettings);
      setVisibilityControls(mapSettings(previousSettings));
      setErrorMessage("Unable to update visibility settings right now.");
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
        <div className="mx-auto flex max-w-[1220px] items-center justify-center rounded-[12px] border border-[#E7E5E4] bg-white px-6 py-16 text-[#0A4833]">
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          Loading consultant profile...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-4">
        {errorMessage ? (
          <div className="rounded-[10px] border border-[#F5C2C0] bg-[#FEF3F2] px-4 py-3 text-sm font-medium text-[#B42318]">
            {errorMessage}
          </div>
        ) : null}

        <ProfilePhotoCard
          name={consultantProfile.name}
          imageSrc={consultantProfile.imageSrc}
          imageAlt={consultantProfile.imageAlt}
          hint={consultantProfile.photoHint}
          isUploading={isUploadingPhoto}
          onPhotoChange={handlePhotoChange}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <BasicDetailsCard details={consultantProfile.basicDetails} />
          <ProfessionalDetailsCard details={consultantProfile.professionalProfile} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
          <AvailabilityCard settings={consultantProfile.availability} slots={consultantProfile.weeklyAvailability} />
          <VisibilityControlsCard
            controls={visibilityControls}
            blockedDates={consultantProfile.blockedDates}
            onToggleControl={handleToggleVisibilityControl}
          />
        </div>
      </div>
    </main>
  );
}
