
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Target, 
  Rocket, 
  CheckCircle2, 
  ShieldCheck, 
  Crown, 
  MapPin, 
  Star, 
  Zap, 
  Search,
  User as UserIcon,
  ChevronDown,
  Check,
  Info
} from 'lucide-react';
import { MasterSponsorBanner } from './MasterSponsorBanner';

interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
}

const AVAILABLE_NEIGHBORHOODS = [
  "Freguesia", 
  "Taquara", 
  "Anil", 
  "Pechincha", 
  "Cidade de Deus", 
  "Curicica", 
  "Parque Olímpico", 
  "Gardênia", 
  "Tanque"
];

// Configuração de Preços
const PRICE_BASE = 397;
const PRICE_PROMO = 149;
const DISCOUNT_QUARTERLY = 0.12; // 12%

const IPhoneMock = () => {
  return (
    <div className="relative mx-auto w-[200px] h-[400px] bg-zinc-900 rounded-[35px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[5px] border-[#3a3a3a] overflow-hidden ring-1 ring-white/20">
      <div className="absolute top-20 -left-[6px] w-[2px] h-6 bg-[#2a2a2a] rounded-l-md"></div>
      <div className="absolute top-32 -left-[6px] w-[2px] h-10 bg-[#2a2a2a] rounded-l-md"></div>
      <div className="absolute top-24 -right-[6px] w-[2px] h-14 bg-[#2a2a2a] rounded-r-md"></div>
      <div className="w-full h-full bg-white relative overflow-hidden flex flex-col">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-30"></div>
        
        {/* Status Bar Mock */}
        <div className="w-full h-8 bg-white z-20 flex justify-between px-5 pt-2.5 items-start">
            <div className="w-8 h-2 bg-gray-200 rounded-sm"></div>
            <div className="flex gap-1">
                <div className="w-2.5 h-1.5 bg-black rounded-sm"></div>
                <div className="w-0.5 h-1.5 bg-black rounded-sm"></div>
            </div>
        </div>

        <div className="bg-white px-3 pb-2 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1 bg-[#1E5BFF]/10 px-2 py-1 rounded-full w-fit">
                    <MapPin className="w-2 h-2 text-[#1E5BFF]" fill="currentColor" />
                    <div className="w-8 h-1.5 bg-gray-300 rounded-full"></div>
                    <ChevronDown className="w-2 h-2 text-gray-400" />
                </div>
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-2.5 h-2.5 text-gray-400" />
                </div>
            </div>
            
            <div className="relative">
                <div className="w-full bg-gray-100 h-6 rounded-lg flex items-center pl-2">
                    <Search className="w-2.5 h-2.5 text-gray-400 mr-2" />
                    <div className="w-20 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>

        <div className="flex-1 bg-gray-50 overflow-hidden relative">
            <div className="flex gap-2 px-3 pt-3 overflow-hidden opacity-50">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-white shadow-sm shrink-0"></div>
                ))}
            </div>

            <div className="px-3 mt-3 relative z-10">
                <div className="w-full aspect-[2/1] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden animate-pulse-slow">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 blur-xl rounded-full -mr-4 -mt-4"></div>
                    
                    <div className="relative z-10 p-2">
                        <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 backdrop-blur-sm">
                            <Rocket className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-20 h-2 bg-white rounded-full mx-auto mb-1"></div>
                        <div className="w-12 h-1 bg-blue-200 rounded-full mx-auto"></div>
                    </div>

                    <div className="absolute top-1.5 right-1.5 bg-white text-black text-[4px] font-bold px-1 py-0.5 rounded shadow-sm">
                        PATROCINADO
                    </div>
                </div>
            </div>

            <div className="px-3 mt-3 space-y-2 opacity-40 blur-[0.5px]">
                <div className="w-full h-12 bg-white rounded-lg"></div>
                <div className="w-full h-12 bg-white rounded-lg"></div>
            </div>
        </div>

        <div className="h-10 bg-white border-t border-gray-100 flex justify-around items-center px-4">
            <div className="w-6 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 -mt-4 bg-[#1E5BFF] rounded-full border-2 border-white shadow-sm"></div>
            <div className="w-6 h-1 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-1 bg-gray-200 rounded-full"></div>
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export const StoreAdsModule: React.FC<StoreAdsModuleProps> = ({ onBack, onNavigate, categoryName }) => {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [isInterested, setIsInterested] = useState(false);

  const toggleNeighborhood = (name: string) => {
    setSelectedNeighborhoods(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  // Cálculos Financeiros
  const count = selectedNeighborhoods.length;
  
  // Mensal (Unitário)
  const monthlyTotal = count * PRICE_PROMO;
  const monthlyBaseTotal = count * PRICE_BASE;
  const monthlySavings = monthlyBaseTotal - monthlyTotal;

  // Trimestral (Total)
  const quarterlyTotalRaw = monthlyTotal * 3;
  const quarterlyTotalFinal = quarterlyTotalRaw * (1 - DISCOUNT_QUARTERLY);
  const quarterlySavings = (monthlyBaseTotal * 3) - quarterlyTotalFinal;

  const isSelectionComplete = count > 0;

  const handleContactSales = (plan: 'monthly' | 'quarterly') => {
    if (!isSelectionComplete) return;

    setIsInterested(true);
    const scopeName = selectedNeighborhoods.join(', ');
    const price = plan === 'monthly' ? monthlyTotal : quarterlyTotalFinal;
    const duration = plan === 'monthly' ? "1 Mês" : "3 Meses";
    
    let contextMessage = categoryName 
        ? `Quero anunciar na categoria *${categoryName}*.` 
        : `Tenho interesse em anunciar no app Localizei.`;

    const message = `Olá! ${contextMessage}\n\n*Bairros:* ${scopeName}\n*Plano:* ${duration}\n*Valor Total:* R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const whatsappUrl = `https://wa.me/5521999999999?text=${encodeURIComponent(message)}`; 
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsInterested(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1E5BFF] font-sans animate-in slide-in-from-right duration-300 relative flex flex-col">
      <div className="sticky top-0 z-20 bg-[#1E5BFF]/90 backdrop-blur-md border-b border-blue-400/30 px-5 h-16 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <span className="font-bold text-sm text-blue-100 uppercase tracking-widest">Publicidade Premium</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 p-6 space-y-8">
        <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-sm backdrop-blur-sm">
                <Crown className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">DESTAQUE MÁXIMO</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-[1.1] mb-4 font-display tracking-tight">
                Destaque sua marca<br/>
                <span className="text-blue-200">
                    na Jacarepaguá
                </span>
            </h1>
            <div className="my-8 animate-in fade-in zoom-in duration-700">
                <IPhoneMock />
            </div>
        </div>

        {/* PASSO 1 - SELEÇÃO DE BAIRROS */}
        <div className="bg-white/10 rounded-3xl p-1 border border-white/20">
            <h3 className="text-center font-bold text-white text-sm uppercase tracking-wide py-3">Passo 1: Onde anunciar?</h3>
            
            <div className="p-4 bg-white/5 rounded-[1.5rem] animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <p className="text-xs text-blue-100 font-bold uppercase tracking-wide">Selecione os bairros:</p>
                    <span className="bg-white text-[#1E5BFF] text-[10px] font-black px-2 py-0.5 rounded-md">
                        {count} selecionado{count !== 1 && 's'}
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                    {AVAILABLE_NEIGHBORHOODS.map(hood => {
                        const isSelected = selectedNeighborhoods.includes(hood);
                        return (
                            <button
                                key={hood}
                                onClick={() => toggleNeighborhood(hood)}
                                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                                    isSelected 
                                    ? 'bg-green-400 text-green-900 border-green-400 shadow-lg scale-105' 
                                    : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                                }`}
                            >
                                {isSelected && <Check className="w-3 h-3" />}
                                {hood}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col items-center gap-1">
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest line-through decoration-blue-200/50">
                        De R$ {PRICE_BASE}/bairro
                    </p>
                    <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg animate-pulse">
                        <Zap className="w-3 h-3 fill-white" />
                        <span className="text-xs font-black uppercase">Promoção: R$ {PRICE_PROMO}/bairro</span>
                    </div>
                </div>
            </div>
        </div>

        {/* PASSO 2 - PLANOS */}
        <div className={`space-y-4 transition-all duration-500 ${isSelectionComplete ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale pointer-events-none'}`}>
            <div className="text-center">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-1">Passo 2: Escolha o Plano</h3>
                <p className="text-xs text-blue-200">
                    Investimento calculado para: <strong>{count} bairro{count !== 1 && 's'}</strong>
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PLANO 1 MÊS */}
                <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden transition-all duration-300 group hover:scale-[1.02]">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gray-200"></div>
                    <h4 className="text-lg font-black text-gray-400 uppercase tracking-wide mb-2 mt-2">1 Mês</h4>
                    
                    {monthlySavings > 0 && (
                        <span className="text-xs text-gray-400 line-through mb-1">Total: R$ {monthlyBaseTotal.toLocaleString('pt-BR')}</span>
                    )}
                    
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-sm font-bold text-gray-400">R$</span>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter">
                            {monthlyTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <p className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md mb-6">
                        Economia de R$ {monthlySavings.toLocaleString('pt-BR')}
                    </p>
                    
                    <button 
                        onClick={() => handleContactSales('monthly')}
                        disabled={isInterested || !isSelectionComplete}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Quero anunciar 1 mês
                    </button>
                </div>

                {/* PLANO 3 MESES */}
                <div className="bg-white rounded-[2rem] p-6 flex flex-col items-center text-center shadow-2xl shadow-black/20 relative overflow-hidden transform md:scale-105 border-4 border-white ring-4 ring-black/5 transition-all duration-300 group hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 bg-yellow-400 text-blue-900 text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-sm z-10">
                        <Star className="w-3 h-3 fill-blue-900" /> 12% OFF Extra
                    </div>
                    <h4 className="text-lg font-black text-[#1E5BFF] uppercase tracking-wide mb-2 mt-2">3 Meses</h4>
                    
                    <span className="text-xs text-gray-400 line-through mb-1">Total: R$ {quarterlyTotalRaw.toLocaleString('pt-BR')}</span>

                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-sm font-bold text-blue-300">R$</span>
                        <span className="text-4xl font-black text-[#1E5BFF] tracking-tighter">
                            {quarterlyTotalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <p className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md mb-6">
                        Economia Total: R$ {quarterlySavings.toLocaleString('pt-BR')}
                    </p>

                    <div className="w-full relative z-10">
                        <button 
                            onClick={() => handleContactSales('quarterly')}
                            disabled={isInterested || !isSelectionComplete}
                            className="w-full bg-[#1E5BFF] text-white hover:bg-blue-600 font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Quero anunciar 3 meses
                            <Zap className="w-3 h-3 fill-current" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-3 text-xs font-medium bg-white p-6 rounded-3xl text-gray-600 shadow-md">
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Banner rotativo no topo da {categoryName ? 'categoria' : 'home'}</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Link direto para sua loja no app</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Exibição exclusiva nos bairros selecionados</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>Alcance potencial de milhares de moradores</span>
            </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-blue-200 text-[10px] font-bold uppercase tracking-widest pb-2 pt-2">
            <ShieldCheck className="w-4 h-4" /> Pagamento Seguro e Facilitado
        </div>

        <MasterSponsorBanner 
            variant="light" 
            onClick={() => onNavigate('patrocinador_master')}
        />
      </div>
    </div>
  );
};
