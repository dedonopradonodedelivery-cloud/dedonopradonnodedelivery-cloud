
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';

// Interface para as linhas da view de auditoria
interface WheelAuditRow {
  spin_id: string;
  spin_date: string;
  user_id: string;
  user_email: string;
  user_level_name: string;
  prize_value: number;
  prize_label: string;
  prize_type: string;
  spin_status: string;
  device_id: string;
  ip_address: string;
}

serve(async (req) => {
  try {
    // 1. Autenticação da Edge Function com service_role_key
    // A chave SUPABASE_SERVICE_ROLE_KEY DEVE ser configurada nas variáveis de ambiente da Edge Function.
    // @ts-ignore
    const serviceRoleSupabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // 2. Validação dos parâmetros de data
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get('start_date');
    const endDateParam = searchParams.get('end_date');

    if (!startDateParam || !endDateParam) {
      return new Response(JSON.stringify({ error: 'Parâmetros start_date e end_date são obrigatórios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new Response(JSON.stringify({ error: 'Formato de data inválido. Use YYYY-MM-DD.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ajusta endDate para o final do dia para incluir todos os registros do dia selecionado
    endDate.setHours(23, 59, 59, 999);

    // 3. Consulta à view de auditoria
    const { data, error } = await serviceRoleSupabaseClient
      .from('wheel_audit_view')
      .select('*')
      .gte('spin_date', startDate.toISOString())
      .lte('spin_date', endDate.toISOString())
      .order('spin_date', { ascending: true });

    if (error) {
      console.error('Erro ao consultar wheel_audit_view:', error);
      return new Response(JSON.stringify({ error: 'Erro ao buscar dados de auditoria.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const records: WheelAuditRow[] = data as WheelAuditRow[] || [];

    // 4. Formatação para CSV
    const csvRows: string[] = [];
    const headers = [
      'ID do Giro',
      'Data do Giro',
      'ID do Usuário',
      'Email do Usuário',
      'Nível do Usuário',
      'Valor do Prêmio (R$)',
      'Nome do Prêmio',
      'Tipo de Prêmio',
      'Status do Giro',
      'ID do Dispositivo',
      'Endereço IP',
    ];
    csvRows.push(headers.join(';')); // Usa ponto e vírgula como delimitador

    for (const record of records) {
      const row = [
        `"${record.spin_id}"`,
        `"${new Date(record.spin_date).toLocaleString('pt-BR')}"`,
        `"${record.user_id}"`,
        `"${record.user_email || 'N/A'}"`, // Pode ser nulo se o perfil não tiver e-mail
        `"${record.user_level_name || 'N/A'}"`, // Pode ser nulo se o user_level não for definido
        `"${record.prize_value.toFixed(2).replace('.', ',')}"`, // Formato monetário BR
        `"${record.prize_label}"`,
        `"${record.prize_type}"`,
        `"${record.spin_status}"`,
        `"${record.device_id || 'N/A'}"`,
        `"${record.ip_address || 'N/A'}"`,
      ];
      csvRows.push(row.join(';'));
    }

    const csvContent = csvRows.join('\n');

    // 5. Retorna o CSV
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="auditoria_roleta_${startDateParam}_${endDateParam}.csv"`,
      },
    });

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
