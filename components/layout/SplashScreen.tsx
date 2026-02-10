
import React from 'react';
import { MapPin } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-[#1E5BFF] flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-500">
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-black/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative flex flex-col items-center">
        {/* Logo Animado */}
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 animate-logo-enter">
          <MapPin className="w-14 h-14 text-[#1E5BFF]" fill="currentColor" />
        </div>

        {/* Nome do App */}
        <div className="text-center animate-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-forwards opacity-0">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
            Localizei JPA
          </h1>
          <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.4em] mt-3">
            Onde o bairro conversa
          </p>
        </div>

        {/* Loader Discreto */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest animate-pulse">
            Carregando Jacarepaguá...
          </span>
        </div>
      </div>

      {/* Marca d'água de versão */}
      <div className="absolute bottom-10 text-center opacity-20">
        <p className="text-[8px] font-black text-white uppercase tracking-[0.5em]">v3.2 Stable Build</p>
      </div>
    </div>
  );
};
