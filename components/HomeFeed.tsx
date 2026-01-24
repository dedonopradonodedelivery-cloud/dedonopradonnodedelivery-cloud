
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Store, Category, AdType } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Gift,
  CheckCircle2,
  Clock,
  Lock,
  Star
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from './LaunchOfferBanner';

interface HomeFeedFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user,
  userRole
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const { currentNeighborhood } = useNeighborhood();

  // Lógica da Recompensa da Semana
  const [consecutiveDays, setConsecutiveDays] = useState(() => {
    return parseInt(localStorage.getItem('reward_consecutive_days') || '1');
  });

  const handleClaimReward = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onNavigate('weekly_reward_page');
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {/* 1. SISTEMA DE RECOMPENSA (BLOCO FIXO OBRIGATÓRIO) */}
      <section className="px-5 pt-6 mb-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-7 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          {/* Animação de Confete sutil no fundo quando ativo */}
          {isAnimating && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={`absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-70`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${0.5 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-yellow-300" />
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest">Recompensa da Semana</h3>
            </div>

            <h2 className="text-xl font-bold leading-tight mb-6">
              Volte todos os dias e desbloqueie seus benefícios
            </h2>

            {/* Indicador de Progresso (5 dias) */}
            <div className="flex justify-between items-center mb-8 px-1">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    day <= consecutiveDays 
                      ? 'bg-yellow-400 border-yellow-300 text-indigo-900 shadow-lg shadow-yellow-400/20 scale-110' 
                      : 'bg-white/10 border-white/10 text-white/40'
                  }`}>
                    {day <= consecutiveDays ? (
                      <CheckCircle2 size={20} strokeWidth={3} />
                    ) : (
                      <span className="text-[10px] font-black uppercase">D{day}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleClaimReward}
              className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              {isAnimating ? 'Celebrando...' : `Liberar Dia ${consecutiveDays}`}
              {!isAnimating && <ArrowRight size={18} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </section>

      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* CATEGORIAS */}
      <div className="w-full bg-white dark:bg-gray-950 pt-2 pb-0">
        <div className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
          <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                  <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                  <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTA EXPLORAR */}
      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
        <div className="px-5">
          <SectionHeader 
            icon={Compass} 
            title="Explorar Bairro" 
            subtitle="Tudo o que você precisa" 
            onSeeMore={() => onNavigate('explore')}
          />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
            {['all', 'top_rated'].map((f) => (
              <button 
                key={f} 
                onClick={() => setListFilter(f as any)} 
                className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
              >
                {f === 'all' ? 'Tudo' : 'Top'}
              </button>
            ))}
          </div>
          <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm">
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
      </div>
    </div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
  </div>
);
