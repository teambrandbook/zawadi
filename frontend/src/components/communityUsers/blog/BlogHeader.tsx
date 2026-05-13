"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogHeader() {
  const router = useRouter();

  function goToNewBlog() {
    router.push("/communityDashBoard/new-blog");
  }

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#06402B]">My Blog</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Manage your wellness stories and connect with the ZEWADI community</p>
      </div>
      <button
        type="button"
        onClick={goToNewBlog}
        className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-[#06402B] px-4 text-sm font-semibold text-white hover:bg-[#053020]"
      >
        <Plus className="h-4 w-4" />
        Write New Blog
      </button>
    </header>
  );
}
