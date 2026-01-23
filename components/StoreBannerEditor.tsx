
import React from 'react';
import { 
  Flame, Zap, Percent, Tag, Gift, Utensils, Pizza, Coffee, Beef, IceCream,
  ShoppingCart, Store as StoreIcon, Package, Wrench, Truck, CreditCard, Coins, Star,
  Award, MapPin, Smile, Bell, Clock, Heart, Sparkles, Rocket, Megaphone, Crown, ShieldCheck
} from 'lucide-react';

export interface BannerDesign {
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

export const StoreBannerEditor: React.FC<{ 
  config: BannerDesign; 
  storeName: string; 
  storeLogo?: string | null; 
}> = ({ config, storeName, storeLogo }) => {
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
