"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, MoveRight, SendHorizontal } from "lucide-react";
import gsap from "@/lib/gsap";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";
import { sanitizeHTML } from "@/utils/sanitize";

import { ApproachIcon } from "../common/BrandIcons";
import ContentSection from "../common/ContentSection";
import EventTestimonials from "../events/EventTestimonials";

const introTallImage = "/about/intro-tall.webp";
const introTopImage = "/about/intro-top.webp";
const introBottomImage = "/about/intro-bottom.webp";
const storyLeftImage = "/about/story-left.webp";
const storyCenterImage = "/about/story-center.webp";
const storyRightImage = "/about/story-right.webp";
const approachImage = "/about/approach.webp";
const testimonialImage = "/about/testimonial.webp";

const storyImages = [storyLeftImage, storyCenterImage, storyRightImage];

const sectionTitleClass =
    "font-serif text-[1.8rem] leading-tight text-[#034833] sm:text-[2.5rem]";

const mobileStoryPositions = [
    { x: -110, width: 160, height: 220, zIndex: 10, opacity: 0.6 },
    { x: 0, width: 280, height: 260, zIndex: 20, opacity: 1 },
    { x: 110, width: 160, height: 220, zIndex: 10, opacity: 0.6 },
];

const desktopStoryPositions = [
    { x: -280, width: 220, height: 280, zIndex: 10, opacity: 0.6 },
    { x: 0, width: 440, height: 340, zIndex: 20, opacity: 1 },
    { x: 280, width: 220, height: 280, zIndex: 10, opacity: 0.6 },
];

const aboutImageUrls = [
    introTallImage,
    introTopImage,
    introBottomImage,
    storyLeftImage,
    storyCenterImage,
    storyRightImage,
    approachImage,
    testimonialImage,
];

export default function About() {
    const { locale } = useLocale();
    const aboutData = translations[locale]?.aboutPage || translations.en.aboutPage;
    const introCards = aboutData.introCards;
    const approachSteps = aboutData.approachSteps;
    const storySlides = aboutData.storySlides.map((slide, index) => ({
        ...slide,
        image: storyImages[index],
    }));
    const containerRef = useRef<HTMLDivElement>(null);
    const storyItemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const storyTextRef = useRef<HTMLParagraphElement>(null);
    const [rotation, setRotation] = useState(0);
    const [isMobileStoryLayout, setIsMobileStoryLayout] = useState(false);
    const touchStartX = useRef(0);
    const storyImageCount = 3;

    const normalizeRotation = (value: number) =>
        ((value % storyImageCount) + storyImageCount) % storyImageCount;

    const getStoryPositions = () =>
        isMobileStoryLayout ? mobileStoryPositions : desktopStoryPositions;

    const getStoryPositionForIndex = (index: number) => {
        const logicalIndex =
            (index - normalizeRotation(rotation) + storyImageCount) % storyImageCount;

        return getStoryPositions()[logicalIndex];
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const isAnimating = useRef(false);

    const handleNext = () => {
        if (isAnimating.current) return;
        setRotation(r => r + 1);
    };

    const handlePrev = () => {
        if (isAnimating.current) return;
        setRotation(r => r - 1);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX.current - touchEndX > 50) handleNext();
        if (touchEndX - touchStartX.current > 50) handlePrev();
    };

    const wheelAccumulator = useRef(0);
    const lastWheelTime = useRef(0);

    const handleWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        if (now - lastWheelTime.current > 500) {
            wheelAccumulator.current = 0;
        }
        lastWheelTime.current = now;

        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
            wheelAccumulator.current = 0;
            return;
        }

        wheelAccumulator.current += e.deltaX;
        if (wheelAccumulator.current > 60) {
            handleNext();
            wheelAccumulator.current = 0;
        } else if (wheelAccumulator.current < -60) {
            handlePrev();
            wheelAccumulator.current = 0;
        }
    };

    useLayoutEffect(() => {
        const initialPositions = getStoryPositions();
        storyItemsRef.current.forEach(item => {
            if (item) gsap.set(item, { xPercent: -50, yPercent: -50 });
        });

        storyItemsRef.current.forEach((item, index) => {
            if (!item) return;
            const logicalIndex = index % storyImageCount;
            const pos = initialPositions[logicalIndex];

            gsap.set(item, {
                x: pos.x,
                width: pos.width,
                height: pos.height,
                zIndex: pos.zIndex,
                opacity: pos.opacity,
            });
        });
    }, []);

    useEffect(() => {
        const warmImages = () => {
            aboutImageUrls.forEach((src) => {
                const img = new window.Image();
                img.decoding = "async";
                img.src = src;
                img.decode?.().catch(() => undefined);
            });
        };

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(warmImages, { timeout: 1500 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(warmImages, 300);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const syncStoryLayout = () => {
            setIsMobileStoryLayout(window.innerWidth < 768);
        };

        syncStoryLayout();
        window.addEventListener("resize", syncStoryLayout);

        return () => window.removeEventListener("resize", syncStoryLayout);
    }, []);

    const isInitialMount = useRef(true);
    const activeStoryIndex = normalizeRotation(rotation);

    useLayoutEffect(() => {
        const normalizedRotation = normalizeRotation(rotation);
        const positions = getStoryPositions();

        isAnimating.current = true;
        let completed = 0;
        const duration = isInitialMount.current ? 0 : 0.6;

        storyItemsRef.current.forEach((item, index) => {
            if (!item) return;
            const logicalIndex =
                (index - normalizedRotation + storyImageCount) % storyImageCount;
            const pos = positions[logicalIndex];

            const animationProps = {
                x: pos.x,
                width: pos.width,
                height: pos.height,
                zIndex: pos.zIndex,
                opacity: pos.opacity,
            };

            if (duration === 0) {
                gsap.set(item, animationProps);
                completed++;
                if (completed === storyImageCount) {
                    isAnimating.current = false;
                    isInitialMount.current = false;
                }
                return;
            }

            gsap.killTweensOf(item);
            gsap.to(item, {
                ...animationProps,
                duration,
                ease: "power2.inOut",
                snap: "zIndex",
                overwrite: "auto",
                onComplete: () => {
                    completed++;
                    if (completed === storyImageCount) {
                        isAnimating.current = false;
                    }
                }
            });
        });
    }, [isMobileStoryLayout, rotation]);

    useLayoutEffect(() => {
        if (!storyTextRef.current) return;

        gsap.fromTo(
            storyTextRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 1.30, ease: "power2.out", overwrite: "auto" }
        );
    }, [activeStoryIndex]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".intro-images-grid",
                    start: "top 75%",
                }
            });

            tl.fromTo(".intro-tall-wrapper",
                { clipPath: "inset(0% 0% 100% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power3.inOut" }
            )
                .fromTo(".intro-top-wrapper",
                    { clipPath: "inset(0% 0% 100% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" },
                    "-=0.82"
                )
                .fromTo(".intro-bottom-wrapper",
                    { clipPath: "inset(0% 0% 100% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.inOut" },
                    "-=0.82"
                )
                .fromTo(".intro-health-card",
                    { scale: 0.8, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
                    "-=0.3"
                )
                .fromTo(".intro-text-heading",
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.82, ease: "power3.out" },
                    "-=1.0"
                )
                .fromTo(".intro-text-card",
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.68, stagger: 0.12, ease: "power2.out" },
                    "-=0.62"
                );

            gsap.fromTo(".approach-image-wrapper",
                { clipPath: "inset(0% 0% 100% 0%)" },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.4,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: ".approach-image-wrapper",
                        start: "top 80%",
                    }
                }
            );

            gsap.fromTo(".approach-step-card",
                { clipPath: "inset(0% 100% 0% 0%)" },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.176,
                    stagger: 0.196,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".approach-steps-container",
                        start: "top 75%",
                    }
                }
            );

            const testimonialTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".testimonial-section",
                    start: "top 68%",
                    once: true,
                }
            });

            testimonialTl.fromTo(".testimonial-heading",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }
            )
                .fromTo([".testimonial-card", ".testimonial-image"],
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power2.out" },
                    "-=0.5"
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);


    return (
        <div className="bg-[#fffef5] text-[#121414]" ref={containerRef}>
            <ContentSection title={aboutData.heroTitle} subtitle={aboutData.heroSubtitle} />

            <section className="pt-20 pb-32 sm:pt-28 sm:pb-40 lg:pt-40 lg:pb-56">
                <div className="container mx-auto px-4 sm:px-6 max-w-[1150px]">
                    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-16">
                        <div className="intro-images-grid mx-auto grid w-full max-w-[480px] grid-cols-2 gap-4 sm:gap-5 items-start lg:items-stretch lg:h-full lg:min-h-[580px] lg:grid-cols-[1.05fr_0.95fr] ltr:lg:translate-x-4 ltr:xl:translate-x-8 rtl:lg:-translate-x-4 rtl:xl:-translate-x-8">
                            <div className="flex flex-col gap-4 sm:gap-5 h-full">
                                <div className="intro-tall-wrapper flex-1 overflow-hidden rounded-[20px] min-h-0 [will-change:clip-path]">
                                    <img
                                        src={introTallImage}
                                        alt="Fresh salad bowl"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover -scale-x-100"
                                    />
                                </div>
                                <div className="intro-health-card shrink-0 rounded-[20px] border border-[#1A4331] bg-white px-4 py-4 shadow-[0_10px_26px_rgba(0,0,0,0.05)] sm:px-5 sm:py-5">
                                    <div className="flex items-center gap-2 text-left rtl:text-right sm:gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A4331] text-white sm:h-12 sm:w-12">
                                            <Leaf size={18} className="sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold leading-tight text-[#034833] sm:text-[16px] sm:leading-5">
                                                {aboutData.introBadgeTitle}
                                            </p>
                                            <p
                                                className="text-[10px] leading-3 text-[#727272] sm:text-[13px] sm:leading-5"
                                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(aboutData.introBadgeSubtitleHTML) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:gap-4 h-full lg:gap-5">
                                <div className="intro-top-wrapper shrink-0 overflow-hidden rounded-[20px] [will-change:clip-path]">
                                    <img
                                        src={introTopImage}
                                        alt="Hands preparing vegetables"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-[120px] w-full object-cover sm:h-[140px] lg:h-[160px] xl:h-[180px]"
                                    />
                                </div>
                                <div className="intro-bottom-wrapper flex-1 overflow-hidden rounded-[20px] min-h-0 [will-change:clip-path]">
                                    <img
                                        src={introBottomImage}
                                        alt="Hands holding a seedling"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 text-left rtl:text-right sm:pt-12 lg:self-stretch ltr:lg:pl-4 ltr:xl:pl-6 rtl:lg:pr-4 rtl:xl:pr-6 lg:pt-0">
                            <div className="flex h-full flex-col lg:justify-between">
                                <h2
                                    className="intro-text-heading font-serif font-bold text-[1.6rem] leading-[1.25] sm:text-[2rem] lg:text-[2.4rem] xl:text-[2.6rem] text-[#034833] tracking-normal"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(aboutData.introTitleHTML) }}
                                />

                                <div className="mt-8 flex flex-col gap-4 sm:gap-5">
                                    {introCards.map((card) => (
                                        <article
                                            key={card.title}
                                            className="intro-text-card rounded-[18px] border border-[#e3dbd8] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] sm:px-6 sm:py-6 lg:px-7 lg:py-7"
                                        >
                                            <h3 className="text-[1.05rem] font-bold leading-tight text-[#1A4331] sm:text-[1.15rem] lg:text-[1.25rem]">
                                                {card.title}
                                            </h3>
                                            <p className="mt-3 text-[14px] font-medium leading-[1.7] text-black/70 sm:text-[14.5px] lg:text-[15px]">
                                                {card.body}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#1f4d3a] py-12 text-white sm:py-16">
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "url('/Patterns-03.webp')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <div className="relative z-10 container mx-auto px-4 text-center sm:px-6">
                    <h2 className="mx-auto max-w-[16ch] font-serif text-[1.8rem] leading-tight sm:text-[2.75rem] sm:leading-[1.15]">
                        {aboutData.storyTitle}
                    </h2>

                    <div className="relative mx-auto mt-8 flex w-full max-w-[1020px] items-center justify-between sm:mt-10">
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label={aboutData.previousSlideLabel}
                            className="story-mobile-arrow hidden md:flex z-30 h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-[#b47800] hover:border-[#b47800] active:bg-[#b47800] active:border-[#b47800]"
                        >
                            <ArrowRight size={20} className="ltr:rotate-180" />
                        </button>

                        <div
                            className="relative h-[280px] w-full max-w-[820px] sm:h-[300px] md:h-[380px]"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onWheel={handleWheel}
                        >
                            {storySlides.map((img, i) => {
                                return (
                                    <div
                                        key={i}
                                        ref={el => { storyItemsRef.current[i] = el; }}
                                        className="absolute top-1/2 left-1/2 overflow-hidden rounded-[20px] cursor-pointer [will-change:transform,width,height,opacity]"
                                        onClick={() => {
                                            if (isAnimating.current) return;
                                            const pos =
                                                (i - normalizeRotation(rotation) + storyImageCount) %
                                                storyImageCount;
                                            if (pos === 0) handlePrev();
                                            if (pos === 2) handleNext();
                                        }}
                                    >
                                        <img src={img.image} alt={img.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label={aboutData.nextSlideLabel}
                            className="story-mobile-arrow hidden md:flex z-30 h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-[#b47800] hover:border-[#b47800] active:bg-[#b47800] active:border-[#b47800]"
                        >
                            <ArrowRight size={20} className="rtl:rotate-180" />
                        </button>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-4 md:hidden">
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label={aboutData.previousSlideLabel}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-transparent text-white transition-colors hover:border-[#b47800] hover:bg-[#b47800] active:border-[#b47800] active:bg-[#b47800]"
                        >
                            <ArrowRight size={20} className="ltr:rotate-180" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label={aboutData.nextSlideLabel}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-transparent text-white transition-colors hover:border-[#b47800] hover:bg-[#b47800] active:border-[#b47800] active:bg-[#b47800]"
                        >
                            <ArrowRight size={20} className="rtl:rotate-180" />
                        </button>
                    </div>

                    <p
                        ref={storyTextRef}
                        className="mx-auto mt-8 max-w-[840px] text-sm font-semibold leading-6 text-[#cecece] sm:text-[1.15rem] sm:leading-8"
                    >
                        {storySlides[activeStoryIndex].body}
                    </p>
                </div>
            </section>

            <section className="pt-16 pb-10 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:max-w-[1120px] ltr:lg:pl-16 ltr:lg:pr-6 ltr:xl:pl-20 rtl:lg:pr-16 rtl:lg:pl-6 rtl:xl:pr-20">
                    <h2 className={`${sectionTitleClass} text-left rtl:text-right`}>{aboutData.approachTitle}</h2>

                    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,500px)_minmax(0,440px)] lg:items-start lg:justify-between lg:gap-8 xl:gap-10">
                        <div>
                            <div className="approach-image-wrapper overflow-hidden rounded-[16px] max-w-[500px] mx-auto lg:mx-0 [will-change:clip-path]">
                                <img
                                    src={approachImage}
                                    alt="Woman cooking in a bright kitchen"
                                    loading="lazy"
                                    decoding="async"
                                    className="h-[300px] w-full object-cover sm:h-[360px]"
                                />
                            </div>
                            <p className="mt-4 max-w-[620px] text-left text-sm leading-[1.625rem] text-black rtl:text-right">
                                {aboutData.approachDescription}
                            </p>
                        </div>

                        <div className="approach-steps-container max-w-[440px] space-y-4 lg:w-full lg:justify-self-start">
                            {approachSteps.map((step) => {
                                return (
                                    <div
                                        key={step.number}
                                        className="group approach-step-card flex cursor-pointer items-center justify-between rounded-r-[999px] border-2 border-black/10 bg-white px-5 py-3 text-[#121414] transition-all hover:border-[#b47800] hover:bg-[#b47800] hover:text-white active:border-[#b47800] active:bg-[#b47800] active:text-white rtl:flex-row-reverse rtl:rounded-l-[999px] rtl:rounded-r-none sm:px-6 sm:py-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-4 rtl:flex-row-reverse">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#121414] transition-colors group-hover:text-white group-active:text-white">
                                                <ApproachIcon size={24} />
                                            </div>
                                            <p className="min-w-0 font-serif text-base leading-tight sm:text-[1.1rem]">
                                                {step.label}
                                            </p>
                                        </div>
                                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1f4d3a] text-sm font-bold text-white transition-colors group-hover:bg-white group-hover:text-[#1f4d3a] group-active:bg-white group-active:text-[#1f4d3a] sm:h-10 sm:w-10 sm:text-lg">
                                            <div
                                                className="pointer-events-none absolute inset-0 opacity-10 group-hover:hidden group-active:hidden"
                                                style={{
                                                    backgroundImage: "url('/Patterns-03.webp')",
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            />
                                            <span className="relative z-10">{step.number}</span>
                                        </div>
                                    </div>
                                );
                            })}

                            <Link
                                href="/community"
                                className="group relative inline-flex max-w-[calc(100%-24px)] items-center rounded-full bg-[#1f4d3a] py-0 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#1a4331] ltr:pl-7 ltr:pr-0 rtl:pl-0 rtl:pr-7 sm:text-[13px] sm:tracking-[0.15em] sm:ltr:pl-9 sm:rtl:pr-9"
                            >
                                <div className="absolute inset-0 overflow-hidden rounded-full">
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-10 group-hover:hidden"
                                        style={{
                                            backgroundImage: "url('/Patterns-03.webp')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                </div>
                                <span className="relative z-10 py-4">{aboutData.learnMore}</span>
                                <span className="relative z-10 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#1f4d3a] text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] ltr:-right-6 rtl:-left-6">
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-10 group-hover:hidden"
                                        style={{
                                            backgroundImage: "url('/Patterns-03.webp')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                    <MoveRight size={22} className="relative z-10 rtl:rotate-180" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <EventTestimonials variant="about" />
        </div>
    );
}
