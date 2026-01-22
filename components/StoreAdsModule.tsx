
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Star,
  Target,
  Image as ImageIcon,
  Crown,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Monitor,
  MousePointer2,
  Clock,
  CreditCard,
  QrCode,
  MessageSquare,
  Play,
  // Fix: added missing CheckCircle2 icon
  CheckCircle2
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  categoryName?: string;
}

type AppStep = 'plans' | 'art_choice' | 'diy_editor' | 'pro_confirm' | 'payment' | 'success';

const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

const DISPLAY_MODES = [
  { id: 'home', label: 'Home', sub: 'Destaque Principal', icon: Home },
  { id: 'cat', label: 'Categorias', sub: 'Busca Direta', icon: LayoutGrid },
  { id: 'combo', label: 'Home + Cat', sub: 'Alcance Máximo', icon: Zap, recommended: true },
];

const PRICING = {
  home: { original: 199.90, promo: 89.90, off: '55% OFF', save: 110.00 },
  cat: { original: 149.90, promo: 49.90, off: '67% OFF', save: 100.00 },
  combo: { original: 349.80, promo: 119.90, off: '66% OFF', save: 229.90 },
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, categoryName }) => {
  const [step, setStep] = useState<AppStep>('plans');
  const [selectedMode, setSelectedMode] = useState<'home' | 'cat' | 'combo'>('combo');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(["Freguesia"]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados do Editor DIY
  const [diyConfig, setDiyConfig] = useState({
    title: 'Sua Promoção Aqui',
    description: 'Aproveite as melhores ofertas do bairro.',
    fontFamily: 'Poppins',
    fontSize: 'medium',
    bgColor: '#1E5BFF',
    textColor: 'white',
    alignment: 'center',
    showLogo: true,
    animation: 'none'
  });

  const storeName = user?.user_metadata?.store_name || "Sua Loja";
  const storeLogo = user?.user_metadata?.avatar_url || "";

  // Cálculo do Total
  const totalAmount = useMemo(() => {
    const base = PRICING[selectedMode].promo;
    const extras = Math.max(0, selectedNeighborhoods.length - 1) * 20.00;
    const artExtra = step === 'pro_confirm' || (step === 'payment' && !diyConfig.title) ? 69.90 : 0;
    return base + extras + artExtra;
  }, [selectedMode, selectedNeighborhoods, step, diyConfig.title]);

  const handleNextStep = () => {
    if (step === 'plans') setStep('art_choice');
    else if (step === 'diy_editor') setStep('payment');
    else if (step === 'pro_confirm') setStep('payment');
    else if (step === 'payment') {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep('success');
        }, 2000);
    }
  };

  const handleBack = () => {
    if (step === 'plans') onBack();
    else if (step === 'art_choice') setStep('plans');
    else if (step === 'diy_editor' || step === 'pro_confirm') setStep('art_choice');
    else if (step === 'payment') setStep('art_choice');
    else onBack();
  };

  const toggleNeighborhood = (hood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  // --- RENDERIZADORES DE TELAS ---

  // TELA 1: ESCOLHA DO PLANO E BAIRROS
  const renderPlansStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-2">
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
                : 'bg-white/5 border-white/5'
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
              <p className="text-[11px] font-bold text-white leading-tight">{mode.label}</p>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === mode.id ? 'border-blue-500' : 'border-slate-700'}`}>
                {selectedMode === mode.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">2. Escolha os bairros</h3>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {selectedNeighborhoods.length} selecionados
            </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedNeighborhoods(selectedNeighborhoods.length === NEIGHBORHOODS.length ? [] : [...NEIGHBORHOODS])}
            className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2 ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-900 border-blue-500/30 text-blue-400'}`}
          >
            {selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'Desmarcar Todos' : 'Todos os Bairros'}
          </button>
          {NEIGHBORHOODS.map(hood => (
            <button 
              key={hood}
              onClick={() => toggleNeighborhood(hood)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border-2 ${
                selectedNeighborhoods.includes(hood)
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-slate-900 border-white/5 text-slate-500'
              }`}
            >
              {hood}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">3. Valores Mensais</h3>
        {Object.entries(PRICING).map(([key, data]) => (
            <div 
              key={key}
              onClick={() => setSelectedMode(key as any)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${selectedMode === key ? 'bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500' : 'bg-white/5 border-white/5 opacity-40'}`}
            >
               <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">{key === 'combo' ? 'Combo Especial' : `Plano ${key.toUpperCase()}`}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-500 line-through text-[10px]">R$ {data.original.toFixed(2)}</span>
                        <span className="text-rose-400 text-[10px] font-black uppercase">{data.off}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">R$ {data.promo.toFixed(2)}</p>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase">Poupa R$ {data.save.toFixed(2)}</p>
                  </div>
               </div>
            </div>
        ))}
      </section>
    </div>
  );

  // TELA 2: ESCOLHA DO TIPO DE CRIAÇÃO
  const renderArtChoiceStep = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">Criação da Arte</h2>
        <p className="text-slate-400 text-sm">Como deseja criar o seu banner?</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {/* DIY */}
          <button 
            onClick={() => setStep('diy_editor')}
            className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 text-left hover:border-blue-500/50 transition-all group"
          >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#1E5BFF] mb-4 border border-blue-500/20">
                <Palette size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Personalizar meu banner</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Eu mesmo crio os textos e ajusto o visual com as ferramentas do app.</p>
              <div className="flex items-center gap-2 text-[#1E5BFF] font-black text-[10px] uppercase tracking-widest">
                CRIAR MEU BANNER <ArrowRight size={14} />
              </div>
          </button>

          {/* PRO */}
          <button 
            onClick={() => setStep('pro_confirm')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-left hover:border-amber-500/50 transition-all group relative"
          >
              <div className="absolute top-4 right-6 bg-amber-400 text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Recomendado</div>
              <div className="w-14 h-14 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 mb-4 border border-amber-400/20">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Criação Profissional</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Nossa equipe de designers cria um banner exclusivo focado em conversão.</p>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <span className="text-slate-500 line-through text-xs">R$ 149,90</span>
                    <p className="text-3xl font-black text-white leading-none">R$ 69,90</p>
                </div>
                <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">CONTRATAR TIME</div>
              </div>
          </button>
      </div>
    </div>
  );

  // TELA 3: EDITOR GUIADO (DIY)
  const renderDiyEditor = () => (
    <div className="animate-in fade-in duration-500 space-y-10 pb-20">
        {/* Sticky Preview */}
        <div className="sticky top-20 z-30 pt-2 pb-6 bg-slate-900/80 backdrop-blur-md -mx-6 px-6 border-b border-white/5">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Visualização em Tempo Real</p>
            <div 
                className={`w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl flex flex-col p-4 relative transition-all duration-500 ${diyConfig.animation !== 'none' ? `animate-${diyConfig.animation}` : ''}`}
                style={{ 
                    backgroundColor: diyConfig.bgColor,
                    textAlign: diyConfig.alignment as any,
                    justifyContent: diyConfig.alignment === 'center' ? 'center' : 'flex-start',
                    alignItems: diyConfig.alignment === 'center' ? 'center' : 'flex-start'
                }}
            >
                {diyConfig.showLogo && storeLogo && (
                    <div className={`absolute top-3 ${diyConfig.alignment === 'right' ? 'left-3' : 'right-3'} w-10 h-10 rounded-lg bg-white p-1 shadow-md`}>
                        <img src={storeLogo} className="w-full h-full object-contain" alt="Logo" />
                    </div>
                )}
                <div className={`max-w-[85%] ${diyConfig.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                    <h4 className={`font-black leading-tight mb-1 ${diyConfig.fontSize === 'small' ? 'text-lg' : diyConfig.fontSize === 'medium' ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: diyConfig.fontFamily }}>
                        {diyConfig.title}
                    </h4>
                    <p className="text-[10px] opacity-80 font-medium line-clamp-2" style={{ fontFamily: diyConfig.fontFamily }}>
                        {diyConfig.description}
                    </p>
                    <div className="mt-3 inline-block bg-white text-black text-[8px] font-black px-3 py-1 rounded-full shadow-sm">SAIBA MAIS</div>
                </div>
                <div className="absolute bottom-2 right-4 text-[7px] opacity-40 font-bold uppercase tracking-widest">{storeName}</div>
            </div>
        </div>

        {/* Inputs */}
        <div className="space-y-12">
            <section className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Type size={14} /> 1. Textos do Anúncio
                </h4>
                <div className="space-y-3">
                    <input 
                        value={diyConfig.title}
                        onChange={(e) => setDiyConfig({...diyConfig, title: e.target.value})}
                        placeholder="Título chamativo (Ex: 50% OFF)"
                        className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-[#1E5BFF]"
                    />
                    <textarea 
                        value={diyConfig.description}
                        onChange={(e) => setDiyConfig({...diyConfig, description: e.target.value})}
                        placeholder="Descrição curta do benefício"
                        className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-sm font-medium text-white outline-none focus:border-[#1E5BFF] resize-none h-20"
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Palette size={14} /> 2. Cores e Estilo
                </h4>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {['#1E5BFF', '#DC2626', '#10B981', '#F59E0B', '#9333EA', '#000000', '#FFFFFF'].map(color => (
                        <button 
                            key={color}
                            onClick={() => setDiyConfig({...diyConfig, bgColor: color})}
                            className={`w-10 h-10 rounded-full shrink-0 border-4 transition-all ${diyConfig.bgColor === color ? 'border-blue-400 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-6 pt-2">
                    <button 
                        onClick={() => setDiyConfig({...diyConfig, textColor: diyConfig.textColor === 'white' ? 'black' : 'white'})}
                        className="flex items-center gap-2"
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${diyConfig.textColor === 'black' ? 'bg-black border-white/20' : 'bg-white border-transparent'}`}>
                            {diyConfig.textColor === 'black' && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Texto Escuro</span>
                    </button>
                    <button 
                        onClick={() => setDiyConfig({...diyConfig, showLogo: !diyConfig.showLogo})}
                        className="flex items-center gap-2"
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${diyConfig.showLogo ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                            {diyConfig.showLogo && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exibir Minha Logo</span>
                    </button>
                </div>
            </section>

            <section className="space-y-4 pb-10">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Monitor size={14} /> 3. Alinhamento e Efeito
                </h4>
                <div className="flex gap-4">
                    <div className="flex bg-slate-800 rounded-xl p-1 gap-1 w-fit">
                        <button onClick={() => setDiyConfig({...diyConfig, alignment: 'left'})} className={`p-2 rounded-lg ${diyConfig.alignment === 'left' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setDiyConfig({...diyConfig, alignment: 'center'})} className={`p-2 rounded-lg ${diyConfig.alignment === 'center' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><AlignCenter size={16}/></button>
                        <button onClick={() => setDiyConfig({...diyConfig, alignment: 'right'})} className={`p-2 rounded-lg ${diyConfig.alignment === 'right' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><AlignRight size={16}/></button>
                    </div>
                    <select 
                        value={diyConfig.animation}
                        onChange={(e) => setDiyConfig({...diyConfig, animation: e.target.value as any})}
                        className="flex-1 bg-slate-800 border border-white/5 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none"
                    >
                        <option value="none">Sem Animação</option>
                        <option value="pulse">Pulsação Leve</option>
                        <option value="bounce">Flutuante (Cima/Baixo)</option>
                    </select>
                </div>
            </section>
        </div>
    </div>
  );

  // TELA 4: CONFIRMAÇÃO PRO
  const renderProConfirm = () => (
    <div className="animate-in zoom-in-95 duration-500 pt-6">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Rocket size={40} />
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Criação Profissional</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Nossos designers entrarão em contato para entender sua marca e criar a arte perfeita.
            </p>

            <div className="space-y-4 mb-10 text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500"><Clock size={16}/></div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest">Prazo de Entrega: 72h</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-500"><ShieldCheck size={16}/></div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest">Foco total em vendas</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500"><ImageIcon size={16}/></div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest">Publicação Automática</p>
                </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 mb-6">
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase leading-relaxed">
                    Você poderá solicitar até 3 alterações na arte sem custo adicional.
                </p>
            </div>
        </div>
    </div>
  );

  // TELA 5: CHECKOUT / PAGAMENTO
  const renderPaymentStep = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8 pt-4">
        <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Finalizar Pedido</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase font-black tracking-widest">Checkout Seguro</p>
        </div>

        <section className="bg-slate-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">Forma de Pagamento</h3>
            
            <div className="space-y-3">
                <button 
                    onClick={() => setPaymentMethod('pix')}
                    className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-transparent'}`}
                >
                    <div className="flex items-center gap-4">
                        <QrCode size={20} className={paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-600'} />
                        <span className="font-bold text-sm">PIX (Imediato)</span>
                    </div>
                    {/* Fix: added missing CheckCircle2 icon */}
                    {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
                </button>

                <button 
                    onClick={() => setPaymentMethod('credit')}
                    className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'credit' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-transparent'}`}
                >
                    <div className="flex items-center gap-4">
                        <CreditCard size={20} className={paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-600'} />
                        <span className="font-bold text-sm">Cartão de Crédito</span>
                    </div>
                    {/* Fix: added missing CheckCircle2 icon */}
                    {paymentMethod === 'credit' && <CheckCircle2 size={18} className="text-blue-500" />}
                </button>
            </div>

            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Parcele em até 3x sem juros</p>
            </div>
        </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack} 
            className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">
               Banners Premium <Crown size={16} className="text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">
              {step === 'plans' ? 'Passo 1: Plano' : 
               step === 'art_choice' ? 'Passo 2: Estilo' :
               step === 'diy_editor' ? 'Passo 3: Design' : 
               step === 'payment' ? 'Passo Final: Pagamento' : 'Sucesso'}
            </p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 pb-60">
        {step === 'plans' && renderPlansStep()}
        {step === 'art_choice' && renderArtChoiceStep()}
        {step === 'diy_editor' && renderDiyEditor()}
        {step === 'pro_confirm' && renderProConfirm()}
        {step === 'payment' && renderPaymentStep()}

        {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-400 mb-8 border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                    {/* Fix: added missing CheckCircle2 icon */}
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Pedido Confirmado!</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Sua solicitação de anúncio foi enviada. {diyConfig.title ? 'Seu banner entrará no ar em instantes.' : 'Em breve nosso time de design entrará em contato via chat.'}
                </p>
                <button 
                    onClick={onBack}
                    className="mt-12 text-[#1E5BFF] font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-[#1E5BFF] pb-1"
                >
                    Ir para meu Painel
                </button>
            </div>
        )}
      </main>

      {/* FOOTER FIXO / RESUMO DINÂMICO */}
      {step !== 'success' && (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        
        {/* Resumo */}
        <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total do Investimento</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Check size={10} className="text-blue-500" /> 
                      {selectedMode === 'combo' ? 'Home + Cat' : selectedMode === 'home' ? 'Home' : 'Categorias'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Check size={10} className="text-blue-500" /> 
                      {selectedNeighborhoods.length} {selectedNeighborhoods.length === 1 ? 'bairro' : 'bairros'}
                    </span>
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
          disabled={isSubmitting || selectedNeighborhoods.length === 0}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
              <>
                {step === 'plans' && 'CRIAR MEU BANNER'}
                {step === 'art_choice' && 'SELECIONE UMA OPÇÃO'}
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
