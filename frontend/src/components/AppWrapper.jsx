"use client";

import { useEffect, useState } from "react";
import Providers from "@/app/providers";
import Preloader from "./Preloader";

const imageSources = [
  "/file.svg",
  "/globe.svg",
  "/next.svg",
  "/Patterns-03.webp",
  "/vercel.svg",
  "/window.svg",
  "/about/approach.webp",
  "/about/intro-bottom.webp",
  "/about/intro-tall.webp",
  "/about/intro-top.webp",
  "/about/story-center.webp",
  "/about/story-left.webp",
  "/about/story-right.webp",
  "/about/testimonial.webp",
  "/bg/world-map.png",
  "/blogs/blog-1.webp",
  "/blogs/blog-2.webp",
  "/blogs/blog-3.webp",
  "/community/com-1.webp",
  "/community/com-2.webp",
  "/community/com-3.webp",
  "/community/com-value.webp",
  "/community/grid-1.webp",
  "/community/grid-2.webp",
  "/community/grid-3.webp",
  "/contact/contact.webp",
  "/event/community_gathering.webp",
  "/event/community_hands.webp",
  "/event/event_banner_bg.webp",
  "/event/event_health_culture.webp",
  "/event/event_organic_farming.webp",
  "/event/moments_main.webp",
  "/event/past_event_1.webp",
  "/event/past_event_2.webp",
  "/event/quote_mark.svg",
  "/event/testimonials_bg.webp",
  "/footer/world-map.png",
  "/gallery/g-2.webp",
  "/gallery/g-5.webp",
  "/gallery/g-6.webp",
  "/gallery/g-7.webp",
  "/gallery/g-8.webp",
  "/gallery/g-9.webp",
  "/gallery/g3.webp",
  "/gallery/g4.webp",
  "/gallery/gallry -1.webp",
  "/home/a1.webp",
  "/home/a2.webp",
  "/home/a3.webp",
  "/home/communityBase.webp",
  "/home/communityBase1.webp",
  "/home/experienceImg1.webp",
  "/home/historyImg1.webp",
  "/home/historyImg2.webp",
  "/home/historyImg3.webp",
  "/home/historyImg4.webp",
  "/home/inclusive.webp",
  "/home/meaningImg1.webp",
  "/home/meaningImg2.webp",
  "/home/newsletterBg.webp",
  "/home/productImg1.webp",
  "/home/productImg2.webp",
  "/home/productImg3.webp",
  "/home/wellness.webp",
  "/logo/zewadi-logo.webp",
  "/product/p-1.webp",
  "/product/p-2.webp",
  "/product/p-3.webp",
  "/product/p-4.webp",
  "/product/p-main.webp",
  "/recipe/dessert-1.webp",
  "/recipe/dessert-2.webp",
  "/recipe/dessert-3.webp",
  "/recipe/dessert-4.webp",
  "/recipe/dinner-1.webp",
  "/recipe/dinner-2.webp",
  "/recipe/dinner-3.webp",
  "/recipe/dinner-4.webp",
  "/recipe/lunch-1.webp",
  "/recipe/lunch-2.webp",
  "/recipe/lunch-3.webp",
  "/recipe/lunch-4.webp",
  "/recipe/recipe-1.webp",
  "/recipe/recipe-2.webp",
  "/recipe/recipe-3.webp",
  "/recipe/recipe-4.webp",
];

const videoSources = [
  "/event/moments_main.webm",
  "/home/heroBg.webm",
  "/home/learnMoreBg.webm",
  "/home/newsletterBg.webm",
];

export default function AppWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let count = 0;
    const totalAssets = imageSources.length + videoSources.length;

    if (totalAssets === 0) {
      setLoading(false);
      return;
    }

    const markLoaded = () => {
      count++;
      if (count === totalAssets) {
        setLoading(false);
      }
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;

      img.onload = img.onerror = markLoaded;
    });

    videoSources.forEach((src) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.src = src;

      video.onloadeddata = video.onerror = markLoaded;
    });
  }, []);

  if (loading) return <Preloader />;

  return <Providers>{children}</Providers>;
}
