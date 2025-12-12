import { galleryImages } from "@/data/galleryImages";
import heroImage from "@/assets/hero-fence.jpg";
import { Button } from "@/components/ui/button";
import { Factory, Wrench, Shield } from "lucide-react";

const HeroSection = () => {
  const backgroundImage = galleryImages.hero[0] || heroImage;

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Премиальный лицевой забор БРИК с подсветкой"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            Каменные лицевые заборы на фундаменте с автоматическими воротами{" "}
            <span className="text-primary">под ключ</span> в Московской области
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 mb-4">
            Натуральная колотая фактура, подсветка, монолитные столбы.
          </p>
          <p className="text-lg md:text-xl text-accent font-medium mb-8">Выглядит дороже кирпича — стоит дешевле.</p>

          <div className="bg-card/10 backdrop-blur-sm rounded-lg p-4 mb-8 inline-block">
            <p className="text-primary-foreground/80 text-sm">Работаем по всей Московской области</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="text-lg px-8 py-6" onClick={scrollToContact}>
              Рассчитать стоимость забора
            </Button>
          </div>

          <p className="text-primary-foreground/70 text-sm mb-8">Перезвоним за 5–10 минут. Без спама.</p>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Factory className="w-5 h-5 text-primary" />
              <span className="text-sm">Собственное производство</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Wrench className="w-5 h-5 text-primary" />
              <span className="text-sm">Монтаж под ключ</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Гарантия на конструкцию</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
