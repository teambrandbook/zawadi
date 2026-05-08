"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clock3,
  Heart,
  Leaf,
  UserRound,
  ReceiptText,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "My Profile", Icon: UserRound, active: true },
  { label: "Orders", Icon: ReceiptText },
  { label: "My Recipes", iconSrc: "/userdash/myrecipy/my-recipes-icon.png" },
];

const recipes = [
  {
    title: "Autumn Harvest Salad",
    image: "/recipe/lunch-1.webp",
    time: "25 mins",
    level: "Easy",
    saved: true,
  },
  {
    title: "Zewadi Roots Stew",
    image: "/recipe/dinner-2.webp",
    time: "45 mins",
    level: "Medium",
    saved: false,
  },
  {
    title: "Morning Energy Bowl",
    image: "/recipe/recipe-3.webp",
    time: "10 mins",
    level: "Quick",
    saved: true,
  },
];

const details = [
  ["Full Name", "Sarah Johnson"],
  ["Email Address", "sarah.j@example.com"],
  ["Phone Number", "+1 (555) 902-1234"],
  ["Shipping Address", "4521 Maple Grove, Austin, TX 78701"],
];

function ProfileSidebar() {
  return (
    <aside className="space-y-4 w-full">
      <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 size-32">
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-[#d8c29a]">
              <Image
                src="/about/testimonial.webp"
                alt="Sarah Johnson"
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
            Sarah Johnson
          </h1>
          <p className="text-base leading-6 text-[#3f4e50]">sarah.j@example.com</p>
        </div>

        <nav className="mt-10 space-y-2">
          {menuItems.map(({ label, Icon, iconSrc, active }) => (
            <button
              key={label}
              type="button"
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
            </button>
          ))}
        </nav>
      </section>

      <section className="relative overflow-hidden rounded-[20px] bg-[#1f4d3a] p-8 text-white">
        <div className="absolute -bottom-8 -right-8 size-24 rounded-full bg-white/10" />
        <p className="text-lg font-bold leading-7">Member Since</p>
        <p className="mt-5 text-[32px] font-bold leading-10">2022</p>
        <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#d8c29a]">
          <Medal size={14} />
          Gold Tier Member
        </div>
      </section>
    </aside>
  );
}

function LatestOrderCard() {
  return (
    <section className="rounded-[25px] border border-[#e3dbd8] bg-[#f6f5f0] p-6 shadow-sm sm:p-8 lg:p-10">
      <p className="text-sm font-bold uppercase leading-5 tracking-[0.1em] text-[#1f4d3a]">
        Latest Order: #ZW-8821
      </p>
      <h2 className="mt-4 max-w-[720px] text-[28px] font-bold leading-tight text-[#121414] sm:text-[32px] sm:leading-10">
        Your fresh harvest is on the way!
      </h2>
      <p className="mt-3 text-base leading-6 text-[#3f4e50]">
        Expected delivery: Thursday, Oct 24th
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
  );
}

function RecipesPanel() {
  return (
    <section className="overflow-hidden rounded-[25px] border border-[#e3dbd8] bg-white shadow-sm">
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
        {recipes.map((recipe) => (
          <article key={recipe.title}>
            <div className="relative h-60 overflow-hidden rounded-[20px]">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(min-width: 1024px) 300px, 90vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
              <button
                type="button"
                aria-label={`${recipe.saved ? "Saved" : "Save"} ${recipe.title}`}
                className={cn(
                  "absolute right-4 top-4 flex size-10 items-center justify-center rounded-full shadow-sm",
                  recipe.saved ? "bg-white text-[#1f4d3a]" : "bg-white/80 text-[#acacac]"
                )}
              >
                <Heart size={17} fill={recipe.saved ? "currentColor" : "none"} />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold leading-8 text-[#121414]">{recipe.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm leading-5 text-[#3f4e50]">
              <Clock3 size={14} />
              <span>{recipe.time}</span>
              <span className="px-2">•</span>
              <span>{recipe.level}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PersonalInfo() {
  return (
    <section className="rounded-[25px] border border-[#e3dbd8] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[28px] font-bold leading-[42px] text-[#121414]">
          Personal Information
        </h2>
        <button
          type="button"
          className="self-start text-base font-bold leading-6 text-[#b47800] underline"
        >
          Edit Profile
        </button>
      </div>

      <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
        {details.map(([label, value]) => (
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
  );
}

export default function GuestProfile() {
  return (
    <main className="bg-[#fffef5] px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-12 lg:pt-48 xl:px-24">
      <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProfileSidebar />

        <div className="space-y-8">
          <LatestOrderCard />
          <RecipesPanel />
          <PersonalInfo />


        </div>
      </div>
    </main>
  );
}
