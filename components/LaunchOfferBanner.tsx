
import React from 'react';
import { ArrowRight, Flame, Zap, Megaphone, Sparkles } from 'lucide-react';

interface LaunchOfferBannerProps {
  onClick: () => void;
}

export const LaunchOfferBanner: React.FC<LaunchOfferBannerProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="relative w-full rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 shadow-2xl shadow-blue-500/20 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-blue-500/40 active:scale-[0.98]"
    >
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: Offer Info & CTA */}
        <div className="text-white text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full border border-yellow-300 mb-4 shadow-md">
            <Sparkles size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Oferta de Inauguração</span>
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tighter drop-shadow-md mb-6">
            Anuncie sua loja e apareça para mais de 450 mil pessoas de Jacarepaguá.
          </h2>
          <button className="bg-white text-blue-700 font-black py-4 px-8 rounded-2xl shadow-lg hover:bg-blue-50 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 w-full md:w-auto group/btn">
            Quero Anunciar Agora 
            <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        {/* Right Side: Price & Discount Badge */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 text-white w-full md:w-auto flex-shrink-0 text-center shadow-2xl border border-white/10">
          <div className="relative">
            <p className="text-lg font-bold text-white/50 line-through">De R$ 149,90</p>
            <p className="text-xs text-yellow-300 font-bold -mt-1">Por apenas</p>
            <p className="text-5xl font-black text-white tracking-tighter my-1 drop-shadow-lg">R$ 29,90</p>
            <p className="font-bold text-yellow-300 text-lg">Economize R$ 120,00</p>
          </div>
          
          {/* 80% OFF Badge */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-slate-900 shadow-xl border-4 border-white/50 transform rotate-12 group-hover:scale-110 transition-transform">
            <span className="text-3xl font-black leading-none -mb-1">80%</span>
            <span className="text-[11px] font-bold uppercase leading-none">OFF</span>
          </div>
        </div>

      </div>
    </div>
  );
};
