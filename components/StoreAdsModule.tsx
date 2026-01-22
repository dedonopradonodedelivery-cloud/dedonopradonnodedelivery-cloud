
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
  AlertTriangle,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Store as StoreIcon,
  Image as ImageIcon,
  Lock,
  Unlock
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

const MONTHS = ["Março", "Abril", "Maio", "Junho"];

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

const FONTS = [
  { id: 'font-sans', name: 'Moderna (Sans)', class: 'font-sans' },
  { id: 'font-display', name: 'Impactante (Outfit)', class: 'font-display' },
  { id: 'font-serif', name: 'Elegante (Serif)', class: 'font-serif' },
];

const PALETTES = [
  { id: 'p1', bg: '#1E5BFF', text: '#FFFFFF', label: 'Azul Localizei' },
  { id: 'p2', bg: '#000000', text: '#FFFFFF', label: 'Black Gold' },
  { id: 'p3', bg: '#FFFFFF', text: '#1E5BFF', label: 'Clean Blue' },
  { id: 'p4', bg: '#DC2626', text: '#FFFFFF', label: 'Promo Red' },
  { id: 'p5', bg: '#059669', text: '#FFFFFF', label: 'Eco Green' },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName }) => {
  const [selectedMode, setSelectedMode] = useState<typeof DISPLAY_MODES[0] | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [artChoice, setArtChoice] = useState<'diy' | 'pro' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isArtSaved, setIsArtSaved] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'info' | 'error'} | null>(null);

  const [diyData, setDiyData] = useState({
    storeName: user?.user_metadata?.store_name || 'Sua Loja',
    title: 'Sua Promoção Aqui',
    description: 'Melhores ofertas do bairro você encontra aqui.',
    font: FONTS[1].class,
    fontSize: 24,
    bgColor: PALETTES[0].bg,
    textColor: PALETTES[0].text,
    alignment: 'center' as 'left' | 'center' | 'right',
    showLogo: true,
    animation: 'fade' as 'fade' | 'slide' | 'zoom'
  });

  const neighborhoodRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: 'info' | 'error' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const checkHoodAvailability = (hood: string, monthsOverride?: string[]): { available: boolean; busyMonths: string[] } => {
    const monthsToUse = monthsOverride || selectedMonths;
    if (monthsToUse.length === 0) return { available: true, busyMonths: [] };
    const busyIn = monthsToUse.filter(m => MOCK_OCCUPANCY[hood]?.[m] === true);
    return { available: busyIn.length === 0, busyMonths: busyIn };
  };

  const toggleMonth = (month: string) => {
    const nextMonths = selectedMonths.includes(month) 
      ? selectedMonths.filter(m => m !== month) 
      : [...selectedMonths, month];
    
    setSelectedMonths(nextMonths);

    if (selectedNeighborhoods.length > 0) {
      const validHoods = selectedNeighborhoods.filter(hood => {
        const { available } = checkHoodAvailability(hood, nextMonths);
        return available;
      });

      if (validHoods.length < selectedNeighborhoods.length) {
        const diff = selectedNeighborhoods.length - validHoods.length;
        showToast(`${diff} bairro(s) removido(s) por indisponibilidade no novo período.`, 'error');
        setSelectedNeighborhoods(validHoods);
      }
    }

    // Scroll suave apenas quando seleciona o primeiro mês para guiar o olhar para os bairros
    if (nextMonths.length > 0 && selectedNeighborhoods.length === 0) {
      scrollTo(neighborhoodRef);
    }
  };

  const totalAmount = useMemo(() => {
    if (!selectedMode || selectedNeighborhoods.length === 0) return 0;
    const base = selectedMode.price;
    const monthsMultiplier = selectedMonths.length || 1;
    const hoodsMultiplier = selectedNeighborhoods.length;
    const artExtra = artChoice === 'pro' ? 69.90 : 0;
    return (base * hoodsMultiplier * monthsMultiplier) + artExtra;
  }, [selectedMode, selectedMonths, selectedNeighborhoods, artChoice]);

  const handleFinishArt = () => {
    setIsArtSaved(true);
    scrollTo(paymentRef);
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
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border ${toast.type === 'error' ? 'bg-rose-500 border-rose-400 text-white' : 'bg-blue-600 border-blue-500 text-white'}`}>
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
          <div className="grid grid-cols-3 gap-3">
            {DISPLAY_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => { setSelectedMode(mode); }} // REMOVIDO SCROLL AUTOMÁTICO AQUI
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

        {/* BLOCO 2: PERÍODO */}
        <section 
          className={`space-y-8 transition-all duration-500 ${!selectedMode ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1 mb-5">
                <Calendar size={14} /> 2. Escolha o período
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
                {MONTHS.map(m => (
                    <button 
                        key={m} 
                        onClick={() => toggleMonth(m)}
                        className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 shrink-0 ${selectedMonths.includes(m) ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>
          </div>

          {/* BLOCO 3: BAIRROS */}
          <div 
            ref={neighborhoodRef}
            className={`space-y-5 transition-all duration-500 ${selectedMonths.length === 0 ? 'opacity-40 grayscale' : 'opacity-100'}`}
          >
            <div className="flex flex-col gap-1 px-1">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">3. Selecione os Bairros</h3>
                {selectedMonths.length === 0 ? (
                    <div className="flex items-center gap-2 mt-2 bg-amber-400/10 border border-amber-400/20 px-3 py-2 rounded-xl">
                        <Lock size={12} className="text-amber-400" />
                        <p className="text-[9px] text-amber-400 uppercase font-black tracking-widest leading-none">Escolha o período acima para ver a disponibilidade</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl animate-in zoom-in-95">
                        <Unlock size={12} className="text-emerald-500" />
                        <p className="text-[9px] text-emerald-500 uppercase font-black tracking-widest leading-none">Bairros liberados para seleção</p>
                    </div>
                )}
            </div>

            <div className={`grid grid-cols-1 gap-3 ${selectedMonths.length === 0 ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                {NEIGHBORHOODS.map(hood => {
                    const { available, busyMonths } = checkHoodAvailability(hood);
                    const isSelected = selectedNeighborhoods.includes(hood);
                    return (
                        <button 
                            key={hood}
                            onClick={() => {
                                if (available) {
                                    setSelectedNeighborhoods(prev => {
                                      const next = prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood];
                                      if (next.length > 0) scrollTo(creativeRef);
                                      return next;
                                    });
                                }
                            }}
                            className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                                !available 
                                ? 'bg-slate-900/50 border-white/5 opacity-50 cursor-default' 
                                : isSelected
                                    ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5'
                                    : 'bg-slate-900 border-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <MapPin size={18} className={!available ? 'text-slate-700' : isSelected ? 'text-blue-500' : 'text-slate-500'} />
                                <div className="text-left">
                                    <p className={`font-bold text-sm ${!available ? 'text-slate-600' : 'text-white'}`}>{hood}</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${!available ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {!available ? `Ocupado em ${busyMonths.join(', ')}` : 'Disponível'}
                                    </p>
                                </div>
                            </div>
                            {available && (
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                                    {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
          </div>
        </section>

        {/* BLOCO 4: DESIGN DA ARTE (HARMONIZADO) */}
        <section 
          ref={creativeRef}
          className={`space-y-8 transition-all duration-500 ${selectedNeighborhoods.length === 0 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <Palette size={14} /> 4. Design da Arte
          </h3>

          <div className="space-y-6">
              {/* OPÇÃO 1: DIY */}
              <div 
                onClick={() => { setArtChoice('diy'); setIsArtSaved(false); }}
                className={`rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'diy' ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-slate-900 border-white/5 opacity-80 hover:opacity-100'}`}
              >
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0"><Palette size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Personalizar manualmente</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">Crie seu banner rapidamente usando nosso editor simples e pré-configurado.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Grátis</span>
                            <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${artChoice === 'diy' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                                {artChoice === 'diy' ? 'Selecionado' : 'Selecionar'}
                            </div>
                        </div>
                    </div>

                    {artChoice === 'diy' && !isArtSaved && (
                        <div className="space-y-10 animate-in slide-in-from-top-4 duration-500 pt-8 border-t border-white/5">
                            <div className="sticky top-24 z-20">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1 text-center">Prévia em tempo real</p>
                                <div 
                                    className={`w-full aspect-[21/9] rounded-[2rem] flex flex-col p-6 shadow-2xl relative overflow-hidden transition-all duration-500 animate-${diyData.animation}`}
                                    style={{ backgroundColor: diyData.bgColor, color: diyData.textColor, alignItems: diyData.alignment === 'center' ? 'center' : diyData.alignment === 'right' ? 'flex-end' : 'flex-start', textAlign: diyData.alignment }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                                    {diyData.showLogo && (
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm border border-white/10">
                                            <StoreIcon size={16} />
                                        </div>
                                    )}
                                    <h4 className={`${diyData.font} font-black leading-tight uppercase tracking-tight`} style={{ fontSize: diyData.fontSize }}>{diyData.title}</h4>
                                    <p className="text-[10px] font-medium opacity-80 mt-1 max-w-[80%]">{diyData.description}</p>
                                    <div className="mt-auto pt-2 border-t border-white/10 w-full flex justify-between items-center">
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{diyData.storeName}</span>
                                        <div className="bg-white/20 px-2 py-0.5 rounded-md text-[7px] font-black uppercase">Ver Oferta</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400"><Type size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Textos do Banner</span></div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <input value={diyData.title} onChange={e => setDiyData({...diyData, title: e.target.value.slice(0, 40)})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-[#1E5BFF]" placeholder="Título (Ex: 50% de Desconto)" />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-600">{diyData.title.length}/40</span>
                                        </div>
                                        <div className="relative">
                                            <textarea value={diyData.description} onChange={e => setDiyData({...diyData, description: e.target.value.slice(0, 80)})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-400 outline-none focus:border-[#1E5BFF] resize-none h-20" placeholder="Descrição curta..." />
                                            <span className="absolute right-4 bottom-4 text-[9px] font-bold text-slate-600">{diyData.description.length}/80</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fonte</span>
                                        <select value={diyData.font} onChange={e => setDiyData({...diyData, font: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-[10px] font-bold text-white outline-none">
                                            {FONTS.map(f => <option key={f.id} value={f.class}>{f.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tamanho</span><span className="text-[10px] font-bold text-blue-500">{diyData.fontSize}px</span></div>
                                        <input type="range" min="16" max="32" value={diyData.fontSize} onChange={e => setDiyData({...diyData, fontSize: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cores do Fundo</span>
                                        <div className="flex gap-2">
                                            {PALETTES.map(p => (
                                                <button key={p.id} onClick={() => setDiyData({...diyData, bgColor: p.bg, textColor: p.text})} className={`w-8 h-8 rounded-full border-2 transition-all ${diyData.bgColor === p.bg ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: p.bg }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Alinhamento</span>
                                            <div className="flex bg-slate-950 rounded-xl p-1 border border-white/5">
                                                <button onClick={() => setDiyData({...diyData, alignment: 'left'})} className={`p-2 rounded-lg ${diyData.alignment === 'left' ? 'bg-blue-500 text-white' : 'text-slate-600'}`}><AlignLeft size={16}/></button>
                                                <button onClick={() => setDiyData({...diyData, alignment: 'center'})} className={`p-2 rounded-lg ${diyData.alignment === 'center' ? 'bg-blue-500 text-white' : 'text-slate-600'}`}><AlignCenter size={16}/></button>
                                                <button onClick={() => setDiyData({...diyData, alignment: 'right'})} className={`p-2 rounded-lg ${diyData.alignment === 'right' ? 'bg-blue-500 text-white' : 'text-slate-600'}`}><AlignRight size={16}/></button>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-right">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Logo da Loja</span>
                                            <button onClick={() => setDiyData({...diyData, showLogo: !diyData.showLogo})} className={`w-12 h-6 rounded-full p-1 transition-all ${diyData.showLogo ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full transition-all ${diyData.showLogo ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-400"><Sparkles size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Efeito Visual</span></div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['fade', 'slide', 'zoom'].map(anim => (
                                            <button key={anim} onClick={() => setDiyData({...diyData, animation: anim as any})} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${diyData.animation === anim ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-950 border-white/5 text-slate-600'}`}>{anim}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleFinishArt} className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                Salvar arte e continuar
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
              </div>

              {/* OPÇÃO 2: PRO */}
              <div 
                onClick={() => { setArtChoice('pro'); setIsArtSaved(true); scrollTo(paymentRef); }}
                className={`relative rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden ${artChoice === 'pro' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-500 shadow-2xl shadow-amber-500/10' : 'bg-slate-900 border-white/5 opacity-80 hover:opacity-100'}`}
              >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">Recomendado</div>
                  
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-8 pt-4">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20"><Rocket size={24} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 leading-tight">Crie seu banner com o time da Localizei</h3>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">Deixe seu anúncio mais profissional e aumente suas conversões e vendas.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <div className="space-y-0.5 text-right">
                                <span className="text-slate-500 line-through text-[10px] font-bold">R$ 149,90</span>
                                <p className="text-2xl font-black text-white leading-none">R$ 69,90</p>
                             </div>
                             <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mt-2 ${artChoice === 'pro' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                                {artChoice === 'pro' ? 'Selecionado' : 'Selecionar'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-3 mb-8">
                        {[
                            "Banner criado por designers profissionais",
                            "Até 3 ajustes gratuitos",
                            "Atendimento personalizado via chat",
                            "Publicação após aprovação"
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                                    <Check size={10} className="text-amber-400" strokeWidth={4} />
                                </div>
                                <span className="text-[11px] font-medium text-slate-300">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-slate-400">
                            <MessageCircle size={14} className="text-amber-400" />
                            <p className="text-[9px] font-bold uppercase tracking-tight leading-relaxed">
                                Após a confirmação do pagamento, você será direcionado automaticamente para um chat com nosso time de designers.
                            </p>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
        </section>

        {/* BLOCO 5: CHECKOUT */}
        <section 
          ref={paymentRef}
          className={`space-y-8 transition-all duration-500 ${!isArtSaved ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
        >
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
                <Check size={14} /> 5. Finalizar Compra
            </h3>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl space-y-8">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumo do Investimento</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Exibição: {selectedMode?.label}</span><span className="font-bold text-white">R$ {selectedMode?.price.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Bairros selecionados</span><span className="font-bold text-white">× {selectedNeighborhoods.length}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Meses de duração</span><span className="font-bold text-white">× {selectedMonths.length || 1}</span></div>
                        {artChoice === 'pro' && <div className="flex justify-between text-sm text-amber-400"><span className="font-medium">Serviço de Arte Pro</span><span className="font-black">+ R$ 69,90</span></div>}
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-300">Total Geral</span>
                        <span className="text-2xl font-black text-white">R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
        </section>
      </main>

      {/* FOOTER FIXO */}
      {!isSuccess && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        <button 
          onClick={() => { setIsSubmitting(true); setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000); }}
          disabled={isSubmitting || !selectedMode || selectedNeighborhoods.length === 0 || !artChoice || !isArtSaved}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                FINALIZAR COMPRA - R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <ArrowRight size={18} />
              </>
          )}
        </button>
      </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade { animation: fadeIn 0.5s ease-out; }
        .animate-slide { animation: slideIn 0.5s ease-out; }
        .animate-zoom { animation: zoomIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};
