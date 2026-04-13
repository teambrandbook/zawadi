"use client";

import { Star } from "lucide-react";

type Nutritionist = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  rating: number;
  reviews: number;
};

type Props = {
  nutritionists: Nutritionist[];
  onBook: (id: string) => void;
};

export default function FindNutritionist({ nutritionists, onBook }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-lg font-semibold text-[#0A4833]">Find a Nutritionist</h3>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {nutritionists.map((item) => (
          <article
            key={item.id}
            className="flex flex-col h-full rounded-lg border border-[#E8E8E8] bg-[#FCFCFC] p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* This wrapper uses 'flex-1' to take up all available vertical space, 
    effectively pushing the button to the bottom of the card. 
  */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0A4833]">{item.name}</p>
              <p className="text-xs text-[#6B7280]">{item.role}</p>

              {/* The blurb height varies, but flex-1 above handles it */}
              <p className="mt-1 text-xs text-[#6B7280] line-clamp-3">
                {item.blurb}
              </p>

              <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#A88751]">
                <Star className="h-3.5 w-3.5 fill-[#A88751] text-[#A88751]" />
                <span>{item.rating.toFixed(1)}</span>
                <span className="text-[#6B7280]">({item.reviews} reviews)</span>
              </div>
            </div>

            {/* The button will now always sit at the bottom 
    because the div above it is expanding to fill the gap. 
  */}
            <button
              onClick={() => onBook(item.id)}
              className="mt-4 inline-flex h-8 w-full items-center justify-center rounded-md bg-[#0A4833] text-xs font-medium text-white transition-colors hover:bg-[#083B2A] focus:outline-none focus:ring-2 focus:ring-[#0A4833] focus:ring-offset-2"
            >
              Book Now
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
