import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryPhoto {
  id: string;
  section_key: string;
  image_url: string;
  display_order: number;
}

export function useGalleryPhotos(sectionKey: string) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, [sectionKey]);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("section_key", sectionKey)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setPhotos(data);
    }
    setLoading(false);
  };

  return { photos, loading, refetch: fetchPhotos };
}

export function useAllGalleryPhotos() {
  const [photosBySection, setPhotosBySection] = useState<Record<string, GalleryPhoto[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const fetchAllPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      const grouped = data.reduce((acc, photo) => {
        if (!acc[photo.section_key]) {
          acc[photo.section_key] = [];
        }
        acc[photo.section_key].push(photo);
        return acc;
      }, {} as Record<string, GalleryPhoto[]>);
      setPhotosBySection(grouped);
    }
    setLoading(false);
  };

  return { photosBySection, loading, refetch: fetchAllPhotos };
}
