"use client";

import { Search, ChevronDown, Download } from "lucide-react";

type Props = {
    search: string;
    setSearch: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    accessFilter: string;
    setAccessFilter: (val: string) => void;
};

export default function TableFilters({ search, setSearch, status, setStatus,accessFilter,setAccessFilter }: Props) {
    
    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">

                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search roles..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-400"
                    />
                </div>

                {/* Roles Dropdown */}
                <div className="relative">
                    <select
                        value={accessFilter}
                        onChange={(e) => setAccessFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700"
                    >
                        <option value="all">All Roles</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="full">Full</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>

                {/* Export Button */}
                <button className="flex items-center gap-2 bg-[#E5E7EB] hover:bg-gray-300 text-[#4B5563] px-4 py-2 rounded-lg text-sm font-semibold transition-colors ml-auto">
                    <Download size={18} />
                    <span>Export</span>
                </button>

            </div>
        </div>
    );
}