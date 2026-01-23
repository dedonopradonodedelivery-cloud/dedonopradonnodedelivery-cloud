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
    label: 'Home', 
    icon: Home, 
    price: 49.90,
    originalPrice: 199.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
    whyChoose: 'Ideal para máxima visibilidade imediata.'
  },
  { 
    id: 'cat', 
    label: 'Categorias', 
    icon: LayoutGrid, 
    price: 29.90,
    originalPrice: 149.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
    whyChoose: 'Impacta o cliente no momento da decisão.'
  },
  { 
    id: 'combo', 
    label: 'Home + Categorias', 
    icon: Zap, 
    price: 69.90,
    originalPrice: 349.80,
    description: 'Destaque na página inicial e em todas as categorias.',
    whyChoose: 'Mais alcance, cliques e chances de venda.'
  },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const isDesigner = viewMode === 'Designer';
  
  const [view, setView] = useState<ViewState>('sales');
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'diy' | 'pro' | null>(null);
  const [diyFlowStep, setDiyFlowStep] = useState<'selection' | 'upload' | 'editor'>('selection');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [savedDesign, setSavedDesign] = useState<any>(null);
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
  const [highlightPeriod, setHighlightPeriod] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
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
    const start2 = new Date(now.getTime());
    const end2 = new Date(start2.getTime() + 90 * 24 * 60 * 60 * 1000);

    return [
      { id: 'periodo_1', label: '1 Mês (30 dias)', sub: 'Visibilidade mensal', dates: `${formatDate(now)} → ${formatDate(end1)}`, badge: 'Mais simples', days: 30, multiplier: 1 },
      { id: 'periodo_2', label: '3 Meses (90 dias)', sub: 'Pacote trimestral', dates: `${formatDate(start2)} → ${formatDate(end2)}`, badge: 'Melhor Valor', days: 90, multiplier: 3 },
    ];
  }, []);

  useEffect(() => {
    if (view === 'pro_chat' && proChatStep === 0) {
      setProChatStep(1);
      
      const highDemandText = dailySalesCount > 5 
        ? `Devido à alta demanda no momento, o prazo estimado para criação do seu banner é de até ${calculatedDeadlineDays} dias.\n\n`
        : '';

      const professionalMessage = {
          id: 1,
          author: 'Sistema',
          role: 'System',
          text: `Olá! 👋\nSeu pedido de Anunciar nos Banners – Time Profissional foi confirmado com sucesso.\n\n${highDemandText}A partir deste chat vamos alinhar todas as informações para a criação da arte.\n\nPara começar, envie por aqui:\n\n• Logo da sua empresa\n• Cores da sua marca\n• Texto ou promoção desejada\n• Alguma referência visual (se tiver)\n\nAssim que seu banner entrar em produção, avisaremos por aqui.`,
          timestamp: 'Agora'
      };

      setChatMessages([professionalMessage]);
      setProChatStep(2);
    }
  }, [view, isDesigner, proChatStep, dailySalesCount, calculatedDeadlineDays]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const showToast = (msg: string, type: 'info' | 'error' | 'designer' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, offset: number = 100) => {
    setTimeout(() => {
      if (ref.current) {
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = ref.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const handleModeSelection = (mode: typeof DISPLAY_MODES[0]) => {
    setSelectedMode(mode);
    if (selectedPeriods.length === 0) {
        setHighlightPeriod(true);
        scrollTo(periodRef, 120);
        setTimeout(() => setHighlightPeriod(false), 2000);
    }
  };

  const checkHoodAvailability = (hood: string, periodsToTest?: string[]): { available: boolean; busyIn: string[] } => {
    const targetPeriods = periodsToTest || selectedPeriods;
    if (targetPeriods.length === 0) return { available: true, busyIn: [] };
    const busyIn = targetPeriods.filter(p => MOCK_OCCUPANCY[hood]?.[p] === true);
    return { available: busyIn.length === 0, busyIn };
  };

  const togglePeriod = (periodId: string) => {
    setSelectedPeriods([periodId]);
  };

  const selectAllAvailableHoods = () => {
    const availableHoods = NEIGHBORHOODS.filter(hood => checkHoodAvailability(hood).available);
    setSelectedNeighborhoods(availableHoods);
  };

  const handlePayPro = () => {
    setView('pro_processing');
    setDailySalesCount(prev => prev + 1); // Simula a venda
    setTimeout(() => {
      setView('pro_approved');
    }, 2000);
  };

  const handleSaveDesign = (design: any) => {
    setSavedDesign({ type: 'editor', ...design });
    setIsArtSaved(true);
    setIsEditingArt(false);
    setDiyFlowStep('editor');
    scrollTo(paymentRef, 80);
  };

  const prices = useMemo(() => {
    if (!selectedMode) return { current: 0, original: 0, isPackage: false, installments: 0, monthly: 0 };
    const hoodsMult = Math.max(1, selectedNeighborhoods.length);
    const period = dynamicPeriods.find(p => selectedPeriods.includes(p.id));
    const periodsMult = period ? period.multiplier : 1;
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    
    const basePrice = selectedMode.price;
    const originalBasePrice = selectedMode.originalPrice;
    
    const current = period?.days === 90 ? (basePrice * 3 * hoodsMult) + artExtra : (basePrice * hoodsMult) + artExtra;
    const original = period?.days === 90 ? (originalBasePrice * 3 * hoodsMult) + artExtra : (originalBasePrice * hoodsMult) + artExtra;
    
    return {
      current,
      original,
      isPackage: period?.days === 90,
      installments: 3,
      monthly: (basePrice * 3 * hoodsMult) / 3 
    };
  }, [selectedMode, selectedPeriods, selectedNeighborhoods, artChoice, dynamicPeriods]);

  const handleFooterClick = () => {
    if (!selectedMode) return;
    if (selectedPeriods.length === 0) { showToast("Selecione o período.", "error"); scrollTo(periodRef, 120); return; }
    if (selectedNeighborhoods.length === 0) { showToast("Escolha os bairros.", "error"); scrollTo(neighborhoodRef, 120); return; }
    if (!isArtSaved) { showToast("Configure a arte do banner.", "error"); scrollTo(creativeRef, 120); return; }
    
    if (artChoice === 'pro') {
        if (dailySalesCount > 5) {
            setView('pro_high_demand_warning');
        } else {
            setView('pro_checkout');
        }
        return;
    }

    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000);
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
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        text: 'Logo recebida com sucesso! 👍',
        timestamp: 'Agora'
      }]);
    }, 800);
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
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        text: 'Briefing recebido! Já estamos analisando suas informações.',
        timestamp: 'Agora'
      }]);
    }, 800);
  };

  const handleHeaderBack = () => {
    if (view === 'pro_checkout' || view === 'pro_high_demand_warning') setView('sales');
    else if (view === 'pro_chat') setView('sales');
    else onBack();
  }

  const getPageTitle = () => {
    switch (view) {
      case 'pro_checkout': return 'Pagamento';
      case 'pro_chat': return 'Banner Patrocinado';
      default: return 'Anunciar nos Banners';
    }
  }

  const isCheckoutStep = !!(selectedMode && selectedPeriods.length > 0 && selectedNeighborhoods.length > 0 && isArtSaved);

  if (isEditingArt) {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        storeLogo={user?.user_metadata?.logo_url}
        onSave={handleSaveDesign} 
        onBack={() => setIsEditingArt(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-blue-500/30">
      
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-blue-600 border-blue-500'} text-white`}>
           {toast.type === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
           <p className="text-xs font-black uppercase tracking-tight">{toast.msg}</p>
        </div>
      )}

      {/* CABEÇALHO FIXO PERSISTENTE (STICKY HEADER) */}
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

      <main className={`flex-1 overflow-y-auto no-scrollbar ${view === 'sales' ? 'pb-64' : ''}`}>
        
        {view === 'pro_high_demand_warning' && (
           <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 min-h-[70vh]">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-500/20">
                    <AlertTriangle size={32} className="text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Demanda alta no momento</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Nosso prazo normal de criação é de 72 horas.</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">Devido à alta demanda hoje, o prazo estimado para novos pedidos é de até <strong className="text-amber-400">{calculatedDeadlineDays} dias</strong>.</p>
                <button onClick={() => setView('pro_checkout')} className="w-full max-w-xs py-4 bg-amber-500 text-slate-900 font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all">Continuar para pagamento</button>
           </div>
        )}

        {view === 'pro_checkout' && (
          <div className="p-6 flex flex-col justify-center items-center text-center animate-in fade-in">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-blue-500/20">
                  <FileSignature size={32} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-8">Resumo do serviço</h2>
              <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4 text-left">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4"><span className="text-slate-400">Produto:</span><span className="font-bold text-white">Banners Patrocinados</span></div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4"><span className="text-slate-400">Plano:</span><span className="font-bold text-white">Time Profissional</span></div>
                  <div className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4 mt-4"><span className="font-bold text-slate-200">Descrição:</span> Criação profissional do banner + publicação no app.</div>
              </div>
              <button onClick={handlePayPro} className="w-full max-w-sm mt-8 py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all">Confirmar pagamento</button>
          </div>
        )}

        {view === 'pro_processing' && (
          <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 min-h-screen">
              <Loader2 className="w-12 h-12 text-[#1E5BFF] animate-spin mb-6" />
              <h2 className="text-xl font-bold text-white">Processando pagamento...</h2>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Não feche esta tela</p>
          </div>
        )}

        {view === 'pro_approved' && (
          <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 min-h-screen">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                  <CheckCircle2 size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white leading-tight mb-4">Pagamento aprovado ✅</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-[280px] mb-12 font-medium">Parabéns! 🎉<br/>Seu pedido foi confirmado.</p>
              <button onClick={() => { setChatMessages([]); setProChatStep(0); setView('pro_chat'); }} className="w-full max-w-xs bg-white text-slate-950 font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">Falar com o designer <ArrowRight size={20} strokeWidth={3} /></button>
          </div>
        )}

        {view === 'sales' && (
          <div className="p-6 space-y-16">
            
            <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-slate-900 border border-blue-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4 shadow-lg shadow-blue-600/20">
                            Oportunidade
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20 group-hover:scale-105 transition-transform duration-500">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tighter">
                                    Seu concorrente pode estar aqui antes de você.
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed mt-2 font-medium">
                                    Garanta seu destaque agora e apareça como patrocinado antes dos demais nas listas do app.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-6 mt-6 border-t border-white/5">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Quem garante o espaço agora sai na frente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Target size={14} /> 1. Onde deseja aparecer?</h3>
                <div className="grid grid-cols-1 gap-4">
                    {DISPLAY_MODES.map((mode) => (
                    <button key={mode.id} onClick={() => handleModeSelection(mode)} className={`relative flex items-start text-left p-6 rounded-[2rem] border-2 transition-all duration-300 gap-5 ${selectedMode?.id === mode.id ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}>
                        <div className={`p-4 rounded-2xl shrink-0 ${selectedMode?.id === mode.id ? 'bg-blue-50 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}><mode.icon size={28} /></div>
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{mode.label}</p>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode?.id === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>{selectedMode?.id === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}</div>
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-1.5"><span className="text-xs text-slate-500 line-through">R$ {mode.originalPrice.toFixed(2)}</span><span className="text-sm font-black text-white">por R$ {mode.price.toFixed(2)}</span></div>
                            <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{mode.description}</p>
                        </div>
                    </button>
                    ))}
                </div>
            </section>

            <section ref={periodRef} className={`space-y-6 transition-all duration-500 ${!selectedMode ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
                <div className={`flex flex-col transition-all duration-500 ${highlightPeriod ? 'scale-105' : 'scale-100'}`}>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Calendar size={14} /> 2. Período de Exibição</h3>
                </div>
                <div className={`flex gap-3 transition-all duration-700 ${highlightPeriod ? 'ring-2 ring-blue-500/20 rounded-3xl p-1' : ''}`}>
                    {dynamicPeriods.map(p => (
                        <button key={p.id} onClick={() => togglePeriod(p.id)} className={`flex-1 p-5 rounded-3xl border-2 transition-all text-left group ${selectedPeriods.includes(p.id) ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex justify-between items-start mb-2"><p className="text-[10px] font-black text-white uppercase">{p.label}</p>{selectedPeriods.includes(p.id) && <CheckCircle2 size={14} className="text-blue-500" />}</div>
                            <p className="text-[9px] text-blue-400 font-bold font-mono">{p.dates}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section ref={neighborhoodRef} className={`space-y-6 transition-all duration-500 ${selectedPeriods.length === 0 ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2"><MapPin size={14} /> 3. Bairros de Alcance</h3>
                    <button onClick={selectAllAvailableHoods} className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 active:scale-95 transition-all">Selecionar Todos</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {NEIGHBORHOODS.map(hood => {
                        const { available } = checkHoodAvailability(hood);
                        const isSelected = selectedNeighborhoods.includes(hood);
                        return (
                            <button key={hood} onClick={() => { if (available) { setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]); } }} className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all min-h-[80px] ${!available ? 'bg-slate-900/50 border-white/5 opacity-50 cursor-default' : isSelected ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-white/5'}`}>
                                <p className={`font-bold text-xs ${!available ? 'text-slate-600' : 'text-white'}`}>{hood}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${!available ? 'text-rose-500' : isSelected ? 'text-blue-400' : 'text-emerald-500'}`}>{!available ? `Ocupado` : isSelected ? 'Selecionado' : 'Livre'}</p>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section ref={creativeRef} className={`space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Palette size={14} /> 4. Design da Arte</h3>
                <div className="space-y-4">
                    <div onClick={() => setArtChoice('diy')} className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'diy' ? 'bg-slate-900 border-blue-500 shadow-xl' : 'bg-slate-900 border-white/5'}`}>
                        <div className="p-8">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0"><Paintbrush size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 leading-tight">Personalizar manualmente</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">Use seu banner pronto or crie no editor.</p>
                                </div>
                            </div>
                            {artChoice === 'diy' && (
                                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 pt-4 border-t border-white/5">
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={(e) => { e.stopPropagation(); setDiyFlowStep('upload'); }} className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all ${diyFlowStep === 'upload' && isArtSaved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><ImageIcon size={20} /></div><div><p className="text-[10px] font-black text-white uppercase leading-tight">Usar banner pronto</p><p className="text-[8px] text-slate-500 uppercase mt-1">Upload de arquivo</p></div></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDiyFlowStep('editor'); setIsEditingArt(true); }} className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all ${diyFlowStep === 'editor' && isArtSaved ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Palette size={20} /></div><div><p className="text-[10px] font-black text-white uppercase leading-tight">Criar no editor</p><p className="text-[8px] text-slate-500 uppercase mt-1">Fazer do zero</p></div></button>
                                    </div>
                                    {isArtSaved && (<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between animate-in zoom-in duration-300"><div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400" /><span className="text-[10px] font-black text-emerald-400 uppercase">Arte {diyFlowStep === 'upload' ? 'Enviada' : 'Criada'}</span></div><button onClick={() => setDiyFlowStep('selection')} className="text-[9px] font-black text-white bg-slate-800 px-3 py-1.5 rounded-lg uppercase tracking-widest">Alterar</button></div>)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div onClick={() => { setArtChoice('pro'); setIsArtSaved(true); setView('pro_checkout'); }} className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'pro' ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/5' : 'bg-slate-900 border-white/5'}`}>
                        <div className="p-8">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-5"><div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0"><Rocket size={24} /></div><div><h3 className="text-lg font-bold text-white mb-1 leading-tight">Contratar time profissional</h3><p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">Nós criamos o banner profissional para você.</p></div></div>
                                <div className="text-right"><span className="text-slate-500 line-through text-[9px] font-bold">R$ 149</span><p className="text-xl font-black text-white">R$ 69,90</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCO 5: CHECKOUT FINAL */}
            <section ref={paymentRef} className={`space-y-8 transition-all duration-500 ${!isArtSaved ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Check size={14} /> 5. Finalizar Compra</h3>
                <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Modo: {selectedMode?.label}</span><span className="font-bold text-white">R$ {selectedMode?.price.toFixed(2)} / mês</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Bairros selecionados</span><span className="font-bold text-white">× {selectedNeighborhoods.length}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Vigência Total</span><span className="font-bold text-white">{prices.isPackage ? '90 dias' : '30 dias'}</span></div>
                        {artChoice === 'pro' && <div className="flex justify-between text-sm text-amber-400"><span className="font-medium">Arte Profissional</span><span className="font-black">+ R$ 69,90</span></div>}
                        
                        <div className="pt-4 border-t border-white/5 flex flex-col items-end">
                            <div className="flex justify-between items-center w-full mb-1">
                                <span className="text-sm font-bold text-slate-300">Total do Pacote</span>
                                <span className="text-2xl font-black text-white">R$ {prices.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            {prices.isPackage && (
                                <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">3x de R$ {prices.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-white/10">
                        <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}><div className="flex items-center gap-4"><QrCode size={20} className={paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">PIX (Imediato)</span></div>{paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}</button>
                    </div>
                </div>
            </section>
          </div>
        )}

        {view === 'pro_chat' && (
          <div className="flex flex-col h-full">
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
                {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-3xl shadow-sm border ${msg.role === 'user' ? 'bg-[#1E5BFF] text-white rounded-tr-none border-blue-50' : 'bg-slate-900 text-slate-100 rounded-tl-none border-white/5'}`}>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-2">{msg.timestamp}</span>
                    </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER PARA VIEW SALES */}
      {!isSuccess && (view === 'sales' || view === 'pro_checkout') && (
      <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom">
        <button onClick={handleFooterClick} disabled={isSubmitting} className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 flex flex-col items-center justify-center transition-all active:scale-[0.98] ${selectedMode ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'}`}>
            {isSubmitting ? (<Loader2 className="w-6 h-6 animate-spin" />) : !isCheckoutStep ? (<span className="font-black text-sm uppercase tracking-widest">{!selectedMode ? "Escolha onde aparecer" : selectedPeriods.length === 0 ? "Escolha o período" : selectedNeighborhoods.length === 0 ? "Escolha os bairros" : "Configure a arte"}</span>) : (<div className="flex flex-col items-center"><div className="flex items-center gap-2 mb-0.5"><span className="text-[10px] font-black text-white/60 uppercase tracking-widest">FINALIZAR</span><ArrowRight size={14} className="text-white/60" /></div><div className="flex items-center gap-3"><span className="text-xl font-black text-white">PAGAR AGORA — R$ {prices.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div></div>)}
        </button>
      </div>
      )}

      {/* FOOTER PARA VIEW CHAT */}
      {view === 'pro_chat' && (
        <footer className="fixed bottom-[80px] left-0 right-0 p-6 bg-slate-900 border-t border-white/10 shrink-0 z-50">
            <div className="flex items-center gap-3">
                <input type="text" placeholder="Escreva sua mensagem..." className="flex-1 bg-slate-800 border border-white/5 rounded-2xl py-4 px-5 text-sm outline-none focus:border-[#1E5BFF] transition-all" />
                <button className="w-14 h-14 bg-[#1E5BFF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all"><Send size={20} /></button>
            </div>
        </footer>
      )}
    </div>
  );
};
