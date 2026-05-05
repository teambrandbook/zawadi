"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, MoveRight, SendHorizontal } from "lucide-react";
import gsap from "@/lib/gsap";

import { StarIcon, ApproachIcon } from "../common/BrandIcons";
import ContentSection from "../common/ContentSection";

const introTallImage = "/about/intro-tall.webp";
const introTopImage = "/about/intro-top.webp";
const introBottomImage = "/about/intro-bottom.webp";
const storyLeftImage = "/about/story-left.webp";
const storyCenterImage = "/about/story-center.webp";
const storyRightImage = "/about/story-right.webp";
const approachImage = "/about/approach.webp";
const testimonialImage = "/about/testimonial.webp";

const introCards = [
    {
        title: "Quality food, made to fit your life.",
        body: "Zewadi is a premium food brand, but there's a lot more behind the name. It started with one simple idea: make everyday food easier, better, and more meaningful. Every product is made with real care. We focus on quality, on balance, and on how our food actually fits into your life. Food shouldn't be complicated. It should just feel right.",
    },
    {
        title: "Clean ingredients. Thoughtful nutrition.",
        body: "Zewadi is a premium food brand developed to redefine the way we experience everyday nutrition. Rooted in quality, intention, and simplicity, we create products that bring together clean ingredients and refined taste.",
    },
];

const approachSteps = [
    { label: "Thoughtfully Crafted", number: "1", active: false },
    { label: "Inspired by Living Well", number: "2", active: true },
    { label: "Made to Share", number: "3", active: false },
    { label: "Driven by Purpose", number: "4", active: false },
];

const storySlides = [
    {
        image: storyLeftImage,
        alt: "Fresh berries",
        body: "Zewadi was created to make everyday food choices feel more thoughtful and intentional. It is about bringing together wellness, quality, and simple moments that add value to daily life. With every product, we focus on creating balance, comfort, and a better way of living.",
    },
    {
        image: storyCenterImage,
        alt: "People gathering",
        body: "The story behind Zewadi is rooted in turning ordinary routines into something more meaningful. We believe good food should feel easy, nourishing, and naturally connected to the way you live each day.",
    },
    {
        image: storyRightImage,
        alt: "Packaged ingredients",
        body: "Every Zewadi product is shaped with care so healthy choices feel simpler, warmer, and more enjoyable. It is a blend of thoughtful ingredients, modern living, and everyday experiences that feel genuinely good.",
    },
];

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

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const storyItemsRef = useRef<(HTMLDivElement | null)[]>([]);
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
        <div className="bg-white text-[#121414]" ref={containerRef}>
            <ContentSection title="About Zewadi" subtitle="What is Zewadi" />

            <section className="pt-20 pb-32 sm:pt-28 sm:pb-40 lg:pt-40 lg:pb-56">
                <div className="container mx-auto px-4 sm:px-6 max-w-[1150px]">
                    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-20">
                        <div className="intro-images-grid mx-auto grid w-full max-w-[480px] grid-cols-2 gap-4 sm:gap-5 items-start lg:items-stretch lg:h-full lg:grid-cols-[1.05fr_0.95fr] lg:translate-x-16 xl:translate-x-24">
                            <div className="space-y-4 sm:space-y-4 lg:flex lg:h-full lg:min-h-[476px] lg:flex-col lg:justify-between lg:space-y-0">
                                <div className="intro-tall-wrapper overflow-hidden rounded-[20px]">
                                    <img
                                        src={introTallImage}
                                        alt="Fresh salad bowl"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[390px] -scale-x-100"
                                    />
                                </div>
                                <div className="intro-health-card rounded-[20px] border-2 border-[#1A4331] bg-white px-4 py-4 shadow-[0_10px_26px_rgba(0,0,0,0.05)] sm:px-5 sm:py-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f5eb] text-[#034833] sm:h-10 sm:w-10">
                                            <Leaf size={16} className="sm:w-4 sm:h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold leading-tight text-[#034833] sm:text-[15px] sm:leading-5">
                                                Natural Health
                                            </p>
                                            <p className="text-[10px] leading-3 text-[#727272] sm:text-[12px] sm:leading-4">
                                                Wellness Made<br />Simple
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-0 sm:space-y-4 lg:flex lg:h-full lg:min-h-[476px] lg:flex-col lg:justify-between lg:space-y-0">
                                <div className="intro-top-wrapper overflow-hidden rounded-[20px]">
                                    <img
                                        src={introTopImage}
                                        alt="Hands preparing vegetables"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-[100px] w-full object-cover sm:h-[120px]"
                                    />
                                </div>
                                <div className="intro-bottom-wrapper overflow-hidden rounded-[20px]">
                                    <img
                                        src={introBottomImage}
                                        alt="Hands holding a seedling"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[370px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="self-start pt-10 sm:pt-12 lg:self-stretch lg:pl-4 lg:pt-24 xl:pl-6 xl:pt-28">
                            <div className="flex h-full flex-col lg:min-h-[476px] lg:justify-between">
                            <h2 className="intro-text-heading max-w-[16ch] font-serif font-bold text-[1.3rem] leading-[1.3] sm:text-[1.8rem] sm:leading-[1.2] text-[#034833] tracking-normal">
                                Food That Feels Right,<br />
                                Every Day<br />
                                Thoughtfully Crafted for You.
                            </h2>

                            <div className="mt-6 space-y-4">
                                {introCards.map((card) => (
                                    <article
                                        key={card.title}
                                        className="intro-text-card rounded-[18px] border border-[#e3dbd8] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] sm:px-6 sm:py-4"
                                    >
                                        <h3 className="text-[1rem] font-semibold leading-tight text-[#034833] sm:text-[1.05rem]">
                                            {card.title}
                                        </h3>
                                        <p className="mt-2 text-[14px] leading-relaxed text-black/80 sm:text-[14.5px]">
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

            <section className="relative bg-[#1f4d3a] py-12 text-white sm:py-16">
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
                        The story behind the flavors
                    </h2>

                    <div className="relative mx-auto mt-10 flex w-full max-w-[1020px] items-center justify-between">
                        <button 
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous slide"
                            className="hidden md:flex z-30 h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-[#b47800] hover:border-[#b47800] active:bg-[#b47800] active:border-[#b47800]"
                        >
                            <ArrowRight size={20} className="rotate-180" />
                        </button>

                        <div 
                            className="relative h-[300px] w-full max-w-[820px] md:h-[380px]"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onWheel={handleWheel}
                        >
                            {storySlides.map((img, i) => {
                                return (
                                <div
                                    key={i}
                                    ref={el => { storyItemsRef.current[i] = el; }}
                                    className="absolute top-1/2 left-1/2 overflow-hidden rounded-[20px] cursor-pointer"
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
                            aria-label="Next slide"
                            className="hidden md:flex z-30 h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-transparent text-white transition-colors hover:bg-[#b47800] hover:border-[#b47800] active:bg-[#b47800] active:border-[#b47800]"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <p className="mx-auto mt-8 max-w-[840px] text-sm font-semibold leading-6 text-[#cecece] sm:text-[1.15rem] sm:leading-8">
                        {storySlides[activeStoryIndex].body}
                    </p>
                </div>
            </section>

            <section className="pb-10 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:pl-32 lg:pr-6 xl:pl-48">
                    <h2 className={sectionTitleClass}>Our Approach</h2>

                    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                        <div>
                            <div className="approach-image-wrapper overflow-hidden rounded-[16px] max-w-[500px] mx-auto lg:mx-0">
                                <img
                                    src={approachImage}
                                    alt="Woman cooking in a bright kitchen"
                                    loading="lazy"
                                    decoding="async"
                                    className="h-[300px] w-full object-cover sm:h-[360px]"
                                />
                            </div>
                            <p className="mt-4 max-w-[620px] text-sm leading-[1.625rem] text-black">
                                We sweat the details so you can enjoy food made for real
                                everyday life, always better when shared, with purpose behind
                                every decision.
                            </p>
                        </div>

                        <div className="approach-steps-container space-y-4 max-w-[440px]">
                            {approachSteps.map((step) => (
                                <div
                                    key={step.number}
                                    className="group approach-step-card cursor-pointer flex items-center justify-between rounded-r-[999px] border-2 px-6 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.04)] transition-all sm:px-7 sm:py-4 border-black/10 bg-white text-[#121414] hover:border-[#b47800] hover:bg-[#b47800] hover:text-white"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center text-[#1f4d3a] transition-colors group-hover:text-white">
                                            <ApproachIcon size={24} />
                                        </div>
                                        <p className="font-serif text-lg leading-tight sm:text-[1.25rem]">
                                            {step.label}
                                        </p>
                                    </div>
                                    <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#1f4d3a] text-sm font-bold text-white transition-colors group-hover:bg-white group-hover:text-[#1f4d3a] sm:h-10 sm:w-10 sm:text-lg">
                                        <div
                                            className="pointer-events-none absolute inset-0 opacity-10 group-hover:hidden"
                                            style={{
                                                backgroundImage: "url('/Patterns-03.webp')",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        />
                                        <span className="relative z-10">{step.number}</span>
                                    </div>
                                </div>
                            ))}

                            <Link
                                href="/community"
                                className="group relative inline-flex items-center overflow-hidden rounded-full bg-[#1f4d3a] pl-9 pr-0 py-0 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#1a4331]"
                            >
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-10 group-hover:hidden"
                                    style={{
                                        backgroundImage: "url('/Patterns-03.webp')",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                <span className="relative z-10 py-4">Learn More</span>
                                <span className="relative -right-6 z-10 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#1f4d3a] text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-10 group-hover:hidden"
                                        style={{
                                            backgroundImage: "url('/Patterns-03.webp')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                    <MoveRight size={22} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonial-section pb-12 pt-12 sm:pt-16 lg:pt-20 sm:pb-24 lg:pb-32">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex justify-center mb-8 pt-4 sm:pt-6">
                        <div className="relative inline-flex items-center gap-5 overflow-hidden rounded-full border border-white/10 bg-[#1a4331] px-7 py-2.5 shadow-sm">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: "url('/Patterns-03.webp')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                                Client Testimonials
                            </p>
                            <div className="relative z-10 h-3 w-px bg-white/20" />
                            <SendHorizontal size={15} className="relative z-10 text-[#83cd20]" />
                        </div>
                    </div>

                    <h2 className="testimonial-heading mx-auto text-center font-serif font-bold text-[2.2rem] leading-tight text-[#1a4331] sm:text-[2.75rem]">
                        Real Stories from Everyday<br />Moments
                    </h2>

                    <div className="relative mx-auto mt-12 grid max-w-[1140px] gap-8 lg:min-h-[380px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-0 lg:-translate-x-[3%]">
                        <div className="testimonial-card relative z-20 -translate-x-[2%] overflow-hidden rounded-[32px] bg-[#f2f6ee] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-14 min-[768px]:max-[1024px]:translate-x-0 lg:max-w-[540px] lg:translate-x-[31%]">
                            {/* Large Background Quote Marks - Centered */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#1f4d3a]/5 translate-x-12">
                                <svg width="280" height="200" viewBox="0 0 340 240" fill="none" stroke="currentColor" strokeWidth="8" xmlns="http://www.w3.org/2000/svg">
                                    {/* Left Quote */}
                                    <path d="M115 130V220H25V130C25 70 65 30 115 30V80C95 80 85 95 85 110H115V130Z" />
                                    {/* Right Quote */}
                                    <path d="M265 130V220H175V130C175 70 215 30 265 30V80C245 80 235 95 235 110H265V130Z" />
                                </svg>
                            </div>

                            <p className="relative z-10 max-w-[36ch] text-[1.1rem] font-medium leading-[1.6] text-[#1f4d3a] sm:text-[1.35rem] sm:leading-[1.5]">
                                Zewadi products truly changed the way I look at everyday food
                                simple, high-quality, and made to fit effortlessly into my
                                life.
                            </p>

                            <div className="relative z-10 mt-12 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-[#d9d9d9] sm:h-16 sm:w-16" />
                                    <div>
                                        <p className="text-lg font-bold text-[#1a4331] sm:text-xl">
                                            Hamna Zaid
                                        </p>
                                        <p className="text-xs font-medium text-[#727272] sm:text-sm">Happy Customer</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label="Previous testimonial"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1a4331] transition-all hover:bg-white/80 shadow-sm"
                                    >
                                        <ArrowRight size={16} className="rotate-180" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next testimonial"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a4331] text-white transition-all hover:bg-[#1a4331]/90 shadow-sm"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-image relative z-10 overflow-hidden rounded-[32px] lg:-ml-[380px] lg:justify-self-end">
                            <img
                                src={testimonialImage}
                                alt="People stacking hands together"
                                loading="lazy"
                                decoding="async"
                                className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[500px] lg:w-[500px]"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
