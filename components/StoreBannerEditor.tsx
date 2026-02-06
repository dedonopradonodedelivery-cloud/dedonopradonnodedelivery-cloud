
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, AlignLeft, AlignCenter, AlignRight, 
  Image as ImageIcon, Palette, Layout, Sparkles, 
  Check, Info, MousePointer2, Type, Circle, Square,
  Eye, EyeOff, Tag
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

const SIMPLE_COLORS = ['#1E5BFF', '#111827', '#059669', '#DC2626', '#7C3AED', '#F59E0B'];

const CATEGORY_IMAGES: Record<string, string[]> = {
  'Alimentação': [
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
  const isImage = config.bgType !== 'color';
  
  // Proteção automática de contraste: Em imagens, forçamos texto branco com sombreamento/scrim
  const textColor = config.bgType === 'color' && config.bgValue === '#FFFFFF' ? 'text-slate-900' : 'text-white';
  const logoBg = config.bgValue === '#FFFFFF' ? 'bg-slate-100' : 'bg-white/10';

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-900 animate-in fade-in zoom-in-95 duration-500">
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
          <div className={`absolute p-1 backdrop-blur-md border border-white/20 shadow-xl ${logoBg} ${
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
            config.offer.length > 20 ? 'text-xl' : 'text-3xl'
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
  const [activeTab, setActiveTab] = useState<'content' | 'background' | 'style'>('content');
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
      <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl p