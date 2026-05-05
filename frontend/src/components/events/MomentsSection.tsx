import Image from "next/image";

export default function MomentsSection() {
  return (
    <section className="bg-white px-4 pb-10 pt-6 sm:px-6 md:pb-14 md:pt-8 lg:px-0">
      <div className="mx-auto max-w-[1200px] pt-20">
        <div className="relative overflow-hidden rounded-[12px]">

          {/* ✅ Reduced image height */}
          <div className="image-topdown relative h-[180px] sm:h-[280px] lg:h-[380px]">
            <video
              src="/event/moments_main.webm"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

        </div>

        {/* ✅ Reduced box size */}
        <div className="relative z-10 mx-auto -mt-6 max-w-[750px] rounded-[8px] bg-white px-5 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:px-8 md:-mt-10 md:py-8">

          <h2 className=" font-sans text-[20px] font-semibold text-[#1f4d3a] md:text-[21px] fade-in">
            The moments that connect us
          </h2>

          <p className="mt-4 max-w-[600px] font-sans text-[14px] leading-6 text-black md:text-[16px] md:leading-[1.4] fade-in">
            At Zewadi, every event is more than just an occasion it&apos;s an
            experience. A space where community, wellness, and meaningful moments
            come together.
          </p>

          <p className="mt-4 max-w-[620px] font-sans text-[14px] font-semibold leading-6 text-[#1f4d3a] md:text-[16px] md:leading-[1.4] fade-in">
            Zewadi events aren&apos;t just gatherings. They&apos;re spaces where people
            come together, connect, and try something new.
          </p>

        </div>
      </div>
    </section>
  );
}
