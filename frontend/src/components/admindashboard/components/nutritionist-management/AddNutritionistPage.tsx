"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AddNutritionistActions from "./components/add-nutritionist/AddNutritionistActions";
import AddNutritionistHeader from "./components/add-nutritionist/AddNutritionistHeader";
import BasicInformationSection from "./components/add-nutritionist/BasicInformationSection";
import ConsultationSettingsSection from "./components/add-nutritionist/ConsultationSettingsSection";
import { expertiseChips } from "./components/add-nutritionist/addNutritionistData";
import ExpertiseSection from "./components/add-nutritionist/ExpertiseSection";
import ProfessionalDetailsSection from "./components/add-nutritionist/ProfessionalDetailsSection";
import ProfilePhotoSection from "./components/add-nutritionist/ProfilePhotoSection";
import ProfilePreviewCard from "./components/add-nutritionist/ProfilePreviewCard";

export default function AddNutritionistPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [activeExpertise, setActiveExpertise] = useState<string[]>(
    expertiseChips.filter((chip) => chip.active).map((chip) => chip.label),
  );

  const toggleExpertise = (label: string) => {
    setActiveExpertise((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  const handleBrowsePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedPhotoName(file.name);
  };

  const handleCreateNutritionist = () => {
    console.log("[AddNutritionist] Create Nutritionist clicked");
    router.push("/admindashboard/nutritionist");
  };

  const handleSaveDraft = () => {
    console.log("[AddNutritionist] Save as Draft clicked");
    router.push("/admindashboard/nutritionist");
  };

  const handleCancel = () => {
    router.push("/admindashboard/nutritionist");
  };

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AddNutritionistHeader />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_272px]">
          <div className="space-y-4">
            <BasicInformationSection />
            <ProfilePhotoSection
              fileInputRef={fileInputRef}
              selectedPhotoName={selectedPhotoName}
              onBrowsePhoto={handleBrowsePhoto}
              onPhotoChange={handlePhotoChange}
            />
            <ProfessionalDetailsSection />
            <ExpertiseSection chips={expertiseChips} activeExpertise={activeExpertise} onToggle={toggleExpertise} />
            <ConsultationSettingsSection />
            <AddNutritionistActions
              onCreate={handleCreateNutritionist}
              onSaveDraft={handleSaveDraft}
              onCancel={handleCancel}
            />
          </div>

          <ProfilePreviewCard activeExpertise={activeExpertise} />
        </div>
      </div>
    </section>
  );
}

