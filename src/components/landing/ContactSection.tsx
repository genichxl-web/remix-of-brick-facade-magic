import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyAccepted) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, примите политику конфиденциальности",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-to-amocrm', {
        body: { name, phone }
      });

      if (error) {
        throw error;
      }

      setName("");
      setPhone("");
      setPrivacyAccepted(false);
      navigate("/thank-you");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-foreground text-background">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            📞 Рассчитаем стоимость вашего забора за 10 минут
          </h2>
          
          <p className="text-lg opacity-80 mb-8">
            Оставьте заявку, и мы свяжемся с вами для бесплатной консультации
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <Label htmlFor="name" className="text-background">Ваше имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Как к вам обращаться?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background text-foreground mt-1"
              />
            </div>
            
            <div className="text-left">
              <Label htmlFor="phone" className="text-background">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-background text-foreground mt-1"
              />
            </div>

            <div className="flex items-start space-x-2 text-left">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="border-background data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor="privacy"
                className="text-sm opacity-80 leading-tight cursor-pointer"
              >
                Я согласен с{" "}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  className="text-primary underline hover:no-underline"
                >
                  политикой конфиденциальности
                </Link>
              </label>
            </div>
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
          
          <p className="text-sm opacity-60 mt-4">
            Без спама. Только по вашему проекту.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
