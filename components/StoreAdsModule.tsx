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
  Gift,
  Eye,
  Megaphone,
  Store as StoreIcon,
  Utensils,
  Shirt,
  ShoppingCart
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

const CTA_OPTIONS = ["Saiba Mais", "Peça Agora", "Ver Encarte", "Agende seu Horário", "Visite nosso Instagram"];

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

const AdsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const ads = useMemo(() => [
    {
      id: 'promo',
      title: 'ANUNCIE',
      subtitle: 'Preço promocional de inauguração',
      price: 'a partir de R$ 29,90',
      bgColor: '#1E5BFF',
      textColor: '#FFFFFF',
      icon: <Megaphone className="w-12 h-12 text-amber-400" />
    },
    {
      id: 'model1',
      title: 'Hambúrguer Gourmet',
      subtitle: 'O melhor blend da Taquara com fritas',
      cta: 'Peça Agora',
      bgColor: '#DC2626',
      textColor: '#FFFFFF',
      icon: <Utensils className="w-12 h-12 text-white" />
    },
    {
      id: 'model2',
      title: 'Moda Feminina',
      subtitle: 'Looks incríveis para o seu final de semana',
      cta: 'Saiba mais',
      bgColor: '#9333EA',
      textColor: '#FFFFFF',
      icon: <Shirt className="w-12 h-12 text-white" />
    },
    {
      id: 'model3',
      title: 'Supermercado Local',
      subtitle: 'Ofertas diárias em hortifruti e açougue',
      cta: 'Ver Encarte',
      bgColor: '#10B981',
      textColor: '#FFFFFF',
      icon: <ShoppingCart className="w-12 h-12 text-white" />
    }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="w-full mb-10 px-4">
      <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
        {ads.map((ad, idx) => (
          <div 
            key={ad.id}
            className={`absolute inset-0 w-full h-full p-8 flex flex-col justify-center transition-all duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
            }`}
            style={{ backgroundColor: ad.bgColor }}
          >
            <div className="flex items-center gap-6">
              <div className="shrink-0 p-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10">
                {ad.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-white leading-none tracking-tight mb-2 uppercase">{ad.title}</h2>
                <p className="text-sm font-medium text-white/80 leading-snug">{ad.subtitle}</p>
                {ad.price && (
                   <p className="mt-3 text-lg font-black text-amber-400">{ad.price}</p>
                )}
                {ad.cta && (
                  <div className="mt-4 w-fit px-4 py-1.5 bg-white/20 border border-white/20 rounded-full">
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">{ad.cta}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {ads.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const BannerPreview = ({ templateId, data, storeName, cta }: { templateId: string; data: any; storeName: string; cta?: string | null; }) => {
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
              {data.logo_url ? <img src={data.logo_url} className="w-full h-full object-cover rounded-full" /> : <StoreIcon className="w-8 h-8 text-slate-400" />}
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

const BannerEditorPreview = ({ data }: { data: any }) => {
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

// FIX: Added ValidationErrorsModal component to fix "Cannot find name 'ValidationErrorsModal'" error.
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // --- Template Creator State ---
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [selectedCta, setSelectedCta] = useState<string | null>(null);
  const [ctaStepCompleted, setCtaStepCompleted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // --- Custom Editor State ---
  const [editorData, setEditorData] = useState<EditorData>({
    template: 'simple_left',
    palette: 'blue_white',
    fontSize: 'medium',
    fontFamily: 'Poppins',
    title: 'Título do Banner',
    subtitle: 'Subtítulo descritivo aqui',
  });
  
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

  useEffect(() => {
    if (isDesigner) {
      setView('designer_workspace');
    } else if (initialView === 'chat') {
      const hasActiveOrder = false; 
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

  const handlePayPro = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
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
    
    setIsSubmitting(true);

    const isCustom = view === 'editor';
    const config = isCustom ? { type: 'custom_editor', ...editorData } : { type: 'template', ...formData, template_id: selectedTemplate.id, cta: selectedCta };
    const bannerTarget = categoryName ? `category:${categoryName.toLowerCase()}` : 'home';

    try {
        if (!supabase || !user) throw new Error("Usuário ou Supabase não disponível.");

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

        const { count } = await supabase.from('published_banners').select('*', { count: 'exact', head: true }).eq('merchant_id', user.id);
        if (count === 1) {
            await supabase.functions.invoke('send-email-admin-banner', {
                body: {
                    shopName: user.user_metadata?.store_name || user.email,
                    userId: user.id,
                    bannerType: isCustom ? 'Editor Personalizado' : 'Template Rápido',
                    bannerConfig: config
                }
            });
        }
        
        setIsSuccess(true);
        setTimeout(() => {
            onBack();
        }, 2000);

    } catch (e: any) {
        console.error("Erro ao publicar banner:", e);
        alert(`Erro: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFormDataChange = (fieldId: string, value: string) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [fieldId]: value }));
  };
  
  const handleEditorDataChange = (field: keyof EditorData, value: any) => {
    setEditorData((prev: EditorData) => ({...prev, [field]: value}));
  }

  const renderStep = (): React.JSX.Element | null => {
    if (view === 'sales') {
      return (
        <div className="animate-in fade-in duration-500">
          <AdsCarousel />
          
          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={() => setView('creator')}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-blue-500/50 transition-all group"
            >
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
            <button
              onClick={() => setView('editor')}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-purple-500/50 transition-all group"
            >
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
            <button
              onClick={() => alert('Solicitação de arte enviada! Entraremos em contato em breve.')}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-emerald-500/50 transition-all group relative"
            >
              <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Oferta especial
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                  <Rocket size={24} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">👉 Banner criado por nossos designers</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Nossa equipe cria um banner profissional para sua loja, pronto para anunciar no app.
              </p>
              
              <ul className="text-xs text-slate-400 space-y-2 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/>Até 3 alterações inclusas</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/>Arte profissional feita por designers</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400"/>Banner otimizado para o app</li>
              </ul>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-slate-500 line-through">R$ 129,90</span>
                <span className="text-3xl font-black text-white">R$ 59,90</span>
                <span className="text-slate-400 text-xs font-medium">por arte</span>
              </div>

              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Solicitar agora <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </div>
      );
    }
    
    if (view === 'creator' || view === 'editor') {
      const isCustom = view === 'editor';

      const handleBackToSelection = () => {
        setSelectedGoal(null);
        setSelectedTemplate(null);
        setFormData({});
      };

      if (isCustom) {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                    <h3 className="font-black text-sm uppercase tracking-widest text-purple-400 mb-2">Preview do Banner</h3>
                    <BannerEditorPreview data={editorData} />
                </div>
                <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-6">
                    <h3 className="font-bold">Editor</h3>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Layout</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                           {EDITOR_LAYOUTS.map(l => (
                               <button key={l.id} onClick={() => handleEditorDataChange('template', l.id)} className={`py-3 rounded-lg text-xs font-bold ${editorData.template === l.id ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{l.name}</button>
                           ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Paleta de Cores</label>
                        <div className="flex gap-3 mt-2">
                           {COLOR_PALETTES.map(p => (
                               <button key={p.id} onClick={() => handleEditorDataChange('palette', p.id)} className={`w-8 h-8 rounded-full flex items-center justify-center ${editorData.palette === p.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''}`}>
                                   <div className="w-full h-full rounded-full overflow-hidden flex">
                                       <div style={{ backgroundColor: p.previewColors[0] }} className="w-1/2 h-full"></div>
                                       <div style={{ backgroundColor: p.previewColors[1] }} className="w-1/2 h-full"></div>
                                   </div>
                                </button>
                           ))}
                        </div>
                    </div>
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
        if (!selectedGoal) {
          return (
            <div className="animate-in slide-in-from-right duration-300">
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
            <div className="animate-in slide-in-from-right duration-300">
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
          return (
            <div className="animate-in slide-in-from-right duration-300">
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
                    {!ctaStepCompleted ? (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Botão (Opcional)</label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {CTA_OPTIONS.map(cta => (
                                    <button key={cta} onClick={() => setSelectedCta(cta)} className={`text-xs px-3 py-1.5 rounded-lg ${selectedCta === cta ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{cta}</button>
                                ))}
                                <button onClick={() => setCtaStepCompleted(true)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-600 text-slate-300">Pular</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
          );
        }
      }
    }
    return null;
  };

  // FIX: Added missing isCheckoutStep constant to fix "Cannot find name 'isCheckoutStep'" error.
  const isCheckoutStep = !!(selectedMode && selectedPeriods.length > 0 && selectedNeighborhoods.length > 0 && isArtSaved);

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

      {!isSuccess && (view === 'sales' || view === 'pro_checkout') && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
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

      {isSuccess && (
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
      
      {/* FIX: Added ValidationErrorsModal usage with state handler to fix the error. */}
      <ValidationErrorsModal errors={validationErrors} onClose={() => setValidationErrors([])} />
    </div>
  );
};