
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Check, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Rocket,
  Loader2,
  Calendar,
  CheckCircle2,
  Upload,
  Paintbrush,
  Sparkles,
  ShieldCheck,
  Megaphone,
  X
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS_LIST = [
  "Freguesia", "Anil", "Pechincha", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const PLACEMENT_OPTIONS = [
  { id: 'home', label: 'Home', icon: Home, price: 49.90, originalPrice: 199.90, description: 'Página inicial' },
  { id: 'cat', label: 'Categorias', icon: LayoutGrid, price: 29.90, originalPrice: 149.90, description: 'Buscas específicas' },
  { id: 'combo', label: 'Home + Cats', icon: Zap, price: 79.80, originalPrice: 349.80, description: 'Visibilidade total' },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName, viewMode, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'editor' | 'pro_chat'>('sales');
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedHoods, setSelectedHoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'upload' | 'diy' | 'pro' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs para auto-advance scroll
  const periodRef = useRef<HTMLDivElement>(null);
  const neighborhoodsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const dynamicPeriods = useMemo(() => {
    const now = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const end1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const end3 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    return [
      { id: '1m', label: '1 Mês', dates: `${formatDate(now)} a ${formatDate(end1)}`, multiplier: 1 },
      { id: '3m', label: '3 Meses', dates: `${formatDate(now)} a ${formatDate(end3)}`, multiplier: 3, promo: true },
    ];
  }, []);

  const calculateTotal = useMemo(() => {
    if (!selectedPlacement) return 0;
    const placement = PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement);
    if (!placement) return 0;

    const basePrice = placement.price;
    const hoodCount = Math.max(0, selectedHoods.length);
    
    let total = 0;
    selectedPeriods.forEach(pId => {
      const p = dynamicPeriods.find(period => period.id === pId);
      if (p) total += (basePrice * p.multiplier * (hoodCount || 1));
    });

    if (artChoice === 'pro') total += 89.90;
    
    return total;
  }, [selectedPlacement, selectedPeriods, selectedHoods, artChoice, dynamicPeriods]);

  const handleSelectPlacement = (id: string) => {
    setSelectedPlacement(id);
    scrollTo(periodRef);
  };

  const togglePeriod = (id: string) => {
    setSelectedPeriods(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    if (selectedPeriods.length === 0) scrollTo(neighborhoodsRef);
  };

  const toggleHood = (hood: string) => {
    setSelectedHoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
  };

  const handleSelectAllHoods = () => {
    if (selectedHoods.length === NEIGHBORHOODS_LIST.length) setSelectedHoods([]);
    else setSelectedHoods([...NEIGHBORHOODS_LIST]);
  };

  if (view === 'editor') {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        onSave={() => { setArtChoice('diy'); setView('sales'); }} 
        onBack={() => setView('sales')} 
      />
    );
  }

  if (view === 'pro_chat') {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300">
            <header className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <button onClick={() => setView('sales')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><ChevronLeft size={20}/></button>
                <div className="flex-1">
                    <h2 className="font-bold">Chat com Designer</h2>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online agora</p>
                </div>
            </header>
            <main className="flex-1 p-6 flex flex-col justify-end gap-4 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-800 max-w-[80%]">
                    <p className="text-sm">Olá! Sou o designer da Localizei. Vi que você contratou a criação profissional. Vamos começar?</p>
                </div>
            </main>
            <footer className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
                <input type="text" placeholder="Digite sua mensagem..." className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none" />
                <button className="p-3 bg-[#1E5BFF] text-white rounded-xl"><ArrowRight size={20}/></button>
            </footer>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans pb-48">
      
      {/* 1. TOPO DA PÁGINA (PITCH) */}
      <header className="bg-white dark:bg-gray-900 px-6 pt-12 pb-8 border-b border-gray-100 dark:border-gray-800 rounded-b-[3rem] shadow-sm">
        <button onClick={onBack} className="mb-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors">
          <ChevronLeft size={20} />
        </button>
        
        <div className="space-y-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Anunciar no Bairro</h1>
            <h2 className="text-lg font-bold text-[#1E5BFF] leading-tight">Coloque sua loja na frente de mais de 450 mil moradores de Jacarepaguá.</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Apareça em destaque exatamente para quem mora perto da sua loja. Mais visibilidade, mais visitas e mais chances de vender — todos os dias, dentro do app.
            </p>
        </div>
      </header>

      <div className="p-6 space-y-12">
        
        {/* 2. ONDE VOCÊ QUER ANUNCIAR? - REESTRUTURADO PARA GRID */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 px-1">Onde você quer anunciar?</h3>
          <div className="grid grid-cols-3 gap-2">
            {PLACEMENT_OPTIONS.map((opt) => (
              <button 
                key={opt.id}
                onClick={() => handleSelectPlacement(opt.id)}
                className={`relative p-3 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-between h-44 ${
                  selectedPlacement === opt.id 
                  ? 'bg-blue-600/10 border-[#1E5BFF] text-[#1E5BFF] shadow-lg' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <opt.icon size={22} className={selectedPlacement === opt.id ? 'text-[#1E5BFF]' : 'text-slate-600'} />
                
                <p className="font-black uppercase text-[9px] tracking-tight leading-none mt-2">{opt.label}</p>
                
                <div className="mt-auto pt-2 flex flex-col items-center">
                    <span className="text-[8px] line-through opacity-50 block">R$ {opt.originalPrice.toFixed(2).replace('.', ',')}</span>
                    <span className={`text-xs font-black block mt-0.5 ${selectedPlacement === opt.id ? 'text-[#1E5BFF]' : 'text-slate-300'}`}>
                        R$ {opt.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {selectedPlacement === opt.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={14} className="text-[#1E5BFF]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 3. POR QUANTO TEMPO? */}
        <section ref={periodRef} className={`space-y-4 transition-all duration-500 ${!selectedPlacement ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 px-1">Por quanto tempo você quer anunciar?</h3>
          <div className="flex gap-3">
            {dynamicPeriods.map((p) => (
              <button 
                key={p.id}
                onClick={() => togglePeriod(p.id)}
                className={`flex-1 p-5 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${
                  selectedPeriods.includes(p.id) ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-lg text-blue-600' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {p.promo && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[7px] font-black px-2 py-1 uppercase tracking-tighter rounded-bl-lg">Promo</div>}
                <p className={`font-black text-sm uppercase tracking-tighter ${selectedPeriods.includes(p.id) ? 'text-[#1E5BFF]' : ''}`}>{p.label}</p>
                <p className="text-[9px] font-bold opacity-60 mt-1 uppercase tracking-widest">{p.dates}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 4. BAIRROS DE EXIBIÇÃO */}
        <section ref={neighborhoodsRef} className={`space-y-4 transition-all duration-500 ${selectedPeriods.length === 0 ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Bairros de exibição</h3>
            <button onClick={handleSelectAllHoods} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
              {selectedHoods.length === NEIGHBORHOODS_LIST.length ? 'Limpar' : 'Todos'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {NEIGHBORHOODS_LIST.map((hood) => (
              <button 
                key={hood}
                onClick={() => toggleHood(hood)}
                className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  selectedHoods.includes(hood) ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {hood}
              </button>
            ))}
          </div>
        </section>

        {/* 6. COMO VOCÊ QUER CRIAR SEU BANNER? */}
        <section className={`space-y-4 transition-all duration-500 ${selectedHoods.length === 0 ? 'opacity-30 blur-[1px] pointer-events-none' : ''}`}>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 px-1">Como você quer criar seu banner?</h3>
          <div className="space-y-3">
            <button 
                onClick={() => setArtChoice('upload')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${artChoice === 'upload' ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-md' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500"><Upload size={18}/></div>
                    <p className={`text-sm font-bold uppercase tracking-tight ${artChoice === 'upload' ? 'text-gray-900 dark:text-white' : 'text-slate-400'}`}>Usar minha arte</p>
                </div>
                {artChoice === 'upload' && <CheckCircle2 size={18} className="text-[#1E5BFF]" />}
            </button>

            <button 
                onClick={() => setView('editor')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${artChoice === 'diy' ? 'bg-white dark:bg-gray-900 border-[#1E5BFF] shadow-md' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600"><Paintbrush size={18}/></div>
                    <p className={`text-sm font-bold uppercase tracking-tight ${artChoice === 'diy' ? 'text-gray-900 dark:text-white' : 'text-slate-400'}`}>Criação personalizada</p>
                </div>
                {artChoice === 'diy' && <CheckCircle2 size={18} className="text-[#1E5BFF]" />}
            </button>

            <button 
                onClick={() => setArtChoice('pro')}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${artChoice === 'pro' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 shadow-md' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600"><Rocket size={18}/></div>
                    <div>
                        <p className={`text-sm font-bold uppercase tracking-tight ${artChoice === 'pro' ? 'text-amber-900 dark:text-amber-100' : 'text-slate-400'}`}>Criar com o time Localizei</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-slate-500 line-through">R$ 169,90</span>
                            <span className="text-xs font-black text-amber-600">R$ 89,90</span>
                        </div>
                    </div>
                </div>
                {artChoice === 'pro' && <CheckCircle2 size={18} className="text-amber-500" />}
            </button>
          </div>
        </section>

      </div>

      {/* 7. RESUMO DO PEDIDO (FIXO) */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resumo do Pedido</p>
                <div className="flex flex-wrap gap-x-2 text-[11px] font-bold text-slate-200">
                    <span>{selectedPlacement ? PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement)?.label : 'Selecione local'}</span>
                    <span className="text-slate-600">•</span>
                    <span>{selectedPeriods.length > 0 ? `${selectedPeriods.length} período(s)` : 'Aguardando'}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500">{selectedHoods.length} bairro(s) escolhido(s)</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest mb-1">Total a Investir</p>
                <p className="text-2xl font-black text-white tracking-tighter">R$ {calculateTotal.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>

        <button 
          onClick={() => artChoice === 'pro' ? setView('pro_chat') : alert('Iniciando Checkout...')}
          disabled={!selectedPlacement || selectedPeriods.length === 0 || selectedHoods.length === 0 || !artChoice}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale uppercase tracking-widest text-xs"
        >
          {artChoice === 'pro' ? 'Contratar Banner e Falar com Designer' : 'Contratar Anúncio'}
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </footer>
    </div>
  );
};
