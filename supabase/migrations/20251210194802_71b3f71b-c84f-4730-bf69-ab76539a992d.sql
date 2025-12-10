-- Create table for pillar colors
CREATE TABLE public.pillar_colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for fill types
CREATE TABLE public.fill_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pillar_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fill_types ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view pillar colors" ON public.pillar_colors FOR SELECT USING (true);
CREATE POLICY "Anyone can view fill types" ON public.fill_types FOR SELECT USING (true);

-- Public write access (for admin)
CREATE POLICY "Anyone can insert pillar colors" ON public.pillar_colors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pillar colors" ON public.pillar_colors FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete pillar colors" ON public.pillar_colors FOR DELETE USING (true);

CREATE POLICY "Anyone can insert fill types" ON public.fill_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update fill types" ON public.fill_types FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete fill types" ON public.fill_types FOR DELETE USING (true);