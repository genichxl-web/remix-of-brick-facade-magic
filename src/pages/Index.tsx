import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import TargetAudienceSection from "@/components/landing/TargetAudienceSection";
import ServicesSection from "@/components/landing/ServicesSection";
import ColorOptionsSection from "@/components/landing/ColorOptionsSection";
import FillOptionsSection from "@/components/landing/FillOptionsSection";
import TextureSection from "@/components/landing/TextureSection";
import PillarsSection from "@/components/landing/PillarsSection";
import FoundationSection from "@/components/landing/FoundationSection";
import LightingSection from "@/components/landing/LightingSection";
import SymmetrySection from "@/components/landing/SymmetrySection";
import GatesSection from "@/components/landing/GatesSection";
import PortfolioSection from "@/components/landing/PortfolioSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import PriceComparisonSection from "@/components/landing/PriceComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import AboutSection from "@/components/landing/AboutSection";
import ProcessSection from "@/components/landing/ProcessSection";
import GeographySection from "@/components/landing/GeographySection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import AIAssistantWidget from "@/components/landing/AIAssistantWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TextureSection />
        <TargetAudienceSection />
        <ServicesSection />
        <ColorOptionsSection />
        <FillOptionsSection />
        <PillarsSection />
        <FoundationSection />
        <LightingSection />
        <SymmetrySection />
        <GatesSection />
        <PortfolioSection />
        <ReviewsSection />
        <PriceComparisonSection />
        <PricingSection />
        <AboutSection />
        <ProcessSection />
        <GeographySection />
        <ContactSection />
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  );
};

export default Index;
