import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SectionText {
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

const defaultTexts: Record<string, SectionText> = {
  hero: { title: "Лицевой Забор БРИК", subtitle: "Премиальные фасадные системы ограждений для вашего дома", description: null },
  target: { title: "Вам точно подойдёт", subtitle: "Идеальное решение для требовательных домовладельцев", description: null },
  texture: { title: "Натуральная текстура скалы", subtitle: "Каждый блок уникален — природная красота без повторений", description: null },
  pillars: { title: "Монолитные армированные столбы", subtitle: "Не пустотелые — настоящая надёжность на десятилетия", description: null },
  foundation: { title: "Заводской фундамент", subtitle: "Точная геометрия, никаких усадок и трещин", description: null },
  lighting: { title: "Архитектурная подсветка", subtitle: "Встроенное освещение в каждом столбе", description: null },
  symmetry: { title: "Красота на 360°", subtitle: "Одинаково красиво с обеих сторон", description: null },
  gates: { title: "Ворота и калитка", subtitle: "Автоматические откатные ворота и встроенная калитка в едином стиле", description: null },
  portfolio: { title: "Наши работы", subtitle: "Более 500 реализованных проектов", description: null },
  reviews: { title: "Отзывы клиентов", subtitle: "Что говорят о нас наши заказчики", description: null },
  pricing: { title: "Калькулятор стоимости", subtitle: "Рассчитайте стоимость вашего забора", description: null },
  about: { title: "О компании", subtitle: "Собственное производство и монтаж под ключ", description: null },
  process: { title: "Как мы работаем", subtitle: "От замера до установки — 4 простых шага", description: null },
  geography: { title: "География работ", subtitle: "Работаем по всей Московской области", description: null },
  contact: { title: "Свяжитесь с нами", subtitle: "Оставьте заявку и мы перезвоним в течение 15 минут", description: null },
};

export const useSectionText = (sectionKey: string) => {
  const [text, setText] = useState<SectionText>(defaultTexts[sectionKey] || { title: null, subtitle: null, description: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchText = async () => {
      const { data } = await supabase
        .from("section_texts")
        .select("title, subtitle, description")
        .eq("section_key", sectionKey)
        .maybeSingle();

      if (data) {
        setText({
          title: data.title || defaultTexts[sectionKey]?.title || null,
          subtitle: data.subtitle || defaultTexts[sectionKey]?.subtitle || null,
          description: data.description || defaultTexts[sectionKey]?.description || null,
        });
      }
      setLoading(false);
    };

    fetchText();
  }, [sectionKey]);

  return { ...text, loading };
};
