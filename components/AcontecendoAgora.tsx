
import React, { useState } from 'react';
import { Clock, Users, MapPin, ChevronRight } from 'lucide-react';
import { MOCK_ACONTECENDO_AGORA } from '@/constants';

interface LiveEvent {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  image: string;
  info1_icon: React.ElementType;
  info1_text: string;
  info2_icon: React.ElementType;
  info2_text: string;
}

const LiveCard: React.FC<{ item: LiveEvent }> = ({ item }) => {
  const Icon1 = item.info1_icon;
  const Icon2 = item.info2_icon;
  
  return (
    <div className="flex-shrink-0 w-64 rounded-3xl overflow-hidden relative group border border-gray-100 dark:border-white/10 shadow-sm transition-all active:scale-[0.98] h-48">
      <img src={item.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      
      <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
        <div>
           <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg mb-2 shadow-sm ${item.badgeColor}`}>
              <span className="text-[9px] font-black uppercase tracking-widest">{item.badge}</span>
           </div>
           
           <h3 className="font-bold text-base leading-tight drop-shadow-md mb-1">
             {item.title}
           </h3>
           <p className="text-[10px] leading-snug line-clamp-2 font-medium text-white/70 drop-shadow-sm">
             {item.subtitle}
           </p>
        </div>

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 text-white/70 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1">
                  <Icon1 size={12} />
                  <span>{item.info1_text}</span>
              </div>
               <div className="flex items-center gap-1">
                  <Icon2 size={12} />
                  <span>{item.info2_text}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const AcontecendoAgora: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <section className="bg-white dark:bg-gray-950 pt-4 pb-6">
      <div className="px-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-gray-900 dark:text-white tracking-widest uppercase">
            Acontecendo agora
          </h2>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <button 
          onClick={() => onNavigate('explore')}
          className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
        >
          Ver todos
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
        <div className="w-1 shrink-0"></div>
        {MOCK_ACONTECENDO_AGORA.map((item) => (
          <LiveCard key={item.id} item={item} />
        ))}
         <div className="w-1 shrink-0"></div>
      </div>
    </section>
  );
};
