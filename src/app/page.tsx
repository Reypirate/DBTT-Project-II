import Hero from "./_components/Hero";
import TrustSignals from "./_components/TrustSignals";
import HowItWorks from "./_components/HowItWorks";
import FeaturedBundles from "./_components/FeaturedBundles";
import UpcomingRituals from "./_components/UpcomingRituals";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-main">
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <FeaturedBundles />
      <UpcomingRituals />
    </div>
  );
}
