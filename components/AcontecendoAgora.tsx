
import React, { useState } from 'react';
import { MapPin, Flame, Zap, Music, AlertTriangle, ChevronRight, Clock } from 'lucide-react';

interface LiveEvent {
  id: string;
  type: 'evento' | 'utilidade' | 'promo';
  badge: string;
  title: string;
  subtitle: string;
  image?: string;
  confirms: number;
  color: string;
}

const MOCK_LIVE: LiveEvent[] = [
  {
    id: 'l1',
    type: 'evento',
    badge: 'AO VIVO',
    title: 'Música no Espetto Carioca',
    subtitle: 'Roda de Samba começando agora!',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600',
    confirms: 12,
    color: 'text-emerald-400'
  },
  {
    id: 'l2',
    // FIX: Changed 'utility' to 'utilidade' to match type definition
    type: 'utilidade',
    badge: 'ALERTA',
    title: 'Internet instável na Geremário',
    subtitle: 'Relatos de queda na região do Pechincha.',
    confirms: 45,
    color: 'text-rose-500'
  },
  {
    id: 'l3',
    type: 'promo',
    badge: 'SÓ AGORA',
    title: 'Chope em dobro no Shopping',
    subtitle: 'Válido até às 22h no Center Shopping.',
    confirms: 28,
    color: 'text-amber-500'
  }
];

const LiveCard: React.FC<{ item: LiveEvent }> = ({ item }) => {
  const [confirms, setConfirms] = useState(item.confirms);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasConfirmed) {
      setConfirms(prev => prev + 1);
      setHasConfirmed(true);
    }
  };

  return (
    <div className={`flex-shrink-0 w-64 rounded-[2rem] overflow-hidden relative group border border-white/10 shadow-2xl transition-all active:scale-[0.98] ${
        item.type === 'evento' ? 'bg-black' : 
        // FIX: Changed 'utility' to 'utilidade'
        item.type === 'utilidade' ? 'bg-rose-500/10' : 'bg-amber-500/10'
    }`}>
      {item.image && (
        <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" alt="" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      
      {/* Glass Overlay */}
      <div className="relative z-10 h-48 p-5 flex flex-col justify-between backdrop-blur-[2px]">
        <div>
           <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-md border border-white/20 mb-3 ${
             item.type === 'evento' ? 'bg-emerald-500/20 text-emerald-400' :
             // FIX: Changed 'utility' to 'utilidade'
             item.type === 'utilidade' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
           }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                 item.type === 'evento' ? 'bg-emerald-400' :
                 // FIX: Changed 'utility' to 'utilidade'
                 item.type === 'utilidade' ? 'bg-rose-500' : 'bg-amber-500'
              }`}></div>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.badge}</span>
           </div>
           
           <h3 className="text-white font-bold text-sm leading-tight mb-1 drop-shadow-md">
             {item.title}
           </h3>
           <p className="text-white/60 text-[10px] leading-relaxed line-clamp-2">
             {item.subtitle}
           </p>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/40 uppercase">
              <Clock size={10} />
              <span>Agora</span>
           </div>
           
           <button 
             onClick={handleConfirm}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
               hasConfirmed 
               ? 'bg-amber-500 border-amber-400 text-white' 
               : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
             }`}
           >
              <Flame size={12} className={hasConfirmed ? 'fill-white' : ''} />
              <span className="text-[10px] font-black">{confirms}</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export const AcontecendoAgora: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <section className="px-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tighter uppercase">
            Acontecendo agora
          </h2>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
        </div>
        <button 
          onClick={() => onNavigate('explore')}
          className="text-xs font-bold text-[#1E5BFF] flex items-center gap-1 hover:underline"
        >
          <MapPin size={12} />
          Ver mapa
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
        {MOCK_LIVE.map((item) => (
          <LiveCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
