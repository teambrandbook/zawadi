"use client";

import { Phone, Mail } from "lucide-react";

export default function NeedHelpCard() {
  return (
    <section className="rounded-xl border border-[#AF9260] bg-[#A88751] p-4 text-white shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
          <Phone className="h-4 w-4" />
        </span>
        <div>
          <h4 className="text-sm font-semibold leading-none">Need Help?</h4>
          <p className="mt-1 text-xs text-white/90">We&apos;re here for you</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <p className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +91 98765 43210</p><br />
        <p className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@zewadi.com</p>
      </div>
    </section>
  );
}
