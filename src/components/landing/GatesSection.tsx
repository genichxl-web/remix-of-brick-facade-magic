import { Check } from "lucide-react";

const GatesSection = () => {
  const features = [
    "Откатные автоматические ворота",
    "Бесшумная встроенная калитка",
    "Электрозамок + домофон",
    "В едином стиле с забором",
    "Не \"пристроены\", а запроектированы сразу",
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            🚪 Ворота и калитка в едином стиле
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-background rounded-lg p-4 shadow-sm">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatesSection;
