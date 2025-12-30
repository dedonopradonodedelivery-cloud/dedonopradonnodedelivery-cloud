
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  BadgeCheck, 
  Megaphone, 
  ChevronRight,
  Settings,
  HelpCircle,
  CreditCard,
  Bell,
  QrCode,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  Play,
  Video,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Rocket,
  Info,
  Send,
  MessageSquare,
  Clock,
  PlayCircle,
  Users,
  Handshake,
  Lock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
}

const STORE_DATA = {
  name: "Minha Loja",
  logo: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop",
};

const INSTITUTIONAL_ADS_VIDEO = "https://videos.pexels.com/video-files/4434242/4434242-sd_540_960_25fps.mp4";
const CASHBACK_TUTORIAL_VIDEO = "https://videos.pexels.com/video-files/4434246/4434246-sd_540_960_25fps.mp4";
const CONNECT_TUTORIAL_VIDEO = "https://videos.pexels.com/video-files/3201416/3201416-sd_540_960_25fps.mp4";

const SupportQuestion: React.FC<{ 
  context: 'cashback' | 'ads' | 'connect';
  onSend: (text: string) => Promise<void>;
}> = ({ context, onSend }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<{question: string, answer?: string, status: 'sent' | 'answered'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.length > 500) return;
    
    setIsSending(true);
    await onSend(text);
    setHistory({ question: text, status: 'sent' });
    setText('');
    setIsSending(false);
  };

  const placeholders = {
    cashback: "Ficou alguma dúvida sobre o cashback? Escreva aqui.",
    ads: "Dúvida sobre anúncios? Escreva aqui.",
    connect: "Ficou alguma dúvida sobre o Freguesia Connect? Escreva aqui."
  };

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-700/50 pt-4 animate-in fade-in duration-500">
      {!history ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholders[context]}
              maxLength={500}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-medium dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none h-16"
            />
          </div>
          <button 
            type="submit"
            disabled={isSending || !text.trim()}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Enviar dúvida
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{history.question}</p>
          </div>
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Aguardando resposta da equipe</span>
          </div>
          <button onClick={() => setHistory(null)} className="text-[9px] font-bold text-blue-500 px-1">Fazer outra pergunta</button>
        </div>
      )}
    </div>
  );
};

const MenuLink: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  onClick?: () => void;
  badge?: number;
}> = ({ icon: Icon, label, onClick, badge }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-800 p-5 border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-400 group-hover:text-[#2D6DF6] transition-colors relative">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
    </div>
    <div className="flex items-center gap-2">
        {badge ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        ) : null}
        <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  </button>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const [isCashbackEnabled, setIsCashbackEnabled] = useState(false);
  const [isConnectActive, setIsConnectActive] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasCampaigns, setHasCampaigns] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{url: string, title: string} | null>(null);
  
  // Gate Control
  const [isCashbackVideoFinished, setIsCashbackVideoFinished] = useState(false);
  
  // Onboarding Control
  const [cashbackFirstSeen] = useState<string | null>(localStorage.getItem('cashback_onboarding_start'));
  const [connectFirstSeen] = useState<string | null>(localStorage.getItem('connect_onboarding_start'));

  useEffect(() => {
    if (!cashbackFirstSeen) {
      localStorage.setItem('cashback_onboarding_start', new Date().toISOString());
    }
    if (!connectFirstSeen) {
      localStorage.setItem('connect_onboarding_start', new Date().toISOString());
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const isWithin7Days = (dateStr: string | null) => {
    if (!dateStr) return true;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (new Date().getTime() - new Date(dateStr).getTime()) < sevenDaysInMs;
  };

  const shouldShowCashbackVideo = !isCashbackEnabled && isWithin7Days(cashbackFirstSeen);
  const shouldShowConnectVideo = !isConnectActive && isWithin7Days(connectFirstSeen);

  useEffect(() => {
    if (!supabase || !user) return;
    const merchantId = user.id;
    const fetchCount = async () => {
        const { count } = await supabase
            .from('cashback_transactions')
            .select('*', { count: 'exact', head: true })
            .eq('merchant_id', merchantId)
            .eq('status', 'pending');
        setPendingRequestsCount(count || 0);
    };
    fetchCount();
    return () => {};
  }, [user]);

  const handleSendQuestion = async (text: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1E5BFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 font-sans animate-in fade-in duration-300 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm shrink-0 w-full">
        <div className="flex items-center gap-3 mb-1">
          <button 
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Painel do Parceiro</span>
        </div>

        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-gray-100 dark:border-gray-600 shadow-sm">
                <img src={STORE_DATA.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-1.5">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display leading-tight">
                        {user?.user_metadata?.full_name || "Minha Loja"}
                    </h1>
                    {user && <BadgeCheck className="w-5 h-5 text-white fill-[#1E5BFF]" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`relative flex h-2 w-2 rounded-full ${user ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {user ? 'Operação Ativa' : 'Aguardando Aprovação'}
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full bg-gray-50 dark:bg-gray-950">
        
        {/* 1. CASHBACK DA LOJA */}
        <section className="w-full bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Cashback da Loja</h3>
                      <p className="text-xs text-gray-500">Fidelize seus clientes do bairro</p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        if (!isCashbackVideoFinished && !isCashbackEnabled) {
                            setActiveVideo({url: CASHBACK_TUTORIAL_VIDEO, title: "Como funciona o Cashback Localizei"});
                        } else {
                            setIsCashbackEnabled(!isCashbackEnabled);
                        }
                    }}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isCashbackEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isCashbackEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>

            {shouldShowCashbackVideo ? (
              <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div 
                    onClick={() => setActiveVideo({url: CASHBACK_TUTORIAL_VIDEO, title: "Como funciona o Cashback Localizei"})}
                    className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 relative group shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer mb-4"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform active:scale-95 mb-3">
                            <Play className="w-8 h-8 text-[#1E5BFF] fill-[#1E5BFF] ml-1" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            Tutorial: Entenda em 1 min
                        </span>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-5 mb-4 border border-blue-100 dark:border-blue-800/30">
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                        Lojas com cashback ativo recebem até <strong>40% mais visitas</strong> no app.
                    </p>
                </div>

                <SupportQuestion context="cashback" onSend={handleSendQuestion} />
                
                <div className="mt-6">
                    {!isCashbackVideoFinished ? (
                        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30 mb-4 animate-in slide-in-from-bottom-2 duration-500">
                            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-tight">
                                Para habilitar o cashback, assista ao vídeo explicativo até o final.
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-2 mb-4 animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">Vídeo concluído. Recurso liberado!</span>
                        </div>
                    )}

                    <button 
                        disabled={!isCashbackVideoFinished}
                        onClick={() => setIsCashbackEnabled(true)}
                        className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                            isCashbackVideoFinished 
                            ? 'bg-[#1E5BFF] text-white shadow-blue-500/20' 
                            : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 shadow-none grayscale'
                        }`}
                    >
                        {isCashbackVideoFinished ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                        Habilitar cashback agora
                    </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxa atual</p>
                        <p className="font-black text-gray-900 dark:text-white text-xl">5%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Retorno total</p>
                        <p className="font-black text-green-600 text-xl">R$ 0,00</p>
                    </div>
                </div>
                <div className="flex gap-2">
                  <button 
                      onClick={() => onNavigate && onNavigate('store_cashback_module')}
                      className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                      Configurar regras
                  </button>
                  <button 
                      onClick={() => setActiveVideo({url: CASHBACK_TUTORIAL_VIDEO, title: "Como funciona o Cashback Localizei"})}
                      className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                  >
                      <PlayCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
        </section>

        {/* 2. TERMINAL DE CAIXA */}
        {isCashbackEnabled && (
          <section className="w-full border-b border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-700">
            <button
                onClick={() => onNavigate && onNavigate('merchant_panel')}
                className="w-full bg-gradient-to-r from-[#1E5BFF] to-[#1749CC] text-white p-6 flex items-center justify-between active:brightness-95 transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                        <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg leading-none mb-1">Terminal de Caixa</h3>
                        <p className="text-xs text-blue-100">Validar compras e gerar QR do cliente</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                  {pendingRequestsCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                      {pendingRequestsCount} PENDENTES
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </div>
            </button>
          </section>
        )}

        {/* 3. ANÚNCIOS PATROCINADOS E DESTAQUES */}
        <section className="w-full bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                    <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Anúncios Patrocinados</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Aumente sua visibilidade na Freguesia</p>
                </div>
            </div>

            <div className="mb-6 group">
                <div 
                    onClick={() => setActiveVideo({url: INSTITUTIONAL_ADS_VIDEO, title: "Como funcionam os Anúncios Patrocinados"})}
                    className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 relative group shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform active:scale-95">
                                <Play className="w-6 h-6 text-[#1E5BFF] fill-[#1E5BFF] ml-1" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                Como funciona
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-5 mb-4 border border-purple-100 dark:border-purple-800/30 mt-4">
                    <p className="text-xs text-purple-700 dark:text-purple-400 leading-relaxed font-medium">
                      Apareça no topo das buscas e destaque sua loja para novos clientes.
                    </p>
                </div>

                <SupportQuestion context="ads" onSend={handleSendQuestion} />

                <button 
                    onClick={() => onNavigate && onNavigate('store_ads_module')}
                    className="w-full bg-[#1E5BFF] text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                >
                    <Rocket className="w-4 h-4" />
                    Impulsionar minha loja
                </button>
            </div>
        </section>

        {/* 4. FREGUESIA CONNECT */}
        <section className="w-full bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight">Freguesia Connect</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Networking e Parcerias B2B</p>
                </div>
            </div>

            {shouldShowConnectVideo ? (
              <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div 
                    onClick={() => setActiveVideo({url: CONNECT_TUTORIAL_VIDEO, title: "O que é o Freguesia Connect?"})}
                    className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 relative group shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer mb-4"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform active:scale-95 mb-3">
                            <Play className="w-8 h-8 text-indigo-600 fill-indigo-600 ml-1" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            Entenda em 1 min
                        </span>
                    </div>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-5 mb-4 border border-indigo-100 dark:border-indigo-800/30">
                    <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                        Participe do grupo oficial de lojistas, troque experiências e feche parcerias locais.
                    </p>
                </div>

                <SupportQuestion context="connect" onSend={handleSendQuestion} />

                <button 
                    onClick={() => { setIsConnectActive(true); onNavigate && onNavigate('freguesia_connect_dashboard'); }}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                >
                    <Users className="w-5 h-5" />
                    Solicitar minha vaga no grupo
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                      <p className="font-black text-indigo-600 text-sm uppercase">Membro Ativo</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex gap-2">
                  <button 
                      onClick={() => onNavigate && onNavigate('freguesia_connect_dashboard')}
                      className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                      Acessar Rede
                  </button>
                  <button 
                      onClick={() => setActiveVideo({url: CONNECT_TUTORIAL_VIDEO, title: "O que é o Freguesia Connect?"})}
                      className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                  >
                      <PlayCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
        </section>

        {/* 5. ADMINISTRATIVO */}
        <section className="w-full mt-6">
            <div className="px-5 mb-3">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                  Administrativo
              </h3>
            </div>
            <div className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-800">
                <MenuLink 
                    icon={Settings} 
                    label="Perfil Público da Loja" 
                    onClick={() => onNavigate && onNavigate('store_profile')}
                />
                <MenuLink 
                    icon={CreditCard} 
                    label="Dados da Conta e Financeiro" 
                    onClick={() => onNavigate && onNavigate('store_finance')}
                />
                <MenuLink 
                    icon={HelpCircle} 
                    label="Suporte ao Parceiro" 
                    onClick={() => onNavigate && onNavigate('store_support')}
                />
            </div>
        </section>

        <div className="py-12 flex flex-col items-center justify-center opacity-30 mt-auto">
          <LayoutDashboard className="w-4 h-4 mb-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Localizei Business v1.3</p>
        </div>
      </div>

      {/* Fullscreen Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-[#1E5BFF]" />
                    <h3 className="text-white font-bold text-sm">{activeVideo.title}</h3>
                </div>
                <button 
                    onClick={() => setActiveVideo(null)}
                    className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <video 
                    src={activeVideo.url} 
                    className="w-full max-h-screen" 
                    controls 
                    autoPlay
                    onTimeUpdate={(e) => {
                        const video = e.currentTarget;
                        if (video.duration > 0 && (video.currentTime / video.duration) >= 0.95) {
                            if (activeVideo.url === CASHBACK_TUTORIAL_VIDEO) {
                                setIsCashbackVideoFinished(true);
                            }
                        }
                    }}
                />
            </div>
            <div className="p-6 pb-12 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 flex items-center justify-center">
                <p className="text-white/60 text-[10px] text-center font-bold uppercase tracking-widest max-w-[240px]">
                    Localizei Business • Treinamento do Parceiro
                </p>
            </div>
        </div>
      )}
    </div>
  );
};
