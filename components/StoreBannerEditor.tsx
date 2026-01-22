
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sparkles, 
  Save, 
  Check, 
  Image as ImageIcon,
  MousePointer2,
  Layout
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

  return (
    <div className="fixed inset-0 z-[60] bg-[#020617] flex flex-col animate-in fade-in duration-300 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none text-white">Criar Banner</h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Editor Visual</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
        
        {/* PREVIEW SECTION */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Visualização em Tempo Real</h3>
          <div 
            className={`w-full aspect-[16/9] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-center border border-white/10 ${
              design.align === 'center' ? 'items-center text-center' : design.align === 'right' ? 'items-end text-right' : 'items-start text-left'
            } ${design.animation === 'pulse' ? 'animate-pulse' : design.animation === 'float' ? 'animate-float-slow' : ''}`}
            style={{ backgroundColor: design.bgColor }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className={`relative z-10 transition-all duration-500 ${design.animation === 'slide' ? 'animate-in slide-in-from-left-8' : ''}`}>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg mb-4 border border-white/20 w-fit">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: design.textColor }}>{storeName}</span>
              </div>
              <h2 className={`text-3xl font-black leading-tight mb-3 tracking-tighter ${design.font}`} style={{ color: design.textColor }}>
                {design.title}
              </h2>
              <p className="text-sm font-medium opacity-80 leading-relaxed max-w-[280px]" style={{ color: design.textColor }}>
                {design.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* EDIT CONTROLS */}
        <div className="space-y-10 pb-32">
          
          {/* TEXTO */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <Type size={14} /> Conteúdo do Banner
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Chamada Principal</label>
                <input 
                  type="text" 
                  value={design.title}
                  onChange={e => setDesign({...design, title: e.target.value})}
                  maxLength={40}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Descrição Curta</label>
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

          {/* ESTILO */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <Palette size={14} /> Estilo e Cores
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-3 block">Paleta sugerida</label>
                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-2">
                  {colors.map((c, i) => (
                    <button 
                      key={i}
                      onClick={() => setDesign({...design, bgColor: c.bg, textColor: c.text})}
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl border-4 transition-all ${design.bgColor === c.bg ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c.bg }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-3 block">Alinhamento</label>
                  <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setDesign({...design, align: 'left'})} className={`flex-1 p-2 rounded-lg flex justify-center ${design.align === 'left' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                    <button onClick={() => setDesign({...design, align: 'center'})} className={`flex-1 p-2 rounded-lg flex justify-center ${design.align === 'center' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}><AlignCenter size={16}/></button>
                    <button onClick={() => setDesign({...design, align: 'right'})} className={`flex-1 p-2 rounded-lg flex justify-center ${design.align === 'right' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500'}`}><AlignRight size={16}/></button>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-3 block">Animação</label>
                  <select 
                    value={design.animation}
                    onChange={e => setDesign({...design, animation: e.target.value as any})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white outline-none focus:border-blue-500"
                  >
                    {animations.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-3 block">Tipografia</label>
                <div className="grid grid-cols-1 gap-2">
                  {fonts.map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setDesign({...design, font: f.id})}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${design.font === f.id ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 bg-slate-900 text-slate-500'}`}
                    >
                      <span className={`text-sm font-bold ${f.id}`}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto">
        <button 
          onClick={() => onSave(design)}
          className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
        >
          <Save size={18} />
          Salvar arte e continuar
        </button>
      </div>
    </div>
  );
};
