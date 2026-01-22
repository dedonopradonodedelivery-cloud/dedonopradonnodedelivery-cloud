
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  X,
  Megaphone,
  Crown,
  Target,
  TrendingUp,
  MapPin,
  LayoutTemplate,
  Palette,
  CreditCard,
  Zap,
  Star,
  ShoppingBag
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
}

const NEIGHBORHOODS = [
  "Jacarepaguá", "Freguesia", "Pechincha", "Taquara", "Anil", 
  "Curicica", "Gardênia Azul", "Cidade de Deus", "Praça Seca"
];

const BENEFIT_CARDS = [
  { 
    title: "Público Local Qualificado", 
    desc: "Anúncios exibidos apenas para moradores dos bairros escolhidos.",
    icon: Target 
  },
  { 
    title: "Mais Cliques, Mais Vendas", 
    desc: "Banners Premium geram até 4x mais visualizações.",
    icon: TrendingUp 
  },
  { 
    title: "Segmentação por Bairro", 
    desc: "Anuncie somente onde seu cliente realmente está.",
    icon: MapPin 
  }
];

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, user }) => {
  // --- States ---
  const [bannerType, setBannerType] = useState<'home' | 'categories' | 'combo'>('combo');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(["Freguesia"]);
  const [duration, setDuration] = useState<'1m' | '3m'>('1m');
  const [paymentMethod, setPaymentMethod] = useState<'vista' | 'parcelado'>('vista');
  const [creationType, setCreationType] = useState<'own' | 'pro'>('own');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Pricing Logic ---
  const calculateTotal = useMemo(() => {
    let base = 0;
    if (bannerType === 'home') base = duration === '1m' ? 89.90 : 149.90;
    else if (bannerType === 'categories') base = duration === '1m' ? 49.90 : 89.90;
    else base = duration === '1m' ? 119.90 : 199.90;

    // Adicional por bairro (primeiro bairro incluso)
    const extraNeighborhoods = Math.max(0, selectedNeighborhoods.length - 1);
    const neighborhoodCost = extraNeighborhoods * 15.00 * (duration === '1m' ? 1 : 2.5); // Desconto no 3m

    // Criação profissional
    const creationCost = creationType === 'pro' ? 69.90 : 0;

    return base + neighborhoodCost + creationCost;
  }, [bannerType, selectedNeighborhoods, duration, creationType]);

  const handleToggleNeighborhood = (hood: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(hood) ? prev.filter(h => h !== hood) : [...prev, hood]
    );
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Integração com gateway de pagamento: Redirecionando para checkout seguro...");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-none flex items-center gap-2">
               Banners Premium <Crown size={16} className="text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Configuração</p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-60">
        
        {/* 2. HERO / PROPOSTA DE VALOR */}
        <section className="px-6 py-12 bg-gradient-to-br from-blue-900/20 via-[#020617] to-purple-900/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e40af33,transparent_50%)]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white leading-tight font-display tracking-tight mb-4 animate-in slide-in-from-top duration-700">
              Destaque sua marca <br/>no <span className="text-[#1E5BFF]">bairro certo</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium animate-in fade-in duration-1000 delay-300">
              Apareça no topo da Home e das Categorias para mais de <span className="text-white font-bold">450 moradores ativos</span> em Jacarepaguá ou escolha bairros estratégicos.
            </p>
          </div>
        </section>

        {/* 3. BENEFÍCIOS */}
        <section className="px-6 -mt-6">
          <div className="grid gap-4">
            {BENEFIT_CARDS.map((benefit, idx) => (
              <div key={idx} className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex gap-4 items-center animate-in slide-in-from-bottom duration-500 delay-[200ms]">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
                  <benefit.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{benefit.title}</h4>
                  <p className="text-xs text-slate-500 leading-snug">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ESCOLHA DO TIPO DE BANNER */}
        <section className="px-6 mt-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                <LayoutTemplate size={14} /> 1. Onde deseja aparecer?
            </h3>
            <div className="grid gap-3">
                {[
                    { id: 'home', label: 'Banner na Home', price: 'A partir de R$ 89,90' },
                    { id: 'categories', label: 'Banner nas Categorias', price: 'A partir de R$ 49,90' },
                    { id: 'combo', label: 'Home + Categorias', price: 'Recomendado • R$ 119,90', isBest: true },
                ].map((type) => (
                    <button 
                        key={type.id}
                        onClick={() => setBannerType(type.id as any)}
                        className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
                            bannerType === type.id 
                            ? 'bg-blue-600/10 border-[#1E5BFF] shadow-[0_0_20px_rgba(30,91,255,0.1)]' 
                            : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                    >
                        {type.isBest && (
                            <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Recomendado</div>
                        )}
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${bannerType === type.id ? 'border-[#1E5BFF]' : 'border-slate-700'}`}>
                                {bannerType === type.id && <div className="w-2.5 h-2.5 bg-[#1E5BFF] rounded-full"></div>}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">{type.label}</h4>
                                <p className="text-xs text-slate-500 mt-1 font-bold">{type.price}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </section>

        {/* 5. SELEÇÃO DE BAIRROS */}
        <section className="px-6 mt-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-2">2. Escolha os bairros</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Você pode selecionar um ou vários bairros. O valor será somado automaticamente.</p>
            
            <div className="flex flex-wrap gap-2">
                {NEIGHBORHOODS.map(hood => (
                    <button 
                        key={hood}
                        onClick={() => handleToggleNeighborhood(hood)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border-2 ${
                            selectedNeighborhoods.includes(hood)
                            ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20'
                            : 'bg-slate-900 text-slate-500 border-white/5 hover:border-white/20'
                        }`}
                    >
                        {hood}
                    </button>
                ))}
            </div>
        </section>

        {/* 6. PLANOS E PREÇOS */}
        <section className="px-6 mt-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6">3. Planos e Duração</h3>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setDuration('1m')}
                    className={`p-6 rounded-3xl border-2 text-center transition-all ${
                        duration === '1m' ? 'bg-blue-600/10 border-[#1E5BFF]' : 'bg-white/5 border-white/5'
                    }`}
                >
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">1 Mês</p>
                    <div className="flex flex-col items-center">
                        <span className="text-slate-500 text-[10px] line-through">R$ 199,90</span>
                        <span className="text-xl font-black text-white">R$ 89,90</span>
                    </div>
                </button>

                <button 
                    onClick={() => setDuration('3m')}
                    className={`p-6 rounded-3xl border-2 text-center transition-all relative overflow-hidden ${
                        duration === '3m' ? 'bg-blue-600/10 border-[#1E5BFF]' : 'bg-white/5 border-white/5'
                    }`}
                >
                    <div className="absolute top-0 left-0 right-0 bg-blue-500 text-[8px] font-black py-1 uppercase tracking-widest">Mais vantajoso</div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2 mt-2">3 Meses</p>
                    <div className="flex flex-col items-center">
                        <span className="text-slate-500 text-[10px] opacity-0">-</span>
                        <span className="text-xl font-black text-white">R$ 149,90</span>
                    </div>
                </button>
            </div>
        </section>

        {/* 8. FORMA DE PAGAMENTO */}
        <section className="px-6 mt-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                <CreditCard size={14} /> 4. Pagamento
            </h3>
            <div className="grid grid-cols-1 gap-3">
                <button 
                    onClick={() => setPaymentMethod('vista')}
                    className={`p-5 rounded-3xl border-2 flex items-center gap-3 transition-all ${
                        paymentMethod === 'vista' ? 'bg-blue-600/10 border-[#1E5BFF]' : 'bg-white/5 border-white/5'
                    }`}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vista' ? 'border-[#1E5BFF]' : 'border-slate-700'}`}>
                        {paymentMethod === 'vista' && <div className="w-2.5 h-2.5 bg-[#1E5BFF] rounded-full"></div>}
                    </div>
                    <span className="font-bold text-sm">À vista (Pix ou Cartão)</span>
                </button>
                <button 
                    onClick={() => setPaymentMethod('parcelado')}
                    className={`p-5 rounded-3xl border-2 flex items-center gap-3 transition-all ${
                        paymentMethod === 'parcelado' ? 'bg-blue-600/10 border-[#1E5BFF]' : 'bg-white/5 border-white/5'
                    }`}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'parcelado' ? 'border-[#1E5BFF]' : 'border-slate-700'}`}>
                        {paymentMethod === 'parcelado' && <div className="w-2.5 h-2.5 bg-[#1E5BFF] rounded-full"></div>}
                    </div>
                    <span className="font-bold text-sm">3x sem juros no Cartão</span>
                </button>
            </div>
        </section>

        {/* 9. CRIAÇÃO DO BANNER */}
        <section className="px-6 mt-12">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                <Palette size={14} /> 5. Criação da Arte
            </h3>
            <div className="grid gap-4">
                <button 
                    /* Fix: Change setCreationOption to setCreationType */
                    onClick={() => setCreationType('own')}
                    className={`p-6 rounded-[2.5rem] border-2 text-left transition-all ${
                        creationType === 'own' ? 'bg-blue-600/10 border-[#1E5BFF]' : 'bg-white/5 border-white/5'
                    }`}
                >
                    <h4 className="font-bold text-white mb-1">Criar minha própria arte</h4>
                    <p className="text-xs text-slate-500 font-medium italic">"Envie sua imagem e texto pronto."</p>
                </button>

                <button 
                    onClick={() => setCreationType('pro')}
                    className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden ${
                        creationType === 'pro' ? 'bg-blue-600/10 border-[#1E5BFF]' : 'bg-white/5 border-white/5'
                    }`}
                >
                    <div className="absolute top-4 right-4 text-amber-400 animate-pulse"><Star size={20} fill="currentColor" /></div>
                    <h4 className="font-bold text-white mb-1">Contratar criação profissional ⭐</h4>
                    <p className="text-xs text-slate-500 font-medium mb-3">"Nossa equipe cria um banner profissional para você."</p>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs line-through">R$ 149,90</span>
                        <span className="text-base font-black text-emerald-400">R$ 69,90</span>
                    </div>
                </button>
            </div>
        </section>

      </main>

      {/* 7. RESUMO DINÂMICO (STICKY) & 10. CTA FINAL */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#020617]/95 backdrop-blur-2xl border-t border-white/10 z-40 max-w-md mx-auto shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
        
        {/* Resumo */}
        <div className="bg-white/5 p-4 rounded-2xl mb-6 flex justify-between items-end border border-white/5">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumo do Pedido</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-[#1E5BFF]" /> {bannerType === 'combo' ? 'Home + Cat' : bannerType}</span>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-[#1E5BFF]" /> {selectedNeighborhoods.length} Bairros</span>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Check size={10} className="text-[#1E5BFF]" /> {duration}</span>
                </div>
                <p className="text-[10px] text-blue-400 font-bold mt-1">Parcelado em até 3x sem juros</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                <p className="text-3xl font-black text-white leading-none">R$ {calculateTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
        </div>

        <button 
          onClick={handleFinalSubmit}
          disabled={isSubmitting || selectedNeighborhoods.length === 0}
          className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
              <>
                <ShoppingBag size={20} />
                FINALIZAR COMPRA
              </>
          )}
        </button>
        <p className="text-center text-[10px] text-slate-500 font-bold uppercase mt-4 tracking-widest">
            Seu anúncio pode estar no ar em poucos minutos.
        </p>
      </div>

    </div>
  );
};
