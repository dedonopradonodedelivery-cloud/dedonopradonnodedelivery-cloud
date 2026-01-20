import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  Rocket, 
  CheckCircle2, 
  Crown, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Save,
  Loader2,
  Image as ImageIcon,
  Check,
  Target,
  Palette,
  LayoutTemplate,
  Type,
  Paintbrush,
  AlertTriangle,
  X,
  Store as StoreIcon,
  Megaphone,
  Gift,
  Eye
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { BannerPlan } from '../types';

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
  plan: BannerPlan | null;
  onFinalize: (draft: any) => void;
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
    
    return (
        <div 
            className={`w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg p-8 ${layoutClasses[template]}`}
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <h3 className={`${template === 'headline' ? headlineFontSize[fontSize] : fontSizes[fontSize]} font-black leading-tight line-clamp-2`} style={{ fontFamily }}>
                {title || "Seu Título Aqui"}
            </h3>
            <p className={`${subFontSizes[fontSize]} mt-3 opacity-80 max-w-md line-clamp-3`} style={{ fontFamily }}>
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


export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, categoryName, user, plan, onFinalize }) => {
  const [view, setView] = useState<'sales' | 'creator' | 'editor'>('sales');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // --- Template Creator State ---
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [selectedCta, setSelectedCta] = useState<string | null>(null);
  const [ctaStepCompleted, setCtaStepCompleted] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // --- Custom Editor State ---
  const [editorData, setEditorData] = useState({
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
  
  useEffect(() => {
    if (!plan) {
        onBack();
    }
  }, [plan, onBack]);

  const validateBanner = (): string[] => {
    const errors: string[] = [];
    const containsForbidden = (text: string) => FORBIDDEN_WORDS.some(word => text.toLowerCase().includes(word));

    if (view === 'creator') {
        if (!selectedTemplate) { errors.push("Nenhum modelo selecionado."); return errors; }
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

    const draft = view === 'editor' 
      ? { type: 'custom_editor', ...editorData } 
      : { type: 'template', ...formData, template_id: selectedTemplate.id, cta: selectedCta };

    onFinalize(draft);
    
    // Simulating save time before navigating
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleFormDataChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };
  
  const handleEditorDataChange = (field: keyof typeof editorData, value: any) => {
    setEditorData(prev => ({...prev, [field]: value}));
  }

  // ---- RENDER LOGIC ----
  const renderStep = (): React.JSX.Element | null => {
    if (view === 'sales') {
      return (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-700 shadow-lg">
                <Megaphone size={32} className="text-amber-400" />
            </div>
            <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
                Crie seu Anúncio
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Escolha uma das opções abaixo para criar seu banner e atrair mais clientes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={() => onNavigate('banner_upload')}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-gray-500/50 transition-all group"
            >
                <div className="w-12 h-12 bg-gray-500/10 rounded-2xl flex items-center justify-center text-gray-400 mb-4 border border-gray-500/20">
                    <ImageIcon size={24} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Já tenho minha arte</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Faça o upload do seu banner pronto (JPG, PNG) para aprovação.
                </p>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Fazer upload <ArrowRight size={14} />
                </span>
            </button>
            <button
              onClick={() => setView('creator')}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-blue-500/50 transition-all group"
            >
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                    <Sparkles size={24} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Criador Rápido (Grátis)</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Use nossos templates prontos. Ideal para criar ofertas em segundos.
                </p>
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Começar agora <ArrowRight size={14} />
                </span>
            </button>
            <button
              onClick={() => onNavigate('banner_production')}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 text-left hover:border-emerald-500/50 transition-all group relative"
            >
              <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                  R$ 59,90
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                  <Rocket size={24} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Banner Profissional</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Nossa equipe cria um banner profissional para sua loja.
              </p>
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
        setView('sales');
      };

      if (isCustom) {
        // EDITOR PERSONALIZADO
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
        // CRIADOR RÁPIDO (TEMPLATE)
        if (!selectedGoal) {
          // STEP 1: CHOOSE GOAL
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
          // STEP 2: CHOOSE TEMPLATE
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
          // STEP 3: FILL FORM & PREVIEW
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
  
  const isCreationReady = useMemo(() => {
    if (view === 'editor') return !!editorData.title;
    if (view === 'creator') return !!(selectedTemplate && formData.headline);
    return false;
  }, [view, editorData, formData, selectedTemplate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={view === 'sales' ? onBack : () => setView('sales')} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="font-bold text-lg leading-none">Criar Anúncio</h1>
                <p className="text-xs text-slate-500">{categoryName ? `Para: ${categoryName}` : 'Para: Home'}</p>
            </div>
        </div>
        <button 
            onClick={onBack}
            className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
        >
            <X size={20} />
        </button>
      </div>
      
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-48">
        {renderStep()}
      </main>

      {plan && view !== 'sales' && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent max-w-md mx-auto z-30">
            <div className="flex justify-between items-center mb-4 text-white bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div>
                  <p className="text-xs text-slate-400">Plano Selecionado</p>
                  <p className="font-bold text-sm">{plan.label}</p>
              </div>
              <p className="text-xl font-black">{`R$ ${(plan.priceCents / 100).toFixed(2).replace('.', ',')}`}</p>
            </div>
            <button 
                onClick={handlePublish}
                disabled={isSaving || !isCreationReady}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Finalizar e Pagar'}
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