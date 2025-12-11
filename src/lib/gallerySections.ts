// Конфигурация разделов галереи с инструкциями
export const gallerySections = [
  {
    key: "texture",
    name: "Натуральная текстура",
    description: "1 большое фото + 6 в галерее. Первое фото будет большим.",
    requiredPhotos: 7,
    tips: "Снимайте при боковом освещении для передачи рельефа"
  },
  {
    key: "pillars",
    name: "Монолитные столбы",
    description: "Фотографии армированных столбов в процессе и готовых",
    requiredPhotos: 6,
    tips: "Покажите арматуру внутри и готовый результат"
  },
  {
    key: "foundation",
    name: "Заводской фундамент",
    description: "Фотографии фундамента и основания забора",
    requiredPhotos: 6,
    tips: "Фото с разных ракурсов: вид сбоку, сверху"
  },
  {
    key: "lighting",
    name: "Архитектурная подсветка",
    description: "1 большое фото + 6 в галерее. Первое фото будет большим.",
    requiredPhotos: 7,
    tips: "Снимайте в сумерках для лучшего эффекта"
  },
  {
    key: "symmetry",
    name: "Симметрия 360°",
    description: "Фотографии забора с обеих сторон",
    requiredPhotos: 6,
    tips: "Покажите вид изнутри и снаружи участка"
  },
  {
    key: "gates",
    name: "Ворота и калитка",
    description: "Фотографии автоматических ворот и калиток",
    requiredPhotos: 6,
    tips: "Фото в открытом и закрытом состоянии"
  },
  {
    key: "portfolio",
    name: "Портфолио проектов",
    description: "Общие фотографии готовых объектов",
    requiredPhotos: 12,
    tips: "Лучшие фотографии завершённых проектов"
  },
  {
    key: "target",
    name: "Вам точно подойдёт",
    description: "Фотографии для раздела целевой аудитории",
    requiredPhotos: 6,
    tips: "Фото готовых проектов для демонстрации результата"
  },
  {
    key: "hero",
    name: "Главный экран",
    description: "Главная фотография для верхней части сайта",
    requiredPhotos: 1,
    tips: "Панорамное фото лучшего забора"
  },
  {
    key: "reviews",
    name: "Отзывы клиентов",
    description: "Скриншоты отзывов из мессенджеров (вертикальные фото)",
    requiredPhotos: 6,
    tips: "Загружайте вертикальные скриншоты из WhatsApp, Telegram и т.д."
  }
] as const;

export type SectionKey = typeof gallerySections[number]['key'];
