import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Send } from "lucide-react";
import { useEffect } from "react";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view in Yandex Metrika for SPA navigation
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(105799605, 'hit', '/thank-you_BrickMoscow2', {
        title: 'Спасибо за заявку'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Спасибо за доверие!
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Ваша заявка принята. Наш менеджер свяжется с вами в ближайшее время.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Вернуться на сайт
          </Button>
          
          <Button
            asChild
            size="lg"
            className="gap-2"
          >
            <a
              href="https://t.me/BrickFacadeMagicChanal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="w-5 h-5" />
              Больше фото в Telegram
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
