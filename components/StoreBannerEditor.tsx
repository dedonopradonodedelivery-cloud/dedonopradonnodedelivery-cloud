import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, AlignLeft, AlignCenter, AlignRight, 
  Image as ImageIcon, Palette, Layout, Sparkles, 
  Check, Info, MousePointer2, Type, Circle, Square,
  // Added ArrowRight to the imports
  Eye, Tag, Wand2, ArrowRight
} from 'lucide-react';

export interface BannerDesign {
  offer: string;
  benefit: string;
  priceTag: string;
  alignment: 'left' | 'center' | 'right';
  showIcon: boolean;
  bgType: 'ready' | 'color' | 'category';
  bgValue: string;
  showLogo: boolean;
  logoShape: 'round' | 'square';
  logoPosition: 'top' | 'center' | 'bottom';
}

const READY_BGS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
  'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800',
  'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=800',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800',
];

const SIMPLE_COLORS = ['#1E5BFF', '#111827', '#059669', '#DC2626', '#7C3AED', '#F59E0B', '#FFFFFF'];

const CATEGORY_IMAGES: Record<string, string[]> = {
  'Comida': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800',
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800'
  ],
  'Beleza': [
    'https://images.unsplash.com/photo-1560066984-118c38b64a75?q=80&w=800',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800'
  ],
  'Serviços': [
    'https://images.unsplash.com/photo-1581578731117-10d52b4d8051?q=80&w=800',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800'
  ],
  'Default': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800'
  ]
};

export const BannerPreview: React.FC<{ config: BannerDesign; storeName: string; storeLogo?: string | null; }> = ({ config, storeName, storeLogo }) => {
  if (!config) return null;
  const isImage = config.bgType !== 'color';
  
  // Proteção automática de contraste
  const isWhiteBg = config.bgType === 'color' && config.bgValue === '#FFFFFF';
  const textColor = isWhiteBg ? 'text-slate-900' : 'text-white';
  const logoBg = isWhiteBg ? 'bg-slate-100' : 'bg-white/10';

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-900">
      {/* Background */}
      {isImage ? (
        <img src={config.bgValue} className="absolute inset-0 w-full h-full object-cover" alt="" />
      ) : (
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: config.bgValue }}></div>
      )}
      
      {/* Proteção Automática de Legibilidade (Scrim) */}
      {isImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>}

      {/* Content */}
      <div className={`relative z-10 w-full h-full flex flex-col p-8 transition-all duration-500 ${
        config.alignment === 'center' ? 'items-center text-center justify-center' : 
        config.alignment === 'right' ? 'items-end text-right justify-center' : 
        'items-start text-left justify-center'
      }`}>
        
        {/* Marca Automática */}
        {config.showLogo && storeLogo && (
          <div className={`absolute p-1 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 ${logoBg} ${
            config.logoShape === 'round' ? 'rounded-full' : 'rounded-2xl'
          } ${
            config.logoPosition === 'top' ? 'top-6' : 
            config.logoPosition === 'bottom' ? 'bottom-6' : 
            'top-1/2 -translate-y-1/2'
          }`}>
            <img src={storeLogo} className={`object-contain ${
              config.logoShape === 'round' ? 'rounded-full' : 'rounded-xl'
            } w-10 h-10`} alt="" />
          </div>
        )}

        <div className="max-w-[90%]">
          {config.showIcon && (
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
                <Sparkles size={10} className="text-yellow-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white">{storeName}</span>
            </div>
          )}

          <h2 className={`font-black tracking-tighter leading-[0.9] mb-2 break-words drop-shadow-xl ${textColor} ${
            (config.offer || "").length > 20 ? 'text-xl' : 'text-3xl'
          }`}>
            {config.offer || "O que você vende?"}
          </h2>
          
          <p className={`text-sm font-bold opacity-90 leading-tight mb-4 drop-shadow-lg ${textColor}`}>
            {config.benefit || "Principal benefício?"}
          </p>

          {config.priceTag && (
            <div className="inline-block bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-xl font-black text-lg shadow-lg transform -rotate-1">
              {config.priceTag}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StoreBannerEditorProps {
  storeName: string;
  storeLogo?: string | null;
  storeCategory?: string;
  onSave: (design: BannerDesign) => void;
  onBack: () => void;
}

export const StoreBannerEditor: React.FC<StoreBannerEditorProps> = ({ storeName, storeLogo, storeCategory, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'background' | 'brand'>('content');
  const [bgSubTab, setBgSubTab] = useState<'ready' | 'color' | 'category'>('ready');
  
  const [config, setConfig] = useState<BannerDesign>({
    offer: '',
    benefit: '',
    priceTag: '',
    alignment: 'left',
    showIcon: true,
    bgType: 'ready',
    bgValue: READY_BGS[0],
    showLogo: true,
    logoShape: 'round',
    logoPosition: 'top'
  });

  const categoryImgs = CATEGORY_IMAGES[storeCategory || 'Default'] || CATEGORY_IMAGES['Default'];

  return (
    <div className="fixed inset-0 bg-[#020617] text-white z-[200] flex flex-col font-sans overflow-hidden">
      <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl p-4 px-5 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xs uppercase tracking-widest">Criar meu Banner</h1>
            <p className="text-[9px] text-blue-400 font-bold uppercase">{storeName}</p>
          </div>
        </div>
        <button 
            onClick={() => onSave(config)} 
            className="bg-[#1E5BFF] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
            Pronto
        </button>
      </header>

      {/* Preview Section */}
      <div className="flex-shrink-0 p-4 bg-slate-950 border-b border-white/5">
          <div className="w-full max-w-sm mx-auto">
             <BannerPreview config={config} storeName={storeName} storeLogo={storeLogo} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
              <Wand2 size={12} className="text-blue-500" />
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Proteção inteligente: Ajustamos o contraste para você.
              </p>
          </div>
      </div>

      {/* Editor Tabs Navigation */}
      <nav className="flex-shrink-0 flex border-b border-white/5 bg-slate-900/50 p-1 gap-1">
          <button 
            onClick={() => setActiveTab('content')} 
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <Type size={18} />
            <span className="text-[8px] font-black uppercase">Mensagem</span>
          </button>
          <button 
            onClick={() => setActiveTab('background')} 
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${activeTab === 'background' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <ImageIcon size={18} />
            <span className="text-[8px] font-black uppercase">Fundo</span>
          </button>
          <button 
            onClick={() => setActiveTab('brand')} 
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${activeTab === 'brand' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
          >
            <Layout size={18} />
            <span className="text-[8px] font-black uppercase">Marca</span>
          </button>
      </nav>

      {/* Scrollable Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40 bg-slate-950">
          
          {/* TAB 1: CONTEÚDO GUIADO */}
          {activeTab === 'content' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">O que você oferece? (Ex: Pizza Artesanal)</label>
                    <input 
                      value={config.offer} 
                      onChange={e => setConfig({...config, offer: e.target.value.slice(0, 35)})}
                      placeholder="Nome do produto ou serviço"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Qual a vantagem? (Ex: Entrega Grátis)</label>
                    <input 
                      value={config.benefit} 
                      onChange={e => setConfig({...config, benefit: e.target.value.slice(0, 60)})}
                      placeholder="O diferencial para o cliente"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preço ou Chamada (Ex: R$ 39,90)</label>
                    <input 
                      value={config.priceTag} 
                      onChange={e => setConfig({...config, priceTag: e.target.value.slice(0, 20)})}
                      placeholder="Destaque de valor ou ação"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-black text-yellow-400 outline-none"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alinhamento do Texto</span>
                      <div className="flex gap-1 bg-slate-900 p-1 rounded-xl">
                          {[
                            { id: 'left', icon: AlignLeft },
                            { id: 'center', icon: AlignCenter },
                            { id: 'right', icon: AlignRight }
                          ].map(opt => (
                              <button 
                                key={opt.id} 
                                onClick={() => setConfig({...config, alignment: opt.id as any})}
                                className={`p-2 rounded-lg transition-all ${config.alignment === opt.id ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                              >
                                  <opt.icon size={16} />
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* TAB 2: FUNDOS ORGANIZADOS */}
          {activeTab === 'background' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
                      <button onClick={() => setBgSubTab('ready')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${bgSubTab === 'ready' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Imagens</button>
                      <button onClick={() => setBgSubTab('color')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${bgSubTab === 'color' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Cores</button>
                      <button onClick={() => setBgSubTab('category')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${bgSubTab === 'category' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Categorias</button>
                  </div>

                  {bgSubTab === 'ready' && (
                      <div className="grid grid-cols-3 gap-3">
                          {READY_BGS.map(url => (
                              <button 
                                key={url} 
                                onClick={() => setConfig({...config, bgType: 'ready', bgValue: url})} 
                                className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${config.bgValue === url ? 'border-blue-600 scale-95 shadow-xl' : 'border-transparent opacity-60'}`}
                              >
                                  <img src={url} className="w-full h-full object-cover" alt="" />
                              </button>
                          ))}
                      </div>
                  )}

                  {bgSubTab === 'color' && (
                      <div className="grid grid-cols-4 gap-3">
                          {SIMPLE_COLORS.map(color => (
                              <button 
                                key={color} 
                                onClick={() => setConfig({...config, bgType: 'color', bgValue: color})} 
                                className={`aspect-square rounded-2xl border-4 transition-all ${config.bgValue === color ? 'border-white scale-95 shadow-lg' : 'border-transparent opacity-80'}`} 
                                style={{ backgroundColor: color }} 
                              />
                          ))}
                      </div>
                  )}

                  {bgSubTab === 'category' && (
                      <div className="grid grid-cols-2 gap-3">
                          {categoryImgs.map((url, i) => (
                              <button 
                                key={i} 
                                onClick={() => setConfig({...config, bgType: 'category', bgValue: url})} 
                                className={`aspect-video rounded-2xl overflow-hidden border-4 transition-all ${config.bgValue === url ? 'border-blue-600 scale-95' : 'border-transparent opacity-60'}`}
                              >
                                  <img src={url} className="w-full h-full object-cover" alt="" />
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* TAB 3: MARCA E LOGO */}
          {activeTab === 'brand' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                  <section className="space-y-4">
                      <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exibir Logo da Loja?</label>
                          <button 
                            onClick={() => setConfig({...config, showLogo: !config.showLogo})} 
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${config.showLogo ? 'bg-blue-600' : 'bg-slate-700'}`}
                          >
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.showLogo ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </button>
                      </div>
                      
                      {config.showLogo && (
                          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-top-2">
                              <div className="space-y-3">
                                  <p className="text-[9px] font-bold text-slate-500 uppercase ml-1">Formato</p>
                                  <div className="flex gap-2">
                                      <button onClick={() => setConfig({...config, logoShape: 'round'})} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${config.logoShape === 'round' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                                        <Circle size={18} />
                                        <span className="text-[8px] font-black uppercase">Redonda</span>
                                      </button>
                                      <button onClick={() => setConfig({...config, logoShape: 'square'})} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${config.logoShape === 'square' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                                        <Square size={18} />
                                        <span className="text-[8px] font-black uppercase">Quadrada</span>
                                      </button>
                                  </div>
                              </div>
                              <div className="space-y-3">
                                  <p className="text-[9px] font-bold text-slate-500 uppercase ml-1">Posição</p>
                                  <div className="flex gap-1 bg-slate-900 p-1 rounded-xl">
                                      {(['top', 'center', 'bottom'] as const).map(pos => (
                                          <button 
                                            key={pos} 
                                            onClick={() => setConfig({...config, logoPosition: pos})} 
                                            className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase transition-all ${config.logoPosition === pos ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500'}`}
                                          >
                                            {pos === 'top' ? 'Cima' : pos === 'center' ? 'Meio' : 'Baixo'}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}
                  </section>

                  <section className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Selo com nome da loja?</label>
                          <Info size={10} className="text-slate-600" />
                      </div>
                      <button 
                        onClick={() => setConfig({...config, showIcon: !config.showIcon})} 
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${config.showIcon ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.showIcon ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                  </section>
              </div>
          )}
      </div>

      {/* Footer CTA */}
      <footer className="flex-shrink-0 p-6 pb-12 bg-slate-900 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <MousePointer2 size={10} className="text-blue-500" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Você poderá editar este banner depois.
              </p>
          </div>
          <button 
              onClick={() => onSave(config)} 
              className="w-full max-w-sm py-5 bg-[#1E5BFF] text-white font-black rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
              Finalizar Arte <ArrowRight size={18} />
          </button>
      </footer>
    </div>
  );
};