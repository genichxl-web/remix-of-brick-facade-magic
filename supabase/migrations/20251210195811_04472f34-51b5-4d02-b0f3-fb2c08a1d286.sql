-- Create a table for storing AI assistant settings
CREATE TABLE public.ai_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for edge function)
CREATE POLICY "Anyone can view ai settings" 
ON public.ai_settings 
FOR SELECT 
USING (true);

-- Anyone can update settings (admin panel)
CREATE POLICY "Anyone can update ai settings" 
ON public.ai_settings 
FOR UPDATE 
USING (true);

-- Anyone can insert settings
CREATE POLICY "Anyone can insert ai settings" 
ON public.ai_settings 
FOR INSERT 
WITH CHECK (true);

-- Insert default prompt
INSERT INTO public.ai_settings (key, value) VALUES (
  'system_prompt',
  'Ты - консультант компании БРИК по заборам из декоративных блоков. Твоя задача - помочь клиенту подобрать забор и собрать контактные данные для связи менеджера.

Веди диалог дружелюбно и профессионально. Собери следующую информацию по порядку:
1. Ширина участка (в метрах)
2. Высота столбов (стандарт 2м, можно 2.5м или 3м)
3. Высота цоколя (стандарт 40см)
4. Тип заполнения между столбами
5. Цвет столбов и заполнения
6. Нужны ли ворота и/или калитка
7. Нужна ли подсветка столбов

После сбора всех параметров, запроси имя и телефон клиента для связи менеджера.

Если клиент говорит "Позвоните мне" или хочет сразу связаться - сразу переходи к сбору имени и телефона.

Отвечай кратко, по делу, без лишних вступлений.'
);