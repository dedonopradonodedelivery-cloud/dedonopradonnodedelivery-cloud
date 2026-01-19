
import React, { useState, useRef } from 'react';
// Added QrCode to the imports from lucide-react
import { 
  ChevronLeft, 
  Play, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Zap,
  Users,
  TrendingUp,
  FileText,
  QrCode
} from 'lucide-react';

interface MerchantCashbackOnboardingProps {
  onBack: () => void;
  onActivate: () => void;
}

export const MerchantCashbackOnboarding: React.FC<MerchantCashbackOnboardingProps> = ({ onBack, onActivate }) => {
  const [videoFinished, setVideoFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="p-5 h-16 flex items-center gap-4 shrink-0 z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Fluxo de Ativação</span>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">
        
        {/* Step Intro */}
        <div className="text-center mt-8 mb-10">
          <div className="w-16 h-16 bg-[#1E5BFF]/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-[#1E5BFF]/20 shadow-[0_0_20px_rgba(30,91,255,0.15)]">
            <Zap className="w-8 h-8 text-[#1E5BFF] fill-[#1E5BFF]" />
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tighter mb-3 uppercase">
            ATIVE O SEU <br/>
            <span className="text-[#1E5BFF]">CASHBACK LOCAL</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed font-medium">
            Assista ao treinamento rápido para aprender a usar o QR Code e o código fixo no seu balcão.
          </p>
        </div>

        {/* Training Video Player */}
        <div className="mb-8 relative">
            <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-white/10 group">
                <video 
                    ref={videoRef}
                    src="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    onPlay={() => setIsPlaying(true)}
                    playsInline
                />
                
                {!isPlaying && !videoFinished && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px]">
                        <button 
                            onClick={handlePlayVideo}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-all hover:scale-105"
                        >
                            <Play className="w-8 h-8 text-[#1E5BFF] fill-[#1E5BFF] ml-1" />
                        </button>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/70">Treinamento Obrigatório</p>
                    </div>
                )}

                {videoFinished && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/30 backdrop-blur-md animate-in fade-in">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <p className="mt-4 text-xs font-black uppercase tracking-widest text-white">Vídeo Concluído!</p>
                    </div>
                )}
            </div>

            {/* Lock Status */}
            <div className="mt-6 flex items-center justify-center">
                {!videoFinished ? (
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 animate-pulse">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel bloqueado</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 rounded-full border border-emerald-500/40 animate-in zoom-in">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Pronto para ativar</span>
                    </div>
                )}
            </div>
        </div>

        {/* Features Preview */}
        <div className="space-y-4">
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#1E5BFF] shrink-0">
                    <QrCode size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-slate-100">QR Code e Código Fixo</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Você receberá um kit digital com QR Code e um código único (ex: JPA-123) para facilitar no balcão.</p>
                </div>
            </div>

            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-sm text-slate-100">Controle Total</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Defina o percentual de volta (ex: 5%) e acompanhe o crescimento das vendas recorrentes.</p>
                </div>
            </div>
        </div>

      </main>

      {/* Action CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-20 max-w-md mx-auto">
        <button 
          onClick={onActivate}
          disabled={!videoFinished}
          className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3
            ${videoFinished 
              ? 'bg-[#1E5BFF] text-white shadow-[#1E5BFF]/30 active:scale-[0.98] hover:bg-blue-600' 
              : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
            }
          `}
        >
          {videoFinished ? 'Ativar meu painel agora' : 'Aguardando treinamento'}
          {videoFinished && <ArrowRight className="w-5 h-5" strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
};
