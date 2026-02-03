
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
  ShieldCheck,
  BadgeCheck,
  ChevronRight as ChevronRightIcon,
  Info,
  LayoutGrid,
  X,
  Navigation2,
  Map as WazeIcon,
  Crown,
  // Added User as UserIcon to fix the Cannot find name error in the reviews section
  User as UserIcon
} from 'lucide-react';
import { Store, BusinessHour, StorePromotion } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { trackOrganicEvent, OrganicEventType } from '../lib/analytics';
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

const STORE_FEED_MOCK = Array.from({ length: 30 }).map((_, i) => ({
  id: `p${i}`,
  imageUrl: `https://images.unsplash.com/photo-${[
    '1513104890138-7c749659a591', '1561758033-d89a9ad46330', '1562322140-8baeececf3df',
    '1516734212186-a967f81ad0d7', '1588776814546-1ffcf47267a5', '1441986300917-64674bd600d8',
    '1587854692152-cbe660dbbb88', '1524661135-423995f22d0b', '1557804506-669a67965ba0',
    '1504674900247-0877df9cc836'
  ][i % 10]}?q=80&w=400&sig=${i}`
}));

const MOCK_PROMOTIONS_LIST: StorePromotion[] = [
    { id: 'pr1', storeId: 'current', title: 'Combo Casal Premium', description: 'Duas pizzas grandes + refrigerante 2L por um preço imbatível.', type: 'Semana', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), value: 89.90, discount: 20, status: 'active', createdAt: new Date().toISOString(), images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800'] },
    { id: 'pr2', storeId: 'current', title: 'Terça Maluca', description: 'Toda terça, qualquer lanche com 30% de desconto.', type: 'Dia', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), discount: 30, status: 'active', createdAt: new Date().toISOString(), images: ['https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800'] },
];

const MOCK_REVIEWS_LIST = Array.from({ length: 8 }).map((_, i) => ({
    id: `r${i}`,
    userName: ['Ricardo Silva', 'Juliana Costa', 'Marcos Oliveira', 'Amanda Lira', 'Pedro Santos', 'Fernanda Rocha', 'Lucas Mendes', 'Sofia Garcia'][i],
    rating: i % 3 === 0 ? 4 : 5,
    comment: [
      'Excelente atendimento e qualidade impecável. Recomendo!',
      'Muito bom, mas o tempo de espera no local foi um pouco longo.',
      'Melhor lugar da Freguesia, sem dúvidas.',
      'Sempre peço pelo app e chega rápido e quentinho.',
      'Comida honesta e preço justo.',
      'Ambiente super agradável para ir com a família.',
      'Gostei muito das promoções, valem super a pena.',
      'Nota 10 para a limpeza e organização.'
    ][i],
    date: `há ${i + 1} dias`
}));

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

  const images = useMemo(() => {
    const gallery = store.gallery?.slice(0, 6) || [];
    if (gallery.length > 0) return gallery;
    return [store.banner_url || store.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"];
  }, [store]);

  const track = (eventType: OrganicEventType) => {
    if (store) trackOrganicEvent(eventType, store.id, currentNeighborhood, user);
  };

  useEffect(() => {
    track('store_view');
  }, []);

  const logoImg = store.logo_url || store.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=1E5BFF&color=fff`;
  const phoneDisplay = store.whatsapp_publico || store.phone || '(21) 99999-9999';
  const phoneDigits = phoneDisplay.replace(/\D/g, '');
  
  const addressFormatted = useMemo(() => {
    if (store.rua) return `${store.rua}, ${store.numero}${store.complemento ? ` - ${store.complemento}` : ''} - ${store.bairro}`;
    return store.address || 'Rua Araguaia, 1260 – Freguesia';
  }, [store]);

  const instagramUrl = store.instagram ? `https://instagram.com/${store.instagram.replace('@', '')}` : '#';

  // Descrição reduzida conforme solicitado
  const shortDescription = useMemo(() => {
    return `Seja bem-vindo ao ${store.name}! Somos referência em ${store.category.toLowerCase()} na região de Jacarepaguá. Nosso compromisso é oferecer uma experiência única aos nossos clientes através da excelência no atendimento e qualidade superior em cada detalhe. Valorizamos a confiança da nossa comunidade local e buscamos sempre inovar para garantir que cada visita ou pedido seja especial. Venha nos visitar ou faça seu pedido pelo WhatsApp e aproveite o melhor do bairro conosco.`;
  }, [store.name, store.category]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans relative overflow-x-hidden">
      <main className="pb-32">
        
        {/* HEADER / IMAGEM DE CAPA */}
        <section className="relative w-full h-[220px] sm:h-[260px] bg-gray-100 dark:bg-gray-800">
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
              <img key={index} src={img} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </section>

        {/* BANNER ARREDONDADO CENTRALIZADO (ESTILO ANTERIOR) */}
        <div className="px-5 relative z-10">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 pt-14 -mt-16 text-center shadow-2xl border border-gray-100 dark:border-gray-800 relative">
              {/* LOGO AVATAR FLUTUANTE */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-40">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 p-1 shadow-xl border-4 border-white dark:border-gray-900 overflow-hidden flex items-center justify-center">
                  <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              <div className="mb-4">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">{store.name}</h1>
                    {store.verified && <BadgeCheck className="w-5 h-5 text-[#1E5BFF] fill-blue-50 dark:fill-blue-900/30 shrink-0" />}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{store.category} • {store.subcategory}</p>
              </div>
              
              <div className="flex justify-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-2xl border border-yellow-100 dark:border-yellow-800/50">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">{store.rating.toFixed(1)}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border ${store.isOpenNow ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-tight">{store.isOpenNow ? 'Aberto' : 'Fechado'}</span>
                  </div>
              </div>

              {/* INFORMAÇÕES DE ENDEREÇO E CONTATO POR ESCRITO */}
              <div className="space-y-2 mb-8 px-2">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="text-[#1E5BFF] shrink-0" />
                    <p className="text-xs font-bold leading-tight line-clamp-1">{addressFormatted}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageSquare size={14} className="text-emerald-500 shrink-0" />
                    <p className="text-xs font-bold">{phoneDisplay}</p>
                </div>
              </div>

              {/* BOTÕES DE AÇÃO REORGANIZADOS */}
              <div className="space-y-3">
                  {/* Linha 1: Principais (WhatsApp + Instagram) */}
                  <div className="flex gap-3">
                      <button 
                        onClick={() => window.open(`https://wa.me/55${phoneDigits}`, '_blank')}
                        className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 active:scale-[0.98] transition-all"
                      >
                          <MessageSquare size={20} fill="white" />
                          <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
                      </button>
                      <button 
                        onClick={() => window.open(instagramUrl, '_blank')}
                        className="flex-1 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/10 active:scale-[0.98] transition-all"
                      >
                          <Instagram size={20} />
                          <span className="text-xs font-black uppercase tracking-widest">Instagram</span>
                      </button>
                  </div>

                  {/* Linha 2: Secundários (Ligar + Waze + Maps) */}
                  <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => window.open(`tel:${phoneDigits}`, '_self')}
                        className="flex flex-col items-center justify-center py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
                      >
                          <Phone size={18} className="mb-1" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Ligar</span>
                      </button>
                      
                      <button 
                        onClick={() => window.open(`https://waze.com/ul?q=${encodeURIComponent(addressFormatted)}`, '_blank')}
                        className="flex flex-col items-center justify-center py-3 bg-blue-50 dark:bg-blue-900/20 text-[#33CCFF] rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 active:scale-95 transition-all"
                      >
                          <WazeIcon size={18} className="mb-1" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Waze</span>
                      </button>
                      
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFormatted)}`, '_blank')}
                        className="flex flex-col items-center justify-center py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
                      >
                          <MapPin size={18} className="mb-1 text-red-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Maps</span>
                      </button>
                  </div>
              </div>
          </div>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="mt-10 px-5">
            <div className="flex bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-full mb-8 overflow-x-auto no-scrollbar border border-gray-100 dark:border-gray-700/50">
                {[
                  { id: 'description', label: 'Sobre' },
                  { id: 'promotions', label: 'Promoções' },
                  { id: 'reviews', label: 'Avaliações' },
                  { id: 'hours', label: 'Horários' },
                  { id: 'payments', label: 'Pagamento' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 px-5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                          activeTab === tab.id 
                            ? 'bg-[#1E5BFF] text-white font-black shadow-lg shadow-blue-500/25 scale-[1.02]' 
                            : 'text-gray-400 dark:text-gray-500 font-bold hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-500">
                {activeTab === 'description' && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium whitespace-pre-wrap">{shortDescription}</p>
                            
                            {/* REMOVIDO BLOCO DUPLICADO DE ENDEREÇO E BOTÕES AQUI */}
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white px-1 uppercase tracking-tight flex items-center gap-2">
                                <LayoutGrid size={16} className="text-[#1E5BFF]" /> Feed da Loja
                            </h3>
                            <div className="grid grid-cols-3 gap-1">
                              {STORE_FEED_MOCK.map((post) => (
                                <div key={post.id} className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative group cursor-pointer active:brightness-75 transition-all">
                                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                              ))}
                            </div>
                        </div>

                        {/* AÇÕES FINAIS REESTILIZADAS */}
                        <div className="pt-10 space-y-4 px-1">
                            <button className="w-full py-5 bg-[#1E5BFF] hover:bg-blue-600 text-white rounded-[1.75rem] text-xs font-black uppercase tracking-[0.15em] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">
                                Reivindicar esta loja
                            </button>
                            <button className="w-full py-4 border-2 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors active:scale-[0.98]">
                                Informar que a loja fechou
                            </button>
                        </div>

                        <div 
                            onClick={() => {}}
                            className="mx-1 p-5 rounded-3xl bg-slate-900 flex items-center justify-between group cursor-pointer border border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400">
                                    <Crown size={18} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Patrocinador Master</p>
                                    <p className="text-xs font-bold text-white">Grupo Esquematiza</p>
                                </div>
                            </div>
                            <ChevronRightIcon size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                )}

                {activeTab === 'promotions' && (
                    <div className="space-y-4">
                        {MOCK_PROMOTIONS_LIST.map((promo) => (
                            <div 
                                key={promo.id}
                                onClick={() => setSelectedPromotion(promo)}
                                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col group cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <div className="aspect-[16/7] relative overflow-hidden bg-gray-100">
                                    <img src={promo.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg shadow-lg">{promo.type}</span>
                                    </div>
                                    {promo.discount && (
                                        <div className="absolute bottom-3 right-3 bg-red-600 text-white font-black px-3 py-1 rounded-xl shadow-xl text-xs uppercase tracking-tighter">
                                            {promo.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-2">{promo.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 font-medium mb-4">{promo.description}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            <Clock size={12} />
                                            <span>Expira em: {new Date(promo.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">Ver Oferta <ChevronRightIcon size={12} strokeWidth={3} /></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-8">
                        <div className="px-1">
                            <TrustBlock store={store} />
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Nota Média</p>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-5xl font-black text-gray-900 dark:text-white">{store.rating.toFixed(1)}</span>
                                <div className="flex flex-col">
                                    <div className="flex gap-0.5 text-yellow-400">
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">8 avaliações</span>
                                </div>
                            </div>
                            <button className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Avaliar Loja</button>
                        </div>

                        <div className="space-y-4 pb-12">
                            {MOCK_REVIEWS_LIST.map((rev) => (
                                <div key={rev.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                                <UserIcon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{rev.userName}</h4>
                                                <div className="flex gap-0.5 text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{rev.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">"{rev.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'hours' && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="space-y-4">
                            {Object.entries(MOCK_BUSINESS_HOURS).map(([dayKey, hours]) => (
                                <div key={dayKey} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                                    <span className="font-bold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">{WEEK_DAYS_LABELS[dayKey] || dayKey}</span>
                                    {hours.open ? <span className="font-bold text-gray-900 dark:text-white">{hours.start} - {hours.end}</span> : <span className="font-bold text-red-400">Fechado</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex flex-wrap gap-2">
                          {['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito'].map((method, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{method}</span>
                              </div>
                          ))}
                      </div>
                  </div>
                )}
            </div>
        </div>
      </main>

      {/* MODAL PROMOÇÃO */}
      {selectedPromotion && (
          <div className="fixed inset-0 z-[1001] bg-black/80 backdrop-blur-sm flex items-end justify-center p-4" onClick={() => setSelectedPromotion(null)}>
              <div 
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
                onClick={e => e.stopPropagation()}
              >
                  <div className="relative w-full aspect-square bg-gray-100 shrink-0">
                      <img src={selectedPromotion.images[0]} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setSelectedPromotion(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full"><X size={20}/></button>
                  </div>
                  <div className="p-8 overflow-y-auto no-scrollbar">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">{selectedPromotion.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8">{selectedPromotion.description}</p>
                      <button onClick={() => { setSelectedPromotion(null); window.open(`https://wa.me/55${phoneDigits}`, '_blank'); }} className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                          <MessageSquare size={18} fill="white" /> Falar com Lojista
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
