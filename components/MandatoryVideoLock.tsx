
import React, { useState, useEffect, useRef } from 'react';
import { Lock, Play, CheckCircle2, Info } from 'lucide-react';

/**
 * CONFIGURAÇÃO DE SEGURANÇA DE VÍDEO
 * 'fake' -> Libera a página imediatamente após o clique no Play.
 * 'real' -> Libera a página apenas após o evento onEnded (vídeo completo).
 */
// FIX: Using type assertion to prevent TypeScript from narrowing the constant to a single literal type,
// which causes errors when comparing against other members of the union.
const VIDEO_GATE_MODE = 'fake' as 'fake' | 'real'; 

interface MandatoryVideoLockProps {
  videoUrl: string;
  storageKey: string;
  children: React.ReactNode;
}

/**
 * Componente que bloqueia o conteúdo até que um vídeo explicativo seja assistido.
 * Nas regras atuais (temporárias), o desbloqueio ocorre ao iniciar o vídeo.
 */
export const MandatoryVideoLock: React.FC<MandatoryVideoLockProps> = ({ videoUrl, storageKey, children }) => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Verifica se já assistiu nesta versão do vídeo
    return localStorage.getItem(`video_watched_${storageKey}`) === 'true';
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Função central de desbloqueio
  const unlockContent = () => {
    setIsUnlocked(true);
    localStorage.setItem(`video_watched_${storageKey}`, 'true');
  };

  const handleVideoEnd = () => {
    // REGRA FUTURA: No modo real, o desbloqueio acontece aqui.
    if (VIDEO_GATE_MODE === 'real') {
      unlockContent();
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      
      // REGRA TEMPORÁRIA (FAKE): Libera a página inteira ao clicar em Play
      if (VIDEO_GATE_MODE === 'fake') {
        unlockContent();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {!isUnlocked && (
        <div className="p-6 bg-slate-900 border-b border-white/10 animate-in fade-in duration-500 shrink-0">
          <div className="mb-6 space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-blue-500" /> Assista antes de continuar
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Este é um vídeo rápido e direto, criado para explicar como funciona este recurso
              e como você pode aproveitá-lo da melhor forma.
            </p>
          </div>

          <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-2xl group">
            <video 
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={isPlaying} // Só mostra controles após dar play
              playsInline
              disablePictureInPicture
              controlsList="nodownload noplaybackrate"
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] transition-all">
                <button 
                  onClick={handlePlay}
                  className="w-16 h-16 bg-[#1E5BFF] text-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-all hover:scale-105"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <p className="mt-4 text-[9px] font-black text-white/50 uppercase tracking-widest">Toque para iniciar treinamento</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-2xl border border-white/5 animate-pulse">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Página bloqueada até {VIDEO_GATE_MODE === 'fake' ? 'o início' : 'o final'} do vídeo
            </span>
          </div>
        </div>
      )}

      {isUnlocked && (
        <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500 shrink-0">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Treinamento Liberado</span>
        </div>
      )}

      {/* Área de Conteúdo Bloqueável */}
      <div className={`flex-1 transition-all duration-1000 ${
        !isUnlocked 
          ? 'opacity-20 grayscale blur-sm pointer-events-none select-none h-0 overflow-hidden' 
          : 'opacity-100 blur-0 grayscale-0'
      }`}>
        {children}
      </div>
    </div>
  );
};