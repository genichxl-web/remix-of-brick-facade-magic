const ProcessSection = () => {
  const steps = [
    { number: "1", title: "Заявка", description: "Оставляете заявку на сайте или по телефону" },
    { number: "2", title: "Выезд и замеры", description: "Бесплатно выезжаем на объект" },
    { number: "3", title: "Подбор цвета", description: "Помогаем выбрать оптимальное решение" },
    { number: "4", title: "3D-визуализация", description: "Показываем, как будет выглядеть забор" },
    { number: "5", title: "Производство", description: "Изготавливаем элементы на заводе" },
    { number: "6", title: "Монтаж", description: "Устанавливаем забор на участке" },
    { number: "7", title: "Запуск автоматики", description: "Настраиваем ворота и подсветку" },
    { number: "8", title: "Сдача объекта", description: "Принимаете готовый результат" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
          🔄 Как проходит работа
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card rounded-xl p-6 h-full shadow-sm">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
