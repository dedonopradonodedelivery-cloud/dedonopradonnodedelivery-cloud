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
  ImageIcon,
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
  /* Fix: adding missing imports for 'Check' and 'XCircle' used on line 312 */
  Check,
  XCircle
} from 'lucide-react';
import { Store, BusinessHour, StoreReview } from '../types';
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

const PixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g fill="currentColor">
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm47.78 131.45-31.11-31.11a12 12 0 0 0-17 0l-31.11 31.11a12 12 0 0 1-18.33-15.43l31.11-31.11a12 12 0 0 0 0-17l-31.11-31.11a12 12 0 0 1 17-17l31.11 31.11a12 12 0 0 0 17 0l31.11-31.11a12 12 0 1 1 17 17l-31.11 31.11a12 12 0 0 0 0 17l31.11 31.11a12 12 0 1 1-15.44 18.33Z"/>
    </g>
  </svg>
);

const paymentIconMap: Record<string, React.ElementType> = {
  'Dinheiro': Coins,
  'Pix': PixIcon,
  'Cartão de Crédito': CreditCard,
  'Cartão de Débito': CreditCard,
  'VR': Ticket,
  'VA': Ticket,
  'Vale Refeição / Alimentação': Ticket,
};

// Imagens fake para o feed em grade
const FEED_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
  'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=400',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400',
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400',
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=400',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=400',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
];

export const StoreDetailView: React.FC<{ 
  store: Store; 
  onBack: () => void; 
  onPay?: () => void;
  onClaim?: () => void;
}> = ({ store, onBack, onPay, onClaim }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'hours' | 'payments'>('description');
  const [isClosedReporting, setIsClosedReporting] = useState(false);
  const [closedReported, setClosedReported] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hook para salvar posts, passado para o PostCard (embora o PostCard não seja mais usado diretamente aqui, mantemos se necessário)
  const { isPostSaved, toggleSavePost } = useSavedPosts(user);

  // Perfil Fake/Construção
  const isPlaceholder = store.name === 'Loja Parceira';

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  const images = useMemo(() => {
    const gallery = store.gallery?.slice(0, 6) || [];
    if (gallery.length > 0) return gallery;
    return [store.banner_url || store.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"];
  }, [store]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const track = (eventType: OrganicEventType) => {
    if (store) {
      trackOrganicEvent(eventType, store.id, currentNeighborhood, user);
    }
  };

  useEffect(() => {
    track('store_view');
  }, []);

  const handleReportClosed = () => {
    setIsClosedReporting(true);
    // Simulação de lógica: salvamos o reporte no localStorage.
    // Em produção, isso iria para uma tabela 'closed_reports'.
    const reports = JSON.parse(localStorage.getItem(`closed_reports_${store.id}`) || '[]');
    const userId = user?.id || 'anonymous';
    if (!reports.includes(userId)) {
      reports.push(userId);
      localStorage.setItem(`closed_reports_${store.id}`, JSON.stringify(reports));
    }

    setTimeout(() => {
        setIsClosedReporting(false);
        setClosedReported(true);
        if (reports.length >= 3) {
            console.log(`ALERTA ADM: Loja ${store.name} reportada como fechada por 3 usuários.`);
            // Em produção, dispararia notificação via edge function
        }
    }, 1200);
  };

  const logoImg = store.logo_url || store.logoUrl || '/assets/default-logo.png';
  const phoneDigits = (store.whatsapp_publico || store.phone || '').replace(/\D/g, '');
  
  const addressFormatted = useMemo(() => {
    if (store.rua) {
        return `${store.rua}, ${store.numero}${store.complemento ? ` - ${store.complemento}` : ''} - ${store.bairro}`;
    }
    return store.address || 'Endereço não informado';
  }, [store]);

  const hasAddress = addressFormatted !== 'Endereço não informado';
  const encodedAddress = encodeURIComponent(addressFormatted);
  const gmapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const instagramUrl = store.instagram ? `https://instagram.com/${store.instagram.replace('@', '')}` : '#';

  const reviewsToDisplay = useMemo(() => {
    return isPlaceholder ? [] : MOCK_REVIEWS;
  }, [isPlaceholder]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans relative overflow-x-hidden">
      <main className="pb-24">
        
        {/* --- CAROUSEL DE IMAGENS (BANNER TOPO) --- */}
        <section className="relative w-full h-[220px] sm:h-[280px] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-40">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-2">
              <button onClick={() => track('store_click_share')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => { setIsFavorite(!isFavorite); track('store_click_favorite'); }} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            </div>
          </div>

          <div className="relative w-full h-full">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Imagem da loja ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </section>

        <div className="px-5 relative">
          
          {/* --- LOGO CENTRALIZADA (ESTILO IFOD) --- */}
          <div className="flex justify-center -mt-14 z-20 relative">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-xl border-4 border-white dark:border-gray-900 overflow-hidden">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>

          {/* CARD DE INFORMAÇÕES (ESTILO IFOD SOBREPOSTO) */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 pt-12 -mt-10 text-center shadow-lg border border-gray-100 dark:border-gray-800 relative z-10">
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

              {/* Botões de Ação Rápida (Aumentados e em Grid) */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                <button onClick={() => { track('store_click_whatsapp'); window.open(`https://wa.me/55${phoneDigits}`, '_blank'); }} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-emerald-100 dark:border-emerald-800 shadow-sm">
                        <MessageSquare size={24} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Whats</span>
                </button>
                <button onClick={() => { track('store_click_call'); window.open(`tel:${phoneDigits}`, '_self'); }} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-blue-100 dark:border-blue-800 shadow-sm">
                        <Phone size={24} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ligar</span>
                </button>
                <button onClick={() => { track('store_click_instagram'); window.open(instagramUrl, '_blank'); }} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-pink-100 dark:border-pink-800 shadow-sm">
                        <Instagram size={24} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Insta</span>
                </button>
                <button onClick={() => { track('store_click_directions'); window.open(gmapsRouteUrl, '_blank'); }} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all border border-orange-100 dark:border-orange-800 shadow-sm">
                        <Navigation2 size={24} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rota</span>
                </button>
              </div>

              {/* Novas Ações de Reivindicação e Reporte */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={onClaim}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800 active:scale-95 transition-all"
                >
                  <UserCheck size={14} />
                  Reivindicar
                </button>
                <button 
                  onClick={handleReportClosed}
                  disabled={isClosedReporting || closedReported}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border active:scale-95 transition-all ${
                    closedReported 
                      ? 'bg-red-50 dark:bg-red-900/10 text-red-600 border-red-100' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {isClosedReporting ? <Loader2 size={14} className="animate-spin" /> : closedReported ? <Check size={14}/> : <XCircle size={14}/>}
                  {closedReported ? 'Reportado' : 'Loja fechou'}
                </button>
              </div>
          </div>
        </div>

        {/* TABS DE CONTEÚDO REORGANIZADAS */}
        <div className="mt-8 px-5">
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
                {[
                  { id: 'description', label: 'Sobre' },
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

            {/* TAB: SOBRE (Com Feed em Grade) */}
            {activeTab === 'description' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight flex items-center gap-2">
                            <Info size={16} className="text-[#1E5BFF]" /> Sobre a loja
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            {store.description}
                        </p>
                        
                        {hasAddress && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{addressFormatted}</p>
                                        <div className="flex gap-4 mt-3">
                                            <button onClick={() => window.open(gmapsRouteUrl, '_blank')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Google Maps</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FEED EM GRADE ESTILO INSTAGRAM DENTRO DO SOBRE */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <ImageIcon size={16} className="text-blue-500" />
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Feed da Loja</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-1 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                            {FEED_PLACEHOLDERS.map((url, i) => (
                                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 overflow-hidden relative group">
                                    <img src={url} alt={`Feed ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust Block */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <TrustBlock store={store} />
                    </div>
                </div>
            )}

            {/* TAB: AVALIAÇÕES */}
            {activeTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="text-center px-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">{store.rating.toFixed(1)}</span>
                            <div className="flex gap-0.5 text-yellow-400 justify-center mt-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={10} fill={s <= Math.round(store.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-2">{store.reviewsCount} avaliações</p>
                        </div>
                        <div className="h-12 w-px bg-gray-100 dark:bg-gray-800"></div>
                        <div className="flex-1">
                            <button className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                Avaliar Loja
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {reviewsToDisplay.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <UserIcon size={14} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{review.user_name}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-0.5 text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: HORÁRIOS */}
            {activeTab === 'hours' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="space-y-4">
                            {Object.entries(store.business_hours || {}).map(([dayKey, hours]) => {
                                const h = hours as BusinessHour;
                                return (
                                    <div key={dayKey} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                                        <span className="font-bold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
                                            {WEEK_DAYS_LABELS[dayKey] || dayKey}
                                        </span>
                                        {h.open ? (
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {h.start} - {h.end}
                                            </span>
                                        ) : (
                                            <span className="font-bold text-red-400">Fechado</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: FORMAS DE PAGAMENTO */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                          <CreditCard size={16} className="text-emerald-500" /> Formas de Pagamento
                      </h3>
                      <div className="flex flex-wrap gap-2">
                          {(store.payment_methods || ['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito']).map((method, idx) => {
                              const Icon = paymentIconMap[method] || Coins;
                              return (
                                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                      <Icon size={14} className="text-gray-500 dark:text-gray-400" />
                                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{method}</span>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
            )}
        </div>

      </main>
    </div>
  );
};