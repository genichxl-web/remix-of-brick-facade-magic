import { Check } from "lucide-react";
import ImageGallery from "./ImageGallery";
import CTAButton from "./CTAButton";
const TargetAudienceSection = () => {
  const points = ["строите дом в МО и хотите законченный фасад", "не хотите обычный кирпичный забор", "вам важен внешний вид днём и ночью", "хотите сразу забор + ворота + калитку", "не хотите контролировать 5 разных подрядчиков"];
  return <section className="py-20 bg-card">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">👀 Мы построили уже больше 300 заборов</h2>
        
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Этот забор вам подойдёт, если вы:
          </p>
          
          <ul className="space-y-4">
            {points.map((point, index) => <li key={index} className="flex items-start gap-3 bg-background rounded-lg p-4">
                <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-lg">{point}</span>
              </li>)}
          </ul>
        </div>

        <ImageGallery sectionKey="target" />
        
        <div className="text-center">
          <CTAButton />
        </div>
      </div>
    </section>;
};
export default TargetAudienceSection;