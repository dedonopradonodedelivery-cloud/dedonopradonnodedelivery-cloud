
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
  AlertTriangle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StoreBannerEditor } from '@/components/StoreBannerEditor';
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

const PLACEMENT_OPTIONS = [
  { id: 'home', label: 'Home', icon: Home, price: 69.90, desc: 'Sua loja no carrossel principal da página inicial.' },
  { id: 'subcat', label: 'Subcategorias', icon: LayoutGrid, price: 49.90, desc: 'Banner fixo no topo das buscas por categoria.' },
  { id: 'combo', label: 'Home + Subcategorias', icon: Zap, price: 99.90, desc: 'Visibilidade máxima: Página Inicial + Categorias.' },
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
  const [selectedPlacement, setSelectedPlacement] = useState<'home' | 'subcat' | 'combo' | null>(null);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [artChoice, setArtChoice] = useState<'my_art' | 'editor' | 'pro' | null>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

  // Refs para automações de UX
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialView === 'chat') setView('chat');
  }, [initialView]);

  // --- Precificação Unificada (Banners em Destaque) ---
  const PRICES = { PRO_ART: 89.90 };

  const summary = useMemo(() => {
    const placement = PLACEMENT_OPTIONS.find(p => p.id === selectedPlacement);
    const basePrice = placement?.price || 0;
    
    const hoodsCount = selectedNeighborhoods.length;
    const hoodsMultiplier = Math.max(1, hoodsCount);
    const subtotal = (basePrice * hoodsMultiplier) * selectedDuration;
    const artExtra = artChoice === 'pro' ? PRICES.PRO_ART : 0;
    const total = subtotal + artExtra;

    return {
      hoodsCount,
      subtotal,
      artExtra,
      total,
      placementLabel: placement?.label || 'Banners em Destaque'
    };
  }, [selectedPlacement, selectedNeighborhoods, selectedDuration, artChoice]);

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
    if (!selectedPlacement) return alert("Selecione onde deseja anunciar.");
    if (selectedNeighborhoods.length === 0) return alert("Selecione pelo menos um bairro.");
    if (!artChoice) return alert("Escolha uma opção de arte.");
    setView('payment_selection');
    window.scrollTo(0, 0);
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setView('processing');
    
    try {
        if (!user || !supabase) throw new Error("Acesso não disponível");

        const campaignId = `CAMP-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const activeCampaigns = JSON.parse(localStorage.getItem('active_ads_jpa') || '[]');
        activeCampaigns.push({
            id: campaignId,
            user: user?.id,
            placement: selectedPlacement,
            hoods: selectedNeighborhoods,
            duration: selectedDuration,
            total: summary.total,
            artType: artChoice,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('active_ads_jpa', JSON.stringify(activeCampaigns));

        const { error: dbError } = await supabase.from('published_banners').insert({
            merchant_id: user.id,
            target: selectedPlacement === 'home' ? 'home' : selectedPlacement === 'subcat' ? 'category' : 'featured',
            config: {
                art_type: artChoice,
                hoods: selectedNeighborhoods,
                duration: selectedDuration
            }
        });

        if (dbError && (dbError.code === 'PGRST116' || dbError.message.includes('schema cache'))) {
            throw new Error("MIGRATION_MISSING");
        }

        if (artChoice === 'pro') {
            const orderId = `DSG-${Math.floor(1000 + Math.random() * 9000)}`;
            const initialMsgs = [
                { id: 1, requestId: orderId, senderId: 'system', senderName: 'Localizei JPA', senderRole: 'merchant', text: '🎉 Parabéns pela sua campanha!\nSeu banner será criado pelo time Localizei.', timestamp: new Date().toISOString() },
                { id: 2, requestId: orderId, senderId: 'system', senderName: 'Localizei JPA', senderRole: 'merchant', text: 'Para começarmos a criação do seu banner, envie por aqui:\n• Nome da loja\n• Logo (se tiver)\n• Cores ou referências visuais\n• Texto promocional (se desejar)', timestamp: new Date().toISOString() }
            ];
            localStorage.setItem(`msgs_${orderId}`, JSON.stringify(initialMsgs));
        }

        setTimeout(() => {
            setIsSubmitting(false);
            setView('success');
        }, 2000);

    } catch (err: any) {
        setIsSubmitting(false);
        setView('payment_selection');
        alert(`Erro ao processar: ${err.message}`);
    }
  };

  if (isEditingArt) {
    return <StoreBannerEditor storeName={user?.user_metadata?.store_name || "Sua Loja"} onSave={(design) => { setIsEditingArt(false); setArtChoice('editor'); setUploadedBanner(null); }} onBack={() => setIsEditingArt(false)} />;
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
          <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">Estamos confirmando sua transação com o banco.</p>
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
          <p className="text-slate-400 text-sm font-medium max-w-xs mb-10 leading-relaxed">Parabéns! Sua campanha de Banners em Destaque foi ativada com sucesso.</p>
          <div className="w-full masonry-box bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 text-left space-y-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Resumo da Contratação</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Plano</span><span className="text-sm font-black text-white">{summary.placementLabel}</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Alcance</span><span className="text-sm font-black text-white">{summary.hoodsCount} Bairro(s)</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400 font-bold uppercase">Vigência</span><span className="text-sm font-black text-blue-400">{selectedDuration} Mês(es)</span></div>
              </div>
          </div>
          <div className="mt-12 w-full max-w-sm space-y-4">
            <button onClick={onBack} className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs">Concluir e Ver Anúncio</button>
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
                  <div className={`p-3 rounded-xl ${paymentMethod === 'pix' ? 'bg-blue-50 text-white' : 'bg-white/5 text-slate-500'}`}><QrCode size={24} /></div>
                  <div><p className="font-black text-sm uppercase">Pix Imediato</p><p className="text-[10px] text-slate-400 font-bold">Liberação instantânea do anúncio</p></div>
                </div>
                {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
              </button>
              <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-transparent'}`}>
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-blue-50 text-white' : 'bg-white/5 text-slate-500'}`}><CreditCard size={24} /></div>
                  <div><p className="font-black text-sm uppercase">Cartão de Crédito</p><p className="text-[10px] text-slate-400 font-bold">Em até 12x (consulte taxas)</p></div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={18} className="text-blue-500" />}
              </button>
          </div>
        </main>
        <footer className="p-6 bg-slate-950 border-t border-white/10 pb-12">
          <button onClick={handleConfirmPayment} className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-[0.98] transition-all"><ShieldCheck size={20} /> Efetuar Pagamento</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={20} /></button>
        <div><h1 className="font-bold text-lg leading-none">Banners em Destaque</h1><p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração de Campanha</p></div>
      </header>

      <main className="flex-1 p-6 space-y-16 pb-[320px] max-w-md mx-auto w-full">
        
        {/* APRESENTAÇÃO E CONTEXTO (TOPO DO FLUXO) */}
        <section className="space-y-8">
          <div className="px-1 space-y-4 text-center">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                Banners em Destaque
            </h3>
            <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
                Aumente sua visibilidade no bairro com benefícios exclusivos de Fundador Apoiador.
            </p>
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/30 p-6 rounded-[2.5rem] text-left relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">Fundador Apoiador do Localizei JPA</h4>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed font-bold">
                  🔒 Oferta de inauguração: Preços especiais garantidos por 12 meses.
              </p>
            </div>
          </div>
        </section>

        {/* PASSO 0: POSICIONAMENTO */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
            <LayoutGrid size={14} /> 0. Onde deseja anunciar?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {PLACEMENT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedPlacement(opt.id as any)}
                className={`p-5 rounded-3xl border-2 text-left flex items-center gap-4 transition-all active:scale-[0.98] ${selectedPlacement === opt.id ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10 text-slate-400'}`}
              >
                <div className={`p-3 rounded-2xl ${selectedPlacement === opt.id ? 'bg-blue-50 text-blue-600 shadow-md' : 'bg-white/5 text-slate-500'}`}>
                  <opt.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase text-white leading-tight">{opt.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{opt.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">R$ {opt.price.toFixed(2)}</p>
                  <p className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter">por mês/bairro</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CONTAINER DE PASSOS SEQUENCIAIS (HABILITADO APÓS PASSO 0) */}
        <div className={`transition-all duration-500 space-y-16 ${!selectedPlacement ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}`}>
            
            {/* PASSO 1: BAIRROS */}
            <section className="space-y-6 scroll-mt-24">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><MapPin size={14} /> 1. Quais bairros?</h3>
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => toggleHood('Todos')} className={`col-span-2 p-4 rounded-2xl border-2 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${selectedNeighborhoods.length === NEIGHBORHOODS.length ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>Todos os bairros</button>
                  {NEIGHBORHOODS.map(hood => (
                      <button key={hood} onClick={() => toggleHood(hood)} className={`p-4 rounded-2xl border-2 text-[10px] font-bold uppercase transition-all ${selectedNeighborhoods.includes(hood) ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>{hood}</button>
                  ))}
              </div>
            </section>

            {/* PASSO 2: TEMPO */}
            <section className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Calendar size={14} /> 2. Tempo de exibição</h3>
              <div className="grid grid-cols-3 gap-3">
                  {DURATION_OPTIONS.map(opt => (
                      <button key={opt.months} onClick={() => setSelectedDuration(opt.months)} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedDuration === opt.months ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                          <span className="text-xs font-black uppercase leading-none">{opt.label}</span>
                          <span className={`text-[7px] font-bold mt-2 uppercase ${selectedDuration === opt.months ? 'text-blue-100' : 'text-slate-600'}`}>{getDatesForDuration(opt.months)}</span>
                      </button>
                  ))}
              </div>
            </section>

            {/* PASSO 3: ARTE */}
            <section className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1"><Palette size={14} /> 3. Arte do Banner</h3>
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
        </div>
      </main>

      {/* FOOTER: RESUMO E CONCLUSÃO */}
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
        <button onClick={handleGoToPayment} className={`w-full py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${ selectedPlacement && selectedNeighborhoods.length > 0 && artChoice ? 'bg-[#1E5BFF] text-white hover:bg-blue-600' : 'bg-white/5 text-slate-500 cursor-not-allowed' }`}>
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Concluir compra <ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};
