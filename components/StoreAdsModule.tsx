import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  ArrowRight, 
  Check, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Rocket,
  Loader2,
  Target,
  Crown,
  Calendar,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  QrCode,
  Info,
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare,
  Paintbrush,
  Image as ImageIcon,
  Upload,
  X,
  Plus,
  Send,
  User as UserIcon,
  MessageSquare,
  FileText,
  BadgeCheck,
  Building,
  Terminal,
  Layers,
  Sparkles,
  ClipboardList,
  FileArchive,
  CornerDownRight,
  ShieldAlert,
  TrendingUp,
  Award,
  FileSignature
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

type ViewState = 'sales' | 'creator' | 'editor' | 'pro_checkout' | 'pro_processing' | 'pro_approved' | 'pro_chat' | 'designer_panel' | 'designer_order_detail' | 'chat_onboarding' | 'pro_high_demand_warning';


const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const MOCK_OCCUPANCY: Record<string, Record<string, boolean>> = {
  "Freguesia": { "periodo_1": true },
  "Taquara": { "periodo_2": true },
};

const DISPLAY_MODES = [
  { 
    id: 'home', 
    label: 'Banner na Home', 
    icon: Home, 
    price: 49.90,
    originalPrice: 199.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
    whyChoose: 'Ideal para máxima visibilidade imediata.'
  },
  { 
    id: 'cat', 
    label: 'Banner em Categorias', 
    icon: LayoutGrid, 
    price: 29.90,
    originalPrice: 149.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
    whyChoose: 'Impacta o cliente no momento da decisão.'
  },
  { 
    id: 'combo', 
    label: 'Combo Home + Categorias', 
    icon: Zap, 
    price: 69.90,
    originalPrice: 349.80,
    description: 'Destaque na página inicial e em todas as categorias.',
    whyChoose: 'Mais alcance, cliques e chances de venda.'
  },
];

const ART_PRO_PRICE = 69.90;

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const isDesigner = viewMode === 'Designer';
  
  const [view, setView] = useState<ViewState>('sales');
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(['periodo_1']); // Default 30 days for this flow
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(NEIGHBORHOODS); // Default all hoods for this flow
  
  // "artChoice" is now implicitly 'pro' for this specific flow requested
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'info' | 'error' | 'designer'} | null>(null);
  
  const [dailySalesCount, setDailySalesCount] = useState(7);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [proChatStep, setProChatStep] = useState(0);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);

  const [briefingData, setBriefingData] = useState({
    companyName: user?.user_metadata?.store_name || '',
    headline: '',
    description: '',
    observations: ''
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Refs for scrolling
  const professionalRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const calculatedDeadlineDays = useMemo(() => {
    if (dailySalesCount <= 5) return 3; // 72h
    return 3 + Math.floor((dailySalesCount - 1) / 5);
  }, [dailySalesCount]);

  useEffect(() => {
    if (isDesigner) {
      setView('designer_panel');
    } else if (initialView === 'chat') {
      const hasActiveOrder = true; 
      if (hasActiveOrder) {
        setView('pro_chat');
      } else {
        setView('chat_onboarding');
      }
    }
  }, [isDesigner, initialView]);

  const dynamicPeriods = useMemo(() => {
    const now = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const end1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return [
      { id: 'periodo_1', label: '1 Mês (30 dias)', sub: 'Visibilidade mensal', dates: `${formatDate(now)} → ${formatDate(end1)}`, badge: 'Padrão', days: 30, multiplier: 1 },
    ];
  }, []);

  // Chat Initialization Logic
  useEffect(() => {
    if (view === 'pro_chat' && proChatStep === 0) {
      setProChatStep(1);
      
      const welcomeMessage = {
          id: Date.now(),
          role: 'system',
          text: `Olá! 👋\n\nEnvie logo, texto, cores e referências para criarmos seu banner.`,
          timestamp: 'Agora'
      };

      setChatMessages([welcomeMessage]);
      setProChatStep(2);
    }
  }, [view, proChatStep]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const showToast = (msg: string, type: 'info' | 'error' | 'designer' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleModeSelection = (mode: typeof DISPLAY_MODES[0]) => {
    setSelectedMode(mode);
    // Smooth scroll to Option 2
    setTimeout(() => {
        if (professionalRef.current) {
            // Scroll with offset for header
            const yOffset = -100; 
            const element = professionalRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, 100);
  };

  const handlePayPro = () => {
    // Register Order Logic (Mock)
    const orderData = {
        tipo_servico: 'banner',
        local_exibicao: selectedMode?.id,
        time_profissional: true,
        status_pedido: 'pendente', // Will change to 'pago' after simulation
        abrir_chat_apos_compra: true
    };
    console.log("Registrando pedido:", orderData);

    setView('pro_processing');
    setDailySalesCount(prev => prev + 1); // Simula a venda
    
    // Simulate Payment Success -> Production -> Publish
    setTimeout(() => {
      setIsSuccess(true);
      setView('pro_approved');
    }, 2000);
  };

  const totalPrice = useMemo(() => {
    if (!selectedMode) return 0;
    return selectedMode.price + ART_PRO_PRICE;
  }, [selectedMode]);

  const handleFooterClick = () => {
    if (!selectedMode) {
        showToast("Escolha onde aparecer primeiro.", "error");
        return;
    }
    setView('pro_checkout');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const confirmLogoSend = () => {
    if (!logoPreview) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      type: 'file',
      text: 'Logo_Empresa.png',
      preview: logoPreview,
      timestamp: 'Agora'
    }]);
    setIsLogoModalOpen(false);
    setLogoPreview(null);
  };

  const saveBriefing = () => {
    if (!briefingData.companyName || !briefingData.headline) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      type: 'attachment',
      text: '📋 Informações do banner enviadas.',
      details: {
        name: briefingData.companyName,
        promo: briefingData.headline,
        desc: briefingData.description,
        obs: briefingData.observations
      },
      timestamp: 'Agora'
    }]);
    setIsBriefingModalOpen(false);
  };

  const handleHeaderBack = () => {
    if (view === 'pro_checkout') setView('sales');
    else if (view === 'pro_chat') setView('sales'); // Or home
    else onBack();
  }

  const getPageTitle = () => {
    switch (view) {
      case 'pro_checkout': return 'Checkout';
      case 'pro_chat': return 'Chat do Pedido';
      default: return 'Anunciar no Bairro';
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-blue-500/30">
      
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-blue-600 border-blue-500'} text-white`}>
           {toast.type === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
           <p className="text-xs font-black uppercase tracking-tight">{toast.msg}</p>
        </div>
      )}

      {/* CABEÇALHO FIXO PERSISTENTE */}
      {view !== 'pro_approved' && view !== 'pro_processing' && (
        <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4 shrink-0">
          <button onClick={handleHeaderBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">{getPageTitle()} <Crown size={16} className="text-amber-400 fill-amber-400" /></h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar ${view === 'sales' ? 'pb-32' : ''}`}>
        
        {/* VIEW: CHECKOUT */}
        {view === 'pro_checkout' && selectedMode && (
          <div className="p-6 flex flex-col justify-center items-center text-center animate-in fade-in max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-blue-500/20">
                  <CreditCard size={32} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-8">Resumo do Pedido</h2>
              
              <div className="w-full bg-slate-900 rounded-3xl border border-white/10 overflow-hidden mb-6">
                 <div className="p-6 border-b border-white/5 space-y-4 text-left">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-white">{selectedMode.label}</p>
                            <p className="text-xs text-slate-400">Posicionamento</p>
                        </div>
                        <p className="text-sm font-bold text-white">R$ {selectedMode.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-white">Time Profissional</p>
                            <p className="text-xs text-slate-400">Criação de Arte</p>
                        </div>
                        <p className="text-sm font-bold text-white">R$ {ART_PRO_PRICE.toFixed(2)}</p>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-800/50 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-300">Total Final</span>
                    <span className="text-2xl font-black text-[#1E5BFF]">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>

              <div className="w-full text-left bg-blue-900/20 p-4 rounded-2xl border border-blue-500/30 mb-8 flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200 leading-relaxed">
                      Ao confirmar, você receberá acesso imediato ao chat com nosso designer para enviar os dados do seu banner.
                  </p>
              </div>

              <button onClick={handlePayPro} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all">
                  Finalizar Compra
              </button>
          </div>
        )}

        {/* VIEW: PROCESSING */}
        {view === 'pro_processing' && (
          <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 min-h-screen">
              <Loader2 className="w-12 h-12 text-[#1E5BFF] animate-spin mb-6" />
              <h2 className="text-xl font-bold text-white">Processando pagamento...</h2>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Não feche esta tela</p>
          </div>
        )}

        {/* VIEW: APPROVED */}
        {view === 'pro_approved' && (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 min-h-screen">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                  <CheckCircle2 size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white leading-tight mb-4">Pagamento Confirmado!</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-[280px] mb-12 font-medium">
                 Seu pedido de banner foi criado com sucesso.
              </p>
              <button onClick={() => { setProChatStep(0); setView('pro_chat'); }} className="w-full max-w-xs bg-white text-slate-950 font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                 Falar com o time profissional <ArrowRight size={20} strokeWidth={3} />
              </button>
          </div>
        )}

        {/* VIEW: SALES (MAIN) */}
        {view === 'sales' && (
          <div className="p-6 space-y-12">
            
            {/* OPTION 1: CHOOSE WHERE TO APPEAR */}
            <section className="space-y-6">
                <div className="text-center mb-4">
                     <span className="text-[10px] font-black bg-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-700">Etapa 1</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center justify-center gap-2">
                   Escolher onde aparecer
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {DISPLAY_MODES.map((mode) => (
                    <button key={mode.id} onClick={() => handleModeSelection(mode)} className={`relative flex items-start text-left p-6 rounded-[2rem] border-2 transition-all duration-300 gap-5 ${selectedMode?.id === mode.id ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                        <div className={`p-4 rounded-2xl shrink-0 ${selectedMode?.id === mode.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}><mode.icon size={28} /></div>
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{mode.label}</p>
                                {selectedMode?.id === mode.id && <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><Check size={14} className="text-white" strokeWidth={3} /></div>}
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-2"><span className="text-xs text-slate-500 line-through">R$ {mode.originalPrice.toFixed(2)}</span><span className="text-sm font-black text-white">por R$ {mode.price.toFixed(2)}</span></div>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{mode.description}</p>
                        </div>
                    </button>
                    ))}
                </div>
            </section>

            {/* OPTION 2: PROFESSIONAL TEAM (SCROLL TARGET) */}
            <section ref={professionalRef} className={`space-y-6 transition-all duration-700 ${!selectedMode ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-0.5 bg-gradient-to-b from-transparent via-slate-700 to-slate-700"></div>
                     <span className="text-[10px] font-black bg-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-700">Etapa 2</span>
                </div>
                
                <h3 className="text-lg font-black uppercase tracking-tight text-white text-center">
                   Contratar Time Profissional
                </h3>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 p-1 rounded-[2.5rem] border border-amber-500/30 shadow-2xl">
                    <div className="bg-slate-900 rounded-[2.3rem] p-6 text-center relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                         
                         <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                             <Rocket size={32} className="text-amber-500" />
                         </div>

                         <h4 className="text-xl font-bold text-white mb-2">Criação Profissional Inclusa</h4>
                         <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Nossa equipe de designers criará um banner exclusivo de alta conversão para sua loja.
                         </p>

                         <ul className="text-left space-y-3 mb-6 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                            <li className="flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Design otimizado para vendas</li>
                            <li className="flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Revisão ilimitada até aprovar</li>
                            <li className="flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Publicação automática no app</li>
                         </ul>

                         <div className="inline-block bg-amber-500 text-slate-900 font-black text-xs px-4 py-2 rounded-lg uppercase tracking-widest">
                            Adicional Obrigatório: R$ {ART_PRO_PRICE.toFixed(2)}
                         </div>
                    </div>
                </div>
            </section>
          </div>
        )}

        {/* VIEW: CHAT */}
        {view === 'pro_chat' && (
          <div className="flex flex-col h-full">
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
                {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-3xl shadow-sm border ${msg.role === 'user' ? 'bg-[#1E5BFF] text-white rounded-tr-none border-blue-50' : 'bg-slate-900 text-slate-100 rounded-tl-none border-white/5'}`}>
                             {msg.type === 'attachment' ? (
                                <div className="space-y-3">
                                   <div className="flex items-center gap-2 mb-2">
                                       <ClipboardList size={16} />
                                       <span className="font-bold text-xs uppercase">Briefing de Criação</span>
                                   </div>
                                   <div className="text-xs space-y-1 opacity-90">
                                       <p><strong>Loja:</strong> {msg.details.name}</p>
                                       <p><strong>Chamada:</strong> {msg.details.promo}</p>
                                       <p><strong>Desc:</strong> {msg.details.desc}</p>
                                       {msg.details.obs && <p><strong>Obs:</strong> {msg.details.obs}</p>}
                                   </div>
                                </div>
                            ) : msg.type === 'file' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <ImageIcon size={20} />
                                        <p className="text-sm font-bold">{msg.text}</p>
                                        <button className="p-1.5 bg-black/10 rounded-lg"><Check size={14}/></button>
                                    </div>
                                    {msg.preview && (
                                      <img src={msg.preview} className="w-full rounded-xl" alt="Preview" />
                                    )}
                                </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            )}
                        </div>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-2">{msg.timestamp}</span>
                    </div>
                ))}
            </div>
             <footer className="p-6 bg-slate-900 border-t border-white/10 shrink-0 sticky bottom-0">
               {proChatStep === 2 && (
                 <div className="flex flex-col gap-2 mb-4">
                    <button onClick={() => setIsLogoModalOpen(true)} className="w-full py-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center justify-center gap-3 text-[#1E5BFF] text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all">
                      <Upload size={16} /> Enviar logo
                    </button>
                    <button onClick={() => setIsBriefingModalOpen(true)} className="w-full py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center gap-3 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all">
                      <FileText size={16} /> Preencher informações
                    </button>
                 </div>
               )}
               <div className="flex items-center gap-3">
                  <input type="text" placeholder="Escreva sua mensagem..." className="flex-1 bg-slate-800 border border-white/5 rounded-2xl py-4 px-5 text-sm outline-none focus:border-[#1E5BFF] transition-all" />
                  <button className="w-14 h-14 bg-[#1E5BFF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all"><Send size={20} /></button>
               </div>
            </footer>
          </div>
        )}
      </main>

      {/* FOOTER: DYNAMIC CTA */}
      {view === 'sales' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
            <button 
                onClick={handleFooterClick}
                disabled={!selectedMode}
                className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 flex flex-col items-center justify-center transition-all active:scale-[0.98] ${
                    selectedMode ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
                }`}
            >
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                            {selectedMode ? `CONTINUAR - ${selectedMode.label}` : 'SELECIONE UM PLANO'}
                        </span>
                        {selectedMode && <ArrowRight size={14} className="text-white/60" />}
                    </div>
                    {selectedMode && (
                         <div className="flex items-center gap-3">
                             <span className="text-xl font-black text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                         </div>
                    )}
                </div>
            </button>
        </div>
      )}

      {/* Modals for Chat */}
      {isLogoModalOpen && (
          <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
            <div className="w-full bg-white dark:bg-gray-900 rounded-t-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">Enviar logo da empresa</h3>
                <button onClick={() => setIsLogoModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-500 mb-8">Envie sua logo em alta qualidade (PNG ou PDF).</p>

              {logoPreview ? (
                <div className="relative w-40 h-40 mx-auto bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-blue-500 flex items-center justify-center p-4 group">
                    <img src={logoPreview} className="max-w-full max-h-full object-contain" alt="Preview" />
                    <button onClick={() => setLogoPreview(null)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg"><X size={14}/></button>
                </div>
              ) : (
                <label className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <input type="file" className="hidden" accept="image/png, application/pdf" onChange={handleLogoUpload} />
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600"><Upload size={24} /></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selecionar arquivo</p>
                </label>
              )}

              <button 
                onClick={confirmLogoSend}
                disabled={!logoPreview}
                className="w-full mt-8 py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:grayscale"
              >
                Confirmar Envio
              </button>
            </div>
          </div>
        )}

        {isBriefingModalOpen && (
          <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
            <div className="w-full bg-white dark:bg-gray-900 rounded-t-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-md mx-auto max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white">Informações do banner</h3>
                <button onClick={() => setIsBriefingModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome da Empresa</label>
                  <input 
                    type="text"
                    value={briefingData.companyName}
                    onChange={e => setBriefingData({...briefingData, companyName: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Chamada Principal</label>
                  <input 
                    type="text"
                    placeholder="Ex: Promoção da Semana"
                    value={briefingData.headline}
                    onChange={e => setBriefingData({...briefingData, headline: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Descrição Curta</label>
                  <textarea 
                    rows={2}
                    placeholder="Ex: Ofertas exclusivas para o bairro"
                    value={briefingData.description}
                    onChange={e => setBriefingData({...briefingData, description: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium dark:text-white outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Observações (opcional)</label>
                  <textarea 
                    rows={2}
                    placeholder="Ex: cores preferidas, estilo, algo que não quer"
                    value={briefingData.observations}
                    onChange={e => setBriefingData({...briefingData, observations: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium dark:text-white outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={saveBriefing}
                  disabled={!briefingData.companyName || !briefingData.headline}
                  className="w-full mt-4 py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:grayscale"
                >
                  Salvar Informações
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
};
