
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Rocket,
  Loader2,
  CheckCircle2,
  MessageCircle,
  QrCode,
  Info,
  Paintbrush,
  Image as ImageIcon,
  Upload,
  X,
  Building,
  Target,
  Crown,
  Newspaper,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'payment' | 'chat'>('sales');
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados do Pedido (Configurações Originais) ---
  const [placement, setPlacement] = useState<{home: boolean, cat: boolean}>({ home: false, cat: false });
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'my_art' | 'editor' | 'pro' | null>(null);

  useEffect(() => {
    if (initialView === 'chat') setView('chat');
  }, [initialView]);

  // --- Precificação Original ---
  const PRICES = {
    HOME: 69.90,
    CAT: 29.90,
    COMBO: 89.90, // Desconto se ambos marcados
    PRO_ART: 69.90
  };

  const summary = useMemo(() => {
    let basePrice = 0;
    if (placement.home && placement.cat) basePrice = PRICES.COMBO;
    else if (placement.home) basePrice = PRICES.HOME;
    else if (placement.cat) basePrice = PRICES.CAT;

    const hoodsCount = selectedNeighborhoods.length;
    const subtotal = basePrice * hoodsCount;
    const artExtra = artChoice === 'pro' ? PRICES.PRO_ART : 0;
    const total = subtotal + artExtra;

    return {
      basePrice,
      hoodsCount,
      subtotal,
      artExtra,
      total,
      placementLabel: placement.home && placement.cat ? 'Home + Categorias' : placement.home ? 'Página Inicial' : placement.cat ? 'Categorias' : 'Não selecionado'
    };
  }, [placement, selectedNeighborhoods, artChoice]);

  const toggleHood = (hood: string) => {
    if (hood === 'Todos') {
      setSelectedNeighborhoods(selectedNeighborhoods.length === NEIGHBORHOODS.length ? [] : [...NEIGHBORHOODS]);
    } else {
      setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
    }
  };

  const handleContinue = () => {
    if (!placement.home && !placement.cat) return alert("Selecione onde o anúncio deve aparecer.");
    if (selectedNeighborhoods.length === 0) return alert("Selecione pelo menos um bairro.");
    if (!artChoice) return alert("Escolha uma opção de arte.");
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setView('payment');
      window.scrollTo(0, 0);
    }, 1000);
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Pedido realizado com sucesso! Aguardando processamento.");
      onBack();
    }, 2000);
  };

  if (isEditingArt) {
    return <StoreBannerEditor storeName={user?.user_metadata?.store_name || "Sua Loja"} onSave={() => { setIsEditingArt(false); setArtChoice('editor'); }} onBack={() => setIsEditingArt(false)} />;
  }

  if (view === 'payment') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-white/5 flex items-center gap-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
          <button onClick={() => setView('sales')} className="p-2 bg-white/5 rounded-xl"><ChevronLeft size={20}/></button>
          <h1 className="font-bold text-lg">Finalizar Pagamento</h1>
        </header>
        <main className="p-6 space-y-8 flex-1">
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/10 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Resumo da Campanha</h3>
              <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Posicionamento:</span><span className="font-bold">{summary.placementLabel}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Bairros:</span><span className="font-bold">{summary.hoodsCount} selecionado(s)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Arte:</span><span className="font-bold">{artChoice === 'pro' ? 'Time Localizei' : artChoice === 'editor' ? 'Personalizada' : 'Própria'}</span></div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="font-black text-white uppercase text-xs">Total a Pagar</span>
                    <span className="text-3xl font-black text-emerald-400">R$ {summary.total.toFixed(2).replace('.', ',')}</span>
                  </div>
              </div>
          </div>
          <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Forma de Pagamento</p>
              <button className="w-full p-5 rounded-2xl bg-white/5 border-2 border-blue-500 flex items-center justify-between">
                <div className="flex items-center gap-4"><QrCode size={20} className="text-blue-400"/><span className="font-bold text-sm">PIX (Imediato)</span></div>
                <CheckCircle2 size={18} className="text-blue-500" />
              </button>
          </div>
        </main>
        <footer className="p-6 bg-slate-950 border-t border-white/10">
          <button onClick={handleFinish} disabled={isSubmitting} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar e Publicar'}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="font-bold text-lg leading-none">Anunciar no Bairro</h1>
          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-64 max-w-md mx-auto w-full">
        
        {/* 1. ONDE APARECER */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Target size={14} /> 1. Onde deseja aparecer?
          </h3>
          <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setPlacement({ home: true, cat: false })} 
                className={`flex items-start text-left p-6 rounded-[2.5rem] border-2 transition-all gap-5 ${placement.home && !placement.cat ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${placement.home && !placement.cat ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}><Home size={28} /></div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white uppercase tracking-tight">Home</p>
                      <span className="text-[7px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Fundador Protegido</span>
                    </div>
                    <p className="text-sm font-bold text-slate-300">R$ 69,90/mês</p>
                    <p className="text-[7px] text-emerald-400 font-bold uppercase mt-1">Preço garantido por 12 meses</p>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Exibido na página inicial do aplicativo.</p>
                </div>
              </button>

              <button 
                onClick={() => setPlacement({ home: false, cat: true })} 
                className={`flex items-start text-left p-6 rounded-[2.5rem] border-2 transition-all gap-5 ${!placement.home && placement.cat ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${!placement.home && placement.cat ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}><LayoutGrid size={28} /></div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white uppercase tracking-tight">Subcategorias</p>
                      <span className="text-[7px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Fundador Protegido</span>
                    </div>
                    <p className="text-sm font-bold text-slate-300">R$ 29,90/mês</p>
                    <p className="text-[7px] text-emerald-400 font-bold uppercase mt-1">Preço garantido por 12 meses</p>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Destaque no topo das buscas específicas.</p>
                </div>
              </button>

              <button 
                onClick={() => setPlacement({ home: true, cat: true })} 
                className={`relative flex items-start text-left p-6 rounded-[2.5rem] border-2 transition-all gap-5 ${placement.home && placement.cat ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10'}`}
              >
                <div className="absolute -top-3 right-6 bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded uppercase">Melhor Oferta</div>
                <div className={`p-4 rounded-2xl shrink-0 ${placement.home && placement.cat ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}><Zap size={28} /></div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-white uppercase tracking-tight">Home + Subcategorias</p>
                      <span className="text-[7px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">Fundador Protegido</span>
                    </div>
                    <p className="text-sm font-bold text-slate-300">R$ 89,90/mês</p>
                    <p className="text-[7px] text-emerald-400 font-bold uppercase mt-1">Preço garantido por 12 meses</p>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Máximo alcance e visibilidade no bairro.</p>
                </div>
              </button>

              <div className="mt-2 text-[10px] text-slate-500 font-medium flex items-center gap-2 px-1">
                <span>🔒 Apoie o app no primeiro mês e garanta este valor com desconto por 12 meses.</span>
              </div>
          </div>
        </section>

        {/* 2. QUAIS BAIRROS */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <MapPin size={14} /> 2. Quais bairros?
          </h3>
          <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => toggleHood('Todos')}
                className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
              >
                {selectedNeighborhoods.length === NEIGHBORHOODS.length ? <CheckCircle2 size={16}/> : <LayoutGrid size={16}/>}
                Todos os bairros (9 unidades)
              </button>
              {NEIGHBORHOODS.map(hood => (
                  <button 
                    key={hood}
                    onClick={() => toggleHood(hood)}
                    className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    {hood}
                  </button>
              ))}
          </div>
        </section>

        {/* 3. ESCOLHA DO BANNER */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Palette size={14} /> 3. Escolha seu Banner
          </h3>
          <div className="space-y-4">
              <button 
                onClick={() => setArtChoice('my_art')}
                className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'my_art' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Upload size={24} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Usar meu banner</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Anexe sua arte pronta em JPG/PNG.</p>
                </div>
              </button>

              <button 
                onClick={() => setIsEditingArt(true)}
                className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'editor' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Paintbrush size={24} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Criar banner personalizado</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Use nosso editor automático.</p>
                </div>
              </button>

              <button 
                onClick={() => setArtChoice('pro')}
                className={`relative w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'pro' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}
              >
                <div className="absolute top-4 right-6 text-[8px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 uppercase tracking-widest">Recomendado</div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Rocket size={24} /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Fazer com time Localizei</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Nossos designers criam para você (+R$ 69,90).</p>
                </div>
              </button>
          </div>
        </section>

      </main>

      {/* 4. PRÉVIA DO PEDIDO (FIXA) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
        
        <div className="mb-4 flex flex-col gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 size={12} className="text-blue-400" />
                <p className="text-[9px] font-bold text-blue-300 uppercase tracking-tight">
                    Valor promocional garantido por 12 meses para apoiadores iniciais.
                </p>
            </div>
            
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Resumo em tempo real</p>
                    <p className="text-xs font-bold text-slate-300">Destaque: <span className="text-white">{summary.placementLabel}</span></p>
                    <p className="text-xs font-bold text-slate-300">Vigência: <span className="text-white">30 dias / {summary.hoodsCount} bairros</span></p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total da Campanha</p>
                    <p className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">
                        R$ {summary.total.toFixed(2).replace('.', ',')}
                    </p>
                </div>
            </div>
        </div>

        <button 
          onClick={handleContinue} 
          disabled={isSubmitting} 
          className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
            (placement.home || placement.cat) && selectedNeighborhoods.length > 0 && artChoice ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Continuar para Pagamento <ArrowRight size={18} /></>}
        </button>
      </div>

    </div>
  );
};
