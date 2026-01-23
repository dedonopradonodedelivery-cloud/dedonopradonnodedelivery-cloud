
import React from 'react';
import { ArrowRight, Flame, Zap } from 'lucide-react';

interface LaunchOfferBannerProps {
  onClick: () => void;
}

export const LaunchOfferBanner: React.FC<LaunchOfferBannerProps> = ({ onClick }) => {
  return (
    // Main container with gradient and relative positioning
    <div 
      onClick={onClick} 
      className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 p-8 shadow-2xl shadow-red-500/20 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-red-500/30 active:scale-[0.98]"
    >
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left Side: Offer Info */}
        <div className="text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mb-4">
            <Zap size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Oferta de Inauguração</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter drop-shadow-md">
            Destaque sua loja por um preço único.
          </h2>
          <p className="font-bold text-yellow-200 mt-3 text-lg">Economize R$ 120,00 agora!</p>
        </div>

        {/* Right Side: Price & CTA */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 text-slate-900 w-full md:w-auto flex-shrink-0 text-center shadow-2xl border border-white/30">
          <p className="text-lg font-bold text-slate-400 line-through">De R$ 149,90</p>
          <p className="text-xs text-slate-800 font-bold -mt-1">Por apenas</p>
          <p className="text-5xl font-black text-slate-900 tracking-tighter my-1">R$ 29,90</p>
          <button className="w-full mt-4 bg-slate-900 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 group-hover:bg-slate-700 transition-colors">
            Quero Anunciar Agora <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      
      {/* 80% OFF Badge */}
      <div className="absolute top-6 right-6 w-20 h-20 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-slate-900 shadow-xl border-4 border-white -rotate-12 transform group-hover:scale-110 transition-transform">
        <Flame size={20} className="fill-red-500 text-red-500" />
        <span className="text-2xl font-black leading-none">80%</span>
        <span className="text-[10px] font-bold uppercase leading-none -mt-1">OFF</span>
      </div>
    </div>
  );
};
