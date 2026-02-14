
import React, { useState } from 'react';
import { Lock, Play, CheckCircle2, Info, Sparkles } from 'lucide-react';

interface MandatoryVideoLockProps {
  videoUrl: string;
  storageKey: string;
  children: React.ReactNode;
}

/**
 * Componente que simula um treinamento obrigatório.
 * O clique no "Play" libera instantaneamente o acesso ao painel.
 */
export const MandatoryVideoLock: React.FC<MandatoryVideoLockProps> = ({ storageKey, children }) => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem(`video_watched_${storageKey}`) === 'true';
  });

  const handleSimulateWatch = () => {
    setIsUnlocked(true);
    localStorage.setItem(`video_watched_${storageKey}`, 'true');
  };

  return (
    <div className="flex flex-col h-full">
      {!isUnlocked && (
        <div className="p-6 bg-slate-900 border-b border-white/10 animate-in fade-in duration-500 shrink-0">
          <div className="mb-6 space-y-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-blue-500" /> Treinamento do Lojista
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Toque no botão abaixo para concluir o guia rápido de utilização deste recurso.
            </p>
          </div>

          <div 
            onClick={handleSimulateWatch}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-800 border border-white/10 shadow-2xl group cursor-pointer active:scale-[0.99] transition-all"
          >
            {/* Background Estilizado (Sem carregar vídeo real) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-[#1E5BFF] text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all border-4 border-white/20">
                    <Play size={32} fill="currentColor" className="ml-1" />
                </div>
                <p className="mt-4 text-[10px] font-black text-white uppercase tracking-[0.2em]">Concluir Treinamento</p>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-white/70 uppercase">Vídeo Simulado</span>
                </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-2xl border border-white/5 animate-pulse">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Acesso bloqueado até concluir o guia
            </span>
          </div>
        </div>
      )}

      {isUnlocked && (
        <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between px-6 animate-in slide-in-from-top duration-500 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={14} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Treinamento Concluído</span>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem(`video_watched_${storageKey}`);
                window.location.reload();
              }}
              className="text-[8px] font-black text-slate-400 uppercase underline"
            >
                Resetar guia
            </button>
        </div>
      )}

      {/* Área de Conteúdo Liberada */}
      <div className={`flex-1 transition-all duration-700 ${
        !isUnlocked 
          ? 'opacity-20 grayscale blur-md pointer-events-none select-none h-0 overflow-hidden' 
          : 'opacity-100 blur-0 grayscale-0'
      }`}>
        {children}
      </div>
    </div>
  );
};
