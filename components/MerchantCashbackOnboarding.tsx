
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';

interface MerchantCashbackOnboardingProps {
  onBack: () => void;
  onActivate: () => void;
}

export const MerchantCashbackOnboarding: React.FC<MerchantCashbackOnboardingProps> = ({ onBack, onActivate }) => {
  const [videoFinished, setVideoFinished] = useState(false);
  const [manualCheck, setManualCheck] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Regra: Pode ativar se o vídeo acabar OU se marcar manualmente que assistiu
  const canActivate = videoFinished || manualCheck;

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setVideoFinished(true);
    setIsPlaying(false);
  };

  const handleActivate = () => {
    if (!canActivate) return;
    
    // PERSISTÊNCIA DAS FLAGS SOLICITADAS
    localStorage.setItem('onboarding_cashback_completed', 'true');
    localStorage.setItem('onboarding_cashback_completed_at', new Date().toISOString());
    
    onActivate();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col animate-in fade-in duration-500">
      
      {/* Header Simplificado */}
      <header className="p-5 h-16 flex items-center gap-4 shrink-0 z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Treinamento do Parceiro</span>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">
        
        {/* Intro */}
        <div className="text-center mt-8 mb-10">
          <div className="w-16 h-16 bg-[#1E5BFF]/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-[#1E5BFF]/20 shadow-[0_0_20px_rgba(30,91,255,0.1)]">
            <Zap className="w-8 h-8 text-[#1E5BFF] fill-[#1E5BFF]" />
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tighter mb-3 uppercase">
            ATIVE O SEU <br/>
            <span className="text-[#1E5BFF]">CASHBACK LOCAL</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
            Aprenda a fidelizar seus vizinhos e aumentar seu faturamento em menos de 2 minutos.
          </p>
        </div>

        {/* Player de Vídeo */}
        <div className="mb-8 relative">
            <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10 group">
                <video 
                    ref={videoRef}
                    src="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    onPlay={() => setIsPlaying(true)}
                    playsInline
                />
                
                {!isPlaying && !videoFinished && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                        <button 
                            onClick={handlePlayVideo}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-all hover:scale-105"
                        >
                            <Play className="w-8 h-8 text-[#1E5BFF] fill-[#1E5BFF] ml-1" />
                        </button>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/70">Clique para Assistir</p>
                    </div>
                )}

                {videoFinished && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/20 backdrop-blur-md animate-in fade-in">
                        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <p className="mt-4 text-xs font-black uppercase tracking-widest text-white">Treinamento Concluído!</p>
                    </div>
                )}
            </div>

            {/* Status Visual do Bloqueio */}
            <div className="mt-4 flex items-center justify-center">
                {!canActivate ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assista para liberar a ativação</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-in zoom-in">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Acesso Autorizado</span>
                    </div>
                )}
            </div>
        </div>

        {/* Checkbox de Marcação Explícita */}
        <label className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 cursor-pointer active:scale-[0.99] transition-all mb-8">
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${manualCheck ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'border-slate-700 bg-transparent'}`}>
                {manualCheck && <CheckCircle2 size={16} className="text-white" />}
            </div>
            <input 
                type="checkbox" 
                checked={manualCheck} 
                onChange={(e) => setManualCheck(e.target.checked)}
                className="hidden"
            />
            <div className="flex-1">
                <p className="text-sm font-bold text-slate-200">Já assisti ao vídeo explicativo</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pular obrigatoriedade</p>
            </div>
        </label>

        {/* Vantagens Rápidas */}
        <div className="grid grid-cols-2 gap-3 mb-10">
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                <Users className="text-[#1E5BFF] mb-2" size={20} />
                <h4 className="font-bold text-xs">Retenção</h4>
                <p className="text-[10px] text-slate-500 mt-1">Clientes voltam para gastar o saldo.</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                <TrendingUp className="text-purple-500 mb-2" size={20} />
                <h4 className="font-bold text-xs">Destaque</h4>
                <p className="text-[10px] text-slate-500 mt-1">Apareça no topo das buscas do bairro.</p>
            </div>
        </div>

      </main>

      {/* Botão de Ação Fixo */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-20 max-w-md mx-auto">
        <button 
          onClick={handleActivate}
          disabled={!canActivate}
          className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3
            ${canActivate 
              ? 'bg-[#1E5BFF] text-white shadow-[#1E5BFF]/20 active:scale-[0.98]' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 grayscale'
            }
          `}
        >
          {canActivate ? 'Entendi, quero ativar meu cashback' : 'Aguardando Vídeo...'}
          {canActivate && <ArrowRight className="w-5 h-5" strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
};
