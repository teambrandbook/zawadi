"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { recipess } from "../../../../lib/datafile"
import {
    AlertCircle,
    BookOpen,
    Bookmark,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Heart,
    Plus,
    Search,
    Star,
} from "lucide-react";


type StatItem = {
    label: string;
    value: string;
    Icon: ComponentType<{ className?: string }>;
    iconBoxClass: string;
    valueClass: string;
};

type RecipeCard = {
    title: string;
    description: string;
    image: string;
    category: string;
    categoryClass: string;
    status: string;
    statusClass: string;
    duration: string;
    submitted: string;
    actionLabel: string;
    note?: string;
};

const stats: StatItem[] = [
    {
        label: "Total Recipes",
        value: "12",
        Icon: BookOpen,
        iconBoxClass: "bg-[#EBE1CF] text-[#0A4833]",
        valueClass: "text-[#0A4833]",
    },
    {
        label: "Approved Recipes",
        value: "8",
        Icon: CheckCircle2,
        iconBoxClass: "bg-[#F0FDF4] text-[#16A34A]",
        valueClass: "text-[#16A34A]",
    },
    {
        label: "Pending Approval",
        value: "3",
        Icon: Clock3,
        iconBoxClass: "bg-[#FEFCE8] text-[#CA8A04]",
        valueClass: "text-[#CA8A04]",
    },
    {
        label: "Needs Changes",
        value: "1",
        Icon: AlertCircle,
        iconBoxClass: "bg-[#FEF2F2] text-[#DC2626]",
        valueClass: "text-[#DC2626]",
    },
];

const filters = ["All Recipes", "Approved", "Pending", "Rejected", "Drafts"];



function InfoBadge({ text, className }: { text: string; className: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
            {text}
        </span>
    );
}

export default function MyRecipy() {
    const router = useRouter();

    return (
        <section className="w-full bg-[#F3F4F6] px-4 py-8 lg:px-8">
            <div className="mx-auto max-w-[1120px] space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#0A4833]">My Recipes</h1>
                        <p className="mt-1 text-base text-[#4B5563]">
                            Share your buckwheat recipes, inspire the community, and track your submissions.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/communityDashBorde/myrecipy/add")}
                        className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0A4833] px-6 text-sm font-semibold text-white hover:bg-[#083B2A]"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Recipe
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map(({ label, value, Icon, iconBoxClass, valueClass }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBoxClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
                            </div>
                            <p className="text-base font-medium text-[#4B5563]">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl bg-gradient-to-r from-[#0A4833] to-[#047857] p-6 lg:p-8">
                    <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                        <div className="relative h-44 w-44 overflow-hidden rounded-lg">
                            <Image
                                src="/userdash/myrecipy/r1.webp"
                                alt="Featured buckwheat recipe"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 text-white">
                            <InfoBadge text="Most Liked Recipe" className="mb-3 bg-[#9F8151] text-white" />
                            <h2 className="text-3xl font-bold">Buckwheat Berry Pancakes</h2>
                            <p className="mt-2 text-[15px] text-white/90">
                                Your most popular recipe with 247 likes and 89 saves from the community. Keep inspiring
                                others with your healthy creations.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white">
                                <span className="inline-flex items-center gap-1">
                                    247 Likes <Heart className="h-4 w-4" />
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    89 Saves <Bookmark className="h-4 w-4" />
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    1.2k Views <Eye className="h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#DFDFDF] bg-white p-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {filters.map((tab, index) => (
                                <button
                                    key={tab}
                                    className={`rounded-md px-4 py-2 text-xs font-medium ${index === 0
                                            ? "bg-[#0A4833] text-white"
                                            : "bg-[#F3EEE3] text-[#6B7280] hover:bg-[#EEE6D6]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex h-10 items-center gap-2 rounded-md bg-[#F3EEE3] px-3 text-sm text-[#6B7280]">
                                <Search className="h-4 w-4" />
                                <span>Search by title...</span>
                            </div>
                            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#F3EEE3] px-4 text-sm text-[#4B5563]">
                                Newest First
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {recipess.map((recipe) => (
                        <article
                            key={recipe.title}
                            className="flex flex-col overflow-hidden rounded-xl border border-[#DFDFDF] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                        >
                            <div className="relative h-55 w-full">
                                <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                            </div>

                            {/* 👇 Make this flex column */}
                            <div className="flex flex-col space-y-2 p-5 h-full">

                                <div className="flex items-center justify-between gap-3">
                                    <InfoBadge text={recipe.category} className={recipe.categoryClass} />
                                    <InfoBadge text={recipe.status} className={recipe.statusClass} />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight text-[#0A4833]">
                                        {recipe.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                                        {recipe.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                    <span className="inline-flex items-center gap-1">
                                        {recipe.duration} <Clock3 className="h-3.5 w-3.5" />
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        {recipe.submitted} <Star className="h-3.5 w-3.5" />
                                    </span>
                                </div>

                                {recipe.note && (
                                    <div className="rounded bg-[#FEF2F2] px-3 py-2 text-xs text-[#DC2626]">
                                        {recipe.note}
                                    </div>
                                )}

                                {/* 👇 THIS IS THE KEY FIX */}
                                <div className="mt-auto flex items-center gap-2">
                                    <button className="h-10 flex-1 rounded-lg bg-[#0A4833] text-sm font-semibold text-white hover:bg-[#083B2A]">
                                        {recipe.actionLabel}
                                    </button>
                                    <button className="h-10 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]">
                                        Edit
                                    </button>
                                </div>

                            </div>
                        </article>
                    ))}
                </div>

                <div className="flex justify-center gap-2 pt-2">
                    <button className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-[#4B5563]">
                        <ChevronLeft className="mx-auto h-4 w-4" />
                    </button>
                    <button className="h-10 w-10 rounded-lg bg-[#0A4833] text-sm font-medium text-white">1</button>
                    <button className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-sm text-[#4B5563]">2</button>
                    <button className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-sm text-[#4B5563]">3</button>
                    <button className="h-10 w-10 rounded-lg border border-[#DFDFDF] bg-white text-[#4B5563]">
                        <ChevronRight className="mx-auto h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
