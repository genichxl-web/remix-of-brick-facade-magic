import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import TargetAudienceSection from "@/components/landing/TargetAudienceSection";
import ServicesSection from "@/components/landing/ServicesSection";
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <TargetAudienceSection />
        <ServicesSection />
        <TextureSection />
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
    </div>
  );
};

export default Index;
