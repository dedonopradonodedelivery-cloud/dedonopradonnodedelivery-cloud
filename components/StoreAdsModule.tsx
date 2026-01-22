
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
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
            <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between ${paymentMethod === 'pix' ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
              <div className="flex items-center gap-3"><QrCode size={20} className="text-blue-500" /><span className="font-bold text-sm">PIX</span></div>
              {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
            </button>
            <button onClick={() => setPaymentMethod('credit')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between ${paymentMethod === 'credit' ? 'bg-blue-50 border-blue-500' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
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
               <div className={`p-4 rounded-3xl shadow-sm border ${
                   msg.role === (isDesigner ? 'user' : 'system') 
                    ? 'bg-white dark:bg-gray-800 rounded-tl-none border-gray-100 dark:border-gray-700' 
                    : 'bg-[#1E5BFF] text-white rounded-tr-none border-blue-500'
                }`}>
                  {msg.type === 'attachment' ? (
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 mb-2">
                             <ClipboardList size={16} />
                             <span className="font-bold text-xs uppercase">Briefing de Criação</span>
                         </div>
                         <div className="text-xs space-y-1 opacity-90">
                             <p><strong>Loja:</strong> {msg.details.name}</p>
                             <p><strong>Oferta:</strong> {msg.details.promo}</p>
                             <p><strong>Obs:</strong> {msg.details.obs}</p>
                         </div>
                      </div>
                  ) : msg.type === 'file' ? (
                      <div className="flex items-center gap-3">
                          <ImageIcon size={20} />
                          <p className="text-sm font-bold">{msg.text}</p>
                          <button className="p-1.5 bg-black/10 rounded-lg"><Check size={14}/></button>
                      </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  )}
               </div>
               <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest px-2">{msg.timestamp}</span>
            </div>
          ))}
          {!isDesigner && proChatStep === 1 && (
            <div className="flex gap-2 p-2 ml-2">
               <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </main>

        {/* Barra de Ações do Chat */}
        <footer className={`p-6 border-t space-y-4 sticky bottom-0 z-50 ${isDesigner ? 'bg-indigo-950 border-white/10' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
           {isDesigner ? (
              <div className="flex flex-col gap-2">
                 <div className="flex gap-2">
                    <button onClick={() => showToast("Ação desativada no modo visualização", "designer")} className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                        <Upload size={16} /> Enviar V1
                    </button>
                    <button onClick={() => showToast("Ação desativada no modo visualização", "designer")} className="flex-1 py-4 bg-white/5 text-slate-300 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                        <Check size={16} /> Finalizar
                    </button>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <Info size={12} className="text-indigo-400" />
                    <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Prazo: 48h restantes</p>
                 </div>
              </div>
           ) : (
             <>
               {proChatStep === 2 && (
                 <div className="flex flex-col gap-2">
                    <button className="w-full py-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center justify-center gap-3 text-[#1E5BFF] text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all">
                      <Upload size={16} /> Enviar logo
                    </button>
                    <button className="w-full py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center gap-3 text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all">
                      <FileText size={16} /> Preencher informações
                    </button>
                 </div>
               )}
               <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Digite sua dúvida..."
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all dark:text-white"
                  />
                  <button onClick={() => window.open('https://wa.me/5521999999999', '_blank')} className="p-4 bg-green-500 text-white rounded-2xl shadow-lg active:scale-95 transition-all">
                    <MessageCircle size={20} className="fill-white" />
                  </button>
               </div>
               <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">
                 Atendimento oficial Localizei JPA
               </p>
             </>
           )}
        </footer>
      </div>
    );
  }

  // --- RENDER PADRÃO DO MÓDULO ---

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col overflow-x-hidden selection:bg-blue-500/30">
      
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-blue-600 border-blue-500'} text-white`}>
           {toast.type === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
           <p className="text-xs font-black uppercase tracking-tight">{toast.msg}</p>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="font-bold text-lg leading-none flex items-center gap-2">Anunciar no Bairro <Crown size={16} className="text-amber-400 fill-amber-400" /></h1>
          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-64 max-w-md mx-auto w-full">
        
        {/* BLOCO 1: POSICIONAMENTO */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Target size={14} /> 1. Onde deseja aparecer?
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {DISPLAY_MODES.map((mode) => (
              <button 
                key={mode.id} 
                onClick={() => handleModeSelection(mode)} 
                className={`relative flex items-start text-left p-6 rounded-[2rem] border-2 transition-all duration-300 gap-5 ${selectedMode?.id === mode.id ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${selectedMode?.id === mode.id ? 'bg-blue-50 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}><mode.icon size={28} /></div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{mode.label}</p>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode?.id === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>{selectedMode?.id === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}</div>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{mode.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO 2: PERÍODO */}
        <section 
            ref={periodRef} 
            className={`space-y-6 transition-all duration-500 ${!selectedMode ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}
        >
            <div className={`flex flex-col transition-all duration-500 ${highlightPeriod ? 'scale-105' : 'scale-100'}`}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
                <Calendar size={14} /> 2. Período de Exibição
              </h3>
              <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">Escolha por quanto tempo quer anunciar.</p>
            </div>
            
            <div className={`flex gap-3 transition-all duration-700 ${highlightPeriod ? 'ring-2 ring-blue-500/20 rounded-3xl p-1' : ''}`}>
                {dynamicPeriods.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => togglePeriod(p.id)} 
                        className={`flex-1 p-5 rounded-3xl border-2 transition-all text-left group ${selectedPeriods.includes(p.id) ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                           <p className="text-[10px] font-black text-white uppercase">{p.label}</p>
                           {selectedPeriods.includes(p.id) && <CheckCircle2 size={14} className="text-blue-500" />}
                        </div>
                        <p className="text-[9px] text-blue-400 font-bold font-mono">{p.dates}</p>
                    </button>
                ))}
            </div>
            {selectedMode && selectedPeriods.length === 0 && (
              <div className="flex items-center gap-2 px-1 animate-bounce">
                <ArrowRight size={14} className="text-blue-500 rotate-90" />
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Selecione o período para liberar os bairros</p>
              </div>
            )}
        </section>

        {/* BLOCO 3: BAIRROS */}
        <section 
            ref={neighborhoodRef} 
            className={`space-y-6 transition-all duration-500 ${selectedPeriods.length === 0 ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}`}
        >
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                    <MapPin size={14} /> 3. Bairros de Alcance
                </h3>
                <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">Onde seu banner será visto.</p>
              </div>
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

        {/* BLOCO 4: DESIGN */}
        <section ref={creativeRef} className={`space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Palette size={14} /> 4. Design da Arte</h3>
          
          <div className="space-y-4">
              <div onClick={() => setArtChoice('diy')} className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'diy' ? 'bg-slate-900 border-blue-500 shadow-xl' : 'bg-slate-900 border-white/5'}`}>
                <div className="p-8">
                    <div className="flex items-start gap-5 mb-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0"><Paintbrush size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1 leading-tight">Personalizar manualmente</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Use seu banner pronto ou crie no editor.</p>
                        </div>
                    </div>

                    {artChoice === 'diy' && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 pt-4 border-t border-white/5">
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDiyFlowStep('upload'); }}
                                  className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all ${diyFlowStep === 'upload' && isArtSaved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><ImageIcon size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase leading-tight">Usar banner pronto</p>
                                        <p className="text-[8px] text-slate-500 uppercase mt-1">Upload de arquivo</p>
                                    </div>
                                </button>

                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDiyFlowStep('editor'); setIsEditingArt(true); }}
                                  className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-3 transition-all ${diyFlowStep === 'editor' && isArtSaved ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Palette size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase leading-tight">Criar no editor</p>
                                        <p className="text-[8px] text-slate-500 uppercase mt-1">Fazer do zero</p>
                                    </div>
                                </button>
                            </div>

                            {isArtSaved && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between animate-in zoom-in duration-300">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        <span className="text-[10px] font-black text-emerald-400 uppercase">Arte {diyFlowStep === 'upload' ? 'Enviada' : 'Criada'}</span>
                                    </div>
                                    <button onClick={() => setDiyFlowStep('selection')} className="text-[9px] font-black text-white bg-slate-800 px-3 py-1.5 rounded-lg uppercase tracking-widest">Alterar</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
              </div>

              <div onClick={() => { setArtChoice('pro'); setIsArtSaved(true); setView('pro_checkout'); }} className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'pro' ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/5' : 'bg-slate-900 border-white/5'}`}>
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0"><Rocket size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 leading-tight">Contratar time profissional</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">Nós criamos o banner profissional para você.</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500 line-through text-[9px] font-bold">R$ 149</span>
                            <p className="text-xl font-black text-white">R$ 69,90</p>
                        </div>
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
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Modo: {selectedMode?.label}</span><span className="font-bold text-white">R$ {selectedMode?.price.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Bairros selecionados</span><span className="font-bold text-white">× {selectedNeighborhoods.length}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Vigência</span><span className="font-bold text-white">{selectedPeriods.length * 30} dias</span></div>
                    {artChoice === 'pro' && <div className="flex justify-between text-sm text-amber-400"><span className="font-medium">Arte Profissional</span><span className="font-black">+ R$ 69,90</span></div>}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center"><span className="text-sm font-bold text-slate-300">Total</span><span className="text-2xl font-black text-white">R$ {prices.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                </div>
                <div className="space-y-3 pt-6 border-t border-white/10">
                    <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}><div className="flex items-center gap-4"><QrCode size={20} className={paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">PIX (Imediato)</span></div>{paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}</button>
                </div>
            </div>
        </section>
      </main>

      {!isSuccess && view === 'sales' && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <button onClick={handleFooterClick} disabled={isSubmitting} className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex flex-col items-center justify-center transition-all active:scale-[0.98] ${selectedMode ? 'bg-[#1E5BFF] text-white' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'}`}>
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : !selectedMode ? <span className="font-black text-sm uppercase tracking-widest">Escolha onde aparecer</span> : (
              <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-0.5"><span className="text-[10px] font-black text-white/60 uppercase tracking-widest">PAGAR AGORA: {selectedMode.label}</span><ArrowRight size={14} className="text-white/60" /></div>
                  <div className="flex items-baseline gap-2"><span className="text-xs font-bold text-white/40 line-through">R$ {prices.original.toFixed(2)}</span><span className="text-xl font-black text-white">R$ {prices.current.toFixed(2)}</span></div>
              </div>
          )}
        </button>
      </div>
      )}
    </div>
  );
};
