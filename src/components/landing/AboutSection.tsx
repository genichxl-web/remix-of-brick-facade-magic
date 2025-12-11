import { Factory, Camera, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const features = [
    {
      icon: Factory,
      text: "Производство находится в г. Рязань",
    },
    {
      icon: MapPin,
      text: "Работаем по Московской области и Рязанской области",
    },
    {
      icon: Camera,
      text: "Фото и видео с каждого проекта",
    },
  ];
  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
            👷 Кто мы и почему нам можно доверять
          </h2>

          <p className="text-lg text-center text-muted-foreground mb-12">
            Мы производители. Работаем уже 15 лет. Мы сами производим, сами монтируем и сами отвечаем за результат.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-background rounded-xl p-6 shadow-sm"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-medium">{feature.text}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => window.open("https://t.me/BrickFacadeMagicChanal", "_blank")}
            >
              <Send className="w-5 h-5" />
              Наш Telegram канал
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
