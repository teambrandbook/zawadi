"use client";

import React, { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import homeData from "@/data/home.json";

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { hero } = homeData;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".hero-badge", { 
        y: -10, 
        opacity: 0, 
        duration: 0.8,
        ease: "power2.out" 
      })
      .from(".hero-title span", {
        y: 60,
        opacity: 0,
        rotateX: -45,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-description", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      .from(".hero-cta", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, "-=0.4");

      // Animated background blobs
      gsap.to(".blob-1", {
        x: "30%",
        y: "20%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(".blob-2", {
        x: "-20%",
        y: "-10%",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-dark pt-20">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="blob-1 absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-[100px]" />
        <div className="blob-2 absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="hero-badge inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8">
          <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-brand-primary">
            {hero.badge}
          </span>
        </div>

        <h1 className="hero-title text-5xl md:text-7xl lg:text-7xl font-black text-white mb-8 leading-[0.95] perspective-1000">
          <span className="inline-block mr-4">{hero.titleMain}</span>
          <span className="inline-block mr-4">{hero.titleSecondary}</span>
          <span className="inline-block bg-gradient-to-r from-brand-primary to-indigo-400 bg-clip-text text-transparent">
            {hero.titleSecondaryGradient}
          </span>
        </h1>

        <p className="hero-description text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-medium leading-relaxed font-mulish" style={{ fontFamily: "'Mulish', sans-serif" }}>
          {hero.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="hero-cta px-10 py-5 bg-brand-primary text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all transform hover:scale-105">
            {hero.ctaPrimary}
          </button>
          <button className="hero-cta px-10 py-5 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all">
            {hero.ctaSecondary}
          </button>
        </div>
      </div>

      {/* Scroll indicator maybe? */}
    </section>
  );
};

export default Hero;
