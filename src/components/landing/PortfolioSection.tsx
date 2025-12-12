import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioProjects } from "@/data/portfolioData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PortfolioSection = () => {
  // Hide section if no projects
  if (portfolioProjects.length === 0) {
    return null;
  }

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
          {portfolioProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.photos.length > 0 ? (
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {project.photos.map((photo, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={photo}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {project.photos.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Нет фото</span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                {project.location && (
                  <p className="text-primary font-medium">{project.location}</p>
                )}
              </CardHeader>
              {project.description && (
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
