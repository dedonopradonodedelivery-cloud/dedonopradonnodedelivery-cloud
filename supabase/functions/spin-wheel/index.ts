import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.220.0/http/server.ts';

// Interface para o prêmio retornado da tabela `wheel_prizes`
interface DbPrize {
  id: string; // NEW: Added ID for prize
  value: number;
  label: string;
  prize_type: 'cash' | 'cooldown' | 'extra_spin'; // NEW: Updated DbPrize type
  weight: number;
  active: boolean;
}

// Interface para um prêmio específico de campanha
interface DbCampaignPrize {
  campaign_id: string;
  prize_value: number;
  weight: number;
  active: boolean;
}

// Interface para uma campanha
interface DbCampaign {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  daily_budget: number;
  monthly_budget: number;
  active: boolean;
}

// Interface para o prêmio selecionado na Edge Function (mapeamento para frontend)
interface EdgePrize {
  prize_key: string;
  prize_label: string;
  prize_type: 'cashback' | 'cupom' | 'nao_foi_dessa_vez' | 'gire_de_novo'; // Types understood by frontend
  prize_value: number; // The R$ value
  status: 'creditado' | 'pendente' | 'nao_aplicavel';
  weight: number; // For weighted random selection
}

// Interface para wheel_limits (global)
interface DbWheelLimits {
  daily_limit: number;
  monthly_limit: number;
  manual_override_active: boolean;
}

// Interface para merchant_wheel_limits (por lojista)
interface DbMerchantWheelLimits {
  merchant_id: string;
  daily_limit: number;
  monthly_limit: number;
  active: boolean;
}

// Interface para wheel_events insert
interface DbWheelEvent {
  event_type: string;
  reason?: string;
  event_data?: object;
}

// NOVO: Interfaces para Super Giro
interface DbSuperEvent {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  budget_total: number;
  budget_used: number;
  active: boolean;
}

interface DbSuperPrize {
  prize_value: number;
  weight: number;
  active: boolean;
}

interface DbSpinRecord { // For fetching last spin
  id: string;
  prize_value: number;
  prize_type: string; // 'cashback', 'nao_foi_dessa_vez', 'gire_de_novo'
  created_at: string;
}

// Função para selecionar um prêmio com base nos pesos
function selectWeightedPrize(prizePool: EdgePrize[]): EdgePrize {
  const totalWeight = prizePool.reduce((sum, prize) => sum + prize.weight, 0);
  if (totalWeight === 0) {
    // Fallback: If no prizes with weight, return a "not this time" or default low value
    const notThisTimePrize = { 
      prize_key: 'lose', 
      prize_label: 'Não foi dessa vez', 
      prize_type: 'nao_foi_dessa_vez' as 'nao_foi_dessa_vez', 
      prize_value: 0, 
      status: 'nao_aplicavel' as 'nao_aplicavel', 
      weight: 1 
    };
    if (prizePool.length > 0) {
      // If there are prizes but total weight is 0, pick a random one as a last resort.
      return prizePool[Math.floor(Math.random() * prizePool.length)];
    }
    return notThisTimePrize; // Fallback if pool is empty too
  }
  let random = Math.random() * totalWeight;

  for (const prize of prizePool) {
    if (random < prize.weight) {
      return prize;
    }
    random -= prize.weight;
  }
  return prizePool[prizePool.length - 1]; 
}

// Define the minimum safe prize that will be used in safe mode
// This prize MUST exist and be active in your `wheel_prizes` table with a value of 2.00
const MINIMUM_SAFE_PRIZE: EdgePrize = {
  prize_key: 'reais_2',
  prize_label: 'R$ 2 de Volta (Seguro)', 
  prize_type: 'cashback' as 'cashback',
  prize_value: 2.00,
  status: 'creditado' as 'creditado',
  weight: 100, // High weight to ensure it's picked if alone
};

// Constantes para as regras antifraude
const ANTI_LOOP_PERIOD_SECONDS = 5; // Tempo para evitar giros muito rápidos pelo mesmo usuário
const FRAUD_CHECK_PERIOD_MINUTES = 60; // Período para verificar múltiplos usuários por dispositivo/IP
const DEVICE_UNIQUE_USER_THRESHOLD = 3; // Limite de usuários únicos por dispositivo
const IP_UNIQUE_USER_THRESHOLD = 5; // Limite de usuários únicos por IP

serve(async (req) => {
  try {
    // 1. Valida o JWT do usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, message: 'Authorization header missing' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Cliente Supabase para autenticação do usuário (verifica o JWT)
    // @ts-ignore
    const userSupabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userSupabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ ok: false, message: 'Invalid or expired token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = user.id;

    // Extrair device_id e merchant_id do corpo da requisição
    const { device_id: request_device_id, merchant_id: request_merchant_id, dry_run } = await req.json();
    const deviceId = request_device_id || null;
    const merchantId = request_merchant_id || null; // NEW: merchant_id from request

    // Extrair IP do cabeçalho x-forwarded-for
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null;

    // 2. Configura cliente Supabase com service_role_key para acessar tabelas protegidas
    // @ts-ignore
    const serviceRoleSupabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // --- Anti-fraud and limit checks (existing logic) ---
    const antiLoopThreshold = new Date(Date.now() - ANTI_LOOP_PERIOD_SECONDS * 1000).toISOString();
    const { data: recentUserSpins, error: antiLoopError } = await userSupabaseClient
      .from('wheel_spins')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', antiLoopThreshold)
      .limit(1);

    if (antiLoopError) {
      console.error('Anti-loop check error:', antiLoopError);
      return new Response(JSON.stringify({ ok: false, message: 'Failed anti-loop check.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    if (recentUserSpins && recentUserSpins.length > 0) {
      return new Response(JSON.stringify({ ok: false, message: 'Aguarde para girar novamente.' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    // Device fraud check
    if (deviceId) {
      const deviceFraudCheckThreshold = new Date(Date.now() - FRAUD_CHECK_PERIOD_MINUTES * 60 * 1000).toISOString();
      const { data: deviceSpins, error: deviceSpinsError } = await serviceRoleSupabaseClient
        .from('wheel_spins')
        .select('user_id')
        .eq('device_id', deviceId)
        .gte('created_at', deviceFraudCheckThreshold);
      
      if (deviceSpinsError) {
        console.error('Device fraud check error:', deviceSpinsError);
        return new Response(JSON.stringify({ ok: false, message: 'Failed device fraud check.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const uniqueUsersOnDevice = new Set(deviceSpins.map(s => s.user_id));
      if (uniqueUsersOnDevice.size >= DEVICE_UNIQUE_USER_THRESHOLD) {
        console.warn(`[FRAUD] Device ${deviceId} exceeded unique user threshold: ${uniqueUsersOnDevice.size} users.`);
        return new Response(JSON.stringify({ ok: false, message: 'Detectamos atividades suspeitas neste dispositivo. Por favor, tente novamente mais tarde.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // IP fraud check
    if (ipAddress) {
      const ipFraudCheckThreshold = new Date(Date.now() - FRAUD_CHECK_PERIOD_MINUTES * 60 * 1000).toISOString();
      const { data: ipSpins, error: ipSpinsError } = await serviceRoleSupabaseClient
        .from('wheel_spins')
        .select('user_id')
        .eq('ip_address', ipAddress)
        .gte('created_at', ipFraudCheckThreshold);
      
      if (ipSpinsError) {
        console.error('IP fraud check error:', ipSpinsError);
        return new Response(JSON.stringify({ ok: false, message: 'Failed IP fraud check.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const uniqueUsersOnIp = new Set(ipSpins.map(s => s.user_id));
      if (uniqueUsersOnIp.size >= IP_UNIQUE_USER_THRESHOLD) {
        console.warn(`[FRAUD] IP ${ipAddress} exceeded unique user threshold: ${uniqueUsersOnIp.size} users.`);
        return new Response(JSON.stringify({ ok: false, message: 'Detectamos atividades suspeitas neste endereço IP. Por favor, tente novamente mais tarde.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // --- User Level and Daily Spin Limit (existing logic) ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const { data: userLevelData, error: userLevelError } = await serviceRoleSupabaseClient
      .from('user_levels')
      .select('level_id, wheel_user_levels(name, daily_spins, label_color)')
      .eq('user_id', userId)
      .single();

    if (userLevelError && userLevelError.code !== 'PGRST116') {
      console.error('Error fetching user level:', userLevelError);
      return new Response(JSON.stringify({ ok: false, message: 'Failed to retrieve user level.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const userLevelName = (userLevelData?.wheel_user_levels as any)?.name || 'Bronze';
    const maxDailySpins = (userLevelData?.wheel_user_levels as any)?.daily_spins || 1;
    const userLevelColor = (userLevelData?.wheel_user_levels as any)?.label_color || '#CD7F32';

    // NEW: Count spins today EXCLUDING 'gire_de_novo'
    const { count: spinsMadeToday, error: spinsCountError } = await userSupabaseClient
      .from('wheel_spins')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .neq('prize_type', 'gire_de_novo') // Exclude 'gire de novo' spins from daily limit count
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (spinsCountError) {
      console.error('Error counting user spins today:', spinsCountError);
      return new Response(JSON.stringify({ ok: false, message: 'Failed to count daily spins.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // --- NOVO: Lógica de Super Giro ---
    let activeSuperEvent: DbSuperEvent | null = null;
    let userHasSuperSpinAvailable = false;
    let superPrizePool: EdgePrize[] = [];
    let isSuperSpin = false;
    let superEventName: string | null = null;

    // 1. Verificar se há um Super Evento ativo
    const { data: superEventData, error: superEventError } = await serviceRoleSupabaseClient
      .from('wheel_super_events')
      .select('*')
      .eq('active', true)
      .lte('start_at', new Date().toISOString())
      .gte('end_at', new Date().toISOString())
      .limit(1)
      .single();

    if (superEventError && superEventError.code !== 'PGRST116') {
      console.error('Error fetching super event:', superEventError);
      // Fallback para roleta normal em caso de erro na consulta do evento
    } else if (superEventData) {
      activeSuperEvent = superEventData;
      superEventName = activeSuperEvent.name;

      // 2. Verificar se o usuário já girou nesse Super Evento
      const { count: userSuperSpinsCount, error: userSuperSpinsError } = await serviceRoleSupabaseClient
        .from('wheel_super_spins')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('event_id', activeSuperEvent.id);

      if (userSuperSpinsError) {
        console.error('Error checking user super spins:', userSuperSpinsError);
        // Fallback para roleta normal em caso de erro na consulta de giros do usuário
      } else if (userSuperSpinsCount === 0) {
        userHasSuperSpinAvailable = true;

        // 3. Buscar os prêmios do Super Evento
        const { data: superPrizesData, error: superPrizesError } = await serviceRoleSupabaseClient
          .from('wheel_super_prizes')
          .select('prize_value, weight, active')
          .eq('event_id', activeSuperEvent.id)
          .eq('active', true);
        
        if (superPrizesError) {
          console.error('Error fetching super prizes:', superPrizesError);
          // Fallback para roleta normal em caso de erro na consulta de prêmios
        } else if (superPrizesData && superPrizesData.length > 0) {
          superPrizePool = superPrizesData.map(p => ({
            prize_key: `super_reais_${p.prize_value}`,
            prize_label: `SUPER R$ ${p.prize_value.toFixed(2)} de Volta!`,
            prize_type: 'cashback' as 'cashback',
            prize_value: p.prize_value,
            status: 'creditado' as 'creditado',
            weight: p.weight,
          }));
        }
      }
    }

    // --- DRY RUN Logic (atualizado para incluir status do Super Giro) ---
    if (dry_run) {
      return new Response(JSON.stringify({ 
        ok: true, 
        message: 'Dry run successful.',
        spinsMadeToday,
        maxDailySpins,
        userLevelName,
        userLevelColor,
        isSuperSpinActive: !!activeSuperEvent && userHasSuperSpinAvailable && superPrizePool.length > 0,
        superEventName: superEventName,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Se NÃO for dry_run e o limite diário de giros da roleta normal foi atingido, retorna erro.
    // O Super Giro é um giro *adicional* e não conta para o limite diário normal,
    // mas a roleta normal não pode ser girada se o limite dela já foi atingido.
    if (spinsMadeToday >= maxDailySpins && (!activeSuperEvent || !userHasSuperSpinAvailable || superPrizePool.length === 0)) {
        return new Response(JSON.stringify({ 
            ok: false, 
            message: 'Limite diário de giros atingido.',
            spinsMadeToday,
            maxDailySpins,
            userLevelName,
            userLevelColor
        }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
    
    let selectedPrize: EdgePrize;

    // Tentar Super Giro primeiro
    if (activeSuperEvent && userHasSuperSpinAvailable && superPrizePool.length > 0) {
      const potentialSuperPrize = selectWeightedPrize(superPrizePool);
      
      // 4. Verificar Orçamento do Super Evento
      if ((activeSuperEvent.budget_used + potentialSuperPrize.prize_value) > activeSuperEvent.budget_total) {
          console.warn(`Super Evento ${activeSuperEvent.id} excedeu o orçamento. Prize Value: ${potentialSuperPrize.prize_value.toFixed(2)}, Used: ${activeSuperEvent.budget_used.toFixed(2)}, Total: ${activeSuperEvent.budget_total.toFixed(2)}`);
          // Orçamento excedido para este prêmio específico, cair para roleta normal
      } else {
          selectedPrize = potentialSuperPrize;
          isSuperSpin = true;
      }
    }

    // Se não foi um Super Giro ou se o orçamento do Super Giro foi excedido, usar a lógica da roleta normal/segura
    if (!isSuperSpin) {
      let isSafeModeActive = false;
      let safeModeReason = '';
      
      let currentDailyLimit = 0;
      let currentMonthlyLimit = 0;
      let manualOverrideActive = false;
      let totalSpentToday = 0;
      let totalSpentMonth = 0;

      // NEW: Check for merchant-specific limits first
      if (merchantId) {
        const { data: merchantLimits, error: merchantLimitsError } = await serviceRoleSupabaseClient
          .from('merchant_wheel_limits')
          .select('daily_limit, monthly_limit, active')
          .eq('merchant_id', merchantId)
          .eq('active', true)
          .single();

        if (merchantLimitsError && merchantLimitsError.code !== 'PGRST116') {
          console.error(`Error fetching merchant limits for ${merchantId}:`, merchantLimitsError);
          // Fallback to global limits in case of error
        } else if (merchantLimits) {
          currentDailyLimit = merchantLimits.daily_limit;
          currentMonthlyLimit = merchantLimits.monthly_limit;

          // Calculate spend specifically for this merchant
          const { data: merchantSpendData, error: merchantSpendError } = await serviceRoleSupabaseClient.rpc('get_current_spends', { p_merchant_id: merchantId });
          if (merchantSpendError) {
            console.error(`Error calculating merchant spends for ${merchantId}:`, merchantSpendError);
            isSafeModeActive = true;
            safeModeReason = `Erro ao calcular gastos do lojista ${merchantId}.`;
          } else {
            totalSpentToday = merchantSpendData[0]?.total_spent_today || 0;
            totalSpentMonth = merchantSpendData[0]?.total_spent_month || 0;

            if (totalSpentToday >= currentDailyLimit) {
              isSafeModeActive = true;
              safeModeReason = `Limite diário do lojista excedido (R$ ${currentDailyLimit.toFixed(2)}). Gasto atual: R$ ${totalSpentToday.toFixed(2)}.`;
              await serviceRoleSupabaseClient.from('wheel_events').insert({
                event_type: 'MERCHANT_LIMIT_EXCEEDED',
                reason: safeModeReason,
                event_data: { merchant_id: merchantId, limit_type: 'daily', limit_value: currentDailyLimit, actual_spend: totalSpentToday }
              });
            } else if (totalSpentMonth >= currentMonthlyLimit) {
              isSafeModeActive = true;
              safeModeReason = `Limite mensal do lojista excedido (R$ ${currentMonthlyLimit.toFixed(2)}). Gasto atual: R$ ${totalSpentMonth.toFixed(2)}.`;
              await serviceRoleSupabaseClient.from('wheel_events').insert({
                event_type: 'MERCHANT_LIMIT_EXCEEDED',
                reason: safeModeReason,
                event_data: { merchant_id: merchantId, limit_type: 'monthly', limit_value: currentMonthlyLimit, actual_spend: totalSpentMonth }
              });
            }
          }
        }
      }

      // If no merchant ID or merchant limits not exceeded, check global limits (existing logic)
      if (!isSafeModeActive) { // Only proceed to global check if not already in safe mode due to merchant limits
        const { data: wheelLimits, error: limitsError } = await serviceRoleSupabaseClient
          .from('wheel_limits')
          .select('daily_limit, monthly_limit, manual_override_active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (limitsError || !wheelLimits) {
          console.error('Error fetching wheel limits:', limitsError);
          isSafeModeActive = true;
          safeModeReason = 'Configuração de limites global não encontrada.';
        } else {
          currentDailyLimit = wheelLimits.daily_limit;
          currentMonthlyLimit = wheelLimits.monthly_limit;
          manualOverrideActive = wheelLimits.manual_override_active;

          const { data: totalSpendData, error: totalSpendError } = await serviceRoleSupabaseClient.rpc('get_current_spends');
          
          if (totalSpendError) {
            console.error('Error calculating current spends:', totalSpendError);
            isSafeModeActive = true;
            safeModeReason = 'Erro ao calcular gastos globais atuais.';
          } else {
            totalSpentToday = totalSpendData[0]?.total_spent_today || 0;
            totalSpentMonth = totalSpendData[0]?.total_spent_month || 0;

            if (manualOverrideActive) {
              isSafeModeActive = true;
              safeModeReason = 'Modo de sobrecarga manual ativo.';
            } else if (totalSpentToday >= currentDailyLimit) {
              isSafeModeActive = true;
              safeModeReason = `Limite diário global excedido (R$ ${currentDailyLimit.toFixed(2)}). Gasto atual: R$ ${totalSpentToday.toFixed(2)}.`;
            } else if (totalSpentMonth >= currentMonthlyLimit) {
              isSafeModeActive = true;
              safeModeReason = `Limite mensal global excedido (R$ ${currentMonthlyLimit.toFixed(2)}). Gasto atual: R$ ${totalSpentMonth.toFixed(2)}.`;
            }
          }
        }
      }

      // If safe mode is now active (either global or merchant-specific), log an event (only if not already active to avoid spam)
      if (isSafeModeActive) {
          const { data: lastEvent, error: eventCheckError } = await serviceRoleSupabaseClient
              .from('wheel_events')
              .select('id, created_at')
              .eq('event_type', 'ROLLBACK_ACTIVATED')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

          if (eventCheckError && eventCheckError.code !== 'PGRST116') { // PGRST116 = No rows found
              console.error('Error checking last rollback event:', eventCheckError);
          }

          const lastEventTime = lastEvent ? new Date(lastEvent.created_at).getTime() : 0;
          const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

          if (!lastEvent || lastEventTime < fiveMinutesAgo) {
              const eventData: DbWheelEvent = {
                  event_type: 'ROLLBACK_ACTIVATED',
                  reason: safeModeReason,
                  event_data: { 
                    actual_spend_today: totalSpentToday,
                    daily_limit: currentDailyLimit || 0,
                    actual_spend_month: totalSpentMonth,
                    monthly_limit: currentMonthlyLimit || 0,
                    merchant_id: merchantId // Include merchant_id if applicable
                  }
              };
              const { error: insertEventError } = await serviceRoleSupabaseClient
                  .from('wheel_events')
                  .insert(eventData);
              if (insertEventError) console.error('Error inserting ROLLBACK_ACTIVATED event:', insertEventError);
          }
      }

      let finalPrizePool: EdgePrize[] = [];
      const prizeValueMap = new Map<number, EdgePrize>();

      if (isSafeModeActive) {
        finalPrizePool = [MINIMUM_SAFE_PRIZE];
      } else {
        // Fetch prizes from the NEW wheel_prizes table
        const { data: dbBasePrizes, error: basePrizesError } = await serviceRoleSupabaseClient
          .from('wheel_prizes')
          .select('id, value, weight, active, label, prize_type') // Include prize_type
          .eq('active', true)
          .gt('weight', 0); // Only active prizes with weight

        if (basePrizesError) {
          console.error('Error fetching base prizes:', basePrizesError);
          return new Response(JSON.stringify({ ok: false, message: 'Failed to load base prize configuration.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Map DbPrize to EdgePrize
        dbBasePrizes.forEach(p => {
          let edgePrizeType: EdgePrize['prize_type'];
          let edgePrizeLabel = p.label;
          let edgePrizeKey = p.label.replace(/\s/g, '_').toLowerCase();

          switch (p.prize_type) {
            case 'cash':
              edgePrizeType = 'cashback';
              break;
            case 'cooldown':
              edgePrizeType = 'nao_foi_dessa_vez';
              edgePrizeLabel = 'Volte amanhã';
              edgePrizeKey = 'cooldown';
              break;
            case 'extra_spin':
              edgePrizeType = 'gire_de_novo';
              edgePrizeLabel = 'Gire de novo';
              edgePrizeKey = 'extra_spin';
              break;
            default:
              edgePrizeType = 'cashback'; // Default to cashback
          }

          const edgePrize: EdgePrize = {
            prize_key: edgePrizeKey,
            prize_label: edgePrizeLabel,
            prize_type: edgePrizeType,
            status: 'creditado', // Default status, can be refined
            prize_value: p.value,
            weight: p.weight,
          };
          prizeValueMap.set(p.value, edgePrize); // Using value as key in map, could be ID
        });

        // (Existing campaign logic remains, but simplified for brevity as the prompt focused on wheel_prizes)
        // Ensure campaign prizes are also mapped correctly
        const { data: activeCampaigns, error: campaignsError } = await serviceRoleSupabaseClient
          .from('wheel_campaigns')
          .select('id, name, start_at, end_at, daily_budget, monthly_budget, active')
          .eq('active', true)
          .lte('start_at', new Date().toISOString())
          .gte('end_at', new Date().toISOString());

        if (campaignsError) {
          console.error('Error fetching campaigns:', campaignsError);
          // Continue with base prizes if campaigns fail
        } else if (activeCampaigns.length > 0) {
          const isAnyCampaignBudgetExceeded = activeCampaigns.some(campaign => 
            totalSpentToday >= campaign.daily_budget || totalSpentMonth >= campaign.monthly_budget
          );

          if (!isAnyCampaignBudgetExceeded) {
            for (const campaign of activeCampaigns) {
              const { data: campaignPrizes, error: campaignPrizesError } = await serviceRoleSupabaseClient
                .from('wheel_campaign_prizes')
                .select('prize_value, weight, active')
                .eq('campaign_id', campaign.id)
                .eq('active', true);

              if (campaignPrizesError) {
                console.error(`Error fetching prizes for campaign ${campaign.id}:`, campaignPrizesError);
                continue;
              }

              campaignPrizes.filter(cp => cp.active && cp.weight > 0).forEach(cp => {
                const basePrize = dbBasePrizes.find(p => p.value === cp.prize_value); // Find base prize info
                const prizeLabel = basePrize ? basePrize.label : `R$ ${cp.prize_value.toFixed(2)} de Volta`;
                const prizeType = basePrize ? basePrize.prize_type : 'cash'; // Default to cash
                let edgePrizeType: EdgePrize['prize_type'];
                 switch (prizeType) {
                    case 'cash': edgePrizeType = 'cashback'; break;
                    case 'cooldown': edgePrizeType = 'nao_foi_dessa_vez'; break;
                    case 'extra_spin': edgePrizeType = 'gire_de_novo'; break;
                    default: edgePrizeType = 'cashback';
                 }

                const edgePrize: EdgePrize = {
                  prize_key: `campaign_${campaign.id}_reais_${cp.prize_value}`,
                  prize_label: prizeLabel,
                  prize_type: edgePrizeType,
                  prize_value: cp.prize_value,
                  status: 'creditado',
                  weight: cp.weight,
                };
                prizeValueMap.set(cp.prize_value, edgePrize);
              });
            }
          }
        }
        finalPrizePool = Array.from(prizeValueMap.values());
      }

      if (!finalPrizePool || finalPrizePool.length === 0) {
        return new Response(JSON.stringify({ ok: false, message: 'Nenhum prêmio ativo configurado no momento. Tente novamente mais tarde.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
      
      // NEW: Fetch user's last spin and check for 'gire_de_novo' today
      const { data: lastSpinData, error: lastSpinError } = await userSupabaseClient
        .from('wheel_spins')
        .select('prize_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      const lastSpin: DbSpinRecord | null = (lastSpinError && lastSpinError.code === 'PGRST116') ? null : (lastSpinData as DbSpinRecord);

      const { count: extraSpinsTodayCount, error: extraSpinsError } = await userSupabaseClient
        .from('wheel_spins')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('prize_type', 'gire_de_novo')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      if (extraSpinsError) {
        console.error('Error checking extra spins today:', extraSpinsError);
        // Fallback to not allowing extra spin if check fails
      }
      const userAlreadyHadExtraSpinToday = (extraSpinsTodayCount || 0) > 0;
      const lastSpinWasExtraSpin = lastSpin ? (lastSpin.prize_type === 'gire_de_novo') : false;

      // NEW: Apply "Gire de novo" specific rules
      let potentialPrize = selectWeightedPrize(finalPrizePool);
      let attempts = 0;
      const MAX_REROLL_ATTEMPTS = 5;

      while (potentialPrize.prize_type === 'gire_de_novo' && attempts < MAX_REROLL_ATTEMPTS) {
          if (userAlreadyHadExtraSpinToday) {
              console.log(`User ${userId} already had 'gire_de_novo' today. Re-rolling.`);
              const nonExtraSpinPool = finalPrizePool.filter(p => p.prize_type !== 'gire_de_novo');
              if (nonExtraSpinPool.length > 0) {
                  potentialPrize = selectWeightedPrize(nonExtraSpinPool);
              } else {
                  potentialPrize = MINIMUM_SAFE_PRIZE; // Fallback if no non-extra spins
              }
          } else if (lastSpinWasExtraSpin) {
              console.log(`Last spin for ${userId} was 'gire_de_novo'. Re-rolling.`);
              const nonExtraSpinPool = finalPrizePool.filter(p => p.prize_type !== 'gire_de_novo');
              if (nonExtraSpinPool.length > 0) {
                  potentialPrize = selectWeightedPrize(nonExtraSpinPool);
              } else {
                  potentialPrize = MINIMUM_SAFE_PRIZE; // Fallback if no non-extra spins
              }
          } else {
              // Valid 'gire_de_novo'
              break; 
          }
          attempts++;
      }

      selectedPrize = potentialPrize;


    // --- Registrar Giro e Atualizar Orçamentos ---
    const { error: insertSpinError } = await userSupabaseClient
      .from('wheel_spins')
      .insert({
        user_id: userId,
        merchant_id: merchantId, // NEW: Store merchant_id if present
        prize_value: selectedPrize.prize_value,
        prize_type: selectedPrize.prize_type,
        prize_label: selectedPrize.prize_label,
        status: selectedPrize.status,
        device_id: deviceId,
        ip_address: ipAddress,
        is_super_spin: isSuperSpin, // NOVO: Flag para Super Giro
      });

    if (insertSpinError) {
      console.error('Failed to record spin:', insertSpinError);
      return new Response(JSON.stringify({ ok: false, message: 'Failed to record spin result' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // NOVO: Se foi um Super Giro, atualizar o orçamento do evento e registrar em wheel_super_spins
    if (isSuperSpin && activeSuperEvent) {
      const { error: updateBudgetError } = await serviceRoleSupabaseClient
        .from('wheel_super_events')
        .update({ budget_used: activeSuperEvent.budget_used + selectedPrize.prize_value })
        .eq('id', activeSuperEvent.id);

      if (updateBudgetError) {
        console.error('Error updating super event budget:', updateBudgetError);
      }

      const { error: insertSuperSpinError } = await serviceRoleSupabaseClient
        .from('wheel_super_spins')
        .insert({
          user_id: userId,
          event_id: activeSuperEvent.id,
          prize_value: selectedPrize.prize_value,
        });
      if (insertSuperSpinError) {
        console.error('Error recording super spin:', insertSuperSpinError);
      }
    }

    return new Response(JSON.stringify({ 
      ok: true, 
      prizeValue: selectedPrize.prize_value,
      prizeType: selectedPrize.prize_type, // NEW: Return prizeType
      isSuperSpin: isSuperSpin, // NOVO: Retorna a flag para o frontend
      superEventName: superEventName, // NOVO: Retorna o nome do evento para o frontend
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ ok: false, message: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});