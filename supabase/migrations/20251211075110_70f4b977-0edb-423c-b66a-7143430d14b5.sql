-- Create table for section items (list items, features, etc.)
CREATE TABLE public.section_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL,
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view section items" ON public.section_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert section items" ON public.section_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update section items" ON public.section_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete section items" ON public.section_items FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_section_items_updated_at
BEFORE UPDATE ON public.section_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for portfolio projects
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policies  
CREATE POLICY "Anyone can view portfolio projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert portfolio projects" ON public.portfolio_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update portfolio projects" ON public.portfolio_projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete portfolio projects" ON public.portfolio_projects FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON public.portfolio_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default items for "Что мы делаем" (services) section
INSERT INTO public.section_items (section_key, text, display_order) VALUES
('services', 'столбы с натуральной колотой фактурой', 0),
('services', 'заводской фундамент', 1),
('services', 'автоматические откатные ворота', 2),
('services', 'встроенную калитку', 3),
('services', 'архитектурную подсветку', 4);