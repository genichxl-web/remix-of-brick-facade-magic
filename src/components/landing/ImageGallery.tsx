import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import heroImage from "@/assets/hero-fence.jpg";
import textureImage from "@/assets/texture-closeup.jpg";
import nightImage from "@/assets/night-lighting.jpg";

interface ImageGalleryProps {
  sectionKey?: string;
  images?: string[];
}

const defaultImages = [heroImage, textureImage, nightImage, heroImage, textureImage, nightImage];

const ImageGallery = ({ sectionKey, images }: ImageGalleryProps) => {
  const { photos, loading } = useGalleryPhotos(sectionKey || "");
  
  // Use database photos if available, otherwise use provided images or defaults
  const displayImages = photos.length > 0 
    ? photos.map(p => p.image_url)
    : (images || defaultImages);

  if (loading && sectionKey) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
      {displayImages.slice(0, 6).map((image, index) => (
        <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={`Фото ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
