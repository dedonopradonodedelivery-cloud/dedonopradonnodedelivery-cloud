
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
  Coins,
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
  CornerDownRight
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
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

// MOCK DE AVALIAÇÕES ESTRUTURADAS PARA O EXEMPLO
const MOCK_REVIEWS: StoreReview[] = [
  {
    id: 'rev-1',
    user_id: 'u1',
    user_name: 'Anônimo',
    rating: 5,
    comment: 'Comida excelente e entrega rápida! Recomendo a todos.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
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
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
  }
];

export const StoreDetailView: React.FC<{ 
  store: Store; 
  onBack: () => void; 
  onPay?: () => void;
  onClaim?: () => void;
  onViewCashback?: () => void;
}> = ({ store, onBack, onPay, onClaim, onViewCashback }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'hours'>('description');
  const [isClosedReporting, setIsClosedReporting] = useState(false);
  const [closedReported, setClosedReported] = useState(false);

  // States para Avaliação
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  const track = (eventType: OrganicEventType) => {
    if (store) {
      trackOrganicEvent(eventType, store.id, currentNeighborhood, user);
    }
  };

  useEffect(() => {
    track('store_view');
  }, []);

  useEffect(() => {
    const fetchUserCredit = async () => {
        if (!user || !store || !supabase) return;
        try {
            const { data } = await supabase
                .from('store_credits')
                .select('balance_cents')
                .eq('user_id', user.id)
                .eq('store_id', store.id)
                .maybeSingle();
            
            if (data) setUserCredit(data.balance_cents / 100);
            else setUserCredit(0);
        } catch (e) { console.error(e); }
    };
    fetchUserCredit();
  }, [user, store]);

  const handleReportClosed = () => {
    setIsClosedReporting(true);
    setTimeout(() => {
        setIsClosedReporting(false);
        setClosedReported(true);
        console.log("[ADM Alert] Registro de possível loja fechada:", store.name);
    }, 1200);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Por favor, selecione uma nota.");
      return;
    }
    setIsSubmittingReview(true);
    
    // Simulação de envio
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewSuccessMessage('Avaliação enviada (modo teste)');
      setUserRating(0);
      setUserComment('');
      
      setTimeout(() => setReviewSuccessMessage(''), 3000);
    }, 1500);
  };

  const bannerImg = store.banner_url || store.image || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop";
  const logoImg = store.logo_url || store.logoUrl || '/assets/default-logo.png';
  
  const phoneFormatted = store.telefone_fixo_publico || store.phone || '';
  const phoneDigits = phoneFormatted.replace(/\D/g, '');
  const whatsappFormatted = store.whatsapp_publico || store.phone || '';
  const whatsappDigits = whatsappFormatted.replace(/\D/g, '');
  
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

  // Mescla comentários antigos com mocks novos para visualização
  const reviewsToDisplay = useMemo(() => {
    return MOCK_REVIEWS;
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans relative overflow-x-hidden">
      <main className="pb-24">
        
        {/* --- CAPA / BANNER --- */}
        <section className="relative w-full aspect-[12/5] bg-gray-100 dark:bg-gray-800">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-40">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-transform">
              <ChevronLeft className="w-6 h-6 dark:text-white" />
            </button>
            <div className="flex gap-2">
              <button onClick={() => track('store_click_share')} className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Share2 className="w-5 h-5 dark:text-white" />
              </button>
              <button onClick={() => { setIsFavorite(!isFavorite); track('store_click_favorite'); }} className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'dark:text-white'}`} />
              </button>
            </div>
          </div>
          
          <img src={bannerImg} className="w-full h-full object-cover" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </section>

        <div className="px-5 relative">
          
          {/* --- LOGO --- */}
          <div className="flex justify-between items-end -mt-8 mb-6">
              <div className="w-20 h-20 rounded-[24px] bg-white dark:bg-gray-800 p-1 shadow-lg border-4 border-white dark:border-gray-900 overflow-hidden z-30">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-[20px]" />
              </div>
              <div className="pb-1">
                  {store.verified && (
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800 shadow-sm animate-in zoom-in duration-500">
                      <ShieldCheck size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Verificada</span>
                    </div>
                  )}
              </div>
          </div>

          {/* Cabeçalho */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-2">{store.name}</h1>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="uppercase font-bold tracking-widest text-[#1E5BFF]">{store.category}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-gray-200">{store.rating}</span>
                  <span className="text-gray-400 opacity-70">({store.reviewsCount ?? 0})</span>
                </div>
            </div>
          </div>

          {/* --- CASHBACK SALDO --- */}
          <button 
              onClick={onViewCashback}
              className="w-full bg-gray-50 dark:bg-gray-900 rounded-[24px] p-5 mb-8 flex items-center justify-between border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group active:scale-[0.99] transition-all text-left"
          >
              <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-[#1E5BFF] flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform">
                      <Coins className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">Seu cashback nesta loja</p>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none mt-0.5">R$ {(userCredit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full text-gray-300 shadow-inner group-hover:text-[#1E5BFF] transition-colors">
                <ArrowRight className="w-3 h-3" />
              </div>
          </button>

          {/* --- WHATSAPP CTA --- */}
          <section className="mb-10">
              <a 
                href={`https://wa.me/55${whatsappDigits}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => track('store_click_whatsapp')} 
                className="w-full bg-[#00D95F] hover:bg-[#00C254] text-white font-black py-6 rounded-[24px] flex items-center justify-center gap-3 shadow-md shadow-green-500/10 active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                Falar no WhatsApp
              </a>
          </section>

          {/* --- NAVEGAÇÃO DE ABAS --- */}
          <section className="mb-10">
              <div className="flex items-center gap-6 mb-8 px-1 border-b border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'description' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                  >
                    Sobre a loja
                    {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-t-full"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                  >
                    Avaliações
                    {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-t-full"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('hours')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'hours' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
                  >
                    Horário
                    {activeTab === 'hours' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-t-full"></div>}
                  </button>
              </div>

              {/* CONTEÚDO: SOBRE A LOJA */}
              {activeTab === 'description' && (
                <div className="animate-in fade-in duration-500 space-y-12">
                    {/* Descrição */}
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                          {store.description || 'O lojista ainda não preencheu a descrição desta unidade.'}
                        </p>
                    </div>

                    {/* Onde encontrar */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Onde encontrar</h3>
                        
                        <div className="space-y-8">
                            <div className="flex items-center justify-between group">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Telefone Comercial</p>
                                        <p className="text-lg font-black text-gray-800 dark:text-gray-200 tracking-tight leading-none">
                                            {phoneFormatted || 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                                {phoneDigits && (
                                    <a 
                                      href={`tel:${phoneDigits}`} 
                                      className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] active:scale-90 transition-transform shadow-sm border border-blue-100/50"
                                    >
                                        <Phone size={16} />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Endereço Unidade</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{addressFormatted}</p>
                                        {!hasAddress && <p className="text-[9px] text-amber-500 font-bold uppercase mt-1">Localização não disponível</p>}
                                    </div>
                                </div>

                                <div className="w-full h-36 rounded-[24px] bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 overflow-hidden relative shadow-sm group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                                        className="w-full h-full object-cover opacity-60 grayscale transition-all group-hover:grayscale-0"
                                        alt="Mapa"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 pointer-events-none">
                                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
                                            <MapIcon className="w-3.5 h-3.5 text-[#1E5BFF]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Mapa Ilustrativo</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <a href={wazeRouteUrl} target="_blank" rel="noopener" onClick={(e) => !hasAddress && e.preventDefault()} className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border shadow-lg transition-all active:scale-95 ${hasAddress ? 'bg-white/90 border-white/20 text-gray-700 hover:bg-white' : 'bg-gray-200/50 border-transparent text-gray-400 cursor-not-allowed'}`}><Navigation className={`w-3.5 h-3.5 ${hasAddress ? 'text-blue-400' : 'text-gray-400'}`} /><span className="text-[10px] font-black uppercase tracking-widest">Waze</span></a>
                                        <a href={gmapsRouteUrl} target="_blank" rel="noopener" onClick={(e) => !hasAddress && e.preventDefault()} className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border shadow-lg transition-all active:scale-95 ${hasAddress ? 'bg-white/90 border-white/20 text-gray-700 hover:bg-white' : 'bg-gray-200/50 border-transparent text-gray-400 cursor-not-allowed'}`}><Navigation2 className={`w-3.5 h-3.5 ${hasAddress ? 'text-red-400' : 'text-gray-400'}`} /><span className="text-[10px] font-black uppercase tracking-widest">Maps</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagamento */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 ml-1">
                            <CreditCard size={14} className="text-gray-400" />
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formas de pagamento</h3>
                        </div>
                        <div className="bg-gray-50/50 dark:bg-gray-900/30 p-5 rounded-[24px] border border-gray-100 dark:border-gray-800">
                            <div className="flex flex-wrap gap-2">
                                {store.payment_methods && store.payment_methods.length > 0 ? (
                                    store.payment_methods.map(method => (
                                        <span key={method} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 text-[9px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-tight shadow-sm">{method}</span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-gray-400 italic">Consulte as formas disponíveis no local.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* CONTEÚDO: AVALIAÇÕES */}
              {activeTab === 'reviews' && (
                <div className="animate-in fade-in duration-500 space-y-10">
                    {/* Lista de Avaliações */}
                    <div className="space-y-8">
                        {reviewsToDisplay.length > 0 ? (
                            reviewsToDisplay.map((rev) => (
                                <div key={rev.id} className="space-y-3">
                                  <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-[24px] border border-gray-100 dark:border-gray-800">
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
                                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-4 tracking-widest">
                                        {new Date(rev.created_at).toLocaleDateString()}
                                      </p>
                                  </div>
                                  
                                  {/* Resposta do Lojista */}
                                  {rev.merchant_response && (
                                    <div className="ml-6 flex gap-3 animate-in slide-in-from-left-2 duration-500">
                                      <div className="pt-2 text-gray-300">
                                        <CornerDownRight size={18} />
                                      </div>
                                      <div className="flex-1 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-[20px] border border-blue-100 dark:border-blue-900/30">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <div className="w-5 h-5 rounded-full bg-[#1E5BFF] flex items-center justify-center text-white shrink-0">
                                            <Building2 size={10} />
                                          </div>
                                          <span className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-wider">Resposta do estabelecimento</span>
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                          {rev.merchant_response.text}
                                        </p>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase mt-3 text-right">
                                          {new Date(rev.merchant_response.responded_at).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[24px] border border-dashed border-gray-200 dark:border-gray-800">
                                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Ainda não há avaliações.</p>
                            </div>
                        )}
                    </div>

                    {/* Formulário de Avaliar */}
                    <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#1E5BFF]" /> Avaliar estabelecimento
                        </h3>
                        
                        <form onSubmit={handleSubmitReview} className="space-y-5">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Sua nota</p>
                                <div className="flex gap-2">
                                    {[1,2,3,4,5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setUserRating(star)}
                                            className="p-1 transition-transform active:scale-90"
                                        >
                                            <Star 
                                                size={32} 
                                                className={`transition-all ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Comentário (opcional)</label>
                                <textarea 
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="Conte como foi sua experiência..."
                                    className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-[#1E5BFF] text-sm dark:text-white transition-all resize-none"
                                />
                            </div>

                            {reviewSuccessMessage && (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-100 dark:border-emerald-800 animate-in zoom-in duration-300">
                                    {reviewSuccessMessage}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={isSubmittingReview}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Enviar avaliação
                            </button>
                        </form>
                    </div>
                </div>
              )}

              {/* CONTEÚDO: HORÁRIO */}
              {activeTab === 'hours' && (
                <div className="animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-gray-900 rounded-[28px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#1E5BFF]" /> Horários de funcionamento
                            </h3>
                            {store.isOpenNow !== undefined && (
                                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${store.isOpenNow ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    {store.isOpenNow ? 'Aberto agora' : 'Fechado'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {store.business_hours ? (
                                Object.entries(store.business_hours).map(([key, value]) => {
                                    const h = value as BusinessHour;
                                    return (
                                        <div key={key} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <span className="font-medium text-gray-600 dark:text-gray-400">{WEEK_DAYS_LABELS[key] || key}</span>
                                            <span className={`font-bold ${h.open ? 'text-gray-900 dark:text-white' : 'text-rose-400 uppercase text-[10px]'}`}>
                                                {h.open ? `${h.start}–${h.end}` : 'Fechado'}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Horário não informado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              )}
          </section>

          {/* --- BOTÕES FINAIS --- */}
          <section className="space-y-3 mt-4">
              {!store.claimed && (
                <button 
                  onClick={onClaim}
                  className="w-full py-4 border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 rounded-[20px] flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                >
                  <Building2 size={16} />
                  É o dono? Reivindicar loja
                </button>
              )}

              {closedReported ? (
                  <div className="w-full py-4 text-center text-amber-600 bg-amber-50 dark:bg-amber-900/10 rounded-[20px] border border-amber-100 dark:border-amber-800 animate-in zoom-in duration-300">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Obrigado! Em análise técnica.</p>
                  </div>
              ) : (
                  <button 
                    onClick={handleReportClosed}
                    disabled={isClosedReporting}
                    className="w-full py-4 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors"
                  >
                    {isClosedReporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    Informar que esta loja fechou
                  </button>
              )}
          </section>

        </div>
      </main>
    </div>
  );
};
