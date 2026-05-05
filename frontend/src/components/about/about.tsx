import Link from "next/link";
import { ArrowRight, Leaf, MoveRight, SendHorizontal } from "lucide-react";

import { StarIcon } from "../common/BrandIcons";

const introTallImage =
    "https://www.figma.com/api/mcp/asset/3afd8e53-bdde-4de5-bc42-957e680686bc";
const introTopImage =
    "https://www.figma.com/api/mcp/asset/b3ae8695-686f-45fb-929b-ac98aea9765b";
const introBottomImage =
    "https://www.figma.com/api/mcp/asset/171cdcc5-319b-4600-a11c-ef4f05d031f8";
const storyLeftImage =
    "https://www.figma.com/api/mcp/asset/35f363c1-e4d5-456f-83be-a2317bf5f5ed";
const storyCenterImage =
    "https://www.figma.com/api/mcp/asset/19652279-79e8-4f16-8e8e-06a014ecb182";
const storyRightImage =
    "https://www.figma.com/api/mcp/asset/eac7ce6c-b4bd-455b-9512-1d7e94b09688";
const approachImage =
    "https://www.figma.com/api/mcp/asset/eb21481a-4b3a-49ee-8357-ea1799a03359";
const testimonialImage =
    "https://www.figma.com/api/mcp/asset/a63ca89f-bbff-446c-a1fc-ae30f830f5f5";

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

const sectionTitleClass =
    "font-serif text-[1.8rem] leading-tight text-[#034833] sm:text-[2.5rem]";

export default function About() {
    return (
        <div className="bg-white text-[#121414]">
            <section className="bg-[#1f4d3a] pt-20 sm:pt-24 pb-0">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="h-[140px] sm:h-[180px]" />
                    <div className="max-w-[440px] rounded-t-[24px] bg-white px-7 py-7 sm:px-10 sm:py-10 shadow-[0_-15px_60px_rgba(0,0,0,0.05)]">
                        <h1 className="font-serif text-[2.25rem] font-bold leading-none text-[#0e2207] sm:text-[2.75rem]">
                            About Zewadi
                        </h1>
                        <p className="mt-4 text-base font-bold text-[#1f6306] sm:text-lg">
                            What is Zewadi
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
                        <div className="mx-auto grid w-full max-w-[580px] grid-cols-[1.05fr_0.95fr] gap-5 sm:gap-6 items-end">
                            <div className="space-y-4 sm:space-y-5">
                                <div className="overflow-hidden rounded-[20px]">
                                    <img
                                        src={introTallImage}
                                        alt="Fresh salad bowl"
                                        className="h-[270px] w-full object-cover sm:h-[350px] lg:h-[450px] -scale-x-100"
                                    />
                                </div>
                                <div className="rounded-[22px] border-2 border-[#83cd20] bg-white px-6 py-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f5eb] text-[#034833]">
                                            <Leaf size={20} />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold leading-6 text-[#034833]">
                                                Natural Health
                                            </p>
                                            <p className="text-[13px] leading-4 text-[#727272]">
                                                Wellness Made Simple
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-0 sm:space-y-4 lg:pt-1">
                                <div className="overflow-hidden rounded-[20px]">
                                    <img
                                        src={introTopImage}
                                        alt="Hands preparing vegetables"
                                        className="h-[120px] w-full object-cover sm:h-[140px]"
                                    />
                                </div>
                                <div className="overflow-hidden rounded-[20px]">
                                    <img
                                        src={introBottomImage}
                                        alt="Hands holding a seedling"
                                        className="h-[230px] w-full object-cover sm:h-[390px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:pl-4 xl:pl-8">
                            <h2 className="font-serif font-bold text-[1.35rem] leading-[1.3] sm:text-[1.85rem] sm:leading-[1.2] text-[#034833] tracking-normal">
                                Food That Feels Right,<br />
                                Every Day Thoughtfully<br />
                                Crafted for You.
                            </h2>

                            <div className="mt-8 space-y-5">
                                {introCards.map((card) => (
                                    <article
                                        key={card.title}
                                        className="rounded-[20px] border border-[#e3dbd8] bg-white px-7 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] sm:px-8 sm:py-5"
                                    >
                                        <h3 className="text-lg font-semibold leading-tight text-[#034833]">
                                            {card.title}
                                        </h3>
                                        <p className="mt-3 text-[15px] leading-relaxed text-black/80">
                                            {card.body}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#1f4d3a] py-12 text-white sm:py-16">
                <div className="container mx-auto px-4 text-center sm:px-6">
                    <h2 className="mx-auto max-w-[16ch] font-serif text-[1.8rem] leading-tight sm:text-[2.75rem] sm:leading-[1.15]">
                        The story behind the flavors
                    </h2>

                    <div className="mx-auto mt-10 flex max-w-[820px] flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
                        <div className="w-full max-w-[220px] overflow-hidden shadow-[0_0_19px_rgba(0,0,0,0.25)] md:max-w-[200px] md:translate-x-6 md:translate-y-4">
                            <img
                                src={storyLeftImage}
                                alt="Fresh berries and ingredients"
                                className="h-[200px] w-full object-cover md:h-[280px]"
                            />
                        </div>
                        <div className="relative z-10 w-full max-w-[440px] overflow-hidden shadow-[0_0_24px_rgba(0,0,0,0.28)]">
                            <img
                                src={storyCenterImage}
                                alt="People gathering around food outdoors"
                                className="h-[230px] w-full object-cover sm:h-[280px] md:h-[340px]"
                            />
                        </div>
                        <div className="w-full max-w-[220px] overflow-hidden shadow-[0_0_19px_rgba(0,0,0,0.25)] md:max-w-[200px] md:-translate-x-6 md:translate-y-4">
                            <img
                                src={storyRightImage}
                                alt="Packaged ingredients and fresh produce"
                                className="h-[200px] w-full object-cover md:h-[280px]"
                            />
                        </div>
                    </div>

                    <p className="mx-auto mt-8 max-w-[840px] text-sm font-semibold leading-6 text-[#cecece] sm:text-[1.15rem] sm:leading-8">
                        Zewadi was created with a vision to bring meaning back into the way
                        we experience food. Every flavor is thoughtfully developed to
                        reflect a balance of health, quality, and everyday enjoyment. It's
                        about turning simple choices into more intentional, fulfilling ones.
                    </p>
                </div>
            </section>

            <section className="py-10 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className={sectionTitleClass}>Our Approach</h2>

                    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                        <div>
                            <div className="overflow-hidden rounded-none max-w-[500px] mx-auto lg:mx-0">
                                <img
                                    src={approachImage}
                                    alt="Woman cooking in a bright kitchen"
                                    className="h-[300px] w-full object-cover sm:h-[360px]"
                                />
                            </div>
                            <p className="mt-4 max-w-[620px] text-sm leading-[1.625rem] text-black">
                                We sweat the details so you can enjoy food made for real
                                everyday life, always better when shared, with purpose behind
                                every decision.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-[440px]">
                            {approachSteps.map((step) => (
                                <div
                                    key={step.number}
                                    className={`flex items-center justify-between rounded-r-[999px] border-2 px-6 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.04)] transition-all sm:px-7 sm:py-4 ${step.active
                                            ? "border-[#b47800] bg-[#b47800] text-white"
                                            : "border-black/10 bg-white text-[#121414]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center ${step.active ? "text-white" : "text-[#1f4d3a]"
                                                }`}
                                        >
                                            <StarIcon size={28} />
                                        </div>
                                        <p className="font-serif text-lg leading-tight sm:text-[1.25rem]">
                                            {step.label}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold sm:h-10 sm:w-10 sm:text-lg ${step.active
                                                ? "border-white/40 text-white"
                                                : "border-black/10 text-black/40"
                                            }`}
                                    >
                                        {step.number}
                                    </div>
                                </div>
                            ))}

                            <Link
                                href="/products"
                                className="group inline-flex items-center rounded-full bg-[#1f4d3a] pl-9 pr-0 py-0 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#1a4331]"
                            >
                                <span className="py-4">Learn More</span>
                                <span className="relative -right-6 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-white bg-[#1f4d3a] text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                                    <MoveRight size={22} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-12 pt-4 sm:pb-16">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-5 rounded-full bg-[#1a4331] px-7 py-2.5 shadow-sm border border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
                                Client Testimonials
                            </p>
                            <div className="h-3 w-px bg-white/20" />
                            <SendHorizontal size={15} className="text-[#83cd20]" />
                        </div>
                    </div>

                    <h2 className="mx-auto text-center font-serif text-[2.2rem] leading-tight text-[#1a4331] sm:text-[2.75rem] max-w-[18ch]">
                        Real Stories from Everyday Moments
                    </h2>

                    <div className="relative mx-auto mt-10 grid max-w-[1140px] gap-8 lg:min-h-[380px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
                        <div className="relative z-20 overflow-hidden rounded-[32px] bg-[#f2f6ee] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-14 lg:max-w-[760px]">
                            {/* Large Background Quote Marks - Centered */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#1f4d3a]/5 translate-x-12">
                                <svg width="230" height="170" viewBox="0 0 220 160" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40 140C20 140 0 120 0 90C0 40 40 0 60 0L80 20C70 20 40 50 40 80H80V140H40ZM160 140C140 140 120 120 120 90C120 40 160 0 180 0L200 20C190 20 160 50 160 80H200V140H160Z" />
                                </svg>
                            </div>

                            <p className="relative z-10 max-w-[42ch] text-[1.1rem] font-medium leading-[1.6] text-[#1f4d3a] sm:text-[1.35rem] sm:leading-[1.5]">
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

                        <div className="relative z-10 overflow-hidden rounded-[32px] lg:-ml-40 lg:justify-self-end">
                            <img
                                src={testimonialImage}
                                alt="People stacking hands together"
                                className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[500px] lg:w-[500px]"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
