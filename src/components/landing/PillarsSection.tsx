import { Check } from "lucide-react";
import ImageGallery from "./ImageGallery";
import CTAButton from "./CTAButton";

const PillarsSection = () => {
  const features = [
    "Внутри арматурный каркас",
    "Полностью заливаются бетоном",
    "Не пустота, не декоративная оболочка",
    "Не ведёт, не трескается, держит ворота годами",
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            🧱 Монолитные армированные столбы
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-card rounded-lg p-5 shadow-sm">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <ImageGallery />
        
        <div className="text-center">
          <CTAButton />
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
