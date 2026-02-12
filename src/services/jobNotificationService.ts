import { supabase } from '@/lib/supabaseClient';
import { Job } from '@/types';

/**
 * Lógica de disparo de PUSH de vagas.
 * Idealmente disparada por um trigger de backend (Cloud Function).
 */
export const sendJobPushNotification = async (job: Job, companyName: string) => {
  console.log(`[JobPush] Analisando vaga: ${job.role}`);

  if (!job.isUrgentToday) {
    console.log(`[JobPush] Vaga não é urgente hoje. Ignorando PUSH.`);
    return;
  }

  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, fcmTokens, lastJobPushAt, jobCategories')
      .eq('jobsAlertsEnabled', true)
      .contains('jobCategories', [job.category]);

    if (error) throw error;
    if (!users || users.length === 0) {
      console.log(`[JobPush] Sem usuários compatíveis para categoria: ${job.category}`);
      return;
    }

    const now = new Date();
    const COOLDOWN_HOURS = 12;

    const recipients = users.filter(user => {
      if (user.lastJobPushAt) {
        const lastPush = new Date(user.lastJobPushAt);
        const diffInHours = (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60);
        if (diffInHours < COOLDOWN_HOURS) return false;
      }
      return user.fcmTokens && user.fcmTokens.length > 0;
    });

    if (recipients.length === 0) {
      console.log(`[JobPush] Usuários filtrados por cooldown (12h) ou falta de token.`);
      return;
    }

    console.log(`[JobPush] Enviando para ${recipients.length} dispositivos.`);
    
    for (const user of recipients) {
      await simulateFcmCall(user.fcmTokens, {
        title: `Vaga urgente hoje: ${job.category}`,
        body: `${companyName} precisa de ${job.role}. Toque para ver.`,
        data: { jobId: job.id, deepLink: 'jobs_list' }
      });

      await supabase
        .from('profiles')
        .update({ lastJobPushAt: now.toISOString() })
        .eq('id', user.id);
    }
    
  } catch (err) {
    console.error(`[JobPush] Erro fatal no disparo:`, err);
  }
};

const simulateFcmCall = async (tokens: string[], payload: any) => {
  await new Promise(r => setTimeout(r, 200));
  console.log(`[FCM-SIMULATOR] PUSH ENVIADO:`, payload);
  return true;
};