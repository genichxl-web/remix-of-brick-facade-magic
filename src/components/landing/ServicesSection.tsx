import { CheckCircle } from "lucide-react";

const ServicesSection = () => {
  const services = [
    "столбы с натуральной колотой фактурой",
    "заводской фундамент",
    "автоматические откатные ворота",
    "встроенную калитку",
    "архитектурную подсветку",
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
          🧱 Что мы делаем простыми словами
        </h2>
        
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Мы проектируем, производим и устанавливаем <strong className="text-foreground">премиальные лицевые заборы под ключ</strong>:
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-3 bg-card rounded-lg p-4 shadow-sm">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{service}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-accent rounded-xl p-6 max-w-2xl mx-auto text-center">
          <p className="text-lg font-medium text-accent-foreground">
            ✅ Вы отдаёте участок — получаете полностью готовый фасад.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
