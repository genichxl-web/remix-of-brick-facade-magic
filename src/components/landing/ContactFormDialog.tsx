import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactFormDialog = ({ open, onOpenChange }: ContactFormDialogProps) => {
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
      const { data, error } = await supabase.functions.invoke("send-to-amocrm", {
        body: { name, phone },
      });

      if (error) {
        throw error;
      }

      setName("");
      setPhone("");
      setPrivacyAccepted(false);
      onOpenChange(false);
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            📞 Рассчитаем стоимость за 10 минут
          </DialogTitle>
          <DialogDescription>
            Оставьте заявку, и мы свяжемся с вами для бесплатной консультации
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="dialog-name">Ваше имя</Label>
            <Input
              id="dialog-name"
              type="text"
              placeholder="Как к вам обращаться?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dialog-phone">Телефон</Label>
            <Input
              id="dialog-phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="dialog-privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
            />
            <label
              htmlFor="dialog-privacy"
              className="text-sm text-muted-foreground leading-tight cursor-pointer"
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

        <p className="text-sm text-muted-foreground text-center">
          Без спама. Только по вашему проекту.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
