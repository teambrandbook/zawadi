import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";

export default function EventTestimonials() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1f4d3a] ">
            <span>Client Testimonials</span>
            <span className="text-[8px]">▼</span>
          </div>

          <h2 className="mt-4 font-serif text-[36px] leading-[1.1] text-[#1f4d3a] md:text-[48px] fade-in">
            Real Stories from Everyday <br className="hidden md:block" /> Moments
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="relative flex flex-col items-center lg:flex-row">
          
          {/* Testimonial Card */}
          <div className="left-move relative z-20 w-full lg:-mr-32 lg:w-[60%]">
            <div className="relative overflow-hidden rounded-[20px] bg-[#f2f6eb] p-8 shadow-2xl shadow-black/5 md:p-14">
              
              {/* Giant Quote SVG Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
                <svg width="300" height="250" viewBox="0 0 334 262" fill="none">
                  <path d="M315.979 25.4951C266.724 31.4237 228.543 73.3136 228.543 124.093C228.543 130.72 233.82 135.997 240.447 135.997H328.876V256.24H208.634V124.093C208.634 62.4049 255.785 11.505 315.979 5.52246V25.4951ZM112.324 25.5049C89.1136 28.3469 67.5891 39.2952 51.6025 56.5C34.5333 74.87 25.039 99.0136 25.0244 124.09V124.093C25.0244 130.72 30.3027 135.997 36.9297 135.997H125.358V256.24H5.11621V124.093C5.11637 62.4049 52.2642 11.5123 112.324 5.52441V25.5049Z" fill="#1F4D3A"/>
                </svg>
              </div>

              <div className="relative z-10">
                <p className="fade-in text-[18px] md:text-[22px] leading-[1.6] text-[#1f4d3a] font-medium">
                  Zewadi products truly changed the way I look at everyday food simple,
                  high-quality, and made to fit effortlessly into my life
                </p>

                <div className="mt-10 flex items-center justify-between">
                  {/* User Info */}
                  <div className="fade-in flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-[#dcdcd8]" />
                    <div>
                      <p className="text-[16px] font-bold text-[#1f4d3a]">Hamna Zaid</p>
                      <p className="text-[12px] text-[#7a8c78]">Happy Customer</p>
                    </div>
                  </div>

                  {/* Navigation Buttons - Positioned to overlap the card edge */}
                  <div className="absolute -right-4 bottom-10 flex gap-2 md:-right-6">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 border border-white backdrop-blur-sm text-[#1f4d3a] shadow-sm transition-all hover:bg-white">
                      <MoveLeft className="h-5 w-5" />
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f4d3a] text-white shadow-lg transition-all hover:bg-[#16382a]">
                      <MoveRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mt-8 w-full lg:mt-0 lg:w-[50%]">
            <div className="image-topdown relative h-[350px] w-full overflow-hidden rounded-[20px] lg:h-[500px]">
              <Image
                src="/event/community_hands.webp" 
                alt="Community hands"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
