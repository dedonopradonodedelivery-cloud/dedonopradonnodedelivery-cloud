import React, { useState, useMemo } from 'react';
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
  Paintbrush
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
}

const AVAILABLE_NEIGHBORHOODS = [
  "Freguesia", "Taquara", "Anil", "Pechincha", "Cidade de Deus", 
  "Curicica", "Parque Olímpico", "Gardênia", "Tanque"
];

// --- TEMPLATES DO SISTEMA DE BANNERS AUTOMÁTICOS ---
const BANNER_TEMPLATES = [
  {
    id: 'oferta_relampago',
    name: 'Oferta Relâmpago',
    description: 'Ideal para promoções com tempo limitado.',
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
    fields: [
      { id: 'headline', label: 'Título do Lançamento', placeholder: 'NOVA COLEÇÃO', type: 'text' },
      { id: 'subheadline', label: 'Descrição Curta', placeholder: 'Outono/Inverno 2024', type: 'text' },
      { id: 'product_image_url', label: 'URL da Imagem do Produto', placeholder: 'https://...', type: 'url' },
    ]
  },
];

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
const BannerPreview: React.FC<{ templateId: string; data: any; storeName: string }> = ({ templateId, data, storeName }) => {
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
              <p className="text-xs mt-4 opacity-70 font-bold">{storeName}</p>
            </div>
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
              {data.product_image_url ? <img src={data.product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 flex items-end justify-between overflow-hidden relative shadow-lg">
             <img src={data.product_image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">{data.headline || 'LANÇAMENTO'}</span>
                <h3 className="text-2xl font-bold mt-1 max-w-[220px] leading-tight">{data.subheadline || 'Descrição do Lançamento'}</h3>
             </div>
             <div className="relative z-10 self-start p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                <Sparkles className="w-5 h-5 text-cyan-300" />
             </div>
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


export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, categoryName }) => {
  const [view, setView] = useState<'sales' | 'creator' | 'editor'>('sales');

  // --- Template Creator State ---
  const [selectedTemplate, setSelectedTemplate] = useState(BANNER_TEMPLATES[0]);
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

  const handleSaveBanner = () => {
    setIsSaving(true);
    
    let bannerDataToSave;

    if (view === 'creator') {
      // Para o criador de templates, salvamos o ID do template e os dados do formulário.
      bannerDataToSave = {
        type: 'template',
        template_id: selectedTemplate.id,
        ...formData,
      };
    } else { // 'editor'
      // Para o editor customizado, salvamos a configuração de estilo completa.
      const selectedPalette = COLOR_PALETTES.find(p => p.id === editorData.palette) || COLOR_PALETTES[0];
      bannerDataToSave = {
        type: 'custom_editor',
        template_id: editorData.template,
        background_color: selectedPalette.bg,
        text_color: selectedPalette.text,
        font_size: editorData.fontSize,
        font_family: editorData.fontFamily,
        title: editorData.title,
        subtitle: editorData.subtitle,
      };
    }

    // Salvando o JSON no localStorage
    localStorage.setItem('user_banner_config', JSON.stringify(bannerDataToSave));

    setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setView('sales');
        }, 3000);
    }, 1500);
  };
  
  // RENDERIZADOR DO CRIADOR DE BANNERS (TEMPLATES)
  if (view === 'creator') {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col">
        <header className="sticky top-0 z-20 bg-[#111827]/80 backdrop-blur-md border-b border-white/10 px-5 h-16 flex items-center gap-4">
          <button onClick={() => setView('sales')} className="p-2 -ml-2 rounded-full hover:bg-white/5"><ChevronLeft className="w-6 h-6 text-slate-300" /></button>
          <h1 className="font-bold text-lg text-white">Criador Rápido</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Passo 1: Escolha um modelo</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                    {BANNER_TEMPLATES.map(template => (
                        <button key={template.id} onClick={() => setSelectedTemplate(template)} className={`flex-shrink-0 w-48 text-left p-4 rounded-2xl border-2 transition-all ${selectedTemplate.id === template.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}>
                            <h3 className="font-bold text-sm text-white">{template.name}</h3>
                            <p className="text-xs text-slate-400 mt-1">{template.description}</p>
                        </button>
                    ))}
                </div>
            </section>
            <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Passo 2: Personalize</h2>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
                    {selectedTemplate.fields.map(field => (
                        <div key={field.id}>
                            <label className="text-xs font-bold text-slate-400 mb-1.5 block">{field.label}</label>
                            <input type={field.type} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={(e) => setFormData({...formData, [field.id]: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    ))}
                </div>
            </section>
            <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Preview em Tempo Real</h2>
                <BannerPreview templateId={selectedTemplate.id} data={formData} storeName="Sua Loja" />
            </section>
            <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Passo 3: Publicar</h2>
                <button onClick={handleSaveBanner} disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Publicando...' : 'Salvar e Publicar Banner'}
                </button>
            </section>
        </main>
      </div>
    );
  }

  // RENDERIZADOR DO EDITOR DE BANNERS (CUSTOMIZADO)
  if (view === 'editor') {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col">
        <header className="sticky top-0 z-20 bg-[#111827]/80 backdrop-blur-md border-b border-white/10 px-5 h-16 flex items-center gap-4">
          <button onClick={() => setView('sales')} className="p-2 -ml-2 rounded-full hover:bg-white/5"><ChevronLeft className="w-6 h-6 text-slate-300" /></button>
          <h1 className="font-bold text-lg text-white">Editor de Banner</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h2 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4"><LayoutTemplate size={14}/>Layout</h2>
            <div className="grid grid-cols-3 gap-3">
              {EDITOR_LAYOUTS.map(layout => (
                 <button key={layout.id} onClick={() => setEditorData({...editorData, template: layout.id})} className={`p-3 rounded-xl text-sm font-bold border-2 ${editorData.template === layout.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}>
                  {layout.name}
                 </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4"><Type size={14}/>Conteúdo</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Título" value={editorData.title} onChange={e => setEditorData({...editorData, title: e.target.value})} className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-white" />
              <input type="text" placeholder="Subtítulo" value={editorData.subtitle} onChange={e => setEditorData({...editorData, subtitle: e.target.value})} className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-white" />
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4"><Palette size={14}/>Estilo Visual</h2>
            <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-bold">Paleta de Cores</label>
                  <div className="flex gap-3">
                    {COLOR_PALETTES.map(p => (
                      <button key={p.id} onClick={() => setEditorData({...editorData, palette: p.id})} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${editorData.palette === p.id ? 'border-blue-500' : 'border-transparent'}`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex">
                           <div className="w-1/2 h-full" style={{backgroundColor: p.previewColors[0]}}></div>
                           <div className="w-1/2 h-full" style={{backgroundColor: p.previewColors[1]}}></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold">Fonte</label>
                    <select value={editorData.fontFamily} onChange={e => setEditorData({...editorData, fontFamily: e.target.value})} className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mt-1 text-white">
                      <option>Poppins</option>
                      <option>Outfit</option>
                      <option>Arial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold">Tamanho</label>
                    <select value={editorData.fontSize} onChange={e => setEditorData({...editorData, fontSize: e.target.value})} className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 mt-1 text-white">
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Preview</h2>
            <BannerEditorPreview data={editorData} />
          </section>

          <section>
            <button onClick={handleSaveBanner} disabled={isSaving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Publicando...' : 'Salvar e Publicar'}
            </button>
          </section>
        </main>
      </div>
    );
  }

  // RENDERIZADOR DA PÁGINA DE VENDAS (ORIGINAL)
  return (
    <div className="min-h-screen bg-[#1E5BFF] font-sans animate-in slide-in-from-right duration-300 relative flex flex-col">
      <div className="sticky top-0 z-20 bg-[#1E5BFF]/90 backdrop-blur-md border-b border-blue-400/30 px-5 h-16 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <span className="font-bold text-sm text-blue-100 uppercase tracking-widest">Publicidade Premium</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-sm backdrop-blur-sm">
                <Crown className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">DESTAQUE MÁXIMO</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-[1.1] mb-4 font-display tracking-tight">
                Sua marca no topo<br/>
                <span className="text-blue-200">
                    para todo o bairro ver
                </span>
            </h1>
            <p className="text-blue-100 max-w-md mx-auto leading-relaxed">
                Posicione sua loja na tela principal do aplicativo e seja a primeira escolha dos seus vizinhos.
            </p>
        </div>

        <div className="bg-white/10 rounded-3xl p-6 border border-white/20 backdrop-blur-sm">
            <h3 className="font-bold text-white text-lg text-center mb-6">Já tem um plano?</h3>
            <div className="flex flex-col gap-3">
              <button 
                  onClick={() => setView('creator')}
                  className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                  <Sparkles className="w-5 h-5" />
                  Criar com Template Rápido
              </button>
              <button 
                  onClick={() => setView('editor')}
                  className="w-full bg-slate-900/50 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border border-white/20 backdrop-blur-sm"
              >
                  <Palette className="w-5 h-5" />
                  Criar Banner Personalizado
              </button>
            </div>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0"><Target size={20} /></div>
                <div>
                    <h4 className="font-bold text-white">Alcance Direcionado</h4>
                    <p className="text-xs text-blue-100 leading-relaxed mt-1">Sua marca aparece para quem realmente importa: seus vizinhos em Jacarepaguá.</p>
                </div>
            </div>
             <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0"><Rocket size={20} /></div>
                <div>
                    <h4 className="font-bold text-white">Visibilidade Instantânea</h4>
                    <p className="text-xs text-blue-100 leading-relaxed mt-1">Garanta a primeira impressão e seja a escolha óbvia para milhares de usuários.</p>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-400/20 to-transparent rounded-3xl border border-white/20 text-center">
            <h3 className="font-bold text-white text-lg">Pronto para crescer?</h3>
            <p className="text-xs text-blue-100 mt-2 mb-6">Nossa equipe comercial entrará em contato para finalizar a contratação.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl shadow-lg">Falar com um consultor</button>
        </div>
      </div>

      {showSuccess && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
              <div className="bg-slate-800 p-8 rounded-2xl text-center flex flex-col items-center border border-slate-700">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 mb-4">
                      <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-bold text-lg text-white">Banner Publicado!</h3>
                  <p className="text-sm text-slate-400 mt-2">Sua campanha está ativa e já aparece para os clientes.</p>
              </div>
          </div>
      )}
    </div>
  );
};
