
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
  Info,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
}

type AppStep = 'placement' | 'neighborhoods' | 'art_choice' | 'diy_editor' | 'pro_confirm' | 'payment' | 'success';

// --- MOCK DE INVENTÁRIO (SIMULANDO BACKEND) ---
const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const MONTHS = ["Março", "Abril", "Maio", "Junho"];

const MOCK_INVENTORY: Record<string, any> = {
  "Freguesia": { "Março": { home: 0, cat: 2 }, "Abril": { home: 1, cat: 3 } },
  "Taquara": { "Março": { home: 1, cat: 0 }, "Abril": { home: 2, cat: 2 } },
  "Anil": { "Março": { home: 0, cat: 0 }, "Abril": { home: 1, cat: 1 } },
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
  const [step, setStep] = useState<AppStep>('placement');
  const [selectedMode, setSelectedMode] = useState<'home' | 'cat' | 'combo'>('combo');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'diy' | 'pro' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do Editor DIY
  const [diyConfig, setDiyConfig] = useState({
    title: 'Sua Promoção Aqui',
    description: 'Aproveite as melhores ofertas do bairro.',
    bgColor: '#1E5BFF',
    textColor: 'white',
    alignment: 'center',
    showLogo: true,
  });

  // --- Lógica de Disponibilidade ---
  const getAvailability = (hood: string, month: string) => {
    const data = MOCK_INVENTORY[hood]?.[month] || { home: 3, cat: 3 };
    if (selectedMode === 'home') return data.home;
    if (selectedMode === 'cat') return data.cat;
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
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    return base + extras + artExtra;
  }, [selectedMode, selectedNeighborhoods, artChoice]);

  const handleNextStep = () => {
    if (step === 'placement') setStep('neighborhoods');
    else if (step === 'neighborhoods') {
        if (selectedNeighborhoods.length > 0) setStep('art_choice');
    }
    else if (step === 'diy_editor' || step === 'pro_confirm') setStep('payment');
    else if (step === 'payment') {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep('success');
        }, 2000);
    }
  };

  const handleBack = () => {
    if (step === 'placement') onBack();
    else if (step === 'neighborhoods') setStep('placement');
    else if (step === 'art_choice') setStep('neighborhoods');
    else if (step === 'diy_editor' || step === 'pro_confirm') setStep('art_choice');
    else if (step === 'payment') {
        if (artChoice === 'pro') setStep('pro_confirm');
        else setStep('diy_editor');
    }
  };

  // --- RENDERERS DE ETAPAS ---

  // 1. ONDE DESEJA APARECER
  const renderPlacementStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
      <section>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2 px-1">
          <Target size={14} /> 1. Onde deseja aparecer?
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {DISPLAY_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id as any)}
              className={`relative flex flex-col items-center text-center p-4 rounded-[2rem] border-2 transition-all duration-300 min-h-[140px] justify-center gap-2 ${
                selectedMode === mode.id 
                ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'bg-white/5 border-white/5 opacity-60'
              }`}
            >
              {mode.recommended && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">Destaque</div>
              )}
              <div className={`p-2.5 rounded-2xl ${selectedMode === mode.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                <mode.icon size={22} />
              </div>
              <p className="text-[12px] font-bold text-white leading-tight mt-1">{mode.label}</p>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  // 2. BAIRROS E DISPONIBILIDADE
  const renderNeighborhoodsStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
      <section>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 mb-5 px-1 flex items-center gap-2">
            <Calendar size={14} /> 2. Escolha o período
        </h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
            {MONTHS.map(m => (
                <button 
                    key={m} 
                    onClick={() => { setSelectedMonth(m); setSelectedNeighborhoods([]); }}
                    className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 shrink-0 ${selectedMonth === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                >
                    {m}
                </button>
            ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-5">
            <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">3. Selecione os Bairros</h3>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest ml-1 mt-1">Disponibilidade atualizada em tempo real</p>
            </div>
            <button 
                onClick={() => {
                    const allAvailable = NEIGHBORHOODS.filter(h => getAvailability(h, selectedMonth) > 0);
                    setSelectedNeighborhoods(selectedNeighborhoods.length === allAvailable.length ? [] : allAvailable);
                }}
                className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
            >
                {selectedNeighborhoods.length > 0 ? 'Limpar' : 'Selecionar Tudo'}
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
                        onClick={() => {
                            if (avail > 0) {
                                setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
                            }
                        }}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                            avail === 0 
                            ? 'bg-slate-900/50 border-white/5 opacity-50 grayscale cursor-default' 
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
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-blue-400 uppercase border border-blue-400/20 px-2 py-1 rounded-md block mb-1">Vaga em {nextMonth}</span>
                                    <span className="text-[7px] text-slate-500 uppercase font-bold tracking-tighter">Toque para mudar mês</span>
                                </div>
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

  // 3. ESCOLHA DA ARTE
  const renderArtChoiceStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">Design do Banner</h2>
        <p className="text-slate-400 text-sm">Como deseja produzir a sua arte?</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
          <button 
            onClick={() => { setArtChoice('diy'); setStep('diy_editor'); }}
            className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 text-left hover:border-blue-500/50 transition-all group"
          >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20"><Palette size={28} /></div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">Criar e personalizar meu banner</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Eu mesmo crio os textos e ajusto o visual com as ferramentas do app.</p>
              <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">PERSONALIZAR AGORA <ArrowRight size={14} /></div>
          </button>

          <button 
            onClick={() => { setArtChoice('pro'); setStep('pro_confirm'); }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-left hover:border-amber-500/50 transition-all group relative"
          >
              <div className="absolute top-4 right-6 bg-amber-400 text-slate-900 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">Recomendado</div>
              <div className="w-14 h-14 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 mb-4 border border-amber-400/20"><Rocket size={28} /></div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">Criar com o time Localizei</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Nossa equipe cria um banner profissional focado em conversão.</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-200">
                    <MessageCircle size={14} className="text-amber-400" />
                    <span className="text-[11px] font-bold">Atendimento via chat após o pagamento</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                    <Clock size={14} className="text-amber-400" />
                    <span className="text-[11px] font-bold">Prazo de entrega: até 72h</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                    <Target size={14} className="text-amber-400" />
                    <span className="text-[11px] font-bold">Arte profissional focada em conversão</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 size={14} className="text-amber-400" />
                    <span className="text-[11px] font-bold">Publicação após aprovação</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <div className="space-y-1">
                    <span className="text-slate-500 line-through text-xs font-medium">R$ 149,90</span>
                    <p className="text-3xl font-black text-white leading-none">R$ 69,90</p>
                </div>
                <div className="bg-amber-400 text-slate-900 font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">CONTRATAR TIME</div>
              </div>
          </button>
      </div>
    </div>
  );

  // 4. EDITOR DIY
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
            <textarea value={diyConfig.description} onChange={(e) => setDiyConfig({...diyConfig, description: e.target.value})} placeholder="Descrição curta" className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-sm font-medium text-white outline-none resize-none h-24" />
        </div>
    </div>
  );

  // 5. CHECKOUT / PAGAMENTO
  const renderPaymentStep = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8 pt-4">
        <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Finalizar Compra</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase font-black tracking-widest">Checkout Seguro Localizei</p>
        </div>

        <section className="bg-slate-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">Resumo do Pedido</h3>
            <div className="space-y-4">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Onde aparece</span><span className="font-bold text-white uppercase">{selectedMode === 'combo' ? 'Home + Categoria' : selectedMode}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Período</span><span className="font-bold text-white">{selectedMonth}</span></div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Bairros</span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">{selectedNeighborhoods.join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm items-center py-2 border-t border-white/5">
                    <span className="text-slate-400">Criação da Arte</span>
                    <span className="text-[11px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20">
                        {artChoice === 'pro' ? 'Time de Designers (Chat)' : 'Manual (Personalizado)'}
                    </span>
                </div>
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
                    <div className="flex items-center gap-4"><CreditCard size={20} className={paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-600'} /><span className="font-bold text-sm">Cartão de Crédito (Até 3x)</span></div>
                    {paymentMethod === 'credit' && <CheckCircle2 size={18} className="text-blue-500" />}
                </button>
            </div>
        </section>

        {artChoice === 'pro' && (
            <div className="bg-blue-500/10 p-5 rounded-[2rem] border border-blue-500/20 flex gap-4 animate-pulse">
                <MessageSquare className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="text-[11px] text-blue-100 leading-relaxed font-bold uppercase tracking-tight">
                    Após a confirmação do pagamento, você será direcionado automaticamente para um chat com nosso time de designers.
                </p>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* HEADER DINÂMICO */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">Anunciar no Bairro <Crown size={16} className="text-amber-400 fill-amber-400" /></h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">
                {step === 'placement' ? '1. Posicionamento' : 
                 step === 'neighborhoods' ? '2. Bairros e Período' :
                 step === 'art_choice' ? '3. Design da Arte' : 
                 '4. Finalizar'}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-64">
        {step === 'placement' && renderPlacementStep()}
        {step === 'neighborhoods' && renderNeighborhoodsStep()}
        {step === 'art_choice' && renderArtChoiceStep()}
        {step === 'diy_editor' && renderDiyEditor()}
        {step === 'pro_confirm' && (
            <div className="animate-in zoom-in-95 duration-500 pt-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <div className="w-20 h-20 bg-amber-400/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500"><Rocket size={40} /></div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Time Profissional</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">Nossa equipe entrará em contato via chat para criar seu banner exclusivo em até 72h.</p>
                    <button onClick={() => setStep('payment')} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Seguir para Pagamento</button>
                </div>
            </div>
        )}
        {step === 'payment' && renderPaymentStep()}

        {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-400 mb-8 border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5"><CheckCircle2 size={48} /></div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Pedido Confirmado!</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Seu anúncio foi processado com sucesso. {artChoice === 'pro' ? 'Aguarde o contato de nossa equipe via chat.' : 'Seu banner será publicado em breve.'}
                </p>
                <button onClick={onBack} className="mt-12 text-[#1E5BFF] font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-[#1E5BFF] pb-1">Voltar ao Painel</button>
            </div>
        )}
      </main>

      {/* FOOTER FIXO - RESUMO E CTA */}
      {step !== 'success' && step !== 'pro_confirm' && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total do Investimento</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <Check size={10} className="text-blue-500" /> {selectedMode.toUpperCase()}
                    </span>
                    {selectedNeighborhoods.length > 0 && (
                        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                            <Check size={10} className="text-blue-500" /> {selectedNeighborhoods.length} Bairros
                        </span>
                    )}
                    {artChoice === 'pro' && (
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                            <Check size={10} className="text-amber-500" /> Arte Inclusa
                        </span>
                    )}
                </div>
            </div>
            <div className="text-right">
                <p className="text-3xl font-black text-white leading-none tracking-tighter">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>

        <button 
          onClick={handleNextStep}
          disabled={isSubmitting || (step === 'neighborhoods' && selectedNeighborhoods.length === 0)}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                {step === 'placement' && 'CONTINUAR'}
                {step === 'neighborhoods' && 'ESCOLHER DESIGN'}
                {step === 'art_choice' && 'SELECIONE UMA OPÇÃO'}
                {step === 'diy_editor' && 'IR PARA PAGAMENTO'}
                {step === 'payment' && 'FINALIZAR COMPRA'}
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
