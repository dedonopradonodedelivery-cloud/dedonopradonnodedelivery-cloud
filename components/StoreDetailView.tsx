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
  Image as ImageIcon,
  Building2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Quote,
  ThumbsUp,
  ChevronDown,
  // Added missing Loader2 component import
  Loader2
} from 'lucide-react';
import { Store } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { trackOrganicEvent, OrganicEventType } from '../lib/analytics';

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop";

export const StoreDetailView: React.FC<{ 
  store: Store; 
  onBack: () => void; 
  onPay?: () => void;
  onClaim?: () => void;
}> = ({ store, onBack, onPay, onClaim }) => {
  const { user } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isClosedReporting, setIsClosedReporting] = useState(false);
  const [closedReported, setClosedReported] = useState(false);

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
    // Simulação de registro de clique
    setTimeout(() => {
        setIsClosedReporting(false);
        setClosedReported(true);
        // Em produção aqui enviaria para o banco para contar os 3 cliques
        alert("Obrigado por informar. Nossa equipe irá verificar a situação desta loja.");
    }, 1000);
  };

  // Mapeamento dinâmico preferindo campos estruturados do lojista
  const bannerImg = store.banner_url || store.image || DEFAULT_BANNER;
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

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFormatted)}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans relative overflow-x-hidden">
      <main className="pb-32">
        
        {/* --- 2. CAPA / BANNER DA LOJA --- */}
        <section className="relative w-full aspect-[12/5] bg-gray-100 dark:bg-gray-800">
          <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center z-40">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-transform"><ChevronLeft className="w-6 h-6 dark:text-white" /></button>
            <div className="flex gap-2">
              <button onClick={() => track('store_click_share')} className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Share2 className="w-5 h-5 dark:text-white" /></button>
              <button onClick={() => { setIsFavorite(!isFavorite); track('store_click_favorite'); }} className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'dark:text-white'}`} /></button>
            </div>
          </div>
          
          <img src={bannerImg} className="w-full h-full object-cover" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </section>

        <div className="px-5 relative">
          
          {/* --- 3. LOGO SOBREPOSTA --- */}
          <div className="flex justify-between items-end -mt-10 mb-6">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 shadow-2xl border-4 border-white dark:border-gray-900 overflow-hidden z-30">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="pb-2">
                  {store.verified && (
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] px-3 py-1.5 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm animate-in zoom-in duration-500">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Loja Verificada</span>
                    </div>
                  )}
              </div>
          </div>

          {/* Info Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{store.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className="uppercase font-bold tracking-widest text-[#1E5BFF]">{store.category}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-gray-200">{store.rating}</span>
                  <span className="text-gray-400">({store.reviewsCount ?? 0})</span>
                </div>
            </div>
          </div>

          {/* --- 4. SALDO NA LOJA --- */}
          {user && userCredit !== null && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-6 mb-10 flex items-center justify-between border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-[#1E5BFF] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                          <Coins className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Seu cashback nesta loja</p>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white">R$ {userCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
              </div>
          )}

          {/* --- 9. WHATSAPP EM DESTAQUE --- */}
          <section className="mb-10">
              <a 
                href={`https://wa.me/55${whatsappDigits}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => track('store_click_whatsapp')} 
                className="w-full bg-[#00D95F] hover:bg-[#00C254] text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                <MessageSquare className="w-6 h-6 fill-white" />
                Falar no WhatsApp
              </a>
          </section>

          {/* --- 7. SEÇÃO SOBRE O LOCAL (COM ABAS) --- */}
          <section className="mb-12">
              <div className="flex items-center gap-6 mb-6 px-1 border-b border-gray-100 dark:border-gray-800">
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
              </div>

              {activeTab === 'description' ? (
                <div className="animate-in fade-in duration-500">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{store.description || 'Nenhuma descrição detalhada informada.'}</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500 space-y-4">
                    {store.recentComments && store.recentComments.length > 0 ? (
                        store.recentComments.map((comment, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                                    <Quote size={12} className="text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{comment}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Sem avaliações recentes</p>
                        </div>
                    )}
                </div>
              )}
          </section>

          {/* Onde encontrar (Reorganizado) */}
          <section className="space-y-8 mb-12">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Onde encontrar</h3>
            
            <div className="space-y-6">
                {/* Endereço Texto Simples */}
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Endereço</p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{addressFormatted}</p>
                        <a href={gmapsUrl} target="_blank" rel="noopener" className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest mt-2 inline-block">Abrir no Mapa</a>
                    </div>
                </div>

                {/* Telefone Texto + Botão */}
                <div className="flex items-center justify-between group">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Telefone</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{phoneFormatted || 'Não informado'}</p>
                        </div>
                    </div>
                    {phoneDigits && (
                        <a 
                          href={`tel:${phoneDigits}`} 
                          className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF] active:scale-90 transition-transform"
                        >
                            <Phone size={18} />
                        </a>
                    )}
                </div>

                {/* Instagram se houver */}
                {store.instagram && (
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 shrink-0">
                                <Instagram size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Instagram</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">@{store.instagram.replace('@', '')}</p>
                            </div>
                        </div>
                        <a 
                          href={`https://instagram.com/${store.instagram.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener" 
                          className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 active:scale-90 transition-transform"
                        >
                            <ArrowRight size={18} />
                        </a>
                    </div>
                )}
            </div>
          </section>

          {/* --- 8. FORMAS DE PAGAMENTO ACEITAS --- */}
          <section className="mb-12">
              <div className="flex items-center gap-2 mb-6 ml-1">
                  <CreditCard size={14} className="text-gray-400" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formas de pagamento aceitas</h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2 mb-4">
                      {store.payment_methods && store.payment_methods.length > 0 ? (
                          store.payment_methods.map(method => (
                              <span key={method} className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700 text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{method}</span>
                          ))
                      ) : (
                          <span className="text-xs text-gray-500 italic">Consulte o estabelecimento.</span>
                      )}
                  </div>
                  {store.payment_methods_others && (
                      <p className="text-[10px] text-gray-400 font-medium ml-1">Obs: {store.payment_methods_others}</p>
                  )}
              </div>
          </section>

          {/* --- 5. CARD CONFIANÇA NO BAIRRO (MOVIDO PARA O FINAL) --- */}
          <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-6 animate-in fade-in duration-500">
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">Confiança no bairro</h3>
                <p className="text-[11px] text-gray-400 mt-1 font-medium leading-relaxed">Indicadores de qualidade baseados na experiência real dos moradores.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/50">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-tight">Muito bem avaliado</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50">
                    <ShieldCheck className="w-5 h-5 text-[#1E5BFF]" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-tight">Registro oficial ativo</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50">
                    <ThumbsUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">Indicação de vizinhos</span>
                  </div>
              </div>
          </section>

          {/* --- 6. BOTÃO INFORMAR QUE FECHOU --- */}
          <section className="mb-10 px-1">
              {closedReported ? (
                  <div className="w-full py-4 text-center text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 animate-in zoom-in duration-300">
                      <p className="text-xs font-bold uppercase tracking-widest">Informação recebida!</p>
                  </div>
              ) : (
                  <button 
                    onClick={handleReportClosed}
                    disabled={isClosedReporting}
                    className="w-full py-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors border-t border-gray-50 dark:border-gray-900 mt-6"
                  >
                    {/* Fixed "Cannot find name 'Loader2'" error by adding it to imports and use here */}
                    {isClosedReporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    Informar que esta loja fechou
                  </button>
              )}
          </section>

        </div>
      </main>
      
      {/* Botão flutuante de Reivindicação (Se não tiver dono) */}
      {!store.claimed && (
        <div className="fixed bottom-[100px] left-0 right-0 px-5 z-40">
            <button 
              onClick={onClaim}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl border border-white/10 dark:border-gray-200 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
            >
              <Building2 size={16} />
              É o dono? Reivindicar loja
            </button>
        </div>
      )}
    </div>
  );
};