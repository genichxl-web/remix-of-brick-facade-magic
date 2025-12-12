import { Button } from "@/components/ui/button";

const VideoSection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Единая конструкция в одном стиле
          </h2>
          <p className="text-xl text-primary font-medium mb-2">
            Забор + ворота + калитка
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Посмотрите 2-минутный ролик на примере одного кейса
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl aspect-video">
            <iframe
              src="https://vk.com/video_ext.php?oid=-231889841&id=456239022&hd=2"
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
              frameBorder="0"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={scrollToContact}>
            Оставить заявку на консультацию
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
