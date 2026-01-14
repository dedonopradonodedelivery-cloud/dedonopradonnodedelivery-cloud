
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Target, 
  Rocket, 
  CheckCircle2, 
  MessageCircle,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface StoreAdsModuleProps {
  onBack: () => void;
}

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack }) => {
  const [isInterested, setIsInterested] = useState(false);

  const handleContactSales = () => {
    setIsInterested(true);
    
    // Log de interesse (simulação)
    console.log("Lead de Anúncio Gerado: Lojista interessado em Banner");

    const message = "Olá! Tenho interesse em anunciar minha marca no banner do app Localizei JPA. Gostaria de saber mais sobre os planos de destaque.";
    const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(message)}`; // Substituir pelo número real
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsInterested(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans animate-in slide-in-from-right duration-300 relative overflow-hidden flex flex-col">
      
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#1E5BFF]/20 to-slate-950 pointer-events-none"></div>
      <div className="absolute top-20 right-[-100px] w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="p-5 flex items-center gap-4 sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </button>
        <span className="font-bold text-sm text-gray-400 uppercase tracking-widest">Publicidade</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 p-6 space-y-12">
        
        {/* HERO SECTION */}
        <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 bg-[#1E5BFF]/10 text-[#1E5BFF] px-4 py-1.5 rounded-full border border-[#1E5BFF]/20 mb-6 shadow-lg shadow-blue-900/20">
                <Rocket className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Acelere seu negócio</span>
            </div>
            
            <h1 className="text-4xl font-black text-white leading-[1.1] mb-6 font-display">
                Sua marca em destaque para todo o <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#1E5BFF]">bairro.</span>
            </h1>
            
            <p className="text-slate-400 text-base leading-relaxed max-w-xs mx-auto">
                Coloque sua loja no topo do app e seja visto por milhares de vizinhos prontos para comprar.
            </p>
        </div>

        {/* VISUAL EXPLANATION */}
        <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
            {/* Mockup simplificado do banner na home */}
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
                <div className="w-[80%] h-[60%] bg-[#1E5BFF] rounded-2xl shadow-lg transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-700 flex items-center justify-center border border-white/20">
                    <span className="text-white font-black text-xl uppercase tracking-widest">SEU BANNER AQUI</span>
                </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Visualização na Home</p>
            </div>
        </div>

        {/* BENEFITS GRID */}
        <div className="grid gap-4">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg mb-1">Visibilidade Máxima</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Apareça para 100% dos usuários que abrem o aplicativo diariamente.
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl shrink-0">
                    <Target className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg mb-1">Autoridade Local</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Posicione sua marca como referência e líder no seu segmento.
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl shrink-0">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg mb-1">Tráfego Qualificado</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Atraia cliques de pessoas que já estão buscando consumir na região.
                    </p>
                </div>
            </div>
        </div>

        {/* SCARCITY & OFFER */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] border border-indigo-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-amber-500/20">
                    <Clock className="w-3 h-3" /> Poucas vagas no carrossel
                </div>

                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">Investimento a partir de</p>
                <div className="flex items-baseline justify-center gap-1 mb-6">
                    <span className="text-2xl font-bold text-slate-500">R$</span>
                    <span className="text-6xl font-black text-white tracking-tighter">49,90</span>
                    <span className="text-xl font-bold text-slate-500">/semana</span>
                </div>

                <div className="flex flex-col gap-3 text-sm text-indigo-200 font-medium bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Banner rotativo na Home</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Link direto para seu perfil ou WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Relatório de cliques simples</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Pagamento Seguro e Facilitado
        </div>

      </div>

      {/* FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 z-50">
        <button 
            onClick={handleContactSales}
            disabled={isInterested}
            className="w-full bg-[#1E5BFF] hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-sm disabled:opacity-70"
        >
            {isInterested ? 'Redirecionando...' : 'EU QUERO ANUNCIAR'}
            {!isInterested && <MessageCircle className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
};
