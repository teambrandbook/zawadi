"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Upload } from "lucide-react";
import type { CommunityProfileData, CommunityProfileUpdatePayload } from "./settingsTypes";

type Props = {
  profile: CommunityProfileData | null;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (payload: CommunityProfileUpdatePayload) => void | Promise<void>;
};

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  location: string;
  wellness_interests: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

function buildFormState(profile: CommunityProfileData | null): FormState {
  return {
    full_name: profile?.full_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    date_of_birth: profile?.date_of_birth ?? "",
    gender: profile?.gender ?? "",
    location: profile?.location ?? "",
    wellness_interests: profile?.wellness_interests ?? "",
    address_line: profile?.address?.address_line ?? "",
    city: profile?.address?.city ?? "",
    state: profile?.address?.state ?? "",
    country: profile?.address?.country ?? "",
    postal_code: profile?.address?.postal_code ?? "",
  };
}

export default function ProfileInformationPanel({ profile, isLoading, isSaving, onSave }: Props) {
  const [form, setForm] = useState<FormState>(buildFormState(profile));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setForm(buildFormState(profile));
    setPhotoFile(null);
    setRemovePhoto(false);
  }, [profile]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const photoPreviewUrl = useMemo(() => {
    if (!photoFile) return null;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    if (!photoPreviewUrl) return;
    return () => URL.revokeObjectURL(photoPreviewUrl);
  }, [photoPreviewUrl]);

  const previewPhoto = useMemo(() => {
    if (removePhoto) return null;
    if (photoPreviewUrl) return photoPreviewUrl;
    return profile?.photo ?? null;
  }, [photoPreviewUrl, profile?.photo, removePhoto]);

  function updateFormField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onCancel() {
    setForm(buildFormState(profile));
    setPhotoFile(null);
    setRemovePhoto(false);
  }

  function onSubmit() {
    onSave({
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      location: form.location.trim(),
      wellness_interests: form.wellness_interests.trim(),
      address: {
        address_line: form.address_line.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        postal_code: form.postal_code.trim(),
      },
      photoFile,
      removePhoto,
    });
  }

  if (isLoading) {
    return (
      <section className="rounded-lg border border-[#DFDFDF] bg-white p-8">
        <h2 className="text-xl font-bold text-[#06402B]">Profile Information</h2>
        <p className="mt-4 text-sm text-[#4B5563]">Loading profile...</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-8">
      <h2 className="text-xl font-bold text-[#06402B]">Profile Information</h2>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#374151]">Profile Photo</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-[#E5E7EB]">
            {previewPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewPhoto} alt={form.full_name || "Profile"} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[#06402B] px-5 text-sm font-semibold text-white hover:bg-[#053020]">
            <Upload className="h-4 w-4" />
            Upload New
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setPhotoFile(file);
                setRemovePhoto(false);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setPhotoFile(null);
              setRemovePhoto(true);
            }}
            className="h-10 rounded-md bg-[#E5E7EB] px-5 text-sm font-semibold text-[#374151] hover:bg-[#D1D5DB]"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-[#374151]">
          Full Name
          <input
            type="text"
            value={form.full_name}
            onChange={(event) => updateFormField("full_name", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Email Address
          <input
            type="email"
            value={form.email}
            disabled
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E5E7EB] px-4 text-sm font-normal text-[#6B7280] outline-none"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Phone Number
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateFormField("phone", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Date of Birth
          <span className="relative mt-2 block">
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(event) => updateFormField("date_of_birth", event.target.value)}
              className="h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 pr-10 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#374151]" />
          </span>
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Gender
          <select
            value={form.gender}
            onChange={(event) => updateFormField("gender", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          >
            <option value="">Select gender</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Location
          <input
            type="text"
            value={form.location}
            onChange={(event) => updateFormField("location", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-[#374151]">
          Address Line
          <input
            type="text"
            value={form.address_line}
            onChange={(event) => updateFormField("address_line", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          City
          <input
            type="text"
            value={form.city}
            onChange={(event) => updateFormField("city", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          State
          <input
            type="text"
            value={form.state}
            onChange={(event) => updateFormField("state", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Country
          <input
            type="text"
            value={form.country}
            onChange={(event) => updateFormField("country", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151] md:col-span-2">
          Postal Code
          <input
            type="text"
            value={form.postal_code}
            onChange={(event) => updateFormField("postal_code", event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
      </div>

      <label className="mt-7 block text-sm font-semibold text-[#374151]">
        Wellness Note
        <textarea
          value={form.wellness_interests}
          onChange={(event) => updateFormField("wellness_interests", event.target.value)}
          className="mt-2 h-28 w-full resize-none rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 py-3 text-sm font-normal leading-6 text-[#6B7280] outline-none focus:border-[#06402B]"
        />
      </label>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSaving}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-[#06402B] px-6 text-sm font-semibold text-white hover:bg-[#053020] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Check className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="h-11 rounded-md bg-[#E5E7EB] px-6 text-sm font-semibold text-[#374151] hover:bg-[#D1D5DB] disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
