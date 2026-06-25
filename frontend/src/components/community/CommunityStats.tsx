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

      // 1. Large image entrance without clipping the rounded corners.
      tl.fromTo("#large-img",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out", clearProps: "transform,visibility" }
      );

      // 2. Promo box entrance without clipping the rounded corners.
      tl.fromTo("#promo-box",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out", clearProps: "transform,visibility" },
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
        <div className="grid grid-cols-1 [@media_(min-width:640px)]:grid-cols-12 gap-8 items-stretch">

          {/* Left: Large Image */}
          <div className="[@media_(min-width:640px)]:col-span-5 relative group [@media_(min-width:640px)]:h-full opacity-0" id="large-img">
            <div className="relative aspect-[4/5] [@media_(min-width:640px)]:aspect-auto [@media_(min-width:640px)]:h-full rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(26,67,49,0.2)]">
              <Image
                src={statsSection.largeImage}
                alt="Community Activity"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="[@media_(min-width:640px)]:col-span-7 flex flex-col gap-8 [@media_(min-width:640px)]:h-full [@media_(min-width:640px)]:justify-between">

            {/* Top Card: Community Promo */}
            <div id="promo-box" className="bg-white rounded-[1.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 flex flex-col [@media_(min-width:640px)]:flex-row rtl:[@media_(min-width:640px)]:flex-row-reverse relative z-10 opacity-0 transition-shadow hover:shadow-[0_25px_65px_rgba(0,0,0,0.2)]">
              <div className="p-6 md:p-7 lg:p-9 [@media_(min-width:640px)_and_(max-width:1366px)]:!p-5 flex-1 flex flex-col justify-center text-left rtl:text-right" ref={textRef}>
                <div
                  ref={iconRef}
                  className="w-12 h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 [@media_(min-width:640px)_and_(max-width:1366px)]:!w-10 [@media_(min-width:640px)_and_(max-width:1366px)]:!h-10 bg-brand-green rounded-full flex items-center justify-center text-brand-primary mb-4 lg:mb-5 [@media_(min-width:640px)_and_(max-width:1366px)]:!mb-3 shadow-md"
                >
                  <Leaf size={28} className="[@media_(min-width:640px)_and_(max-width:1366px)]:!h-5 [@media_(min-width:640px)_and_(max-width:1366px)]:!w-5" />
                </div>
                <h3 className="text-animate-left text-3xl md:text-2xl lg:text-3xl [@media_(min-width:640px)_and_(max-width:1366px)]:!text-[1.35rem] font-playfair font-bold text-brand-green mb-3 lg:mb-4 [@media_(min-width:640px)_and_(max-width:1366px)]:!mb-2">
                  {statsSection.card.title}
                </h3>
                <p className="text-animate-left text-gray-600 mb-5 lg:mb-6 [@media_(min-width:640px)_and_(max-width:1366px)]:!mb-4 text-sm lg:text-base [@media_(min-width:640px)_and_(max-width:1366px)]:!text-[13px] [@media_(min-width:640px)_and_(max-width:1366px)]:!leading-[1.5] leading-relaxed font-inter">
                  {statsSection.card.description}
                </p>
                <div className="text-animate-left">
                  <Link href="/login">
                    <button className="border border-brand-green/20 text-brand-green font-bold px-7 py-2.5 lg:px-8 lg:py-3 [@media_(min-width:640px)_and_(max-width:1366px)]:!px-6 [@media_(min-width:640px)_and_(max-width:1366px)]:!py-2 rounded-full hover:bg-brand-green hover:text-white transition-all duration-300 flex items-center gap-2 w-fit group">
                      {statsSection.card.ctaText}
                      <ArrowRight size={18} className="transition-transform ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
              <div
                ref={imageRevealRef}
                className="relative w-full [@media_(min-width:640px)]:w-[42%] lg:w-[280px] h-[300px] [@media_(min-width:640px)]:h-auto overflow-hidden rounded-b-[1.5rem] [@media_(min-width:640px)]:rounded-b-none [@media_(min-width:640px)]:rounded-r-[1.5rem] rtl:[@media_(min-width:640px)]:rounded-l-[1.5rem] rtl:[@media_(min-width:640px)]:rounded-r-none"
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
            <div className="bg-brand-green rounded-[2.5rem] p-8 md:p-12 [@media_(min-width:640px)_and_(max-width:900px)]:!p-5 [@media_(min-width:901px)_and_(max-width:1366px)]:!p-8 shadow-[0_25px_50px_rgba(26,67,49,0.3)] relative z-10 hover:shadow-[0_30px_60px_rgba(26,67,49,0.4)] transition-shadow" ref={statsRef}>
              <div className="grid grid-cols-2 [@media_(min-width:640px)]:grid-cols-4 gap-8 [@media_(min-width:640px)_and_(max-width:900px)]:!gap-3 [@media_(min-width:901px)_and_(max-width:1366px)]:!gap-6">
                {(statsSection.stats as StatItem[]).map((stat, index) => (
                  <div key={index} className="text-center [@media_(min-width:640px)]:text-left rtl:[@media_(min-width:640px)]:text-right">
                    <div
                      className="stat-value text-3xl md:text-4xl [@media_(min-width:640px)_and_(max-width:900px)]:!text-xl [@media_(min-width:901px)_and_(max-width:1366px)]:!text-2xl font-bold text-white mb-2"
                      data-target={stat.value}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm [@media_(min-width:640px)_and_(max-width:900px)]:!text-[9px] [@media_(min-width:901px)_and_(max-width:1366px)]:!text-[11px] text-white font-medium uppercase tracking-wider [@media_(min-width:640px)_and_(max-width:900px)]:!tracking-[0.02em] leading-tight">
                      {String(stat.label).split(" ").map((word, wordIndex) => (
                          <span key={`${index}-${wordIndex}`} className="block">{word}</span>
                        ))}
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

