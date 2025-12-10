import textureImage from "@/assets/texture-closeup.jpg";
import { Check } from "lucide-react";

const TextureSection = () => {
  const features = [
    "Каждый блок колотый, а не штампованный",
    "Все столбы разные — нет одинакового рисунка",
    "Со временем не видно сколов и повреждений",
    "Выглядит как натуральный камень",
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              🪨 Натуральная колотая фактура
            </h2>
            
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="font-medium text-primary">
                ✅ Забор не "как у всех".
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src={textureImage}
              alt="Натуральная колотая фактура блоков"
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextureSection;
