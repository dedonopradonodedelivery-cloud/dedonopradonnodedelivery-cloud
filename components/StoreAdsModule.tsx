
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
  ShieldAlert,
  Paintbrush,
  Image as ImageIcon,
  Upload,
  X,
  Send,
  User as UserIcon,
  MessageSquare,
  FileText,
  Building,
  ClipboardList,
  Info,
  AlertTriangle,
  Megaphone,
  Gift,
  Eye,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { StoreBannerEditor } from './StoreBannerEditor';

// --- VALIDATION HELPERS ---
const FORBIDDEN_WORDS = ['palavrão', 'inapropriado', 'violação', 'gratis'];
const CHAR_LIMITS = {
  template_headline: 25,
  template_subheadline: 50,
  editor_title: 40,
  editor_subtitle: 120,
};
const MIN_CONTRAST_RATIO = 4.5;

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1: string, hex2: string): number => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + 0.05) / (darkest + 0.05);
};
// --- END VALIDATION ---


interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
  user: User | null;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

interface EditorData {
  template: string;
  palette: string;
  fontSize: string;
  fontFamily: string;
  title: string;
  subtitle: string;
}

// --- CONFIGURAÇÕES DO CRIADOR RÁPIDO ---
const GOALS = [
    { id: 'promover_oferta', name: 'Promover Oferta', icon: Gift, description: 'Descontos, combos e promoções.' },
    { id: 'anunciar_novidade', name: 'Anunciar Novidade', icon: Sparkles, description: 'Lançamentos de produtos ou serviços.' },
    { id: 'aumentar_visibilidade', name: 'Aumentar Visibilidade', icon: Eye, description: 'Fortalecer o nome da sua marca.' },
];

const BANNER_TEMPLATES = [
  {
    id: 'oferta_relampago',
    name: 'Oferta Relâmpago',
    description: 'Ideal para promoções com tempo limitado.',
    goal: 'promover_oferta',
    fields: [
      { id: 'headline', label: 'Chamada Principal', placeholder: '50% OFF', type: 'text' },
      { id: 'subheadline', label: 'Nome do Produto/Serviço', placeholder: 'Pizza Grande', type: 'text' },
      { id: 'product_image_url', label: 'URL da Imagem do Produto', placeholder: 'https://...', type: 'url' },
    ]
  },
  {
    id: 'lancamento',
    name: 'Lançamento',
    description: 'Anuncie um novo produto ou serviço.',
    goal: 'anunciar_novidade',
    fields: [
      { id: 'headline', label: 'Título do Lançamento', placeholder: 'NOVA COLEÇÃO', type: 'text' },
      { id: 'subheadline', label: 'Descrição Curta', placeholder: 'Outono/Inverno 2024', type: 'text' },
      { id: 'product_image_url', label: 'URL da Imagem do Produto', placeholder: 'https://...', type: 'url' },
    ]
  },
  {
    id: 'institucional',
    name: 'Institucional',
    description: 'Fortaleça sua marca no bairro.',
    goal: 'aumentar_visibilidade',
    fields: [
      { id: 'headline', label: 'Chamada Principal', placeholder: 'Sua Loja de Confiança', type: 'text' },
      { id: 'subheadline', label: 'Slogan ou Descrição', placeholder: 'Qualidade e Tradição na Freguesia', type: 'text' },
      { id: 'logo_url', label: 'URL do seu Logo', placeholder: 'https://...', type: 'url' },
    ]
  }
];

const CTA_OPTIONS = ["Saiba Mais", "Peça Agora", "Ver Cardápio", "Agende seu Horário", "Visite nosso Instagram"];
// --- FIM CONFIGURAÇÕES ---

// --- CONFIGURAÇÕES DO EDITOR DE BANNER PERSONALIZADO ---
const EDITOR_LAYOUTS = [
  { id: 'simple_left', name: 'Simples' },
  { id: 'centered', name: 'Centralizado' },
  { id: 'headline', name: 'Destaque' },
];

const COLOR_PALETTES = [
  { id: 'blue_white', name: 'Azul', bg: '#1E5BFF', text: '#FFFFFF', previewColors: ['#1E5BFF', '#FFFFFF'] },
  { id: 'black_white', name: 'Escuro', bg: '#111827', text: '#FFFFFF', previewColors: ['#111827', '#FFFFFF'] },
  { id: 'white_black', name: 'Claro', bg: '#FFFFFF', text: '#111827', previewColors: ['#FFFFFF', '#111827'] },
  { id: 'yellow_black', name: 'Amarelo', bg: '#FBBF24', text: '#000000', previewColors: ['#FBBF24', '#000000'] },
  { id: 'red_white', name: 'Vermelho', bg: '#DC2626', text: '#FFFFFF', previewColors: ['#DC2626', '#FFFFFF'] },
];

// Componente de Preview do Banner (Template)
const BannerPreview: React.FC<{ templateId: string; data: any; storeName: string; cta?: string | null; }> = ({ templateId, data, storeName, cta }) => {
  const template = BANNER_TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  const renderContent = () => {
    switch (templateId) {
      case 'oferta_relampago':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white p-6 flex items-center justify-between overflow-hidden relative shadow-lg">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <span className="text-sm font-bold bg-yellow-300 text-red-700 px-3 py-1 rounded-full uppercase shadow-sm">{data.headline || 'XX% OFF'}</span>
              <h3 className="text-3xl font-black mt-4 drop-shadow-md max-w-[200px] leading-tight">{data.subheadline || 'Nome do Produto'}</h3>
              {cta ? (
                 <button className="mt-4 bg-white text-red-600 font-bold text-xs px-5 py-2 rounded-full shadow-lg">{cta}</button>
              ) : <p className="text-xs mt-4 opacity-70 font-bold">{storeName}</p> }
            </div>
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
              {data.product_image_url ? <img src={data.product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 flex flex-col justify-end text-left overflow-hidden relative shadow-lg">
             <img src={data.product_image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">{data.headline || 'LANÇAMENTO'}</span>
                <h3 className="text-2xl font-bold mt-1 max-w-[220px] leading-tight">{data.subheadline || 'Descrição do Lançamento'}</h3>
                {cta && <button className="mt-4 bg-cyan-400 text-slate-900 font-bold text-xs px-5 py-2 rounded-full shadow-lg">{cta}</button>}
             </div>
          </div>
        );
      case 'institucional':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 p-8 flex flex-col items-center justify-center text-center relative shadow-lg">
            <div className="w-16 h-16 rounded-full bg-white mb-4 border-4 border-slate-200 shadow-md flex items-center justify-center">
              {data.logo_url ? <img src={data.logo_url} className="w-full h-full object-cover rounded-full" /> : <Building className="w-8 h-8 text-slate-400" />}
            </div>
            <h3 className="text-3xl font-black max-w-sm leading-tight">{data.headline || 'Sua Loja de Confiança'}</h3>
            <p className="text-sm mt-2 opacity-70 max-w-xs">{data.subheadline || 'Qualidade e Tradição no Bairro'}</p>
            {cta && (
              <button className="mt-6 bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105">
                {cta}
              </button>
            )}
          </div>
        );
      default:
        return <div className="text-white">Template não encontrado.</div>;
    }
  };

  return <div className="transition-all duration-300">{renderContent()}</div>;
};

// Componente de Preview do Editor
const BannerEditorPreview: React.FC<{ data: any }> = ({ data }) => {
    const { template, palette, fontSize, fontFamily, title, subtitle } = data;
    
    const selectedPalette = COLOR_PALETTES.find(p => p.id === palette) || COLOR_PALETTES[0];
    const { bg: bgColor, text: textColor } = selectedPalette;
    
    const fontSizes = { small: 'text-2xl', medium: 'text-4xl', large: 'text-5xl' };
    const subFontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
    const headlineFontSize = { small: 'text-4xl', medium: 'text-6xl', large: 'text-7xl' };

    const layoutClasses = {
      simple_left: 'flex flex-col justify-center items-start text-left',
      centered: 'flex flex-col justify-center items-center text-center',
      headline: 'flex flex-col justify-center items-center text-center',
    };

    type LayoutKey = keyof typeof layoutClasses;
    type SizeKey = keyof typeof fontSizes;
    type HeadlineSizeKey = keyof typeof headlineFontSize;
    
    return (
        <div 
            className={`w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg p-8 ${layoutClasses[template as LayoutKey]}`}
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <h3 className={`${template === 'headline' ? headlineFontSize[fontSize as HeadlineSizeKey] : fontSizes[fontSize as SizeKey]} font-black leading-tight line-clamp-2`} style={{ fontFamily }}>
                {title || "Seu Título Aqui"}
            </h3>
            <p className={`${subFontSizes[fontSize as SizeKey]} mt-3 opacity-80 max-w-md line-clamp-3`} style={{ fontFamily }}>
                {subtitle || "Descreva sua oferta em poucas palavras."}
            </p>
        </div>
    );
};

const ValidationErrorsModal: React.FC<{ errors: string[]; onClose: () => void }> = ({ errors, onClose }) => {
  if (errors.length === 0) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-red-500/30 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="font-black text-lg text-white">Publicação Bloqueada</h2>
            <p className="text-sm text-slate-400">Corrija os erros para continuar:</p>
          </div>
        </div>
        <ul className="space-y-3 mb-8">
          {errors.map((err, i) => (
            <li key={i} className="flex items-start gap-3 text-red-400">
              <X size={16} className="shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{err}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};


export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, categoryName, user, viewMode, initialView = 'sales' }) => {
  const isDesigner = viewMode === 'Designer';
  
  const [view, setView] = useState<'sales' | 'creator' | 'editor' | 'pro_checkout' | 'pro_processing' | 'pro_approved' | 'pro_chat' | 'designer_workspace' | 'chat_onboarding'>('sales');
  const [selectedMode, setSelectedMode] = useState<any | null>(null);
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
  
  // States para o Chat Pro
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [proChatStep, setProChatStep] = useState(0);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);

  // Briefing Form State
  const [briefingData, setBriefingData] = useState({
    companyName: user?.user_metadata?.store_name || '',
    headline: '',
    description: '',
    observations: ''
  });

  // Logo Upload State
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Controle de scroll inteligente
  const [highlightPeriod, setHighlightPeriod] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // --- MOCK DISPLAY MODES AND DATA ---
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

  const MOCK_OCCUPANCY: Record<string, Record<string, boolean>> = {
    "Freguesia": { "periodo_1": true },
    "Taquara": { "periodo_2": true },
  };

  const NEIGHBORHOODS = [
    "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
    "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
  ];

  // --- Template Creator State ---
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [selectedCta, setSelectedCta] = useState<string | null>(null);
  const [ctaStepCompleted, setCtaStepCompleted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // --- Custom Editor State ---
  const [editorData, setEditorData] = useState<EditorData>({
    template: 'simple_left',
    palette: 'blue_white',
    fontSize: 'medium',
    fontFamily: 'Poppins',
    title: 'Título do Banner',
    subtitle: 'Subtítulo descritivo aqui',
  });

  useEffect(() => {
    if (isDesigner) {
      setView('designer_workspace');
    } else if (initialView === 'chat') {
      const hasActiveOrder = false; // Mock check
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
  }, [view, isDesigner, proChatStep]);

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
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    
    const basePrice = selectedMode.price;
    const originalBasePrice = selectedMode.originalPrice;
    
    const current = period?.days === 90 ? (basePrice * 3 * hoodsMult) + artExtra : (basePrice * hoodsMult) + artExtra;
    
    return {
      current,
      original: originalBasePrice, // Simplified for mock
      isPackage: period?.days === 90,
      installments: 3,
      monthly: (basePrice * 3 * hoodsMult) / 3 
    };
  }, [selectedMode, selectedPeriods, selectedNeighborhoods, artChoice, dynamicPeriods]);

  const validateBanner = (): string[] => {
    const errors: string[] = [];
    const containsForbidden = (text: string) => FORBIDDEN_WORDS.some(word => text.toLowerCase().includes(word));

    if (view === 'creator') {
        const { headline = '', subheadline = '' } = formData;
        if (!headline.trim()) errors.push('A "Chamada Principal" é obrigatória.');
        if (headline.length > CHAR_LIMITS.template_headline) errors.push(`A "Chamada Principal" deve ter no máximo ${CHAR_LIMITS.template_headline} caracteres.`);
        if (subheadline.length > CHAR_LIMITS.template_subheadline) errors.push(`O "Nome do Produto" deve ter no máximo ${CHAR_LIMITS.template_subheadline} caracteres.`);
        if (containsForbidden(headline) || containsForbidden(subheadline)) errors.push('Seu banner contém palavras não permitidas.');
    } else if (view === 'editor') {
        const { title = '', subtitle = '', palette } = editorData;
        if (!title.trim()) errors.push('O "Título" do banner é obrigatório.');
        if (title.length > CHAR_LIMITS.editor_title) errors.push(`O "Título" deve ter no máximo ${CHAR_LIMITS.editor_title} caracteres.`);
        if (subtitle.length > CHAR_LIMITS.editor_subtitle) errors.push(`O "Subtítulo" deve ter no máximo ${CHAR_LIMITS.editor_subtitle} caracteres.`);
        if (containsForbidden(title) || containsForbidden(subtitle)) errors.push('Seu banner contém palavras não permitidas.');
        
        const selectedPalette = COLOR_PALETTES.find(p => p.id === palette);
        if (selectedPalette) {
            const contrast = getContrastRatio(selectedPalette.bg, selectedPalette.text);
            if (contrast < MIN_CONTRAST_RATIO) {
                errors.push(`O contraste entre o fundo e o texto da paleta "${selectedPalette.name}" é muito baixo. Escolha outra combinação.`);
            }
        }
    }
    return errors;
  };

  const handlePublish = async () => {
    const validation = validateBanner();
    if (validation.length > 0) {
      setValidationErrors(validation);
      return;
    }
    
    setIsSaving(true);

    const isCustom = view === 'editor';
    const config = isCustom ? { type: 'custom_editor', ...editorData } : { type: 'template', ...formData, template_id: selectedTemplate.id, cta: selectedCta };
    const bannerTarget = categoryName ? `category:${categoryName.toLowerCase()}` : 'home';

    try {
        if (!supabase || !user) throw new Error("Usuário ou Supabase não disponível.");

        // 1. Inserir no 'published_banners'
        const { data: bannerData, error: bannerError } = await supabase
            .from('published_banners')
            .insert({
                merchant_id: user.id,
                target: bannerTarget,
                config: config,
                is_active: true,
                expires_at: null,
            })
            .select()
            .single();
        
        if (bannerError) throw bannerError;

        // 2. Log de Auditoria
        const { error: logError } = await supabase.from('banner_audit_log').insert({
            actor_id: user.id,
            actor_email: user.email,
            action: 'created',
            banner_id: bannerData.id,
            details: { 
                shopName: user.user_metadata?.store_name || 'Loja',
                isFirstBanner: true,
                target: bannerTarget,
                config,
            }
        });
        if (logError) console.warn("Log de auditoria falhou:", logError);

        setShowSuccess(true);
        setTimeout(() => {
            onBack();
        }, 2000);

    } catch (e: any) {
        console.error("Erro ao publicar banner:", e);
        alert(`Erro: ${e.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const handleFormDataChange = (fieldId: string, value: string) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [fieldId]: value }));
  };
  
  const handleEditorDataChange = (field: keyof EditorData, value: any) => {
    setEditorData((prev: EditorData) => ({...prev, [field]: value}));
  }

  const handleFooterClick = () => {
    if (!selectedMode) return;
    if (selectedPeriods.length === 0) { showToast("Selecione o período.", "error"); scrollTo(periodRef, 120); return; }
    if (selectedNeighborhoods.length === 0) { showToast("Escolha os bairros.", "error"); scrollTo(neighborhoodRef, 120); return; }
    if (!isArtSaved) { showToast("Configure a arte do banner.", "error"); scrollTo(creativeRef, 120); return; }
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000);
  };

  // --- Handlers for Pro Chat ---
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Implementation for sending message
  };

  const confirmLogoSend = () => {
      // Implementation for confirming logo send
      setIsLogoModalOpen(false);
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Implementation for handling logo upload
  };

  const saveBriefing = () => {
      // Implementation for saving briefing
      setIsBriefingModalOpen(false);
  };

  const handleBackToSelection = () => {
    setSelectedGoal(null);
    setSelectedTemplate(null);
    setFormData({});
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

  // --- Render Logic ---
  const renderStep = () => {
      if (view === 'sales') {
          // Render Sales View content
          return (
            <div className="animate-in fade-in duration-500">
                <div className="text-center mb-10">
                    {/* ... Sales Header ... */}
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-700 shadow-lg">
                        <Megaphone size={32} className="text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
                        Destaque sua Loja
                    </h2>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Crie banners personalizados que aparecerão na Home do app ou em categorias específicas para atrair mais clientes.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <button onClick={() => setView('creator')} className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-blue-500/50 transition-all group">
                        {/* ... Creator Button Content ... */}
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">Criador Rápido</h3>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            Use nossos templates prontos. Ideal para criar ofertas e anúncios em segundos.
                        </p>
                        <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                            Começar agora <ArrowRight size={14} />
                        </span>
                    </button>
                    <button onClick={() => setView('editor')} className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-purple-500/50 transition-all group">
                         {/* ... Editor Button Content ... */}
                         <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
                            <Paintbrush size={24} />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">Editor Personalizado</h3>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            Tenha controle total sobre cores, fontes e layout para um banner 100% original.
                        </p>
                         <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                            Criar do zero <ArrowRight size={14} />
                        </span>
                    </button>
                    {/* ... Professional Service Button ... */}
                </div>
            </div>
          );
      }
      
      if (view === 'creator' || view === 'editor') {
          // ... Logic for Creator and Editor Views (using BANNER_TEMPLATES, etc.) ...
          const isCustom = view === 'editor';
          
          if (isCustom) {
               return (
                <div className="animate-in fade-in duration-500">
                    <div className="mb-8">
                        <h3 className="font-black text-sm uppercase tracking-widest text-purple-400 mb-2">Preview do Banner</h3>
                        <BannerEditorPreview data={editorData} />
                    </div>
                    {/* ... Custom Editor Controls ... */}
                    <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-6">
                        {/* Layout, Palette, Text Inputs */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Layout</label>
                             <div className="grid grid-cols-3 gap-2 mt-2">
                               {EDITOR_LAYOUTS.map(l => (
                                   <button key={l.id} onClick={() => handleEditorDataChange('template', l.id)} className={`py-3 rounded-lg text-xs font-bold ${editorData.template === l.id ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{l.name}</button>
                               ))}
                            </div>
                        </div>
                        {/* ... Other inputs ... */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Texto Principal</label>
                            <input value={editorData.title} onChange={(e) => handleEditorDataChange('title', e.target.value)} className="w-full mt-2 bg-slate-700 p-3 rounded-lg text-white" />
                        </div>
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Subtítulo</label>
                            <input value={editorData.subtitle} onChange={(e) => handleEditorDataChange('subtitle', e.target.value)} className="w-full mt-2 bg-slate-700 p-3 rounded-lg text-white" />
                        </div>
                    </div>
                </div>
               );
          } else {
              // Creator Logic (Goals -> Templates -> Form)
              if (!selectedGoal) {
                   return (
                    <div className="animate-in slide-in-from-right duration-500">
                      <h3 className="font-black text-sm uppercase tracking-widest text-blue-400 mb-4">Passo 1: Qual seu objetivo?</h3>
                      <div className="space-y-4">
                        {GOALS.map(goal => (
                          <button key={goal.id} onClick={() => setSelectedGoal(goal.id)} className="w-full bg-slate-800 p-6 rounded-2xl border border-white/10 text-left hover:border-blue-500/50 transition-all flex items-center gap-5">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20"><goal.icon size={24} /></div>
                            <div>
                              <h4 className="font-bold text-white text-base">{goal.name}</h4>
                              <p className="text-xs text-slate-400">{goal.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
              }
              if (selectedGoal && !selectedTemplate) {
                  const availableTemplates = BANNER_TEMPLATES.filter(t => t.goal === selectedGoal);
                  return (
                    <div className="animate-in slide-in-from-right duration-500">
                      <button onClick={handleBackToSelection} className="flex items-center gap-2 text-xs text-slate-400 mb-4"><ChevronLeft size={16} /> Voltar</button>
                      <h3 className="font-black text-sm uppercase tracking-widest text-blue-400 mb-4">Passo 2: Escolha um modelo</h3>
                      <div className="space-y-4">
                        {availableTemplates.map(template => (
                          <button key={template.id} onClick={() => setSelectedTemplate(template)} className="w-full bg-slate-800 p-5 rounded-2xl border border-white/10 text-left hover:border-blue-500/50 transition-all">
                            <h4 className="font-bold text-white text-base">{template.name}</h4>
                            <p className="text-xs text-slate-400">{template.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
              }
              if (selectedTemplate) {
                  // Form
                  return (
                    <div className="animate-in slide-in-from-right duration-500">
                        <button onClick={handleBackToSelection} className="flex items-center gap-2 text-xs text-slate-400 mb-4"><ChevronLeft size={16} /> Voltar</button>
                        <div className="mb-8">
                            <h3 className="font-black text-sm uppercase tracking-widest text-blue-400 mb-4">Passo 3: Preencha e veja como fica</h3>
                            <BannerPreview templateId={selectedTemplate.id} data={formData} storeName={user?.user_metadata?.store_name || "Sua Loja"} cta={selectedCta} />
                        </div>
                        <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-5">
                            {selectedTemplate.fields.map((field: any) => (
                                <div key={field.id}>
                                    <label className="text-xs font-bold text-slate-400 uppercase">{field.label}</label>
                                    <input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                                        className="w-full mt-2 bg-slate-700 p-3 rounded-lg text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                  );
              }
          }
      }
      return null;
  };

  if (view === 'chat_onboarding') {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            {/* ... Chat Onboarding UI ... */}
             <header className="absolute top-0 left-0 right-0 p-6 flex">
                <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
            </header>
            
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-blue-500/20 shadow-lg">
                <MessageCircle size={40} className="text-blue-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4 leading-tight">👋 Olá, {user?.user_metadata?.store_name}!</h1>
             <button 
              onClick={() => setView('sales')}
              className="w-full max-w-sm py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              Criar Novo Banner <ArrowRight size={18} />
            </button>
        </div>
      );
  }

  // --- Main Render ---
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
         {renderStep()}
      </main>

      {view !== 'sales' && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent max-w-md mx-auto z-30">
            <button 
                onClick={handlePublish}
                disabled={isSaving || (view === 'creator' && !selectedTemplate)}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Publicar Banner'}
            </button>
          </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-slate-800 p-10 rounded-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 mb-6 border-2 border-green-500/20">
                    <CheckCircle2 size={32} />
                </div>
                <h2 className="font-black text-xl text-white">Publicado!</h2>
                <p className="text-sm text-slate-400 mt-2">Seu banner já está ativo no aplicativo.</p>
           </div>
        </div>
      )}
      
      <ValidationErrorsModal errors={validationErrors} onClose={() => setValidationErrors([])} />
    </div>
  );
};
