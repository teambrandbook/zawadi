import CommunityHero from "@/components/community/CommunityHero";
import CommunityStats from "@/components/community/CommunityStats";
import CommunityGrid from "@/components/community/CommunityGrid";
import CommunityOverview from "@/components/community/CommunityOverview";
import CommunityValues from "@/components/community/CommunityValues";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "Community | Zewadi",
  description: "Join the Zewadi community - people who care about their health and routines.",
};

export default function CommunityPage() {
  return (
    <main>
      <Navbar/>
      <CommunityHero />
      <CommunityStats />
      <CommunityGrid />
      <CommunityOverview />
      <CommunityValues />
      <Footer/>
    </main>
  );
}
