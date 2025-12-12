import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendToAmoCRM(leadData: {
  name: string;
  phone: string;
  width?: string;
  pillarHeight?: string;
  baseHeight?: string;
  fillType?: string;
  color?: string;
  gates?: string;
  lighting?: string;
}) {
  let subdomain = Deno.env.get("AMO_CRM_SUBDOMAIN") || "";
  const accessToken = Deno.env.get("AMO_CRM_ACCESS_TOKEN");

  subdomain = subdomain
    .replace(/^https?:\/\//i, "")
    .replace(/\.amocrm\.ru.*$/i, "")
    .replace(/\//g, "")
    .trim();

  if (!subdomain || !accessToken) {
    console.error("AMO CRM credentials not configured");
    return false;
  }

  const noteText = `
Заявка от AI-ассистента:
- Ширина участка: ${leadData.width || "не указано"}
- Высота столбов: ${leadData.pillarHeight || "не указано"}
- Высота цоколя: ${leadData.baseHeight || "не указано"}
- Тип заполнения: ${leadData.fillType || "не указано"}
- Цвет: ${leadData.color || "не указано"}
- Ворота/калитка: ${leadData.gates || "не указано"}
- Подсветка: ${leadData.lighting || "не указано"}
  `.trim();

  try {
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/unsorted/forms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          source_uid: `ai_assistant_${Date.now()}`,
          source_name: "AI-Ассистент БРИК",
          created_at: Math.floor(Date.now() / 1000),
          _embedded: {
            leads: [{ name: `AI-чат: ${leadData.name} | ${leadData.phone}` }],
            contacts: [{
              name: leadData.name,
              custom_fields_values: [{
                field_code: "PHONE",
                values: [{ value: leadData.phone, enum_code: "WORK" }]
              }]
            }]
          },
          metadata: {
            form_id: "ai_assistant_form",
            form_name: "AI-Ассистент БРИК",
            form_page: "https://brik-fence.ru",
            form_sent_at: Math.floor(Date.now() / 1000),
            ip: "127.0.0.1",
            referer: noteText.substring(0, 255)
          }
        }
      ])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AMO CRM error:", response.status, errorText);
      return false;
    }

    console.log("Lead sent to AMO CRM successfully");
    return true;
  } catch (error) {
    console.error("AMO CRM request failed:", error);
    return false;
  }
}

function getSystemPrompt(colors: string[], fills: string[]): string {
  const colorOptions = colors.length > 0 
    ? colors.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")
    : "1. Графит\n2. Коричневый\n3. Бежевый\n4. Терракот";
  
  const fillOptions = fills.length > 0
    ? fills.map((f: string, i: number) => `${i + 1}. ${f}`).join("\n")
    : "1. Профлист\n2. Штакетник\n3. Блоки БРИК";

  return `Ты — AI-ассистент компании БРИК, специализирующейся на премиальных лицевых заборах.

ТВОЯ ГЛАВНАЯ ЗАДАЧА: Собрать информацию для расчёта стоимости забора.

Для точного расчёта тебе нужно узнать:
1. Ширину участка (в метрах)
2. Желаемую высоту столбов
3. Желаемую высоту цоколя  
4. Тип заполнения (ВАЖНО: когда спрашиваешь про заполнение, добавь в конце [SHOW_FILLS])
5. Предпочтительный цвет столбов (ВАЖНО: когда спрашиваешь про цвет, добавь в конце [SHOW_COLORS])
6. Нужны ли ворота и/или калитка
7. Нужна ли архитектурная подсветка

После сбора всех параметров, попроси:
8. Имя клиента
9. Номер телефона для связи

ВАЖНЫЕ ПРАВИЛА:
- Задавай вопросы по одному, не все сразу
- Будь дружелюбным и кратким
- Предлагай варианты с нумерацией для удобного выбора
- НИКОГДА не используй звёздочки (*) или другое форматирование в ответах
- Пиши простым текстом без выделений
- Когда получишь имя и телефон, поблагодари и скажи что передашь заявку менеджеру
- Если клиент выбирает "Позвоните мне", сразу переходи к запросу имени и телефона

Тип заполнения (клиент увидит фотографии каждого варианта):
${fillOptions}

Цвет столбов (клиент увидит фотографии каждого цвета):
${colorOptions}

ИНФОРМАЦИЯ О ПРОДУКТЕ:
- Система ЛИЦЕВОЙ ЗАБОР БРИК — премиальное ограждение с натуральной колотой текстурой
- Монолитные армированные столбы (не пустотелые)
- Встроенная архитектурная подсветка
- Красивый с обеих сторон (симметрия 360 градусов)
- На 20-30% дешевле кирпичного забора

География работы: Москва и Московская область

ВАЖНО: Когда клиент даёт номер телефона, в конце своего ответа добавь специальный тег:
[LEAD_DATA]{"name":"имя","phone":"телефон","width":"ширина","pillarHeight":"высота столбов","baseHeight":"высота цоколя","fillType":"тип заполнения","color":"цвет","gates":"ворота/калитка","lighting":"подсветка"}[/LEAD_DATA]

Заполни все поля из собранной информации. Если какой-то параметр не был указан, напиши "не указано".`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, submitLead, colors, fills } = await req.json();
    
    if (submitLead) {
      console.log("Submitting lead to AMO CRM:", submitLead);
      const success = await sendToAmoCRM(submitLead);
      return new Response(
        JSON.stringify({ 
          leadSubmitted: success,
          reply: success 
            ? "Отлично! Я передал вашу заявку нашим специалистам. Они свяжутся с вами в ближайшее время для уточнения деталей и расчёта стоимости. Спасибо за интерес к заборам БРИК!" 
            : "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте оставить заявку через форму на сайте или позвоните нам."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get system prompt with static data
    const systemPrompt = getSystemPrompt(colors || [], fills || []);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Превышен лимит использования AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "Извините, не удалось получить ответ.";
    
    // Check for show colors/fills tags
    const showColors = reply.includes("[SHOW_COLORS]");
    const showFills = reply.includes("[SHOW_FILLS]");
    
    // Remove the tags from reply
    reply = reply.replace(/\[SHOW_COLORS\]/g, "").replace(/\[SHOW_FILLS\]/g, "").trim();
    
    // Check if there's lead data to extract
    let leadData = null;
    const leadMatch = reply.match(/\[?LEAD_DATA\]?\s*(\{.*?\})\s*\[?\/?LEAD_DATA\]?/s);
    if (leadMatch) {
      try {
        leadData = JSON.parse(leadMatch[1]);
        reply = reply
          .replace(/\[?LEAD_DATA\]?\s*\{.*?\}\s*\[?\/?LEAD_DATA\]?/gs, "")
          .replace(/LEAD_DATA/g, "")
          .replace(/\[\/LEAD_DATA\]/g, "")
          .trim();
        console.log("Extracted lead data:", leadData);
      } catch (e) {
        console.error("Failed to parse lead data:", e);
        reply = reply
          .replace(/\[?LEAD_DATA\]?.*?\[?\/?LEAD_DATA\]?/gs, "")
          .replace(/LEAD_DATA/g, "")
          .trim();
      }
    }

    console.log("AI Assistant: Response generated successfully");

    return new Response(
      JSON.stringify({ reply, leadData, showColors, showFills }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Произошла ошибка" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
