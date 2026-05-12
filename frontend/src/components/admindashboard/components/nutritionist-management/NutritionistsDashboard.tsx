"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import NutritionistStatsGrid from "./components/NutritionistStatsGrid";
import NutritionistsDataTable from "./components/NutritionistsDataTable";
import NutritionistsHeader from "./components/NutritionistsHeader";
import type { NutritionistRow, NutritionistStatCard } from "./nutritionistTypes";

type NutritionistDetail = {
  id: string;
  user: {
    user_id?: string;
    user_name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string | null;
    gender?: string | null;
    location?: string | null;
    photo?: string | null;
    role?: string;
    is_active?: boolean;
    date_joined?: string;
  };
  years_of_experience?: number | string;
  qualification?: string;
  certifications?: string | null;
  short_bio?: string | null;
  languages_spoken?: string;
  session_type?: string;
  consultation_fee?: number | string;
  session_duration?: number | string;
  experience_areas?: string;
  created_at?: string;
  bookings_count?: number;
};

function toImageUrl(imagePath?: string | null) {
  if (!imagePath) return "https://i.pravatar.cc/100?img=1";
  return getImageUrl(imagePath);
}

function pickDisplayName(...candidates: Array<unknown>) {
  const cleanedCandidates = candidates
    .map((candidate) => String(candidate ?? "").trim())
    .filter(Boolean);

  const nonEmailCandidate = cleanedCandidates.find((candidate) => !candidate.includes("@"));
  return nonEmailCandidate ?? cleanedCandidates[0] ?? "Unknown";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiConsultant(item: Record<string, any>, index: number): NutritionistRow {
  const user = item.user ?? {};
  const sessionType = String(item.session_type ?? "video").toLowerCase();

  const supportChannels: Array<"video" | "audio" | "chat"> = [];
  if (sessionType.includes("video")) supportChannels.push("video");
  if (sessionType.includes("audio")) supportChannels.push("audio");
  if (sessionType.includes("chat")) supportChannels.push("chat");
  if (supportChannels.length === 0) supportChannels.push("video");

  return {
    id: String(item.id ?? `c-${index}`),
    name: pickDisplayName(
      user.full_name,
      item.full_name,
      user.user_name,
      item.user_name,
      user.name,
      item.name,
      user.email,
      item.email
    ),
    avatar: toImageUrl(user.photo ?? user.avatar ?? item.avatar),
    status: Boolean(user.is_active ?? item.is_active ?? true) ? "Active" : "Inactive",
    availability: Boolean(item.available ?? true) ? "Available" : "Busy",
    qualification: String(item.qualification ?? "—"),
    email: String(user.email ?? item.email ?? "—"),
    phone: String(user.phone ?? item.phone ?? "—"),
    expertiseTags: item.specialization
      ? [String(item.specialization)]
      : item.expertise
      ? String(item.expertise).split(",").map((s: string) => s.trim())
      : [`${item.years_of_experience ?? "0"} yrs experience`],
    sessions: parseInt(item.total_sessions ?? item.sessions ?? 0, 10),
    rating: parseFloat(item.rating ?? item.average_rating ?? 4.5),
    supportChannels,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiConsultantDetail(item: Record<string, any>): NutritionistDetail {
  const user = item.user ?? {};
  return {
    id: String(item.id ?? ""),
    user: {
      user_id: user.user_id,
      user_name: user.user_name,
      full_name: pickDisplayName(user.full_name, user.name, user.user_name, user.email),
      email: user.email,
      phone: user.phone,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      location: user.location,
      photo: toImageUrl(user.photo),
      role: user.role,
      is_active: user.is_active,
      date_joined: user.date_joined,
    },
    years_of_experience: item.years_of_experience,
    qualification: item.qualification,
    certifications: item.certifications,
    short_bio: item.short_bio,
    languages_spoken: item.languages_spoken,
    session_type: item.session_type,
    consultation_fee: item.consultation_fee,
    session_duration: item.session_duration,
    experience_areas: item.experience_areas,
    created_at: item.created_at,
    bookings_count: item.bookings_count,
  };
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function fieldValue(value: unknown) {
  const text = String(value ?? "").trim();
  return text || "-";
}

function NutritionistDetailsDialog({
  row,
  detail,
  isLoading,
  error,
  onClose,
}: {
  row: NutritionistRow | null;
  detail: NutritionistDetail | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  if (!row) return null;

  const user = detail?.user ?? {};
  const name = pickDisplayName(user.full_name, row.name, user.user_name, user.email);
  const avatar = toImageUrl(user.photo ?? row.avatar);
  const details = [
    { label: "Nutritionist ID", value: detail?.id ?? row.id },
    { label: "User ID", value: user.user_id },
    { label: "Username", value: user.user_name },
    { label: "Full Name", value: name },
    { label: "Email", value: user.email ?? row.email },
    { label: "Phone", value: user.phone ?? row.phone },
    { label: "Gender", value: user.gender },
    { label: "Date of Birth", value: formatDate(user.date_of_birth) },
    { label: "Location", value: user.location },
    { label: "Role", value: user.role },
    { label: "Account Status", value: user.is_active === false ? "Inactive" : row.status },
    { label: "Availability", value: row.availability },
    { label: "Qualification", value: detail?.qualification ?? row.qualification },
    { label: "Years of Experience", value: detail?.years_of_experience },
    { label: "Experience Areas", value: detail?.experience_areas ?? row.expertiseTags.join(", ") },
    { label: "Certifications", value: detail?.certifications },
    { label: "Languages Spoken", value: detail?.languages_spoken },
    { label: "Session Type", value: detail?.session_type ?? row.supportChannels.join(", ") },
    { label: "Session Duration", value: detail?.session_duration ? `${detail.session_duration} min` : undefined },
    { label: "Consultation Fee", value: detail?.consultation_fee ? `Rs ${detail.consultation_fee}` : undefined },
    { label: "Completed Sessions", value: row.sessions },
    { label: "Bookings Count", value: detail?.bookings_count },
    { label: "Rating", value: row.rating.toFixed(1) },
    { label: "Joined On", value: formatDate(user.date_joined) },
    { label: "Profile Created", value: formatDate(detail?.created_at) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-4">
            <img src={avatar} alt={name} className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-semibold text-[#0A4833]">{name}</h2>
              <p className="mt-1 text-sm text-[#6B7280]">{fieldValue(detail?.qualification ?? row.qualification)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#F3F4F6] text-[#475467]"
            aria-label="Close nutritionist details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">
              Loading nutritionist details...
            </div>
          ) : null}

          {error ? (
            <div className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
              {error}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((item) => (
              <div key={item.label} className="rounded-lg border border-[#E5E7EB] bg-[#FCFCFD] p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">{item.label}</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#0A4833]">{fieldValue(item.value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#98A2B3]">Short Bio</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#475467]">{fieldValue(detail?.short_bio)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteNutritionistConfirmDialog({
  row,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  row: NutritionistRow;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#0A4833]">Delete Nutritionist</h2>
        <p className="mt-2 text-sm text-[#4B5563]">
          Are you sure you want to delete <span className="font-medium text-[#0A4833]">{row.name}</span>?
        </p>
        <p className="mt-1 text-sm text-[#6B7280]">This action cannot be undone.</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C] disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function buildStats(rows: NutritionistRow[]): NutritionistStatCard[] {
  const total = rows.length;
  const active = rows.filter((r) => r.status === "Active").length;
  const available = rows.filter((r) => r.availability === "Available").length;
  const topRated = rows.reduce(
    (best, r) => (r.rating > best.rating ? r : best),
    { name: "—", rating: 0 } as { name: string; rating: number }
  );
  const totalSessions = rows.reduce((sum, r) => sum + r.sessions, 0);

  return [
    { id: "total", label: "Total", value: String(total), subText: "Total Nutritionists", icon: "users", iconTone: "green" },
    { id: "active", label: "Active", value: String(active), subText: "Active Experts", icon: "check", iconTone: "gold" },
    { id: "today", label: "Today", value: String(available), subText: "Available Today", icon: "calendar", iconTone: "gold" },
    { id: "top", label: String(topRated.rating || "—"), value: topRated.name, subText: "Highest Rated Expert", icon: "star", iconTone: "teal" },
    { id: "busy", label: "Busy", value: String(total - available), subText: "Fully Booked", icon: "clock", iconTone: "gold" },
    { id: "inactive", label: "Inactive", value: String(total - active), subText: "Inactive Experts", icon: "pause", iconTone: "gray" },
    { id: "assigned", label: "Assigned", value: "—", subText: "Assigned Consultations", icon: "list", iconTone: "teal" },
    { id: "done", label: "Done", value: String(totalSessions), subText: "Completed Sessions", icon: "done", iconTone: "gold" },
  ];
}

export default function NutritionistsDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<NutritionistRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<NutritionistRow | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<NutritionistDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NutritionistRow | null>(null);
  const [isDeletingNutritionist, setIsDeletingNutritionist] = useState(false);

  useEffect(() => {
    const fetchConsultants = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/consultant/consultants/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setRows(raw.map(mapApiConsultant));
        console.log(res.data);
        
      } catch {
        setFetchError("Failed to load nutritionists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  const stats = useMemo(() => buildStats(rows), [rows]);

  async function handleViewRow(row: NutritionistRow) {
    setSelectedRow(row);
    setSelectedDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);

    try {
      const response = await api.get(`/consultant/consultants/${row.id}/`);
      setSelectedDetail(mapApiConsultantDetail(response.data));
    } catch {
      setDetailError("Failed to load full nutritionist details. Showing table details only.");
    } finally {
      setIsDetailLoading(false);
    }
  }

  function handleEditRow(row: NutritionistRow) {
    router.push(`/admindashboard/nutritionist/addnutritonist?id=${encodeURIComponent(row.id)}`);
  }

  async function confirmDeleteNutritionist() {
    if (!deleteTarget) return;

    setIsDeletingNutritionist(true);
    try {
      await api.delete(`/consultant/consultants/${deleteTarget.id}/`);
      setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
      setSelectedRow((prev) => (prev?.id === deleteTarget.id ? null : prev));
      setSelectedDetail((prev) => (prev?.id === deleteTarget.id ? null : prev));
      toast.success("Nutritionist deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete nutritionist. Please try again.");
    } finally {
      setIsDeletingNutritionist(false);
    }
  }

  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-6 lg:px-6">
      {deleteTarget ? (
        <DeleteNutritionistConfirmDialog
          row={deleteTarget}
          isDeleting={isDeletingNutritionist}
          onConfirm={confirmDeleteNutritionist}
          onCancel={() => {
            if (!isDeletingNutritionist) setDeleteTarget(null);
          }}
        />
      ) : null}

      {selectedRow ? (
        <NutritionistDetailsDialog
          row={selectedRow}
          detail={selectedDetail}
          isLoading={isDetailLoading}
          error={detailError}
          onClose={() => {
            if (!isDetailLoading) {
              setSelectedRow(null);
              setSelectedDetail(null);
              setDetailError(null);
            }
          }}
        />
      ) : null}

      <div className="mx-auto max-w-[1180px] space-y-4">
        <NutritionistsHeader />
        <NutritionistStatsGrid items={stats} />
        {/* <NutritionistFiltersCard /> */}

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading nutritionists...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}
        {!isLoading && !fetchError && rows.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No nutritionists found.
          </div>
        )}

        {!isLoading && rows.length > 0 && (
          <NutritionistsDataTable
            rows={rows}
            onViewRow={handleViewRow}
            onEditRow={handleEditRow}
            onDeleteRow={setDeleteTarget}
          />
        )}
      </div>
    </section>
  );
}
