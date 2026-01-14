
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Target, 
  Rocket, 
  CheckCircle2, 
  MessageCircle,
  TrendingUp,
  Clock,
  ShieldCheck,
  Megaphone,
  Layout
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [isInterested, setIsInterested] = useState(false);

  const handleContactSales = () => {
    setIsInterested(true);
    
    // Log de interesse (simulação)
    console.log("Lead de Anúncio Gerado: Lojista interessado em Banner Mensal");

    const message = "Olá! Sou lojista e quero anunciar no banner da Home do Localizei JPA (Plano Mensal de R$ 1.000).";
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
        <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">Publicidade</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 p-6 space-y-10">
        
        {/* HERO SECTION */}
        <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E5BFF] px-4 py-1.5 rounded-full border border-blue-100 mb-6 shadow-sm">
                <Rocket className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Acelere seu negócio</span>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 leading-[1.1] mb-4 font-display">
                Sua marca em destaque para todo o <span className="text-[#1E5BFF]">bairro.</span>
            </h1>
            
            <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto font-medium">
                Coloque sua loja no topo do app e seja visto por milhares de vizinhos todos os dias.
            </p>
        </div>

        {/* VISUAL EXPLANATION */}
        <div className="relative w-full aspect-[16/9] bg-gray-50 rounded-3xl border border-gray-200 shadow-sm overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[65%] bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col p-3">
                    {/* Mockup Interface */}
                    <div className="flex gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <div className="flex-1 space-y-1">
                            <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                            <div className="w-12 h-2 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>
                    {/* Banner Highlight */}
                    <div className="flex-1 bg-[#1E5BFF] rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                        <span className="text-white font-black text-lg uppercase tracking-widest z-10">SEU BANNER</span>
                        <div className="absolute bottom-2 right-2 bg-white text-[#1E5BFF] text-[6px] font-bold px-1.5 py-0.5 rounded">ANUNCIE AQUI</div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Visualização na Home</p>
            </div>
        </div>

        {/* BENEFITS GRID */}
        <div className="grid gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-gray-100 text-[#1E5BFF]">
                    <Layout className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Posição Nobre</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Seu banner aparece logo na abertura do app, garantindo visibilidade máxima.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-gray-100 text-[#1E5BFF]">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Autoridade Local</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Associe sua marca à inovação e tecnologia do bairro.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm border border-gray-100 text-[#1E5BFF]">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Tráfego Qualificado</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Atraia cliques de pessoas que já estão buscando consumir na região.
                    </p>
                </div>
            </div>
        </div>

        {/* PRICING CARD */}
        <div className="bg-[#1E5BFF] p-8 rounded-[2.5rem] text-center relative overflow-hidden shadow-xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10 text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
                    <Clock className="w-3 h-3" /> Vagas Limitadas
                </div>

                <p className="text-blue-100 text-sm font-medium mb-2 uppercase tracking-wide">Investimento Mensal</p>
                <div className="flex items-baseline justify-center gap-1 mb-8">
                    <span className="text-2xl font-bold text-blue-200">R$</span>
                    <span className="text-6xl font-black tracking-tighter">1.000</span>
                    <span className="text-xl font-bold text-blue-200">,00</span>
                </div>

                <div className="flex flex-col gap-3 text-sm font-medium bg-black/10 p-5 rounded-2xl border border-white/10 text-left">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                        <span>Banner rotativo na Home</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                        <span>Link direto (Perfil ou WhatsApp)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                        <span>Relatório de performance</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest pb-6">
            <ShieldCheck className="w-4 h-4" /> Pagamento Seguro e Facilitado
        </div>

      </div>

      {/* FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 z-50">
        <button 
            onClick={handleContactSales}
            disabled={isInterested}
            className="w-full bg-[#1E5BFF] hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isInterested ? 'Redirecionando...' : 'EU QUERO ANUNCIAR'}
            {!isInterested && <MessageCircle className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
};
