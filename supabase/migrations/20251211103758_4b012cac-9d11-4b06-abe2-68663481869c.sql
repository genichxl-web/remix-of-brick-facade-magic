-- Add location column to portfolio_projects
ALTER TABLE public.portfolio_projects 
ADD COLUMN IF NOT EXISTS location text;

-- Create portfolio_photos table for multiple photos per project
CREATE TABLE public.portfolio_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_photos ENABLE ROW LEVEL SECURITY;

-- RLS policies for portfolio_photos
CREATE POLICY "Anyone can view portfolio photos" 
ON public.portfolio_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert portfolio photos" 
ON public.portfolio_photos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio photos" 
ON public.portfolio_photos 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete portfolio photos" 
ON public.portfolio_photos 
FOR DELETE 
USING (true);