import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CommunitySection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-0">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[280px_282px_minmax(0,1fr)] lg:items-start">
        <div className="image-topdown relative mx-auto w-full max-w-[267px] ">
          <div className="image-topdownrelative h-[320px] overflow-hidden rounded-[20px] sm:h-[357px]">
            <Image
              src="/event/community_hands.webp"
              alt="Hands joining in a community moment"
              fill
              className="object-cover rounded-[20px]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-[14px] inset-y-[20px] rounded-[20px] border border-[#1f4d3a]" />
        </div>

        <div className="mx-auto flex w-full max-w-[282px] flex-col gap-6">
          <div className="zoom-item relative overflow-hidden rounded-[12px] bg-[#1f4d3a]">
            <div className="h-[110px] w-full sm:h-[127px]" />

            <div className="absolute inset-0 flex items-center gap-5 px-7">
              <span className="font-sans text-[42px] font-bold leading-none text-white sm:text-[50px]">
                25+
              </span>
              <span className="font-sans text-[17px] font-semibold leading-7 text-white">
                Upcoming
                <br />
                Events
              </span>
            </div>
          </div>
          <div className="image-topdown relative h-[360px] overflow-hidden rounded-[20px] sm:h-[464px]">
            <Image
              src="/event/community_gathering.webp"
              alt="People gathered outdoors"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="pt-2 lg:pl-4">
          <h2 className="font-serif max-w-[630px] text-[38px] leading-[1.08] text-[#16171a] md:text-[50px] fade-in">
            Celebrating Our Community
          </h2>
          <p className="mt-6 max-w-[630px] font-sans text-[16px] leading-8 text-black md:text-[16px] md:leading-[30px] fade-in">
            With new experiences, new faces, and a deeper look into what Zewadi
            stands for, we continue to grow together. Our community means
            everything to us, and it&apos;s at the heart of every decision we make.
            That&apos;s why we thoughtfully create moments, meaningful offers, and
            experiences that feel personal, genuine, and truly connected to your
            everyday life
          </p>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <Link
              href="/gallery"
              className="inline-flex h-[54px] w-fit items-center gap-2 sm:gap-3 rounded-full border border-[#1f4d3a] px-4 sm:px-6 font-sans text-[14px] font-semibold text-[#1f4d3a] transition hover:bg-[#1f4d3a] hover:text-white"
            >
              <span>Read More</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#1f4d3a] text-white">
                <Phone className="h-4 w-4" />
              </div>
              <div className="font-sans">
                <p className="text-[15px] text-[#1f4d3a]">Need help?</p>
                <p className="text-[18px] font-semibold text-[#1f4d3a]">
                  (808) 555-0111
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
