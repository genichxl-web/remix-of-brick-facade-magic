import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useContactForm } from "@/contexts/ContactFormContext";

const PricingSection = () => {
  const { openContactForm } = useContactForm();
  
  const factors = [
    "ширина участка",
    "высота столбов",
    "высота цоколя",
    "тип заполнения",
    "цвет",
    "нужны ли ворота, калитка",
    "нужна ли подсветка",
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8">
            🧮 Как формируется цена
          </h2>
          
          <div className="bg-card rounded-xl p-8 shadow-lg">
            <p className="text-lg mb-6">Цена состоит из двух частей:</p>
            
            <div className="flex gap-4 mb-8">
              <div className="flex-1 bg-primary/10 rounded-lg p-4 text-center">
                <span className="text-2xl font-bold text-primary">1️⃣</span>
                <p className="font-medium mt-2">Бетонная часть</p>
              </div>
              <div className="flex-1 bg-accent rounded-lg p-4 text-center">
                <span className="text-2xl font-bold text-accent-foreground">2️⃣</span>
                <p className="font-medium mt-2">Заполнение</p>
              </div>
            </div>
            
            <p className="text-lg mb-4 font-medium">Для точного расчёта нужно:</p>
            
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {factors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
            
            <Button size="lg" className="w-full text-lg" onClick={openContactForm}>
              Получить точную цену
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
