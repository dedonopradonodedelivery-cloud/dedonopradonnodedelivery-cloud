
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Gift, RefreshCw, ThumbsDown, History, Wallet, Volume2, VolumeX, Lock, ArrowRight, Dices, AlertTriangle, Loader2, Award } from 'lucide-react';
import { ROULETTE_TRANSPARENCY_MESSAGES } from '../constants'; // Importa as novas mensagens de transparência

// --- Tipos e Constantes ---
interface SpinWheelViewProps {
  userId: string | null;
  userRole: 'cliente' | 'lojista' | null;
  onWin: (reward: any) => void;
  onRequireLogin: () => void;
  onViewHistory: () => void;
  merchantId?: string | null; // NEW: Optional merchantId prop
}

interface Prize {
  prize_key: string;
  line1: string;
  line2: string;
  prize_label: string;
  prize_type: 'cashback' | 'cupom' | 'nao_foi_dessa_vez' | 'gire_de_novo';
  prize_value?: number; // Numeric value (R$) or percentage
  prize_code?: string; // For coupons
  status: 'creditado' | 'pendente' | 'nao_aplicavel';
  color: string;
  textColor: string;
  description: string;
}

interface UserLevelInfo {
  name: string;
  daily_spins: number;
  label_color: string;
}

// PRIZES: Array de prêmios da roleta (VISUAL - 8 segmentos)
// Os prize_value agora correspondem aos valores fixos em R$ que o backend sorteia.
// Ajustados os labels e o prize_key para corresponder aos prize_type do backend
const PRIZES: Prize[] = [
  { prize_key: 'cashback_2', line1: 'R$ 2', line2: 'de Volta', prize_label: 'R$ 2,00 de Volta', prize_type: 'cashback', prize_value: 2.00, status: 'creditado', color: '#00C853', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' },
  { prize_key: 'cashback_5', line1: 'R$ 5', line2: 'de Volta', prize_label: 'R$ 5,00 de Volta', prize_type: 'cashback', prize_value: 5.00, status: 'creditado', color: '#2962FF', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' },
  { prize_key: 'cashback_7', line1: 'R$ 7', line2: 'de Volta', prize_label: 'R$ 7,00 de Volta', prize_type: 'cashback', prize_value: 7.00, status: 'creditado', color: '#AA00FF', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' },
  { prize_key: 'cashback_10', line1: 'R$ 10', line2: 'de Volta', prize_label: 'R$ 10,00 de Volta', prize_type: 'cashback', prize_value: 10.00, status: 'creditado', color: '#00B8D4', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' },
  { prize_key: 'nao_foi_dessa_vez', line1: 'Não foi', line2: 'dessa vez', prize_label: 'Não foi dessa vez', prize_type: 'nao_foi_dessa_vez', prize_value: 0, status: 'nao_aplicavel', color: '#D50000', textColor: '#FFFFFF', description: 'Tente novamente amanhã para ganhar prêmios.' },
  { prize_key: 'gire_de_novo', line1: 'Gire', line2: 'de Novo', prize_label: 'Gire de Novo', prize_type: 'gire_de_novo', prize_value: 0, status: 'nao_aplicavel', color: '#FF6D00', textColor: '#FFFFFF', description: 'Você ganhou uma nova chance! Gire a roleta novamente.' },
  { prize_key: 'cashback_15', line1: 'R$ 15', line2: 'de Volta', prize_label: 'R$ 15,00 de Volta', prize_type: 'cashback', prize_value: 15.00, status: 'creditado', color: '#C51162', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' },
  { prize_key: 'cashback_50', line1: 'R$ 50', line2: 'de Volta', prize_label: 'R$ 50,00 de Volta', prize_type: 'cashback', prize_value: 50.00, status: 'creditado', color: '#4CAF50', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' },
];

const SEGMENT_COUNT = PRIZES.length; // Agora 8 segmentos
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const SPIN_DURATION_MS = 4500;

const SOUND_URLS = {
  spin: "https://assets.mixkit.co/sfx/preview/mixkit-game-wheel-spinning-2012.mp3",
  win: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
  lose: "https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3",
};

type SpinStatus = 'loading' | 'ready' | 'limit_reached' | 'no_user' | 'error';

export const SpinWheelView: React.FC<SpinWheelViewProps> = ({ userId, userRole, onWin, onRequireLogin, onViewHistory, merchantId = null }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinStatus, setSpinStatus] = useState<SpinStatus>('loading');
  // NOVO: Adiciona estados para resultado de Super Giro
  const [spinResult, setSpinResult] = useState<Prize | null>(null);
  const [isSuperSpinResult, setIsSuperSpinResult] = useState(false);
  const [superEventWonName, setSuperEventWonName] = useState<string | null>(null);

  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('localizei_wheel_muted') === 'true');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Novos estados para níveis de usuário
  const [userLevel, setUserLevel] = useState<UserLevelInfo>({ name: 'Bronze', daily_spins: 1, label_color: '#CD7F32' });
  const [spinsMadeToday, setSpinsMadeToday] = useState(0);
  const spinsRemaining = userLevel.daily_spins - spinsMadeToday;

  // NOVO: Estados para Super Giro (disponibilidade)
  const [isSuperSpinActive, setIsSuperSpinActive] = useState(false);
  const [superEventName, setSuperEventName] = useState<string | null>(null);


  const isMutedRef = useRef(isMuted);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({ spin: null, win: null, lose: null });

  // Efeito para gerar ou carregar device_id do localStorage
  useEffect(() => {
    let currentDeviceId = localStorage.getItem('localizei_device_id');
    if (!currentDeviceId) {
      currentDeviceId = crypto.randomUUID();
      localStorage.setItem('localizei_device_id', currentDeviceId);
    }
    setDeviceId(currentDeviceId);
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;
    localStorage.setItem('localizei_wheel_muted', String(isMuted));
    if (isSpinning) {
      if (isMuted) stopSound('spin');
      else playSound('spin');
    }
  }, [isMuted, isSpinning]);

  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });
    if (audioRefs.current.spin) {
        audioRefs.current.spin.loop = true;
        audioRefs.current.spin.volume = 0.3;
    }
    if (audioRefs.current.win) audioRefs.current.win.volume = 0.6;
    if (audioRefs.current.lose) audioRefs.current.lose.volume = 0.5;
  }, []);
  
  const playSound = (key: 'spin' | 'win' | 'lose') => {
    if (isMutedRef.current) return;
    const audio = audioRefs.current[key];
    if (audio) {
      if (key === 'spin') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        stopSound('spin');
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
  };

  const stopSound = (key: 'spin' | 'win' | 'lose') => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  // Nova função para buscar o status de giros do usuário (nível, giros feitos hoje)
  const fetchSpinLimits = async (currentUserId: string) => {
    if (!currentUserId) {
      setSpinStatus('no_user');
      return;
    }
    setErrorMessage(null);
    setSpinStatus('loading');
    setIsSuperSpinActive(false); // Reset Super Spin status
    setSuperEventName(null);

    try {
      const { data, error: edgeFunctionError } = await supabase.functions.invoke('spin-wheel', {
        method: 'POST',
        body: { device_id: deviceId, dry_run: true, merchant_id: merchantId }, // NEW: Pass merchantId
      });

      if (edgeFunctionError) {
        throw edgeFunctionError;
      }
      
      if (!data.ok) {
        if (data.message === 'Limite diário de giros atingido.') {
          setSpinsMadeToday(data.spinsMadeToday);
          setUserLevel({
            name: data.userLevelName,
            daily_spins: data.maxDailySpins,
            label_color: data.userLevelColor
          });
          setSpinStatus('limit_reached');
        } else {
          setErrorMessage(data.message || "Erro desconhecido ao verificar giros.");
          setSpinStatus('error');
        }
      } else {
        // Sucesso na dry_run
        setSpinsMadeToday(data.spinsMadeToday || 0);
        setUserLevel({
          name: data.userLevelName || 'Bronze',
          daily_spins: data.maxDailySpins || 1,
          label_color: data.userLevelColor || '#CD7F32'
        });
        setSpinStatus('ready');

        // NOVO: Atualiza o status do Super Giro
        setIsSuperSpinActive(data.isSuperSpinActive || false);
        setSuperEventName(data.superEventName || null);
      }

    } catch (err: any) {
      console.error("Erro ao verificar limite de giros:", err);
      setErrorMessage(err.message || "Erro ao carregar status dos giros.");
      setSpinStatus('error');
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (userId) {
      fetchSpinLimits(userId);
    } else {
      if (isMounted) setSpinStatus('no_user');
    }
    return () => { isMounted = false; };
  }, [userId, deviceId, merchantId]); // Depende de userId, deviceId e merchantId

  const handleSpin = async () => {
    if (userRole === 'lojista') return;
    if (isSpinning || spinStatus === 'loading' || spinStatus === 'error' || !deviceId) {
      if (spinStatus === 'no_user') onRequireLogin();
      return;
    }

    // Se houver Super Giro ativo e o usuário ainda pode girar, ignora o limite diário normal
    const canSpinNormal = spinsRemaining > 0;
    const canSpinSuper = isSuperSpinActive;

    if (!canSpinNormal && !canSpinSuper) {
        setErrorMessage(`Você atingiu o limite de giros diários (${userLevel.daily_spins}).`);
        setSpinStatus('limit_reached');
        return;
    }
    
    // Adiciona verificação para deviceId antes de girar
    if (!deviceId) {
        setErrorMessage("Erro: ID do dispositivo não identificado. Recarregue a página.");
        setSpinStatus('error');
        return;
    }

    setIsSpinning(true);
    setSpinResult(null);
    setIsSuperSpinResult(false); // Reset Super Spin result flag
    setSuperEventWonName(null);
    setErrorMessage(null);
    playSound('spin');

    try {
      const { data, error: edgeFunctionError } = await supabase.functions.invoke('spin-wheel', {
        method: 'POST',
        body: { device_id: deviceId, merchant_id: merchantId }, // NEW: Pass merchantId
      });
      
      if (edgeFunctionError) {
        throw new Error(edgeFunctionError.message || 'Erro ao chamar função de sorteio.');
      }
      
      if (!data.ok) {
        if (data.message === 'Limite diário de giros atingido.') {
            setSpinsMadeToday(data.spinsMadeToday);
            setUserLevel({
              name: data.userLevelName,
              daily_spins: data.maxDailySpins,
              label_color: data.userLevelColor
            });
            setErrorMessage(`Você atingiu o limite diário de giros (${data.maxDailySpins}).`);
            setSpinStatus('limit_reached');
        } else {
            setErrorMessage(data.message || 'Erro desconhecido no sorteio.');
            setSpinStatus('error');
        }
        setIsSpinning(false);
        stopSound('spin');
        // Após um giro normal falhar por limite, re-fetch para atualizar o status do Super Giro se houver
        if (!isSuperSpinActive) fetchSpinLimits(userId as string);
        return;
      }

      const { prizeValue, prizeType, isSuperSpin: resultIsSuperSpin, superEventName: resultSuperEventName } = data;
      
      // Encontra o prêmio correspondente no array local do frontend, usando prizeType e prizeValue
      let winningPrize: Prize | undefined;
      if (prizeType === 'cashback') {
        winningPrize = PRIZES.find(p => p.prize_type === 'cashback' && p.prize_value === prizeValue);
      } else {
        winningPrize = PRIZES.find(p => p.prize_type === prizeType);
      }
      
      // Fallback para um prêmio genérico se o backend retornar algo inesperado
      let finalWinningPrize = winningPrize;
      if (!finalWinningPrize) {
        if (resultIsSuperSpin) {
          finalWinningPrize = {
            prize_key: `super_reais_${prizeValue}`,
            line1: `SUPER R$ ${prizeValue.toFixed(2).replace('.',',')}`,
            line2: '!!!',
            prize_label: `SUPER R$ ${prizeValue.toFixed(2).replace('.',',')} de Volta!`,
            prize_type: 'cashback' as 'cashback',
            prize_value: prizeValue,
            status: 'creditado' as 'creditado',
            color: '#FFD600', // Gold color for super prize
            textColor: '#000000',
            description: `Você ganhou R$ ${prizeValue.toFixed(2).replace('.',',')} de volta em um SUPER GIRO!`,
          };
        } else if (prizeType === 'gire_de_novo') {
          finalWinningPrize = PRIZES.find(p => p.prize_type === 'gire_de_novo');
        } else if (prizeType === 'nao_foi_dessa_vez') {
          finalWinningPrize = PRIZES.find(p => p.prize_type === 'nao_foi_dessa_vez');
        } else {
          // Último recurso: prêmio monetário padrão
          finalWinningPrize = PRIZES.find(p => p.prize_value === 2.00) || PRIZES[0]; 
        }
        if (!finalWinningPrize) throw new Error(`Backend retornou um prêmio desconhecido e sem fallback: ${prizeType} - ${prizeValue}`);
      }

      const winningSegmentIndex = PRIZES.indexOf(finalWinningPrize); 
      if (winningSegmentIndex === -1) { 
        throw new Error("Segmento do prêmio não encontrado na roleta visual.");
      }

      const segmentCenter = winningSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const baseRotation = 360 * 6; // Pelo menos 6 voltas
      const randomOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6); // Pequeno offset para variar
      const finalAngle = 270 - segmentCenter + randomOffset; // 270 para o topo da roleta
      const targetRotation = rotation + baseRotation + (360 - (rotation % 360)) + finalAngle;

      setRotation(targetRotation);

      setTimeout(() => {
        stopSound('spin');
        playSound(finalWinningPrize?.prize_type === 'nao_foi_dessa_vez' ? 'lose' : 'win');
        setSpinResult(finalWinningPrize);
        setIsSuperSpinResult(resultIsSuperSpin); // Define a flag de Super Giro
        setSuperEventWonName(resultSuperEventName);

        // A contagem de spinsMadeToday já é tratada pelo backend (exclui 'gire_de_novo')
        // Então o fetchSpinLimits vai sempre pegar o estado correto
        if (!resultIsSuperSpin && finalWinningPrize?.prize_type !== 'gire_de_novo') {
          setSpinsMadeToday(prev => prev + 1); // Apenas para giros que consomem o limite normal
          if (spinsMadeToday + 1 >= userLevel.daily_spins) {
              setSpinStatus('limit_reached');
          } else {
              setSpinStatus('ready');
          }
        } else if (finalWinningPrize?.prize_type === 'gire_de_novo') {
          setSpinStatus('ready'); // Apenas libera o botão novamente
        } else {
          // Para Super Giro, o status do Super Giro passa a ser 'indisponível' (re-fetch vai lidar)
          setIsSuperSpinActive(false); 
          setSuperEventName(null);
          setSpinStatus('ready'); // Mantém o status 'ready' para a roleta normal, se disponível
        }
        setIsSpinning(false);
      }, SPIN_DURATION_MS);

    } catch (err: any) {
      console.error("Erro no giro da roleta:", err);
      stopSound('spin');
      setErrorMessage(err.message || "Ocorreu um erro ao girar a roleta. Tente novamente.");
      setSpinStatus('error');
      setIsSpinning(false);
      // Re-fetch status se falha não foi por limite, para atualizar Super Giro status.
      fetchSpinLimits(userId as string);
    }
  };

  const handleClaimReward = () => {
    if (!spinResult) return;

    if (spinResult.prize_type === 'cashback') {
        onViewHistory(); 
    } else if (spinResult.prize_type === 'cupom') {
        onWin({ label: spinResult.prize_label, code: spinResult.prize_code || 'CODE123', value: spinResult.prize_value?.toString() || '0', description: spinResult.description });
    } else if (spinResult.prize_type === 'gire_de_novo') { 
        setSpinResult(null); 
        // Não atualiza spinsMadeToday aqui, pois o backend já cuida disso e a UI será atualizada no fetchSpinLimits
        // Força um re-fetch para garantir que o número de giros restantes esteja correto, especialmente após um "Gire de novo"
        fetchSpinLimits(userId as string);
    } else { // nao_foi_dessa_vez
        setSpinResult(null);
        // Força um re-fetch para garantir que o número de giros restantes esteja correto
        fetchSpinLimits(userId as string);
    }
  };

  const getPath = (index: number) => {
    const angle = SEGMENT_ANGLE;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;
    const startRad = (Math.PI / 180) * startAngle;
    const endRad = (Math.PI / 180) * endAngle;
    const start = { x: 100 + 100 * Math.cos(startRad), y: 100 + 100 * Math.sin(startRad) };
    const end = { x: 100 + 100 * Math.cos(endRad), y: 100 + 100 * Math.sin(endRad) };
    return `M100,100 L${start.x},${start.y} A100,100 0 0,1 ${end.x},${end.y} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const rad = midAngle * (Math.PI / 180);
    const radius = 70;
    const x = 100 + radius * Math.cos(rad);
    const y = 100 + radius * Math.sin(rad);
    return { x, y, rotation: midAngle }; 
  };

  return (
    <div className="bg-[#F7F7F7] dark:bg-gray-900 rounded-t-[40px] shadow-2xl p-6 pt-4 w-full max-w-md mx-auto relative overflow-hidden font-sans">
      <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
      
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 text-gray-400 hover:text-gray-600 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="flex flex-col items-center relative">
          <h2 className="text-xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tight">Tente a Sorte!</h2>
          {isSuperSpinActive && (
            <span className="mt-1 flex items-center gap-1.5 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold shadow-md animate-pulse">
              <Award className="w-4 h-4" />
              SUPER GIRO!
            </span>
          )}
        </div>
        <button onClick={onViewHistory} className="p-2.5 text-gray-400 hover:text-gray-600 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <History size={20} />
        </button>
      </div>
      
      <div className="relative w-full max-w-[300px] mx-auto aspect-square flex items-center justify-center mb-8">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none filter drop-shadow-xl">
          <div className="w-8 h-10 bg-white clip-triangle" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-600 rounded-t-full"></div>
        </div>

        <div className="absolute inset-[-12px] rounded-full bg-gradient-to-b from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 shadow-2xl border-[4px] border-white/50 dark:border-gray-800/50"></div>
        
        <div 
          className="relative w-full h-full rounded-full transition-transform border-[8px] border-white dark:border-gray-800 shadow-inner z-10"
          style={{ 
            transform: `rotate(${rotation}deg)`, 
            transitionDuration: `${isSpinning ? SPIN_DURATION_MS : 0}ms`,
            transitionTimingFunction: 'cubic-bezier(0.15, 0, 0.15, 1)' 
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full rounded-full overflow-hidden">
            {PRIZES.map((prize, i) => {
              const { x, y, rotation } = getTextPosition(i);
              return (
                <g key={i}>
                  <path d={getPath(i)} fill={prize.color} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                  <text 
                    x={x} y={y} fill={prize.textColor} fontSize="6.5" fontWeight="900" textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${rotation + 90}, ${x}, ${y})`}
                  >
                    <tspan x={x} dy="-3">{prize.line1}</tspan>
                    <tspan x={x} dy="8">{prize.line2}</tspan>
                  </text>
                  <circle cx={100 + 94 * Math.cos(((i * SEGMENT_ANGLE) + SEGMENT_ANGLE/2) * Math.PI / 180)} cy={100 + 94 * Math.sin(((i * SEGMENT_ANGLE) + SEGMENT_ANGLE/2) * Math.PI / 180)} r="2" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-2xl z-20 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E5BFF] to-[#0039A6] rounded-full flex items-center justify-center shadow-inner">
                <Dices className="w-6 h-6 text-white" />
            </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mb-6 px-4 leading-tight">
        {ROULETTE_TRANSPARENCY_MESSAGES.DISCLAIMER_BOTTOM}
      </p>

      <div className="mb-6">
        {userRole === 'lojista' ? (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">A Roleta é exclusiva para Clientes.</p>
          </div>
        ) : spinStatus === 'loading' ? (
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mx-auto mb-2" />
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Verificando giros...</p>
            </div>
        ) : (
          <div className="text-center bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            {isSuperSpinActive ? (
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">
                SUPER GIRO DISPONÍVEL!
              </p>
            ) : (
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Giros restantes hoje: {spinsRemaining} / {userLevel.daily_spins}
              </p>
            )}
            
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                Nível: <span style={{ color: userLevel.label_color }}>{userLevel.name}</span>
            </p>
            {errorMessage && spinStatus !== 'limit_reached' && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}
        
        <button 
            onClick={handleSpin} 
            disabled={isSpinning || spinStatus === 'loading' || spinStatus === 'error' || !deviceId || (!isSuperSpinActive && spinsRemaining <= 0)} 
            className="w-full h-16 bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.97] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 mt-4"
          >
            {isSpinning ? <RefreshCw className="w-6 h-6 animate-spin" /> : 
             spinStatus === 'loading' ? <Loader2 className="w-6 h-6 animate-spin" /> :
             isSuperSpinActive ? `SUPER GIRAR AGORA! ${superEventName ? `(${superEventName})` : ''}` :
             spinsRemaining <= 0 ? 'LIMITE DIÁRIO ATINGIDO' :
             'GIRAR AGORA!'}
          </button>
        {errorMessage && spinsRemaining <= 0 && !isSuperSpinActive && (
          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{errorMessage || `Você atingiu o limite diário de giros (${userLevel.daily_spins}).`}</span>
          </div>
        )}
      </div>

      {spinResult && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="text-center flex flex-col items-center max-w-xs">
               <div className="mb-8 p-8 rounded-full shadow-2xl animate-bounce-short border-4 border-white dark:border-gray-800" style={{ backgroundColor: spinResult.color }}>
                    {spinResult.prize_type === 'nao_foi_dessa_vez' ? <ThumbsDown size={56} color="#FFF" /> : <Gift size={56} color={spinResult.textColor} />}
               </div>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                   {spinResult.prize_type === 'nao_foi_dessa_vez' ? 'Poxa!' : 'PARABÉNS!'}
               </h3>
               {isSuperSpinResult && superEventWonName ? (
                 <p className="text-xl font-black mb-4 uppercase tracking-tight text-yellow-600">
                   {spinResult.prize_label} <span className="text-lg">({superEventWonName})</span>
                 </p>
               ) : (
                 <p className="text-xl font-black mb-4 uppercase tracking-tight" style={{ color: spinResult.color }}>
                   {spinResult.prize_label}
                 </p>
               )}
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                   {spinResult.description}
               </p>
               <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mb-4 leading-tight">
                 {ROULETTE_TRANSPARENCY_MESSAGES.DISCLAIMER_MODAL}
               </p>
               <button 
                 onClick={handleClaimReward}
                 className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
               >
                 {spinResult.prize_type === 'nao_foi_dessa_vez' ? 'Tentar amanhã' : 'Resgatar Prêmio'}
                 <ArrowRight className="w-5 h-5" strokeWidth={3} />
               </button>
           </div>
        </div>
      )}
    </div>
  );
};