import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const VideoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Clear previous widget
      container.innerHTML = "";
      
      // Create widget container
      const widgetDiv = document.createElement("div");
      widgetDiv.id = "vk_video_post_" + Date.now();
      container.appendChild(widgetDiv);
      
      // Calculate width based on container
      const width = Math.min(container.offsetWidth, 600);
      
      // @ts-ignore
      if (window.VK?.Widgets) {
        // @ts-ignore
        window.VK.Widgets.Post(widgetDiv.id, -231889841, 9, "BEYBZ4DWJnaQh5UtQ0neRv9Lag", { width });
      }
    };

    const existingScript = document.querySelector('script[src*="vk.com/js/api/openapi"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://vk.com/js/api/openapi.js?173";
      script.async = true;
      script.onload = loadWidget;
      document.body.appendChild(script);
    } else {
      loadWidget();
    }

    // Reload on resize
    const handleResize = () => {
      setTimeout(loadWidget, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

        <div className="flex justify-center mb-10">
          <div ref={containerRef} className="w-full max-w-2xl"></div>
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
