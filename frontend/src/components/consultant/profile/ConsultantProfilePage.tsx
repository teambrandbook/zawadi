"use client";

import { useState } from "react";
import AvailabilityCard from "./AvailabilityCard";
import BasicDetailsCard from "./BasicDetailsCard";
import ProfessionalDetailsCard from "./ProfessionalDetailsCard";
import ProfilePhotoCard from "./ProfilePhotoCard";
import VisibilityControlsCard from "./VisibilityControlsCard";
import type { ConsultantProfileData } from "./profileTypes";

const consultantProfile: ConsultantProfileData = {
  name: "Dr. Sarah Mitchell",
  imageSrc: "/about/about-1.1.webp",
  imageAlt: "Profile portrait for Dr. Sarah Mitchell",
  photoHint: "Upload a professional photo to build trust with clients",
  basicDetails: [
    { label: "Full Name", value: "Dr. Sarah Mitchell" },
    { label: "Email", value: "sarah.mitchell@zewadi.com" },
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Location", value: "New York, NY" },
    { label: "Qualification", value: "Ph.D. in Nutritional Science" },
    { label: "Years of Experience", value: "12" },
  ],
  professionalProfile: {
    bio: "Specialized nutritionist with expertise in buckwheat-based dietary solutions. Helping clients achieve optimal health through evidence-based nutrition counseling.",
    expertise: "Nutritional Counseling, Buckwheat Diet Planning",
    languages: "English, Spanish",
    consultationModes: "Video & Phone",
    specializationTags: ["Buckwheat Nutrition", "Weight Management", "Digestive Health"],
  },
  availability: {
    consultationDuration: "30 minutes",
    timeZone: "EST (UTC-5)",
  },
  weeklyAvailability: [
    { day: "Monday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", enabled: false, startTime: "", endTime: "" },
    { day: "Friday", enabled: true, startTime: "09:00", endTime: "15:00" },
  ],
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
  blockedDates: [{ label: "Dec 25 - Jan 2" }],
};

export default function ConsultantProfilePage() {
  const [visibilityControls, setVisibilityControls] = useState(consultantProfile.visibilityControls);

  function handleToggleVisibilityControl(controlId: string) {
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
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1220px] space-y-4">
        <ProfilePhotoCard
          name={consultantProfile.name}
          imageSrc={consultantProfile.imageSrc}
          imageAlt={consultantProfile.imageAlt}
          hint={consultantProfile.photoHint}
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
