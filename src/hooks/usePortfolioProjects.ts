import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioPhoto {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
}

interface PortfolioProject {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  display_order: number | null;
  photos: PortfolioPhoto[];
}

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    
    const { data: projectsData, error: projectsError } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (projectsError || !projectsData) {
      setLoading(false);
      return;
    }

    const { data: photosData } = await supabase
      .from("portfolio_photos")
      .select("*")
      .order("display_order", { ascending: true });

    const projectsWithPhotos = projectsData.map(project => ({
      ...project,
      photos: (photosData || []).filter(photo => photo.project_id === project.id)
    }));

    setProjects(projectsWithPhotos);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, refetch: fetchProjects };
}
