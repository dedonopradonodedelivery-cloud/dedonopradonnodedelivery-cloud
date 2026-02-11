
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  QrCode,
  Paintbrush,
  Upload,
  Calendar,
  Award,
  Image as ImageIcon,
  X,
  Info,
  CreditCard,
  Check,
  ShieldCheck,
  ShieldEllipsis,
  Crown,
  Megaphone,
  Gift,
  Eye,
  MessageSquare,
  // FIX: Added Target icon import from lucide-react
  Target
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  categoryName?: string;
  user: User | null;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

const NEIGHBORHOODS = [
  "Freguesia", "Pechincha", "Anil", "Taquara", "Tanque", 
  "Curicica", "Parque Olímpico", "Gardênia", "Cidade de Deus"
];

// FIX: Defined DISPLAY_MODES constant which was being used but not defined.
const DISPLAY_MODES = [
  { id: 'home', label: 'Página Inicial', icon: Home, price: 69.90 },
  { id: 'cat', label: 'Categorias', icon: LayoutGrid, price: 29.90 },
  { id: 'combo', label: 'Combo Home + Cat', icon: Zap, price: 89.90 },
];

const DURATION_OPTIONS = [
  { months: 1, label: '1 mês' },
  { months: 2, label: '2 meses' },
  { months: 3, label: '3 meses' },
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'config' | 'payment_selection' | 'processing' | 'success'>('sales');
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // --- Estados do Pedido ---
  const [placement, setPlacement] = useState<{home: boolean, cat: boolean}>({ home: false, cat: false });
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [artChoice, setArtChoice] = useState<'my_art' | 'editor' | 'pro' | null>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

  const step2Ref = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialView === 'chat') {
        // Se o lojista clicar em "Chat com Designer" no menu, ele é levado para o histórico ou onboarding do chat
        // Aqui simulamos o redirecionamento para o primeiro pedido PRO encontrado ou volta ao início
        onBack();
    }
  }, [initialView]);

  // --- Precificação ---
  const PRICES = { HOME: 69.90, CAT: 29.90, COMBO: 89.90, PRO_ART: 89.90 };
  const ORIGINAL_PRICES = { HOME: 199.90, CAT: 129.90, COMBO: 329.80 };

  const summary = useMemo(() => {
    let basePrice = 0;
    if (placement.home && placement.cat) basePrice = PRICES.COMBO;
    else if (placement.home) basePrice = PRICES.HOME;
    else if (placement.cat) basePrice = PRICES.CAT;

    const hoodsCount = selectedNeighborhoods.length;
    const hoodsMultiplier = Math.max(1, hoodsCount);
    const subtotal = (basePrice * hoodsMultiplier) * selectedDuration;
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
  }, [placement, selectedNeighborhoods, selectedDuration, artChoice]);

  const handleStartCampaign = () => {
    setView('config');
    window.scrollTo(0, 0);
  };

  const toggleHood = (hood: string) => {
    if (hood === 'Todos') {
      setSelectedNeighborhoods(selectedNeighborhoods.length === NEIGHBORHOODS.length ? [] : [...NEIGHBORHOODS]);
    } else {
      setSelectedNeighborhoods(prev => prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedBanner(event.target?.result as string);
        setArtChoice('my_art');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoToPayment = () => {
    if (!placement.home && !placement.cat) return alert("Selecione onde o anúncio deve aparecer.");
    if (selectedNeighborhoods.length === 0) return alert("Selecione pelo menos um bairro.");
    if (!artChoice) return alert("Escolha uma opção de arte.");
    setView('payment_selection');
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = () => {
    setIsSubmitting(true);
    setView('processing');
    
    setTimeout(() => {
      const campaignId = `CAMP-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Se for PRO, injetamos as mensagens automáticas no chat
      if (artChoice === 'pro') {
          const orderId = `DSG-${Math.floor(1000 + Math.random() * 9000)}`;
          const msg1 = "✅ Pagamento confirmado! Parabéns por escolher o Time Localizei. Nosso time de designers já foi acionado.";
          const msg2 = "Para começarmos, envie por aqui:\n1) Título do banner\n2) Descrição curta\n3) Logo em alta definição";

          const autoMessages = [
            { id: `sys-1`, requestId: orderId, senderId: 'system', senderName: 'Time Localizei', senderRole: 'merchant', text: msg1, timestamp: new Date().toISOString() },
            { id: `sys-2`, requestId: orderId, senderId: 'system', senderName: 'Time Localizei', senderRole: 'merchant', text: msg2, timestamp: new Date().toISOString() }
          ];
          localStorage.setItem(`msgs_${orderId}`, JSON.stringify(autoMessages));
          localStorage.setItem(`last_designer_order`, orderId);
      }

      setIsSubmitting(false);
      setView('success');
    }, 2500);
  };

  if (isEditingArt) {
    return (
      <StoreBannerEditor 
        storeName={user?.user_metadata?.store_name || "Sua Loja"} 
        onSave={() => { setIsEditingArt(false); setArtChoice('editor'); }} 
        onBack={() => setIsEditingArt(false)} 
      />
    );
  }

  if (view === 'processing') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1E5BFF] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-[#1E5BFF] animate-pulse" />
              </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Validando Pagamento</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Estamos confirmando sua transação. <br/>Não feche esta tela.</p>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-8 shadow-lg">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">Sucesso!</h1>
          <p className="text-slate-400 text-sm font-medium max-w-xs mb-12 leading-relaxed">
            {artChoice === 'pro' 
                ? 'Seu pedido de design foi recebido. Em instantes você será levado ao chat com nosso time.'
                : 'Seu banner foi publicado com sucesso e já está visível para o bairro.'}
          </p>
          <button 
            onClick={() => {
                if (artChoice === 'pro') {
                    const id = localStorage.getItem('last_designer_order');
                    onNavigate('service_chat', { requestId: id });
                } else {
                    onBack();
                }
            }}
            className="w-full max-w-sm py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            {artChoice === 'pro' ? 'Ir para o Chat' : 'Voltar ao Painel'}
          </button>
      </div>
    );
  }

  if (view === 'payment_selection') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-white/5 flex items-center gap-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
          <button onClick={() => setView('config')} className="p-2 bg-white/5 rounded-xl"><ChevronLeft size={20}/></button>
          <h1 className="font-black text-lg uppercase tracking-tighter">Checkout Seguro</h1>
        </header>
        <main className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl text-center">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Total a Investir</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-xl font-bold text-slate-400">R$</span>
                <span className="text-5xl font-black text-white tracking-tighter">{summary.total.toFixed(2).replace('.', ',')}</span>
              </div>
          </div>
          <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Escolha como pagar</p>
              <button onClick={() => setPaymentMethod('pix')} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-transparent'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'pix' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}><QrCode size={24} /></div>
                  <div><p className="font-black text-sm uppercase">Pix Imediato</p></div>
                </div>
                {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
              </button>
              <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-transparent'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}><CreditCard size={24} /></div>
                  <div><p className="font-black text-sm uppercase">Cartão de Crédito</p></div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={18} className="text-blue-500" />}
              </button>
          </div>
        </main>
        <footer className="p-6 bg-slate-950 border-t border-white/10 pb-12">
          <button onClick={handleConfirmPayment} className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-[0.98] transition-all"><ShieldCheck size={20} /> Efetuar Pagamento</button>
        </footer>
      </div>
    );
  }

  // --- TELA DE VENDAS PRINCIPAL (LANDING) ---
  if (view === 'sales') {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col animate-in fade-in duration-500">
            <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
                <div>
                    <h1 className="font-bold text-lg leading-none">Anunciar no Bairro</h1>
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Visibilidade Premium</p>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-12 overflow-y-auto no-scrollbar pb-32">
                <section className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.95]">
                        Domine a atenção<br/>do seu bairro
                    </h2>
                    <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
                        Coloque sua loja no topo do app e seja a primeira escolha de quem mora e compra perto de você.
                    </p>
                </section>

                <div className="grid grid-cols-1 gap-6">
                    {[
                        { icon: Megaphone, title: "Máximo Alcance", desc: "Apareça para milhares de moradores diariamente.", color: "text-blue-400" },
                        { icon: Target, title: "Foco Regional", desc: "Anuncie apenas nos bairros que fazem sentido para você.", color: "text-purple-400" },
                        { icon: Gift, title: "Ofertas em Destaque", desc: "Sua promoção será a primeira a ser vista.", color: "text-amber-400" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-5 p-6 bg-slate-900 rounded-3xl border border-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                <item.icon className={item.color} size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase">{item.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/30 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Award className="text-amber-400" size={24} />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Selo Fundador Apoiador</h3>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-bold">
                        Lojistas que anunciarem agora na inauguração recebem o selo exclusivo de <span className="text-amber-400 uppercase">Fundador Apoiador</span> no perfil público.
                    </p>
                </div>

                <button 
                    onClick={handleStartCampaign}
                    className="w-full py-6 bg-[#1E5BFF] hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                    Criar meu Anúncio <ArrowRight size={18} />
                </button>
            </main>
        </div>
    );
  }

  // --- TELA DE CONFIGURAÇÃO (WIZARD) ---
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={() => setView('sales')} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="font-bold text-lg leading-none">Configurar Campanha</h1>
          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Passo a Passo</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-12 pb-48 max-w-md mx-auto w-full">
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">1. Onde deseja aparecer?</h3>
          <div className="grid grid-cols-1 gap-4">
            {DISPLAY_MODES.map((mode) => (
              <button 
                key={mode.id} 
                onClick={() => setPlacement({ home: mode.id === 'home' || mode.id === 'combo', cat: mode.id === 'cat' || mode.id === 'combo' })} 
                className={`flex items-start text-left p-6 rounded-[2rem] border-2 transition-all gap-5 ${((placement.home && !placement.cat && mode.id === 'home') || (!placement.home && placement.cat && mode.id === 'cat') || (placement.home && placement.cat && mode.id === 'combo')) ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}
              >
                <div className="p-4 rounded-2xl bg-white/5"><mode.icon size={28} /></div>
                <div className="flex-1">
                  <p className="font-black text-white uppercase tracking-tight">{mode.label}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-white">R$ {mode.price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase ml-1">/mês</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">2. Bairros de Alcance</h3>
          <div className="grid grid-cols-2 gap-3">
              <button onClick={() => toggleHood('Todos')} className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>Todos os bairros</button>
              {NEIGHBORHOODS.map(hood => (
                  <button key={hood} onClick={() => toggleHood(hood)} className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>{hood}</button>
              ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 px-1">3. Design do Banner</h3>
          <div className="space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={`w-full p-6 rounded-3xl border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'my_art' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 shrink-0">{uploadedBanner ? <img src={uploadedBanner} className="w-full h-full object-cover rounded-lg" /> : <Upload size={24} />}</div>
                <div className="min-w-0 flex-1"><h4 className="font-bold text-white text-sm truncate">{uploadedBanner ? 'Banner selecionado' : 'Usar minha própria arte'}</h4></div>
              </button>
              <button onClick={() => setIsEditingArt(true)} className={`w-full p-6 rounded-3xl border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'editor' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Paintbrush size={24} /></div><div><h4 className="font-bold text-white text-sm">Criar no editor JPA</h4></div></button>
              <button onClick={() => setArtChoice('pro')} className={`relative w-full p-6 rounded-3xl border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'pro' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Rocket size={24} /></div><div><h4 className="font-bold text-white text-sm">Design com Time Localizei</h4><p className="text-[10px] text-slate-500 mt-0.5">Criamos a arte para você (+R$ 89,90).</p></div></button>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto rounded-t-[2.5rem]">
        <div className="mb-4 flex justify-between items-end">
            <div className="space-y-1">
                <p className="text-xs font-bold text-slate-300">Plano: <span className="text-white">{summary.placementLabel}</span></p>
                <p className="text-xs font-bold text-slate-300">Total Bairros: <span className="text-white">{summary.hoodsCount}</span></p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total da Campanha</p>
                <p className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">R$ {summary.total.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
        <button onClick={handleGoToPayment} disabled={isSubmitting} className={`w-full py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${ (placement.home || placement.cat) && selectedNeighborhoods.length > 0 && artChoice ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50' }`}>
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Pagar e Publicar <ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};
