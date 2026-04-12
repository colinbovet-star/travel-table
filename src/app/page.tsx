import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import WhoSection from "@/components/WhoSection";
import HowSection from "@/components/HowSection";
import FeaturesSection from "@/components/FeaturesSection";
import CallsSection from "@/components/CallsSection";
import JoinSection from "@/components/JoinSection";
import SiteFooter from "@/components/SiteFooter";
import FadeUpObserver from "@/components/FadeUpObserver";

export default function Home() {
  return (
    <>
      <Nav />
      <HeroSection />
      <WhoSection />
      <HowSection />
      <FeaturesSection />
      <CallsSection />
      <JoinSection />
      <SiteFooter />
      <FadeUpObserver />
    </>
  );
}
