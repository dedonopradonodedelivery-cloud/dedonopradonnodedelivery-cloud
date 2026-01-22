
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Clock,
  AlertTriangle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
}

// --- CONFIGURAÇÕES DE NEGÓCIO ---
const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const MONTHS = ["Março", "Abril", "Maio", "Junho"];

// Mock de Ocupação: Se o bairro está ocupado (true) ou livre (false) naquele mês
const MOCK_OCCUPANCY: Record<string, Record<string, boolean>> = {
  "Freguesia": { "Março": true, "Abril": false, "Maio": false, "Junho": false },
  "Taquara": { "Março": false, "Abril": true, "Maio": false, "Junho": false },
  "Anil": { "Março": true, "Abril": true, "Maio": false, "Junho": false },
};

const DISPLAY_MODES = [
  { id: 'home', label: 'Home', icon: Home, price: 89.90 },
  { id: 'cat', label: 'Categorias', icon: LayoutGrid, price: 49.90 },
  { id: 'combo', label: 'Home + Cat', icon: Zap, recommended: true, price: 119.90 },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName }) => {
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'diy' | 'pro' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Estados do Editor DIY
  const [diyConfig, setDiyConfig] = useState({ title: 'Sua Promoção Aqui', description: 'Melhor oferta do bairro.' });

  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE SCROLL ---
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  // --- CÁLCULO DE DISPONIBILIDADE BINÁRIA ---
  // CORREÇÃO: Definido retorno explícito para evitar busyMonths undefined (TS18048)
  const checkHoodAvailability = (hood: string): { available: boolean; busyMonths: string[] } => {
    if (selectedMonths.length === 0) return { available: true, busyMonths: [] };
    
    // Verifica se está ocupado em QUALQUER um dos meses selecionados
    const busyIn = selectedMonths.filter(m => MOCK_OCCUPANCY[hood]?.[m] === true);
    
    return {
      available: busyIn.length === 0,
      busyMonths: busyIn
    };
  };

  // --- CÁLCULO DE PREÇO (FÓRMULA DEFINITIVA) ---
  const totalAmount = useMemo(() => {
    if (!selectedMode) return 0;
    const base = selectedMode.price;
    const monthsMultiplier = selectedMonths.length || 1;
    const hoodsMultiplier = selectedNeighborhoods.length || 0;
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    
    // Se não selecionou bairros ainda, mostra apenas o valor base unitário no rodapé
    if (hoodsMultiplier === 0) return 0;

    return (base * hoodsMultiplier * monthsMultiplier) + artExtra;
  }, [selectedMode, selectedMonths, selectedNeighborhoods, artChoice]);

  const toggleMonth = (month: string) => {
    setSelectedMonths(prev => {
        const next = prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month];
        // Se mudar os meses, resetamos os bairros para evitar conflito de disponibilidade
        setSelectedNeighborhoods([]);
        return next;
    });
    if (selectedMonths.length === 0) scrollTo(neighborhoodRef);
  };

  const toggleNeighborhood = (hood: string) => {
    const { available } = checkHoodAvailability(hood);
    if (!available) return;

    setSelectedNeighborhoods(prev => {
      const next = prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood];
      if (next.length > 0) scrollTo(creativeRef);
      return next;
    });
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
      
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">Anunciar no Bairro <Crown size={16} className="text-amber-400 fill-amber-400" /></h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Fluxo Único de Contratação</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-64 max-w-md mx-auto w-full">
        
        {/* BLOCO 1: POSICIONAMENTO */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Target size={14} /> 1. Onde deseja aparecer?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {DISPLAY_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => { setSelectedMode(mode); scrollTo(neighborhoodRef); }}
                className={`relative flex flex-col items-center text-center p-4 rounded-[2rem] border-2 transition-all duration-300 min-h-[140px] justify-center gap-2 ${
                  selectedMode?.id === mode.id 
                  ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                  : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                {mode.recommended && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">Destaque</div>
                )}
                <div className={`p-2.5 rounded-2xl ${selectedMode?.id === mode.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                  <mode.icon size={22} />
                </div>
                <p className="text-[12px] font-bold text-white leading-tight mt-1">{mode.label}</p>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode?.id === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>
                  {selectedMode?.id === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* BLOCO 2: PERÍODO (MÚLTIPLO) */}
        <section 
          ref={neighborhoodRef}
          className={`space-y-8 transition-all duration-500 ${!selectedMode ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <div>
            <div className="flex justify-between items-center px-1 mb-5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                    <Calendar size={14} /> 2. Escolha o período
                </h3>
                {selectedMonths.length > 0 && (
                    <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg uppercase">{selectedMonths.length} meses selecionados</span>
                )}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
                {MONTHS.map(m => (
                    <button 
                        key={m} 
                        onClick={() => toggleMonth(m)}
                        className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 shrink-0 ${selectedMonths.includes(m) ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                    >
                        {selectedMonths.includes(m) && <Check size={10} className="inline mr-2" strokeWidth={4} />}
                        {m}
                    </button>
                ))}
            </div>
          </div>

          {/* BLOCO 3: BAIRROS (DISPONIBILIDADE REAL) */}
          <div className="space-y-5">
            <div className="flex justify-between items-end px-1">
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">3. Selecione os Bairros</h3>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Disponibilidade de slot exclusivo</p>
                </div>
                <button 
                    onClick={() => {
                        const allAvail = NEIGHBORHOODS.filter(h => checkHoodAvailability(h).available);
                        setSelectedNeighborhoods(selectedNeighborhoods.length === allAvail.length ? [] : allAvail);
                        if (allAvail.length > 0) scrollTo(creativeRef);
                    }}
                    className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                    Selecionar Todos Livres
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {NEIGHBORHOODS.map(hood => {
                    const { available, busyMonths } = checkHoodAvailability(hood);
                    const isSelected = selectedNeighborhoods.includes(hood);

                    return (
                        <button 
                            key={hood}
                            onClick={() => toggleNeighborhood(hood)}
                            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                                !available 
                                ? 'bg-slate-900/50 border-white/5 opacity-50 grayscale cursor-default' 
                                : isSelected
                                    ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5'
                                    : 'bg-slate-900 border-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={`p-2 rounded-xl ${!available ? 'bg-slate-800 text-slate-600' : isSelected ? 'bg-blue-50 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${!available ? 'text-slate-500' : 'text-white'}`}>{hood}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${!available ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {!available ? `Esgotado em ${busyMonths.join(', ')}` : 'Disponível'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {available && (
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                                        {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
          </div>
        </section>

        {/* BLOCO 4: DESIGN DA ARTE (PROGRESSIVO) */}
        <section 
          ref={creativeRef}
          className={`space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Palette size={14} /> 4. Design da Arte
          </h3>

          <div className="grid grid-cols-1 gap-5">
              <button 
                onClick={() => { setArtChoice('diy'); scrollTo(paymentRef); }}
                className={`relative p-8 rounded-[2.5rem] border-2 text-left flex flex-col transition-all ${artChoice === 'diy' ? 'bg-slate-800 border-blue-500 shadow-xl shadow-blue-500/10' : 'bg-slate-900 border-white/5 opacity-80'}`}
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shrink-0"><Palette size={24} /></div>
                <h3 className="text-lg font-bold text-white mb-1">Criar manualmente</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">Eu mesmo crio os textos e ajusto o visual com o editor.</p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">GRÁTIS</span>
                    {artChoice === 'diy' && <CheckCircle2 size={24} className="text-blue-500" />}
                </div>
              </button>

              <button 
                onClick={() => { setArtChoice('pro'); scrollTo(paymentRef); }}
                className={`relative p-8 rounded-[2.5rem] border-2 text-left flex flex-col transition-all ${artChoice === 'pro' ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500 shadow-xl shadow-amber-500/10' : 'bg-slate-900 border-white/5 opacity-80'}`}
              >
                  <div className="absolute top-4 right-6 bg-amber-400 text-slate-900 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">Recomendado</div>
                  <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6 shrink-0"><Rocket size={24} /></div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">Arte com time Localizei</h3>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-3 text-slate-300"><MessageCircle size={14} className="text-amber-400" /><span className="text-[10px] font-bold">Atendimento via chat após pagamento</span></div>
                    <div className="flex items-center gap-3 text-slate-300"><Clock size={14} className="text-amber-400" /><span className="text-[10px] font-bold">Prazo de entrega: até 72h</span></div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="space-y-1"><span className="text-slate-500 line-through text-xs font-medium">R$ 149,90</span><p className="text-2xl font-black text-white leading-none">R$ 69,90</p></div>
                    {artChoice === 'pro' && <CheckCircle2 size={24} className="text-amber-400" />}
                  </div>
              </button>
          </div>
        </section>

        {/* BLOCO 5: CHECKOUT (PROGRESSIVO) */}
        <section 
          ref={paymentRef}
          className={`space-y-8 transition-all duration-500 ${!artChoice ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
                <Check size={14} /> 5. Finalizar Compra
            </h3>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-8">
                {/* Resumo Detalhado do Investimento */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detalhamento do Investimento</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Exibição em {selectedMode?.label}</span><span className="font-bold text-white">R$ {selectedMode?.price.toFixed(2)} / bairro</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Bairros Selecionados</span><span className="font-bold text-white">× {selectedNeighborhoods.length}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Meses de Duração</span><span className="font-bold text-white">× {selectedMonths.length || 1}</span></div>
                        {artChoice === 'pro' && (
                            <div className="flex justify-between text-sm text-amber-400"><span className="font-medium">Serviço de Design Pro</span><span className="font-black">+ R$ 69,90</span></div>
                        )}
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">Total Geral</span>
                        <span className="text-2xl font-black text-white tracking-tighter">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Forma de Pagamento</p>
                    <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}>
                        <div className="flex items-center gap-4"><QrCode size={20} className={paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">PIX (Imediato)</span></div>
                        {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
                    </button>
                    <button onClick={() => setPaymentMethod('credit')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'credit' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}>
                        <div className="flex items-center gap-4"><CreditCard size={20} className={paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">Cartão (Até 3x s/ juros)</span></div>
                        {paymentMethod === 'credit' && <CheckCircle2 size={18} className="text-blue-500" />}
                    </button>
                </div>
            </div>

            {artChoice === 'pro' && (
                <div className="bg-blue-500/10 p-5 rounded-3xl border border-blue-500/20 flex gap-4 animate-pulse">
                    <MessageCircle className="w-6 h-6 text-blue-400 shrink-0" />
                    <p className="text-[10px] text-blue-100 leading-relaxed font-bold uppercase tracking-tight">
                        💬 Após o pagamento, nosso time entrará em contato via chat para iniciar a criação do seu banner profissional.
                    </p>
                </div>
            )}
        </section>
      </main>

      {/* FOOTER FIXO: RESUMO E CTA FINAL */}
      {!isSuccess && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total do Investimento</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-blue-500" /> {selectedMode?.label || '--'}</span>
                    {selectedNeighborhoods.length > 0 && <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-blue-500" /> {selectedNeighborhoods.length} Bairros</span>}
                    {selectedMonths.length > 0 && <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-blue-500" /> {selectedMonths.length} Meses</span>}
                </div>
            </div>
            <div className="text-right">
                <p className="text-3xl font-black text-white leading-none tracking-tighter">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
        </div>

        <button 
          onClick={() => { setIsSubmitting(true); setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000); }}
          disabled={isSubmitting || !selectedMode || selectedNeighborhoods.length === 0 || !artChoice}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                FINALIZAR COMPRA
                <ArrowRight size={18} />
              </>
          )}
        </button>
        <p className="text-center text-[9px] text-slate-600 font-bold uppercase mt-4 tracking-widest opacity-60">Ambiente Seguro Localizei JPA</p>
      </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
