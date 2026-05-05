"use client";

import React, { useEffect, useRef } from "react";
import { CalendarDays, Check, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContentSection from "../common/ContentSection";

type PopularPost = {
  title: string;
  image: string;
  href: string;
};

type BlogDetailTemplateProps = {
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  title: string;
  intro: string;
  popularPosts: PopularPost[];
};

const detailParagraphOne =
  "Coping with grief is a profoundly personal journey, and understanding the stages of loss can provide a valuable framework for healing. Psychologist Elisabeth Kubler-Ross identified five stages of grief: Denial, Anger, Bargaining, Depression, and Acceptance. These stages offer insight into the range of emotions one may experience after a significant loss. In the Denial stage, individuals may feel numb or shocked as they gradually accept the reality of their loss. Anger may then arise, often directed at oneself, others, or the situation, allowing the release of intense emotions.";

const detailParagraphTwo =
  "Bargaining follows, marked by 'what-ifs' and attempts to understand or alter the outcome, often accompanied by feelings of guilt. In the Depression stage, deep sadness and isolation may set in as one fully confronts the void left by the loss. Finally, Acceptance emerges.";

const detailParagraphThree =
  "Navigating these stages is rarely linear, and it's natural to revisit them or experience them in a different order. Recognizing these emotions as part of the healing process, along with seeking support, can provide comfort and resilience during the difficult journey through grief.";

const processItems = [
  "Initial Assessment and Rapport Building",
  "Goal Setting and Treatment Planning",
  "Exploration and Insight Development",
  "Skill Building and Strategy Implementation",
  "Termination and Maintenance Planning",
];

export default function BlogDetailTemplate({
  heroTitle,
  heroSubtitle,
  image,
  title,
  intro,
  popularPosts,
}: BlogDetailTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".blog-detail-image").forEach((el) => {
        gsap.fromTo(
          el as HTMLElement,
          { opacity: 0, y: 32, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: el as HTMLElement,
              start: "top 80%",
            },
          }
        );
      });

      const popularPostImages = gsap.utils.toArray(".popular-post-image");
      if (popularPostImages.length > 0) {
        gsap.fromTo(
          popularPostImages,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: popularPostImages[0] as HTMLElement,
              start: "top 90%",
            },
          }
        );
      }

      const popularPostTexts = gsap.utils.toArray(".popular-post-text");
      if (popularPostTexts.length > 0) {
        gsap.fromTo(
          popularPostTexts,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: popularPostImages.length > 0 ? (popularPostImages[0] as HTMLElement) : (popularPostTexts[0] as HTMLElement),
              start: "top 90%",
            },
          }
        );
      }
      const contentSections = gsap.utils.toArray(".blog-content-section");
      const segments = gsap.utils.toArray(".progress-segment");

      if (segments.length > 0) {
        gsap.set(segments, { scaleX: 0 });

        contentSections.forEach((section, index) => {
          if (segments[index]) {
            gsap.to(segments[index] as HTMLElement, {
              scaleX: 1,
              ease: "power2.out",
              duration: 0.6,
              scrollTrigger: {
                trigger: section as HTMLElement,
                start: "top 30%",
                once: true,
              },
            });
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white">
      <ContentSection
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <section className="pb-20 pt-10 sm:pb-24 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-24 2xl:px-48">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,850px)_340px] xl:gap-24">
            <article className="blog-detail-article max-w-[850px] relative">
              <div className="mb-4 flex w-[99%] gap-[4px]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative h-[3px] flex-1 overflow-hidden bg-[#d8d6d1]">
                    <div className="progress-segment absolute inset-0 origin-left bg-[#1f4d3a]" />
                  </div>
                ))}
              </div>

              <div className="blog-content-section">
                <div className="blog-detail-image relative overflow-hidden rounded-[20px] h-[250px] sm:h-[360px] lg:h-[416px]">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-[#111214]">
                  <CalendarDays size={14} className="text-[#1f4d3a]" />
                  <span>October 19, 2022</span>
                </div>

                <h2 className="mt-4 font-serif font-bold text-[2rem] leading-tight text-black sm:text-[3.125rem] sm:leading-[1.2]">
                  {title}
                </h2>

                <p className="mt-4 text-[15px] font-semibold leading-[1.625rem] text-[#1f4d3a]">
                  {intro}
                </p>
              </div>

              <div className="blog-content-section">
                <p className="mt-6 text-[15px] font-semibold leading-[1.625rem] text-[#1f4d3a]">
                  {detailParagraphOne}
                </p>
              </div>

              <div className="blog-content-section">
                <p className="mt-6 text-[15px] font-semibold leading-[1.625rem] text-[#1f4d3a]">
                  {detailParagraphTwo}
                </p>
              </div>

              <div className="blog-content-section mt-10 border-l-[6px] border-[#1f4d3a] bg-[#f3f6ee] p-8 rounded-[12px]">
                <p className="text-[16px] font-semibold leading-relaxed text-[#111111]">
                  This is thanks to their outstanding service, competitive
                  pricing, and exceptional customer support. It&apos;s truly
                  refreshing to experience such a personal touch.
                </p>
                <p className="mt-4 text-[18px] font-semibold text-[#1a4331]">
                  Robert Denbhai
                </p>
              </div>

              <div className="blog-content-section">
                <p className="mt-6 text-[15px] font-semibold leading-[1.625rem] text-[#1f4d3a]">
                  {detailParagraphThree}
                </p>
              </div>

              <div className="blog-content-section">
                <h3 className="mt-10 text-[31px] font-medium leading-10 text-[#121212]">
                  Our Work Process
                </h3>

                <p className="mt-4 text-[15px] font-semibold leading-[1.625rem] text-[#1f4d3a]">
                  The psychology counseling process is a structured yet flexible
                  approach that aims to help individuals explore their thoughts,
                  emotions, and behaviors to foster growth, healing, and positive
                  change. Here is an overview of the typical steps involved in the
                  counseling process. Each of these steps is designed to adapt to
                  the client's unique journey, ensuring that counseling remains a
                  supportive.
                </p>

                <ul className="mt-6 space-y-3">
                  {processItems.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15px] text-[#1f4d3a]">
                      <Check size={15} strokeWidth={3} className="shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="sticky h-fit space-y-10 self-start" style={{ top: 'min(128px, calc(100vh - 100% - 24px))' }}>
              <div className="rounded-[24px] bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-black/[0.03]">
                <h3 className="text-[1.3rem] font-bold leading-tight text-[#1a4331]">
                  Search Here
                </h3>
                <div className="mt-4 h-px w-full bg-[#e3dbd8]" />
                <label className="mt-6 flex items-center rounded-full border border-[#e3dbd8] bg-[#fcfdfc] px-5 py-3 text-[#727272]">
                  <input
                    type="text"
                    placeholder="Search.."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#b4b4b4]"
                  />
                  <Search size={18} className="text-[#1a4331]" />
                </label>
              </div>

              <div className="rounded-[24px] bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-black/[0.03]">
                <h3 className="text-[1.3rem] font-bold leading-tight text-[#1a4331]">
                  Popular Post
                </h3>
                <div className="mt-4 h-px w-full bg-[#e3dbd8]" />
                <div className="mt-6 space-y-6">
                  {popularPosts.map((post) => (
                    <Link
                      key={post.title}
                      href={post.href}
                      className="group flex items-center gap-4"
                    >
                      <div className="popular-post-image relative h-[75px] w-[75px] flex-shrink-0 overflow-hidden rounded-[16px] bg-[#d9d9d9]">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="popular-post-text flex items-center gap-1.5 text-[11px] font-semibold text-[#727272]">
                          <CalendarDays size={13} className="text-[#1a4331]" />
                          October 19, 2022
                        </div>
                        <h4 className="popular-post-text mt-1.5 text-[14px] font-bold leading-snug text-[#1a4331] group-hover:text-[#1f6306]">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
