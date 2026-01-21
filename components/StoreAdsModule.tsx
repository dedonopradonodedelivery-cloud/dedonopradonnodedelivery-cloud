import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Save,
  Loader2,
  Image as ImageIcon,
  Check,
  X,
  Store as StoreIcon,
  Megaphone,
  Gift,
  Eye,
  Crown,
  Target,
  Clock,
  MapPin,
  Palette,
  LayoutTemplate,
  // Added missing AlertTriangle and TrendingUp icons to fix "Cannot find name" errors.
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

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

// Added missing EditorData interface to fix multiple "Cannot find name 'EditorData'" errors.
interface EditorData {
  template: string;
  palette: string;
  fontSize: string;
  fontFamily: string;
  title: string;
  subtitle: string;
}

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
  user: User | null;
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

const CTA_OPTIONS = ["Saiba Mais", "Peça Agora", "Ver Cardápio", "Agende seu Horário", "Visite nosso Instagram"];

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
              {data.logo_url ? <img src={data.logo_url} className="w-full h-full object-cover rounded-full" /> : <StoreIcon className="w-8 h-8 text-slate-400" />}
            </div>
            <h3 className="text-3xl font-black max-w-sm leading-tight">{data.headline || 'Sua Loja de Confiança'}</h3>
            <p className="text-sm mt-2 opacity-70 max-w-xs">{data.subheadline || 'Qualidade e Tradicão no Bairro'}</p>
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
    
    return (
        <div 
            className={`w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg p-8 ${layoutClasses[template as keyof typeof layoutClasses] || 'flex flex-col justify-center'}`}
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <h3 className={`${template === 'headline' ? headlineFontSize[fontSize as keyof typeof headlineFontSize] : fontSizes[fontSize as keyof typeof fontSizes]} font-black leading-tight line-clamp-2`} style={{ fontFamily: fontFamily }}>
                {title || "Seu Título Aqui"}
            </h3>
            <p className={`${subFontSizes[fontSize as keyof typeof subFontSizes]} mt-3 opacity-80 max-w-md line-clamp-3`} style={{ fontFamily: fontFamily }}>
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


export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, categoryName, user }) => {
  const [view, setView] = useState<'sales' | 'config' | 'design' | 'creator' | 'editor'>('sales');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // --- Plan Config State ---
  const [planConfig, setPlanConfig] = useState({
    target: 'home', // 'home' | 'category' | 'all'
    neighborhood: 'current', // 'current' | 'all'
    duration: '30', // '30' | '90'
  });

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

  // --- Shared State ---
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Preço dinâmico simplificado
  const calculatedPrice = useMemo(() => {
    let base = planConfig.target === 'home' ? 9.90 : 5.90;
    if (planConfig.target === 'all') base = 14.90;
    
    let days = parseInt(planConfig.duration);
    let total = base * days;
    
    if (planConfig.duration === '90') total = total * 0.8; // 20% desconto
    
    return total;
  }, [planConfig]);

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
        const { data: bannerData, error: bannerError } = await supabase.from('published_banners').insert({
                merchant_id: user.id,
                target: bannerTarget,
                config: config,
                is_active: true,
                expires_at: null,
            }).select().single();
        if (bannerError) throw bannerError;
        await supabase.from('banner_audit_log').insert({
            actor_id: user.id,
            actor_email: user.email,
            action: 'created',
            banner_id: bannerData.id,
            details: { shopName: user.user_metadata?.store_name || 'Loja', target: bannerTarget, config }
        });
        setShowSuccess(true);
        setTimeout(() => onBack(), 2000);
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

  // ---- RENDER LOGIC ----
  const renderStep = (): React.JSX.Element | null => {
    
    // 1. LANDING PAGE COMERCIAL
    if (view === 'sales') {
      return (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 border-4 border-white/10">
                <Crown size={40} className="text-white fill-white" />
            </div>
            <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
                Destaque sua marca para o bairro
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Apareça no topo do super-app Localizei JPA e seja visto por milhares de novos clientes na sua região todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                      <Target size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-white text-sm">Público Qualificado</h4>
                      <p className="text-xs text-slate-500">Exibição exclusiva para quem mora ou está em Jacarepaguá.</p>
                  </div>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                      <TrendingUp size={24} />
                  </div>
                  <div>
                      <h4 className="font-bold text-white text-sm">Mais Cliques, Mais Vendas</h4>
                      <p className="text-xs text-slate-500">Banners premium geram 4x mais visualizações que listagens comuns.</p>
                  </div>
              </div>
          </div>

          <button 
            onClick={() => setView('config')}
            className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            VER PLANOS E PREÇOS
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      );
    }

    // 2. CONFIGURAÇÃO DO PLANO (ONDE E QUANTO TEMPO)
    if (view === 'config') {
        return (
            <div className="animate-in slide-in-from-right duration-500 space-y-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">1. Onde deseja aparecer?</h3>
                    <div className="grid gap-3">
                        {[
                            { id: 'home', label: 'Home do Super-App', desc: 'Maior visibilidade possível', price: 'R$ 9,90/dia' },
                            { id: 'category', label: 'Categorias Específicas', desc: 'Público segmentado por interesse', price: 'R$ 5,90/dia' },
                            { id: 'all', label: 'Combo Total', desc: 'Home + Todas as Categorias', price: 'R$ 14,90/dia' },
                        ].map(opt => (
                            <button 
                                key={opt.id}
                                onClick={() => setPlanConfig({...planConfig, target: opt.id})}
                                className={`p-5 rounded-3xl border-2 text-left transition-all ${planConfig.target === opt.id ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white">{opt.label}</h4>
                                    <span className="text-[10px] font-black text-blue-400 uppercase">{opt.price}</span>
                                </div>
                                <p className="text-xs text-slate-500">{opt.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">2. Duração do Destaque</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: '30', label: '30 Dias', desc: 'Plano Mensal' },
                            { id: '90', label: '90 Dias', desc: 'Combo - 20% OFF' },
                        ].map(opt => (
                            <button 
                                key={opt.id}
                                onClick={() => setPlanConfig({...planConfig, duration: opt.id})}
                                className={`p-5 rounded-3xl border-2 text-center transition-all ${planConfig.duration === opt.id ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                            >
                                <h4 className="font-bold text-white mb-1">{opt.label}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">{opt.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total do Investimento</p>
                        <p className="text-3xl font-black text-white">{formatBRL(calculatedPrice * 100)}</p>
                    </div>
                    <button 
                        onClick={() => setView('design')}
                        className="bg-[#1E5BFF] text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                    >
                        <ArrowRight size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>
        );
    }

    // 3. ESCOLHA DO DESIGN (CRIADOR OU EDITOR)
    if (view === 'design') {
        return (
            <div className="animate-in slide-in-from-right duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Como deseja criar seu banner?</h2>
                    <p className="text-slate-500 text-sm">Escolha a melhor opção para sua loja.</p>
                </div>

                <div className="grid gap-4">
                    <button onClick={() => setView('creator')} className="p-6 bg-slate-800 rounded-3xl border border-white/10 text-left hover:border-blue-500/50 transition-all flex items-center gap-5 group">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <LayoutTemplate size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Criador Rápido</h4>
                            <p className="text-xs text-slate-500">Use templates prontos e otimizados.</p>
                        </div>
                    </button>

                    <button onClick={() => setView('editor')} className="p-6 bg-slate-800 rounded-3xl border border-white/10 text-left hover:border-purple-500/50 transition-all flex items-center gap-5 group">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <Palette size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">Editor do Zero</h4>
                            <p className="text-xs text-slate-500">Personalize cores, fontes e textos.</p>
                        </div>
                    </button>

                    <button className="p-6 bg-white rounded-3xl border border-white text-left active:scale-[0.98] transition-all flex items-center gap-5 group">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Rocket size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg">Banner Profissional</h4>
                            <p className="text-xs text-slate-500">Nossa equipe cria para você (+ R$ 59,90).</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    }
    
    // 4. CRIADOR RÁPIDO (TEMPLATE)
    if (view === 'creator') {
        if (!selectedGoal) {
          return (
            <div className="animate-in slide-in-from-right duration-500">
              <h3 className="font-black text-sm uppercase tracking-widest text-blue-400 mb-4">Qual seu objetivo com este banner?</h3>
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
              <button onClick={() => setSelectedGoal(null)} className="flex items-center gap-2 text-xs text-slate-400 mb-4"><ChevronLeft size={16} /> Voltar</button>
              <h3 className="font-black text-sm uppercase tracking-widest text-blue-400 mb-4">Escolha um modelo visual</h3>
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
            <div className="animate-in slide-in-from-right duration-500">
                <button onClick={() => setSelectedTemplate(null)} className="flex items-center gap-2 text-xs text-slate-400 mb-4"><ChevronLeft size={16} /> Voltar</button>
                <div className="mb-8">
                    <h3 className="font-black text-sm uppercase tracking-widest text-blue-400 mb-4">Preencha e visualize</h3>
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
                            <label className="text-xs font-bold text-slate-400 uppercase">Botão de Ação (CTA)</label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {CTA_OPTIONS.map(cta => (
                                    <button key={cta} onClick={() => setSelectedCta(cta)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${selectedCta === cta ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{cta}</button>
                                ))}
                                <button onClick={() => setCtaStepCompleted(true)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-600 text-slate-300">Pular</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
          );
        }
    }

    // 5. EDITOR PERSONALIZADO
    if (view === 'editor') {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                    <h3 className="font-black text-sm uppercase tracking-widest text-purple-400 mb-2">Visualização em tempo real</h3>
                    <BannerEditorPreview data={editorData} />
                </div>
                <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Layout base</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                           {EDITOR_LAYOUTS.map(l => (
                               <button key={l.id} onClick={() => handleEditorDataChange('template', l.id)} className={`py-3 rounded-lg text-xs font-bold ${editorData.template === l.id ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300'}`}>{l.name}</button>
                           ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cores</label>
                        <div className="flex gap-3 mt-2">
                           {COLOR_PALETTES.map(p => (
                               <button key={p.id} onClick={() => handleEditorDataChange('palette', p.id)} className={`w-10 h-10 rounded-full flex items-center justify-center ${editorData.palette === p.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''}`}>
                                   <div className="w-full h-full rounded-full overflow-hidden flex">
                                       <div style={{ backgroundColor: p.previewColors[0] }} className="w-1/2 h-full"></div>
                                       <div style={{ backgroundColor: p.previewColors[1] }} className="w-1/2 h-full"></div>
                                   </div>
                               </button>
                           ))}
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Texto Principal</label>
                        <input value={editorData.title} onChange={(e) => handleEditorDataChange('title', e.target.value)} className="w-full mt-2 bg-slate-700 p-4 rounded-xl text-white font-bold outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtítulo</label>
                        <input value={editorData.subtitle} onChange={(e) => handleEditorDataChange('subtitle', e.target.value)} className="w-full mt-2 bg-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
  };

  const formatBRL = (cents: number) => 
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => {
                    if (view === 'sales') onBack();
                    else if (view === 'config') setView('sales');
                    else if (view === 'design') setView('config');
                    else setView('design');
                }} 
                className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
            >
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="font-bold text-lg leading-none">Banners Premium</h1>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Status: Configuração</p>
            </div>
        </div>
        <button 
            onClick={onBack}
            className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
        >
            <X size={20} />
        </button>
      </div>
      
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-40">
        {renderStep()}
      </main>

      {/* FOOTER ACTIONS - Dinâmico por Step */}
      {(view === 'creator' || view === 'editor') && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent max-w-md mx-auto z-30">
            <button 
                onClick={handlePublish}
                disabled={isSaving || (view === 'creator' && !selectedTemplate)}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirmar e Publicar'}
            </button>
          </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-slate-800 p-10 rounded-[3rem] border border-white/10 flex flex-col items-center text-center shadow-2xl">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 mb-6 border-2 border-emerald-500/20">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="font-black text-2xl text-white uppercase tracking-tighter">Publicado com Sucesso!</h2>
                <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Seu banner premium já está ativo e visível no bairro.</p>
           </div>
        </div>
      )}
      
      <ValidationErrorsModal errors={validationErrors} onClose={() => setValidationErrors([])} />
    </div>
  );
};