"use client";

import WelcomeBanner from "./WelcomeBanner";
import MetricsGrid from "./MetricsGrid";
import MainPanels from "./MainPanels";
import BottomPanels from "./BottomPanels";

export default function AdminOverviewDashboard() {
  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <WelcomeBanner />
        <MetricsGrid />
        <MainPanels />
        <BottomPanels />
      </div>
    </section>
  );
}
