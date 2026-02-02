
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Store, Category, AdType, CommunityPost, ServiceRequest, ServiceUrgency, Classified } from '../types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  CheckCircle2,
  Clock,
  Lock,
  Star,
  MessageSquare,
  Zap,
  Award,
  Loader2,
  Wrench,
  Key,
  Hammer,
  Plus,
  Heart,
  Share2,
  Bookmark,
  Building2,
  Home as HomeIcon,
  Coins,
  Calendar,
  Coffee,
  MapPin,
  Camera,
  X,
  Send,
  ChevronRight,
  Tag
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS } from '../constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from './LaunchOfferBanner';
import { HomeBannerCarousel } from './HomeBannerCarousel';
import { FifaBanner } from './FifaBanner';

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  const postImage = post.imageUrls?.[0] || 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=400&auto=format&fit=crop';
  
  const handleAction = (e: React.MouseEvent, message: string) => {
      e.stopPropagation();
      alert(message);
  };

  return (
    <div className="flex-shrink-0 w-1/2 snap-center p-1.5">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img src={postImage} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <img src={post.userAvatar} className="w-6 h-6 rounded-full border-2 border-white/80 object-cover" alt={post.userName} />
            <p className="text-xs font-bold text-white drop-shadow-md truncate max-w-[80px]">{post.userName}</p>
          </div>
        </div>
        <div className="px-2 pt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={(e) => handleAction(e, 'Curtido!')} className="text-gray-500 hover:text-rose-500 p-1 transition-colors"><Heart size={20} /></button>
            <button onClick={(e) => handleAction(e, 'Comentários!')} className="text-gray-500 hover:text-blue-500 p-1 transition-colors"><MessageSquare size={20} /></button>
          </div>
          <button onClick={(e) => handleAction(e, 'Salvo!')} className="text-gray-500 hover:text-yellow-500 p-1 transition-colors"><Bookmark size={20} /></button>
        </div>
        <div className="px-3 pb-3 flex-1">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug line-clamp-2">
                {post.content}
            </p>
            <span className="text-[10px] text-gray-400 mt-2 block group-hover:text-blue-500 transition-colors">
                Ver post...
            </span>
        </div>
      </div>
    </div>
  );
};

const MiniClassifiedCard: React.FC<{ item: Classified; onNavigate: (view: string) => void; }> = ({ item, onNavigate }) => {
  return (
    <div className="flex-shrink-0 w-1/2 snap-center p-1.5">
      <div 
        onClick={() => onNavigate('classifieds')}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img src={item.imageUrl || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          {item.price && (
             <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                {item.price}
             </div>
          )}
          <div className="absolute top-2 left-2">
             <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">{item.category.split(' ')[0]}</span>
          </div>
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
            <h3 className="text-xs font-bold text-gray-800 dark:text-white leading-tight line-clamp-2 mb-1">
                {item.title}
            </h3>
            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide truncate flex items-center gap-1">
                <MapPin size={8} /> {item.neighborhood}
            </p>
        </div>
      </div>
    </div>
  );
};

interface HomeFeedFeedProps {
  onNavigate: (view: string, data?: any) => void;
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
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndicator, setScrollIndicator] = useState({ width: '0%', left: '0%' });

  const [wizardStep, setWizardStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [lastCreatedRequestId, setLastCreatedRequestId] = useState<string | null>(null);

  const [consecutiveDays, setConsecutiveDays] = useState(() => {
    return parseInt(localStorage.getItem('reward_consecutive_days') || '1');
  });

  const handleClaimReward = () => {
    if (!user) {
        alert("Entre como usuário para participar do Cupom da Semana.");
        onNavigate('profile'); 
        return;
    }
    
    if (userRole !== 'cliente') {
        alert("Esta funcionalidade é exclusiva para moradores. Lojistas não podem resgatar cupons semanais.");
        return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onNavigate('weekly_reward_page');
    }, 1200);
  };

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
        localStorage.setItem('pending_wizard_state', JSON.stringify({ selectedService, selectedUrgency, description, images }));
        onNavigate('profile');
        return;
    }

    setIsSubmittingLead(true);
    
    const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: ServiceRequest = {
        id: requestId,
        userId: user.id,
        userName: user.user_metadata?.full_name || 'Morador Local',
        serviceType: selectedService || 'Geral',
        description,
        neighborhood: currentNeighborhood,
        urgency: (selectedUrgency as ServiceUrgency) || 'Não tenho pressa',
        images,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    localStorage.setItem('service_requests_mock', JSON.stringify([newLead, ...existing]));
    setLastCreatedRequestId(requestId);

    setTimeout(() => {
      setIsSubmittingLead(false);
      setWizardStep(4);
    }, 1500);
  };

  const updateScrollIndicator = useCallback(() => {
    const el = categoryScrollRef.current;
    if (el) {
        const { scrollWidth, clientWidth, scrollLeft } = el;
        if (scrollWidth <= clientWidth) {
            setScrollIndicator({ width: '0%', left: '0%' });
            return;
        }
        const thumbWidth = (clientWidth / scrollWidth) * 100;
        const thumbLeft = (scrollLeft / scrollWidth) * 100;
        setScrollIndicator({ width: `${thumbWidth}%`, left: `${thumbLeft}%` });
    }
  }, []);

  useEffect(() => {
      const el = categoryScrollRef.current;
      if (el) {
          updateScrollIndicator(); 
          el.addEventListener('scroll', updateScrollIndicator, { passive: true });
          const resizeObserver = new ResizeObserver(updateScrollIndicator);
          resizeObserver.observe(el);
          return () => {
              el.removeEventListener('scroll', updateScrollIndicator);
              resizeObserver.unobserve(el);
          };
      }
  }, [updateScrollIndicator]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* CATEGORIAS */}
      <section className="w-full bg-[#FFFFFF] dark:bg-gray-950 pt-4 pb-0 relative z-10">
        <div ref={categoryScrollRef} className="flex overflow-x-auto no-scrollbar px-4 pb-2 snap-x">
          <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => onSelectCategory(cat)}
                className="flex flex-col items-center group active:scale-95 transition-all"
              >
                <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                  <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                  <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-6 flex justify-center">
          <div className="w-1/3 h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="h-full bg-brand-blue rounded-full" style={{ width: scrollIndicator.width, marginLeft: scrollIndicator.left }}></div>
          </div>
        </div>
      </section>

      <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />

      {/* 1. JPA CONVERSA (ORDEM RECONFIGURADA) */}
      <section className="bg-white dark:bg-gray-950 pt-6 pb-4">
        <div className="px-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">JPA Conversa</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => onNavigate('neighborhood_posts')} className="text-xs font-bold text-blue-500">Ver tudo</button>
                  <button onClick={() => onNavigate('neighborhood_posts')} className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><Plus size={14} /></button>
                </div>
            </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-3.5 px-3.5">
            {MOCK_COMMUNITY_POSTS.slice(0, 5).map((post) => (
                <MiniPostCard key={post.id} post={post} onNavigate={onNavigate} />
            ))}
        </div>
      </section>

      {/* 2. CUPOM DA SEMANA */}
      <section className="bg-white dark:bg-gray-950 px-5 pt-4 mb-2">
        <div className="bg-white dark:bg-gray-900 rounded-[1.75rem] border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-blue-900/5 relative group">
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-white dark:bg-gray-950"></div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 rounded-full bg-white dark:bg-gray-950"></div>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[#1E5BFF] border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#1E5BFF]">Cupom da Semana 🎟️</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Resgate agora e use no bairro</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center my-5 px-1">
              {[1, 2, 3, 4, 5].map((day) => {
                  const isCompleted = day <= (consecutiveDays - 1);
                  const isCurrent = day === consecutiveDays;
                  return (
                    <div key={day} className="flex flex-col items-center gap-1.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative shadow-inner ${isCompleted ? 'bg-blue-500 border-blue-500/50 text-white shadow-md shadow-blue-500/10' : isCurrent ? 'bg-white dark:bg-gray-800 border-blue-500 text-blue-500' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'}`}>
                        {isCompleted ? <CheckCircle2 size={16} strokeWidth={3.5} /> : isCurrent ? <Zap size={14} fill="currentColor" /> : <Lock size={14} />}
                        {isCurrent && !isAnimating && <div className="absolute inset-[-2px] rounded-full bg-blue-400/20 animate-ping"></div>}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isCompleted || isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>Dia {day}</span>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="relative px-4">
              <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700"></div>
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white dark:bg-gray-950"></div>
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white dark:bg-gray-950"></div>
          </div>
          <div className="p-4 pt-5">
            <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight text-center mb-4">
              {userRole === 'lojista' 
                ? "Resgate exclusivo para moradores da região." 
                : !user 
                  ? "Faça login como usuário para desbloquear prêmios!" 
                  : consecutiveDays <= 5 
                    ? "Retire um novo cupom hoje para completar sua sequência!" 
                    : "Parabéns! Você completou sua sequência semanal."}
            </h2>
            <button onClick={handleClaimReward} disabled={isAnimating || !!(userRole === 'cliente' && consecutiveDays > 5)} className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${isAnimating ? 'bg-gray-100 text-gray-400' : (user && userRole !== 'cliente') ? 'bg-gray-200 text-gray-400 grayscale cursor-not-allowed' : !user ? 'bg-blue-600 text-white shadow-blue-500/20' : consecutiveDays <= 5 ? 'bg-[#1E5BFF] text-white shadow-blue-500/20 hover:brightness-110' : 'bg-emerald-500 text-white shadow-emerald-500/20 opacity-50'}`}>
                {isAnimating ? <><Loader2 size={12} className="animate-spin" /> Processando...</> : <>{(user && userRole !== 'cliente') ? "Acesso Restrito" : !user ? "Entrar para começar" : consecutiveDays <= 5 ? `Desbloquear Dia ${consecutiveDays}` : "Sequência Completa"}<ArrowRight size={12} strokeWidth={3} /></>}
            </button>
          </div>
        </div>
      </section>

      {/* 3. SERVIÇOS (BANNER/WIZARD) */}
      <section className="px-5 pt-8 pb-6">
        <FifaBanner onClick={() => setWizardStep(1)} />
      </section>

      {/* 4. JPA CLASSIFICADOS (NOVO BLOCO) */}
      <section className="bg-white dark:bg-gray-950 pt-2 pb-8">
        <div className="px-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">JPA Classificados</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => onNavigate('classifieds')} className="text-xs font-bold text-blue-500">Ver todos</button>
                  <button onClick={() => onNavigate('classifieds')} className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><Plus size={14} /></button>
                </div>
            </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar snap-x -mx-3.5 px-3.5">
            {MOCK_CLASSIFIEDS.slice(0, 5).map((item) => (
                <MiniClassifiedCard key={item.id} item={item} onNavigate={onNavigate} />
            ))}
        </div>
      </section>

      {/* NOVO WIZARD DE ORÇAMENTO (DESIGN ATUALIZADO) */}
      {wizardStep > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 -mt-4 mx-5 mb-10 animate-in slide-in-from-bottom duration-500 border border-gray-100 dark:border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-blue-500/5">
          <button onClick={() => setWizardStep(0)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-slate-800 rounded-full"><X size={20} /></button>
          
          {wizardStep === 1 && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2">Que tipo de serviço?</h3>
                <p className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">Escolha uma categoria para encontrar profissionais perto de você</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {l: 'Obras & Reformas', i: Hammer, c: 'bg-orange-500', t: 'text-orange-500'}, 
                  {l: 'Serviços Rápidos', i: Zap, c: 'bg-blue-600', t: 'text-blue-600'}, 
                  {l: 'Casa & Instalações', i: HomeIcon, c: 'bg-emerald-600', t: 'text-emerald-600'}, 
                  {l: 'Eventos & Criativos', i: Sparkles, c: 'bg-purple-600', t: 'text-purple-600'}
                ].map(s => (
                  <button 
                    key={s.l} 
                    onClick={() => { setSelectedService(s.l); setWizardStep(2); }} 
                    className="group p-6 bg-gray-50 dark:bg-slate-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${s.c} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center ${s.t} group-hover:scale-110 transition-transform`}>
                        <s.i size={32} strokeWidth={2.5} />
                    </div>
                    <p className="text-[10px] font-black text-gray-800 dark:text-slate-200 uppercase tracking-tighter leading-tight">{s.l}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {wizardStep === 2 && (
            <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2">Qual a urgência?</h3>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Quanto antes soubermos, mais rápido você recebe propostas</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 {['Para hoje', 'Amanhã', 'Até 3 dias', 'Não tenho pressa'].map(u => (
                  <button 
                    key={u} 
                    onClick={() => { setSelectedUrgency(u); setWizardStep(3); }} 
                    className="px-6 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-500/50"
                  >
                    <span className="text-sm font-black text-gray-800 dark:text-slate-200 uppercase tracking-widest">{u}</span>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors shadow-sm">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </button>
                 ))}
              </div>
            </div>
          )}
          {wizardStep === 3 && (
             <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-4">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2">Quase lá!</h3>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Descreva o que você precisa com detalhes</p>
                </div>
                <div className="space-y-4">
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Preciso de um eletricista para trocar um disjuntor que está desarmando."
                        maxLength={500}
                        className="w-full h-36 p-5 bg-gray-50 dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-medium transition-all shadow-inner"
                    />
                    <div className="flex gap-3">
                        {images.map((img, i) => (
                            <div key={i} className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100">
                                <img src={img} className="w-full h-full object-cover" />
                                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg"><X size={10}/></button>
                            </div>
                        ))}
                        {images.length < 3 && (
                            <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-blue-500/20 bg-blue-50/30 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-100/50 transition-all">
                                <Camera size={24} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>
                <button 
                    onClick={handleWizardSubmit}
                    disabled={!description || isSubmittingLead}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition-all"
                >
                    {isSubmittingLead ? <Loader2 size={20} className="animate-spin" /> : <>Enviar pedido agora <Send size={18} /></>}
                </button>
             </div>
          )}
          {wizardStep === 4 && (
            <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Tudo pronto! 🎉</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-10 font-medium">Profissionais qualificados do seu bairro acabam de ser notificados.</p>
                <div className="space-y-4">
                    <button 
                      onClick={() => { 
                        setWizardStep(0); 
                        onNavigate('service_chat', { requestId: lastCreatedRequestId }); 
                      }} 
                      className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all"
                    >
                      Acompanhar propostas
                    </button>
                    <button onClick={() => setWizardStep(0)} className="w-full py-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-gray-600">Voltar ao início</button>
                </div>
            </div>
          )}
        </section>
      )}

      {/* LISTA EXPLORAR */}
      <div className="w-full bg-white dark:bg-gray-950 pt-1 pb-10">
        <div className="px-5">
          <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="Tudo o que você precisa" onSeeMore={() => onNavigate('explore')} />
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
            {['all', 'top_rated'].map((f) => (
              <button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>
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
