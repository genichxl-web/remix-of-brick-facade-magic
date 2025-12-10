import nightImage from "@/assets/night-lighting.jpg";
import { Check } from "lucide-react";

const LightingSection = () => {
  const features = [
    "Встроена в столбы",
    "Не боится дождя и мороза",
    "Подчёркивает рельеф ночью",
    "Делает участок визуально дороже",
  ];

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src={nightImage}
              alt="Архитектурная подсветка забора ночью"
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              💡 Архитектурная подсветка
            </h2>
            
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LightingSection;
