
import React, { useState, useMemo } from 'react';
import { Store, Category, ServiceRequest, ServiceUrgency } from '@/types';
import { 
  Plus, 
  X, 
  Send, 
  ChevronRight,
  Zap,
  ShoppingBag,
  Pill,
  Stethoscope,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  MapPin,
  Clock,
  Flame,
  CheckCircle2,
  Loader2,
  Camera,
  Home as HomeIcon,
  Search,
  // FIX: Added missing Info icon import from lucide-react
  Info
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_OFERTAS_RELAMPAGO, MOCK_RADAR_V3, MOCK_MISSOES, STORES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { CouponCarousel } from '@/components/CouponCarousel';
import { AcontecendoAgora } from '@/components/AcontecendoAgora';
import { HojeNoBairro } from '@/components/HojeNoBairro';
import { RadarDoBairro } from '@/components/RadarDoBairro';
import { RecomendadosParaVoce } from '@/components/RecomendadosParaVoce';

interface HomeFeedProps {
  onNavigate: (view: string, data?: any) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user,
  userRole
}) => {
  const { currentNeighborhood } = useNeighborhood();
  
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && images.length < 3) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleWizardSubmit = () => {
    if (!user) {
        onNavigate('profile');
        return;
    }
    setIsSubmittingLead(true);
    setTimeout(() => {
      setIsSubmittingLead(false);
      setWizardStep(4);
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-[#F8F9FC] dark:bg-black w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {/* 1. HOJE NO BAIRRO (CONTEXTO & CLIMA) */}
      <HojeNoBairro onSelectCategory={onSelectCategory} />

      {/* 2. RESOLVA RÁPIDO (ATALHOS INTELIGENTES) */}
      <section className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Resolva Rápido ⚡</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
            {[
                { icon: ShoppingBag, label: 'Delivery', color: 'bg-rose-500', target: 'explore' },
                { icon: Pill, label: 'Farmácia', color: 'bg-blue-500', target: 'explore' },
                { icon: Stethoscope, label: 'Saúde', color: 'bg-emerald-500', target: 'health_pre_filter' },
                { icon: Wrench, label: 'Serviços', color: 'bg-amber-500', target: 'services_landing' },
            ].map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => onNavigate(action.target)}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                >
                    <div className={`w-full aspect-square rounded-[1.75rem] ${action.color} flex items-center justify-center text-white shadow-lg shadow-${action.color.split('-')[1]}-500/20`}>
                        <action.icon size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-tighter">{action.label}</span>
                </button>
            ))}
        </div>
      </section>

      {/* 3. OFERTAS RELÂMPAGO (URGÊNCIA) */}
      <section className="py-6">
        <div className="px-5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Ofertas Relâmpago ⏰</h2>
                <div className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase animate-pulse">Live</div>
            </div>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {MOCK_OFERTAS_RELAMPAGO.map(oferta => (
                <button 
                    key={oferta.id}
                    onClick={() => onNavigate('explore')}
                    className="flex-shrink-0 w-72 h-32 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex overflow-hidden group active:scale-[0.98] transition-all"
                >
                    <div className="w-1/3 h-full overflow-hidden">
                        <img src={oferta.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between text-left">
                        <div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Expira em {oferta.timeLeft}</p>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight truncate">{oferta.item}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{oferta.storeName}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-emerald-600 italic">{oferta.discount}</span>
                            <div className="p-1.5 bg-gray-50 rounded-lg text-gray-300 group-hover:text-blue-500 transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </section>

      {/* 4. CUPONS DO DIA (CONVERSÃO) */}
      <CouponCarousel onNavigate={onNavigate} />

      {/* 5. ACONTECENDO AGORA (ENGAGEMENT) */}
      <AcontecendoAgora onNavigate={onNavigate} />

      {/* 6. RADAR DO BAIRRO ( FEED DINÂMICO) */}
      <section className="px-5 py-6">
          <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Radar do Bairro 📡</h2>
          </div>
          <div className="space-y-3">
              {MOCK_RADAR_V3.map(item => (
                  <div key={item.id} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4 animate-in slide-in-from-left duration-500">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          item.type === 'alert' ? 'bg-red-50 text-red-500' :
                          item.type === 'new' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-blue-50 text-blue-600'
                      }`}>
                          {item.type === 'alert' ? <AlertTriangle size={20} /> : 
                           item.type === 'new' ? <Sparkles size={20} /> : <Info size={20} />}
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                              <span className="text-[10px] font-bold text-gray-400">{item.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.content}</p>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 7. MISSÕES DO BAIRRO (GAMIFICAÇÃO) */}
      <section className="px-5 py-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                      <Trophy className="text-amber-400" size={20} />
                      <h2 className="text-sm font-black uppercase tracking-widest">Missões do Bairro</h2>
                  </div>
                  
                  <div className="space-y-6">
                      {MOCK_MISSOES.map(missao => (
                          <div key={missao.id} className="space-y-2">
                              <div className="flex justify-between items-end">
                                  <div>
                                      <p className="font-bold text-sm">{missao.title}</p>
                                      <p className="text-[10px] text-slate-400 font-medium">{missao.task}</p>
                                  </div>
                                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{missao.reward}</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div 
                                      className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                                      style={{ width: `${(missao.progress / missao.total) * 100}%` }}
                                  ></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* 8. RECOMENDADOS PARA VOCÊ (PERSONALIZAÇÃO) */}
      <RecomendadosParaVoce stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />

      <div className="h-10"></div>
    </div>
  );
};
