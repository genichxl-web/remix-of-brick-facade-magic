import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const ReviewsSection = () => {
  const { photos, loading } = useGalleryPhotos("reviews");

  // Hide section if no reviews uploaded
  if (!loading && photos.length === 0) {
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
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Загрузка...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={photo.image_url} 
                  alt="Отзыв клиента" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
