import { MapPin } from "lucide-react";

const GeographySection = () => {
  const areas = [
    "Красногорск", "Одинцово", "Истра", "Химки",
    "Мытищи", "Балашиха", "Подольск", "Домодедово",
    "Люберцы", "Королёв", "Щёлково", "Пушкино"
  ];

  return (
    <section className="py-20 bg-secondary text-secondary-foreground">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            📍 География работ
          </h2>
          
          <p className="text-lg mb-8 opacity-90">
            Вся Московская область: посёлки, СНТ, коттеджные посёлки
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary-foreground/10 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{area}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 bg-primary rounded-full px-4 py-2 text-primary-foreground">
              <span>и другие районы МО</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeographySection;
