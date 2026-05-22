"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap, { animatePopUp, animateFadeInLeft, animateSwipeReveal, animateCounter } from "@/lib/gsap";
import { Leaf, ArrowRight } from "lucide-react";
import communityData from "@/data/community.json";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { API_BASE_URL } from "@/lib/config";

type StatItem = {
  value: number | string;
  label: string;
};

export type PublicStats = {
  community_members: number;
  events_hosted: number;
  consultants: number;
  healthy_products: number;
};

const loadingStatValue = "...";
const publicStatsCacheKey = "zewadi-community-public-stats";

const readCachedPublicStats = () => {
  if (typeof window === "undefined") return null;

  try {
    const cachedStats = window.localStorage.getItem(publicStatsCacheKey);
    if (!cachedStats) return null;

    const data = JSON.parse(cachedStats) as Partial<PublicStats>;

    return {
      community_members: Number(data.community_members ?? 0),
      events_hosted: Number(data.events_hosted ?? 0),
      consultants: Number(data.consultants ?? 0),
      healthy_products: Number(data.healthy_products ?? 0),
    };
  } catch {
    return null;
  }
};

type CommunityStatsProps = {
  initialStats?: PublicStats | null;
};

const CommunityStats = ({ initialStats = null }: CommunityStatsProps) => {
  const { locale } = useLocale();
  const isRtl = locale === "ar";
  const [publicStats, setPublicStats] = useState<PublicStats | null>(() => initialStats ?? readCachedPublicStats());
  const sectionRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRevealRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { statsSection: staticStatsSection } = communityData as { statsSection: { largeImage: string; card: { title: string; description: string; ctaText: string; image: string }; stats: StatItem[] } };
  const localizedStatsSection = translations[locale]?.communityPage?.statsSection || translations.en.communityPage.statsSection;
  const backendStatValues = publicStats
    ? [
      publicStats.community_members,
      publicStats.events_hosted,
      publicStats.consultants,
      publicStats.healthy_products,
    ]
    : [loadingStatValue, loadingStatValue, loadingStatValue, loadingStatValue];

  const statsSection = useMemo(() => ({
    ...staticStatsSection,
    card: {
      ...staticStatsSection.card,
      ...localizedStatsSection.card,
    },
    stats: staticStatsSection.stats.map((stat, index) => ({
      ...stat,
      value: backendStatValues[index] ?? 0,
      label: localizedStatsSection.stats[index]?.label || stat.label,
    })),
  }), [backendStatValues, localizedStatsSection.card, localizedStatsSection.stats, staticStatsSection]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPublicStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/community/public-stats/`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = await response.json();
        const nextStats = {
          community_members: Number(data.community_members ?? 0),
          events_hosted: Number(data.events_hosted ?? 0),
          consultants: Number(data.consultants ?? 0),
          healthy_products: Number(data.healthy_products ?? 0),
        };

        setPublicStats(nextStats);
        window.localStorage.setItem(publicStatsCacheKey, JSON.stringify(nextStats));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    fetchPublicStats();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
        },
      });

      // 1. Large Image Pure Swipe (Up to Down)
      tl.fromTo("#large-img",
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.inOut", clearProps: "all" }
      );

      // 2. Entire Promo Box Pure Swipe Entrance
      tl.fromTo("#promo-box",
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.inOut", clearProps: "all" },
        "-=0.8" // Start wiping out while image finishes
      );

      // 3. Stats Counter Effect
      const statItems = gsap.utils.toArray<HTMLElement>(".stat-value");
      // Create a timeline label so all counters fire simultaneously
      tl.addLabel("startCounters", "-=1.2");
      statItems.forEach((stat) => {
        const targetValueStr = stat.getAttribute("data-target") || "0";
        if (targetValueStr === loadingStatValue) return;
        animateCounter(targetValueStr, (val) => { stat.innerText = val; }, {}, tl, "startCounters");
      });

    }, sectionRef);
    return () => ctx.revert();
  }, [isRtl, publicStats]);

  return (
    <section ref={sectionRef} className="py-24 bg-[#fffef5] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left: Large Image */}
          <div className="lg:col-span-5 relative group" id="large-img">
            <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(26,67,49,0.2)]">
              <Image
                src={statsSection.largeImage}
                alt="Community Activity"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* Top Card: Community Promo */}
            <div id="promo-box" className="bg-white rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 flex flex-col md:flex-row rtl:md:flex-row-reverse h-full relative z-10 transition-shadow hover:shadow-[0_25px_65px_rgba(0,0,0,0.2)]">
              <div className="p-8 md:p-12 flex-1 flex flex-col justify-center text-left rtl:text-right" ref={textRef}>
                <div
                  ref={iconRef}
                  className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center text-brand-primary mb-6 shadow-md"
                >
                  <Leaf size={28} />
                </div>
                <h3 className="text-animate-left text-3xl font-playfair font-bold text-brand-green mb-4">
                  {statsSection.card.title}
                </h3>
                <p className="text-animate-left text-gray-600 mb-8 leading-relaxed font-inter">
                  {statsSection.card.description}
                </p>
                <div className="text-animate-left">
                  <Link href="/login">
                    <button className="border border-brand-green/20 text-brand-green font-bold px-8 py-3 rounded-full hover:bg-brand-green hover:text-white transition-all duration-300 flex items-center gap-2 w-fit group">
                      {statsSection.card.ctaText}
                      <ArrowRight size={18} className="transition-transform ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
              <div
                ref={imageRevealRef}
                className="relative w-full md:w-[280px] h-[300px] md:h-auto overflow-hidden"
              >
                <Image
                  src={statsSection.card.image}
                  alt="Outdoor Activity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Bottom: Stats Bar */}
            <div className="bg-brand-green rounded-[2.5rem] p-8 md:p-12 shadow-[0_25px_50px_rgba(26,67,49,0.3)] relative z-10 hover:shadow-[0_30px_60px_rgba(26,67,49,0.4)] transition-shadow" ref={statsRef}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {(statsSection.stats as StatItem[]).map((stat, index) => (
                  <div key={index} className="text-center md:text-left rtl:md:text-right">
                    <div
                      className="stat-value text-3xl md:text-4xl font-bold text-white mb-2"
                      data-target={stat.value}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-white font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityStats;
