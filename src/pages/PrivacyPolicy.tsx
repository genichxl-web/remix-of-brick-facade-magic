import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
            Политика конфиденциальности
          </h1>

          <p className="text-muted-foreground mb-6">
            Дата последнего обновления: {new Date().toLocaleDateString("ru-RU")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты
              персональных данных пользователей сайта компании БРИК (далее — «Компания»).
            </p>
            <p>
              Используя данный сайт и предоставляя свои персональные данные, Вы
              соглашаетесь с условиями настоящей Политики конфиденциальности.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Какие данные мы собираем</h2>
            <p>Мы можем собирать следующую информацию:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Имя и фамилия</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты</li>
              <li>Информация о вашем проекте (при консультации)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Цели сбора данных</h2>
            <p>Персональные данные собираются для следующих целей:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Обработка заявок и обратная связь</li>
              <li>Расчёт стоимости проекта</li>
              <li>Консультации по продукции и услугам</li>
              <li>Улучшение качества обслуживания</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Защита данных</h2>
            <p>
              Мы принимаем все необходимые организационные и технические меры для защиты
              ваших персональных данных от несанкционированного доступа, изменения,
              раскрытия или уничтожения.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Передача данных третьим лицам</h2>
            <p>
              Мы не передаём ваши персональные данные третьим лицам, за исключением
              случаев, предусмотренных законодательством Российской Федерации.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Использование cookies</h2>
            <p>
              Сайт может использовать cookies для улучшения пользовательского опыта и
              сбора анонимной статистики посещаемости.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Ваши права</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Запросить информацию о хранящихся персональных данных</li>
              <li>Потребовать исправления неточных данных</li>
              <li>Потребовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Контактная информация</h2>
            <p>
              По всем вопросам, связанным с обработкой персональных данных, вы можете
              обратиться по телефону: <strong>+7 960 573 17 23</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Изменение политики</h2>
            <p>
              Компания оставляет за собой право вносить изменения в настоящую Политику
              конфиденциальности. Актуальная версия всегда доступна на данной странице.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
