
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Loader2,
  Target,
  Crown,
  Calendar,
  CheckCircle2,
  Paintbrush,
  X,
  Plus,
  Gem,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor, BannerPreview } from '@/components/StoreBannerEditor';
import { supabase } from '@/lib/supabaseClient';

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
  
  const finishStepRef = useRef<HTMLDivElement>(null);

  // Busca subcategoria do lojista
  useEffect(() => {
    if (user) {
        supabase.from('merchants').select('subcategory').eq('owner_id', user.id).maybeSingle()
            .then(({data}) => {
                if (data?.subcategory) setMerchantSubcategory(data.subcategory);
            });
    }
  }, [user]);

  const toggleMonth = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const toggleNeighborhood = (hood: string) => {
    if (hood === 'Todos os bairros') {
      if (selectedNeighborhoods.length === NEIGHBORHOODS.length) {
        setSelectedNeighborhoods([]);
      } else {
        setSelectedNeighborhoods([...NEIGHBORHOODS]);
      }
      return;
    }
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  // Helper para gerar datas dinâmicas
  const getMonthRangeText = (months: number) => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + (months * 30));
    const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `${fmt(start)} a ${fmt(end)}`;
  };

  const prices = useMemo(() => {
    if (!selectedMode) return { current: 0, original: 0, totalMonths: 0, hoodsCount: 0 };
    const totalMonths = selectedMonths.reduce((acc, m) => acc + m, 0);
    const hoodsCount = selectedNeighborhoods.length;
    
    const current = (selectedMode.price * totalMonths) * Math.max(1, hoodsCount);
    const original = (selectedMode.originalPrice * totalMonths) * Math.max(1, hoodsCount);
    
    return { current, original, totalMonths, hoodsCount };
  }, [selectedMode, selectedMonths, selectedNeighborhoods]);

  const handleSaveDesign = (design: any) => {
    setSavedDesign(design);
    setIsArtSaved(true);
    setView('sales');
    // Rolar automaticamente para o próximo passo (Finalização)
    setTimeout(() => {
      finishStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (view === 'editor') {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        storeLogo={user?.user_metadata?.logo_url}
        storeSubcategory={merchantSubcategory}
        onSave={handleSaveDesign} 
        onBack={() => setView('sales')} 
      />
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 text-emerald-500 border-4 border-emerald-500/20 shadow-2xl">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Pedido Realizado!</h2>
        <p className="text-slate-400 text-sm mb-12 max-w-xs mx-auto leading-relaxed">
          Seu pedido foi processado. Em breve seu banner estará no ar nos bairros selecionados.
        </p>
        <button onClick={onBack} className="w-full max-w-sm py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all"><ChevronLeft size={20} /></button>
          <h1 className="font-bold text-lg leading-none">Anunciar nos Banners</h1>
      </header>

      <main className="flex-1 w-full space-y-16 pb-96 overflow-y-auto no-scrollbar">
          
          {/* TOPO DA PÁGINA – COPY DE VENDAS */}
          <section className="px-6 pt-10 space-y-4">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.95] max-w-[280px]">
                Seu concorrente já pode estar aqui. Você vai ficar de fora?
              </h2>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Destaque sua loja exatamente para quem está perto de você.
                Enquanto alguns aparecem primeiro, outros são ignorados.
                Aproveite a oportunidade de anunciar agora com um valor exclusivo que não vai se repetir.
              </p>
              
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-[2.5rem] flex gap-5 items-start shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 shadow-inner shrink-0">
                      <Gem size={28} />
                  </div>
                  <div className="relative z-10">
                      <h4 className="font-black text-white text-base uppercase tracking-tighter flex items-center gap-2">
                        💎 FUNDADOR APOIADOR
                      </h4>
                      <p className="text-[11px] text-white font-bold uppercase tracking-widest mt-1 leading-tight">
                        <span className="text-yellow-400">VALOR PROMOCIONAL</span> POR <span className="text-yellow-400">TEMPO INDETERMINADO</span>
                      </p>
                      <p className="text-[10px] text-slate-300 mt-3 leading-relaxed">
                        Entre agora e garanta um preço que <span className="text-yellow-400">NUNCA MAIS EXISTIRÁ</span>,
                        receba um <span className="text-yellow-400">SELO EXCLUSIVO</span> no perfil da sua loja
                        e pague mês a mês enquanto outros vão pagar mais caro.
                      </p>
                  </div>
              </div>
          </section>

          {/* PASSO 1 */}
          <section className="px-6 space-y-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">1. Onde seu anúncio vai aparecer?</h3>
              <div className="grid grid-cols-1 gap-4">
                  {DISPLAY_MODES.map((mode) => (
                      <button 
                        key={mode.id} 
                        onClick={() => setSelectedMode(mode)} 
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

          {/* PASSO 2 */}
          <section className={`px-6 space-y-8 transition-all duration-500 ${!selectedMode && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">2. Escolha o período</h3>
              <div className="grid grid-cols-2 gap-4">
                  {MONTH_OPTIONS.map(month => (
                      <button 
                        key={month} 
                        onClick={() => toggleMonth(month)} 
                        className={`p-5 rounded-3xl border-2 transition-all text-left ${selectedMonths.includes(month) ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
                      >
                          <p className="text-sm font-black uppercase tracking-tighter">{month} {month === 1 ? 'mês' : 'meses'}</p>
                          <p className={`text-[9px] font-bold mt-1 uppercase ${selectedMonths.includes(month) ? 'text-white/80' : 'text-blue-400'}`}>
                            {getMonthRangeText(month)}
                          </p>
                      </button>
                  ))}
              </div>
          </section>

          {/* PASSO 3 */}
          <section className={`px-6 space-y-8 transition-all duration-500 ${selectedMonths.length === 0 && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">3. Escolha os bairros onde seu anúncio vai aparecer</h3>
              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toggleNeighborhood('Todos os bairros')} 
                    className={`col-span-2 p-5 rounded-2xl border-2 text-center font-black uppercase tracking-widest text-[10px] transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-slate-900 border-white/10 text-slate-500'}`}
                  >
                    Opção Todos os bairros
                  </button>
                  {NEIGHBORHOODS.map(hood => (
                      <button 
                        key={hood} 
                        onClick={() => toggleNeighborhood(hood)} 
                        className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-md' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                      >
                        {hood}
                      </button>
                  ))}
              </div>
          </section>

          {/* PASSO 4 */}
          <section className={`px-6 space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">4. Crie sua arte agora, de forma simples e rápida</h3>
              <button 
                onClick={() => setView('editor')} 
                className={`w-full p-8 rounded-[2.5rem] border-2 text-left flex items-center gap-6 transition-all ${isArtSaved ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isArtSaved ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400'}`}><Paintbrush size={28} /></div>
                  <div>
                      <h4 className="font-bold text-white text-base">{isArtSaved ? 'Arte Pronta!' : 'Criar arte no editor'}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{isArtSaved ? 'Toque para alterar' : 'Toque para começar'}</p>
                  </div>
              </button>
          </section>

          {/* PASSO 5 - REVISÃO E FINALIZAÇÃO */}
          <section ref={finishStepRef} className={`px-6 space-y-10 pb-40 transition-all duration-500 ${!isArtSaved && 'opacity-20 pointer-events-none'}`}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">5. Revise seu anúncio e finalize o pedido</h3>
              
              <div className="space-y-6">
                  {isArtSaved && savedDesign && (
                      <div className="w-full aspect-[16/10] bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl p-1 animate-in zoom-in-95 duration-500">
                        <BannerPreview config={savedDesign} storeName={user?.user_metadata?.store_name || "Sua Loja"} storeLogo={user?.user_metadata?.logo_url} />
                      </div>
                  )}

                  <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Resumo da Finalização</h4>
                      
                      <div className="space-y-5">
                          <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destaque Escolhido</span>
                              <span className="text-sm font-black text-white text-right">{selectedMode?.label}</span>
                          </div>
                          <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Período</span>
                              <div className="text-right">
                                <span className="text-sm font-black text-white block">{prices.totalMonths} Meses Totais</span>
                                <p className="text-[9px] text-blue-400 font-bold uppercase mt-1">Datas somadas dos períodos</p>
                              </div>
                          </div>
                          <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bairros</span>
                              <span className="text-sm font-black text-white text-right">{selectedNeighborhoods.length} Bairro(s)</span>
                          </div>
                          
                          <div className="pt-8 border-t border-white/10 space-y-2 text-right">
                              <p className="text-sm text-slate-500 line-through font-bold">Total Original: R$ {prices.original.toFixed(2)}</p>
                              <div className="flex items-center justify-end gap-2">
                                <p className="text-xs text-yellow-400 font-black uppercase tracking-widest">Valor Fundador Apoiador</p>
                              </div>
                              <h3 className="text-5xl font-black text-white tracking-tighter">R$ {prices.current.toFixed(2)}</h3>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </main>

      {/* RESUMO DO PEDIDO FIXO */}
      <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-[100] max-w-md mx-auto animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Resumo do Pedido</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs font-black text-white uppercase">{selectedMode?.label || '---'}</span>
                      <span className="text-xs font-black text-blue-500 uppercase">{prices.totalMonths} Meses</span>
                      <span className="text-xs font-black text-slate-400 uppercase">{selectedNeighborhoods.length} Bairros</span>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase mb-0.5">Total atualizado</p>
                  <p className="text-xl font-black text-emerald-400 tracking-tighter">R$ {prices.current.toFixed(2)}</p>
              </div>
          </div>
      </div>

      {/* BARRA FIXA INFERIOR COM BOTÃO DE FINALIZAR */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-slate-950 border-t border-white/5 z-[101] max-w-md mx-auto">
          <button 
            onClick={handleFinalize}
            disabled={!selectedMode || selectedMonths.length === 0 || selectedNeighborhoods.length === 0 || !isArtSaved || isSubmitting}
            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${
              selectedMode && selectedMonths.length > 0 && selectedNeighborhoods.length > 0 && isArtSaved && !isSubmitting
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98]' 
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
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
  );
};
