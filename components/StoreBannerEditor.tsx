
import React, { useState } from 'react';
import { 
  ChevronLeft, X, Save, Palette, Type, AlignLeft, Sparkles, Image as ImageIcon,
  Flame, Zap, Percent, Tag, Gift, Utensils, Pizza, Coffee, Beef, IceCream,
  ShoppingCart, Store as StoreIcon, Package, Wrench, Truck, CreditCard, Coins, Star,
  Award, MapPin, Smile, Bell, Clock, Heart, Megaphone, Crown, ShieldCheck, Rocket
} from 'lucide-react';
// FIX: Import BannerDesign interface from the central types file
import { BannerDesign } from '../types';

interface StoreBannerEditorProps {
  storeName: string;
  storeLogo?: string | null;
  onSave: (design: BannerDesign) => void;
  onBack: () => void;
}

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Flame, Zap, Percent, Tag, Gift, Utensils, Pizza, Coffee, Beef, IceCream,
  ShoppingCart, Store: StoreIcon, Package, Wrench, Truck, CreditCard, Coins, Star,
  Award, MapPin, Smile, Bell, Clock, Heart, Sparkles, Rocket, Megaphone, Crown, ShieldCheck
};

const FONT_STYLES = [
  { id: 'font-moderna', name: 'Moderna', family: "'Outfit', sans-serif" },
  { id: 'font-forte', name: 'Forte', family: "'Inter', sans-serif", weight: '900' },
  { id: 'font-elegante', name: 'Elegante', family: "'Lora', serif" },
  { id: 'font-amigavel', name: 'Amigável', family: "'Quicksand', sans-serif" },
  { id: 'font-neutra', name: 'Neutra', family: "'Inter', sans-serif" },
  { id: 'font-impacto', name: 'Impacto', family: "'Anton', sans-serif" },
];

const SIZE_LEVELS = [
  { id: 'xs', name: 'M. Pequeno', titleClass: 'text-lg', subClass: 'text-[9px]' },
  { id: 'sm', name: 'Pequeno', titleClass: 'text-xl', subClass: 'text-[10px]' },
  { id: 'md', name: 'Médio', titleClass: 'text-2xl', subClass: 'text-xs' },
  { id: 'lg', name: 'Grande', titleClass: 'text-3xl', subClass: 'text-sm' },
  { id: 'xl', name: 'M. Grande', titleClass: 'text-4xl', subClass: 'text-base' },
];


const BannerPreview: React.FC<{ config: BannerDesign; storeName: string; storeLogo?: string | null; }> = ({ config, storeName, storeLogo }) => {
    const { 
      title, subtitle, titleFont, titleSize, subtitleFont, subtitleSize, 
      bgColor, textColor, align, animation, iconName, iconPos, iconSize, 
      logoDisplay, iconColorMode, iconCustomColor 
    } = config;

    const renderIcon = (name: string | null, size: 'sm' | 'md' | 'lg', colorMode: string) => {
      if (!name || !ICON_COMPONENTS[name]) return null;
      const IconComp = ICON_COMPONENTS[name];
      const sizes = { sm: 24, md: 44, lg: 64 };
      const colors: Record<string, string> = { text: textColor, white: '#FFFFFF', black: '#000000', custom: iconCustomColor || '#1E5BFF' };
      return <IconComp size={sizes[size]} style={{ color: colors[colorMode] }} strokeWidth={2.5} />;
    };

    const getFontStyle = (fontId: string) => {
      const f = FONT_STYLES.find(x => x.id === fontId);
      return f ? { fontFamily: f.family, fontWeight: f.weight || '700' } : {};
    };
    
    return (
      <div 
        className={`w-full h-full p-8 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-center border border-white/10 ${
          align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'
        } ${animation === 'pulse' ? 'animate-pulse' : animation === 'float' ? 'animate-float-slow' : ''}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className={`relative z-10 transition-all duration-500 flex ${iconPos === 'top' ? 'flex-col items-inherit' : iconPos === 'right' ? 'flex-row-reverse items-center gap-4' : 'flex-row items-center gap-4'} ${animation === 'slide' ? 'animate-in slide-in-from-left-8' : ''}`}>
          {iconName && (
            <div className={`${iconPos === 'top' ? 'mb-4' : ''} shrink-0`}>
                {renderIcon(iconName, iconSize, iconColorMode)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 w-fit transition-all duration-300">
              {logoDisplay !== 'none' && storeLogo && (
                  <div className={`shrink-0 overflow-hidden bg-white/20 p-0.5 border border-white/20 transition-all duration-300 ${logoDisplay === 'round' ? 'rounded-full' : 'rounded-lg'}`}>
                      <img src={storeLogo} className={`w-5 h-5 object-contain transition-all duration-300 ${logoDisplay === 'round' ? 'rounded-full' : 'rounded-md'}`} alt="Logo" />
                  </div>
              )}
              <div className="bg-black/10 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 w-fit">
                  <span className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: textColor }}>{storeName}</span>
              </div>
            </div>
            <h2 
              className={`font-black leading-tight mb-2 tracking-tight line-clamp-2 transition-all duration-300 ${SIZE_LEVELS.find(s => s.id === titleSize)?.titleClass}`} 
              style={{ ...getFontStyle(titleFont), color: textColor }}
            >
                {title}
            </h2>
            <p 
              className={`font-medium opacity-80 leading-snug max-w-[280px] line-clamp-2 transition-all duration-300 ${SIZE_LEVELS.find(s => s.id === subtitleSize)?.subClass}`} 
              style={{ ...getFontStyle(subtitleFont), color: textColor }}
            >
                {subtitle}
            </p>
          </div>
        </div>
      </div>
    );
};

export const StoreBannerEditor: React.FC<StoreBannerEditorProps> = ({ storeName, storeLogo, onSave, onBack }) => {
  const [config, setConfig] = useState<BannerDesign>({
    title: 'Sua Oferta de Destaque',
    subtitle: 'Descreva os benefícios para o cliente em poucas palavras.',
    titleFont: 'font-impacto',
    titleSize: 'lg',
    subtitleFont: 'font-neutra',
    subtitleSize: 'md',
    bgColor: '#1E5BFF',
    textColor: '#FFFFFF',
    align: 'left',
    animation: 'none',
    iconName: 'Sparkles',
    iconPos: 'left',
    iconSize: 'md',
    logoDisplay: 'round',
    iconColorMode: 'white',
    iconCustomColor: '#FFFFFF',
  });

  const updateConfig = (key: keyof BannerDesign, value: any) => {
    setConfig(prev => ({...prev, [key]: value}));
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900 text-white z-[200] flex flex-col font-sans">
      <header className="flex-shrink-0 bg-slate-800 p-4 flex justify-between items-center border-b border-white/10">
        <button onClick={onBack} className="p-2 text-slate-300 hover:text-white"><ChevronLeft /></button>
        <h1 className="font-bold">Editor de Banner</h1>
        <button onClick={() => onSave(config)} className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform"><Save size={16} /> Salvar</button>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-slate-950 p-4 overflow-y-auto no-scrollbar space-y-6">
          <h2 className="text-xs font-bold uppercase text-slate-500">Conteúdo</h2>
          <div className="space-y-3">
            <div>
                <label className="text-xs">Título</label>
                <input type="text" value={config.title} onChange={e => updateConfig('title', e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1 text-sm border border-slate-700" />
            </div>
            <div>
                <label className="text-xs">Subtítulo</label>
                <textarea value={config.subtitle} onChange={e => updateConfig('subtitle', e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1 text-sm h-20 resize-none border border-slate-700" />
            </div>
          </div>

          <h2 className="text-xs font-bold uppercase text-slate-500 mt-6">Design</h2>
          <div className="space-y-3">
             <div>
                <label className="text-xs">Cor de Fundo</label>
                <input type="color" value={config.bgColor} onChange={e => updateConfig('bgColor', e.target.value)} className="w-full h-10 mt-1" />
            </div>
            <div>
                <label className="text-xs">Cor do Texto</label>
                <input type="color" value={config.textColor} onChange={e => updateConfig('textColor', e.target.value)} className="w-full h-10 mt-1" />
            </div>
             <div>
                <label className="text-xs">Fonte do Título</label>
                <select value={config.titleFont} onChange={e => updateConfig('titleFont', e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1 text-sm border border-slate-700">
                  {FONT_STYLES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
            </div>
             <div>
                <label className="text-xs">Alinhamento</label>
                <select value={config.align} onChange={e => updateConfig('align', e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1 text-sm border border-slate-700">
                  <option value="left">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="right">Direita</option>
                </select>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-8 bg-slate-900">
           <div className="w-full max-w-lg aspect-[3/2]">
             <BannerPreview config={config} storeName={storeName} storeLogo={storeLogo} />
           </div>
        </main>
      </div>
    </div>
  );
};
