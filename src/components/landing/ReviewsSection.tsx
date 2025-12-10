import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageCircle } from "lucide-react";

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Александр М.",
      location: "Красногорск",
      text: "Ребята сделали всё четко и в срок. Забор стоит уже год — никаких нареканий. Соседи завидуют 😊",
      rating: 5,
    },
    {
      name: "Елена К.",
      location: "Одинцово",
      text: "Долго выбирали между кирпичным и БРИК. Рады, что выбрали БРИК — дешевле и красивее. Подсветка вечером — просто огонь!",
      rating: 5,
    },
    {
      name: "Дмитрий В.",
      location: "Истра",
      text: "Автоматика работает бесшумно, калитка удобная. Главное — всё в едином стиле, не надо было искать разных подрядчиков.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
          💬 Отзывы клиентов
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Что говорят о нас реальные заказчики
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                
                <div className="flex items-start gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                  <p className="text-foreground">{review.text}</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
