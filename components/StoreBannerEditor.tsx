
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, Save, Palette, AlignLeft, 
  AlignCenter, AlignRight, Image as ImageIcon, 
  Check, Sparkles, Store as StoreIcon, Info, X, 
  Circle, Square, Type, Layout, MousePointer2
} from 'lucide-react';

export interface BannerDesign {
  // Perguntas Guiadas
  offer: string;
  benefit: string;
  priceTag: string;
  
  // Design Automático
  alignment: 'left' | 'center' | 'right';
  showIcon: boolean;
  
  // Fundo
  bgType: 'ready' | 'color' | 'category';
  bgValue: string; // URL ou HEX
  
  // Marca (Logo)
  showLogo: boolean;
  logoShape: 'round' | 'square';
  logoPosition: 'top' | 'center' | 'bottom';
  // FIX: Added optional config property to BannerDesign to support preview logic
  config?: any;
}

const READY_BGS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
];

const SIMPLE_COLORS = ['#1E5BFF', '#111827', '#059669', '#DC2626', '#7C3AED', '#F59E0B'];

const CATEGORY_BGS: Record<string, string[]> = {
  'Comida': ['https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800'],
  'Serviços': ['https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800'],
  'Beleza': ['https://images.unsplash.com/photo-1560066984-118c38b64a75?q=80&w=800', 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800'],
  'Default': ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800']
};

export const BannerPreview: React.FC<{ config: BannerDesign; storeName: string; storeLogo?: string | null; }> = ({ config, storeName, storeLogo }) => {
  const isImage = config.bgType !== 'color';
  
  // Proteção automática de contraste baseada no fundo
  const textColor = config.bgType === 'color' && config.bgValue === '#FFFFFF' ? 'text-slate-900' : 'text-white';
  const logoBg = config.bgValue === '#FFFFFF' ? 'bg-slate-100' : 'bg-white/20';

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-900">
      {/* Background Layer */}
      {isImage ? (
        <img src={config.bgValue} className="absolute inset-0 w-full h-full object-cover" alt="" />
      ) : (
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: config.bgValue }}></div>
      )}
      
      {/* Auto-Protection Scrim (Garante leitura em qualquer imagem) */}
      {isImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>}

      {/* Content Layer */}
      <div className={`relative z-10 w-full h-full flex flex-col p-8 transition-all duration-500 ${
        config.alignment === 'center' ? 'items-center text-center justify-center' : 
        config.alignment === 'right' ? 'items-end text-right justify-center' : 
        'items-start text-left justify-center'
      }`}>
        
        {/* Logo flutuante de marca */}
        {config.showLogo && storeLogo && (
          <div className={`absolute p-1 backdrop-blur-md border border-white/20 shadow-xl ${logoBg} ${
            config.logoShape === 'round' ? 'rounded-full' : 'rounded-2xl'
          } ${
            config.logoPosition === 'top' ? 'top-6' : 
            config.logoPosition === 'bottom' ? 'bottom-6' : 
            'top-1/2 -translate-y-1/2 opacity-20'
          }`}>
            <img src={storeLogo} className={`object-contain ${
              config.logoShape === 'round' ? 'rounded-full' : 'rounded-xl'
            } w-10 h-10`} alt="" />
          </div>
        )}

        <div className="max-w-[90%]">
          {config.showIcon && (
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
                <Sparkles size={12} className="text-yellow-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/90">{storeName}</span>
            </div>
          )}

          <h2 className={`font-black tracking-tighter leading-[0.9] mb-3 break-words ${textColor} ${
            config.offer.length > 20 ? 'text-2xl' : 'text-4xl'
          }`}>
            {config.config?.offer || config.offer || "O que você oferece?"}
          </h2>
          
          <p className={`text-sm font-bold opacity-90 leading-tight mb-4 ${textColor}`}>
            {config.benefit || "Qual a vantagem para o cliente?"}
          </p>

          {config.priceTag && (
            <div className="inline-block bg-yellow-400 text-slate-900 px-4 py-2 rounded-2xl font-black text-lg shadow-lg transform -rotate-1">
              {config.priceTag}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// FIX: Added missing StoreBannerEditorProps interface
interface StoreBannerEditorProps {
  storeName: string;
  storeLogo?: string | null;
  storeSubcategory?: string;
  onSave: (design: BannerDesign) => void;
  onBack: () => void;
}

export const StoreBannerEditor: React.FC<StoreBannerEditorProps> = ({ storeName, storeLogo, storeSubcategory, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'background' | 'brand'>('info');
  const [bgTab, setBgTab] = useState<'ready' | 'color' | 'category'>('ready');
  
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

  const categoryImages = CATEGORY_BGS[storeSubcategory || 'Default'] || CATEGORY_BGS['Default'];

  return (
    <div className="fixed inset-0 bg-[#020617] text-white z-[200] flex flex-col font-sans overflow-hidden">
      <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl p-4 px-5 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xs uppercase tracking-widest">Divulgar Minha Loja</h1>
            <p className="text-[9px] text-blue-400 font-bold uppercase">{storeName}</p>
          </div>
        </div>
        <button 
            onClick={() => onSave(config)} 
            className="bg-[#1E5BFF] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
            Publicar
        </button>
      </header>
      
      {/* Preview Automático e Fixo */}
      <div className="flex-shrink-0 p-4 bg-[#020617] border-b border-white/5">
          <div className="w-full max-w-sm aspect-[16/10] mx-auto">
             <BannerPreview config={config} storeName={storeName} storeLogo={storeLogo} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
              <Info size={12} className="text-blue-400" />
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Ajustamos o design automaticamente para você.
              </p>
          </div>
      </div>

      {/* Ferramentas de Edição Simplicadas */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        <nav className="flex-shrink-0 flex border-b border-white/5 p-2 gap-1 bg-slate-900/40">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${activeTab === 'info' ? 'bg-blue-600' : 'text-slate-500'}`}>
            <Type size={18} />
            <span className="text-[8px] font-black uppercase">Mensagem</span>
          </button>
          <button onClick={() => setActiveTab('background')} className={`flex-1 py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${activeTab === 'background' ? 'bg-blue-600' : 'text-slate-500'}`}>
            <ImageIcon size={18} />
            <span className="text-[8px] font-black uppercase">Fundo</span>
          </button>
          <button onClick={() => setActiveTab('brand')} className={`flex-1 py-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${activeTab === 'brand' ? 'bg-blue-600' : 'text-slate-500'}`}>
            <Layout size={18} />
            <span className="text-[8px] font-black uppercase">Posição</span>
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
            
            {/* ABA 1: PERGUNTAS GUIADAS */}
            {activeTab === 'info' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">O que sua loja oferece?</label>
                  <input 
                    value={config.offer} 
                    onChange={e => setConfig({...config, offer: e.target.value.slice(0, 35)})}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none"
                    placeholder="Ex: Pizza Artesanal, Corte de Cabelo..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Qual a vantagem para o cliente?</label>
                  <input 
                    value={config.benefit} 
                    onChange={e => setConfig({...config, benefit: e.target.value.slice(0, 60)})}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-blue-500 outline-none"
                    placeholder="Ex: Massa fininha, Atendimento domiciliar..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preço ou Chamada (Opcional)</label>
                  <input 
                    value={config.priceTag} 
                    onChange={e => setConfig({...config, priceTag: e.target.value.slice(0, 20)})}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-black text-yellow-400 outline-none"
                    placeholder="Ex: R$ 39,90, 20% OFF..."
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Mostrar selo com nome da loja?</span>
                    <button onClick={() => setConfig({...config, showIcon: !config.showIcon})} className={`w-12 h-6 rounded-full p-1 transition-colors ${config.showIcon ? 'bg-blue-600' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.showIcon ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
              </div>
            )}

            {/* ABA 2: FUNDO ORGANIZADO */}
            {activeTab === 'background' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setBgTab('ready')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${bgTab === 'ready' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Fundos</button>
                    <button onClick={() => setBgTab('color')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${bgTab === 'color' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Cores</button>
                    <button onClick={() => setBgTab('category')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase ${bgTab === 'category' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Sugestões</button>
                </div>

                {bgTab === 'ready' && (
                    <div className="grid grid-cols-3 gap-3">
                        {READY_BGS.map(url => (
                            <button key={url} onClick={() => setConfig({...config, bgType: 'ready', bgValue: url})} className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${config.bgValue === url ? 'border-blue-600 scale-95 shadow-lg' : 'border-transparent opacity-60'}`}>
                                <img src={url} className="w-full h-full object-cover" alt="" />
                            </button>
                        ))}
                    </div>
                )}

                {bgTab === 'color' && (
                    <div className="grid grid-cols-3 gap-3">
                        {SIMPLE_COLORS.map(color => (
                            <button key={color} onClick={() => setConfig({...config, bgType: 'color', bgValue: color})} className={`aspect-square rounded-2xl border-4 transition-all ${config.bgValue === color ? 'border-white scale-95 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                        ))}
                        <button onClick={() => setConfig({...config, bgType: 'color', bgValue: '#FFFFFF'})} className={`aspect-square rounded-2xl border-4 bg-white transition-all ${config.bgValue === '#FFFFFF' ? 'border-blue-600 scale-95' : 'border-slate-200'}`} />
                    </div>
                )}

                {bgTab === 'category' && (
                    <div className="grid grid-cols-2 gap-3">
                        {categoryImages.map((url, i) => (
                            <button key={i} onClick={() => setConfig({...config, bgType: 'category', bgValue: url})} className={`aspect-video rounded-2xl overflow-hidden border-4 transition-all ${config.bgValue === url ? 'border-blue-600 scale-95' : 'border-transparent opacity-60'}`}>
                                <img src={url} className="w-full h-full object-cover" alt="" />
                            </button>
                        ))}
                    </div>
                )}
              </div>
            )}

            {/* ABA 3: POSIÇÃO E MARCA */}
            {activeTab === 'brand' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                <section className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alinhamento do Texto</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'left', icon: AlignLeft, label: 'Esquerda' },
                      { id: 'center', icon: AlignCenter, label: 'Centro' },
                      { id: 'right', icon: AlignRight, label: 'Direita' }
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setConfig({...config, alignment: opt.id as any})} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${config.alignment === opt.id ? 'bg-blue-600/10 border-blue-600 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                        <opt.icon size={20} />
                        <span className="text-[8px] font-black uppercase">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4 pt-6 border-t border-white/5">
                   <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sua Logo</label>
                        <button onClick={() => setConfig({...config, showLogo: !config.showLogo})} className={`w-12 h-6 rounded-full p-1 transition-colors ${config.showLogo ? 'bg-blue-600' : 'bg-slate-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.showLogo ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                   </div>
                   
                   {config.showLogo && (
                     <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                        <div className="space-y-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Formato</p>
                            <div className="flex gap-2">
                                <button onClick={() => setConfig({...config, logoShape: 'round'})} className={`flex-1 p-3 rounded-xl border ${config.logoShape === 'round' ? 'bg-slate-800 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 text-slate-500'}`}><Circle size={16} className="mx-auto" /></button>
                                <button onClick={() => setConfig({...config, logoShape: 'square'})} className={`flex-1 p-3 rounded-xl border ${config.logoShape === 'square' ? 'bg-slate-800 border-blue-500 text-blue-400' : 'bg-slate-900 border-white/5 text-slate-500'}`}><Square size={16} className="mx-auto" /></button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Posição</p>
                            <div className="flex gap-1 bg-slate-900 p-1 rounded-xl">
                                {(['top', 'center', 'bottom'] as const).map(pos => (
                                    <button key={pos} onClick={() => setConfig({...config, logoPosition: pos})} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase ${config.logoPosition === pos ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>{pos === 'top' ? 'Subir' : pos === 'center' ? 'Meio' : 'Descer'}</button>
                                ))}
                            </div>
                        </div>
                     </div>
                   )}
                </section>
              </div>
            )}
        </div>
      </div>

      {/* Footer Fixo */}
      <footer className="flex-shrink-0 p-6 pb-12 bg-slate-900 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
              <MousePointer2 size={12} className="text-blue-500" />
              Você poderá editar esse banner depois, se quiser.
          </p>
          <button 
              onClick={() => onSave(config)} 
              className="w-full max-w-sm py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
              Salvar e Visualizar no App
          </button>
      </footer>
    </div>
  );
};
