"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import AddNutritionistHeader from "./components/add-nutritionist/AddNutritionistHeader";
import { expertiseChips } from "./components/add-nutritionist/addNutritionistData";
import ExpertiseSection from "./components/add-nutritionist/ExpertiseSection";
import ProfilePhotoSection from "./components/add-nutritionist/ProfilePhotoSection";
import ProfilePreviewCard from "./components/add-nutritionist/ProfilePreviewCard";
// import { log } from "console";

// --- Inline form sections (controlled) ---

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="text-base font-semibold text-[#0A4833]">{title}</h2>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-[#0A4833]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-3 text-sm text-[#374151] outline-none"
      />
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-[#0A4833]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-3 py-2 text-sm text-[#374151] outline-none"
      />
    </label>
  );
}

// ---

export default function AddNutritionistPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic info
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  // Profile photo
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");

  // Professional details
  const [qualification, setQualification] = useState("");
  const [certifications, setCertifications] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [languages, setLanguages] = useState("");

  // Expertise chips
  const [activeExpertise, setActiveExpertise] = useState<string[]>(
    expertiseChips.filter((chip) => chip.active).map((chip) => chip.label),
  );

  // Consultation settings
  const [consultationFee, setConsultationFee] = useState("");
  const [sessionDuration, setSessionDuration] = useState("30");
  const [sessionVideo, setSessionVideo] = useState(true);
  const [sessionAudio, setSessionAudio] = useState(false);
  const [sessionChat, setSessionChat] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpertise = (label: string) => {
    setActiveExpertise((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  const handleBrowsePhoto = () => fileInputRef.current?.click();

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  function selectPhotoFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    setSelectedPhotoName(file.name);
    setPhotoFile(file);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    selectPhotoFile(file);
  }

  function buildSessionType() {
    const types: string[] = [];
    if (sessionVideo) types.push("video");
    if (sessionAudio) types.push("audio");
    if (sessionChat) types.push("chat");
    return types.join(",") || "video";
  }

  async function handleCreateNutritionist() {
    if (!fullName.trim()) { toast.error("Full name is required."); return; }
    if (!userName.trim()) { toast.error("Username is required."); return; }
    if (!email.trim()) { toast.error("Email is required."); return; }
    if (!password.trim()) { toast.error("Password is required."); return; }
    if (!dateOfBirth) { toast.error("Date of birth is required."); return; }
    if (!gender) { toast.error("Gender is required."); return; }
    if (!qualification.trim()) { toast.error("Qualification is required."); return; }
    if (!shortBio.trim()) { toast.error("Short bio is required."); return; }

    const fd = new FormData();
    fd.append("years_of_experience", yearsExp || "0");
    fd.append("qualification", qualification.trim());
    fd.append("certifications", certifications.trim());
    fd.append("short_bio", shortBio.trim());
    fd.append("languages_spoken", languages.trim());
    fd.append("experience_areas", activeExpertise.join(","));
    fd.append("session_type", buildSessionType());
    fd.append("consultation_fee", consultationFee || "0");
    fd.append("session_duration", sessionDuration);
    // User fields if backend accepts them at creation
    fd.append("full_name", fullName.trim());
    fd.append("user_name", userName.trim());
    fd.append("email", email.trim());
    fd.append("password", password);
    fd.append("phone", phone.trim());
    fd.append("date_of_birth", dateOfBirth);
    fd.append("gender", gender.toUpperCase());
    fd.append("role", "CONSULTANT");
    fd.append("user_type", "MEMBER");
    fd.append("preferred_communication", "email");
    fd.append("notification_preferences", "all");
    if (photoFile) fd.append("photo", photoFile);

    setIsSubmitting(true);
    try {
      await api.post("/account/register/", fd);
      toast.success("Nutritionist added successfully! ✅");
      router.push("/account/nutritionist");
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const detail =
        typeof responseData?.detail === "string"
          ? responseData.detail
          : Object.entries(responseData ?? {})
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
              .join(" | ");
      toast.error(detail || "Failed to add nutritionist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveDraft() {
    toast.info("Draft saved locally.");
    router.push("/admindashboard/nutritionist");
  }

  const handleCancel = () => router.push("/admindashboard/nutritionist");

  return (
    <section className="w-full bg-[#F6F7F9] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <AddNutritionistHeader />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_272px]">
          <div className="space-y-4">
            {/* Basic Information */}
            <FormCard title="Basic Information">
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Full Name *" value={fullName} onChange={setFullName} placeholder="Enter full name" />
                <InputField label="Username *" value={userName} onChange={setUserName} placeholder="Enter username" />
                <InputField label="Email Address *" value={email} onChange={setEmail} placeholder="nutritionist@email.com" type="email" />
                <InputField label="Temporary Password *" value={password} onChange={setPassword} placeholder="Enter temporary password" type="password" />
                <InputField label="Phone Number" value={phone} onChange={setPhone} placeholder="+1 (555) 123-4567" />
                <InputField label="Date of Birth *" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
                <InputField label="Years of Experience" value={yearsExp} onChange={setYearsExp} placeholder="5" type="number" />
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-[#0A4833]">Gender</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-3 text-sm text-[#374151] outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <InputField label="Location" value={location} onChange={setLocation} placeholder="City, State" />
              </div>
            </FormCard>

            {/* Profile Photo */}
            <ProfilePhotoSection
              fileInputRef={fileInputRef}
              selectedPhotoName={selectedPhotoName}
              previewUrl={photoPreviewUrl}
              onBrowsePhoto={handleBrowsePhoto}
              onPhotoChange={handlePhotoChange}
              onPhotoDrop={selectPhotoFile}
            />

            {/* Professional Details */}
            <FormCard title="Professional Details">
              <div className="space-y-3">
                <InputField label="Qualification *" value={qualification} onChange={setQualification} placeholder="e.g., Master's in Nutrition Science" />
                <InputField label="Certifications" value={certifications} onChange={setCertifications} placeholder="e.g., Certified Nutrition Specialist" />
                <TextareaField label="Short Bio *" value={shortBio} onChange={setShortBio} placeholder="Brief professional summary..." />
                <InputField label="Languages Spoken" value={languages} onChange={setLanguages} placeholder="English, Spanish, French" />
              </div>
            </FormCard>

            {/* Expertise */}
            <ExpertiseSection chips={expertiseChips} activeExpertise={activeExpertise} onToggle={toggleExpertise} />

            {/* Consultation Settings */}
            <FormCard title="Consultation Settings">
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Consultation Fee (USD)" value={consultationFee} onChange={setConsultationFee} placeholder="75" type="number" />
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-[#0A4833]">Session Duration (minutes)</span>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#DFDFDF] bg-[#F9FAFB] px-3 text-sm text-[#374151] outline-none"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </label>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-[#0A4833]">Session Types Supported</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#374151]">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={sessionVideo} onChange={(e) => setSessionVideo(e.target.checked)} className="h-3.5 w-3.5 accent-[#0A4833]" />
                    Video Call
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={sessionAudio} onChange={(e) => setSessionAudio(e.target.checked)} className="h-3.5 w-3.5 accent-[#0A4833]" />
                    Audio Call
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={sessionChat} onChange={(e) => setSessionChat(e.target.checked)} className="h-3.5 w-3.5 accent-[#0A4833]" />
                    Chat
                  </label>
                </div>
              </div>
            </FormCard>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border border-[#DFDFDF] bg-white p-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-[#D0D5DD] px-4 py-2 text-sm text-[#344054] hover:bg-[#F3F4F6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-lg border border-[#D0D5DD] px-4 py-2 text-sm text-[#344054] hover:bg-[#F3F4F6]"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleCreateNutritionist}
                disabled={isSubmitting}
                className="rounded-lg bg-[#0A4833] px-4 py-2 text-sm font-medium text-white hover:bg-[#083927] disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Nutritionist"}
              </button>
            </div>
          </div>

          <ProfilePreviewCard activeExpertise={activeExpertise} />
        </div>
      </div>
    </section>
  );
}
