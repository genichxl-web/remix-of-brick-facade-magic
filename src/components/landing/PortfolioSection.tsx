import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";
import heroImage from "@/assets/hero-fence.jpg";
import nightImage from "@/assets/night-lighting.jpg";

const PortfolioSection = () => {
  const { photos } = useGalleryPhotos("portfolio");
  
  const defaultProjects = [
    {
      title: "Забор 32 м, автоматические ворота",
      location: "КП «Новорижский»",
      description: "Был пустой участок без ограждения. Задача: парадный фасад + автоматика. Реализовали за 23 дня под ключ.",
      image: heroImage,
    },
    {
      title: "Забор 48 м с подсветкой",
      location: "СНТ «Лесное»",
      description: "Задача: заменить старый деревянный забор на премиальный. Добавили архитектурную подсветку. Срок: 28 дней.",
      image: nightImage,
    },
    {
      title: "Забор 25 м + двое ворот",
      location: "Истринский район",
      description: "Угловой участок с двумя въездами. Комплексное решение с двумя автоматическими воротами.",
      image: heroImage,
    },
    {
      title: "Забор 40 м, калитка, ворота",
      location: "Одинцовский район",
      description: "Стандартный комплект под ключ: забор, автоворота, встроенная калитка с домофоном. Срок: 21 день.",
      image: nightImage,
    },
  ];

  // If we have photos from database, use them with default titles
  const projects = photos.length > 0 
    ? photos.slice(0, 8).map((photo, index) => ({
        ...defaultProjects[index % defaultProjects.length],
        image: photo.image_url
      }))
    : defaultProjects;

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Портфолио
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Реальные объекты наших клиентов
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <p className="text-primary font-medium">{project.location}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
