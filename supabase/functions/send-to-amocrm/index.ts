import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone } = await req.json();

    if (!name || !phone) {
      throw new Error('Name and phone are required');
    }

    let subdomain = Deno.env.get('AMO_CRM_SUBDOMAIN') || '';
    const accessToken = Deno.env.get('AMO_CRM_ACCESS_TOKEN');

    if (!subdomain || !accessToken) {
      throw new Error('AMO CRM credentials not configured');
    }

    // Extract just the subdomain if user entered full URL
    subdomain = subdomain
      .replace(/^https?:\/\//, '')  // Remove protocol
      .replace(/\.amocrm\.ru\/?.*$/, '')  // Remove domain suffix
      .trim();

    console.log(`Sending lead to AMO CRM subdomain: ${subdomain}, name: ${name}, phone: ${phone}`);

    // Create lead in "Неразобранное" (unsorted)
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/unsorted/forms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          source_uid: `website_${Date.now()}`,
          source_name: "Сайт БРИК",
          created_at: Math.floor(Date.now() / 1000),
          _embedded: {
            leads: [
              {
                name: `Заявка с сайта: ${name}`,
              }
            ],
            contacts: [
              {
                name: name,
                custom_fields_values: [
                  {
                    field_code: "PHONE",
                    values: [
                      {
                        value: phone,
                        enum_code: "WORK"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          metadata: {
            form_id: "brik_contact_form",
            form_name: "Форма заявки БРИК",
            form_page: "https://brik-fence.ru",
            form_sent_at: Math.floor(Date.now() / 1000),
          }
        }
      ]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AMO CRM API error:', errorText);
      throw new Error(`AMO CRM API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lead created successfully:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-to-amocrm function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
