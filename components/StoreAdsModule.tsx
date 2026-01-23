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
  FileSignature,
  Paperclip,
  MoreVertical,
  ArrowLeft,
  Briefcase,
  Link as LinkIcon,
  Clock,
  Download,
  Palette as PaletteIcon
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

// --- KANBAN DATA ---
const KANBAN_COLUMNS = [
  { id: 'primeiro_contato', title: 'Primeiro contato' },
  { id: 'aguardando_dados', title: 'Aguardando dados' },
  { id: 'em_producao', title: 'Em produção' },
  { id: 'aguardando_aprovacao', title: 'Aguardando aprovação' },
  { id: 'em_alteracao', title: 'Em alteração' },
  { id: 'aprovacao_final', title: 'Aprovação final' },
  { id: 'aprovado', title: 'Aprovado' }
];

const MOCK_KANBAN_ORDERS = [
    { 
        id: '#PJ-123', 
        lojistaName: 'José Carlos',
        companyName: 'Hamburgueria do Zé', 
        status: 'primeiro_contato', 
        deadline: 'Até 4 dias', 
        lastUpdate: 'há 5 min', 
        chatHistory: [
            { author: 'Sistema', text: '✅ Seu pedido entrou em atendimento. Em instantes vamos falar com você por aqui para alinhar seu banner.', timestamp: '10:00', role: 'System', type: 'status_update' },
            { author: 'José Carlos', role: 'Lojista', text: 'Oi! Tudo bem? Segue minha logo e a ideia para o banner.', timestamp: '10:05', type: 'text' },
            { author: 'José Carlos', role: 'Lojista', text: 'Logo_Hamburgueria.png', timestamp: '10:06', type: 'file', fileType: 'image/png', preview: 'https://placehold.co/100x100/FF6501/FFFFFF?text=Logo' },
            { author: 'José Carlos', role: 'Lojista', text: 'briefing.pdf', timestamp: '10:07', type: 'file', fileType: 'application/pdf' },
            { author: 'José Carlos', role: 'Lojista', text: 'Nossas cores da marca são laranja, preto e branco. Queria uma promoção de "Combo Casal por R$49,90". E também um link para o iFood: https://ifood.com.br/hamburgueria-do-ze', timestamp: '10:08', type: 'briefing_text' }
        ]
    },
    { 
        id: '#PJ-124', 
        lojistaName: 'Ana Paula',
        companyName: 'Studio Bella', 
        status: 'aguardando_dados', 
        deadline: 'Até 3 dias', 
        lastUpdate: 'há 1h',
        chatHistory: [
            { author: 'Sistema', text: '✅ Seu pedido entrou em atendimento...', timestamp: '08:00', role: 'System', type: 'status_update' },
            { author: 'Sistema', text: '📌 Estamos aguardando seus dados para iniciar a criação...', timestamp: '09:00', role: 'System', type: 'status_update' },
        ]
    },
    { 
        id: '#PJ-125', 
        lojistaName: 'Marcos Andrade',
        companyName: 'PetShop Patas', 
        status: 'em_producao', 
        deadline: 'Até 2 dias', 
        lastUpdate: 'hoje, 09:15',
        chatHistory: [
            { author: 'Sistema', text: '✅ Seu pedido entrou em atendimento...', timestamp: '08:00', role: 'System', type: 'status_update' },
            { author: 'Marcos Andrade', role: 'Lojista', text: 'Oi, segue a logo e o que eu preciso.', timestamp: '08:10', type: 'text' },
            { author: 'Marcos Andrade', role: 'Lojista', text: 'Logo_PetShop.png', timestamp: '08:11', type: 'file', fileType: 'image/png', preview: 'https://placehold.co/100x100/34D399/FFFFFF?text=Logo' },
            { author: 'Marcos Andrade', role: 'Lojista', text: 'Gostaria de uma promoção de banho e tosa. A partir de R$ 50,00. Pode usar a foto do golden que mandei anexo.', timestamp: '08:15', type: 'briefing_text' },
            { author: 'Marcos Andrade', role: 'Lojista', text: 'golden_retriever.jpg', timestamp: '08:16', type: 'file', fileType: 'image/jpeg', preview: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop' },
            { author: 'Sistema', text: '📌 Movido para "Aguardando dados".', timestamp: '09:00', role: 'System', type: 'status_update' },
            { author: 'Sistema', text: '🎨 Seu banner entrou em produção! ...', timestamp: '09:15', role: 'System', type: 'status_update' }
        ]
    },
];

const CHAT_MESSAGES_BY_STATUS: Record<string, string> = {
    primeiro_contato: "✅ Seu pedido entrou em atendimento. Em instantes vamos falar com você por aqui para alinhar seu banner.",
    aguardando_dados: "📌 Estamos aguardando seus dados para iniciar a criação. Por favor, envie por aqui: logo, cores, texto da oferta e referências (se tiver).",
    em_producao: "🎨 Seu banner entrou em produção! Nosso designer já está criando a arte. Em breve enviaremos a primeira prévia por aqui.",
    aguardando_aprovacao: "🟡 Prévia enviada! Assim que você aprovar, seguimos para finalizar e publicar. Se quiser ajustes, responda por aqui.",
    em_alteracao: "🛠️ Ajustes solicitados recebidos! Estamos realizando as alterações e enviaremos a nova versão em seguida.",
    aprovacao_final: "✅ Tudo pronto para aprovação final. Confira a versão atual e confirme por aqui para concluirmos.",
    aprovado: "🎉 Banner aprovado! Parabéns 👏 Agora vamos publicar seu banner no app conforme combinado."
};

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
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [kanbanOrders, setKanbanOrders] = useState(MOCK_KANBAN_ORDERS);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'chat'>('details');

  const [briefingData, setBriefingData] = useState({
    companyName: user?.user_metadata?.store_name || '',
    headline: '',
    description: '',
    observations: ''
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [highlightPeriod, setHighlightPeriod] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<any>(null);

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
    if (view === 'pro_chat' && proChatStep === 0 && !selectedOrder) {
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
  }, [view, isDesigner, proChatStep, dailySalesCount, calculatedDeadlineDays, selectedOrder]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeDetailTab]);

  // Sincroniza o `selectedOrder` com a lista principal sempre que ela mudar.
  useEffect(() => {
    if (view === 'designer_order_detail' && selectedOrder) {
        const updatedOrderInList = kanbanOrders.find(o => o.id === selectedOrder.id);
        if (updatedOrderInList && updatedOrderInList !== selectedOrder) {
            setSelectedOrder(updatedOrderInList);
        }
    }
  }, [kanbanOrders, selectedOrder, view]);

  const handleMoveCard = (orderId: string, direction: 'forward' | 'backward') => {
      setKanbanOrders(prevOrders => {
          const orderIndex = prevOrders.findIndex(o => o.id === orderId);
          if (orderIndex === -1) return prevOrders;

          const order = { ...prevOrders[orderIndex] };
          const currentColumnIndex = KANBAN_COLUMNS.findIndex(c => c.id === order.status);
          
          let nextColumnIndex = direction === 'forward' ? currentColumnIndex + 1 : currentColumnIndex - 1;

          if (nextColumnIndex < 0 || nextColumnIndex >= KANBAN_COLUMNS.length) return prevOrders;

          const newStatus = KANBAN_COLUMNS[nextColumnIndex].id;
          order.status = newStatus as any;
          order.lastUpdate = 'agora';

          const newSystemMessageText = direction === 'forward'
              ? CHAT_MESSAGES_BY_STATUS[newStatus]
              : `🔄 Atualização do pedido: retornamos para a etapa ${KANBAN_COLUMNS[nextColumnIndex].title} para dar continuidade. Se precisar, responda por aqui.`;

          const newSystemMessage = {
              author: 'Sistema',
              text: newSystemMessageText,
              timestamp: 'Agora',
              role: 'System',
              type: 'status_update'
          };

          order.chatHistory = [...(order.chatHistory || []), newSystemMessage];

          const newOrders = [...prevOrders];
          newOrders[orderIndex] = order;
          return newOrders;
      });
  };

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
        setView('pro_checkout');
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

  // Funções para simulação do "Digitando..."
  const simulateTyping = (userName: string) => {
    setTypingUsers(prev => [...new Set([...prev, userName])]); // Adiciona sem duplicar
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u !== userName));
    }, 3000);
  };

  const formatTypingMessage = (users: string[]): string => {
    if (users.length === 0) return '';
    if (users.length === 1) return `${users[0]} está digitando...`;
    if (users.length === 2) return `${users[0]} e ${users[1]} estão digitando...`;
    
    const lastUser = users[users.length - 1];
    const otherUsers = users.slice(0, -1).join(', ');
    return `${otherUsers}, ${lastUser} estão digitando...`;
  };

  const handleOpenOrderDetail = (order: any) => {
      setSelectedOrder(order);
      setActiveDetailTab('details');
      setView('designer_order_detail');
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

  if (view === 'pro_high_demand_warning') {
    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-sm rounded-[2.5rem] p-8 shadow-2xl border border-amber-500/30 text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-500/20">
                    <AlertTriangle size={32} className="text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Demanda alta no momento</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Nosso prazo normal de criação é de 72 horas.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    Devido à alta demanda hoje, o prazo estimado para novos pedidos é de até <strong className="text-amber-400">{calculatedDeadlineDays} dias</strong>.
                </p>
                 <p className="text-slate-500 text-xs leading-relaxed mb-8">
                    Assim que seu banner entrar em produção, você será avisado.
                </p>
                <div className="space-y-3">
                    <button onClick={() => setView('pro_checkout')} className="w-full py-4 bg-amber-500 text-slate-900 font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all">
                        Continuar para pagamento
                    </button>
                    <button onClick={() => setView('sales')} className="w-full py-3 text-sm font-bold text-slate-500 hover:text-white">
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
  }

  if (view === 'pro_checkout') {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col animate-in fade-in duration-300 pb-[80px]">
            <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-white/5">
                <button onClick={() => setView('sales')} className="p-2 bg-slate-900 rounded-xl text-slate-400"><ChevronLeft size={20} /></button>
                <h1 className="font-bold text-lg leading-none">Confirmação do Pedido</h1>
            </header>
            <main className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-blue-500/20">
                    <FileSignature size={32} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-8">Resumo do serviço</h2>
                <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4 text-left">
                    <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Produto:</span><span className="font-bold text-sm">Banners Patrocinados</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Plano:</span><span className="font-bold text-sm">Time Profissional</span></div>
                    <div className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4 mt-4">
                        <span className="font-bold text-slate-200">Descrição:</span> Criação profissional do banner + publicação no app.
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-8 max-w-xs leading-relaxed">
                    Após o pagamento, você será direcionado para o chat com nosso time de design para criação do seu banner.
                </p>
            </main>
            <footer className="p-6 border-t border-white/5 bg-slate-950">
                <button onClick={handlePayPro} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all">
                    Confirmar pagamento
                </button>
            </footer>
        </div>
    );
  }

  if (view === 'pro_processing') {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
              <h2 className="text-xl font-bold text-white">Processando pagamento...</h2>
          </div>
      );
  }

  if (view === 'pro_approved') {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20">
                  <CheckCircle2 size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Pagamento aprovado ✅</h2>
              <p className="text-slate-400 max-w-sm mb-6">Seu pedido foi confirmado com sucesso.</p>
              
              <div className="w-full max-w-sm bg-slate-800/50 rounded-2xl p-4 text-center border border-white/10 mb-10">
                <p className="text-slate-400 text-xs">Prazo estimado de criação: <strong className="text-white">até {calculatedDeadlineDays} dias</strong>.</p>
                <p className="text-slate-500 text-[10px] mt-1">Nosso time irá iniciar a produção conforme a ordem de chegada.</p>
              </div>

              <button onClick={() => { setChatMessages([]); setProChatStep(0); setView('pro_chat'); }} className="w-full max-w-xs py-5 bg-white text-slate-900 font-black rounded-2xl shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-2">
                  Falar com o designer <ArrowRight />
              </button>
          </div>
      );
  }

  if (view === 'chat_onboarding') {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <header className="absolute top-0 left-0 right-0 p-6 flex">
                <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
            </header>
            
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-blue-500/20 shadow-lg">
                <MessageCircle size={40} className="text-blue-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4 leading-tight">👋 Olá, {user?.user_metadata?.store_name}!</h1>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-8">
                Este é o canal para criação e acompanhamento de banners com nosso time de designers.
            </p>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-12">
                Para iniciar um novo banner, crie um anúncio ou contrate a criação profissional.
            </p>
            
            <button 
              onClick={() => setView('sales')}
              className="w-full max-w-sm py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              Criar Novo Banner <ArrowRight size={18} />
            </button>
        </div>
    );
  }

  if (view === 'designer_panel') {
    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col h-full">
            <header className="bg-slate-900 px-6 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-xl uppercase tracking-tighter">Painel do Designer</h1>
                        <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Pedidos de banner • Time Profissional</p>
                    </div>
                </div>
                <button onClick={onBack} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><X size={20} /></button>
            </header>

            <main className="flex-1 p-6 space-y-4 overflow-x-auto no-scrollbar pb-[80px]">
                <div className="flex gap-4 min-w-full w-fit">
                    {KANBAN_COLUMNS.map((column) => (
                        <div key={column.id} className="w-72 bg-slate-900 rounded-3xl p-4 border border-white/5 flex flex-col shrink-0">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">{column.title}</h3>
                            <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1">
                                {kanbanOrders.filter(o => o.status === column.id).map(order => (
                                    <div 
                                        key={order.id} 
                                        onClick={() => handleOpenOrderDetail(order)}
                                        className="bg-slate-800 p-4 rounded-2xl border border-white/5 shadow-md animate-in fade-in cursor-pointer hover:border-indigo-500/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">Banner Profissional</span>
                                            <span className="text-[9px] text-slate-500 font-bold">{order.id}</span>
                                        </div>
                                        <p className="font-bold text-white text-sm leading-tight mb-1">{order.companyName}</p>
                                        <p className="text-xs text-slate-400 mb-3">{order.lojistaName}</p>
                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                            <span>Prazo: <span className="font-bold text-slate-300">{order.deadline}</span></span>
                                            <span>Atualizado: <span className="font-bold text-slate-300">{order.lastUpdate}</span></span>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={(e) => { e.stopPropagation(); handleMoveCard(order.id, 'backward'); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400"><ArrowLeft size={12}/> Voltar</button>
                                            <button onClick={(e) => { e.stopPropagation(); handleMoveCard(order.id, 'forward'); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">Avançar <ArrowRight size={12} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
  }

  if (view === 'designer_order_detail' && selectedOrder) {
    const { extractedData, extractedFiles, timelineEvents } = useMemo(() => {
        if (!selectedOrder?.chatHistory) {
            return { extractedData: {}, extractedFiles: [], timelineEvents: [] };
        }

        const data: any = { logo: null, colors: '', promoText: '', notes: [], links: [] };
        const files: any[] = [];
        const timeline: any[] = [];
        
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        for (const msg of selectedOrder.chatHistory) {
            if (msg.type === 'file') {
                files.push(msg);
                if (msg.fileType.startsWith('image') && !data.logo) {
                    data.logo = msg.preview;
                }
            } else if (msg.type === 'briefing_text') {
                const lowerText = msg.text.toLowerCase();
                const foundLinks = msg.text.match(urlRegex);
                if (foundLinks) data.links.push(...foundLinks);

                if (lowerText.includes('cores da marca')) data.colors = msg.text;
                else if (lowerText.includes('promoção') || lowerText.includes('combo') || lowerText.includes('oferta')) data.promoText = msg.text;
                else data.notes.push(msg.text);
            } else if (msg.role === 'System' && msg.type === 'status_update') {
                timeline.push(msg);
            }
        }
        return { extractedData: data, extractedFiles: files.reverse(), timelineEvents: timeline.reverse() };
    }, [selectedOrder]);

    const currentStatusInfo = KANBAN_COLUMNS.find(c => c.id === selectedOrder.status);

    return (
        <div className="fixed inset-0 z-[130] bg-slate-950 flex flex-col animate-in slide-in-from-right h-full pb-[80px]">
            <header className="bg-slate-900 p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                <div className="flex items-start gap-4">
                    <button onClick={() => setView('designer_panel')} className="p-2 bg-white/5 rounded-xl text-slate-400 mt-1"><ChevronLeft size={20} /></button>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{selectedOrder.id}</p>
                        <h2 className="font-bold text-xl leading-tight text-white">{selectedOrder.companyName}</h2>
                        <p className="text-xs font-medium text-slate-400">{selectedOrder.lojistaName}</p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{currentStatusInfo?.title}</p>
                    <p className="text-xs font-bold text-slate-300">{selectedOrder.deadline}</p>
                </div>
            </header>

            <div className="bg-slate-900 border-b border-white/5 px-6 pb-4 flex flex-col gap-4">
                 <div className="flex gap-2">
                    <button onClick={() => handleMoveCard(selectedOrder.id, 'backward')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-1 text-sm font-bold text-slate-300"><ArrowLeft size={14}/> Voltar Etapa</button>
                    <button onClick={() => handleMoveCard(selectedOrder.id, 'forward')} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-1 text-sm font-bold text-slate-200">Avançar Etapa <ArrowRight size={14} /></button>
                </div>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setActiveDetailTab('details')} className={`flex-1 text-center py-2 text-xs font-bold rounded-lg ${activeDetailTab === 'details' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Detalhes</button>
                    <button onClick={() => setActiveDetailTab('chat')} className={`flex-1 text-center py-2 text-xs font-bold rounded-lg ${activeDetailTab === 'chat' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Chat</button>
                </div>
            </div>

            {activeDetailTab === 'details' ? (
                <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-10">
                    <section>
                        <h3 className="text-xs font-black uppercase text-slate-500 mb-3 flex items-center gap-2"><Briefcase size={14} /> Dados do lojista</h3>
                        <div className="bg-slate-900 p-5 rounded-2xl border border-white/10 space-y-4">
                            {extractedData.logo && <div className="space-y-2"><p className="text-[9px] font-bold text-slate-400 uppercase">Logo</p><img src={extractedData.logo} className="w-24 rounded-lg border border-white/10" /></div>}
                            {extractedData.colors && <div className="space-y-2"><p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><PaletteIcon size={12}/>Cores da marca</p><p className="text-sm text-slate-300 italic">"{extractedData.colors}"</p></div>}
                            {extractedData.promoText && <div className="space-y-2"><p className="text-[9px] font-bold text-slate-400 uppercase">Texto do banner / promoção</p><p className="text-sm text-slate-300 italic">"{extractedData.promoText}"</p></div>}
                            {extractedData.links.length > 0 && <div className="space-y-2"><p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><LinkIcon size={12}/>Links</p>{extractedData.links.map((link: string, i: number) => <a key={i} href={link} target="_blank" className="text-sm text-blue-400 block truncate hover:underline">{link}</a>)}</div>}
                            {extractedData.notes.length > 0 && <div className="space-y-2"><p className="text-[9px] font-bold text-slate-400 uppercase">Preferências / observações</p>{extractedData.notes.map((note: string, i: number) => <p key={i} className="text-sm text-slate-300 italic">"{note}"</p>)}</div>}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xs font-black uppercase text-slate-500 mb-3 flex items-center gap-2"><Paperclip size={14} /> Arquivos e imagens</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {extractedFiles.map((file, i) => (
                                <div key={i} className="bg-slate-900 rounded-lg border border-white/10 p-2 text-center">
                                    {file.fileType.startsWith('image') ? <img src={file.preview} className="w-full aspect-square object-cover rounded" /> : <div className="w-full aspect-square bg-slate-800 flex items-center justify-center rounded"><FileText /></div>}
                                    <p className="text-[9px] text-slate-500 truncate mt-1">{file.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xs font-black uppercase text-slate-500 mb-3 flex items-center gap-2"><Clock size={14} /> Linha do tempo do pedido</h3>
                        <div className="space-y-2">
                            {timelineEvents.map((event: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs">
                                    <span className="text-slate-600 font-mono">{event.timestamp}</span>
                                    <span className="text-slate-400">{event.text}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            ) : (
                 <main ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-10">
                    {selectedOrder.chatHistory.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex flex-col gap-1.5 max-w-[85%] animate-in slide-in-from-bottom-2 duration-500 ${msg.role === 'Lojista' ? 'items-start' : msg.role === 'System' ? 'items-center w-full max-w-full' : 'items-end ml-auto'}`}>
                           <div className={`p-4 rounded-3xl shadow-sm border ${
                               msg.role === 'Lojista' ? 'bg-slate-800 rounded-tl-none border-slate-700 text-slate-200'
                                : msg.role === 'System' ? 'bg-transparent border-none text-slate-500 text-[10px] italic font-medium'
                                : 'bg-blue-600 text-white rounded-tr-none border-blue-500'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                           </div>
                           {msg.role !== 'System' && <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-2">{msg.timestamp}</span>}
                        </div>
                    ))}
                </main>
            )}
        </div>
    );
  }

  // FIX: Define isCheckoutStep before it's used in the return statement to fix 'Cannot find name' error.
  const isCheckoutStep = selectedMode && selectedPeriods.length > 0 && selectedNeighborhoods.length > 0 && isArtSaved;

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
        
        {/* BLOCO DE DESTAQUE: URGÊNCIA E CONVERSÃO */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="bg-slate-900 border-l-4 border-blue-600 rounded-r-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldAlert className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">
                            Seu concorrente pode estar aqui antes de você
                        </h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                        Todos os dias, milhares de pessoas de Jacarepaguá (450 mil+ moradores) acessam o app em busca de produtos e serviços. 
                        Os espaços de destaque são limitados e essa promoção de lançamento não tem data para acabar.
                    </p>
                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                        <p className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Quem garante o espaço agora sai na frente.
                        </p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                            Quem deixa para depois, fica invisível.
                        </p>
                    </div>
                </div>
            </div>
        </section>

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
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-xs text-slate-500 line-through">R$ {mode.originalPrice.toFixed(2)}</span>
                    <span className="text-sm font-black text-white">por R$ {mode.price.toFixed(2)}</span>
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
                        {p.days === 90 && selectedMode && (
                          <p className="text-[9px] text-emerald-400 font-black uppercase mt-1">3x de R$ {selectedMode.price.toFixed(2)} s/ juros</p>
                        )}
                    </button>
                ))}
            </div>
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

              <div onClick={() => { setArtChoice('pro'); setIsArtSaved(true); setView('sales'); scrollTo(paymentRef, 80); }} className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'pro' ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/5' : 'bg-slate-900 border-white/5'}`}>
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
                    {artChoice === 'pro' && (
                         <div className="mt-6 p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-between animate-in zoom-in duration-300">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-amber-400" />
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Opção PRO Selecionada</span>
                            </div>
                            <button onClick={() => setView('pro_chat')} className="text-[9px] font-black text-white bg-amber-600 px-3 py-1.5 rounded-lg uppercase tracking-widest">Enviar Briefing</button>
                        </div>
                    )}
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
            {/* Espaçador para o botão fixo não cobrir o conteúdo final */}
            <div className="h-32"></div>
        </section>
      </main>

      {!isSuccess && view === 'sales' && (
      <div className="fixed bottom-[80px] left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
        <button 
          onClick={handleFooterClick} 
          disabled={isSubmitting} 
          className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 flex flex-col items-center justify-center transition-all active:scale-[0.98] ${
            selectedMode ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : !isCheckoutStep ? (
              <span className="font-black text-sm uppercase tracking-widest">
                  {!selectedMode ? "Escolha onde aparecer" : 
                   selectedPeriods.length === 0 ? "Escolha o período" :
                   selectedNeighborhoods.length === 0 ? "Escolha os bairros" :
                   "Configure a arte"}
              </span>
          ) : (
              <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">FINALIZAR: {selectedMode.label}</span>
                    <ArrowRight size={14} className="text-white/60" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-white">PAGAR AGORA — R$ {prices.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {prices.isPackage && (
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-0.5">Ou 3x de R$ {prices.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  )}
              </div>
          )}
        </button>
      </div>
      )}
    </div>
  );
};
