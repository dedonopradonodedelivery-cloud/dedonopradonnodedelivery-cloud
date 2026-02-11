
import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  Music, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ChevronRight, 
  PawPrint, 
  Key, 
  Info,
  Radio,
  BellRing
} from 'lucide-react';

interface LiveEvent {
  id: string;
  type: 'evento' | 'utilidade' | 'promo' | 'pet_lost' | 'item_found';
  badge: string;
  title: string;
  subtitle: string;
  image?: string;
  icon?: React.ElementType;
  confirms: number;
}

const MOCK_LIVE: LiveEvent[] = [
  {
    id: 'l1',
    type: 'evento',
    badge: 'AO VIVO',
    title: 'Música no Espetto Carioca',
    subtitle: 'Roda de Samba começando agora!',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600',
    confirms: 12
  },
  {
    id: 'l4',
    type: 'pet_lost',
    badge: 'PET PERDIDO',
    title: 'Procura-se: Golden Retriever',
    subtitle: 'Visto por último na Praça da Freguesia.',
    image: 'https://images.unsplash.com/photo-1598875184988-5e67b1a7ea9b?q=80&w=600',
    icon: PawPrint,
    confirms: 8
  },
  {
    id: 'l2',
    type: 'utilidade',
    badge: 'ALERTA',
    title: 'Sinal Ruim na Linha Amarela',
    subtitle: 'Instabilidade reportada por motoristas.',
    confirms: 45
  },
  {
    id: 'l5',
    type: 'item_found',
    badge: 'ACHADOS',
    title: 'Chaves encontradas',
    subtitle: 'Entregues na recepção do Condomínio X.',
    icon: Key,
    confirms: 3
  },
  {
    id: 'l3',
    type: 'promo',
    badge: 'RELÂMPAGO',
    title: 'Chope Duplo até as 20h',
    subtitle: 'Válido no Center Shopping JPA.',
    confirms: 28
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

  const getBgClass = () => {
    switch (item.type) {
      case 'evento': return 'bg-slate-900';
      case 'utilidade': return 'bg-red-50 dark:bg-red-950/20';
      case 'promo': return 'bg-purple-50 dark:bg-purple-950/20';
      case 'pet_lost': return 'bg-amber-500';
      case 'item_found': return 'bg-cyan-50 dark:bg-cyan-950/20';
      default: return 'bg-white';
    }
  };

  const getBadgeClass = () => {
    switch (item.type) {
      case 'evento': return 'bg-emerald-500 text-white';
      case 'utilidade': return 'bg-red-500 text-white';
      case 'promo': return 'bg-purple-600 text-white';
      case 'pet_lost': return 'bg-amber-400 text-black';
      case 'item_found': return 'bg-cyan-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTextColor = () => {
    if (item.type === 'evento' || item.type === 'pet_lost') return 'text-white';
    return 'text-gray-900 dark:text-white';
  }
  const getSubColor = () => {
    if (item.type === 'evento' || item.type === 'pet_lost') return 'text-white/60';
    return 'text-gray-500 dark:text-gray-400';
  }
  
  const isInfoCard = item.type === 'pet_lost' || item.type === 'item_found';

  // Ícones contextuais por tipo
  const getContextIcon = () => {
    switch (item.type) {
      case 'evento': return <Music size={10} />;
      case 'utilidade': return <BellRing size={10} />;
      case 'promo': return <Zap size={10} />;
      case 'pet_lost': return <PawPrint size={10} />;
      case 'item_found': return <Key size={10} />;
      default: return <Radio size={10} />;
    }
  }

  return (
    <div className={`flex-shrink-0 w-60 rounded-2xl overflow-hidden relative group border border-gray-100 dark:border-white/10 shadow-sm transition-all active:scale-[0.98] ${getBgClass()}`}>
      {item.image && (
        <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110" alt="" />
      )}
      
      {(item.type === 'evento' || item.type === 'pet_lost') && <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>}
      
      <div className="relative z-10 h-40 p-4 flex flex-col justify-between backdrop-blur-[1px]">
        <div>
           <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg mb-2 shadow-sm ${getBadgeClass()}`}>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.badge}</span>
           </div>
           
           <h3 className={`font-bold text-xs leading-tight mb-1 ${getTextColor()}`}>
             {item.title}
           </h3>
           <p className={`text-[10px] leading-relaxed line-clamp-2 font-medium ${getSubColor()}`}>
             {item.subtitle}
           </p>
        </div>

        <div className="flex items-center justify-between">
           <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-black/10 backdrop-blur-sm ${item.type === 'evento' || item.type === 'pet_lost' ? 'text-white border border-white/10' : 'text-gray-500 border border-gray-100'}`}>
              {getContextIcon()}
              <span>{item.type.replace('_', ' ')}</span>
           </div>
           
           <button 
             onClick={handleConfirm}
             className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
               hasConfirmed 
               ? 'bg-amber-500 border-amber-400 text-white shadow-lg' 
               : isInfoCard
                 ? 'bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/10 text-gray-500 dark:text-white'
                 : 'bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/10 text-gray-500 dark:text-white'
             }`}
           >
              {isInfoCard ? <Info size={10} /> : <Flame size={10} className={hasConfirmed ? 'fill-white' : ''} />}
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
          <h2 className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase">
            Acontecendo agora
          </h2>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <button 
          onClick={() => onNavigate('explore')}
          className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline"
        >
          Ver mapa
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
        {MOCK_LIVE.map((item) => (
          <LiveCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
