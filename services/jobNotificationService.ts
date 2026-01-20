import { supabase } from './supabase';
import { Job } from '../types';

/**
 * Lógica de disparo de PUSH de vagas.
 * Idealmente disparada por um trigger de backend (Cloud Function).
 */
export const sendJobPushNotification = async (job: Job, companyName: string) => {
  console.log(`[JobPush] Analisando vaga: ${job.role}`);

  // Regra 1: Apenas se for urgente para hoje (Anti-spam/Relevância V1)
  if (!job.isUrgentToday) {
    console.log(`[JobPush] Vaga não é urgente hoje. Ignorando PUSH.`);
    return;
  }

  try {
    // 1. Buscar usuários com alertas ativos e que tenham a categoria no array de interesses
    // Supabase .contains() para array no Postgres
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

    // 2. Filtrar destinatários (Anti-spam + Token válido)
    const recipients = users.filter(user => {
      // Regra Anti-spam: Máximo 1 push a cada 12 horas
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

    // 3. Simular envio FCM (Aqui seria admin.messaging().send() em produção)
    console.log(`[JobPush] Enviando para ${recipients.length} dispositivos.`);
    
    for (const user of recipients) {
      await simulateFcmCall(user.fcmTokens, {
        title: `Vaga urgente hoje: ${job.category}`,
        body: `${companyName} precisa de ${job.role}. Toque para ver.`,
        data: { jobId: job.id, deepLink: 'jobs_list' }
      });

      // 4. Atualizar lastJobPushAt para o usuário
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
