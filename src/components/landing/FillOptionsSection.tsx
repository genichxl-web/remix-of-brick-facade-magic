import { fillTypes } from "@/data/productOptions";
import CTAButton from "./CTAButton";

const FillOptionsSection = () => {
  return (
    <section id="fills" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Выбор заполнения
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            6 вариантов заполнения между столбами на любой вкус
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {fillTypes.map((fill) => (
            <div
              key={fill.id}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={fill.imageUrl}
                  alt={fill.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {fill.name}
                </h3>
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

export default FillOptionsSection;
