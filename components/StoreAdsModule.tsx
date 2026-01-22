
import React, { useState, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Check, 
  Home, 
  LayoutGrid, 
  Zap, 
  MapPin, 
  Palette, 
  Rocket,
  Loader2,
  Target,
  Crown,
  Calendar,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  QrCode,
  Info,
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare,
  Paintbrush
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

const MOCK_OCCUPANCY: Record<string, Record<string, boolean>> = {
  "Freguesia": { "periodo_1": true },
  "Taquara": { "periodo_2": true },
};

const DISPLAY_MODES = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: Home, 
    price: 89.90,
    originalPrice: 199.90,
    description: 'Exibido no carrossel da página inicial para todos os usuários.',
    whyChoose: 'Ideal para máxima visibilidade imediata.'
  },
  { 
    id: 'cat', 
    label: 'Categorias', 
    icon: LayoutGrid, 
    price: 49.90,
    originalPrice: 149.90,
    description: 'Exibido no topo das buscas por produtos ou serviços específicos.',
    whyChoose: 'Impacta o cliente no momento da decisão.'
  },
  { 
    id: 'combo', 
    label: 'Home + Categorias', 
    icon: Zap, 
    price: 119.90,
    originalPrice: 349.80,
    description: 'Destaque na página inicial e em todas as categorias.',
    whyChoose: 'Mais alcance, cliques e chances de venda.'
  },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName }) => {
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'diy' | 'pro' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'info' | 'error'} | null>(null);

  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const dynamicPeriods = useMemo(() => {
    const now = new Date();
    const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const end1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const start2 = new Date(end1.getTime() + 1 * 24 * 60 * 60 * 1000);
    const end2 = new Date(start2.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      { 
        id: 'periodo_1', 
        label: 'Começar agora', 
        sub: 'Exibição imediata após a publicação', 
        dates: `${formatDate(now)} → ${formatDate(end1)}`,
        badge: 'Mais rápido'
      },
      { 
        id: 'periodo_2', 
        label: 'Próximos 30 dias', 
        sub: 'Planejamento para campanhas futuras', 
        dates: `${formatDate(start2)} → ${formatDate(end2)}`,
        badge: 'Planejar'
      },
    ];
  }, []);

  const showToast = (msg: string, type: 'info' | 'error' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const checkHoodAvailability = (hood: string, periodsToTest?: string[]): { available: boolean; busyIn: string[] } => {
    const targetPeriods = periodsToTest || selectedPeriods;
    if (targetPeriods.length === 0) return { available: true, busyIn: [] };
    const busyIn = targetPeriods.filter(p => MOCK_OCCUPANCY[hood]?.[p] === true);
    return { available: busyIn.length === 0, busyIn };
  };

  const togglePeriod = (periodId: string) => {
    const nextPeriods = selectedPeriods.includes(periodId) ? selectedPeriods.filter(p => p !== periodId) : [...selectedPeriods, periodId];
    setSelectedPeriods(nextPeriods);
    if (selectedNeighborhoods.length > 0) {
      const validHoods = selectedNeighborhoods.filter(hood => checkHoodAvailability(hood, nextPeriods).available);
      if (validHoods.length < selectedNeighborhoods.length) {
        showToast(`Bairros removidos por indisponibilidade no novo período.`, 'error');
        setSelectedNeighborhoods(validHoods);
      }
    }
  };

  const selectAllAvailableHoods = () => {
    const availableHoods = NEIGHBORHOODS.filter(hood => checkHoodAvailability(hood).available);
    setSelectedNeighborhoods(availableHoods);
  };

  const handleFinishArt = () => {
    setIsArtSaved(true);
    scrollTo(paymentRef);
  };

  const prices = useMemo(() => {
    if (!selectedMode) return { current: 0, original: 0 };
    const hoodsMult = Math.max(1, selectedNeighborhoods.length);
    const periodsMult = Math.max(1, selectedPeriods.length);
    const artExtra = artChoice === 'pro' ? 69.90 : 0;

    return {
      current: (selectedMode.price * hoodsMult * periodsMult) + artExtra,
      original: (selectedMode.originalPrice * hoodsMult * periodsMult) + artExtra
    };
  }, [selectedMode, selectedPeriods, selectedNeighborhoods, artChoice]);

  const handleFooterClick = () => {
    if (!selectedMode) return;
    
    if (selectedPeriods.length === 0) {
        showToast("Selecione pelo menos um período para continuar.", "error");
        return;
    }
    if (selectedNeighborhoods.length === 0) {
        showToast("Escolha em quais bairros deseja anunciar.", "error");
        return;
    }
    if (!artChoice || !isArtSaved) {
        showToast("Configure o design da sua arte para continuar.", "error");
        scrollTo(creativeRef);
        return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-400 mb-8 border-2 border-emerald-500/20 shadow-xl">
                <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Pedido Confirmado!</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                O pagamento está em análise. {artChoice === 'pro' ? 'Em instantes você será chamado no chat para iniciarmos sua arte.' : 'Seu banner será publicado assim que o Pix for compensado.'}
            </p>
            <button onClick={onBack} className="mt-12 text-[#1E5BFF] font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-[#1E5BFF] pb-1">Voltar ao Painel</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-blue-600 border-blue-500'} text-white`}>
           {toast.type === 'error' ? <AlertTriangle size={18} /> : <Info size={18} />}
           <p className="text-xs font-black uppercase tracking-tight">{toast.msg}</p>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">Anunciar no Bairro <Crown size={16} className="text-amber-400 fill-amber-400" /></h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-64 max-w-md mx-auto w-full">
        
        {/* BLOCO 1: POSICIONAMENTO */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Target size={14} /> 1. Onde deseja aparecer?
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {DISPLAY_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => { setSelectedMode(mode); scrollTo(neighborhoodRef); }}
                className={`relative flex items-start text-left p-6 rounded-[2rem] border-2 transition-all duration-300 gap-5 ${
                  selectedMode?.id === mode.id 
                  ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                  : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${selectedMode?.id === mode.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                  <mode.icon size={28} />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{mode.label}</p>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMode?.id === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>
                      {selectedMode?.id === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{mode.description}</p>
                  <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1.5 italic opacity-80">{mode.whyChoose}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO 2: PERÍODO (30 DIAS) */}
        <section 
          className={`space-y-8 transition-all duration-500 ${!selectedMode ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1 mb-5">
                <Calendar size={14} /> 2. Escolha o período (30 dias)
            </h3>
            
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl mb-6">
                <p className="text-[10px] text-blue-200 leading-relaxed">
                   Seu banner ficará no ar por 30 dias corridos após a publicação. 
                   {artChoice === 'pro' && ' (A vigência do período de 30 dias inicia após a aprovação da arte).'}
                </p>
            </div>
            
            <div className="flex gap-4">
                {dynamicPeriods.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => togglePeriod(p.id)}
                        className={`flex-1 p-5 rounded-3xl border-2 transition-all flex flex-col gap-2 text-left relative overflow-hidden ${
                            selectedPeriods.includes(p.id) 
                            ? 'bg-blue-600/10 border-blue-500 shadow-lg' 
                            : 'bg-white/5 border-white/10'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <CheckCircle2 size={16} className={selectedPeriods.includes(p.id) ? 'text-blue-500' : 'text-slate-700'} />
                            <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                                selectedPeriods.includes(p.id) ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
                            }`}>
                                {p.badge}
                            </span>
                        </div>
                        <p className="text-xs font-black text-white uppercase tracking-tight mt-1">{p.label}</p>
                        <p className="text-[9px] text-slate-400 font-medium leading-tight">{p.sub}</p>
                        <p className="text-[10px] text-blue-400 font-black mt-2 font-mono">{p.dates}</p>
                    </button>
                ))}
            </div>
          </div>

          {/* BLOCO 3: BAIRROS */}
          <div 
            ref={neighborhoodRef}
            className={`space-y-6 transition-all duration-500 ${selectedPeriods.length === 0 ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}
          >
            <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                    <MapPin size={14} /> 3. Selecione os Bairros
                  </h3>
                  {selectedPeriods.length > 0 && (
                    <button onClick={selectAllAvailableHoods} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 active:scale-95 transition-all"><CheckSquare size={12} /> Selecionar todos</button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Você pode selecionar um ou mais bairros.</p>
                {selectedPeriods.length > 0 && (
                    <div className="flex items-center justify-between mt-4"><div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl"><Unlock size={12} className="text-emerald-500" /><p className="text-[9px] text-emerald-500 uppercase font-black tracking-widest leading-none">Disponibilidade atualizada</p></div>{selectedNeighborhoods.length > 0 && <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{selectedNeighborhoods.length} selecionados</span>}</div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                {NEIGHBORHOODS.map(hood => {
                    const { available } = checkHoodAvailability(hood);
                    const isSelected = selectedNeighborhoods.includes(hood);
                    return (
                        <button key={hood} onClick={() => { if (available) { setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]); } }} className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all min-h-[90px] relative text-left ${!available ? 'bg-slate-900/50 border-white/5 opacity-50 cursor-default' : isSelected ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]' : 'bg-slate-900 border-white/5 hover:border-white/10'}`}>
                            <div className="flex items-center justify-between w-full mb-2">
                                <div className={`p-1.5 rounded-lg ${!available ? 'bg-slate-800 text-slate-600' : isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}><MapPin size={14} /></div>
                                {available && <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>{isSelected && <Check size={12} className="text-white" strokeWidth={4} />}</div>}
                            </div>
                            <div><p className={`font-bold text-xs ${!available ? 'text-slate-600' : 'text-white'}`}>{hood}</p><p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${!available ? 'text-rose-500' : 'text-emerald-500'}`}>{!available ? `Ocupado no período` : 'Disponível'}</p></div>
                        </button>
                    );
                })}
            </div>
          </div>
        </section>

        {/* BLOCO 4: DESIGN */}
        <section 
          ref={creativeRef}
          className={`space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Palette size={14} /> 4. Design da Arte</h3>
          <div className="space-y-6">
              <div onClick={() => { setArtChoice('diy'); setIsArtSaved(false); }} className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'diy' ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-slate-900 border-white/5 opacity-80 hover:opacity-100'}`}>
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                                <Paintbrush size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 leading-tight">Personalizar manualmente</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">Crie seu banner agora mesmo com nosso editor simples.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Grátis</span>
                            <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${artChoice === 'diy' ? 'bg-[#1E5BFF] text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                                {artChoice === 'diy' ? 'Selecionado' : 'Selecionar'}
                            </div>
                        </div>
                    </div>
                    {artChoice === 'diy' && !isArtSaved && (
                        <div className="space-y-10 animate-in slide-in-from-top-4 duration-500 pt-8 border-t border-white/5">
                            <button onClick={handleFinishArt} className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                CRIAR MEU BANNER <ArrowRight size={16} />
                            </button>
                            <p className="text-[10px] text-slate-500 text-center uppercase font-black tracking-widest">Publicação em até 1h após o pagamento.</p>
                        </div>
                    )}
                </div>
              </div>
              <div onClick={() => { setArtChoice('pro'); setIsArtSaved(true); scrollTo(paymentRef); }} className={`relative rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'pro' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-500 shadow-2xl shadow-amber-500/10' : 'bg-slate-900 border-white/5 opacity-80 hover:opacity-100'}`}>
                  <div className="p-8 pt-10"><div className="flex items-start justify-between mb-8"><div className="flex items-start gap-5"><div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20"><Rocket size={24} /></div><div><h3 className="text-lg font-bold text-white mb-1 leading-tight">Time de Designers</h3><p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">Criamos seu banner profissional. Entrega em até 72h.</p></div></div><div className="flex flex-col items-end gap-2"><div className="space-y-0.5 text-right"><span className="text-slate-500 line-through text-[10px] font-bold">R$ 149,90</span><p className="text-2xl font-black text-white leading-none">R$ 69,90</p></div><div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mt-2 ${artChoice === 'pro' ? 'bg-[#1E5BFF] text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>{artChoice === 'pro' ? 'Selecionado' : 'Selecionar'}</div></div></div>
                    <div className="grid grid-cols-1 gap-y-3 mb-8">{["Banner profissional", "Atendimento via chat", "Vigência conta após aprovação"].map((benefit, i) => (<div key={i} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-500/20 shrink-0"><Check size={10} className="text-amber-400" strokeWidth={4} /></div><span className="text-[11px] font-medium text-slate-300">{benefit}</span></div>))}</div>
                  </div>
              </div>
          </div>
        </section>

        {/* BLOCO 5: CHECKOUT */}
        <section ref={paymentRef} className={`space-y-8 transition-all duration-500 ${!isArtSaved ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Check size={14} /> 5. Finalizar Compra</h3>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-8">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumo do Investimento</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Exibição: {selectedMode?.label}</span><span className="font-bold text-white">R$ {selectedMode?.price.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Bairros selecionados</span><span className="font-bold text-white">× {selectedNeighborhoods.length}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Período total</span><span className="font-bold text-white">{selectedPeriods.length * 30} dias ({selectedPeriods.length}x 30d)</span></div>
                        {artChoice === 'pro' && <div className="flex justify-between text-sm text-amber-400"><span className="font-medium">Arte Profissional</span><span className="font-black">+ R$ 69,90</span></div>}
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center"><span className="text-sm font-bold text-slate-300">Total Geral</span><span className="text-2xl font-black text-white">R$ {prices.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                </div>
                <div className="space-y-3 pt-6 border-t border-white/10">
                    <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}><div className="flex items-center gap-4"><QrCode size={20} className={paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">PIX (Imediato)</span></div>{paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}</button>
                    <button onClick={() => setPaymentMethod('credit')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'credit' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}><div className="flex items-center gap-4"><CreditCard size={20} className={paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">Cartão (Até 3x)</span></div>{paymentMethod === 'credit' && <CheckCircle2 size={18} className="text-blue-500" />}</button>
                </div>
            </div>
        </section>
      </main>

      {/* FOOTER FIXO */}
      {!isSuccess && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <button 
          onClick={handleFooterClick}
          disabled={isSubmitting}
          className={`w-full py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex flex-col items-center justify-center transition-all active:scale-[0.98] ${
            selectedMode 
            ? 'bg-[#1E5BFF] text-white opacity-100' 
            : 'bg-white/5 text-slate-500 opacity-50 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
          ) : !selectedMode ? (
              <span className="font-black text-sm uppercase tracking-widest">Escolha onde aparecer</span>
          ) : (
              <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Publicar: {selectedMode.label}</span>
                    <ArrowRight size={14} className="text-white/60" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-white/40 line-through">R$ {prices.original.toFixed(2).replace('.', ',')}</span>
                    <span className="text-xl font-black text-white">R$ {prices.current.toFixed(2).replace('.', ',')}</span>
                    <span className="text-[10px] font-black text-emerald-400 ml-1 uppercase tracking-tighter">({Math.round((1 - prices.current/prices.original) * 100)}% OFF)</span>
                  </div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">por {selectedPeriods.length > 1 ? selectedPeriods.length * 30 : 30} dias de exibição</span>
              </div>
          )}
        </button>
      </div>
      )}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};
