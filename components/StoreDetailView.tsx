
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
  Construction
} from 'lucide-react';
import { Store, BusinessHour, StoreReview } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { trackOrganicEvent, OrganicEventType } from '../lib/analytics';

const WEEK_DAYS_LABELS: Record<string, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quarta-feira',
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


export const StoreDetailView: React.FC<{ 
  store: Store; 
  onBack: () => void; 
  onPay?: () => void;
  onClaim?: () => void;
}> = ({ store, onBack, onPay, onClaim }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'hours' | 'payment'>('description');
  const [isClosedReporting, setIsClosedReporting] = useState(false);
  const [closedReported, setClosedReported] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const goToNext = () => setCurrentSlide(prev => (prev + 1) % images.length);
  const goToPrev = () => setCurrentSlide(prev => (prev - 1 + images.length) % images.length);

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
    setTimeout(() => {
        setIsClosedReporting(false);
        setClosedReported(true);
    }, 1200);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) return;
    setIsSubmittingReview(true);
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewSuccessMessage('Avaliação enviada (modo teste)');
      setUserRating(0);
      setUserComment('');
      setTimeout(() => setReviewSuccessMessage(''), 3000);
    }, 1500);
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
  const wazeRouteUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;
  const instagramUrl = store.instagram ? `https://instagram.com/${store.instagram.replace('@', '')}` : '#';

  const reviewsToDisplay = useMemo(() => {
    return isPlaceholder ? [] : MOCK_REVIEWS;
  }, [isPlaceholder]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans relative overflow-x-hidden">
      <main className="pb-24">
        
        {/* --- CAROUSEL DE IMAGENS --- */}
        <section className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-gray-100 dark:bg-gray-800 group">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-40">
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

          <div className="relative w-full h-full overflow-hidden">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Imagem da loja ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30">
              {images.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-4 bg-white shadow-md' : 'w-1.5 bg-white/50'}`}></button>
              ))}
            </div>
          )}
        </section>

        <div className="px-5 relative">
          
          {/* --- LOGO CENTRALIZADA --- */}
          <div className="flex justify-center -mt-12 z-20 relative">
            <div className="w-24 h-24 rounded-[28px] bg-white dark:bg-gray-800 p-1 shadow-lg border-4 border-white dark:border-gray-900 overflow-hidden">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-[24px]" />
            </div>
          </div>

          {/* CARD DE INFORMAÇÕES */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 pt-16 -mt-12 text-center shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{store.name}</h1>
              {(store.verified || store.claimed) && (
                  <div className="flex items-center gap-1 text-[#1E5BFF]">
                      <BadgeCheck size={20} className="fill-current" />
                  </div>
              )}
            </div>

            {/* AVISO PERFIL EM CONSTRUÇÃO */}
            {isPlaceholder && (
              <div className="mt-2 mb-4 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800 flex items-center justify-center gap-2 mx-auto w-fit">
                <Construction size={14} className="text-amber-600" />
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Perfil em Construção</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="uppercase font-bold tracking-widest text-gray-400">{store.category}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-gray-200">{store.rating}</span>
                </div>
            </div>
          </div>
        
          {/* AÇÕES DE CONTATO */}
          <section className="mb-10 space-y-6">
              <div className="flex gap-3">
                  <a 
                    href={`https://wa.me/55${phoneDigits}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => track('store_click_whatsapp')} 
                    className="flex-1 bg-[#00D95F] hover:bg-[#00C254] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-green-500/10 active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    WhatsApp
                  </a>
                  {store.instagram && !isPlaceholder && (
                    <a 
                      href={instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => track('store_click_instagram')} 
                      className="flex-1 bg-gradient-to-br from-purple-600 via-rose-500 to-amber-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-rose-500/10 active:scale-95 transition-all text-xs uppercase tracking-widest"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
              </div>

              {!isPlaceholder && (
                <div className="space-y-4">
                    <div className="flex items-start gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0">
                            <MapPin size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Endereço Unidade</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{addressFormatted}</p>
                        </div>
                    </div>
                    {hasAddress && (
                      <div className="flex justify-center gap-3">
                          <a href={wazeRouteUrl} target="_blank" rel="noopener" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white shadow-md active:scale-95 transition-all">
                              <Navigation size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Waze</span>
                          </a>
                          <a href={gmapsRouteUrl} target="_blank" rel="noopener" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-md active:scale-95 transition-all">
                              <MapIcon size={16} className="text-green-500" /><span className="text-[10px] font-black uppercase tracking-widest">Maps</span>
                          </a>
                      </div>
                    )}
                </div>
              )}
          </section>

          {/* ABAS DE CONTEÚDO */}
          <section className="mb-10">
              <div className="flex items-center gap-2 sm:gap-6 mb-8 px-1 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`flex-shrink-0 pb-4 text-xs font-bold uppercase tracking-widest transition-all relative px-2 ${activeTab === 'description' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                  >
                    Sobre
                    {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-t-full"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-shrink-0 pb-4 text-xs font-bold uppercase tracking-widest transition-all relative px-2 ${activeTab === 'reviews' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                  >
                    Avaliações
                    {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-t-full"></div>}
                  </button>
                  {!isPlaceholder && (
                    <>
                      <button 
                        onClick={() => setActiveTab('hours')}
                        className={`flex-shrink-0 pb-4 text-xs font-bold uppercase tracking-widest transition-all relative px-2 ${activeTab === 'hours' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                      >
                        Horário
                        {activeTab === 'hours' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-t-full"></div>}
                      </button>
                    </>
                  )}
              </div>

              {activeTab === 'description' && (
                <div className="animate-in fade-in duration-500">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {store.description}
                    </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="animate-in fade-in duration-500 space-y-6">
                    {reviewsToDisplay.length > 0 ? (
                        reviewsToDisplay.map((rev) => (
                          <div key={rev.id} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-[24px] border border-gray-100 dark:border-gray-800">
                              <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                          <UserIcon size={14} />
                                      </div>
                                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{rev.user_name}</p>
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                      {[1,2,3,4,5].map(s => (
                                          <Star key={s} size={10} className={`${s <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                      ))}
                                  </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{rev.comment}"</p>
                          </div>
                        ))
                    ) : (
                        <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[24px] border border-dashed border-gray-200 dark:border-gray-800">
                            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Ainda não há avaliações.</p>
                        </div>
                    )}
                </div>
              )}

              {activeTab === 'hours' && !isPlaceholder && (
                <div className="animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="space-y-4">
                            {store.business_hours ? (Object.entries(store.business_hours).map(([key, value]) => {
                                const h = value as BusinessHour;
                                return (<div key={key} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 dark:border-gray-800 last:border-0"><span className="font-medium text-gray-600 dark:text-gray-400">{WEEK_DAYS_LABELS[key] || key}</span><span className={`font-bold ${h.open ? 'text-gray-900 dark:text-white' : 'text-rose-400 uppercase text-[10px]'}`}>{h.open ? `${h.start}–${h.end}` : 'Fechado'}</span></div>);
                            })) : (<div className="py-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800"><p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Horário não informado.</p></div>)}
                        </div>
                    </div>
                </div>
              )}
          </section>
        </div>
      </main>
    </div>
  );
};
