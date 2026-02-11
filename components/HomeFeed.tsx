
import React, { useState, useMemo, useRef } from 'react';
import { Store, Category, CommunityPost, ServiceRequest, ServiceUrgency, Classified } from '@/types';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  CheckCircle2, 
  Lock, 
  Zap, 
  Loader2, 
  Hammer, 
  Plus, 
  Heart, 
  Bookmark, 
  Home as HomeIcon,
  MessageSquare, 
  MapPin, 
  Camera, 
  X, 
  Send, 
  ChevronRight,
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_COMMUNITY_POSTS, MOCK_CLASSIFIEDS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { LaunchOfferBanner } from '@/components/LaunchOfferBanner';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';
import { FifaBanner } from '@/components/FifaBanner';
import { AcontecendoAgora } from '@/components/AcontecendoAgora';
import { CouponCarousel } from '@/components/CouponCarousel';

// Imagens de fallback realistas e variadas
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800',
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
  'https://images.unsplash.com/photo-1605218427368-35b019b85c11?q=80&w=800',
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800'
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const MiniPostCard: React.FC<{ post: CommunityPost; onNavigate: (view: string) => void; }> = ({ post, onNavigate }) => {
  const postImage = post.imageUrl || (post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : getFallbackImage(post.id));
  
  return (
    <div className="flex-shrink-0 w-28 snap-center p-1">
      <div 
        onClick={() => onNavigate('neighborhood_posts')}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer h-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img src={postImage} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-1 left-1.5 right-1">
            <p className="text-[9px] font-bold text-white drop-shadow-md truncate">{post.userName}</p>
          </div>
        </div>
        <div className="p-2 pt-1.5 flex-1">
            <p className="text-[9px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2 font-medium">
                {post.content}
            </p>
        </div>
      </div>
    </div>
  );
};

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
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const { currentNeighborhood } = useNeighborhood();
  
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [lastCreatedRequestId, setLastCreatedRequestId] = useState<string | null>(null);

  // Filtro de categorias para a Home conforme solicitação do layout
  const homeCategories = useMemo(() => {
    const ids = [
      'cat-saude',   // Saúde
      'cat-pets',    // Pets
      'cat-fashion', // Moda
      'cat-beauty',  // Beleza
      'cat-coupons', // Cupom
      'cat-more'     // + Mais
    ];
    return ids.map(id => CATEGORIES.find(c => c.id === id)).filter((c): c is Category => !!c);
  }, []);

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

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}

      {/* 1. CATEGORIAS (LAYOUT ATUALIZADO: 6 ITENS, FILEIRA ÚNICA, SEM COMIDA) */}
      <section className="w-full bg-[#FFFFFF] dark:bg-gray-950 py-6 px-5 relative z-10 border-b border-gray-50 dark:border-gray-900">
        <div className="flex justify-between items-start gap-1">
          {homeCategories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center gap-2 flex-1 active:scale-95 transition-all group"
            >
              <div className={`w-12 h-12 rounded-[18px] shadow-sm flex items-center justify-center ${cat.color} ${cat.id === 'cat-more' ? 'border border-gray-100 dark:border-gray-800' : 'border border-white/10'} group-hover:brightness-110`}>
                {React.cloneElement(cat.icon as any, { 
                  className: `w-6 h-6 ${cat.id === 'cat-more' ? 'text-gray-400 dark:text-gray-500' : 'text-white'}`, 
                  strokeWidth: 3 
                })}
              </div>
              <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. CARROSSEL PRINCIPAL (Banners) */}
      <section className="bg-white dark:bg-gray-950 w-full">
        <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
      </section>

      {/* NOVO BLOCO DE CUPONS */}
      <CouponCarousel onNavigate={onNavigate} />

      {/* BLOCO: ACONTECENDO AGORA */}
      <AcontecendoAgora onNavigate={onNavigate} />

      {/* WIZARD DE ORÇAMENTO (Quando aberto) */}
      {wizardStep > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 -mt-4 mx-5 mb-10 animate-in slide-in-from-bottom duration-500 border border-gray-100 dark:border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-blue-500/5 z-50">
          <button onClick={() => setWizardStep(0)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-slate-800 rounded-full"><X size={20} /></button>
          
          {wizardStep === 1 && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2">Que tipo de serviço?</h3>
                <p className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">Escolha uma categoria para encontrar profissionais perto de você</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {l: 'Obras & Reformas', i: Hammer, iIcon: <Hammer/>, c: 'bg-orange-500', t: 'text-orange-500'}, 
                  {l: 'Serviços Rápidos', i: Zap, iIcon: <Zap/>, c: 'bg-blue-600', t: 'text-blue-600'}, 
                  {l: 'Casa & Instalações', i: HomeIcon, iIcon: <HomeIcon/>, c: 'bg-emerald-600', t: 'text-emerald-600'}, 
                  {l: 'Eventos & Criativos', i: Sparkles, iIcon: <Sparkles/>, c: 'bg-purple-600', t: 'text-purple-600'}
                ].map(s => (
                  <button 
                    key={s.l} 
                    onClick={() => { setSelectedService(s.l); setWizardStep(2); }} 
                    className="group p-6 bg-gray-50 dark:bg-slate-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${s.c} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center ${s.t} group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(s.iIcon as any, { size: 32, strokeWidth: 2.5 })}
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
                        if(lastCreatedRequestId) {
                          onNavigate('service_chat', { requestId: lastCreatedRequestId }); 
                        } else {
                          onNavigate('services_landing');
                        }
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

      {/* 7. EXPLORAR BAIRRO (Lista de Lojas) */}
      <div className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
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

const ChevronDown = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
