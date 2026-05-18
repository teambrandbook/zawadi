"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
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

function toImageUrl(imagePath?: string | null) {
  if (!imagePath) return "";
  return getImageUrl(imagePath);
}

function splitCsv(value: unknown) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDate(value: unknown) {
  return String(value ?? "").split("T")[0];
}

export default function AddNutritionistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = Boolean(editId);
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
  const { upload: uploadPhoto, isUploading: isPhotoUploading } = useCloudinaryUpload("profile_photo");
  const [selectedPhotoName, setSelectedPhotoName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

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
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const toggleExpertise = (label: string) => {
    setActiveExpertise((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  const handleBrowsePhoto = () => fileInputRef.current?.click();

  useEffect(() => {
    if (!editId) return;

    const fetchNutritionistDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const response = await api.get(`/consultant/consultants/${editId}/`);
        const data = response.data ?? {};
        const user = data.user ?? {};
        const sessionType = String(data.session_type ?? "").toLowerCase();

        setFullName(String(user.full_name ?? data.full_name ?? ""));
        setUserName(String(user.user_name ?? data.user_name ?? ""));
        setEmail(String(user.email ?? data.email ?? ""));
        setPassword("");
        setPhone(String(user.phone ?? data.phone ?? ""));
        setDateOfBirth(normalizeDate(user.date_of_birth ?? data.date_of_birth));
        setYearsExp(String(data.years_of_experience ?? ""));
        setGender(String(user.gender ?? data.gender ?? "").toLowerCase());
        setLocation(String(user.location ?? data.location ?? ""));
        setQualification(String(data.qualification ?? ""));
        setCertifications(String(data.certifications ?? ""));
        setShortBio(String(data.short_bio ?? ""));
        setLanguages(String(data.languages_spoken ?? ""));
        setActiveExpertise(splitCsv(data.experience_areas));
        setConsultationFee(String(data.consultation_fee ?? ""));
        setSessionDuration(String(data.session_duration ?? "30"));
        setSessionVideo(sessionType.includes("video") || !sessionType);
        setSessionAudio(sessionType.includes("audio"));
        setSessionChat(sessionType.includes("chat"));
        const existingUrl = toImageUrl(user.photo ?? data.photo);
        setExistingPhotoUrl(existingUrl);
        if (existingUrl) setPhotoUrl(existingUrl);
        setSelectedPhotoName(user.photo ? "Current profile photo" : "");
      } catch {
        toast.error("Failed to load nutritionist details for editing.");
        router.push("/admindashboard/nutritionist");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchNutritionistDetails();
  }, [editId, router]);

  async function selectPhotoFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    if (isPhotoUploading) return;

    setSelectedPhotoName(file.name);
    const blobUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(blobUrl);
    try {
      const url = await uploadPhoto(file);
      setPhotoUrl(url);
      setPhotoPreviewUrl(url);
      URL.revokeObjectURL(blobUrl);
    } catch {
      /* hook sets error internally */
    }
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await selectPhotoFile(file);
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
    if (!isEditMode && !password.trim()) { toast.error("Password is required."); return; }
    if (!phone.trim()) { toast.error("Phone number is required."); return; }
    if (!dateOfBirth) { toast.error("Date of birth is required."); return; }
    if (!gender) { toast.error("Gender is required."); return; }
    if (!qualification.trim()) { toast.error("Qualification is required."); return; }
    if (!shortBio.trim()) { toast.error("Short bio is required."); return; }
    if (!languages.trim()) { toast.error("Languages spoken is required."); return; }
    if (activeExpertise.length === 0) { toast.error("Select at least one area of expertise."); return; }

    if (isPhotoUploading) {
      toast.error("Photo is still uploading, please wait.");
      return;
    }

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
    if (password.trim()) fd.append("password", password);
    fd.append("phone", phone.trim());
    fd.append("date_of_birth", dateOfBirth);
    fd.append("gender", gender.toUpperCase());
    fd.append("location", location.trim());
    fd.append("role", "CONSULTANT");
    if (photoUrl) fd.append("photo", photoUrl);

    setIsSubmitting(true);
    try {
      if (isEditMode && editId) {
        await api.patch(`/consultant/consultants/${editId}/`, fd);
        toast.success("Nutritionist updated successfully!");
      } else {
        await api.post("/account/nutritionists/create/", fd);
        toast.success("Nutritionist added successfully!");
      }
      router.push("/admindashboard/nutritionist");
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: Record<string, unknown> | string; status?: number } })?.response?.data;
      const statusCode = (err as { response?: { status?: number } })?.response?.status;
      const detail =
        typeof responseData === "string"
          ? statusCode && statusCode >= 500
            ? "Server error while saving nutritionist. Please try again."
            : responseData
          : typeof responseData?.detail === "string"
          ? responseData.detail
          : Object.entries(responseData ?? {})
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
              .join(" | ");
      toast.error(detail || `Failed to ${isEditMode ? "update" : "add"} nutritionist. Please try again.`);
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
        <AddNutritionistHeader isEditMode={isEditMode} />

        {isLoadingDetails && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading nutritionist details...
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_272px]">
          <div className="space-y-4">
            {/* Basic Information */}
            <FormCard title="Basic Information">
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Full Name *" value={fullName} onChange={setFullName} placeholder="Enter full name" />
                <InputField label="Username *" value={userName} onChange={setUserName} placeholder="Enter username" />
                <InputField label="Email Address *" value={email} onChange={setEmail} placeholder="nutritionist@email.com" type="email" />
                <InputField
                  label={isEditMode ? "New Password" : "Temporary Password *"}
                  value={password}
                  onChange={setPassword}
                  placeholder={isEditMode ? "Leave blank to keep current password" : "Enter temporary password"}
                  type="password"
                />
                <InputField label="Phone Number *" value={phone} onChange={setPhone} placeholder="+1 (555) 123-4567" />
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
              previewUrl={photoPreviewUrl || existingPhotoUrl}
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
                <InputField label="Languages Spoken *" value={languages} onChange={setLanguages} placeholder="English, Spanish, French" />
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
                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Nutritionist" : "Create Nutritionist")}
              </button>
            </div>
          </div>

          <ProfilePreviewCard
            activeExpertise={activeExpertise}
            fullName={fullName}
            qualification={qualification}
            yearsExp={yearsExp}
            consultationFee={consultationFee}
            sessionDuration={sessionDuration}
            photoPreviewUrl={photoPreviewUrl || existingPhotoUrl}
          />
        </div>
      </div>
    </section>
  );
}
