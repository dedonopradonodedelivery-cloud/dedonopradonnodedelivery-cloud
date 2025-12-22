import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';

// Interfaces
interface DbWheelLimits {
  daily_limit: number;
  monthly_limit: number;
  manual_override_active: boolean;
}

interface CurrentSpends {
  total_spent_today: number;
  total_spent_month: number;
}

interface DbWheelAlertLog {
  id: string;
  alert_type: string;
  threshold_value: number;
  current_spend: number;
  limit_value: number;
  alert_message: string;
  sent_at: string;
  period: 'day' | 'month';
  related_event_id?: string;
}

interface DbWheelEvent {
  id: string;
  event_type: string;
  reason?: string;
  created_at: string;
}

// Supabase client com service_role
const serviceRoleSupabase = createClient(
  // @ts-ignore
  Deno.env.get('SUPABASE_URL')!,
  // @ts-ignore
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// @ts-ignore
const WEBHOOK_URL = Deno.env.get('WHEEL_ALERT_WEBHOOK_URL');

// Helper para enviar alertas
async function sendAlert(message: string) {
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });
      console.log('Alerta enviado para o webhook:', message);
    } catch (error) {
      console.error('Erro ao enviar alerta para o webhook:', error);
    }
  } else {
    console.warn('WHEEL_ALERT_WEBHOOK_URL não configurada. Logando alerta no console:', message);
  }
}

serve(async (req) => {
  try {
    // 1. Obter gastos atuais (diário e mensal)
    const { data: spendsData, error: spendsError } = await serviceRoleSupabase.rpc('get_current_spends');
    if (spendsError) throw spendsError;
    const currentSpends: CurrentSpends = spendsData[0]; // RPC retorna um array com um objeto

    // 2. Obter limites da roleta
    const { data: limitsData, error: limitsError } = await serviceRoleSupabase
      .from('wheel_limits')
      .select('daily_limit, monthly_limit, manual_override_active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (limitsError || !limitsData) throw limitsError || new Error('Configuração de limites da roleta não encontrada.');

    const { daily_limit, monthly_limit, manual_override_active } = limitsData;

    // Se a sobrecarga manual estiver ativa, não verificamos limites automáticos
    if (manual_override_active) {
      console.log('Modo de sobrecarga manual ativo. Alertas de limite de custo desativados.');
    }

    // 3. Funções auxiliares para verificar alertas já enviados
    const getSentAlertForPeriod = async (
      alertType: string,
      period: 'day' | 'month'
    ): Promise<DbWheelAlertLog | null> => {
      const now = new Date();
      let startDate: Date;
      if (period === 'day') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else { // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      const { data, error } = await serviceRoleSupabase
        .from('wheel_alert_logs')
        .select('*')
        .eq('alert_type', alertType)
        .gte('sent_at', startDate.toISOString())
        .order('sent_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error(`Erro ao verificar alerta ${alertType}:`, error);
      }
      return data;
    };

    const logAndSendAlert = async (
      alertType: string,
      currentSpend: number,
      limitValue: number,
      message: string,
      period: 'day' | 'month',
      thresholdValue?: number,
      relatedEventId?: string
    ) => {
      await sendAlert(message);
      const { error: insertError } = await serviceRoleSupabase.from('wheel_alert_logs').insert({
        alert_type: alertType,
        threshold_value: thresholdValue,
        current_spend: currentSpend,
        limit_value: limitValue,
        alert_message: message,
        period: period,
        related_event_id: relatedEventId
      });
      if (insertError) console.error('Erro ao registrar alerta no log:', insertError);
    };

    // 4. Verificar limites de gasto (se não houver sobrecarga manual)
    if (!manual_override_active) {
      const thresholds = [50, 80, 100]; // Porcentagens para alertas

      // Diário
      if (daily_limit > 0) {
        const dailySpendPercentage = (currentSpends.total_spent_today / daily_limit) * 100;
        for (const threshold of thresholds) {
          const alertType = `DAILY_${threshold}`;
          if (dailySpendPercentage >= threshold) {
            const lastAlert = await getSentAlertForPeriod(alertType, 'day');
            if (!lastAlert) {
              const message = `Roleta: gasto diário atingiu ${threshold}% (R$ ${currentSpends.total_spent_today.toFixed(2)} de R$ ${daily_limit.toFixed(2)})`;
              await logAndSendAlert(alertType, currentSpends.total_spent_today, daily_limit, message, 'day', threshold);
            }
          }
        }
      }

      // Mensal
      if (monthly_limit > 0) {
        const monthlySpendPercentage = (currentSpends.total_spent_month / monthly_limit) * 100;
        for (const threshold of thresholds) {
          const alertType = `MONTHLY_${threshold}`;
          if (monthlySpendPercentage >= threshold) {
            const lastAlert = await getSentAlertForPeriod(alertType, 'month');
            if (!lastAlert) {
              const message = `Roleta: gasto mensal atingiu ${threshold}% (R$ ${currentSpends.total_spent_month.toFixed(2)} de R$ ${monthly_limit.toFixed(2)})`;
              await logAndSendAlert(alertType, currentSpends.total_spent_month, monthly_limit, message, 'month', threshold);
            }
          }
        }
      }
    }
    
    // 5. Verificar ativação de Rollback (eventos de segurança)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: newRollbackEvents, error: eventsError } = await serviceRoleSupabase
        .from('wheel_events')
        .select('id, reason, created_at')
        .eq('event_type', 'ROLLBACK_ACTIVATED')
        .gte('created_at', fiveMinutesAgo); // Busca eventos recentes de rollback

    if (eventsError) throw eventsError;

    for (const event of newRollbackEvents) {
        const lastRollbackAlert = await getSentAlertForPeriod('ROLLBACK_ACTIVATED', 'day'); // Considera o alerta de rollback por dia
        // Verifica se este evento específico já foi alertado ou se já alertamos hoje
        if (!lastRollbackAlert || new Date(event.created_at).getTime() > new Date(lastRollbackAlert.sent_at).getTime()) {
            const message = `Roleta: rollback ativado! (${event.reason || 'motivo desconhecido'})`;
            await logAndSendAlert(
                'ROLLBACK_ACTIVATED', 
                currentSpends.total_spent_today, 
                daily_limit, 
                message, 
                'day', 
                100, // Rollback é um limite crítico, pode ser 100% ou um valor especial
                event.id
            );
        }
    }


    return new Response(JSON.stringify({ message: 'Verificação de alertas da roleta concluída.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function wheel-alerts error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno na função de alertas.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});