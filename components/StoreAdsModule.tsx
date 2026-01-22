
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  X, 
  ArrowRight, 
  Check, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Sparkles, 
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Loader2,
  Star
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
}

const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const DISPLAY_MODES = [
  { id: 'home', label: 'Home', sub: 'Maior destaque no app', icon: Home },
  { id: 'cat', label: 'Categorias', sub: 'Momento da busca', icon: LayoutGrid },
  { id: 'combo', label: 'Home + Cat', sub: 'Alcance máximo', icon: Zap, recommended: true },
];

const PRICING = {
  home: { original: 199.90, promo: 89.90, off: '55% OFF', save: 110.00 },
  cat: { original: 149.90, promo: 49.90, off: '67% OFF', save: 100.00 },
  combo: { original: 349.80, promo: 119.90, off: '66% OFF', save: 229.90 },
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName }) => {
  const [step, setStep] = useState<'sales' | 'art'>('sales');
  const [selectedMode, setSelectedMode] = useState<'home' | 'cat' | 'combo'>('combo');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(["Freguesia"]);
  const [artChoice, setArtChoice] = useState<'own' | 'pro'>('own');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lógica: Preço base do plano + R$ 20 por bairro extra
  const totalAmount = useMemo(() => {
    const base = PRICING[selectedMode].promo;
    const extras = Math.max(0, selectedNeighborhoods.length - 1) * 20.00;
    const artExtra = step === 'art' && artChoice === 'pro' ? 69.90 : 0;
    return base + extras + artExtra;
  }, [selectedMode, selectedNeighborhoods, artChoice, step]);

  const toggleNeighborhood = (hood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  const handleNextStep = () => {
    if (step === 'sales') setStep('art');
    else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Encaminhando para pagamento seguro...");
      }, 1500);
    }
  };

  const renderSalesStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
      {/* 1. ONDE DESEJA APARECER */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2">
          <Target size={14} /> 1. Onde deseja aparecer?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {DISPLAY_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id as any)}
              className={`relative flex flex-col items-center text-center p-4 rounded-3xl border-2 transition-all duration-300 min-h-[140px] justify-center gap-2 ${
                selectedMode === mode.id 
                ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(30,91,255,0.15)]' 
                : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              {mode.recommended && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                  Recomendado
                </div>
              )}
              <div className={`p-2 rounded-xl ${selectedMode === mode.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                <mode.icon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight mb-1">{mode.label}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-tight">{mode.sub}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${selectedMode === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. ESCOLHA OS BAIRROS */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-1">2. Escolha os bairros</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              O valor será somado automaticamente.
            </p>
          </div>
          <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              {selectedNeighborhoods.length} selecionados
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {NEIGHBORHOODS.map(hood => (
            <button 
              key={hood}
              onClick={() => toggleNeighborhood(hood)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border-2 ${
                selectedNeighborhoods.includes(hood)
                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'
              }`}
            >
              {hood}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PLANOS E PREÇOS */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6">3. Planos de Inauguração</h3>
        
        {Object.entries(PRICING).map(([key, data]) => {
          const isActive = selectedMode === key;
          return (
            <div 
              key={key}
              onClick={() => setSelectedMode(key as any)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden ${
                isActive 
                ? 'bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500' 
                : 'bg-white/5 border-white/5 opacity-40 grayscale'
              }`}
            >
              {key === 'combo' && (
                <div className="absolute top-4 right-6 bg-blue-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Mais vantajoso
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-black text-lg uppercase tracking-tight flex items-center gap-2">
                    {key === 'home' && <Home size={18} className="text-blue-400" />}
                    {key === 'cat' && <LayoutGrid size={18} className="text-blue-400" />}
                    {key === 'combo' && <Zap size={18} className="text-amber-400" />}
                    {key === 'home' ? 'Banner na Home' : key === 'cat' ? 'Banner em Categorias' : 'Home + Categorias'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Promoção de inauguração
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 line-through text-xs font-bold">R$ {data.original.toFixed(2)}</p>
                  <p className="text-2xl font-black text-white leading-none">R$ {data.promo.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  🔻 {data.off}
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
                  💰 Economize R$ {data.save.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center gap-3">
            <Sparkles className="text-amber-400 shrink-0" size={18} />
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest leading-relaxed">
              Valores especiais de inauguração por tempo limitado
            </p>
        </div>
      </section>
    </div>
  );

  const renderArtStep = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">
          Criação da Arte
        </h2>
        <p className="text-slate-400 text-sm">Como deseja criar o seu banner?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* OPÇÃO 1: CRIAR PRÓPRIA ARTE */}
        <button
          onClick={() => setArtChoice('own')}
          className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${
            artChoice === 'own' 
            ? 'bg-blue-600/10 border-blue-500' 
            : 'bg-white/5 border-white/5'
          }`}
        >
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${artChoice === 'own' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>
              <Palette size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-bold text-white text-lg">Criar minha própria arte</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Eu mesmo faço o upload da imagem e do texto.</p>
            </div>
          </div>
          {artChoice === 'own' && (
            <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
               <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl p-8 mb-4">
                  <ImageIcon size={32} className="text-slate-600 mb-2" />
                  <p className="text-[10px] font-black uppercase text-slate-500">Upload da Imagem</p>
               </div>
               <input 
                 placeholder="Texto curto do banner" 
                 className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 mb-2"
               />
               <p className="text-[10px] text-slate-600 text-center uppercase font-black">Visualizar Preview</p>
            </div>
          )}
        </button>

        {/* OPÇÃO 2: CRIAÇÃO PROFISSIONAL */}
        <button
          onClick={() => setArtChoice('pro')}
          className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${
            artChoice === 'pro' 
            ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500' 
            : 'bg-white/5 border-white/5'
          }`}
        >
          <div className="absolute top-4 right-6 flex items-center gap-1.5">
            <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Recomendado</span>
          </div>

          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${artChoice === 'pro' ? 'bg-amber-400 text-slate-900 shadow-lg' : 'bg-white/5 text-slate-500'}`}>
              <Rocket size={32} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-lg flex items-center gap-2">
                Arte com time Localizei <Sparkles size={16} className="text-amber-400" />
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nossa equipe de designers cria um banner profissional focado em conversão.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <span className="text-slate-500 line-through text-xs font-bold">R$ 149,90</span>
                  <span className="text-rose-400 text-[10px] font-black uppercase">🔻 53% OFF</span>
               </div>
               <p className="text-3xl font-black text-white leading-none">R$ 69,90</p>
               <p className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Valor promocional de inauguração</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${artChoice === 'pro' ? 'border-blue-500' : 'border-slate-700'}`}>
                {artChoice === 'pro' && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={step === 'art' ? () => setStep('sales') : onBack} 
            className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">
               Banners Premium <Crown size={16} className="text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">
              {step === 'sales' ? 'Promoção Inauguração' : 'Criação da Arte'}
            </p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-60">
        {step === 'sales' ? renderSalesStep() : renderArtStep()}
      </main>

      {/* FOOTER FIXO / RESUMO DINÂMICO */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        
        {/* Resumo */}
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumo do Pedido</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Check size={10} className="text-blue-500" /> 
                      {selectedMode === 'combo' ? 'Home + Cat' : selectedMode === 'home' ? 'Home' : 'Categorias'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Check size={10} className="text-blue-500" /> 
                      {selectedNeighborhoods.length} {selectedNeighborhoods.length === 1 ? 'bairro' : 'bairros'}
                    </span>
                    {step === 'art' && artChoice === 'pro' && (
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Arte Profissional
                      </span>
                    )}
                </div>
                <p className="text-[10px] text-blue-400 font-bold mt-1 uppercase tracking-widest">Parcele em até 3x sem juros</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Total</p>
                <p className="text-3xl font-black text-white leading-none tracking-tighter">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>

        <button 
          onClick={handleNextStep}
          disabled={isSubmitting || selectedNeighborhoods.length === 0}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
              <>
                {step === 'sales' ? (
                  <>
                    <Palette size={20} />
                    CRIAR MINHA ARTE
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    FINALIZAR COMPRA
                  </>
                )}
                <ArrowRight size={18} />
              </>
          )}
        </button>
        <p className="text-center text-[10px] text-slate-500 font-bold uppercase mt-4 tracking-widest">
            {step === 'sales' ? 'Próximo passo: definir visual do anúncio' : 'Seu banner pode estar no ar em poucos minutos'}
        </p>
      </div>

    </div>
  );
};
