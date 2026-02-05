
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
  Crown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';

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

const DURATION_OPTIONS = [
  { months: 1, label: '1 mês' },
  { months: 2, label: '2 meses' },
  { months: 3, label: '3 meses' },
  { months: 4, label: '4 meses' },
  { months: 5, label: '5 meses' },
  { months: 6, label: '6 meses' },
];

const getDatesForDuration = (months: number) => {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + (months * 30));
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return `${fmt(start)} → ${fmt(end)}`;
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user, initialView = 'sales' }) => {
  const [view, setView] = useState<'sales' | 'payment_selection' | 'processing' | 'success' | 'chat'>('sales');
  const [isEditingArt, setIsEditingArt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  // --- Estados do Pedido ---
  const [placement, setPlacement] = useState<{home: boolean, cat: boolean}>({ home: false, cat: false });
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [artChoice, setArtChoice] = useState<'my_art' | 'editor' | 'pro' | null>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

  // Refs para automações de UX
  const step2Ref = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialView === 'chat') setView('chat');
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
      placementLabel: placement.home && placement.cat ? 'Home + Categorias' : placement.home ? 'Página Inicial' : placement.cat ? 'Categorias' : 'Escolha um plano'
    };
  }, [placement, selectedNeighborhoods, selectedDuration, artChoice]);

  const handlePlacementSelection = (choice: {home: boolean, cat: boolean}) => {
    setPlacement(choice);
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
      const activeCampaigns = JSON.parse(localStorage.getItem('active_ads_jpa') || '[]');
      activeCampaigns.push({
          id: campaignId,
          user: user?.id,
          placement,
          hoods: selectedNeighborhoods,
          duration: selectedDuration,
          total: summary.total,
          artType: artChoice,
          timestamp: new Date().toISOString()
      });
      localStorage.setItem('active_ads_jpa', JSON.stringify(activeCampaigns));

      if (artChoice === 'pro') {
          const orderId = `DSG-${Math.floor(1000 + Math.random() * 9000)}`;
          const initialMsgs = [
              { id: 1, requestId: orderId, senderId: 'system', senderName: 'Localizei JPA', senderRole: 'merchant', text: '🎉 Parabéns pela sua campanha!\nSeu banner será criado pelo time Localizei.', timestamp: new Date().toISOString() },
              { id: 2, requestId: orderId, senderId: 'system', senderName: 'Localizei JPA', senderRole: 'merchant', text: 'Para começarmos a criação do seu banner, envie por aqui:\n• Nome da loja\n• Logo (se tiver)\n• Cores ou referências visuais\n• Texto promocional (se desejar)', timestamp: new Date().toISOString() },
              { id: 3, requestId: orderId, senderId: 'system', senderName: 'Localizei JPA', senderRole: 'merchant', text: 'Caso prefira, nosso time pode criar o banner completo para você.', timestamp: new Date().toISOString() }
          ];
          localStorage.setItem(`msgs_${orderId}`, JSON.stringify(initialMsgs));
          localStorage.setItem(`designer_order_${campaignId}`, orderId);
      }

      setIsSubmitting(false);
      setView('success');
    }, 3000);
  };

  const handleGoToDesignerChat = () => {
      const activeCampaigns = JSON.parse(localStorage.getItem('active_ads_jpa') || '[]');
      const lastCamp = activeCampaigns[activeCampaigns.length - 1];
      const orderId = localStorage.getItem(`designer_order_${lastCamp.id}`);
      if (orderId) {
          onNavigate('service_chat', { requestId: orderId });
      } else {
          onBack();
      }
  };

  if (isEditingArt) {
    return <StoreBannerEditor storeName={user?.user_metadata?.store_name || "Sua Loja"} onSave={() => { setIsEditingArt(false); setArtChoice('editor'); }} onBack={() => setIsEditingArt(false)} />;
  }

  if (view === 'processing') {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1E5BFF] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldEllipsis className="w-10 h-10 text-[#1E5BFF] animate-pulse" />
              </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Validando Pagamento</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Estamos confirmando sua transação com o banco. <br/>Não feche esta tela.</p>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col animate-in zoom-in duration-500 overflow-y-auto no-scrollbar pb-32">
        <main className="p-8 flex-1 flex flex-col items-center justify-center text-center pt-20">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">Destaque Confirmado!</h1>
          <p className="text-slate-400 text-sm font-medium max-w-xs mb-10 leading-relaxed">Parabéns! Sua campanha foi ativada e o espaço no bairro já está reservado exclusivamente para você.</p>
          <div className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 text-left space-y-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Resumo da Contratação</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Plano</span><span className="text-sm font-black text-white">{summary.placementLabel}</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Alcance</span><span className="text-sm font-black text-white">{summary.hoodsCount} Bairro(s)</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Vigência</span><span className="text-sm font-black text-blue-400">{selectedDuration} Mês(es)</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Tipo de Arte</span><span className="text-sm font-black text-white">{artChoice === 'pro' ? 'Time Localizei' : 'Própria'}</span></div>
              </div>
          </div>
          <div className="mt-12 w-full max-w-sm space-y-4">
            {artChoice === 'pro' ? (
                <button onClick={handleGoToDesignerChat} className="w-full py-5 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                  Ir para Chat com Designer <ArrowRight size={18} />
                </button>
            ) : (
                <button onClick={onBack} className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs">Concluir e Ver Anúncio</button>
            )}
            <button onClick={onBack} className="w-full py-2 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">Voltar ao painel</button>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'payment_selection') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-white/5 flex items-center gap-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
          <button onClick={() => setView('sales')} className="p-2 bg-white/5 rounded-xl"><ChevronLeft size={20}/></button>
          <h1 className="font-black text-lg uppercase tracking-tighter">Checkout Seguro</h1>
        </header>
        <main className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden text-center">
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
                  <div><p className="font-black text-sm uppercase">Pix Imediato</p><p className="text-[10px] text-slate-400 font-bold">Liberação instantânea do anúncio</p></div>
                </div>
                {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
              </button>
              <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-transparent'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}><CreditCard size={24} /></div>
                  <div><p className="font-black text-sm uppercase">Cartão de Crédito</p><p className="text-[10px] text-slate-400 font-bold">Em até 12x (consulte taxas)</p></div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={18} className="text-blue-500" />}
              </button>
          </div>
          {paymentMethod === 'card' && (
              <div className="bg-slate-900 rounded-[2rem] p-6 border border-white/5 space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número do Cartão</label><input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-500 transition-all" /></div>
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Validade</label><input type="text" placeholder="MM/AA" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none" /></div><div className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CVV</label><input type="text" placeholder="123" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none" /></div></div>
              </div>
          )}
        </main>
        <footer className="p-6 bg-slate-950 border-t border-white/10 pb-12">
          <button onClick={handleConfirmPayment} className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-[0.98] transition-all"><ShieldCheck size={20} /> Efetuar Pagamento</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div><h1 className="font-bold text-lg leading-none">Anunciar no Bairro</h1><p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p></div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-[320px] max-w-md mx-auto w-full">
        <section className="space-y-8">
          <div className="px-1 space-y-4 text-center">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                Domine a atenção<br/>do seu bairro
            </h3>
            <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
                Coloque sua loja no topo do app e seja a primeira escolha de quem mora e compra perto de você.
            </p>
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/30 p-6 rounded-[2.5rem] text-left relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">Fundador Apoiador do Localizei JPA</h4>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] text-slate-200 leading-relaxed font-bold">
                    🔒 Ao apoiar o Localizei JPA no mês de inauguração, você congela este preço com desconto por 12 meses.
                    <span className="text-white"> Você paga mês a mês, sem necessidade de contratar um plano anual.</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    O desconto de fundador é válido por tempo indeterminado para quem entra agora, garantindo o mesmo valor promocional durante todo o primeiro ano.
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                    Após o lançamento, novos anunciantes entram com o preço normal.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
              <button onClick={() => handlePlacementSelection({ home: true, cat: false })} className={`flex items-start text-left p-6 rounded-[2rem] border-2 transition-all gap-5 ${placement.home && !placement.cat ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                <div className={`p-4 rounded-2xl shrink-0 ${placement.home && !placement.cat ? 'bg-blue-50 text-white' : 'bg-white/5 text-slate-400'}`}><Home size={28} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><p className="font-black text-white uppercase tracking-tight">Home</p></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 line-through font-bold">R$ {ORIGINAL_PRICES.HOME.toFixed(2)}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white">R$ {PRICES.HOME.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/mês</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Crown size={8} className="fill-amber-400" /> Selo: Fundador Apoiador
                    </div>
                  </div>
                </div>
              </button>

              <button onClick={() => handlePlacementSelection({ home: false, cat: true })} className={`flex items-start text-left p-6 rounded-[2rem] border-2 transition-all gap-5 ${!placement.home && placement.cat ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                <div className={`p-4 rounded-2xl shrink-0 ${!placement.home && placement.cat ? 'bg-blue-50 text-white' : 'bg-white/5 text-slate-400'}`}><LayoutGrid size={28} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><p className="font-black text-white uppercase tracking-tight">Subcategorias</p></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 line-through font-bold">R$ {ORIGINAL_PRICES.CAT.toFixed(2)}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white">R$ {PRICES.CAT.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/mês</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Crown size={8} className="fill-amber-400" /> Selo: Fundador Apoiador
                    </div>
                  </div>
                </div>
              </button>

              <button onClick={() => handlePlacementSelection({ home: true, cat: true })} className={`relative flex items-start text-left p-6 rounded-[2rem] border-2 transition-all gap-5 ${placement.home && placement.cat ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                <div className={`p-4 rounded-2xl shrink-0 ${placement.home && placement.cat ? 'bg-blue-50 text-white' : 'bg-white/5 text-slate-400'}`}><Zap size={28} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><p className="font-black text-white uppercase tracking-tight">Home + Subcategorias</p></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 line-through font-bold">R$ {ORIGINAL_PRICES.COMBO.toFixed(2)}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white">R$ {PRICES.COMBO.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/mês</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Crown size={8} className="fill-amber-400" /> Selo: Fundador Apoiador
                    </div>
                  </div>
                </div>
              </button>
          </div>
        </section>

        <section ref={step2Ref} className="space-y-6 scroll-mt-24">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><MapPin size={14} /> 2. Quais bairros?</h3>
          <div className="grid grid-cols-2 gap-3">
              <button onClick={() => toggleHood('Todos')} className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>Todos os bairros</button>
              {NEIGHBORHOODS.map(hood => (
                  <button key={hood} onClick={() => toggleHood(hood)} className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>{hood}</button>
              ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Calendar size={14} /> 3. Tempo de exibição</h3>
          <div className="grid grid-cols-3 gap-3">
              {DURATION_OPTIONS.map(opt => (
                  <button key={opt.months} onClick={() => setSelectedDuration(opt.months)} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedDuration === opt.months ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                      <span className="text-xs font-black uppercase leading-none">{opt.label}</span>
                      <span className={`text-[7px] font-bold mt-2 uppercase ${selectedDuration === opt.months ? 'text-blue-100' : 'text-slate-600'}`}>{getDatesForDuration(opt.months)}</span>
                  </button>
              ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Palette size={14} /> 4. Escolha seu Banner</h3>
          <div className="space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'my_art' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 shrink-0">{uploadedBanner ? <img src={uploadedBanner} className="w-full h-full object-cover rounded-lg" /> : <Upload size={24} />}</div>
                <div className="min-w-0 flex-1"><h4 className="font-bold text-white text-sm truncate">{uploadedBanner ? 'Banner selecionado' : 'Usar meu banner'}</h4></div>
                {uploadedBanner && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
              </button>
              <button onClick={() => setIsEditingArt(true)} className={`w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'editor' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Paintbrush size={24} /></div><div><h4 className="font-bold text-white text-sm">Criar banner personalizado</h4></div></button>
              <button onClick={() => setArtChoice('pro')} className={`relative w-full p-6 rounded-[2rem] border-2 text-left flex items-center gap-5 transition-all ${artChoice === 'pro' ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-white/5 border-white/10'}`}><div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Rocket size={24} /></div><div><h4 className="font-bold text-white text-sm">Fazer com time Localizei</h4><p className="text-[10px] text-slate-500 mt-0.5">Designers criam para você (+R$ 89,90).</p></div></button>
          </div>
        </section>
      </main>

      <div className="fixed bottom-[90px] left-0 right-0 p-6 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 z-[100] max-w-md mx-auto rounded-t-[2.5rem]">
        <div className="mb-4 flex justify-between items-end">
            <div className="space-y-1">
                <p className="text-xs font-bold text-slate-300">Plano: <span className="text-white">{summary.placementLabel}</span></p>
                <p className="text-xs font-bold text-slate-300">Total Bairros: <span className="text-white">{summary.hoodsCount}</span></p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total da Campanha</p>
                <p className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">R$ {summary.total.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
        <button onClick={handleGoToPayment} disabled={isSubmitting} className={`w-full py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${ (placement.home || placement.cat) && selectedNeighborhoods.length > 0 && artChoice ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed' }`}>
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Concluir compra <ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};
