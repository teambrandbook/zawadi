"use client";

import { useState } from "react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import AppointmentsHeader from "./AppointmentsHeader";
import AppointmentsStatsGrid from "./AppointmentsStatsGrid";
import NextAppointmentCard from "./NextAppointmentCard";
import type { ScheduleItem } from "./appointmentsData";
import QuickAvailabilityCard from "./QuickAvailabilityCard";
import RecentActivityCard from "./RecentActivityCard";
import TodaysScheduleCard from "./TodaysScheduleCard";

export default function ConsultantAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<ScheduleItem | null>(null);

  return (
    <>
      <main className="min-h-screen bg-white px-4 py-6 lg:px-6">
        <div className="mx-auto max-w-[1220px] space-y-5">
          <AppointmentsHeader />
          <AppointmentsStatsGrid />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_320px]">
            <TodaysScheduleCard onViewDetails={setSelectedAppointment} />

            <div className="space-y-5">
              <NextAppointmentCard />
              <QuickAvailabilityCard />
              <RecentActivityCard />
            </div>
          </div>
        </div>
      </main>

      <AppointmentDetailsModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
    </>
  );
}
