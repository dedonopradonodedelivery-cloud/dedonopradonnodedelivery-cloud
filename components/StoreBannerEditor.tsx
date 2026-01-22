
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Save, 
  Image as ImageIcon,
  X,
  Check
} from 'lucide-react';

interface BannerDesign {
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  font: string;
  align: 'left' | 'center' | 'right';
  animation: 'none' | 'slide' | 'pulse' | 'float';
}

interface StoreBannerEditorProps {
  storeName: string;
  onSave: (design: BannerDesign) => void;
  onBack: () => void;
}

export const StoreBannerEditor: React.FC<StoreBannerEditorProps> = ({ storeName, onSave, onBack }) => {
  const [design, setDesign] = useState<BannerDesign>({
    title: 'Sua oferta principal aqui',
    subtitle: 'Uma descrição curta e impactante para o bairro.',
    bgColor: '#1E5BFF',
    textColor: '#FFFFFF',
    font: 'font-display',
    align: 'left',
    animation: 'none'
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customHue, setCustomHue] = useState(220); // Azul padrão

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 10);
  };

  const fonts = [
    { id: 'font-sans', name: 'Poppins (Moderno)' },
    { id: 'font-display', name: 'Outfit (Premium)' },
    { id: 'serif', name: 'Georgia (Clássico)' },
  ];

  const colors = [
    { bg: '#1E5BFF', text: '#FFFFFF', name: 'Azul Localizei' },
    { bg: '#0F172A', text: '#FFFFFF', name: 'Dark' },
    { bg: '#FFFFFF', text: '#0F172A', name: 'Clean' },
    { bg: '#FBBF24', text: '#000000', name: 'Alerta' },
    { bg: '#EF4444', text: '#FFFFFF', name: 'Promo' },
    { bg: '#10B981', text: '#FFFFFF', name: 'Sucesso' },
  ];

  const animations = [
    { id: 'none', name: 'Estático' },
    { id: 'slide', name: 'Deslizar' },
    { id: 'pulse', name: 'Pulsar' },
    { id: 'float', name: 'Flutuar' },
  ];

  // Helper para decidir se o texto deve ser branco ou preto baseado na cor de fundo (Luminosidade HSL)
  const updateCustomColor = (h: number, s: number, l: number) => {
    const color = `hsl(${h}, ${s}%, ${l}%)`;
    const textColor = l > 65 ? '#0F172A' : '#FFFFFF';
    setDesign({ ...design, bgColor: color, textColor });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#020617] flex flex-col animate-in fade-in duration-300 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl shrink-0">
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

      {/* STICKY PREVIEW */}
      <div className={`w-full px-6 py-4 bg-slate-900/40 backdrop-blur-md border-b border-white/5 transition-all duration-300 z-20 ${isScrolled ? 'shadow-2xl shadow-blue-500/10' : ''}`}>
        <div className={`transition-all duration-500 mx-auto max-w-sm ${isScrolled ? 'scale-90 -my-2' : 'scale-100'}`}>
          <div 
            className={`w-full aspect-[16/9] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-center border border-white/10 ${
              design.align === 'center' ? 'items-center text-center' : design.align === 'right' ? 'items-end text-right' : 'items-start text-left'
            } ${design.animation === 'pulse' ? 'animate-pulse' : design.animation === 'float' ? 'animate-float-slow' : ''}`}
            style={{ backgroundColor: design.bgColor }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className={`relative z-10 transition-all duration-500 ${design.animation === 'slide' ? 'animate-in slide-in-from-left-8' : ''}`}>
              <div className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg mb-3 border border-white/20 w-fit">
                <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: design.textColor }}>{storeName}</span>
              </div>
              <h2 className={`text-2xl font-black leading-tight mb-2 tracking-tighter line-clamp-2 ${design.font}`} style={{ color: design.textColor }}>
                {design.title}
              </h2>
              <p className="text-[11px] font-medium opacity-80 leading-snug max-w-[240px] line-clamp-2" style={{ color: design.textColor }}>
                {design.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE EDITOR */}
      <main onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-40">
        
        {/* TEXTO */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Type size={14} /> 1. Mensagem Principal
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Chamada do Banner</label>
              <input 
                type="text" 
                value={design.title}
                onChange={e => setDesign({...design, title: e.target.value})}
                maxLength={40}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Descrição Detalhada</label>
              <textarea 
                value={design.subtitle}
                onChange={e => setDesign({...design, subtitle: e.target.value})}
                maxLength={100}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-medium text-white outline-none focus:border-blue-500 transition-all resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* CORES */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <Palette size={14} /> 2. Estilo de Cores
          </h3>
          <div className="space-y-4">
            <p className="text-[10px] text-slate-500 font-medium ml-1">Escolha uma cor pronta ou personalize.</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 pb-2">
              {colors.map((c, i) => (
                <button 
                  key={i}
                  onClick={() => setDesign({...design, bgColor: c.bg, textColor: c.text})}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl border-4 transition-all active:scale-90 ${design.bgColor === c.bg ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.bg }}
                />
              ))}
              {/* Botão Personalizar */}
              <button 
                onClick={() => setShowColorPicker(true)}
                className={`flex-shrink-0 w-12 h-12 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${showColorPicker ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}`}
              >
                <Palette size={16} className="text-slate-400" />
                <span className="text-[7px] font-black text-slate-500 uppercase">Custom</span>
              </button>
            </div>
          </div>
        </div>

        {/* ALINHAMENTO E EFEITO */}
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
            <select 
              value={design.animation}
              onChange={e => setDesign({...design, animation: e.target.value as any})}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-2.5 text-xs font-bold text-white outline-none focus:border-blue-500 appearance-none"
            >
              {animations.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* TIPOGRAFIA */}
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-500 uppercase ml-1 block tracking-widest">Estilo da Letra</label>
          <div className="grid grid-cols-1 gap-3">
            {fonts.map(f => (
              <button 
                key={f.id}
                onClick={() => setDesign({...design, font: f.id})}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${design.font === f.id ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg' : 'border-white/5 bg-slate-900 text-slate-500'}`}
              >
                <span className={`text-sm font-bold ${f.id}`}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* COLOR PICKER BOTTOM SHEET */}
      {showColorPicker && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-slate-900 rounded-t-[3rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500 border-t border-white/10 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Palette size={20} />
                </div>
                <h3 className="text-white font-bold">Cor Personalizada</h3>
              </div>
              <button onClick={() => setShowColorPicker(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              {/* Mapa de Cor (Saturação e Luminosidade) */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tom e Brilho</label>
                <div 
                  className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-crosshair"
                  style={{ backgroundColor: `hsl(${customHue}, 100%, 50%)` }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                      updateCustomColor(customHue, x, 100 - y);
                    }
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
                    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
                    updateCustomColor(customHue, x, 100 - y);
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-100"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-100"></div>
                  {/* Indicador de posição (opcionalmente pode ser implementado com estado para precisão total) */}
                </div>
              </div>

              {/* Slider de Hue (Matiz) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Matiz Base</label>
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: `hsl(${customHue}, 100%, 50%)` }}></div>
                </div>
                <input 
                  type="range" min="0" max="360" value={customHue}
                  onChange={(e) => {
                    const h = parseInt(e.target.value);
                    setCustomHue(h);
                    updateCustomColor(h, 100, 50);
                  }}
                  className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={() => setShowColorPicker(false)}
                  className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowColorPicker(false)}
                  className="w-full py-4 bg-[#1E5BFF] text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20"
                >
                  Aplicar Cor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto">
        <button 
          onClick={() => onSave(design)}
          className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-[2rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs"
        >
          <Save size={18} />
          CONCLUIR ARTE
        </button>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};
