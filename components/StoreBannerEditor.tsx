import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Save, Palette, Type, Layout, Sparkles, 
  Image as ImageIcon, Check, Crown, ShieldCheck, 
  Rocket, Megaphone, Zap, Flame, Star, Award, 
  Maximize, MousePointer2, Layers, Monitor, AlignLeft,
  AlignCenter, AlignRight
} from 'lucide-react';

export interface BannerDesign {
  title: string;
  subtitle: string;
  layout: 'split' | 'centered' | 'footer' | 'card' | 'stacked';
  stylePreset: 'pro' | 'impact' | 'dark' | 'offer';
  bgType: 'color' | 'image';
  bgColor: string;
  bgImage: string;
  textColor: string;
  accentColor: string;
  titleFont: string;
  titleSize: 'sm' | 'md' | 'lg' | 'xl';
  animation: 'none' | 'zoom' | 'shimmer' | 'pulse' | 'slide';
  logoSize: 'sm' | 'md';
  logoPos: 'top' | 'bottom';
  logoDisplay: 'square' | 'round' | 'none';
  iconName: string | null;
  align: 'left' | 'center' | 'right';
}

const BG_LIBRARY = [
  { id: 'mesh-blue', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', category: 'Mesh Gradient' },
  { id: 'dark-tech', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop', category: 'Premium Dark' },
  { id: 'neon-vibe', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', category: 'Neon Glow' },
  { id: 'soft-texture', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop', category: 'Soft' },
  { id: 'geometric', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop', category: 'Geometric' },
  { id: 'gold-luxury', url: 'https://images.unsplash.com/photo-1502239608882-93b729c6af43?q=80&w=800&auto=format&fit=crop', category: 'Premium' },
  { id: 'abstract-red', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop', category: 'Abstract' },
  { id: 'minimal-white', url: 'https://images.unsplash.com/photo-1483712646219-da823524b0af?q=80&w=800&auto=format&fit=crop', category: 'Minimal' },
  { id: 'deep-ocean', url: 'https://images.unsplash.com/photo-1554147090-e1121a5445f1?q=80&w=800&auto=format&fit=crop', category: 'Gradient' },
  { id: 'silk-black', url: 'https://images.unsplash.com/photo-1531685250084-75a721df4990?q=80&w=800&auto=format&fit=crop', category: 'Premium' },
];

const STYLE_PRESETS: Record<string, Partial<BannerDesign>> = {
  pro: { titleFont: "'Outfit', sans-serif", titleSize: 'lg', animation: 'slide', textColor: '#FFFFFF', accentColor: '#1E5BFF' },
  impact: { titleFont: "'Anton', sans-serif", titleSize: 'xl', animation: 'zoom', textColor: '#FFFFFF', accentColor: '#FBBF24' },
  dark: { titleFont: "'Outfit', sans-serif", titleSize: 'lg', animation: 'shimmer', textColor: '#E2E8F0', accentColor: '#94A3B8' },
  offer: { titleFont: "'Inter', sans-serif", titleSize: 'xl', animation: 'pulse', textColor: '#FFFFFF', accentColor: '#DC2626' },
};

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Sparkles, Rocket, Megaphone, Crown, ShieldCheck, Zap, Flame, Star, Award
};

interface StoreBannerEditorProps {
  storeName: string;
  storeLogo?: string | null;
  onSave: (design: BannerDesign) => void;
  onBack: () => void;
}

const BannerPreview: React.FC<{ config: BannerDesign; storeName: string; storeLogo?: string | null; }> = ({ config, storeName, storeLogo }) => {
  const { 
    title, subtitle, layout, bgType, bgColor, bgImage, 
    textColor, accentColor, titleFont, titleSize, animation,
    logoSize, logoPos, logoDisplay, iconName, align
  } = config;

  const IconComp = iconName ? ICON_COMPONENTS[iconName] : null;

  const animationClasses = {
    none: '',
    zoom: 'animate-[zoom-slow_20s_infinite_alternate]',
    shimmer: 'after:content-[""] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:animate-[slow-shimmer_4s_linear_infinite]',
    pulse: 'animate-[pulse_4s_ease-in-out_infinite]',
    slide: 'animate-in slide-in-from-left-8 duration-1000'
  };

  const layoutClasses = {
    split: `flex-row items-center justify-between p-12 text-${align}`,
    centered: `flex-col items-center justify-center p-12 text-${align}`,
    footer: `flex-col items-start justify-end p-12 text-${align}`,
    card: `flex-col items-center justify-center p-12 text-${align}`,
    stacked: `flex-col items-start justify-start p-12 text-${align} gap-4`
  };

  return (
    <div className="relative group w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
      {/* Background Layer */}
      <div className={`absolute inset-0 transition-all duration-700 ${animationClasses[animation]}`}>
        {bgType === 'image' ? (
          <img src={bgImage} className="w-full h-full object-cover" alt="Background" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: bgColor }}></div>
        )}
        <div className={`absolute inset-0 ${bgType === 'image' ? 'bg-black/40' : 'bg-transparent'}`}></div>
      </div>

      {/* Content Container */}
      <div className={`relative z-10 w-full h-full flex ${layoutClasses[layout]}`}>
        
        {/* Logo Positioned */}
        {logoDisplay !== 'none' && storeLogo && (
          <div className={`absolute ${logoPos === 'top' ? 'top-8' : 'bottom-8'} ${layout === 'centered' || layout === 'card' ? 'left-1/2 -translate-x-1/2' : 'left-8'} z-20`}>
            <div className={`backdrop-blur-md bg-white/20 p-1.5 border border-white/20 shadow-xl ${logoDisplay === 'round' ? 'rounded-full' : 'rounded-2xl'}`}>
              <img src={storeLogo} className={`${logoSize === 'sm' ? 'w-8 h-8' : 'w-12 h-12'} object-contain ${logoDisplay === 'round' ? 'rounded-full' : 'rounded-xl'}`} alt="Logo" />
            </div>
          </div>
        )}

        {/* Text Group */}
        <div className={`${layout === 'card' ? 'bg-black/30 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl' : ''} max-w-[80%] flex flex-col ${align === 'center' ? 'items-center' : align === 'right' ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-3 mb-4 opacity-80" style={{ color: accentColor }}>
            {IconComp && <IconComp size={24} strokeWidth={2.5} />}
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{storeName}</span>
          </div>
          
          <h2 
            className={`font-black leading-[0.95] mb-4 tracking-tighter transition-all duration-500 ${
              titleSize === 'xl' ? 'text-6xl' : titleSize === 'lg' ? 'text-5xl' : titleSize === 'md' ? 'text-4xl' : 'text-3xl'
            }`} 
            style={{ fontFamily: titleFont, color: textColor }}
          >
            {title}
          </h2>
          
          <p className="text-lg font-medium leading-relaxed opacity-70" style={{ color: textColor }}>
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Aesthetic Border Highlight */}
      <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none"></div>
    </div>
  );
};

export const StoreBannerEditor: React.FC<StoreBannerEditorProps> = ({ storeName, storeLogo, onSave, onBack }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'style' | 'logo'>('content');
  const [config, setConfig] = useState<BannerDesign>({
    title: 'Sua Oferta Premium',
    subtitle: 'Qualidade absoluta para você e sua família.',
    layout: 'split',
    stylePreset: 'pro',
    bgType: 'image',
    bgColor: '#1E5BFF',
    bgImage: BG_LIBRARY[0].url,
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    titleFont: "'Outfit', sans-serif",
    titleSize: 'lg',
    animation: 'slide',
    logoSize: 'sm',
    logoPos: 'top',
    logoDisplay: 'round',
    iconName: 'Sparkles',
    align: 'left'
  });

  const applyPreset = (presetId: string) => {
    const preset = STYLE_PRESETS[presetId];
    setConfig(prev => ({ ...prev, ...preset, stylePreset: presetId as any }));
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-white z-[200] flex flex-col font-sans overflow-hidden">
      {/* Header Estilo Apple */}
      <header className="flex-shrink-0 bg-slate-900/50 backdrop-blur-xl p-4 px-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-sm uppercase tracking-widest text-white">Editor de Banner</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase">{storeName}</p>
          </div>
        </div>
        <button 
          onClick={() => onSave(config)} 
          className="bg-[#1E5BFF] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Save size={16} /> Publicar
        </button>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar de Ferramentas */}
        <aside className="w-80 bg-slate-950/80 border-r border-white/5 flex flex-col shrink-0">
          <nav className="flex border-b border-white/5 p-2 gap-1">
            {[
              { id: 'content', icon: Type, label: 'Texto' },
              { id: 'layout', icon: Layout, label: 'Grade' },
              { id: 'style', icon: Palette, label: 'Arte' },
              { id: 'logo', icon: ImageIcon, label: 'Marca' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
              >
                <tab.icon size={18} />
                <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
            
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Título Principal</label>
                  <textarea 
                    value={config.title} 
                    onChange={e => setConfig({...config, title: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-sm font-bold focus:border-blue-500 outline-none resize-none h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtítulo</label>
                  <textarea 
                    value={config.subtitle} 
                    onChange={e => setConfig({...config, subtitle: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none resize-none h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ícone de Apoio</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.keys(ICON_COMPONENTS).map(name => (
                      <button 
                        key={name}
                        onClick={() => setConfig({...config, iconName: name === config.iconName ? null : name})}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${config.iconName === name ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                      >
                        {React.createElement(ICON_COMPONENTS[name], { size: 18 })}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grade Editorial</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'split', label: 'Editorial Lado a Lado' },
                      { id: 'centered', label: 'Impacto Central' },
                      { id: 'footer', label: 'Revista (Base)' },
                      { id: 'card', label: 'Floating Card' },
                      { id: 'stacked', label: 'Lista Dinâmica' }
                    ].map(l => (
                      <button 
                        key={l.id} 
                        onClick={() => setConfig({...config, layout: l.id as any})}
                        className={`w-full p-4 rounded-xl border-2 text-left text-xs font-bold transition-all ${config.layout === l.id ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-slate-900 text-slate-400'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alinhamento</label>
                  <div className="flex bg-slate-900 rounded-xl p-1 gap-1">
                    {(['left', 'center', 'right'] as const).map(align => (
                        <button 
                            key={align} 
                            onClick={() => setConfig({...config, align})}
                            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${config.align === align ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                        >
                            {align === 'left' ? <AlignLeft size={16}/> : align === 'center' ? <AlignCenter size={16}/> : <AlignRight size={16}/>}
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Presets de Estilo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pro', label: 'Profissional' },
                      { id: 'impact', label: 'Impactante' },
                      { id: 'dark', label: 'Premium Dark' },
                      { id: 'offer', label: 'Oferta Direta' }
                    ].map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => applyPreset(p.id)}
                        className={`p-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${config.stylePreset === p.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900 text-slate-500'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Atmosfera (Fundo)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {BG_LIBRARY.map(bg => (
                      <button 
                        key={bg.id}
                        onClick={() => setConfig({...config, bgType: 'image', bgImage: bg.url})}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${config.bgImage === bg.url && config.bgType === 'image' ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-transparent opacity-60'}`}
                      >
                        <img src={bg.url} className="w-full h-full object-cover" alt={bg.category} />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[7px] font-black uppercase tracking-widest text-center text-white">{bg.category}</div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setConfig({...config, bgType: 'color'})} className={`w-full py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${config.bgType === 'color' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900 text-slate-500'}`}>Usar Cor Sólida</button>
                </div>
              </div>
            )}

            {activeTab === 'logo' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exibição da Logo</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['round', 'square', 'none'].map(mode => (
                      <button key={mode} onClick={() => setConfig({...config, logoDisplay: mode as any})} className={`py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest ${config.logoDisplay === mode ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900 text-slate-500'}`}>{mode}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Posição da Logo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setConfig({...config, logoPos: 'top'})} className={`py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest ${config.logoPos === 'top' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900 text-slate-500'}`}>Topo</button>
                    <button onClick={() => setConfig({...config, logoPos: 'bottom'})} className={`py-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest ${config.logoPos === 'bottom' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900 text-slate-500'}`}>Rodapé</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Palco de Visualização (Preview) */}
        <main className="flex-1 flex items-center justify-center p-12 bg-[#020617] relative">
          {/* Background Decorativo do Stage */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="w-full max-w-4xl relative perspective-1000">
            <div className="relative transform transition-all duration-700 hover:rotate-0">
               <BannerPreview config={config} storeName={storeName} storeLogo={storeLogo} />
            </div>
            
            {/* Etiquetas de Destaque no Preview */}
            <div className="absolute -top-10 -left-6 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl animate-bounce-slow">
               <Sparkles size={14} className="text-amber-400" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Design Premium Ativo</span>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes zoom-slow {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};
