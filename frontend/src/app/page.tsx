"use client";

import React, { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import CommunitySection from "@/components/home/CommunitySection";
import LearnMoreSection from "@/components/home/LearnMoreSection";
import HistorySection from "@/components/home/HistorySection";
import MeaningSection from "@/components/home/MeaningSection";
import ProductSection from "@/components/home/ProductSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { fadeIn, imageAnimationtopdown, zoomInStagger } from "@/utils/animations";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getNotificationSocketUrl } from "@/lib/notificationsSocket";

export default function Home() {
  useEffect(() => {
    fadeIn(".fade-in");
    zoomInStagger(".zoom-item");
    imageAnimationtopdown(".image-topdown")
  }, []);

  useEffect(() => {
    let isActive = true;
    let socket: WebSocket | null = null;

    const connectTimer = window.setTimeout(() => {
      if (!isActive) {
        return;
      }

      const ws = new WebSocket(getNotificationSocketUrl());
      socket = ws;

      ws.onopen = () => {
        if (!isActive) {
          ws.close();
          return;
        }

        console.log("Frontend Connected", ws.url);
      };

      ws.onmessage = (e) => {
        if (!isActive) {
          return;
        }

        const data = JSON.parse(e.data);
        console.log(data.message);
      };

      ws.onerror = (e) => {
        if (!isActive) {
          return;
        }

        console.log("WebSocket Error", {
          event: e,
          readyState: ws.readyState,
          url: ws.url,
        });
      };

      ws.onclose = (e) => {
        if (!isActive) {
          return;
        }

        console.log("Socket Closed", {
          code: e.code,
          reason: e.reason,
          wasClean: e.wasClean,
        });
      };
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(connectTimer);

      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Navbar/>
      <HeroSection />
      <CommunitySection />
      <LearnMoreSection />
      <div id="history-section">
        <HistorySection />
      </div>
      <MeaningSection />
      <ProductSection />
      <ExperienceSection />
      <NewsletterSection />
      <Footer/>
    </div>
  );
}
