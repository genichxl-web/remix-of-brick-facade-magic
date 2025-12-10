import { Check } from "lucide-react";

const PriceComparisonSection = () => {
  const reasons = [
    "нет дорогой кладки",
    "нет сплошной бетонной ленты",
    "заводские элементы",
    "быстрый монтаж",
    "минимум ошибок людей",
  ];

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            💰 Почему дешевле кирпичного
          </h2>
          
          <p className="text-xl mb-8 opacity-90">
            Забор БРИК в среднем <strong>на 20–30% дешевле кирпичного</strong>, потому что:
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg p-3">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
          
          <p className="text-lg font-medium">
            ✅ При этом визуально он выглядит дороже.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceComparisonSection;
