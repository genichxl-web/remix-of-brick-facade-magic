import { galleryImages, fallbackImages } from "@/data/galleryImages";

interface ImageGalleryProps {
  sectionKey?: string;
  images?: string[];
  skipFirst?: boolean;
}

const ImageGallery = ({ sectionKey, images, skipFirst = false }: ImageGalleryProps) => {
  // Use static images from galleryImages, provided images, or fallback
  let displayImages = sectionKey && galleryImages[sectionKey as keyof typeof galleryImages]
    ? galleryImages[sectionKey as keyof typeof galleryImages]
    : (images || fallbackImages);
  
  // Skip first photo if requested (when section has a big featured photo)
  if (skipFirst && displayImages.length > 0) {
    displayImages = displayImages.slice(1);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
      {displayImages.slice(0, 6).map((image, index) => (
        <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={`Фото ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
