"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clock3,
  Heart,
  UserRound,
  ReceiptText,
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { getAccessToken } from "@/services/api";
import { toast } from "sonner";

type UserProfile = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  photo: string | null;
  user_type: string;
};

type RecentOrder = {
  order_id: string;
  product_name: string;
  total_amount: string;
  status: string;
  created_at: string;
};

type SavedAddress = {
  id: number;
  label: string;
  address_line: string;
  city: string;
  postal_code: string;
};

type BackendFavoriteRecipe = {
  id: number | string;
  slug?: string;
  title: string;
  cover_image?: string | null;
  prep_time_minutes?: number | string | null;
  cooking_time_minutes?: number | string | null;
  difficulty_level?: string | null;
};

type BackendFavoriteItem = {
  id: number | string;
  recipe: BackendFavoriteRecipe;
};

type FavoriteRecipesResponse =
  | BackendFavoriteItem[]
  | {
      data?: BackendFavoriteItem[];
      results?: BackendFavoriteItem[];
    };

type FavoriteRecipeCard = {
  id: string;
  slug?: string;
  title: string;
  image: string;
  time: string;
  level: string;
};

const menuItems = [
  { label: "My Profile", Icon: UserRound, href: "#personal-info", active: true },
  { label: "Orders", Icon: ReceiptText, href: "/guestprofile/history" },
  { label: "My Recipes", iconSrc: "/userdash/myrecipy/my-recipes-icon.png", href: "#my-recipes" },
];

function favoriteListFromResponse(data: FavoriteRecipesResponse): BackendFavoriteItem[] {
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.results)
    ? data.results
    : [];
}

function formatDifficulty(value?: string | null) {
  if (!value) return "Easy";
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function mapFavoriteRecipe(item: BackendFavoriteItem): FavoriteRecipeCard {
  const recipe = item.recipe;
  const prep = Number(recipe.prep_time_minutes ?? 0);
  const cooking = Number(recipe.cooking_time_minutes ?? 0);
  const totalMinutes = prep + cooking;

  return {
    id: String(recipe.id),
    slug: recipe.slug || String(recipe.id),
    title: recipe.title,
    image: recipe.cover_image ? getImageUrl(recipe.cover_image) : "/recipe/recipe-1.webp",
    time: totalMinutes > 0 ? `${totalMinutes} mins` : "Recipe",
    level: formatDifficulty(recipe.difficulty_level),
  };
}

let guestProfileRedirectInFlight = false;

export default function GuestProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const redirectToLogin = useCallback(() => {
    if (guestProfileRedirectInFlight) return;
    guestProfileRedirectInFlight = true;
    router.replace(`/login?next=${encodeURIComponent("/guestprofile")}`);
    window.setTimeout(() => {
      guestProfileRedirectInFlight = false;
    }, 1000);
  }, [router]);

  useEffect(() => {
    if (!getAccessToken()) {
      redirectToLogin();
      return;
    }

    async function loadProfile() {
      try {
        const meRes = await api.get("/account/me/");
        const [ordersRes, addrRes, favoritesRes] = await Promise.all([
          api.get("/orders/"),
          api.get("/community/addresses/"),
          api.get<FavoriteRecipesResponse>("/recipes/favorites/"),
        ]);

        setProfile(meRes.data);
        setEditName(meRes.data.full_name ?? "");
        setEditPhone(meRes.data.phone ?? "");
        const list = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : (ordersRes.data.results ?? []);
        setOrders(list.slice(0, 3));
        setAddresses(addrRes.data ?? []);
        setFavoriteRecipes(favoriteListFromResponse(favoritesRes.data).map(mapFavoriteRecipe));
      } catch {
        toast.error("Please login to view your profile.");
        redirectToLogin();
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [redirectToLogin]);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      await api.patch("/account/upgrade/");
      toast.success("Welcome to the community!");
      router.replace("/communityDashBoard");
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setUpgrading(false);
      setShowUpgradeModal(false);
    }
  }

  async function handleRemoveFavorite(recipeId: string) {
    const currentFavorites = favoriteRecipes;
    setFavoriteRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));

    try {
      await api.delete(`/recipes/${recipeId}/favorite/`);
      toast.success("Recipe removed from favorites.");
    } catch {
      setFavoriteRecipes(currentFavorites);
      toast.error("Could not remove favorite. Please try again.");
    }
  }

  async function handleSaveProfile() {
    if (!editName.trim() && !editPhone.trim()) {
      toast.error("Please add your name or phone number.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch("/account/me/", {
        full_name: editName.trim(),
        phone: editPhone.trim(),
      });
      setProfile((prev) =>
        prev ? { ...prev, full_name: res.data.full_name, phone: res.data.phone } : prev
      );
      setEditOpen(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#0A4833]">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="space-y-4 w-full">
          <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5 size-32">
                <div className="relative size-32 overflow-hidden rounded-full border-4 border-[#d8c29a]">
                  <Image
                    src={profile?.photo || "/default-avatar.svg"}
                    alt={profile?.full_name || "Profile"}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-[#1f4d3a] text-white"
                >
                  <Camera size={15} />
                </button>
              </div>
              <h1 className="text-2xl font-bold leading-9 tracking-[0.001em] text-[#121414]">
                {profile?.full_name || "Guest User"}
              </h1>
              <p className="text-base leading-6 text-[#3f4e50]">
                {profile?.email || ""}
              </p>
            </div>

            <nav className="mt-10 space-y-2">
              {menuItems.map(({ label, Icon, iconSrc, href, active }) => (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-[15px] p-4 text-left text-base font-semibold transition",
                    active ? "bg-[#1f4d3a] text-white" : "text-[#1f4d3a] hover:bg-[#f6f5f0]"
                  )}
                >
                  {iconSrc ? (
                    <Image src={iconSrc} alt="" width={16} height={16} className="size-4" />
                  ) : Icon ? (
                    <Icon size={16} />
                  ) : null}
                  {label}
                </Link>
              ))}
            </nav>
          </section>
        </aside>

        <div className="space-y-8">
          {/* Complete Profile Banner */}
          {profile && (!profile.full_name || !profile.phone) && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-blue-800">
                Add your full name and phone number to complete your profile
              </p>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="shrink-0 text-sm font-bold text-blue-700 underline hover:text-blue-900 transition"
              >
                Complete now
              </button>
            </div>
          )}

          {/* Upgrade Banner */}
          <div className="mx-0 rounded-xl border border-[#9f8151]/30 bg-[#fdfaf3] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#9f8151]">Unlock full community access</p>
              <p className="text-xs text-[#9f8151]/70 mt-0.5">
                Recipes, consultations, events and more
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="shrink-0 rounded-lg bg-[#9f8151] px-4 py-2 text-xs font-bold text-white hover:bg-[#8a6e42] transition"
            >
              Become a Member
            </button>
          </div>

          {/* Latest Order */}
          {orders.length > 0 ? (
            <section className="rounded-[25px] border border-[#e3dbd8] bg-[#f6f5f0] p-6 shadow-sm sm:p-8 lg:p-10">
              <p className="text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#1f4d3a]">
                Latest Order: #{orders[0].order_id}
              </p>
              <h2 className="mt-4 max-w-[720px] text-[28px] font-bold leading-tight text-[#121414] sm:text-[32px] sm:leading-10">
                {orders[0].product_name}
              </h2>
              <p className="mt-3 text-base leading-6 text-[#3f4e50] capitalize">
                Status: {orders[0].status}
              </p>
              <Link
                href="/trackorder"
                className="mt-7 inline-flex h-[60px] items-center gap-4 rounded-full bg-[#1f4d3a] px-8 text-base font-semibold text-white transition hover:bg-[#1a4331]"
              >
                View Order Tracking
                <span className="flex h-8 w-12 items-center justify-center rounded-full bg-[#b47800]">
                  <ArrowRight size={18} strokeWidth={1.5} />
                </span>
              </Link>
            </section>
          ) : (
            <section className="rounded-[25px] border border-[#e3dbd8] bg-[#f6f5f0] p-6 shadow-sm sm:p-8 lg:p-10">
              <p className="text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#1f4d3a]">
                No Orders Yet
              </p>
              <h2 className="mt-4 max-w-[720px] text-[28px] font-bold leading-tight text-[#121414] sm:text-[32px] sm:leading-10">
                Start your wellness journey
              </h2>
              <Link
                href="/products"
                className="mt-7 inline-flex h-[60px] items-center gap-4 rounded-full bg-[#1f4d3a] px-8 text-base font-semibold text-white transition hover:bg-[#1a4331]"
              >
                Shop Now
                <span className="flex h-8 w-12 items-center justify-center rounded-full bg-[#b47800]">
                  <ArrowRight size={18} strokeWidth={1.5} />
                </span>
              </Link>
            </section>
          )}

          {/* Recipes Panel */}
          <section id="my-recipes" className="scroll-mt-28 overflow-hidden rounded-[25px] border border-[#e3dbd8] bg-white shadow-sm">
            <div className="flex border-b border-[#e3dbd8]">
              <button
                type="button"
                className="border-b-4 border-[#1f4d3a] px-6 py-5 text-lg font-bold text-[#1f4d3a] sm:px-10"
              >
                My Recipes
              </button>
              <Link
                href="/guestprofile/history"
                className="px-6 py-5 text-lg font-semibold text-[#acacac] transition hover:text-[#1f4d3a] sm:px-10"
              >
                Order History
              </Link>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
              {favoriteRecipes.length === 0 ? (
                <div className="col-span-full flex min-h-56 flex-col items-center justify-center rounded-[20px] bg-[#fffef5] p-8 text-center">
                  <p className="text-lg font-bold text-[#121414]">No favorite recipes yet</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#3f4e50]">
                    Save recipes from the recipes page and they will appear here.
                  </p>
                  <Link
                    href="/recipes"
                    className="mt-5 inline-flex items-center rounded-full bg-[#1f4d3a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a4331]"
                  >
                    Explore Recipes
                  </Link>
                </div>
              ) : (
                favoriteRecipes.map((recipe) => (
                  <article key={recipe.id}>
                    <div className="relative h-60 overflow-hidden rounded-[20px]">
                      <Link
                        href={`/recipes/${recipe.slug || recipe.id}`}
                        className="absolute inset-0 block"
                      >
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 300px, 90vw"
                          className="object-cover transition duration-500 hover:scale-105"
                        />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${recipe.title} from favorites`}
                        onClick={() => handleRemoveFavorite(recipe.id)}
                        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white text-[#1f4d3a] shadow-sm"
                      >
                        <Heart size={17} fill="currentColor" />
                      </button>
                    </div>
                    <Link href={`/recipes/${recipe.slug || recipe.id}`}>
                      <h3 className="mt-4 text-xl font-bold leading-8 text-[#121414] transition hover:text-[#1f4d3a]">
                        {recipe.title}
                      </h3>
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm leading-5 text-[#3f4e50]">
                      <Clock3 size={14} />
                      <span>{recipe.time}</span>
                      <span className="px-2">•</span>
                      <span>{recipe.level}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Personal Information */}
          <section id="personal-info" className="scroll-mt-28 rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[28px] font-bold leading-[42px] text-[#121414]">
                Personal Information
              </h2>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="self-start text-base font-bold leading-6 text-[#b47800] underline"
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {[
                ["Full Name", profile?.full_name || "—"],
                ["Email Address", profile?.email || "—"],
                ["Phone Number", profile?.phone || "—"],
                [
                  "Shipping Address",
                  addresses.length > 0
                    ? `${addresses[0].address_line}, ${addresses[0].city} ${addresses[0].postal_code}`
                    : "No address saved",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm font-bold uppercase leading-5 tracking-[0.05em] text-[#acacac]">
                    {label}
                  </p>
                  <div className="mt-2 border-b border-[#f6f5f0] pb-2">
                    <p className="text-lg font-medium leading-7 text-[#121414]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#0a4833] mb-2">Become a Community Member</h2>
            <p className="text-sm text-[#6b7280] mb-6">
              This unlocks the community dashboard, recipes, consultations and events. Ready?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-[#374151] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="flex-1 rounded-lg bg-[#0a4833] py-2 text-sm font-bold text-white hover:bg-[#0c5a40] disabled:opacity-60"
              >
                {upgrading ? "Upgrading..." : "Confirm Upgrade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false); }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-[#0a4833]">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  maxLength={15}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]/30"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-[#374151] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 rounded-lg bg-[#0a4833] py-2 text-sm font-bold text-white hover:bg-[#0c5a40] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
