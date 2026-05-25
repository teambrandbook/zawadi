"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

export default function CommunitySection() {
  const { locale } = useLocale();
  const communityText = translations[locale]?.eventsPage?.community || translations.en.eventsPage.community;

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-0">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[160px_170px_minmax(0,1fr)] md:items-start md:gap-6 lg:grid-cols-[280px_282px_minmax(0,1fr)] lg:gap-10">
        <div className="image-topdown relative mx-auto w-full max-w-[267px] ">
          <div className="image-topdownrelative h-[320px] overflow-hidden rounded-[20px] sm:h-[357px] md:h-[250px] lg:h-[357px]">
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
            <div className="h-[110px] w-full sm:h-[127px] md:h-[86px] lg:h-[127px]" />

            <div className="absolute inset-0 flex items-center gap-5 px-7 md:gap-2 md:px-4 lg:gap-5 lg:px-7">
              <span className="font-sans text-[42px] font-bold leading-none text-white sm:text-[50px] md:text-[34px] lg:text-[50px]">
                25+
              </span>
              <span className="font-sans text-[17px] font-semibold leading-7 text-white md:text-[12px] md:leading-4 lg:text-[17px] lg:leading-7">
                <span dangerouslySetInnerHTML={{ __html: communityText.statLabelHTML }} />
              </span>
            </div>
          </div>
          <div className="image-topdown relative h-[360px] overflow-hidden rounded-[20px] sm:h-[464px] md:h-[300px] lg:h-[464px]">
            <Image
              src="/event/community_gathering.webp"
              alt="People gathered outdoors"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="pt-2 text-left rtl:text-right ltr:md:pl-4 rtl:md:pr-4">
          <h2 className="font-serif max-w-[630px] text-[38px] leading-[1.08] text-[#16171a] md:text-[36px] lg:text-[50px] fade-in">
            {communityText.title}
          </h2>
          <p className="mt-6 max-w-[630px] font-sans text-[16px] leading-8 text-black md:text-[14px] md:leading-7 lg:text-[16px] lg:leading-[30px] fade-in">
            {communityText.description}
          </p>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center">
            <Link
              href="/gallery"
              className="inline-flex h-[54px] w-fit items-center gap-2 sm:gap-3 rounded-full border border-[#1f4d3a] px-4 sm:px-6 font-sans text-[14px] font-semibold text-[#1f4d3a] transition hover:bg-[#1f4d3a] hover:text-white"
            >
              <span>{communityText.readMore}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <div className="flex items-center gap-4 rtl:flex-row-reverse">
              <div className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#1f4d3a] text-white">
                <Phone className="h-4 w-4" />
              </div>
              <div className="font-sans">
                <p className="text-[15px] text-[#1f4d3a]">{communityText.helpLabel}</p>
                <p className="text-[18px] font-semibold text-[#1f4d3a]">
                  {communityText.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
