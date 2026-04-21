import Image from "next/image";
import { CalendarDays, Check, Upload } from "lucide-react";

export default function ProfileInformationPanel() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-8">
      <h2 className="text-xl font-bold text-[#06402B]">Profile Information</h2>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#374151]">Profile Photo</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Image src="/recipe/recipe-2.webp" alt="Sarah Williams" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover" />
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#06402B] px-5 text-sm font-semibold text-white hover:bg-[#053020]"
          >
            <Upload className="h-4 w-4" />
            Upload New
          </button>
          <button type="button" className="h-10 rounded-md bg-[#E5E7EB] px-5 text-sm font-semibold text-[#374151] hover:bg-[#D1D5DB]">
            Remove
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-[#374151]">
          Full Name
          <input
            type="text"
            defaultValue="Sarah Williams"
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Email Address
          <input
            type="email"
            defaultValue="sarah.williams@email.com"
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Phone Number
          <input
            type="tel"
            defaultValue="+1 (555) 123-4567"
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Date of Birth
          <span className="relative mt-2 block">
            <input
              type="text"
              defaultValue="1990-05-15"
              className="h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 pr-10 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
            />
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#374151]" />
          </span>
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Gender
          <select className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]">
            <option>Female</option>
            <option>Male</option>
            <option>Prefer not to say</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#374151]">
          Location
          <input
            type="text"
            defaultValue="San Francisco, CA"
            className="mt-2 h-11 w-full rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]"
          />
        </label>
      </div>

      <label className="mt-7 block text-sm font-semibold text-[#374151]">
        Delivery Address
        <textarea
          placeholder="Please enter Your Delivery Address"
          className="mt-2 h-28 w-full resize-none rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 py-3 text-sm font-normal text-[#111827] outline-none placeholder:text-[#6B7280] focus:border-[#06402B]"
        />
      </label>

      <label className="mt-7 block text-sm font-semibold text-[#374151]">
        Wellness Note
        <textarea
          defaultValue="Passionate about holistic health and buckwheat-based nutrition. Love exploring new recipes and connecting with the wellness community."
          className="mt-2 h-28 w-full resize-none rounded-md border border-[#E9DFCC] bg-[#E9DFCC] px-4 py-3 text-sm font-normal leading-6 text-[#6B7280] outline-none focus:border-[#06402B]"
        />
      </label>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-[#06402B] px-6 text-sm font-semibold text-white hover:bg-[#053020]"
        >
          <Check className="h-4 w-4" />
          Save Changes
        </button>
        <button type="button" className="h-11 rounded-md bg-[#E5E7EB] px-6 text-sm font-semibold text-[#374151] hover:bg-[#D1D5DB]">
          Cancel
        </button>
      </div>
    </section>
  );
}
