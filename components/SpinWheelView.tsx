
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Gift, RefreshCw, ThumbsDown, History, Wallet, Volume2, VolumeX, Lock, ArrowRight } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

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
  prize_type: 'cashback' | 'cupom' | 'nao_foi_dessa_vez' | 'gire_de_novo';
  prize_value?: number;
  prize_code?: string; // For coupons
  status: 'creditado' | 'pendente' | 'nao_aplicavel';
  color: string;
  textColor: string;
  description: string;
}

// Paleta de cores vibrantes e contrastantes
const PRIZES: Prize[] = [
  { prize_key: 'reais_5', line1: 'R$ 5', line2: 'de Volta', prize_label: 'R$ 5,00 de Volta', prize_type: 'cashback', prize_value: 5, status: 'creditado', color: '#00C853', textColor: '#FFFFFF', description: 'O valor foi creditado na sua carteira digital.' }, // Verde Vibrante
  { prize_key: 'cashback_5', line1: '5%', line2: 'Cashback', prize_label: '5% Cashback', prize_type: 'cashback', prize_value: 5, status: 'creditado', color: '#2962FF', textColor: '#FFFFFF', description: '5% de cashback garantido na próxima compra.' }, // Azul Real
  { prize_key: 'lose', line1: 'Não foi', line2: 'dessa vez', prize_label: 'Não foi dessa vez', prize_type: 'nao_foi_dessa_vez', status: 'nao_aplicavel', color: '#D50000', textColor: '#FFFFFF', description: 'Tente novamente amanhã para ganhar prêmios.' }, // Vermelho
  { prize_key: 'cashback_10', line1: '10%', line2: 'Cashback', prize_label: '10% Cashback', prize_type: 'cashback', prize_value: 10, status: 'creditado', color: '#AA00FF', textColor: '#FFFFFF', description: '10% de cashback acumulado na sua carteira.' }, // Roxo
  { prize_key: 'spin_again', line1: 'Gire', line2: 'de Novo', prize_label: 'Gire de Novo', prize_type: 'gire_de_novo', status: 'nao_aplicavel', color: '#FF6D00', textColor: '#FFFFFF', description: 'Você ganhou uma nova chance! Gire a roleta novamente.' }, // Laranja
  { prize_key: 'reais_10', line1: 'Cupom', line2: 'R$ 10', prize_label: 'Cupom R$ 10,00', prize_type: 'cupom', prize_value: 10, prize_code: 'LOCAL10', status: 'pendente', color: '#00B8D4', textColor: '#FFFFFF', description: 'Cupom de R$ 10 para usar em parceiros locais.' }, // Ciano
  { prize_key: 'gift_local', line1: 'Brinde', line2: 'Local', prize_label: 'Brinde Surpresa', prize_type: 'cupom', prize_code: 'BRINDE2024', status: 'pendente', color: '#C51162', textColor: '#FFFFFF', description: 'Você ganhou um brinde exclusivo em lojas participantes.' }, // Pink
  { prize_key: 'cashback_15', line1: '15%', line2: 'Cashback', prize_label: '15% Cashback', prize_type: 'cashback', prize_value: 15, status: 'creditado', color: '#FFD600', textColor: '#000000', description: 'Incríveis 15% de volta na sua próxima compra!' }, // Amarelo Ouro (Texto Preto)
];

const SEGMENT_COUNT = PRIZES.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const SPIN_DURATION_MS = 4500; // Um pouco mais longo para aumentar a tensão

// Remote URLs for sounds - Usando sons mais "gameficados"
const SOUND_URLS = {
  spin: "https://assets.mixkit.co/sfx/preview/mixkit-game-wheel-spinning-2012.mp3",
  win: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
  lose: "https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3",
};

type SpinStatus = 'loading' | 'ready' | 'cooldown' | 'no_user' | 'error';

// --- Componente ---
export const SpinWheelView: React.FC<SpinWheelViewProps> = ({ userId, userRole, onWin, onRequireLogin, onViewHistory }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinStatus, setSpinStatus] = useState<SpinStatus>('loading');
  const [spinResult, setSpinResult] = useState<Prize | null>(null);
  const [lastSpinDate, setLastSpinDate] = useState<Date | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({
    spin: null, win: null, lose: null,
  });

  const timeUntilNextSpin = useCountdown(lastSpinDate);

  // --- Initialize Sounds ---
  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });
    if (audioRefs.current.spin) {
        audioRefs.current.spin.loop = true; // Som de giro em loop
        audioRefs.current.spin.volume = 0.5;
    }
  }, []);
  
  const playSound = (key: 'spin' | 'win' | 'lose') => {
    if (isMuted) return;
    const audio = audioRefs.current[key];
    if (audio) {
      if (key === 'spin') {
        audio.volume = 0.5;
        audio.loop = true;
      } else {
        audio.loop = false;
        audio.volume = 0.8;
      }
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const stopSound = (key: 'spin' | 'win' | 'lose') => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  // --- Check Eligibility ---
  useEffect(() => {
    let isMounted = true;

    const checkSpinAbility = async () => {
      // 1. Basic Check
      if (!userId) { 
        if(isMounted) setSpinStatus('no_user'); 
        return; 
      }

      // 2. Check LocalStorage first
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

      // 3. Prepare fallback
      const setReadyFallback = () => {
        if (isMounted) {
           if (localLastSpin && isSameDay(new Date(localLastSpin), new Date())) {
             setSpinStatus('cooldown');
           } else {
             setSpinStatus('ready');
           }
        }
      };

      if (!supabase) { 
        setReadyFallback();
        return; 
      }

      try {
        // 4. DB Call with Timeout Race
        const dbPromise = supabase
          .from('roulette_spins')
          .select('spin_date')
          .eq('user_id', userId)
          .order('spin_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any;

        if (error) throw error;

        if (isMounted) {
          if (data) {
            const lastDate = new Date(data.spin_date);
            if (isSameDay(lastDate, new Date())) {
              setLastSpinDate(lastDate);
              setSpinStatus('cooldown');
            } else {
              setSpinStatus('ready');
            }
          } else {
            setSpinStatus('ready');
          }
        }
      } catch (error) {
        console.error("Spin check failed/timeout, falling back to local/ready:", error);
        setReadyFallback();
      }
    };

    checkSpinAbility();

    return () => { isMounted = false; };
  }, [userId]);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // --- Actions ---
  const saveSpinResult = async (result: Prize) => {
    if (!userId) return false;
    
    localStorage.setItem(`last_spin_${userId}`, new Date().toISOString());

    if (!supabase) return true; 

    try {
      if (result.prize_type === 'gire_de_novo') return true;

      const { error } = await supabase.from('roulette_spins').insert({
        user_id: userId,
        prize_type: result.prize_type,
        prize_label: result.prize_label,
        prize_value: result.prize_value,
        status: result.status,
        spin_date: new Date().toISOString(),
      });
      
      if (error) {
          console.warn("Could not save spin to DB:", error.message);
      }
      return true;
    } catch (error) {
      console.error("Failed to save spin result to DB:", error);
      return true;
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

    // Logic for Rotation
    const winningSegmentIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    
    // SVG coordinate system adjustment
    const segmentCenter = winningSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const baseRotation = 360 * 6; // 6 full spins
    const randomOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6); // Randomness inside slice
    
    // Calculate final angle to land under the pointer (at 270 deg / top)
    const finalAngle = 270 - segmentCenter + randomOffset;
    
    const currentRotMod = rotation % 360;
    const targetRotation = rotation + baseRotation + (360 - currentRotMod) + finalAngle;

    setRotation(targetRotation);

    setTimeout(async () => {
      stopSound('spin');
      
      const result = PRIZES[winningSegmentIndex];
      playSound(result.prize_type === 'nao_foi_dessa_vez' ? 'lose' : 'win');
      setSpinResult(result);
      setIsSpinning(false);

      if (result.prize_type !== 'gire_de_novo') {
        const saved = await saveSpinResult(result);
        if (saved) {
          setLastSpinDate(new Date());
          setSpinStatus('cooldown');
        }
      }
      
    }, SPIN_DURATION_MS);
  };

  const handleClaimReward = () => {
    if (!spinResult) return;

    if (spinResult.prize_type === 'cashback') {
        onViewHistory(); 
    } else if (spinResult.prize_type === 'cupom') {
        onWin({
            label: spinResult.prize_label,
            code: spinResult.prize_code || 'CODE123',
            value: spinResult.prize_value?.toString() || '0',
            description: spinResult.description
        });
    } else if (spinResult.prize_type === 'gire_de_novo') {
        setSpinResult(null);
        setSpinStatus('ready');
    } else {
        setSpinResult(null);
    }
  };

  const renderSpinButton = () => {
    if (userRole === 'lojista') {
      return (
        <div className="w-full flex flex-col gap-3">
          <button disabled className="w-full h-14 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold text-base rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 opacity-70">
            <Lock className="w-4 h-4" />
            Acesso Restrito
          </button>
          <p className="text-xs text-center text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
            A Roleta da Freguesia é exclusiva para usuários.
          </p>
        </div>
      );
    }

    if (spinStatus === 'cooldown') {
      return (
        <div className="w-full text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Você já girou hoje. Volte amanhã!</p>
          <p className="text-base font-bold text-primary-500 mt-1">
            Próximo giro em: {timeUntilNextSpin}
          </p>
        </div>
      );
    }
    
    let text: React.ReactNode = 'Girar Agora!';
    let disabled = isSpinning;

    if (isSpinning) {
      text = 'Girando...';
    } else if (spinStatus === 'loading') {
      text = 'Carregando...';
      disabled = true;
    } else if (spinStatus === 'no_user') {
      text = 'Faça Login para Girar';
      disabled = false; 
    } else if (spinStatus === 'error') {
      text = 'Tentar Novamente';
      disabled = false;
    }

    return (
      <button 
        onClick={handleSpin} 
        disabled={disabled} 
        className="w-full h-14 bg-gradient-to-r from-[#1E5BFF] to-[#4D7CFF] text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group"
      >
        <span className="relative z-10">{text}</span>
        {!disabled && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
      </button>
    );
  };
  
  const getPath = (index: number) => {
    const angle = SEGMENT_ANGLE;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;
    
    const startRad = (Math.PI / 180) * startAngle;
    const endRad = (Math.PI / 180) * endAngle;

    const start = {
        x: 100 + 100 * Math.cos(startRad),
        y: 100 + 100 * Math.sin(startRad)
    };
    const end = {
        x: 100 + 100 * Math.cos(endRad),
        y: 100 + 100 * Math.sin(endRad)
    };
    
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
    <div className="bg-[#F7F7F7] dark:bg-gray-900 rounded-t-3xl shadow-2xl p-5 pt-4 w-full max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Handle Bar */}
      <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-3"></div>
      
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white font-display uppercase tracking-wide">Sorteio Diário</h2>
        </div>
        <button onClick={onViewHistory} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm">
            <History size={18} />
        </button>
      </div>
      
      {/* Wheel Container */}
      <div className="relative w-full max-w-[320px] mx-auto aspect-square flex items-center justify-center mb-6">
        
        {/* Pointer (North) - Styled as a Ticker */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-lg">
          <div className="w-8 h-10 bg-white dark:bg-gray-200 clip-triangle shadow-md" style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)', backgroundColor: '#FFF' }}></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-red-600 rounded-t-lg"></div>
        </div>

        {/* Outer Ring & Shadow */}
        <div className="absolute inset-[-10px] rounded-full bg-gradient-to-b from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 shadow-2xl z-0"></div>
        
        {/* The Wheel */}
        <div 
          className="relative w-full h-full rounded-full transition-transform border-[6px] border-white dark:border-gray-800 shadow-inner z-10"
          style={{ 
            transform: `rotate(${rotation}deg)`, 
            transitionDuration: `${isSpinning ? SPIN_DURATION_MS : 0}ms`,
            transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)' 
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full rounded-full overflow-hidden">
            {PRIZES.map((prize, i) => {
              const { x, y, rotation } = getTextPosition(i);
              return (
                <g key={i}>
                  <path d={getPath(i)} fill={prize.color} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  
                  {/* Prize Text */}
                  <text 
                    x={x} 
                    y={y} 
                    fill={prize.textColor} 
                    fontSize="7" 
                    fontWeight="900" 
                    fontFamily="sans-serif"
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    transform={`rotate(${rotation + 90}, ${x}, ${y})`}
                    style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}
                  >
                    <tspan x={x} dy="-3">{prize.line1}</tspan>
                    <tspan x={x} dy="8">{prize.line2}</tspan>
                  </text>

                  {/* Decorative Dots/Pegs on rim */}
                  <circle 
                    cx={100 + 92 * Math.cos(((i * SEGMENT_ANGLE) + SEGMENT_ANGLE/2) * Math.PI / 180)} 
                    cy={100 + 92 * Math.sin(((i * SEGMENT_ANGLE) + SEGMENT_ANGLE/2) * Math.PI / 180)} 
                    r="2" 
                    fill="white" 
                    opacity="0.8"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Center Hub */}
        <div className="absolute w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-xl z-10 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E5BFF] to-[#0039A6] rounded-full flex items-center justify-center shadow-inner">
                <span className="text-white font-black text-xs">SPIN</span>
            </div>
        </div>
      </div>

      {renderSpinButton()}

      {/* RESULT MODAL OVERLAY */}
      {spinResult && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-30 flex items-center justify-center rounded-t-3xl animate-in fade-in duration-500">
           <div className="text-center p-6 flex flex-col items-center max-w-xs w-full">
               
               {/* Confetti for Wins */}
               {spinResult.prize_type !== 'nao_foi_dessa_vez' && (
                   <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                       <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-bounce delay-75"></div>
                       <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                       <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-bounce delay-300"></div>
                       <div className="absolute top-10 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                   </div>
               )}

               {/* Icon */}
               <div 
                 className="mb-6 p-6 rounded-full shadow-2xl animate-bounce-short border-4 border-white dark:border-gray-800"
                 style={{ backgroundColor: spinResult.color }}
               >
                    {spinResult.prize_type === 'nao_foi_dessa_vez' ? (
                        <ThumbsDown size={48} strokeWidth={2} color="#FFF" />
                    ) : spinResult.prize_type === 'cashback' ? (
                        <Wallet size={48} strokeWidth={2} color={spinResult.textColor} />
                    ) : spinResult.prize_type === 'gire_de_novo' ? (
                        <RefreshCw size={48} strokeWidth={2} color={spinResult.textColor} />
                    ) : (
                        <Gift size={48} strokeWidth={2} color={spinResult.textColor} />
                    )}
               </div>

               {/* Title */}
               <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">
                   {spinResult.prize_type === 'nao_foi_dessa_vez' ? 'Poxa!' : 'PARABÉNS!'}
               </h3>

               {/* Prize Name */}
               <p className="text-xl font-bold mb-3" style={{ color: spinResult.prize_type === 'nao_foi_dessa_vez' ? '#666' : '#1E5BFF' }}>
                 {spinResult.prize_label}
               </p>

               {/* Description */}
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                   {spinResult.description}
               </p>
               
               {/* Action Button */}
               <button 
                 onClick={handleClaimReward}
                 className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
               >
                 {spinResult.prize_type === 'nao_foi_dessa_vez' ? 'Tentar amanhã' 
                  : spinResult.prize_type === 'gire_de_novo' ? 'Girar Novamente'
                  : spinResult.prize_type === 'cashback' ? 'Ver na Carteira'
                  : 'Resgatar Prêmio'}
                 
                 {spinResult.prize_type === 'gire_de_novo' ? <RefreshCw className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
               </button>

           </div>
        </div>
      )}

    </div>
  );
};
