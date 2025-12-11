-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for section texts
CREATE TABLE public.section_texts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_texts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view section texts" 
ON public.section_texts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert section texts" 
ON public.section_texts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update section texts" 
ON public.section_texts 
FOR UPDATE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_section_texts_updated_at
BEFORE UPDATE ON public.section_texts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default values for all sections
INSERT INTO public.section_texts (section_key, title, subtitle, description) VALUES
('hero', 'Лицевой Забор БРИК', 'Премиальные фасадные системы ограждений для вашего дома', NULL),
('target', 'Вам точно подойдёт', 'Идеальное решение для требовательных домовладельцев', NULL),
('texture', 'Натуральная текстура скалы', 'Каждый блок уникален — природная красота без повторений', NULL),
('pillars', 'Монолитные армированные столбы', 'Не пустотелые — настоящая надёжность на десятилетия', NULL),
('foundation', 'Заводской фундамент', 'Точная геометрия, никаких усадок и трещин', NULL),
('lighting', 'Архитектурная подсветка', 'Встроенное освещение в каждом столбе', NULL),
('symmetry', 'Красота на 360°', 'Одинаково красиво с обеих сторон', NULL),
('gates', 'Ворота и калитка', 'Автоматические откатные ворота и встроенная калитка в едином стиле', NULL),
('portfolio', 'Наши работы', 'Более 500 реализованных проектов', NULL),
('reviews', 'Отзывы клиентов', 'Что говорят о нас наши заказчики', NULL),
('pricing', 'Калькулятор стоимости', 'Рассчитайте стоимость вашего забора', NULL),
('about', 'О компании', 'Собственное производство и монтаж под ключ', NULL),
('process', 'Как мы работаем', 'От замера до установки — 4 простых шага', NULL),
('geography', 'География работ', 'Работаем по всей Московской области', NULL),
('contact', 'Свяжитесь с нами', 'Оставьте заявку и мы перезвоним в течение 15 минут', NULL);