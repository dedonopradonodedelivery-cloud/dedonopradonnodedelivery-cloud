
import React, { useState, useMemo, useEffect } from 'react';
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
  Loader2,
  Star,
  Target,
  Image as ImageIcon,
  Crown,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Monitor,
  Clock,
  CreditCard,
  QrCode,
  Calendar,
  AlertCircle,
  Play,
  CheckCircle2,
  Info
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
}

type AppStep = 'plans' | 'inventory' | 'art_choice' | 'diy_editor' | 'pro_confirm' | 'payment' | 'success';

// --- MOCK DE INVENTÁRIO (SIMULANDO BACKEND) ---
// Estrutura: [Bairro][Mês][Placement] = Vagas Restantes
const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const MONTHS = ["Março", "Abril", "Maio", "Junho"];

// Simulação de base de dados de slots
const MOCK_INVENTORY: Record<string, any> = {
  "Freguesia": { "Março": { home: 0, cat: 2 }, "Abril": { home: 1, cat: 3 } },
  "Taquara": { "Março": { home: 1, cat: 0 }, "Abril": { home: 2, cat: 2 } },
  "Anil": { "Março": { home: 0, cat: 0 }, "Abril": { home: 1, cat: 1 } }, // Totalmente esgotado em Março
  // Outros bairros assumem default: { home: 3, cat: 3 }
};

const DISPLAY_MODES = [
  { id: 'home', label: 'Home', sub: 'Destaque Principal', icon: Home },
  { id: 'cat', label: 'Categorias', sub: 'Busca Direta', icon: LayoutGrid },
  { id: 'combo', label: 'Home + Cat', sub: 'Alcance Máximo', icon: Zap, recommended: true },
];

const PRICING = {
  home: { promo: 89.90 },
  cat: { promo: 49.90 },
  combo: { promo: 119.90 },
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName }) => {
  const [step, setStep] = useState<AppStep>('plans');
  const [selectedMode, setSelectedMode] = useState<'home' | 'cat' | 'combo'>('combo');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingInventory, setCheckingInventory] = useState(false);

  // Estados do Editor DIY
  const [diyConfig, setDiyConfig] = useState({
    title: 'Sua Promoção Aqui',
    description: 'Aproveite as melhores ofertas do bairro.',
    bgColor: '#1E5BFF',
    textColor: 'white',
    alignment: 'center',
    showLogo: true,
    animation: 'none'
  });

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const storeLogo = user?.user_metadata?.avatar_url || "";

  // --- Lógica de Disponibilidade ---
  const getAvailability = (hood: string, month: string) => {
    const data = MOCK_INVENTORY[hood]?.[month] || { home: 3, cat: 3 };
    if (selectedMode === 'home') return data.home;
    if (selectedMode === 'cat') return data.cat;
    // Combo precisa de vaga em ambos
    return Math.min(data.home, data.cat);
  };

  const getNextAvailableMonth = (hood: string) => {
    for (const m of MONTHS) {
      if (getAvailability(hood, m) > 0) return m;
    }
    return null;
  };

  // Cálculo do Total
  const totalAmount = useMemo(() => {
    const base = PRICING[selectedMode].promo;
    const extras = Math.max(0, selectedNeighborhoods.length - 1) * 20.00;
    const artExtra = step === 'pro_confirm' || (step === 'payment' && !diyConfig.title) ? 69.90 : 0;
    return base + extras + artExtra;
  }, [selectedMode, selectedNeighborhoods, step, diyConfig.title]);

  const handleNextStep = async () => {
    if (step === 'plans') {
        setStep('inventory');
    } else if (step === 'inventory') {
        if (selectedNeighborhoods.length === 0) return;
        setCheckingInventory(true);
        // Simula verificação server-side e criação de HOLD
        setTimeout(() => {
            setCheckingInventory(false);
            setStep('art_choice');
        }, 1200);
    } else if (step === 'art_choice') {
        // Lógica de skip para DIY ou Pro é interna dos botões
    } else if (step === 'diy_editor' || step === 'pro_confirm') {
        setStep('payment');
    } else if (step === 'payment') {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep('success');
        }, 2000);
    }
  };

  const handleBack = () => {
    if (step === 'plans') onBack();
    else if (step === 'inventory') setStep('plans');
    else if (step === 'art_choice') setStep('inventory');
    else if (step === 'diy_editor' || step === 'pro_confirm') setStep('art_choice');
    else if (step === 'payment') setStep('art_choice');
    else onBack();
  };

  const toggleNeighborhood = (hood: string) => {
    const avail = getAvailability(hood, selectedMonth);
    if (avail === 0) return; // Bloqueado
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  const handleSelectAllAvailable = () => {
    const allAvailable = NEIGHBORHOODS.filter(h => getAvailability(h, selectedMonth) > 0);
    if (selectedNeighborhoods.length === allAvailable.length) {
        setSelectedNeighborhoods([]);
    } else {
        setSelectedNeighborhoods(allAvailable);
    }
  };

  // --- RENDERERS ---

  // PASSO 1: POSICIONAMENTO
  const renderPlansStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2 px-1">
          <Target size={14} /> 1. Onde deseja aparecer?
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          {DISPLAY_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id as any)}
              className={`relative flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all duration-300 min-h-[130px] justify-center gap-2 ${
                selectedMode === mode.id 
                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'bg-white/5 border-white/5 opacity-60'
              }`}
            >
              {mode.recommended && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">Recomendado</div>
              )}
              <div className={`p-2 rounded-xl ${selectedMode === mode.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                <mode.icon size={20} />
              </div>
              <p className="text-[11px] font-bold text-white leading-tight">{mode.label}</p>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </section>
      
      <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          * No próximo passo você escolherá os bairros e verá a disponibilidade de espaços.
        </p>
      </div>
    </div>
  );

  // PASSO 2: INVENTÁRIO (BAIRROS E MESES)
  const renderInventoryStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500 pb-20">
      {/* Seletor de Mês */}
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-5 px-1 flex items-center gap-2">
            <Calendar size={14} /> 2. Escolha o período
        </h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
            {MONTHS.map(m => (
                <button 
                    key={m} 
                    onClick={() => { setSelectedMonth(m); setSelectedNeighborhoods([]); }}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 shrink-0 ${selectedMonth === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                >
                    {m}
                </button>
            ))}
        </div>
      </section>

      {/* Grid de Bairros com Status */}
      <section>
        <div className="flex justify-between items-end mb-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">3. Disponibilidade por Bairro</h3>
            <button 
                onClick={handleSelectAllAvailable}
                className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20"
            >
                Selecionar Todos Disponíveis
            </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {NEIGHBORHOODS.map(hood => {
                const avail = getAvailability(hood, selectedMonth);
                const isSelected = selectedNeighborhoods.includes(hood);
                const nextMonth = getNextAvailableMonth(hood);

                return (
                    <button 
                        key={hood}
                        onClick={() => toggleNeighborhood(hood)}
                        disabled={avail === 0}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                            avail === 0 
                            ? 'bg-slate-900/50 border-white/5 opacity-50 grayscale cursor-not-allowed' 
                            : isSelected
                                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5'
                                : 'bg-slate-900 border-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className={`p-2 rounded-xl ${avail === 0 ? 'bg-slate-800' : avail === 1 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${avail === 0 ? 'text-slate-500' : 'text-white'}`}>{hood}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${avail === 0 ? 'text-rose-500' : avail === 1 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {avail === 0 ? `Esgotado em ${selectedMonth}` : avail === 1 ? 'Última vaga!' : `${avail} vagas livres`}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {avail === 0 && nextMonth && (
                                <span className="text-[8px] font-black text-slate-500 uppercase border border-white/10 px-2 py-1 rounded-md">Vaga em {nextMonth}</span>
                            )}
                            {avail > 0 && (
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                                    {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
      </section>
    </div>
  );

  // TELA 3: ESCOLHA DO TIPO DE CRIAÇÃO
  const renderArtChoiceStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">Design da Arte</h2>
        <p className="text-slate-400 text-sm">Como deseja produzir o banner?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
          <button onClick={() => setStep('diy_editor')} className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 text-left hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#1E5BFF] mb-4 border border-blue-500/20"><Palette size={28} /></div>
              <h3 className="text-xl font-bold text-white mb-2">Personalizar meu banner</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Eu mesmo crio os textos e ajusto o visual com as ferramentas do app.</p>
              <div className="flex items-center gap-2 text-[#1E5BFF] font-black text-[10px] uppercase tracking-widest">CRIAR MEU BANNER <ArrowRight size={14} /></div>
          </button>

          <button onClick={() => setStep('pro_confirm')} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-left hover:border-amber-500/50 transition-all group relative">
              <div className="absolute top-4 right-6 bg-amber-400 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">Top Resultados</div>
              <div className="w-14 h-14 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 mb-4 border border-amber-400/20"><Rocket size={28} /></div>
              <h3 className="text-xl font-bold text-white mb-2">Criação Profissional</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Nossa equipe de designers cria um banner exclusivo focado em conversão.</p>
              <div className="flex items-center justify-between"><div className="space-y-1"><span className="text-slate-500 line-through text-xs">R$ 149,90</span><p className="text-3xl font-black text-white leading-none">R$ 69,90</p></div><div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">CONTRATAR TIME</div></div>
          </button>
      </div>
    </div>
  );

  // EDITOR DIY (Simplificado para manter o foco no Inventário)
  const renderDiyEditor = () => (
    <div className="animate-in fade-in duration-500 space-y-10 pb-20">
        <div className="sticky top-20 z-30 pt-2 pb-6 bg-slate-900/80 backdrop-blur-md -mx-6 px-6 border-b border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Visualização em Tempo Real</p>
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-4 relative" style={{ backgroundColor: diyConfig.bgColor, textAlign: diyConfig.alignment as any, alignItems: diyConfig.alignment === 'center' ? 'center' : 'flex-start', justifyContent: 'center' }}>
                <div className={`max-w-[85%] ${diyConfig.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                    <h4 className="font-black leading-tight mb-1 text-2xl">{diyConfig.title}</h4>
                    <p className="text-[10px] opacity-80 font-medium line-clamp-2">{diyConfig.description}</p>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <input value={diyConfig.title} onChange={(e) => setDiyConfig({...diyConfig, title: e.target.value})} placeholder="Título chamativo" className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none" />
            <textarea value={diyConfig.description} onChange={(e) => setDiyConfig({...diyConfig, description: e.target.value})} placeholder="Descrição" className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-sm font-medium text-white outline-none resize-none h-20" />
        </div>
    </div>
  );

  // TELA DE PAGAMENTO
  const renderPaymentStep = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8 pt-4">
        <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex gap-3 items-center mb-6">
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Reserva garantida por 10:00 min</p>
        </div>

        <section className="bg-slate-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">Resumo do Pedido</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Posicionamento</span><span className="font-bold text-white">{selectedMode.toUpperCase()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Mês Selecionado</span><span className="font-bold text-white">{selectedMonth}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Bairros ({selectedNeighborhoods.length})</span><span className="font-bold text-white text-right max-w-[150px] truncate">{selectedNeighborhoods.join(', ')}</span></div>
            </div>
        </section>

        <section className="bg-slate-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">Forma de Pagamento</h3>
            <div className="space-y-3">
                <button onClick={() => setPaymentMethod('pix')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-transparent'}`}>
                    <div className="flex items-center gap-4"><QrCode size={20} className={paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">PIX (Imediato)</span></div>
                    {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
                </button>
                <button onClick={() => setPaymentMethod('credit')} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'credit' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-transparent'}`}>
                    <div className="flex items-center gap-4"><CreditCard size={20} className={paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">Cartão de Crédito</span></div>
                    {paymentMethod === 'credit' && <CheckCircle2 size={18} className="text-blue-500" />}
                </button>
            </div>
        </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">Banner Local <Crown size={16} className="text-amber-400 fill-amber-400" /></h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Disponibilidade em tempo real</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-60">
        {step === 'plans' && renderPlansStep()}
        {step === 'inventory' && renderInventoryStep()}
        {step === 'art_choice' && renderArtChoiceStep()}
        {step === 'diy_editor' && renderDiyEditor()}
        {step === 'pro_confirm' && (
            <div className="animate-in zoom-in-95 duration-500 pt-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <div className="w-20 h-20 bg-amber-400/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500"><Rocket size={40} /></div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Criação Profissional</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-10">Nosso time de design vai criar sua arte em até 72h após o pagamento.</p>
                    <div className="bg-amber-400/5 p-4 rounded-2xl border border-amber-400/20"><p className="text-[10px] text-amber-400 font-bold uppercase">Garantia de conversão localizei</p></div>
                </div>
            </div>
        )}
        {step === 'payment' && renderPaymentStep()}

        {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-400 mb-8 border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5"><CheckCircle2 size={48} /></div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Slot Reservado!</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Seu pagamento está sendo processado. Assim que confirmado, sua reserva para <strong>{selectedMonth}</strong> será ativada.</p>
                <button onClick={onBack} className="mt-12 text-[#1E5BFF] font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-[#1E5BFF] pb-1">Voltar ao Painel</button>
            </div>
        )}
      </main>

      {step !== 'success' && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Investimento Mensal</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-blue-500" /> {selectedMode.toUpperCase()}</span>
                    {selectedNeighborhoods.length > 0 && <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-blue-500" /> {selectedNeighborhoods.length} Bairros</span>}
                </div>
            </div>
            <div className="text-right">
                <p className="text-3xl font-black text-white leading-none tracking-tighter">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
        </div>

        <button 
          onClick={handleNextStep}
          disabled={isSubmitting || checkingInventory || (step === 'inventory' && selectedNeighborhoods.length === 0)}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {checkingInventory || isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                {step === 'plans' && 'VER DISPONIBILIDADE'}
                {step === 'inventory' && 'RESERVAR SLOTS'}
                {step === 'art_choice' && 'ESCOLHER DESIGN'}
                {step === 'diy_editor' && 'FINALIZAR DESIGN'}
                {step === 'pro_confirm' && 'CONFIRMAR E PAGAR'}
                {step === 'payment' && 'PAGAR AGORA'}
                {step !== 'art_choice' && <ArrowRight size={18} />}
              </>
          )}
        </button>
      </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
