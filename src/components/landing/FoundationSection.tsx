import { Check } from "lucide-react";
import ImageGallery from "./ImageGallery";
import CTAButton from "./CTAButton";

const FoundationSection = () => {
  const features = [
    "Не обычная \"лента\"",
    "Заводские ригели с точной геометрией",
    "Без просадок, перекосов и трещин",
    "Идеальная база под автоматику",
  ];

  return (
    <section className="py-20 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            🚧 Заводской фундамент
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-secondary-foreground/10 rounded-lg p-5">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <ImageGallery sectionKey="foundation" />
        
        <div className="text-center">
          <CTAButton />
        </div>
      </div>
    </section>
  );
};

export default FoundationSection;
