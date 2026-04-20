"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ChevronLeft, ImagePlus, Plus } from "lucide-react";

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="space-y-1">
      <span className="text-[11px] font-medium text-[#344054]">{label}</span>
      <input
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none"
      />
    </label>
  );
}

function SelectField({ label, option }: { label: string; option: string }) {
  return (
    <label className="space-y-1">
      <span className="text-[11px] font-medium text-[#344054]">{label}</span>
      <select className="h-10 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none">
        <option>{option}</option>
      </select>
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#E4E7EC] bg-white p-3.5">
      <h3 className="mb-3 text-[12px] font-semibold text-[#0A4833]">{title}</h3>
      {children}
    </section>
  );
}

export default function AddBlogPage() {
  return (
    <section className="w-full bg-[#F7F8FA] p-3 lg:p-5">
      <div className="mx-auto max-w-[1180px] space-y-3">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[30px] font-semibold leading-tight text-[#0A4833]">Add Blog</h1>
            <p className="text-[12px] text-[#6B7280]">Create and publish engaging wellness stories for the ZEWADI community.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admindashboard/blog" className="inline-flex h-9 items-center gap-1 rounded-md border border-[#D9DEE3] bg-white px-3 text-[12px] text-[#344054]">
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <button type="button" className="inline-flex h-9 items-center rounded-md border border-[#D9DEE3] bg-white px-3 text-[12px] text-[#344054]">
              Save Draft
            </button>
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-3">
            <Section title="Basic Information">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Blog Title *" placeholder="Enter compelling blog title..." />
                <Field label="Slug (URL) *" placeholder="auto-generated-slug" />
                <SelectField label="Category *" option="Select category..." />
                <SelectField label="Author" option="Select Author" />
                <Field label="Reading Time" placeholder="e.g. 5 min read" />
                <SelectField label="Status" option="Draft" />
              </div>
            </Section>

            <Section title="Cover Image">
              <div className="grid place-items-center rounded-md border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-4 py-8 text-center">
                <ImagePlus className="h-5 w-5 text-[#A1844F]" />
                <p className="mt-2 text-[12px] font-medium text-[#344054]">Upload Cover Image</p>
                <p className="text-[11px] text-[#98A2B3]">Recommended size: 1200x600px (JPG, PNG)</p>
                <button type="button" className="mt-3 rounded-md bg-[#0A4833] px-3 py-1.5 text-[11px] font-medium text-white">
                  Choose File
                </button>
              </div>
            </Section>

            <Section title="Tags & Categories">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {["Admin Stories", "Nutrition", "Wellness Tips", "Plant Diet", "Community"].map((tag) => (
                    <span key={tag} className="rounded-md bg-[#F2F4F7] px-2 py-1 text-[11px] text-[#475467]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input placeholder="Enter new tag..." className="h-9 w-full rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 text-[12px] text-[#667085] outline-none" />
                  <button type="button" className="grid h-9 w-9 place-items-center rounded-md bg-[#0A4833] text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Blog Content">
              <div className="rounded-md border border-[#E4E7EC]">
                <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E7EC] bg-[#F9FAFB] px-2 py-1.5 text-[11px] text-[#475467]">
                  <button type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">
                    B
                  </button>
                  <button type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">
                    I
                  </button>
                  <button type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">
                    U
                  </button>
                  <span className="h-3 w-px bg-[#D0D5DD]" />
                  <button type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">
                    H2
                  </button>
                  <button type="button" className="rounded px-1.5 py-1 hover:bg-[#EEF2F6]">
                    Bullet
                  </button>
                </div>
                <textarea
                  placeholder="Start writing your blog content here..."
                  className="h-56 w-full resize-none rounded-b-md border-0 bg-white px-3 py-2 text-[13px] text-[#667085] outline-none"
                />
              </div>
              <p className="text-[10px] text-[#98A2B3]">Use sub headings and short paragraphs to make it readable.</p>
            </Section>

            <Section title="Publishing Options">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Publish Date" placeholder="dd/mm/yyyy" />
                <SelectField label="Visibility" option="Public" />
                <SelectField label="SEO Keywords" option="Health, buckwheat, wellness" />
                <SelectField label="Author Category" option="Admin" />
              </div>
            </Section>

            <Section title="Internal Notes">
              <textarea
                placeholder="Notes for review team (not visible to users)..."
                className="h-24 w-full resize-none rounded-md border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2 text-[12px] text-[#667085] outline-none"
              />
            </Section>
          </div>

          <aside className="rounded-lg border border-[#E4E7EC] bg-white p-3.5">
            <h3 className="mb-3 text-[12px] font-semibold text-[#0A4833]">Blog Preview</h3>
            <div className="mb-3 h-32 rounded-md border border-[#E4E7EC] bg-[#F9FAFB]" />
            <div className="space-y-2 text-[11px] text-[#475467]">
              <p>
                <span className="font-semibold text-[#344054]">Blog Title:</span> ...
              </p>
              <p>
                <span className="font-semibold text-[#344054]">Excerpt:</span> ...
              </p>
              <p>
                <span className="font-semibold text-[#344054]">Category:</span> ...
              </p>
              <p>
                <span className="font-semibold text-[#344054]">Tags:</span> ...
              </p>
              <p>
                <span className="font-semibold text-[#344054]">Author:</span> Admin
              </p>
              <p>
                <span className="font-semibold text-[#344054]">Status:</span> Draft
              </p>
            </div>
          </aside>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 rounded-lg border border-[#E4E7EC] bg-white p-3">
          <button type="button" className="h-8 rounded-md border border-[#D0D5DD] bg-white px-3 text-[11px] text-[#344054]">
            Cancel
          </button>
          <button type="button" className="h-8 rounded-md border border-[#D0D5DD] bg-white px-3 text-[11px] text-[#344054]">
            Save as Draft
          </button>
          <button type="button" className="h-8 rounded-md bg-[#A1844F] px-3 text-[11px] text-white">
            Preview Blog
          </button>
          <button type="button" className="h-8 rounded-md bg-[#0A4833] px-3 text-[11px] text-white">
            Create Blog
          </button>
        </div>
      </div>
    </section>
  );
}
