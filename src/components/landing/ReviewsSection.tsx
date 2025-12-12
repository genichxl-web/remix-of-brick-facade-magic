import { galleryImages } from "@/data/galleryImages";

const ReviewsSection = () => {
  const photos = galleryImages.reviews;

  // Hide section if no reviews
  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-card">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">
          Отзывы клиентов
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Что говорят о нас реальные заказчики
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <img 
                src={photo} 
                alt="Отзыв клиента" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
