
import React, { useState, useEffect, useRef } from 'react';
import { AdType, Category, Store, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  Loader2,
  ArrowRight, 
  Star,
  X,
  MapPin,
  Wallet,
  Users,
  TrendingUp,
  Flame,
  Trophy,
  Zap,
  Dices,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { getStoreLogo } from '../utils/mockLogos';

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectCollection: (collection: EditorialCollection) => void;
  onStoreClick?: (store: Store) => void;
  searchTerm?: string;
  stores: Store[];
  user: User | null;
  userRole?: 'cliente' | 'lojista' | null;
  onSpinWin: (reward: any) => void;
  onRequireLogin: () => void;
}

const TRENDING_TAGS = [
  { id: 1, label: 'Sushi', icon: '🍣' },
  { id: 2, label: 'Academia', icon: '💪' },
  { id: 3, label: 'Pet Shop', icon: '🐾' },
  { id: 4, label: 'Pizza', icon: '🍕' },
  { id: 5, label: 'Salão', icon: '💇‍♀️' },
  { id: 6, label: 'Farmácia', icon: '💊' },
];

const EDITORIAL_THEMES: (EditorialCollection & { badge?: string })[] = [
  { 
    id: 'coffee', 
    title: 'Pausa para o Café', 
    subtitle: 'Favoritos do bairro', 
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format=fit=crop', 
    keywords: ['café', 'padaria', 'confeitaria'],
    badge: 'Popular'
  },
  { 
    id: 'style', 
    title: 'Guia de Estilo', 
    subtitle: 'Renove seu visual', 
    image: 'https://images.unsplash.com/photo-1558747785-05961248f733?q=80&w=600&auto=format=fit=crop', 
    keywords: ['barbearia', 'cabeleireiro', 'roupas'],
    badge: 'Novo'
  },
  { 
    id: 'health', 
    title: 'Viver Bem', 
    subtitle: 'Saúde & Foco', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format=fit=crop', 
    keywords: ['academia', 'clinica', 'nutrição'],
    badge: 'Destaque'
  },
];

const SpinWheelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userRole: 'cliente' | 'lojista' | null;
  onWin: (reward: any) => void;
  onRequireLogin: () => void;
  onViewHistory: () => void;
}> = ({ isOpen, onClose, userId, userRole, onWin, onRequireLogin, onViewHistory }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div className="bg-transparent w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-4 right-4 z-50">
           <button onClick={onClose} className="p-2 text-gray-200 hover:text-white bg-black/30 backdrop-blur-sm rounded-full active:scale-95 transition-transform">
              <X className="w-5 h-5" />
            </button>
        </div>
        <div className="animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <SpinWheelView userId={userId} userRole={userRole} onWin={onWin} onRequireLogin={onRequireLogin} onViewHistory={onViewHistory} />
        </div>
      </div>
    </div>
  );
};

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onSelectCollection,
  onStoreClick, 
  searchTerm: externalSearchTerm,
  stores,
  user,
  userRole,
  onSpinWin,
  onRequireLogin
}) => {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const activeSearchTerm = externalSearchTerm || '';
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');
  const [onlineVizinhos] = useState(312);

  useEffect(() => {
    let timeout: any;
    if (!activeSearchTerm.trim()) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    timeout = setTimeout(async () => {
        try {
            const { data } = await supabase.from('businesses').select('*')
                .or(`name.ilike.%${activeSearchTerm}%,category.ilike.%${activeSearchTerm}%`)
                .limit(8);
            
            const mapped: Store[] = (data || []).map((item: any) => ({
                id: item.id, 
                name: item.name, 
                category: item.category, 
                subcategory: item.subCategory,
                description: item.description || '', // Fix: Adicionado propriedade obrigatória
                logoUrl: item.logoUrl || getStoreLogo(item.name.length),
                rating: item.rating || 0, 
                distance: 'Freguesia', 
                adType: AdType.ORGANIC,
            }));
            setSearchResults(mapped);
        } catch (err) { console.error(err); } finally { setIsSearching(false); }
    }, 400);
    return () => clearTimeout(timeout);
  }, [activeSearchTerm]);

  return (
    <div className="flex flex-col gap-6 pb-28 bg-gray-50 dark:bg-gray-900 w-full max-w-md mx-auto !pt-0 animate-in fade-in duration-500">
      
      {activeSearchTerm ? (
        <div className="px-5 mt-4 min-h-[50vh]">
             <div className="flex items-center gap-2 mb-4">
                {isSearching && <Loader2 className="w-4 h-4 animate-spin text-[#1E5BFF]" />}
                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Resultados para "{activeSearchTerm}"</h3>
             </div>
             <div className="flex flex-col gap-3">
                {searchResults.map((store) => (
                <div key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 cursor-pointer active:scale-[0.99] transition-all">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50"><img src={store.logoUrl} className="w-full h-full object-contain" alt={store.name} /></div>
                    <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{store.name}</h4>
                        <span className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-tight">{store.category}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                </div>
                ))}
             </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full mt-4">
            
            {/* 1. HERO - PROPOSTA DE VALOR */}
            <div className="px-5 w-full">
               <div className="w-full bg-[#1E5BFF] rounded-[32px] p-6 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 opacity-90">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{onlineVizinhos} vizinhos ativos agora</span>
                    </div>
                    <h1 className="text-[28px] font-black mb-2 leading-[1.1] tracking-tight">O seu bairro agora<br/>te dá dinheiro.</h1>
                    <p className="text-blue-100 text-xs font-medium mb-6 opacity-90 leading-relaxed">Ganhe cashback real comprando no comércio local da Freguesia.</p>
                    <button onClick={() => onNavigate('cashback_info')} className="w-full bg-white text-[#1E5BFF] text-sm font-black py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10">
                      Ativar Cashback Grátis
                      <ArrowRight className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
               </div>
            </div>

            {/* 2. MAIS BUSCADOS (TAGS OTIMIZADAS) */}
            <div className="space-y-3">
                <div className="px-5">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Mais buscados hoje</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar px-5">
                    {TRENDING_TAGS.map((tag) => (
                        <button 
                            key={tag.id}
                            onClick={() => onNavigate('explore')}
                            className="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95 transition-all"
                        >
                            <span className="text-sm">{tag.icon}</span>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{tag.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. DASHBOARD / STATUS */}
            <div className="px-5 w-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 active:scale-[0.99] transition-all cursor-pointer group" onClick={() => onNavigate('user_cashback_flow')}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] transition-colors group-hover:bg-[#1E5BFF] group-hover:text-white"><Wallet className="w-5 h-5" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">Meu Saldo</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white leading-none">R$ 12,50</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Resgate em</p>
                            <p className="text-xs font-black text-gray-700 dark:text-gray-300">R$ 50,00</p>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1E5BFF] w-[25%] rounded-full shadow-[0_0_8px_rgba(30,91,255,0.4)]"></div>
                    </div>
                </div>
            </div>

            {/* 4. FILTROS RÁPIDOS */}
            <div className="px-5 w-full -mb-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'all', label: 'Tudo', icon: Zap },
                      { id: 'cashback', label: 'Cashback', icon: TrendingUp },
                      { id: 'top_rated', label: 'Melhores', icon: Star },
                      { id: 'open_now', label: 'Abertos', icon: Clock }
                    ].map((btn) => (
                      <button
                          key={btn.id}
                          onClick={() => setListFilter(btn.id as any)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black transition-all active:scale-95 shadow-sm whitespace-nowrap ${
                          listFilter === btn.id ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700'
                          }`}
                      >
                          {btn.label}
                      </button>
                    ))}
                </div>
            </div>

            {/* 5. LISTA PRINCIPAL */}
            <div className="px-5 pb-2 min-h-[300px] w-full">
                <LojasEServicosList 
                    onStoreClick={onStoreClick} 
                    onViewAll={() => onNavigate('explore')}
                    activeFilter={listFilter}
                    user={user}
                />
            </div>

            {/* 6. DESCUBRA O BAIRRO (MAGAZINE STYLE) */}
            <div className="space-y-4 w-full">
                <div className="px-5 flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Descubra o bairro</h3>
                    <button onClick={() => onNavigate('explore')} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-wider">Ver tudo</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x px-5">
                    {EDITORIAL_THEMES.map((theme) => (
                        <div 
                            key={theme.id} 
                            className="snap-center min-w-[260px] w-[260px] h-[160px] rounded-[32px] overflow-hidden relative cursor-pointer active:scale-95 transition-all shadow-lg group"
                            onClick={() => onSelectCollection(theme)}
                        >
                            <img src={theme.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={theme.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute top-4 right-4">
                                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest">{theme.badge}</span>
                            </div>
                            <div className="absolute bottom-5 left-5 right-5">
                                <h4 className="text-white font-black text-lg leading-tight mb-1">{theme.title}</h4>
                                <p className="text-blue-100 text-[10px] font-bold opacity-80 uppercase tracking-wider">{theme.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. GANHE BÔNUS (GAMIFICAÇÃO) */}
            <div className="px-5 mt-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Bônus & Recompensas</h3>
                </div>
                <button 
                    onClick={() => onNavigate('user_cashback_flow')}
                    className="w-full bg-[#FFF9F2] dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-3xl p-5 flex items-center justify-between group active:scale-[0.99] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-500 rounded-2xl w-12 h-12 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <Flame className="w-6 h-6 fill-current" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">Sequência: 3 Dias</p>
                            <p className="text-[11px] text-orange-600 font-bold uppercase tracking-wide mt-1 flex items-center gap-1">Check-in hoje + R$ 0,50 <Zap className="w-3 h-3 fill-current" /></p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setIsSpinWheelOpen(true)} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform">
                        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600"><Dices className="w-5 h-5" /></div>
                        <div className="text-center">
                            <p className="text-xs font-black text-gray-900 dark:text-white">Roleta</p>
                            <p className="text-[9px] text-gray-400 font-black uppercase mt-0.5">Tente a Sorte</p>
                        </div>
                    </button>
                    <button onClick={() => onNavigate('invite_friend')} className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform">
                        <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600"><Users className="w-5 h-5" /></div>
                        <div className="text-center">
                            <p className="text-xs font-black text-gray-900 dark:text-white">Indicar</p>
                            <p className="text-[9px] text-gray-400 font-black uppercase mt-0.5">Ganhe R$ 5,00</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center opacity-30">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.4em]">Freguesia • Rio de Janeiro</p>
            </div>
        </div>
      )}

      <SpinWheelModal 
        isOpen={isSpinWheelOpen} 
        onClose={() => setIsSpinWheelOpen(false)} 
        userId={user?.id || null} 
        userRole={userRole || null} 
        onWin={onSpinWin} 
        onRequireLogin={onRequireLogin} 
        onViewHistory={() => onNavigate('prize_history')} 
      />
    </div>
  );
};
