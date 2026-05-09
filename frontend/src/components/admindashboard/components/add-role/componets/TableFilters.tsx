"use client";

import { Search, ChevronDown, Download } from "lucide-react";

type Props = {
    search: string;
    setSearch: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    accessFilter: string;
    setAccessFilter: (val: string) => void;
    resultCount: number;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
};

export default function TableFilters({
    search,
    setSearch,
    status,
    setStatus,
    accessFilter,
    setAccessFilter,
    resultCount,
    hasActiveFilters,
    onClearFilters,
}: Props) {
    
    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">

                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search roles..."
                        className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </div>

                {/* Roles Dropdown */}
                <div className="relative">
                    <select
                        value={accessFilter}
                        onChange={(e) => setAccessFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700"
                    >
                        <option value="all">All access</option>
                        <option value="low">Low access</option>
                        <option value="medium">Medium access</option>
                        <option value="high">High access</option>
                        <option value="full">Full access</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                        <option value="all">All status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>

                <span className="text-sm font-medium text-gray-500">
                    {resultCount} result{resultCount === 1 ? "" : "s"}
                </span>

                {hasActiveFilters ? (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                    >
                        Clear
                    </button>
                ) : null}

                {/* Export Button */}
                <button className="flex items-center gap-2 bg-[#E5E7EB] hover:bg-gray-300 text-[#4B5563] px-4 py-2 rounded-lg text-sm font-semibold transition-colors ml-auto">
                    <Download size={18} />
                    <span>Export</span>
                </button>

            </div>
        </div>
    );
}
