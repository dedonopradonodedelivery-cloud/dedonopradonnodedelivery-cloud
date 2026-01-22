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
  Ban,
  TextQuote,
  Check,
  AlertCircle
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

const FONT_STYLES = [
  { id: 'font-moderna', name: 'Moderna', family: "'Outfit', sans-serif" },
  { id: 'font-forte', name: 'Forte', family: "'Inter', sans-serif", weight: '900' },
  { id: 'font-elegante', name: 'Elegante', family: "'Lora', serif" },
  { id: 'font-amigavel', name: 'Amigável', family: "'Quicksand', sans-serif" },
  { id: 'font-neutra', name: 'Neutra', family: "'Inter', sans-serif" },
  { id: 'font-impacto', name: 'Impacto', family: "'Anton', sans-serif" },
  { id: 'font-minimal', name: 'Minimal', family: "'Montserrat', sans-serif" },
  { id: 'font-comercial', name: 'Comercial', family: "'Roboto', sans-serif" },
  { id: 'font-criativa', name: 'Criativa', family: "'Pacifico', cursive" },
  { id: 'font-classica', name: 'Clássica', family: "'Playfair Display', serif" },
];

const SIZE_LEVELS = [
  { id: 'xs', name: 'M. Pequeno', titleClass: 'text-lg', subClass: 'text-[9px]' },
  { id: 'sm', name: 'Pequeno', titleClass: 'text-xl', subClass: 'text-[10px]' },
  { id: 'md', name: 'Médio', titleClass: 'text-2xl', subClass: 'text-xs' },
  { id: 'lg', name: 'Grande', titleClass: 'text-3xl', subClass: 'text-sm' },
  { id: 'xl', name: 'M. Grande', titleClass: 'text-4xl', subClass: 'text-base' },
];

interface BannerDesign {
  title: string;
  titleFont: string;
  titleSize: string;
  subtitle: string;
  subtitleFont: string;
  subtitleSize: string;
  bgColor: string;
  textColor: string;
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
    title: 'Oferta Especial',
    titleFont: 'font-moderna',
    titleSize: 'md',
    subtitle: 'Confira nossos produtos com descontos exclusivos no bairro.',
    subtitleFont: 'font-neutra',
    subtitleSize: 'sm',
    bgColor: '#1E5BFF',
    textColor: '#FFFFFF',
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

  const getFontStyle = (fontId: string) => {
    const f = FONT_STYLES.find(x => x.id === fontId);
    return f ? { fontFamily: f.family, fontWeight: f.weight || '700' } : {};
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#020617] flex flex-col animate-in fade-in duration-300 overflow-hidden">
      
      {/* PREVIEW FIXO SUPERIOR */}
      <div className="relative z-[80] bg-[#020617] flex flex-col shrink-0">
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
              <X size={20} />
            </button>
            <div>
              <h1 className="font-bold text-lg leading-none text-white tracking-tight">Editor de Banner</h1>
              <p className="text-[9px] text-blue-400 uppercase font-black tracking-widest mt-1">Sua vitrine no bairro</p>
            </div>
          </div>
        </header>

        <div className={`w-full px-6 py-4 bg-slate-900/40 backdrop-blur-md border-b border-white/5 transition-all duration-300 ${isScrolled ? 'shadow-2xl shadow-blue-500/10' : ''}`}>
          <div className={`transition-all duration-500 mx-auto max-w-sm ${isScrolled ? 'scale-90 -my-2' : 'scale-100'}`}>
            <div 
              className={`w-full aspect-[16/9] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-center border border-white/10 ${
                design.align === 'center' ? 'items-center text-center' : design.align === 'right' ? 'items-end text-right' : 'items-start text-left'
              } ${design.animation === 'pulse' ? 'animate-pulse' : design.animation === 'float' ? 'animate-float-slow' : ''}`}
              style={{ backgroundColor: design.bgColor }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className={`relative z-10 transition-all duration-500 flex ${design.iconPos === 'top' ? 'flex-col items-inherit' : design.iconPos === 'right' ? 'flex-row-reverse items-center gap-4' : 'flex-row items-center gap-4'} ${design.animation === 'slide' ? 'animate-in slide-in-from-left-8' : ''}`}>
                
                {design.iconName && (
                  <div className={`${design.iconPos === 'top' ? 'mb-4' : ''} shrink-0`}>
                      {renderIcon(design.iconName, design.iconSize, design.iconColorMode)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 w-fit transition-all duration-300">
                      {/* LÓGICA DE PREVIEW DA LOGO REATIVA */}
                      {design.logoDisplay !== 'none' && storeLogo && (
                          <div className={`shrink-0 overflow-hidden bg-white/20 p-0.5 border border-white/20 transition-all duration-300 ${design.logoDisplay === 'round' ? 'rounded-full' : 'rounded-lg animate-in zoom-in-50'}`}>
                              <img src={storeLogo} className={`w-5 h-5 object-contain transition-all duration-300 ${design.logoDisplay === 'round' ? 'rounded-full' : 'rounded-md'}`} alt="Logo" />
                          </div>
                      )}
                      <div className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 w-fit">
                          <span className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: design.textColor }}>{storeName}</span>
                      </div>
                  </div>
                  
                  <h2 
                    className={`font-black leading-tight mb-2 tracking-tight line-clamp-2 transition-all duration-300 ${SIZE_LEVELS.find(s => s.id === design.titleSize)?.titleClass}`} 
                    style={{ ...getFontStyle(design.titleFont), color: design.textColor }}
                  >
                      {design.title}
                  </h2>
                  
                  <p 
                    className={`font-medium opacity-80 leading-snug max-w-[280px] line-clamp-2 transition-all duration-300 ${SIZE_LEVELS.find(s => s.id === design.subtitleSize)?.subClass}`} 
                    style={{ ...getFontStyle(design.subtitleFont), color: design.textColor }}
                  >
                      {design.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE EDIÇÃO ROLÁVEL */}
      <main onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-12 no-scrollbar pb-64 relative z-10">
        
        {/* BLOCO 1: TEXTO CHAMADA */}
        <section className="space-y-6">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <Type size={14} /> 1. Chamada Principal
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">O que chama atenção primeiro no banner.</p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 space-y-6">
            <input 
              type="text" 
              value={design.title} 
              onChange={e => setDesign({...design, title: e.target.value})} 
              maxLength={40} 
              placeholder="Digite a chamada..."
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all shadow-inner" 
            />

            <div className="space-y-4">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Estilo & Tamanho</label>
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 {FONT_STYLES.map(f => (
                   <button 
                     key={f.id} 
                     onClick={() => setDesign({...design, titleFont: f.id})}
                     className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap border-2 transition-all ${design.titleFont === f.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-transparent text-slate-400'}`}
                   >
                     {f.name}
                   </button>
                 ))}
               </div>
               <div className="grid grid-cols-5 gap-1.5 bg-slate-800 p-1.5 rounded-2xl">
                 {SIZE_LEVELS.map(s => (
                   <button 
                     key={s.id} 
                     onClick={() => setDesign({...design, titleSize: s.id})}
                     className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${design.titleSize === s.id ? 'bg-white text-black shadow-lg' : 'text-slate-500'}`}
                   >
                     {s.id.toUpperCase()}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* BLOCO 2: TEXTO DESCRIÇÃO */}
        <section className="space-y-6">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <TextQuote size={14} /> 2. Descrição Detalhada
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">Complemento para explicar sua oferta.</p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 space-y-6">
            <textarea 
              value={design.subtitle} 
              onChange={e => setDesign({...design, subtitle: e.target.value})} 
              maxLength={100} 
              placeholder="Digite os detalhes..."
              rows={2}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm font-medium text-white outline-none focus:border-blue-500 transition-all shadow-inner resize-none" 
            />

            <div className="space-y-4">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Estilo & Tamanho</label>
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 {FONT_STYLES.map(f => (
                   <button 
                     key={f.id} 
                     onClick={() => setDesign({...design, subtitleFont: f.id})}
                     className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap border-2 transition-all ${design.subtitleFont === f.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-transparent text-slate-400'}`}
                   >
                     {f.name}
                   </button>
                 ))}
               </div>
               <div className="grid grid-cols-5 gap-1.5 bg-slate-800 p-1.5 rounded-2xl">
                 {SIZE_LEVELS.map(s => (
                   <button 
                     key={s.id} 
                     onClick={() => setDesign({...design, subtitleSize: s.id})}
                     className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all ${design.subtitleSize === s.id ? 'bg-white text-black shadow-lg' : 'text-slate-500'}`}
                   >
                     {s.id.toUpperCase()}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </section>

        {/* BLOCO 3: IDENTIDADE (CORES) */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Palette size={14} /> 3. Cores do Banner
          </h3>
          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-4 block tracking-widest">Tom de Fundo</label>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {[
                  { bg: '#1E5BFF', text: '#FFFFFF' },
                  { bg: '#0F172A', text: '#FFFFFF' },
                  { bg: '#FFFFFF', text: '#0F172A' },
                  { bg: '#FBBF24', text: '#000000' },
                  { bg: '#EF4444', text: '#FFFFFF' },
                  { bg: '#10B981', text: '#FFFFFF' },
                ].map((c, i) => (
                  <button 
                    key={i} 
                    onClick={() => setDesign({...design, bgColor: c.bg, textColor: c.text})} 
                    className={`flex-shrink-0 w-14 h-14 rounded-2xl border-4 transition-all ${design.bgColor === c.bg ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-60'}`} 
                    style={{ backgroundColor: c.bg }} 
                  />
                ))}
                <button onClick={() => setShowColorPicker(true)} className="flex-shrink-0 w-14 h-14 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                  <Palette size={20} />
                </button>
              </div>
          </div>
        </section>

        {/* BLOCO 4: LOGO DA LOJA - REATIVIDADE CORRIGIDA */}
        <section className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <Store size={14} /> 4. Logo da Loja
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">Escolha como sua logo aparece no banner.</p>
          </div>
          
          {!storeLogo ? (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle size={18} className="text-amber-500" />
              <p className="text-[10px] font-bold text-amber-500 uppercase">Logo não cadastrada no perfil.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setDesign({...design, logoDisplay: 'square'})}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all active:scale-95 ${design.logoDisplay === 'square' ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Square size={20} /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Quadrado</span>
                </button>
                
                <button 
                  onClick={() => setDesign({...design, logoDisplay: 'round'})}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all active:scale-95 ${design.logoDisplay === 'round' ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Circle size={20} /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Redondo</span>
                </button>

                <button 
                  onClick={() => setDesign({...design, logoDisplay: 'none'})}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all active:scale-95 ${design.logoDisplay === 'none' ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Ban size={20} /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">Sem logo</span>
                </button>
            </div>
          )}
        </section>

        {/* BLOCO 5: ÍCONE DECORATIVO */}
        <section className="space-y-6">
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                <Sparkles size={14} /> 5. Ícone do Banner
            </h3>
            <p className="text-[9px] text-slate-500 uppercase font-bold mt-1 ml-6">Reforce o tema da sua promoção.</p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                          {design.iconName ? renderIcon(design.iconName, 'sm', 'text') : <Tag size={20} />}
                      </div>
                      <div>
                          <p className="text-xs font-bold text-white">{design.iconName ? 'Ícone Ativo' : 'Nenhum Ícone'}</p>
                          <p className="text-[8px] text-slate-500 uppercase font-black">Ilustração flutuante</p>
                      </div>
                  </div>
                  {design.iconName ? (
                      <button onClick={() => setDesign({...design, iconName: null})} className="p-2 text-rose-500 bg-rose-500/10 rounded-lg active:scale-90 transition-all"><Trash2 size={16} /></button>
                  ) : (
                      <button onClick={() => setShowIconPicker(true)} className="px-4 py-2 bg-[#1E5BFF] text-white text-[9px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all">Adicionar</button>
                  )}
              </div>
          </div>
        </section>

        {/* BLOCO 6: COMPORTAMENTO */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Zap size={14} /> 6. Layout & Animação
          </h3>
          <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1 block tracking-widest">Alinhamento</label>
                    <div className="flex gap-1 bg-slate-800 p-1.5 rounded-2xl border border-white/5">
                        <button onClick={() => setDesign({...design, align: 'left'})} className={`flex-1 p-2 rounded-xl flex justify-center transition-all ${design.align === 'left' ? 'bg-white text-black shadow-lg' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setDesign({...design, align: 'center'})} className={`flex-1 p-2 rounded-xl flex justify-center transition-all ${design.align === 'center' ? 'bg-white text-black shadow-lg' : 'text-slate-500'}`}><AlignCenter size={16}/></button>
                        <button onClick={() => setDesign({...design, align: 'right'})} className={`flex-1 p-2 rounded-xl flex justify-center transition-all ${design.align === 'right' ? 'bg-white text-black shadow-lg' : 'text-slate-500'}`}><AlignRight size={16}/></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1 block tracking-widest">Animação</label>
                    <select value={design.animation} onChange={e => setDesign({...design, animation: e.target.value as any})} className="w-full bg-slate-800 border border-white/5 rounded-2xl p-2.5 text-[10px] font-black uppercase text-white outline-none focus:border-blue-500 appearance-none shadow-inner">
                        <option value="none">Estático</option>
                        <option value="slide">Deslizar</option>
                        <option value="pulse">Pulsar</option>
                        <option value="float">Flutuar</option>
                    </select>
                </div>
              </div>
          </div>
        </section>

        {/* BUFFER DE SEGURANÇA */}
        <div className="py-12 flex flex-col items-center opacity-20">
            <Check size={32} className="text-blue-500" />
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] mt-2">Fim das configurações</p>
        </div>

      </main>

      {/* FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto">
        <button onClick={() => onSave(design)} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-[2rem] shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs">
          <Save size={18} /> CONCLUIR ARTE
        </button>
      </div>

      {/* MODAIS */}
      {showIconPicker && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-slate-900 rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500 border-t border-white/10 max-w-md mx-auto h-[70vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Ícones Disponíveis</h3>
              <button onClick={() => setShowIconPicker(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
                {ICON_CATEGORIES.map((cat, i) => (
                    <div key={i} className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2 block">{cat.label}</label>
                        <div className="grid grid-cols-5 gap-3">
                            {cat.icons.map(iconName => (
                                <button key={iconName} onClick={() => { setDesign({...design, iconName}); setShowIconPicker(false); }} className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${design.iconName === iconName ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{renderIcon(iconName, 'sm', design.iconName === iconName ? 'white' : 'text')}</button>
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
          <div className="w-full bg-slate-900 rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500 border-t border-white/10 max-w-md mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Cor Personalizada</h3>
              <button onClick={() => setShowColorPicker(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-crosshair border border-white/10" style={{ backgroundColor: `hsl(${customHue}, 100%, 50%)` }}
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
              <button onClick={() => setShowColorPicker(false)} className="w-full py-4 bg-[#1E5BFF] text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Aplicar Cor</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
