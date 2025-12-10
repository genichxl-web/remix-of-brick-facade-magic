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

    // Create a lead in AMO CRM
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          name: `Заявка с сайта: ${name}`,
          _embedded: {
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
