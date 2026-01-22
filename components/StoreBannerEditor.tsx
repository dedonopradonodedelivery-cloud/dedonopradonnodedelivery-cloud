import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Save, 
  X,
  Flame,
  Zap,
  Percent,
  Tag,
  Gift,
  Utensils,
  Pizza,
  Coffee,
  Beef,
  IceCream,
  ShoppingCart,
  Store,
  Package,
  Wrench,
  Truck,
  CreditCard,
  Coins,
  Star,
  Award,
  MapPin,
  Smile,
  Bell,
  Clock,
  Heart,
  Sparkles,
  Trash2,
  Square,
  Circle,
  Ban
} from 'lucide-react';

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Flame, Zap, Percent, Tag, Gift, Utensils, Pizza, Coffee, Beef, IceCream,
  ShoppingCart, Store, Package, Wrench, Truck, CreditCard, Coins, Star,
  Award, MapPin, Smile, Bell, Clock, Heart, Sparkles
};

const ICON_CATEGORIES = [
  { label: '🔥 Promo', icons: ['Flame', 'Zap', 'Percent', 'Tag', 'Gift'] },
  { label: '🍔 Comida', icons: ['Utensils', 'Pizza', 'Coffee', 'Beef', 'IceCream'] },
  { label: '🛒 Compras', icons: ['ShoppingCart', 'Store', 'Package'] },
  { label: '🛠️ Serviços', icons: ['Wrench', 'Truck', 'Sparkles'] },
  { label: '💳 Pago', icons: ['CreditCard', 'Coins'] },
  { label: '⭐ Destaque', icons: ['Star', 'Award', 'Smile', 'Heart'] },
  { label: '📍 Local', icons: ['MapPin', 'Bell', 'Clock'] },
];

const fonts = [
  { id: 'font-display', name: 'Display Moderno' },
  { id: 'font-sans', name: 'Sans Clean' },
  { id: 'font-serif', name: 'Elegante Serif' },
  { id: 'font-mono', name: 'Tech Mono' },
];

interface BannerDesign {
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  font: string;
  align: 'left' | 'center' | 'right';
  animation: 'none' | 'slide' | 'pulse' | 'float';
  iconName: string | null;
  iconPos: 'left' | 'top' | 'right';
  iconSize: 'sm' | 'md' | 'lg';
  iconColorMode: 'text' | 'white' | 'black' | 'custom';
  logoDisplay: 'square' | 'round' | 'none';
  iconCustomColor?: string;
}

interface StoreBannerEditorProps {
  storeName: string;
  storeLogo?: string;
  onSave: (design: BannerDesign) => void;
  onBack: () => void;
}

export const StoreBannerEditor: React.FC<StoreBannerEditorProps> = ({ storeName, storeLogo, onSave, onBack }) => {
  const [design, setDesign] = useState<BannerDesign>({
    title: 'Sua oferta principal aqui',
    subtitle: 'Uma descrição curta e impactante para o bairro.',
    bgColor: '#1E5BFF',
    textColor: '#FFFFFF',
    font: 'font-display',
    align: 'left',
    animation: 'none',
    iconName: null,
    iconPos: 'left',
    iconSize: 'md',
    iconColorMode: 'text',
    logoDisplay: 'round'
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [customHue, setCustomHue] = useState(220);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 10);
  };

  const updateCustomColor = (h: number, s: number, l: number) => {
    const color = `hsl(${h}, ${s}%, ${l}%)`;
    const textColor = l > 65 ? '#0F172A' : '#FFFFFF';
    setDesign({ ...design, bgColor: color, textColor });
  };

  const renderIcon = (name: string | null, size: 'sm' | 'md' | 'lg', colorMode: string) => {
    if (!name || !ICON_COMPONENTS[name]) return null;
    const IconComp = ICON_COMPONENTS[name];
    const sizes = { sm: 24, md: 44, lg: 64 };
    const colors = { 
        text: design.textColor, 
        white: '#FFFFFF', 
        black: '#000000', 
        custom: design.iconCustomColor || '#1E5BFF' 
    };
    
    return <IconComp size={sizes[size]} style={{ color: (colors as any)[colorMode] }} strokeWidth={2.5} />;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#020617] flex flex-col animate-in fade-in duration-300 overflow-hidden">
      
      {/* PREVIEW FIXO SUPERIOR */}
      <div className="relative z-[80] bg-[#020617] flex flex-col shrink-0">
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-lg leading-none text-white">Criar Banner</h1>
              <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Editor Visual</p>
            </div>
          </div>
        </header>

        <div className={`w-full px-6 py-4 bg-slate-900/40 backdrop-blur-md border-b border-white/5 transition-all duration-300 ${isScrolled ? 'shadow-2xl shadow-blue-500/10' : ''}`}>
          <div className={`transition-all duration-500 mx-auto max-w-sm ${isScrolled ? 'scale-90 -my-2' : 'scale-100'}`}>
            <div 
              className={`w-full aspect-[16/9] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-center border border-white/10 ${
                design.align === 'center' ? 'items-center text-center' : design.align === 'right' ? 'items-end text-right' : 'items-start text-left'
              } ${design.animation === 'pulse' ? 'animate-pulse' : design.animation === 'float' ? 'animate-float-slow' : ''}`}
              style={{ backgroundColor: design.bgColor }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className={`relative z-10 transition-all duration-500 flex ${design.iconPos === 'top' ? 'flex-col items-inherit' : design.iconPos === 'right' ? 'flex-row-reverse items-center gap-4' : 'flex-row items-center gap-4'} ${design.animation === 'slide' ? 'animate-in slide-in-from-left-8' : ''}`}>
                
                {design.iconName && (
                  <div className={`${design.iconPos === 'top' ? 'mb-2' : ''} shrink-0`}>
                      {renderIcon(design.iconName, design.iconSize, design.iconColorMode)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 w-fit">
                      {design.logoDisplay !== 'none' && storeLogo && (
                          <div className={`shrink-0 overflow-hidden bg-white/20 p-0.5 border border-white/20 ${design.logoDisplay === 'round' ? 'rounded-full' : 'rounded-lg'}`}>
                              <img src={storeLogo} className={`w-6 h-6 object-contain ${design.logoDisplay === 'round' ? 'rounded-full' : 'rounded-md'}`} alt="Logo" />
                          </div>
                      )}
                      <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20 w-fit">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: design.textColor }}>{storeName}</span>
                      </div>
                  </div>
                  <h2 className={`text-2xl font-black leading-tight mb-1 tracking-tighter line-clamp-2 ${design.font}`} style={{ color: design.textColor }}>
                      {design.title}
                  </h2>
                  <p className="text-[10px] font-medium opacity-80 leading-snug max-w-[240px] line-clamp-2" style={{ color: design.textColor }}>
                      {design.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDITOR */}
      <main onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-40 relative z-10">
        
        {/* LOGO DA LOJA */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <Store size={14} /> Logo da Loja
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">Escolha como sua logo aparece no banner.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setDesign({...design, logoDisplay: 'square'})}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${design.logoDisplay === 'square' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Square size={18} /></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Quadrado</span>
              </button>
              
              <button 
                onClick={() => setDesign({...design, logoDisplay: 'round'})}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${design.logoDisplay === 'round' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Circle size={18} /></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Redondo</span>
              </button>

              <button 
                onClick={() => setDesign({...design, logoDisplay: 'none'})}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${design.logoDisplay === 'none' ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20'}`}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Ban size={18} /></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Sem logo</span>
              </button>
          </div>
          {design.logoDisplay === 'none' && (
              <p className="text-[9px] text-slate-600 italic ml-1 leading-tight">Você pode usar apenas texto e ícones decorativos.</p>
          )}
        </div>

        {/* MENSAGEM */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Type size={14} /> 1. Mensagem Principal
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Chamada do Banner</label>
              <input type="text" value={design.title} onChange={e => setDesign({...design, title: e.target.value})} maxLength={40} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Descrição Detalhada</label>
              <textarea value={design.subtitle} onChange={e => setDesign({...design, subtitle: e.target.value})} maxLength={100} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-medium text-white outline-none focus:border-blue-500 transition-all resize-none" rows={2} />
            </div>
          </div>
        </div>

        {/* ELEMENTOS VISUAIS */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Sparkles size={14} /> 2. Elementos Decorativos
          </h3>
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <Tag size={20} />
                      </div>
                      <div>
                          <p className="text-xs font-bold text-white">Ícone Opcional</p>
                          <p className="text-[9px] text-slate-500 uppercase font-black">Ilustração da oferta</p>
                      </div>
                  </div>
                  {design.iconName ? (
                      <button onClick={() => setDesign({...design, iconName: null})} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg active:scale-90 transition-all"><Trash2 size={16} /></button>
                  ) : (
                      <button onClick={() => setShowIconPicker(true)} className="px-4 py-2 bg-[#1E5BFF] text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">Adicionar</button>
                  )}
              </div>
          </div>
        </div>

        {/* CORES */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Palette size={14} /> 3. Cores e Layout
          </h3>
          <div className="space-y-8">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-4 block">Fundo do Banner</label>
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
                {[
                  { bg: '#1E5BFF', text: '#FFFFFF' },
                  { bg: '#0F172A', text: '#FFFFFF' },
                  { bg: '#FFFFFF', text: '#0F172A' },
                  { bg: '#FBBF24', text: '#000000' },
                  { bg: '#EF4444', text: '#FFFFFF' },
                  { bg: '#10B981', text: '#FFFFFF' },
                ].map((c, i) => (
                  <button key={i} onClick={() => setDesign({...design, bgColor: c.bg, textColor: c.text})} className={`flex-shrink-0 w-12 h-12 rounded-2xl border-4 transition-all ${design.bgColor === c.bg ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.bg }} />
                ))}
                <button onClick={() => setShowColorPicker(true)} className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${showColorPicker ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}>
                  <Palette size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1 block tracking-widest">Alinhamento</label>
                    <div className="flex gap-1 bg-slate-900 p-1.5 rounded-2xl border border-white/5">
                        <button onClick={() => setDesign({...design, align: 'left'})} className={`flex-1 p-2 rounded-xl flex justify-center transition-all ${design.align === 'left' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setDesign({...design, align: 'center'})} className={`flex-1 p-2 rounded-xl flex justify-center transition-all ${design.align === 'center' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}><AlignCenter size={16}/></button>
                        <button onClick={() => setDesign({...design, align: 'right'})} className={`flex-1 p-2 rounded-xl flex justify-center transition-all ${design.align === 'right' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}><AlignRight size={16}/></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1 block tracking-widest">Animação</label>
                    <select value={design.animation} onChange={e => setDesign({...design, animation: e.target.value as any})} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-2.5 text-xs font-bold text-white outline-none focus:border-blue-500 appearance-none">
                        <option value="none">Estático</option>
                        <option value="slide">Deslizar</option>
                        <option value="pulse">Pulsar</option>
                        <option value="float">Flutuar</option>
                    </select>
                </div>
            </div>
          </div>
        </div>

        {/* TIPOGRAFIA */}
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-500 uppercase ml-1 block tracking-widest">4. Estilo da Letra</label>
          <div className="grid grid-cols-1 gap-3">
            {fonts.map(f => (
              <button key={f.id} onClick={() => setDesign({...design, font: f.id})} className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${design.font === f.id ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg' : 'border-white/5 bg-slate-900 text-slate-500'}`}>
                <span className={`text-sm font-bold ${f.id}`}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* MODAIS (ÍCONES E COR) */}
      {showIconPicker && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-slate-900 rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500 border-t border-white/10 max-w-md mx-auto h-[70vh] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h3 className="text-white font-bold">Escolha um Ícone</h3>
              <button onClick={() => setShowIconPicker(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {ICON_CATEGORIES.map((cat, i) => (
                    <div key={i} className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat.label}</label>
                        <div className="grid grid-cols-5 gap-3">
                            {cat.icons.map(iconName => (
                                <button key={iconName} onClick={() => { setDesign({...design, iconName}); setShowIconPicker(false); }} className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${design.iconName === iconName ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{renderIcon(iconName, 'sm', design.iconName === iconName ? 'white' : 'text')}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {showColorPicker && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-slate-900 rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500 border-t border-white/10 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-bold">Cor Personalizada</h3>
              <button onClick={() => setShowColorPicker(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-crosshair border border-white/10" style={{ backgroundColor: `hsl(${customHue}, 100%, 50%)` }}
                onMouseMove={(e) => { if (e.buttons === 1) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                  updateCustomColor(customHue, x, 100 - y);
                }}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              <input type="range" min="0" max="360" value={customHue} onChange={(e) => { const h = parseInt(e.target.value); setCustomHue(h); updateCustomColor(h, 100, 50); }} className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 outline-none" />
              <button onClick={() => setShowColorPicker(false)} className="w-full py-4 bg-[#1E5BFF] text-white font-black rounded-2xl text-xs uppercase tracking-widest">Aplicar Cor</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto">
        <button onClick={() => onSave(design)} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-[2rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs">
          <Save size={18} /> CONCLUIR ARTE
        </button>
      </div>
    </div>
  );
};
