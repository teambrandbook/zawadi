"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompactEventCard, UpcomingCard } from "@/components/events/EventPrimitives";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type EventListItem = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  event_type: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_online: boolean;
  location: string;
  registration_count: number;
  status: string;
  cover_image: string | null;
};

function toMediaUrl(value?: string | null) {
  if (!value) return "/event/event_organic_farming.webp";
  if (value.startsWith("http") || value.startsWith("blob:")) return value;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return `${apiBase.replace(/\/api\/?$/, "")}${value.startsWith("/") ? "" : "/"}${value}`;
}

export default function UpcomingEvents() {
  const { locale } = useLocale();
  const upcomingText = translations[locale]?.eventsPage?.upcoming || translations.en.eventsPage.upcoming;
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get<EventListItem[]>("/events/");
        const now = Date.now();
        
        // Filter upcoming events
        const upcoming = response.data.filter((event) => {
          if (!event.event_date) return false;
          const dateTimeStr = event.start_time ? `${event.event_date}T${event.start_time}` : event.event_date;
          const startsAt = new Date(dateTimeStr).getTime();
          return !Number.isNaN(startsAt) && startsAt >= now;
        });
        
        // Sort by date ascending
        upcoming.sort((a, b) => {
          const aDate = new Date(a.start_time ? `${a.event_date}T${a.start_time}` : a.event_date!);
          const bDate = new Date(b.start_time ? `${b.event_date}T${b.start_time}` : b.event_date!);
          return aDate.getTime() - bDate.getTime();
        });

        setEvents(upcoming);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const primaryEvents = events.slice(0, 2);
  const secondaryEvents = events.slice(2, 4);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-left rtl:text-right">
            <h2 className="font-serif text-[34px] tracking-[-0.02em] text-[#0e2207] md:text-[45px] fade-in">
              {upcomingText.title}
            </h2>
            <p className="mt-3 max-w-[900px] font-sans text-[15px] leading-7 text-black md:text-[16px] md:leading-[30px] fade-in">
              {upcomingText.description}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-[54px] w-[220px] items-center justify-between rounded-full bg-[#1A4331]/95 px-2 font-sans text-[14px] font-semibold text-white transition hover:bg-[#174b05] ltr:pl-4 rtl:pr-4"
          >
            <span>{upcomingText.join}</span>

            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1f6306] ltr:ml-11 rtl:mr-11">
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr_424px]">
          {primaryEvents.map((event) => {
            let day = "-";
            let month = "-";
            if (event.event_date) {
              const dateObj = new Date(event.event_date);
              day = dateObj.getDate().toString().padStart(2, "0");
              month = dateObj.toLocaleString(locale === "ar" ? "ar" : "en-US", { month: "long" });
            }

            return (
              <UpcomingCard
                key={event.id}
                title={event.title}
                date={day}
                month={month}
                image={toMediaUrl(event.cover_image)}
                description={event.short_description}
              />
            );
          })}

          <div className="grid gap-6">
            {secondaryEvents.map((event) => {
              let day = "-";
              let month = "-";
              if (event.event_date) {
                const dateObj = new Date(event.event_date);
                day = dateObj.getDate().toString().padStart(2, "0");
                month = dateObj.toLocaleString(locale === "ar" ? "ar" : "en-US", { month: "long" });
              }

              return (
                <CompactEventCard
                  key={event.id}
                  title={event.title}
                  date={day}
                  month={month}
                />
              );
            })}
          </div>
        </div>
        
        {!isLoading && events.length === 0 && (
          <div className="mt-10 py-10 text-center text-gray-500">
            {upcomingText.empty}
          </div>
        )}
      </div>
    </section>
  );
}
