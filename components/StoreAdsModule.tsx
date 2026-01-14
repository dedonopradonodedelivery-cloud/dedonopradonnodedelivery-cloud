
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
  Zap, 
  Paintbrush, 
  Image as ImageIcon,
  Search,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { MasterSponsorBanner } from './MasterSponsorBanner';

interface StoreAdsModuleProps {
  onBack: () => void;
}

const MOCK_BANNERS = [
  { id: 1, title: 'Sua Loja Aqui', color: 'from-blue-600 to-blue-800', icon: <Rocket className="w-8 h-8 text-white" /> },
  { id: 2, title: 'Oferta Exclusiva', color: 'from-purple-600 to-indigo-800', icon: <Crown className="w-8 h-8 text-white" /> },
  { id: 3, title: 'Destaque no Bairro', color: 'from-emerald-500 to-teal-700', icon: <MapPin className="w-8 h-8 text-white" /> },
];

const IPhoneMock = () => {
  return (
    <div className="relative mx-auto w-[240px] h-[480px] bg-zinc-900 rounded-[45px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[6px] border-[#3a3a3a] overflow-hidden ring-1 ring-white/20">
      {/* Botões Laterais */}
      <div className="absolute top-24 -left-[8px] w-[2px] h-8 bg-[#2a2a2a] rounded-l-md"></div>
      <div className="absolute top-36 -left-[8px] w-[2px] h-12 bg-[#2a2a2a] rounded-l-md"></div>
      <div className="absolute top-28 -right-[8px] w-[2px] h-16 bg-[#2a2a2a] rounded-r-md"></div>

      {/* Tela */}
      <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30"></div>
        
        {/* Status Bar Mock */}
        <div className="w-full h-10 bg-white z-20 flex justify-between px-6 pt-3.5 items-start">
            <span className="text-[8px] font-bold">9:41</span>
            <div className="flex gap-1">
                <div className="w-3 h-1.5 bg-black rounded-sm"></div>
                <div className="w-0.5 h-1.5 bg-black rounded-sm"></div>
            </div>
        </div>

        {/* --- SIMULAÇÃO DA HOME DO APP --- */}
        
        {/* Header */}
        <div className="bg-white px-4 pb-2 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1 bg-[#1E5BFF]/10 px-2 py-1 rounded-full w-fit">
                    <MapPin className="w-2.5 h-2.5 text-[#1E5BFF]" fill="currentColor" />
                    <span className="text-[8px] font-bold text-gray-800">Freguesia</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-gray-400" />
                </div>
            </div>
            
            <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                    <Search className="w-3 h-3 text-gray-400" />
                </div>
                <div className="w-full bg-gray-100 h-8 rounded-xl flex items-center pl-8 text-[9px] text-gray-400">
                    Buscar em Jacarepaguá...
                </div>
            </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 bg-gray-50 overflow-hidden relative">
            {/* Categorias */}
            <div className="flex gap-2 px-3 pt-3 overflow-hidden opacity-50">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-14 h-14 rounded-xl bg-white shadow-sm shrink-0"></div>
                ))}
            </div>

            {/* --- O BANNER (DESTAQUE) --- */}
            <div className="px-3 mt-3 relative z-10">
                <div className="w-full aspect-[2/1] rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden animate-pulse-slow">
                    {/* Brilho */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 blur-xl rounded-full -mr-5 -mt-5"></div>
                    
                    <div className="relative z-10 p-2">
                        <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                            <Rocket className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-white font-black text-sm leading-tight mb-0.5">SUA MARCA AQUI</h3>
                        <p className="text-[8px] text-blue-100 font-medium">Alcance milhares de vizinhos</p>
                    </div>

                    <div className="absolute top-2 right-2 bg-white text-black text-[6px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        PATROCINADO
                    </div>
                </div>
            </div>

            {/* Listagem Abaixo (Blur) */}
            <div className="px-3 mt-3 space-y-2 opacity-40 blur-[1px]">
                <div className="w-full h-16 bg-white rounded-xl"></div>
                <div className="w-full h-16 bg-white rounded-xl"></div>
                <div className="w-full h-16 bg-white rounded-xl"></div>
            </div>
        </div>

        {/* Bottom Nav Mock */}
        <div className="h-12 bg-white border-t border-gray-100 flex justify-around items-center px-4">
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-8 -mt-6 bg-[#1E5BFF] rounded-full border-4 border-white shadow-sm"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

const SimulatedCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MOCK_BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[5/3] bg-white/10 rounded-3xl border border-white/20 shadow-inner overflow-hidden backdrop-blur-sm">
      {/* Mock Interface Header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-white/10 backdrop-blur-md z-20 flex items-center px-4 gap-2 border-b border-white/10">
         <div className="w-2 h-2 rounded-full bg-red-400"></div>
         <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
         <div className="w-20 h-2 rounded-full bg-white/20 ml-2"></div>
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
          <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
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
        message = "Olá! Tenho interesse em anunciar por 1 mês (Plano R$ 999).";
    } else {
        console.log("Lead: Plano Trimestral (R$ 2.599)");
        message = "Olá! Quero aproveitar a oferta de 3 meses no banner (Plano R$ 2.599).";
    }

    const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(message)}`; 
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsInterested(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1E5BFF] font-sans animate-in slide-in-from-right duration-300 relative flex flex-col">
      
      {/* Header - Transparent/Blue to match background */}
      <div className="sticky top-0 z-20 bg-[#1E5BFF]/90 backdrop-blur-md border-b border-blue-400/30 px-5 h-16 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <span className="font-bold text-sm text-blue-100 uppercase tracking-widest">Publicidade Premium</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 p-6 space-y-10">
        
        {/* HERO SECTION - REFINED COPY */}
        <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-sm backdrop-blur-sm">
                <Crown className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Destaque Máximo</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white leading-[1.1] mb-4 font-display tracking-tight">
                Sua marca no topo de Jacarepaguá, <span className="text-white decoration-4 decoration-yellow-400/50 underline-offset-4">todos os dias.</span>
            </h1>

            {/* --- IPHONE 16 PRO MAX MOCK (OBRIGATÓRIO) --- */}
            <div className="my-10 animate-in fade-in zoom-in duration-700">
                <IPhoneMock />
                <p className="text-[10px] text-blue-200 mt-4 font-medium uppercase tracking-widest opacity-80 text-center max-w-xs mx-auto">
                    Visualização ilustrativa de como sua marca aparece na home do app.
                </p>
            </div>
            
            <h2 className="text-sm md:text-base font-bold text-blue-100 mb-4 leading-relaxed">
                Apareça automaticamente para milhares de moradores exatamente no momento em que eles abrem o app para consumir no bairro.
            </h2>

            <p className="text-xs text-blue-200 leading-relaxed max-w-sm mx-auto font-medium">
                Enquanto outros negócios disputam atenção nas redes sociais, sua marca ganha destaque imediato dentro do app local mais relevante da região — visível para quem já mora, trabalha e consome em Jacarepaguá.
            </p>
        </div>

        {/* VISUAL CAROUSEL */}
        <div className="relative w-full">
            <SimulatedCarousel />
            <div className="text-center mt-3">
                <p className="text-[10px] text-blue-200 uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
                    <Smartphone className="w-3 h-3" />
                    Simulação em tempo real
                </p>
            </div>
        </div>

        {/* BENEFITS - CARDS BRANCOS */}
        <div className="grid gap-4">
            <div className="bg-white p-6 rounded-2xl border border-blue-400/20 flex items-start gap-4 shadow-lg shadow-blue-900/10 transition-transform hover:scale-[1.02]">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0 text-[#1E5BFF]">
                    <Layout className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Posição Nobre</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Presença imediata na abertura do app, garantindo máxima visibilidade local.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-400/20 flex items-start gap-4 shadow-lg shadow-blue-900/10 transition-transform hover:scale-[1.02]">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0 text-[#1E5BFF]">
                    <Target className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Autoridade Local</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Associe sua marca à inovação e torne-se referência no seu segmento em Jacarepaguá.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-400/20 flex items-start gap-4 shadow-lg shadow-blue-900/10 transition-transform hover:scale-[1.02]">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0 text-[#1E5BFF]">
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

        {/* ART INFO BLOCK - CARD BRANCO */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-indigo-50 rounded-lg text-[#1E5BFF]">
                    <Paintbrush className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Arte do Banner</h3>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 font-medium">
                        Nossa equipe pode criar a arte para você com até <strong className="text-gray-900">3 alterações gratuitas</strong>.
                    </p>
                </div>
                <div className="flex items-start gap-3">
                    <ImageIcon className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 font-medium">
                        Ou envie sua própria arte nas medidas: <strong className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">1080 x 600 px</strong> (JPG/PNG).
                    </p>
                </div>
            </div>
        </div>

        {/* PRICING PLANS */}
        <div className="space-y-4">
            <h3 className="text-center font-bold text-white text-lg mb-4 drop-shadow-md">Escolha seu plano de destaque</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PLANO 1 - MENSAL (CARD BRANCO) */}
                <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                    <h4 className="text-lg font-black text-gray-400 uppercase tracking-wide mb-2">1 Mês</h4>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-sm font-bold text-gray-400">R$</span>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">999</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-6 px-4">
                        Ideal para testar e ganhar visibilidade imediata.
                    </p>
                    <button 
                        onClick={() => handleContactSales('monthly')}
                        disabled={isInterested}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
                    >
                        Quero anunciar por 1 mês
                    </button>
                </div>

                {/* PLANO 2 - TRIMESTRAL (CARD BRANCO - DESTAQUE) */}
                <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-2xl shadow-black/20 relative overflow-hidden transform md:scale-105 border-4 border-white ring-4 ring-black/5">
                    
                    <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-blue-900" /> Mais Vantajoso
                    </div>

                    <h4 className="text-lg font-black text-[#1E5BFF] uppercase tracking-wide mb-2 mt-2">3 Meses</h4>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-sm font-bold text-blue-300">R$</span>
                        <span className="text-5xl font-black text-[#1E5BFF] tracking-tighter">2.599</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-6 px-2">
                        Mais economia e presença contínua no bairro.
                    </p>
                    
                    <div className="w-full relative z-10">
                        <button 
                            onClick={() => handleContactSales('quarterly')}
                            disabled={isInterested}
                            className="w-full bg-[#1E5BFF] text-white hover:bg-blue-600 font-black py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Quero anunciar por 3 meses
                            <Zap className="w-3 h-3 fill-current" />
                        </button>
                    </div>
                </div>

            </div>
        </div>

        {/* Benefits List - CARD BRANCO */}
        <div className="flex flex-col gap-3 text-xs font-medium bg-white p-6 rounded-3xl text-gray-600 shadow-md">
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Banner exibido de forma aleatória, controlado por algoritmo</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Link direto para sua loja ou WhatsApp</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Exibição exclusiva para Jacarepaguá</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Alcance potencial de mais de 550 mil moradores</span>
            </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-blue-200 text-[10px] font-bold uppercase tracking-widest pb-2 pt-2">
            <ShieldCheck className="w-4 h-4" /> Pagamento Seguro e Facilitado
        </div>

        {/* MASTER SPONSOR BANNER (INSTITUTIONAL) */}
        <MasterSponsorBanner variant="light" />

      </div>
    </div>
  );
};
