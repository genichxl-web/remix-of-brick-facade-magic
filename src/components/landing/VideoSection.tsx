import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const VideoSection = () => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="vk.com/js/api/openapi"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://vk.com/js/api/openapi.js?173";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        // @ts-ignore
        window.VK?.Widgets?.Post("vk_video_post", -231889841, 9, "BEYBZ4DWJnaQh5UtQ0neRv9Lag");
      };
    } else {
      // @ts-ignore
      window.VK?.Widgets?.Post("vk_video_post", -231889841, 9, "BEYBZ4DWJnaQh5UtQ0neRv9Lag");
    }
  }, []);

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

        <div className="flex justify-center mb-10 px-4">
          <div id="vk_video_post" className="w-full [&>*]:!w-full [&_iframe]:!w-full"></div>
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
