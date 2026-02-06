
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Loader2,
  CheckCircle2,
  Paintbrush,
  X,
  Plus,
  Gem,
  Lock,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor, BannerPreview } from '@/components/StoreBannerEditor';
import { supabase } from '@/lib/supabaseClient';
import { MandatoryVideoLock } from './MandatoryVideoLock';

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

const DISPLAY_MODES = [
  { 
    id: 'home', 
    label: 'HOME', 
    icon: Home, 
    price: 49.90,
    originalPrice: 79.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
  },
  { 
    id: 'cat', 
    label: 'CATEGORIAS', 
    icon: LayoutGrid, 
    price: 29.90,
    originalPrice: 59.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
  },
  { 
    id: 'combo', 
    label: 'HOME + CATEGORIAS', 
    icon: Zap, 
    price: 69.90,
    originalPrice: 119.90,
    description: 'Destaque na página inicial e em todas as categorias.',
  },
];

const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6];

interface OccupancyRecord {
  hood: string;
  modeId: string;
  expiryDate: string;
  merchantId: string;
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'editor'>('sales');
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [savedDesign, setSavedDesign] = useState<any>(null);
  const [merchantSubcategory, setMerchantSubcategory] = useState<string>('');
  const [occupancy, setOccupancy] = useState<OccupancyRecord[]>([]);
  
  const finishStepRef = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const savedOccupancy = localStorage.getItem('localizei_hood_occupancy');
    if (savedOccupancy) setOccupancy(JSON.parse(savedOccupancy));

    if (user) {
        supabase.from('merchants').select('subcategory').eq('owner_id', user.id).maybeSingle()
            .then(({data}) => {
                if (data?.subcategory) setMerchantSubcategory(data.subcategory);
            });
    }
  }, [user]);

  const isHoodOccupied = (hood: string) => {
    if (!selectedMode) return false;
    const now = new Date();
    return occupancy.some(occ => 
      occ.hood === hood && 
      occ.modeId === selectedMode.id && 
      new Date(occ.expiryDate) > now
    );
  };

  const toggleMonth = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const toggleNeighborhood = (hood: string) => {
    if (isHoodOccupied(hood)) return;
    if (hood === 'Todos os bairros') {
      const availableHoods = NEIGHBORHOODS.filter(h => !isHoodOccupied(h));
      if (selectedNeighborhoods.length === availableHoods.length) {
        setSelectedNeighborhoods([]);
      } else {
        setSelectedNeighborhoods(availableHoods);
      }
      return;
    }
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  // CORREÇÃO PASSO 2: Cálculo de Datas Sequenciais de 30 dias sem sobreposição
  const getMonthDateRange = (index: number) => {
    const start = new Date();
    // O início de cada bloco é sempre 30 dias após o início do bloco anterior
    start.setDate(start.getDate() + (index * 30));
    
    const end = new Date(start);
    end.setDate(end.getDate() + 29); // 30 dias corridos incluindo o start

    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { start: fmt(start), end: fmt(end) };
  };

  const prices = useMemo(() => {
    if (!selectedMode) return { current: 0, original: 0, totalMonths: 0, hoodsCount: 0, dateStart: '-', dateEnd: '-' };
    
    const numMonths = selectedMonths.length;
    const numHoods = selectedNeighborhoods.length;
    
    const current = (selectedMode.price * Math.max(1, numMonths)) * Math.max(1, numHoods);
    const original = (selectedMode.originalPrice * Math.max(1, numMonths)) * Math.max(1, numHoods);
    
    let dateStart = '-';
    let dateEnd = '-';
    if (numMonths > 0) {
        const sortedMonths = [...selectedMonths].sort((a, b) => a - b);
        dateStart = getMonthDateRange(sortedMonths[0] - 1).start;
        dateEnd = getMonthDateRange(sortedMonths[sortedMonths.length - 1] - 1).end;
    }

    return { current, original, totalMonths: numMonths, hoodsCount: numHoods, dateStart, dateEnd };
  }, [selectedMode, selectedMonths, selectedNeighborhoods]);

  const handleSaveDesign = (design: any) => {
    setSavedDesign(design);
    setIsArtSaved(true);
    setView('sales');
    setTimeout(() => {
      finishStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleFinalize = () => {
    if (!selectedMode || !user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleModeSelection = (mode: typeof DISPLAY_MODES[0]) => {
    setSelectedMode(mode);
    setTimeout(() => {
      if (step2Ref.current) {
        const yOffset = -100; // Offset para não cobrir o título (considerando o header fixo)
        const y = step2Ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  if (view === 'editor') {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        storeLogo={user?.user_metadata?.logo_url}
        onSave={handleSaveDesign} 
        onBack={() => setView('sales')} 
      />
    );
  }

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="highlight_banners"
    >
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={20} /></button>
            <h1 className="font-bold text-lg leading-none">Anunciar nos Banners</h1>
        </header>

        <main className="flex-1 w-full space-y-16 pb-[320px] overflow-y-auto no-scrollbar">
            <section className="px-6 pt-10 space-y-4 text-center flex flex-col items-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.95] max-w-[320px]">
                  Seu concorrente já pode estar aqui. Você vai ficar de fora?
                </h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[340px]">
                  Destaque sua loja exatamente para quem está perto de você. Enquanto alguns aparecem primeiro, outros são ignorados. Esta é uma oportunidade estratégica de visibilidade com um valor especial que não vai se repetir.
                </p>
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden w-full text-center">
                    <div className="p-4 bg-blue-50/10 rounded-2xl text-blue-400 shrink-0"><Gem size={28} /></div>
                    <div className="relative z-10">
                        <h4 className="font-black text-white text-base uppercase tracking-tighter flex items-center justify-center gap-2">💎 FUNDADOR APOIADOR</h4>
                        <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mt-1">CONDIÇÃO ESPECIAL DE LANÇAMENTO</p>
                        <p className="text-[10px] text-slate-300 mt-4 leading-relaxed px-2">
                          Durante este período, apenas alguns lojistas terão acesso a um <span className="text-yellow-400">VALOR REDUZIDO</span>, disponível por tempo limitado.
                          <br /><br />
                          Além do preço diferenciado, quem entra agora recebe um <span className="text-yellow-400">SELO EXCLUSIVO DE FUNDADOR APOIADOR</span>, visível no perfil da loja, garantindo mais destaque, autoridade e prioridade na plataforma.
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-6 space-y-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">1. Onde seu anúncio vai aparecer?</h3>
              <div className="grid grid-cols-1 gap-4">
                  {DISPLAY_MODES.map((mode) => (
                      <button 
                        key={mode.id} 
                        onClick={() => handleModeSelection(mode)} 
                        className={`p-6 rounded-[2rem] border-2 transition-all text-left flex gap-5 items-center ${selectedMode?.id === mode.id ? 'bg-blue-600/10 border-blue-500 shadow-2xl' : 'bg-white/5 border-white/10'}`}
                      >
                          <div className={`p-4 rounded-2xl shrink-0 ${selectedMode?.id === mode.id ? 'bg-blue-50 text-blue-600' : 'bg-white/5 text-slate-500'}`}><mode.icon size={24} /></div>
                          <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-white uppercase mb-2 tracking-widest">{mode.label}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500 line-through leading-none">R$ {mode.originalPrice.toFixed(2)}</p>
                                <p className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">🟡 FUNDADOR APOIADOR</p>
                              </div>
                              <p className="text-xl font-black text-white mt-1">R$ {mode.price.toFixed(2)} <span className="text-[10px] font-bold text-slate-400">/ mês</span></p>
                          </div>
                      </button>
                  ))}
              </div>
            </section>

            <section ref={step2Ref} className={`px-6 space-y-8 transition-all duration-500 ${!selectedMode && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">2. Escolha o período</h3>
              <div className="grid grid-cols-2 gap-4">
                  {MONTH_OPTIONS.map(month => {
                      const range = getMonthDateRange(month - 1);
                      return (
                        <button 
                            key={month} 
                            onClick={() => toggleMonth(month)} 
                            className={`p-5 rounded-3xl border-2 transition-all text-left ${selectedMonths.includes(month) ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
                        >
                            <p className="text-sm font-black uppercase tracking-tighter">{month}º mês</p>
                            <p className={`text-[9px] font-bold mt-1 uppercase ${selectedMonths.includes(month) ? 'text-white/80' : 'text-blue-400'}`}>
                                {range.start} a {range.end}
                            </p>
                        </button>
                      );
                  })}
              </div>
            </section>

            <section className={`px-6 space-y-8 transition-all duration-500 ${selectedMonths.length === 0 && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">3. Escolha os bairros (Exclusividade por Bairro)</h3>
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => toggleNeighborhood('Todos os bairros')} className={`col-span-2 p-5 rounded-2xl border-2 text-center font-black uppercase tracking-widest text-[10px] transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.filter(h => !isHoodOccupied(h)).length ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-slate-900 border-white/10 text-slate-500'}`}>Opção Todos os bairros disponíveis</button>
                  {NEIGHBORHOODS.map(hood => {
                      const occupied = isHoodOccupied(hood);
                      const isSelected = selectedNeighborhoods.includes(hood);
                      return (
                        <button key={hood} disabled={occupied} onClick={() => toggleNeighborhood(hood)} className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${occupied ? 'bg-slate-950 border-white/5 text-slate-700 opacity-40 cursor-not-allowed' : isSelected ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-md' : 'bg-slate-900 border-white/5 text-slate-500'}`}>{hood}{occupied && (<span className="text-[7px] font-black uppercase tracking-tighter text-red-500 flex items-center gap-1"><X size={8} /> Indisponível</span>)}</button>
                      );
                  })}
              </div>
            </section>

            <section className={`px-6 space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">4. Crie sua arte agora, de forma simples e rápida</h3>
              <button onClick={() => setView('editor')} className={`w-full p-8 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all ${isArtSaved ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}><div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isArtSaved ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400'}`}><Paintbrush size={28} /></div><div><h4 className="font-bold text-white text-base">{isArtSaved ? 'Arte Pronta!' : 'Criar arte no editor'}</h4><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{isArtSaved ? 'Toque para alterar' : 'Toque para começar'}</p></div></button>
            </section>

            <section ref={finishStepRef} className={`px-6 space-y-10 pb-40 transition-all duration-500 ${!isArtSaved && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">5. Revise seu anúncio e finalize o pedido</h3>
              <div className="space-y-6">
                  {isArtSaved && savedDesign && (<div className="w-full aspect-[16/10] bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl p-1 animate-in zoom-in-95 duration-500"><BannerPreview config={savedDesign} storeName={user?.user_metadata?.store_name || "Sua Loja"} storeLogo={user?.user_metadata?.logo_url} /></div>)}
                  <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl"><h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Resumo da Finalização</h4><div className="space-y-5"><div className="flex justify-between items-start"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destaque Escolhido</span><span className="text-sm font-black text-white text-right">{selectedMode?.label}</span></div><div className="flex justify-between items-start"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Período Total</span><div className="text-right"><span className="text-sm font-black text-white block">{prices.totalMonths} Meses</span><p className="text-[9px] text-blue-400 font-bold uppercase mt-1">{prices.dateStart} a {prices.dateEnd}</p></div></div><div className="flex justify-between items-start"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bairros</span><span className="text-sm font-black text-white text-right">{selectedNeighborhoods.length} Bairro(s) Exclusivos</span></div><div className="pt-8 border-t border-white/10 space-y-2 text-right"><p className="text-sm text-slate-500 line-through font-bold">Total Original: R$ {prices.original.toFixed(2)}</p><div className="flex items-center justify-end gap-2"><p className="text-xs text-yellow-400 font-black uppercase tracking-widest">Valor Fundador Apoiador</p></div><h3 className="text-5xl font-black text-white tracking-tighter">R$ {prices.current.toFixed(2)}</h3></div></div></div>
              </div>
            </section>
        </main>

        {/* --- BLOCO DE RESUMO PERSISTENTE (FIXO ACIMA DA BARRA) --- */}
        <div className="fixed bottom-[165px] left-0 right-0 z-[102] max-w-md mx-auto px-4 pointer-events-none">
          <div className={`p-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-500 ${!selectedMode ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                    <h4 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Resumo do Pedido</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-[11px] font-black text-white uppercase">{selectedMode?.label || 'Selecione o Plano'}</span>
                        {prices.totalMonths > 0 && <span className="text-[11px] font-black text-slate-400 uppercase">{prices.totalMonths} Mês/Meses</span>}
                        {prices.hoodsCount > 0 && <span className="text-[11px] font-black text-slate-400 uppercase">{prices.hoodsCount} Bairro(s)</span>}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] text-slate-500 font-bold uppercase mb-0.5">Total</p>
                    <p className="text-lg font-black text-emerald-400 tracking-tighter leading-none">R$ {prices.current.toFixed(2)}</p>
                </div>
            </div>
          </div>
        </div>

        {/* --- BARRA FIXA INFERIOR COM CTA --- */}
        <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-[101] max-w-md mx-auto shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <button 
              onClick={handleFinalize}
              disabled={!selectedMode || selectedMonths.length === 0 || selectedNeighborhoods.length === 0 || !isArtSaved || isSubmitting}
              className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${
                selectedMode && selectedMonths.length > 0 && selectedNeighborhoods.length > 0 && isArtSaved && !isSubmitting
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 active:scale-[0.98]' 
                  : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Finalizar pedido e pagar <ArrowRight size={18} /></>}
            </button>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </MandatoryVideoLock>
  );
};
