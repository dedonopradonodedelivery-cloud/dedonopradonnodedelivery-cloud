import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  // Added ChevronRight to fix 'Cannot find name' error
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
  ClipboardList
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from './StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
}

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
    price: 89.90,
    originalPrice: 199.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
    whyChoose: 'Ideal para máxima visibilidade imediata.'
  },
  { 
    id: 'cat', 
    label: 'Categorias', 
    icon: LayoutGrid, 
    price: 49.90,
    originalPrice: 149.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
    whyChoose: 'Impacta o cliente no momento da decisão.'
  },
  { 
    id: 'combo', 
    label: 'Home + Categorias', 
    icon: Zap, 
    price: 119.90,
    originalPrice: 349.80,
    description: 'Destaque na página inicial e em todas as categorias.',
    whyChoose: 'Mais alcance, cliques e chances de venda.'
  },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode }) => {
  const isDesigner = viewMode === 'Designer';
  
  const [view, setView] = useState<'sales' | 'creator' | 'editor' | 'pro_checkout' | 'pro_processing' | 'pro_approved' | 'pro_chat' | 'designer_workspace'>('sales');
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // States para o Chat Pro
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [proChatStep, setProChatStep] = useState(0);

  // Controle de scroll inteligente
  const [highlightPeriod, setHighlightPeriod] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Redirecionamento automático para o Workspace se for Designer
  useEffect(() => {
    if (isDesigner) {
      setView('designer_workspace');
    }
  }, [isDesigner]);

  const dynamicPeriods = useMemo(() => {
    const now = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const end1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const start2 = new Date(end1.getTime() + 1 * 24 * 60 * 60 * 1000);
    const end2 = new Date(start2.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      { id: 'periodo_1', label: 'Começar agora', sub: 'Exibição imediata', dates: `${formatDate(now)} → ${formatDate(end1)}`, badge: 'Mais rápido' },
      { id: 'periodo_2', label: 'Próximos 30 dias', sub: 'Planejamento futuro', dates: `${formatDate(start2)} → ${formatDate(end2)}`, badge: 'Planejar' },
    ];
  }, []);

  // Lógica de mensagens automáticas do Chat
  useEffect(() => {
    if (view === 'pro_chat' && proChatStep === 0) {
      setProChatStep(1);
      
      // No modo designer, o chat deve conter o briefing do lojista
      if (isDesigner) {
        setChatMessages([
            { id: 1, role: 'system', text: '🎉 Parabéns pela escolha profissional!\nNosso time vai criar um banner focado em conversão.\nEm até 72h você receberá a arte pronta para aprovação e publicação.', timestamp: '10:00' },
            { id: 2, role: 'system', text: 'Para começarmos, envie por aqui:\n• Logo em alta (PNG ou PDF)\n• Nome da empresa\n• Pequena descrição / promoção', timestamp: '10:01' },
            { id: 3, role: 'user', text: 'Olá! Enviei os dados abaixo.', timestamp: '10:05' },
            { id: 4, role: 'user', type: 'attachment', text: '📋 Informações do banner enviadas.', details: { name: 'Hamburgueria do Zé', promo: 'Combo Casal R$ 49,90', obs: 'Usar cores preto e laranja.' }, timestamp: '10:05' },
            { id: 5, role: 'user', type: 'file', text: 'Logo_Vetorial.png', timestamp: '10:06' }
        ]);
        setProChatStep(2);
      } else {
        setChatMessages([{
            id: 1,
            role: 'system',
            text: '🎉 Parabéns pela escolha profissional!\nNosso time vai criar um banner focado em conversão.\nEm até 72h você receberá a arte pronta para aprovação e publicação.',
            timestamp: 'Agora'
          }]);
    
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              id: 2,
              role: 'system',
              text: 'Para começarmos, envie por aqui:\n• Logo em alta (PNG ou PDF)\n• Nome da empresa\n• Pequena descrição / promoção\nAssim que recebermos, damos início à criação.',
              timestamp: 'Agora'
            }]);
            setProChatStep(2);
          }, 1500);
      }
    }
  }, [view, isDesigner]);

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
    const isAdding = !selectedPeriods.includes(periodId);
    const nextPeriods = isAdding ? [...selectedPeriods, periodId] : selectedPeriods.filter(p => p !== periodId);
    setSelectedPeriods(nextPeriods);
  };

  const selectAllAvailableHoods = () => {
    const availableHoods = NEIGHBORHOODS.filter(hood => checkHoodAvailability(hood).available);
    setSelectedNeighborhoods(availableHoods);
  };

  const handlePayPro = () => {
    setView('pro_processing');
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
    if (!selectedMode) return { current: 0, original: 0 };
    const hoodsMult = Math.max(1, selectedNeighborhoods.length);
    const periodsMult = Math.max(1, selectedPeriods.length);
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    return {
      current: (selectedMode.price * hoodsMult * periodsMult) + artExtra,
      original: (selectedMode.originalPrice * hoodsMult * periodsMult) + artExtra
    };
  }, [selectedMode, selectedPeriods, selectedNeighborhoods, artChoice]);

  const handleFooterClick = () => {
    if (!selectedMode) return;
    if (selectedPeriods.length === 0) { showToast("Selecione o período.", "error"); scrollTo(periodRef, 120); return; }
    if (selectedNeighborhoods.length === 0) { showToast("Escolha os bairros.", "error"); scrollTo(neighborhoodRef, 120); return; }
    if (!isArtSaved) { showToast("Configure a arte do banner.", "error"); scrollTo(creativeRef, 120); return; }
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000);
  };

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

  // --- DESIGNER WORKSPACE ---
  
  if (view === 'designer_workspace') {
    const activeProjects = [
        { id: 'pj-1', store: 'Hamburgueria do Zé', status: 'briefing_recebido', date: 'Hoje, 10:05', type: 'Home' },
        { id: 'pj-2', store: 'Studio Bella', status: 'em_criacao', date: 'Ontem', type: 'Categorias' },
        { id: 'pj-3', store: 'PetShop Patas', status: 'aguardando_aprovacao', date: '02 Nov', type: 'Home' },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col animate-in slide-in-from-right">
            <header className="bg-indigo-950 px-6 py-6 border-b border-white/10 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-xl uppercase tracking-tighter">Workspace</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Modo Designer (Visualização)</p>
                        </div>
                    </div>
                </div>
                <button onClick={onBack} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><X size={20} /></button>
            </header>

            <main className="p-6 space-y-8 pb-32">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-5 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pendentes</p>
                        <p className="text-3xl font-black text-white">08</p>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entregar hoje</p>
                        <p className="text-3xl font-black text-indigo-400">02</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Fila de Pedidos</h3>
                    {activeProjects.map(proj => (
                        <div key={proj.id} onClick={() => setView('pro_chat')} className="bg-slate-900 p-5 rounded-[2rem] border border-white/5 flex items-center justify-between hover:border-indigo-500/30 transition-all cursor-pointer group active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                    <Building size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white leading-tight">{proj.store}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black mt-1">{proj.type} • {proj.date}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border ${
                                    proj.status === 'briefing_recebido' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    proj.status === 'em_criacao' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                }`}>
                                    {proj.status.replace('_', ' ')}
                                </span>
                                <ChevronRight size={16} className="text-slate-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
  }

  // --- VIEWS PROFISSIONAIS (LOJISTA) ---
  
  if (view === 'pro_checkout') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
        <div className="w-full bg-white dark:bg-gray-900 rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-md mx-auto">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pagamento – Criação profissional</h2>
          <p className="text-sm text-gray-500 mb-8">Após o pagamento, você será direcionado para o chat com nossos designers.</p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm">Serviço</span>
              <span className="font-bold text-gray-900 dark:text-white">Design Pro de Banner</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 text-sm font-bold">Total</span>
              <span className="text-2xl font-black text-blue-600">R$ 69,90</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between ${paymentMethod === 'pix' ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700'}`}>
              <div className="flex items-center gap-3"><QrCode size={20} className="text-blue-500" /><span className="font-bold text-sm">PIX</span></div>
              {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
            </button>
            <button onClick={() => setPaymentMethod('credit')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between ${paymentMethod === 'credit' ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700'}`}>
              <div className="flex items-center gap-3"><CreditCard size={20} className="text-blue-500" /><span className="font-bold text-sm">Cartão de Crédito (até 3x)</span></div>
              {paymentMethod === 'credit' && <CheckCircle2 size={18} className="text-blue-500" />}
            </button>
          </div>

          <button onClick={handlePayPro} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs mb-4">Pagar agora (simulação)</button>
          <button onClick={() => setView('sales')} className="w-full py-2 text-gray-400 font-bold text-xs uppercase tracking-widest">Cancelar</button>
        </div>
      </div>
    );
  }

  if (view === 'pro_processing') {
    return (
      <div className="fixed inset-0 z-[120] bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Confirmando pagamento...</h2>
        <p className="text-gray-500 text-sm">Validando sua transação com segurança.</p>
      </div>
    );
  }

  if (view === 'pro_approved') {
    return (
      <div className="fixed inset-0 z-[120] bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-200 animate-bounce-short">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Pagamento aprovado!</h2>
        <p className="text-gray-500 text-base leading-relaxed mb-12 max-w-xs">Agora vamos iniciar a criação do seu banner pelo chat.</p>
        <button onClick={() => setView('pro_chat')} className="w-full max-w-xs py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3">
          Ir para o chat <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  if (view === 'pro_chat') {
    return (
      <div className="fixed inset-0 z-[130] bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in slide-in-from-right h-full">
        {toast && (
            <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${toast.type === 'designer' ? 'bg-indigo-600 border-indigo-500' : 'bg-rose-600 border-rose-500'} text-white`}>
                <p className="text-xs font-black uppercase tracking-tight">{toast.msg}</p>
            </div>
        )}

        {/* Header do Chat */}
        <header className={`${isDesigner ? 'bg-indigo-950 text-white' : 'bg-white dark:bg-gray-900'} px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm sticky top-0 z-50`}>
          <div className="flex items-center gap-4">
             <button onClick={() => setView(isDesigner ? 'designer_workspace' : 'sales')} className="p-2 bg-white/5 rounded-xl text-slate-400"><ChevronLeft size={20} /></button>
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md relative shrink-0">
                 {isDesigner ? <UserIcon size={20} /> : <Building size={20} />}
                 <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
             </div>
             <div>
               <h2 className="font-bold leading-tight">{isDesigner ? 'Hamburgueria do Zé' : 'Time de Design'}</h2>
               <p className={`text-[10px] font-black uppercase tracking-widest ${isDesigner ? 'text-indigo-300' : 'text-green-500'}`}>{isDesigner ? 'Briefing Ativo' : 'Online agora'}</p>
             </div>
          </div>
          {isDesigner && (
              <span className="text-[8px] font-black bg-indigo-500 text-white px-2 py-1 rounded-md uppercase tracking-widest">Modo Designer</span>
          )}
        </header>

        {/* Corpo do Chat */}
        <main ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] animate-in slide-in-from-bottom-2 duration-500 ${msg.role === (isDesigner ? 'user' : 'system') ? 'items-start' : 'items-end ml-auto'}`}>
               <div className={`p-4 rounded-3xl shadow