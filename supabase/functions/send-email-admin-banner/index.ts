
// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const sendEmail = async (emailContent: string) => {
  console.log("--- SENDING ADMIN NOTIFICATION EMAIL ---");
  console.log(emailContent);
  console.log("--- EMAIL SENT (SIMULATED) ---");
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { shopName, userId, bannerType, bannerConfig } = await req.json();

    if (!shopName || !userId || !bannerType || !bannerConfig) {
      throw new Error("Missing required data in request body.");
    }

    const generatePreview = (config: any) => {
      if (config.type === 'custom_editor') {
        return `
          <div style="background-color: ${config.background_color}; color: ${config.text_color}; padding: 20px; border-radius: 12px; font-family: sans-serif;">
            <h3 style="font-size: 24px; font-weight: bold; margin: 0;">${config.title}</h3>
            <p style="font-size: 14px; opacity: 0.8; margin-top: 8px;">${config.subtitle}</p>
          </div>
        `;
      }
      return '<p>Preview not available.</p>';
    }

    const emailBody = `
      <h1>Novo Banner Criado!</h1>
      <ul>
        <li><strong>Loja:</strong> ${shopName}</li>
        <li><strong>ID:</strong> ${userId}</li>
      </ul>
      ${generatePreview(bannerConfig)}
    `;

    await sendEmail(emailBody);

    return new Response(JSON.stringify({ message: "Notification sent" }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
