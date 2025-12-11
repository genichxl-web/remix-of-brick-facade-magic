import { Phone, Mail, MapPin } from "lucide-react";
const Footer = () => {
  return <footer className="py-12 bg-card border-t border-border">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="font-serif font-bold text-2xl text-primary mb-4">
              БРИК
            </div>
            <p className="text-muted-foreground">
              Премиальные лицевые заборы под ключ в Московской области
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <a href="tel:+79991234567" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">+7 960 573 17 23<Phone className="w-4 h-4" />
                +7 (999) 123-45-67
              </a>
              <a href="mailto:info@brik-zabor.ru" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                info@brik-zabor.ru
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">Офис и шоурум в г. Рязань, по адресу с.Дядьково 3, рядом с Лемана ПРО (Леруа Мерлен) <MapPin className="w-4 h-4" />
                Московская область
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Режим работы</h3>
            <p className="text-muted-foreground">
              Пн–Пт: 9:00–19:00<br />
              Сб: 10:00–17:00<br />
              Вс: выходной
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 БРИК. Все права защищены.
        </div>
      </div>
    </footer>;
};
export default Footer;