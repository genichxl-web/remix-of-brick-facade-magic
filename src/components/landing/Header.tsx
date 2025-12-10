import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Header = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <div className="font-serif font-bold text-xl text-primary">
          БРИК
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#portfolio" className="text-sm hover:text-primary transition-colors">
            Портфолио
          </a>
          <a href="#contact" className="text-sm hover:text-primary transition-colors">
            Контакты
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <a href="tel:+79991234567" className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <Phone className="w-4 h-4" />
            +7 (999) 123-45-67
          </a>
          <Button size="sm" onClick={scrollToContact}>
            Заявка
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
