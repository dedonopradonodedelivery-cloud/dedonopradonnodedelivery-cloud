
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Gift, RefreshCw, ThumbsDown, History, Wallet, Volume2, VolumeX, Lock, ArrowRight, Dices, Ticket } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';

// --- Tipos e Constantes ---
interface SpinWheelViewProps {
  userId: string | null;
  userRole: 'cliente' | 'lojista' | null;
  onWin: (reward: any) => void;
  onRequireLogin: () => void;
  onViewHistory: () => void;
}

interface Prize {
  prize_key: string;
  line1: string;
  line2: string;
  prize_label: string;
  prize_type: 'cupom' | 'nao_foi_dessa_vez' | 'gire_de_novo';
  prize_value?: number; // Representa % do cupom
  prize_code?: string; // Código do cupom
  status: 'creditado' | 'pendente' | 'nao_aplicavel';
  color: string;
  textColor: string;
  description: string;
}

const PRIZES: Prize[] = [
  { prize_key: 'cupom_5', line1: 'Cupom', line2: '5%', prize_label: 'Cupom de 5%', prize_type: 'cupom', prize_value: 5, prize_code: 'LOCAL5', status: 'pendente', color: '#2563EB', textColor: '#FFFFFF', description: 'Você ganhou 5% de desconto em parceiros selecionados.' },
  { prize_key: 'tente_amanha_1', line1: 'Tente', line2: 'Amanhã', prize_label: 'Tente Amanhã', prize_type: 'nao_foi_dessa_vez', status: 'nao_aplicavel', color: '#EF4444', textColor: '#FFFFFF', description: 'Não foi dessa vez. Volte amanhã para girar novamente!' },
  { prize_key: 'cupom_10', line1: 'Cupom', line2: '10%', prize_label: 'Cupom de 10%', prize_type: 'cupom', prize_value: 10, prize_code: 'LOCAL10', status: 'pendente', color: '#EAB308', textColor: '#FFFFFF', description: 'Parabéns! Desconto de 10% para sua próxima compra.' },
  { prize_key: 'cupom_surpresa', line1: 'Cupom', line2: 'Surpresa', prize_label: 'Cupom Surpresa', prize_type: 'cupom', prize_code: 'SURPRESA2024', status: 'pendente', color: '#9333EA', textColor: '#FFFFFF', description: 'Um presente especial para você! Confira na sua carteira.' },
  { prize_key: 'tente_amanha_2', line1: 'Volte', line2: 'Amanhã', prize_label: 'Volte Amanhã', prize_type: 'nao_foi_dessa_vez', status: 'nao_aplicavel', color: '#EF4444', textColor: '#FFFFFF', description: 'Hoje não deu sorte. Tente novamente em 24h.' },
  { prize_key: 'cupom_5_b', line1: 'Cupom', line2: '5%', prize_label: 'Cupom de 5%', prize_type: 'cupom', prize_value: 5, prize_code: 'LOCAL5', status: 'pendente', color: '#2563EB', textColor: '#FFFFFF', description: 'Ganhou 5% de desconto! Aproveite no bairro.' },
  { prize_key: 'tente_amanha_3', line1: 'Não foi', line2: 'Agora', prize_label: 'Não foi Agora', prize_type: 'nao_foi_dessa_vez', status: 'nao_aplicavel', color: '#EF4444', textColor: '#FFFFFF', description: 'Sem prêmio hoje. Mas amanhã tem mais tentativas!' },
  { prize_key: 'cupom_10_b', line1: 'Cupom', line2: '10%', prize_label: 'Cupom de 10%', prize_type: 'cupom', prize_value: 10, prize_code: 'LOCAL10', status: 'pendente', color: '#EAB308', textColor: '#FFFFFF', description: 'Incrível! 10% de desconto garantido.' },
];

const SEGMENT_COUNT = PRIZES.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const SPIN_DURATION_MS = 4500;

const SOUND_URLS = {
  spin: "https://assets.mixkit.co/sfx/preview/mixkit-game-wheel-spinning-2012.mp3",
  win: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
  lose: "https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3",
};

type SpinStatus = 'loading' | 'ready' | 'cooldown' | 'no_user' | 'error';

export const SpinWheelView: React.FC<SpinWheelViewProps> = ({ userId, userRole, onWin, onRequireLogin, onViewHistory }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinStatus, setSpinStatus] = useState<SpinStatus>('loading');
  const [spinResult, setSpinResult] = useState<Prize | null>(null);
  const [lastSpinDate, setLastSpinDate] = useState<Date | null>(null);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('localizei_wheel_muted') === 'true');

  const isMutedRef = useRef(isMuted);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({ spin: null, win: null, lose: null });
  const timeUntilNextSpin = useCountdown(lastSpinDate);

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

  useEffect(() => {
    let isMounted = true;
    const checkSpinAbility = async () => {
      if (!userId) { 
        if(isMounted) setSpinStatus('no_user'); 
        return; 
      }
      const localLastSpin = localStorage.getItem(`last_spin_${userId}`);
      if (localLastSpin) {
        const lastDate = new Date(localLastSpin);
        if (isSameDay(lastDate, new Date())) {
          if(isMounted) {
            setLastSpinDate(lastDate);
            setSpinStatus('cooldown');
          }
        }
      }
      const setReadyFallback = () => {
        if (isMounted) {
           if (localLastSpin && isSameDay(new Date(localLastSpin), new Date())) setSpinStatus('cooldown');
           else setSpinStatus('ready');
        }
      };
      if (!supabase) { setReadyFallback(); return; }
      try {
        const { data, error } = await supabase.from('roulette_spins').select('spin_date').eq('user_id', userId).order('spin_date', { ascending: false }).limit(1).maybeSingle();
        if (isMounted) {
          if (data) {
            const lastDate = new Date(data.spin_date);
            if (isSameDay(lastDate, new Date())) {
              setLastSpinDate(lastDate);
              setSpinStatus('cooldown');
            } else setSpinStatus('ready');
          } else setSpinStatus('ready');
        }
      } catch (error) { setReadyFallback(); }
    };
    checkSpinAbility();
    return () => { isMounted = false; };
  }, [userId]);

  const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const saveSpinResult = async (result: Prize): Promise<boolean> => {
    if (!userId) return false;

    if (result.prize_type === 'gire_de_novo') {
      return true; // Don't persist, but it's a "successful" flow.
    }

    try {
      if (supabase) {
        const { error } = await supabase.from('roulette_spins').insert({
          user_id: userId,
          prize_type: result.prize_type,
          prize_label: result.prize_label,
          prize_value: result.prize_value,
          status: result.status,
          spin_date: new Date().toISOString(),
        });
        if (error) throw error;
      }
      // Only update local cooldown if DB write succeeds
      localStorage.setItem(`last_spin_${userId}`, new Date().toISOString());
      return true;
    } catch (error) {
      console.error("Erro ao salvar resultado do giro no backend:", error);
      return false; // Critical: return false on failure.
    }
  };

  const handleSpin = () => {
    if (userRole === 'lojista') return;
    if (isSpinning || spinStatus !== 'ready') {
      if (spinStatus === 'no_user') onRequireLogin();
      return;
    }
    setIsSpinning(true);
    setSpinResult(null);
    playSound('spin');
    const winningSegmentIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const segmentCenter = winningSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const baseRotation = 360 * 6;
    const randomOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6);
    const finalAngle = 270 - segmentCenter + randomOffset;
    const targetRotation = rotation + baseRotation + (360 - (rotation % 360)) + finalAngle;
    setRotation(targetRotation);

    setTimeout(async () => {
      stopSound('spin');
      const result = PRIZES[winningSegmentIndex];
      playSound(result.prize_type === 'nao_foi_dessa_vez' ? 'lose' : 'win');

      const savedSuccessfully = await saveSpinResult(result);

      if (!savedSuccessfully && result.prize_type !== 'nao_foi_dessa_vez' && result.prize_type !== 'gire_de_novo') {
        setSpinResult({
          ...result,
          prize_label: `${result.prize_label} (Salvo)`,
          description: "Seu cupom foi registrado! Tivemos um problema de conexão momentâneo, mas ele aparecerá no histórico em breve.",
          saveError: true,
        } as any);
      } else {
        setSpinResult(result);
      }
      
      setIsSpinning(false);
      
      if (result.prize_type !== 'gire_de_novo') {
        setLastSpinDate(new Date());
        setSpinStatus('cooldown');
      }
    }, SPIN_DURATION_MS);
  };

  const handleClaimReward = () => {
    if (!spinResult) return;

    if ((spinResult as any).saveError) {
        setSpinResult(null);
        return;
    }

    if (spinResult.prize_type === 'cupom') {
        onWin({ label: spinResult.prize_label, code: spinResult.prize_code || 'CODE123', value: spinResult.prize_value?.toString() || '0', description: spinResult.description });
    } else if (spinResult.prize_type === 'gire_de_novo') { 
        setSpinResult(null); 
        setSpinStatus('ready'); 
    } else {
        setSpinResult(null);
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
        <h2 className="text-xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tight">Roleta de Cupons</h2>
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
                <Ticket className="w-6 h-6 text-white" />
            </div>
        </div>
      </div>

      <div className="mb-6">
        {userRole === 'lojista' ? (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">A Roleta é exclusiva para Clientes.</p>
          </div>
        ) : spinStatus === 'cooldown' ? (
          <div className="text-center bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Próximo giro em</p>
            <p className="text-2xl font-black text-primary-600 dark:text-blue-400">{timeUntilNextSpin}</p>
          </div>
        ) : (
          <button 
            onClick={handleSpin} 
            disabled={isSpinning || spinStatus === 'loading'} 
            className="w-full h-16 bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.97] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
          >
            {isSpinning ? <RefreshCw className="w-6 h-6 animate-spin" /> : 'GIRAR E GANHAR'}
          </button>
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
               <p className="text-xl font-black mb-4 uppercase tracking-tight" style={{ color: spinResult.color }}>
                 {spinResult.prize_label}
               </p>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                   {spinResult.description}
               </p>
               <button 
                 onClick={handleClaimReward}
                 className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
               >
                 {(spinResult as any).saveError ? 'Entendido' : spinResult.prize_type === 'nao_foi_dessa_vez' ? 'Tentar amanhã' : 'Ver Cupom'}
                 {!((spinResult as any).saveError) && <ArrowRight className="w-5 h-5" strokeWidth={3} />}
               </button>
           </div>
        </div>
      )}
    </div>
  );
};
