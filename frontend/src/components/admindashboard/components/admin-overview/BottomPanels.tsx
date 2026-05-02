"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CookingPot, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";

type PendingItem = {
  id: string;
  title: string;
  author: string;
  ago: string;
  type: "recipe" | "blog";
};

type ConsultationItem = {
  id: string;
  name: string;
  slot: string;
  status: string;
  image: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPendingRecipe(item: Record<string, any>): PendingItem {
  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? item.name ?? "Untitled Recipe"),
    author: String(item.author ?? item.submitted_by ?? "Unknown"),
    ago: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "",
    type: "recipe",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPendingBlog(item: Record<string, any>): PendingItem {
  return {
    id: String(item.id ?? ""),
    title: String(item.title ?? "Untitled Blog"),
    author: String(item.author ?? item.contributor ?? "Unknown"),
    ago: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "",
    type: "blog",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapConsultation(item: Record<string, any>, index: number): ConsultationItem {
  const user = item.user ?? {};
  const consultant = item.consultant ?? item.nutritionist ?? {};
  const consultantUser = consultant.user ?? {};
  const name = String(
    consultantUser.full_name ?? consultantUser.name ?? consultant.name ?? user.full_name ?? `Session ${index + 1}`
  );
  const dateStr = item.scheduled_date ?? item.date ?? "";
  const timeStr = item.scheduled_time ?? item.time ?? "";
  const slot = [timeStr, item.session_type ?? ""].filter(Boolean).join(" - ") || (dateStr ? new Date(dateStr).toLocaleDateString() : "Scheduled");

  return {
    id: String(item.id ?? `c-${index}`),
    name,
    slot,
    status: String(item.status ?? "pending"),
    image: String(
      consultantUser.photo ?? user.photo ?? "https://i.pravatar.cc/80?img=1"
    ),
  };
}

function statusBg(status: string) {
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "active") return "text-[#15803D]";
  if (s === "upcoming" || s === "pending") return "text-[#A88751]";
  return "text-[#6B7280]";
}

export default function BottomPanels() {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const [recipesRes, blogsRes] = await Promise.all([
          api.get("/recipes/admin/?status=pending"),
          api.get("/blog/admin/?status=pending"),
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawRecipes: Record<string, any>[] = Array.isArray(recipesRes.data)
          ? recipesRes.data
          : Array.isArray(recipesRes.data?.results)
          ? recipesRes.data.results
          : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawBlogs: Record<string, any>[] = Array.isArray(blogsRes.data)
          ? blogsRes.data
          : Array.isArray(blogsRes.data?.results)
          ? blogsRes.data.results
          : [];
        const combined = [
          ...rawRecipes.slice(0, 2).map(mapPendingRecipe),
          ...rawBlogs.slice(0, 2).map(mapPendingBlog),
        ].slice(0, 4);
        setPendingItems(combined);
      } catch {
        // Silent fail
      } finally {
        setLoadingApprovals(false);
      }
    };

    const fetchConsultations = async () => {
      try {
        const res = await api.get("/consultant/admin/bookings/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setConsultations(raw.slice(0, 3).map(mapConsultation));
      } catch {
        // Silent fail
      } finally {
        setLoadingConsultations(false);
      }
    };

    fetchPending();
    fetchConsultations();
  }, []);

  async function handleApprove(item: PendingItem) {
    try {
      if (item.type === "recipe") {
        await api.patch(`/recipes/admin/${item.id}/status/`, { status: "published" });
      } else {
        await api.patch(`/blog/admin/${item.id}/status/`, { status: "published" });
      }
      setPendingItems((prev) => prev.filter((p) => p.id !== item.id));
      toast.success(`${item.type === "recipe" ? "Recipe" : "Blog"} approved.`);
    } catch {
      toast.error("Failed to approve. Please try again.");
    }
  }

  async function handleReject(item: PendingItem) {
    try {
      if (item.type === "recipe") {
        await api.patch(`/recipes/admin/${item.id}/status/`, { status: "rejected" });
      } else {
        await api.patch(`/blog/admin/${item.id}/status/`, { status: "rejected" });
      }
      setPendingItems((prev) => prev.filter((p) => p.id !== item.id));
      toast.success(`${item.type === "recipe" ? "Recipe" : "Blog"} rejected.`);
    } catch {
      toast.error("Failed to reject. Please try again.");
    }
  }

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-xl font-semibold text-[#0A4833]">Pending Approvals</h3>
        {loadingApprovals && (
          <p className="mt-3 text-sm text-[#6B7280]">Loading pending items...</p>
        )}
        {!loadingApprovals && pendingItems.length === 0 && (
          <p className="mt-3 text-sm text-[#6B7280]">No pending approvals.</p>
        )}
        <div className="mt-3 space-y-2">
          {pendingItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className={`rounded-md border border-[#E5E7EB] p-3 ${item.type === "recipe" ? "bg-[#FFF7ED]" : "bg-[#FEFCE8]"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-start gap-2">
                  {item.type === "recipe" ? (
                    <CookingPot className="mt-0.5 h-4 w-4 text-[#A88751]" />
                  ) : (
                    <RotateCcw className="mt-0.5 h-4 w-4 text-[#A88751]" />
                  )}
                  <div>
                    <p className="text-sm text-[#0A4833]">{item.title}</p>
                    <p className="text-xs text-[#6B7280]">
                      By {item.author}
                      {item.ago ? ` - ${item.ago}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleApprove(item)}
                    className="rounded bg-[#16A34A] px-2 py-1 text-[10px] text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(item)}
                    className="rounded bg-[#DC2626] px-2 py-1 text-[10px] text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-xl font-semibold text-[#0A4833]">Today&apos;s Consultations</h3>
        {loadingConsultations && (
          <p className="mt-3 text-sm text-[#6B7280]">Loading consultations...</p>
        )}
        {!loadingConsultations && consultations.length === 0 && (
          <p className="mt-3 text-sm text-[#6B7280]">No consultations scheduled.</p>
        )}
        <div className="mt-3 space-y-2">
          {consultations.map((item) => (
            <div key={item.id} className="rounded-md bg-[#F4F6F8] p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#D8D8D8]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized={item.image.startsWith("http")}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A4833]">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">{item.slot}</p>
                  </div>
                </div>
                <p className={`text-xs font-medium capitalize ${statusBg(item.status)}`}>
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
