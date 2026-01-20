import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useContactForm } from "@/contexts/ContactFormContext";

interface CTAButtonProps {
  text?: string;
  onClick?: () => void;
}

const CTAButton = ({ text = "Рассчитать стоимость", onClick }: CTAButtonProps) => {
  const { openContactForm } = useContactForm();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openContactForm();
    }
  };

  return (
    <Button 
      size="lg" 
      onClick={handleClick}
      className="mt-6 gap-2"
    >
      {text}
      <ArrowRight className="w-4 h-4" />
    </Button>
  );
};

export default CTAButton;
