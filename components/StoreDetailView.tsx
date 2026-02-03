
import React, { useEffect, useState, useMemo } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ArrowRight,
  Instagram,
  Building2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Quote,
  ThumbsUp,
  Loader2,
  Map as MapIcon,
  Navigation,
  Navigation2,
  Send,
  User as UserIcon,
  CornerDownRight,
  BadgeCheck,
  Coins,
  Ticket,
  Zap,
  ChevronRight as ChevronRightIcon,
  Construction,
  Newspaper,
  Info,
  Flag,
  UserCheck,
  Check,
  XCircle,
  Image as ImageIconLucide,
  Tag as TagIcon,
  X
} from 'lucide-react';
import { Store, BusinessHour, StoreReview, StorePromotion } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { trackOrganicEvent, OrganicEventType } from '../lib/analytics';
import { MOCK_COMMUNITY_POSTS } from '../constants';
import { PostCard } from './PostCard';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { TrustBlock } from './TrustBlock';

const WEEK_DAYS_LABELS: Record<string, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

const MOCK_BUSINESS_HOURS: Record<string, BusinessHour> = {
    segunda: { open: true, start: '08:00', end: '18:00' },
    terca: { open: true, start: '08:00', end: '18:00' },
    quarta: { open: true, start: '08:00', end: '18:00' },
    quinta: { open: true, start: '08:00', end: '18:00' },
    sexta: { open: true, start: '08:00', end: '18:00' },
    sabado: { open: true, start: '09:00', end: '14:00' },
    domingo: { open: false, start: '', end: '' },
};

const MOCK_REVIEWS: StoreReview[] = [
  {
    id: 'rev-1',
    user_id: 'u1',
    user_name: 'Anônimo',
    rating: 5,
    comment: 'Comida excelente e entrega rápida! Recomendo a todos.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    merchant_response: {
      text: 'Muito obrigado pelo feedback! Ficamos felizes que tenha gostado.',
      responded_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
    }
  },
  {
    id: 'rev-2',
    user_id: 'u2',
    user_name: 'Anônimo',
    rating: 4,
    comment: 'Muito bom, mas a pizza poderia vir um pouco mais quente.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

const paymentIconMap: Record<string, React.ElementType> = {
  'Dinheiro': Coins,
  'Pix': Zap,
  'Cartão de Crédito': CreditCard,
  'Cartão de Débito': CreditCard,
  'VR': Ticket,
  'VA': Ticket,
};

export const StoreDetailView: React.FC<{ 
  store: Store; 
  onBack: () => void; 
  onPay?: () => void;
  onClaim?: () => void;
  onNavigate: (view: string, data?: any) => void;
}> = ({ store, onBack, onPay, onClaim, onNavigate }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'promotions' | 'reviews' | 'hours' | 'payments'>('description');
  const [selectedPromotion, setSelectedPromotion] = useState<StorePromotion | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoImageSlide, setPromoImageSlide] = useState(0);

  const isPlaceholder = store.name === 'Loja Parceira';

  const images = useMemo(() => {
    const gallery = store.gallery?.slice(0, 6) || [];
    if (gallery.length > 0) return gallery;
    return [store.banner_url || store.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"];
  }, [store]);

  const promotions = useMemo(() => {
    const saved = localStorage.getItem(`promotions_${store.id}`);
    const list: StorePromotion[] = saved ? JSON.parse(saved) : [];
    const now = new Date().getTime();
    
    return list.filter(p => {
        const start = new Date(p.startDate).getTime();
        const end = new Date(p.endDate).getTime();
        return (p.status === 'active' || p.status === 'scheduled') && now >= start && now <= end;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [store.id, activeTab]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const track = (eventType: OrganicEventType) => {
    if (store) trackOrganicEvent(eventType, store.id, currentNeighborhood, user);
  };

  useEffect(() => {
    track('store_view');
  }, []);

  const logoImg = store.logo_url || store.logoUrl || '/assets/default-logo.png';
  const phoneDigits = (store.whatsapp_publico || store.phone || '').replace(/\D/g, '');
  
  const addressFormatted = useMemo(() => {
    if (store.rua) return `${store.rua}, ${store.numero}${store.complemento ? ` - ${store.complemento}` : ''} - ${store.bairro}`;
    return store.address || 'Endereço não informado';
  }, [store]);

  const gmapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressFormatted)}`;
  const instagramUrl = store.instagram ? `https://instagram.com/${store.instagram.replace('@', '')}` : '#';

  const displayHours = useMemo(() => {
    if (store.business_hours && Object.keys(store.business_hours).length > 0) return store.business_hours;
    return MOCK_BUSINESS_HOURS;
  }, [store.business_hours]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans relative overflow-x-hidden">
      <main className="pb-24">
        
        <section className="relative w-full h-[220px] sm:h-[280px] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-40">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-2">
              <button onClick={() => track('store_click_share')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => setIsFavorite(!isFavorite)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            </div>
          </div>

          <div className="relative w-full h-full">
            {images.map((img, index) => (
              <img key={index} src={img} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </section>

        <div className="px-5 relative">
          <div className="flex justify-center -mt-24 z-30 relative">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-xl border-4 border-white dark:border-gray-900 overflow-hidden">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 pt-12 -mt-20 text-center shadow-lg border border-gray-100 dark:border-gray-800 relative z-10">
              <div className="mb-2">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">{store.name}</h1>
                    {store.verified && <BadgeCheck className="w-5 h-5 text-[#1E5BFF] fill-blue-50 dark:fill-blue-900/30" />}
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{store.category} • {store.subcategory}</p>
              </div>
              
              <div className="flex justify-center gap-3 mt-4">
                  <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-2xl border border-yellow-100 dark:border-yellow-800/50">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">{store.rating.toFixed(1)}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border ${store.isOpenNow ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'}`}>
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-tight">{store.isOpenNow ? 'Aberto' : 'Fechado'}</span>
                  </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-8">
                <button onClick={() => window.open(`https://wa.me/55${phoneDigits}`, '_blank')} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-emerald-100 dark:border-emerald-800 shadow-sm"><MessageSquare size={24} /></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Whats</span>
                </button>
                <button onClick={() => window.open(`tel:${phoneDigits}`, '_self')} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-blue-100 dark:border-blue-800 shadow-sm"><Phone size={24} /></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ligar</span>
                </button>
                <button onClick={() => window.open(instagramUrl, '_blank')} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-pink-100 dark:border-pink-800 shadow-sm"><Instagram size={24} /></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Insta</span>
                </button>
                <button onClick={() => window.open(gmapsRouteUrl, '_blank')} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-orange-100 dark:border-orange-800 shadow-sm"><Navigation2 size={24} /></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rota</span>
                </button>
              </div>
          </div>
        </div>

        <div className="mt-8 px-5">
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
                {[
                  { id: 'description', label: 'Sobre' },
                  { id: 'promotions', label: 'Promoções' },
                  { id: 'reviews', label: 'Avaliações' },
                  { id: 'hours', label: 'Horários' },
                  { id: 'payments', label: 'Formas de pagamento' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'description' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight flex items-center gap-2">
                            <Info size={16} className="text-[#1E5BFF]" /> Sobre a loja
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{store.description}</p>
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{addressFormatted}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'promotions' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {promotions.length > 0 ? promotions.map((promo) => (
                        <div 
                            key={promo.id}
                            onClick={() => setSelectedPromotion(promo)}
                            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col group cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="aspect-[16/7] relative overflow-hidden bg-gray-100">
                                <img src={promo.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg shadow-lg">{promo.type}</span>
                                    {promo.status === 'scheduled' && <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg shadow-lg">Programada</span>}
                                </div>
                                {promo.discount && (
                                    <div className="absolute bottom-3 right-3 bg-red-600 text-white font-black px-3 py-1 rounded-xl shadow-xl text-xs uppercase tracking-tighter">
                                        {promo.discount}% OFF
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight flex-1 pr-4">{promo.title}</h4>
                                    {promo.value && <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg leading-none">R$ {promo.value.toFixed(2)}</span>}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 font-medium mb-4">{promo.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <Clock size={12} />
                                        <span>Validade: {new Date(promo.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">Ver Oferta <ChevronRightIcon size={12} strokeWidth={3} /></div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center flex flex-col items-center opacity-40">
                            <TagIcon size={48} className="text-gray-300 mb-4" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nenhuma promoção ativa no momento.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Mantendo as outras abas conforme o layout anterior */}
            {activeTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="text-center px-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">{store.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex-1">
                            <button className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Avaliar Loja</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'hours' && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in">
                    <div className="space-y-4">
                        {/* FIX: Cast Object.entries to [string, BusinessHour][] to resolve 'unknown' property access errors */}
                        {(Object.entries(displayHours) as [string, BusinessHour][]).map(([dayKey, hours]) => (
                            <div key={dayKey} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                                <span className="font-bold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">{WEEK_DAYS_LABELS[dayKey] || dayKey}</span>
                                {hours.open ? <span className="font-bold text-gray-900 dark:text-white">{hours.start} - {hours.end}</span> : <span className="font-bold text-red-400">Fechado</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in">
                  <div className="flex flex-wrap gap-2">
                      {(store.payment_methods || ['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito']).map((method, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{method}</span>
                          </div>
                      ))}
                  </div>
              </div>
            )}
        </div>
      </main>

      {/* MODAL DETALHES DA PROMOÇÃO */}
      {selectedPromotion && (
          <div className="fixed inset-0 z-[1001] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedPromotion(null)}>
              <div 
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
                onClick={e => e.stopPropagation()}
              >
                  <div className="relative w-full aspect-square bg-gray-100 shrink-0">
                      <img src={selectedPromotion.images[promoImageSlide]} alt="" className="w-full h-full object-cover transition-opacity duration-300" />
                      <button onClick={() => setSelectedPromotion(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md active:scale-90 transition-all"><X size={20}/></button>
                      
                      {selectedPromotion.images.length > 1 && (
                          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
                              {selectedPromotion.images.map((_, i) => (
                                  <button key={i} onClick={() => setPromoImageSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === promoImageSlide ? 'w-6 bg-white shadow-md' : 'w-1.5 bg-white/40'}`} />
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="p-8 overflow-y-auto no-scrollbar">
                      <div className="flex items-center gap-2 mb-4">
                          <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest shadow-lg shadow-blue-500/10">{selectedPromotion.type}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><CalendarDays size={12}/> Válido até {new Date(selectedPromotion.endDate).toLocaleDateString()}</span>
                      </div>

                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{selectedPromotion.title}</h2>
                      
                      <div className="flex items-center gap-6 mb-8">
                          {selectedPromotion.value && (
                              <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Preço Promo</span>
                                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 italic">R$ {selectedPromotion.value.toFixed(2)}</span>
                              </div>
                          )}
                          {selectedPromotion.discount && (
                              <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Economia</span>
                                  <span className="text-2xl font-black text-red-600 dark:text-red-400">{selectedPromotion.discount}% OFF</span>
                              </div>
                          )}
                      </div>

                      <div className="space-y-6">
                          <div className="space-y-2">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição da Oferta</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{selectedPromotion.description}</p>
                          </div>

                          <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 flex gap-4 items-start">
                              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                  <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Regras de Uso</h4>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">Promoção sujeita a estoque e disponibilidade da loja no momento da compra.</p>
                              </div>
                          </div>
                      </div>

                      <button onClick={() => { setSelectedPromotion(null); window.open(`https://wa.me/55${phoneDigits}`, '_blank'); }} className="w-full mt-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                          <MessageSquare size={18} fill="white" /> Falar com Lojista
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const CalendarDays = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>
  </svg>
);
