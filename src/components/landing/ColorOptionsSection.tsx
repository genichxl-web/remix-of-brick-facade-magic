import { pillarColors } from "@/data/productOptions";
import CTAButton from "./CTAButton";

const ColorOptionsSection = () => {
  return (
    <section id="colors" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Выбор цвета бетонных блоков
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            15 оттенков натуральной колотой текстуры для вашего забора
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {pillarColors.map((color) => (
            <div
              key={color.id}
              className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={color.imageUrl}
                  alt={color.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <span className="text-sm font-medium text-foreground">
                  {color.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <CTAButton />
        </div>
      </div>
    </section>
  );
};

export default ColorOptionsSection;
