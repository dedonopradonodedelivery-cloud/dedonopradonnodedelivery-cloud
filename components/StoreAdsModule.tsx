
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Target, 
  Rocket, 
  CheckCircle2, 
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Layout,
  Crown,
  MapPin,
  Smartphone,
  Star,
  Zap
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
}

const MOCK_BANNERS = [
  { id: 1, title: 'Sua Loja Aqui', color: 'from-blue-600 to-blue-800', icon: <Rocket className="w-8 h-8 text-white" /> },
  { id: 2, title: 'Oferta Exclusiva', color: 'from-purple-600 to-indigo-800', icon: <Crown className="w-8 h-8 text-white" /> },
  { id: 3, title: 'Destaque no Bairro', color: 'from-emerald-500 to-teal-700', icon: <MapPin className="w-8 h-8 text-white" /> },
];

const SimulatedCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MOCK_BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-3xl border border-gray-200 shadow-inner overflow-hidden">
      {/* Mock Interface Header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-white/50 backdrop-blur-sm z-20 flex items-center px-4 gap-2 border-b border-white/20">
         <div className="w-2 h-2 rounded-full bg-red-400"></div>
         <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
         <div className="w-20 h-2 rounded-full bg-gray-200 ml-2"></div>
      </div>

      {/* Slides */}
      {MOCK_BANNERS.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className={`w-[85%] h-[60%] rounded-2xl bg-gradient-to-br ${banner.color} shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden transform transition-transform duration-700 ${index === current ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'}`}>
             <div className="absolute inset-0 bg-white/10 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
             <div className="relative z-10 mb-2 p-3 bg-white/20 rounded-full backdrop-blur-md">
                {banner.icon}
             </div>
             <h3 className="relative z-10 font-black text-xl tracking-tight uppercase">{banner.title}</h3>
             <div className="absolute bottom-3 right-3 bg-white text-black text-[6px] font-bold px-1.5 py-0.5 rounded">PATROCINADO</div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
        {MOCK_BANNERS.map((_, idx) => (
          <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === current ? 'w-4 bg-gray-800' : 'w-1.5 bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [isInterested, setIsInterested] = useState(false);

  const handleContactSales = (plan: 'monthly' | 'quarterly') => {
    setIsInterested(true);
    
    let message = "";
    if (plan === 'monthly') {
        console.log("Lead: Plano Mensal (R$ 999)");
        message = "Olá! Tenho interesse em anunciar por 1 mês (Plano R$ 999,00).";
    } else {
        console.log("Lead: Plano Trimestral (R$ 2.599)");
        message = "Olá! Quero aproveitar a oferta de 3 meses no banner (Plano R$ 2.599,00).";
    }

    const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(message)}`; 
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsInterested(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans animate-in slide-in-from-right duration-300 relative flex flex-col">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 h-16 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">Publicidade Premium</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 p-6 space-y-10">
        
        {/* HERO SECTION */}
        <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1E5BFF] px-4 py-1.5 rounded-full border border-blue-100 mb-6 shadow-sm">
                <Crown className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Destaque Máximo</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] mb-4 font-display tracking-tight">
                Sua marca no topo do bairro <span className="text-[#1E5BFF]">todos os dias.</span>
            </h1>
            
            <h2 className="text-sm md:text-base font-bold text-gray-600 mb-4 leading-relaxed">
                Seja visto por milhares de moradores de Jacarepaguá exatamente no momento em que eles abrem o app para consumir.
            </h2>

            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto font-medium">
                Enquanto outros brigam por atenção nas redes sociais, sua marca aparece automaticamente para quem já mora, trabalha e consome na região.
            </p>
        </div>

        {/* VISUAL CAROUSEL */}
        <div className="relative w-full">
            <SimulatedCarousel />
            <div className="text-center mt-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
                    <Smartphone className="w-3 h-3" />
                    Simulação em tempo real
                </p>
            </div>
        </div>

        {/* BENEFITS */}
        <div className="grid gap-4">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-100 transition-colors group">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-gray-100 text-[#1E5BFF] group-hover:scale-110 transition-transform">
                    <Layout className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Posição Nobre</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Presença imediata na abertura do app, garantindo máxima visibilidade local.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-100 transition-colors group">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-gray-100 text-[#1E5BFF] group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Autoridade Local</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Associe sua marca à inovação e torne-se referência no seu segmento em Jacarepaguá.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-blue-100 transition-colors group">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-gray-100 text-[#1E5BFF] group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Tráfego Qualificado</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Seu anúncio é exibido apenas para moradores da região, prontos para consumir.
                    </p>
                </div>
            </div>
        </div>

        {/* PRICING PLANS */}
        <div className="space-y-4">
            <h3 className="text-center font-bold text-gray-900 text-lg mb-4">Escolha seu plano de destaque</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PLANO 1 - MENSAL */}
                <div className="bg-white border border-gray-200 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-2">1 Mês</h4>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-sm font-bold text-gray-400">R$</span>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">999</span>
                        <span className="text-sm font-bold text-gray-400">,00</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-6 px-4">
                        Ideal para testar e ganhar visibilidade imediata.
                    </p>
                    <button 
                        onClick={() => handleContactSales('monthly')}
                        disabled={isInterested}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
                    >
                        Quero anunciar por 1 mês
                    </button>
                </div>

                {/* PLANO 2 - TRIMESTRAL (DESTAQUE) */}
                <div className="bg-gradient-to-b from-[#1E5BFF] to-[#1040C0] text-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-xl shadow-blue-500/30 relative overflow-hidden transform md:scale-105 border border-blue-400">
                    
                    <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
                        <Star className="w-3 h-3 fill-blue-900" /> Mais Vantajoso
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>

                    <h4 className="text-lg font-black text-white uppercase tracking-wide mb-2 mt-2">3 Meses</h4>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-sm font-bold text-blue-200">R$</span>
                        <span className="text-5xl font-black text-white tracking-tighter">2.599</span>
                        <span className="text-sm font-bold text-blue-200">,00</span>
                    </div>
                    <p className="text-xs text-blue-100 font-medium mb-6 px-2">
                        Mais economia e presença contínua no bairro.
                    </p>
                    
                    <div className="w-full relative z-10">
                        <button 
                            onClick={() => handleContactSales('quarterly')}
                            disabled={isInterested}
                            className="w-full bg-white text-[#1E5BFF] hover:bg-blue-50 font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Quero anunciar por 3 meses
                            <Zap className="w-3 h-3 fill-current" />
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest pb-6 pt-2">
            <ShieldCheck className="w-4 h-4" /> Pagamento Seguro e Facilitado
        </div>

      </div>
    </div>
  );
};
