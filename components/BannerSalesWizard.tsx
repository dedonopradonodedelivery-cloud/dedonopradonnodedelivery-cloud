import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, ArrowRight, Home, LayoutGrid, Zap, MapPin, 
  Upload, Paintbrush, Sparkles, Check, Crown, Info, 
  AlertTriangle, Image as ImageIcon, Type, AlignLeft, 
  AlignCenter, AlignRight, Maximize, Palette
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface BannerSalesWizardProps {
  user: User | null;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

type PlacementMode = 'HOME' | 'CAT' | 'COMBO';
type ArtType = 'MY_ART' | 'EDITOR' | 'PRO';

const BAIRROS = [
  "Taquara", "Freguesia", "Pechincha", "Curicica", "Anil", 
  "Tanque", "Praça Seca", "Gardênia Azul", "Cidade de Deus"
];

export const BannerSalesWizard: React.FC<BannerSalesWizardProps> = ({ user, onBack, onNavigate }) => {
  const [step, setStep] = useState(1);
  
  // States do Pedido
  const [placement, setPlacement] = useState<PlacementMode | null>(null);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [artType, setArtType] = useState<ArtType | null>(null);
  
  // States do Editor
  const [editorTitle, setEditorTitle] = useState('Oferta Especial');
  const [editorDesc, setEditorDesc] = useState('Confira nossos produtos');
  const [logoShape, setLogoShape] = useState<'round' | 'square'>('round');
  const [fontSize, setFontSize] = useState('text-xl');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#1E5BFF');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [animation, setAnimation] = useState<'none' | 'fade' | 'slide' | 'zoom' | 'pulse'>('none');

  // Cálculo de Preços e Descontos
  const prices = { HOME: 69.90, CAT: 49.90, COMBO: 99.90 };
  const proArtPrice = 89.90;

  const summary = useMemo(() => {
    if (!placement) return { base: 0, hoods: 0, discount: 0, total: 0 };
    
    const base = prices[placement];
    const numHoods = selectedHoods.length;
    let subtotal = base * numHoods;
    let discountPercent = 0;

    if (numHoods >= 9) discountPercent = 0.10;
    else if (numHoods >= 5) discountPercent = 0.05;

    const discountAmount = subtotal * discountPercent;
    let total = subtotal - discountAmount;

    if (artType === 'PRO') total += proArtPrice;

    return {
      base,
      hoods: numHoods,
      discount: discountAmount,
      total,
      percent: discountPercent * 100
    };
  }, [placement, selectedHoods, artType]);

  const toggleHood = (hood: string) => {
    if (hood === 'Todos') {
      setSelectedHoods(selectedHoods.length === BAIRROS.length ? [] : [...BAIRROS]);
      return;
    }
    setSelectedHoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 animate-in fade-in duration-500">
      
      {/* 1. HEADER FIXO COM RESUMO DINÂMICO */}
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="p-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 dark:text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Anunciar no Bairro</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase mt-1">Configuração de Destaque</p>
          </div>
        </div>

        {/* Bloco de Resumo Dinâmico */}
        <div className="px-5 pb-4">
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valor do Investimento</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-emerald-400">R$ {summary.total.toFixed(2)}</span>
                {summary.discount > 0 && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black">-{summary.percent}% OFF</span>
                )}
              </div>
            </div>
            <div className="text-right flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">{summary.hoods} bairro(s) selecionados</span>
              <span className="text-[9px] font-bold text-blue-400 uppercase">{placement || 'Sem posicionamento'}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="p-6 space-y-12">
        <header className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
            Seja visto exatamente por quem compra no seu bairro
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Escolha onde aparecer, personalize seu banner e conquiste mais clientes locais.
          </p>
        </header>

        {/* PASSO 1: POSICIONAMENTO */}
        <section className={`space-y-6 ${step > 1 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">1</div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Onde você quer aparecer?</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'HOME', label: 'Home', price: 'R$ 69,90', old: 'R$ 129,90', icon: <Home size={20}/>, desc: 'Visibilidade máxima' },
              { id: 'CAT', label: 'Categorias', price: 'R$ 49,90', old: 'R$ 89,90', icon: <LayoutGrid size={20}/>, desc: 'Foco na busca' },
              { id: 'COMBO', label: 'Home + Cat', price: 'R$ 99,90', old: 'R$ 219,80', icon: <Zap size={20}/>, desc: 'Combo Vantagem', popular: true }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => { setPlacement(opt.id as PlacementMode); if(step === 1) nextStep(); }}
                className={`relative flex flex-col items-center p-4 rounded-3xl border-2 transition-all text-center gap-2 ${placement === opt.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
              >
                {opt.popular && <span className="absolute -top-3 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Mais vendido</span>}
                <div className={`${placement === opt.id ? 'text-blue-600' : 'text-slate-400'}`}>{opt.icon}</div>
                <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">{opt.label}</span>
                <div>
                  <p className="text-[8px] text-slate-400 line-through leading-none">{opt.old}</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none mt-1">{opt.price}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* PASSO 2: BAIRROS */}
        <section className={`space-y-6 ${step !== 2 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">2</div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Em quais bairros você quer aparecer?</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => toggleHood('Todos')}
              className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${selectedHoods.length === BAIRROS.length ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
            >
              {selectedHoods.length === BAIRROS.length ? <CheckCircle2 className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
              Todos os bairros (10% OFF)
            </button>
            {BAIRROS.map(hood => (
              <button 
                key={hood}
                onClick={() => toggleHood(hood)}
                className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all ${selectedHoods.includes(hood) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'}`}
              >
                {hood}
              </button>
            ))}
          </div>
        </section>

        {/* PASSO 3: ARTE */}
        <section className={`space-y-8 ${step !== 3 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">3</div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Escolha sua arte</h3>
          </div>

          <div className="space-y-4">
            {/* OPÇÃO 1: UPLOAD */}
            <div 
              onClick={() => setArtType('MY_ART')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${artType === 'MY_ART' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600"><Upload size={24}/></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">Usar minha própria arte</h4>
                  <p className="text-xs text-slate-500">Sem custo adicional</p>
                </div>
              </div>
              {artType === 'MY_ART' && (
                <div className="mt-4 p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center">
                   <ImageIcon className="mx-auto text-slate-300 mb-2" size={32}/>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clique para subir imagem (1080x1080)</p>
                </div>
              )}
            </div>

            {/* OPÇÃO 2: EDITOR INTERNO */}
            <div 
              onClick={() => setArtType('EDITOR')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${artType === 'EDITOR' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600"><Paintbrush size={24}/></div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">Personalizar no Editor</h4>
                  <p className="text-xs text-slate-500">Crie seu banner em segundos</p>
                </div>
              </div>

              {artType === 'EDITOR' && (
                <div className="mt-6 space-y-8 animate-in slide-in-from-top-4">
                  {/* Preview do Banner */}
                  <div 
                    className={`aspect-square w-full rounded-2xl flex flex-col p-8 shadow-2xl relative overflow-hidden transition-all duration-700 ${animation === 'pulse' ? 'animate-pulse' : animation === 'zoom' ? 'hover:scale-105' : ''}`}
                    style={{ backgroundColor: bgColor, color: textColor, alignItems: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start', textAlign }}
                  >
                    <div className={`w-16 h-16 bg-white/20 mb-6 flex items-center justify-center border border-white/20 ${logoShape === 'round' ? 'rounded-full' : 'rounded-lg'}`}>
                       <StoreIcon size={32} className="opacity-40" />
                    </div>
                    <h4 className={`font-black uppercase leading-tight tracking-tighter ${fontSize}`}>{editorTitle}</h4>
                    <p className="text-sm mt-2 opacity-80 font-medium">{editorDesc}</p>
                  </div>

                  {/* Controles do Editor */}
                  <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo</label>
                      <input value={editorTitle} onChange={e => setEditorTitle(e.target.value)} placeholder="Título do Banner" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold"/>
                      <input value={editorDesc} onChange={e => setEditorDesc(e.target.value)} placeholder="Subtítulo curto" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-medium"/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fundo</label>
                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none p-1 bg-slate-100"/>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Texto</label>
                        <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer border-none p-1 bg-slate-100"/>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alinhamento</label>
                      <div className="flex gap-2">
                        <button onClick={() => setTextAlign('left')} className={`flex-1 p-2 rounded-lg border ${textAlign === 'left' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setTextAlign('center')} className={`flex-1 p-2 rounded-lg border ${textAlign === 'center' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}><AlignCenter size={16}/></button>
                        <button onClick={() => setTextAlign('right')} className={`flex-1 p-2 rounded-lg border ${textAlign === 'right' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}><AlignRight size={16}/></button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Efeito Especial</label>
                      <div className="flex flex-wrap gap-2">
                        {['none', 'fade', 'slide', 'zoom', 'pulse'].map(anim => (
                          <button key={anim} onClick={() => setAnimation(anim as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border ${animation === anim ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}>
                            {anim}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* OPÇÃO 3: DESIGN PROFISSIONAL */}
            <div 
              onClick={() => setArtType('PRO')}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${artType === 'PRO' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-100 dark:border-slate-800'}`}
            >
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Recomendado</div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600"><Crown size={24}/></div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase">Design com Time Localizei</h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="text-[10px] text-slate-400 line-through font-bold">R$ 149,90</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">R$ 89,90</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium">
                Nossa equipe de designers cria seu banner profissionalmente em até 24h. Suporte via chat incluso.
              </p>
            </div>
          </div>
        </section>

        {/* FINALIZAÇÃO E GATILHOS */}
        <section className="pt-8 space-y-6">
            <div className="space-y-4">
               <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[10px] text-amber-800 dark:text-amber-200 font-bold uppercase leading-tight">
                    Apenas 2 anunciantes por categoria e bairro. O espaço será bloqueado automaticamente após sua compra.
                  </p>
               </div>
            </div>

            <button 
                disabled={!placement || selectedHoods.length === 0 || !artType}
                onClick={() => alert('Parabéns! Pedido realizado. Redirecionando para pagamento...')}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50 disabled:grayscale"
            >
                Ativar meu destaque agora
                <ArrowRight size={20}/>
            </button>
            <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Pagamento Seguro via Localizei Pay</p>
        </section>
      </main>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <path d="m9 11 3 3L22 4"/>
  </svg>
);

const StoreIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
    <path d="M2 7h20"/>
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
  </svg>
);
