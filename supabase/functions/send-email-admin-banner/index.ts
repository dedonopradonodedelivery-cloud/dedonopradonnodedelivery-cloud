// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// In a real scenario, you would use a proper email client like Postmark, SendGrid, or Resend.
// For this simulation, we'll just log the email content.
const sendEmail = async (emailContent: string) => {
  console.log("--- SENDING ADMIN NOTIFICATION EMAIL ---");
  console.log(emailContent);
  console.log("--- EMAIL SENT (SIMULATED) ---");
  // Simulating a network request to an email provider
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
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

    // Basic validation
    if (!shopName || !userId || !bannerType || !bannerConfig) {
      throw new Error("Missing required data in request body.");
    }

    // Generate a simple HTML preview for the email
    const generatePreview = (config: any) => {
      if (config.type === 'custom_editor') {
        return `
          <div style="background-color: ${config.background_color}; color: ${config.text_color}; padding: 20px; border-radius: 12px; font-family: sans-serif;">
            <h3 style="font-size: 24px; font-weight: bold; margin: 0;">${config.title}</h3>
            <p style="font-size: 14px; opacity: 0.8; margin-top: 8px;">${config.subtitle}</p>
          </div>
        `;
      }
      if (config.type === 'template') {
        return `
          <div style="background-color: #334155; color: white; padding: 20px; border-radius: 12px; font-family: sans-serif;">
            <p><strong>Template:</strong> ${config.template_id}</p>
            <p><strong>Headline:</strong> ${config.headline || 'N/A'}</p>
            <p><strong>Subheadline:</strong> ${config.subheadline || 'N/A'}</p>
          </div>
        `;
      }
      return '<p>Preview not available.</p>';
    }

    const emailBody = `
      <h1>Novo Banner Criado! (Primeiro Anúncio)</h1>
      <p>Um lojista publicou seu primeiro banner. O anúncio já está <strong>ATIVO</strong> no app.</p>
      <ul>
        <li><strong>Nome da Loja:</strong> ${shopName}</li>
        <li><strong>ID do Lojista:</strong> ${userId}</li>
        <li><strong>Tipo de Banner:</strong> ${bannerType}</li>
        <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
      </ul>
      <h2>Preview Visual do Banner:</h2>
      ${generatePreview(bannerConfig)}
      <h2>Configuração JSON:</h2>
      <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 8px; font-family: monospace;">${JSON.stringify(bannerConfig, null, 2)}</pre>
      <p>Nenhuma ação é necessária, mas você pode revisar a publicação no painel de administração.</p>
    `;

    // Send the email (simulated)
    await sendEmail(emailBody);

    return new Response(JSON.stringify({ message: "Notification sent successfully" }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 400,
    });
  }
});
