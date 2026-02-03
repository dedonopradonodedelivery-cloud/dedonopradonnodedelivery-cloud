
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Megaphone, 
  CreditCard, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  Calendar, 
  ArrowRight,
  Plus,
  Loader2,
  Clock,
  X,
  QrCode,
  ChevronRight
} from 'lucide-react';
import { SponsoredCampaign } from '../types';

interface StoreSponsoredModuleProps {
  onBack: () => void;
}

// Mock Data
const MOCK_CAMPAIGNS: SponsoredCampaign[] = [
  {
    id: 'camp-001',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    durationMonths: 1,
    totalDays: 30,
    dailyPrice: 0.99,
    totalPrice: 29.70,
    status: 'active',
    metrics: {
      impressions: 12450,
      clicks: 482,
      leads: 35
    }
  },
  {
    id: 'camp-002',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    durationMonths: 1,
    totalDays: 30,
    dailyPrice: 0.99,
    totalPrice: 29.70,
    status: 'ended',
    metrics: {
      impressions: 25000,
      clicks: 950,
      leads: 80
    }
  }
];

export const StoreSponsoredModule: React.FC<StoreSponsoredModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'create' | 'checkout' | 'success' | 'details'>('list');
  const [campaigns, setCampaigns] = useState<SponsoredCampaign[]>(MOCK_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<SponsoredCampaign | null>(null);
  
  // Creation State
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);

  // Constants
  const PRICE_PER_DAY = 0.99;
  const DAYS_PER_MONTH = 30;

  // --- CALCULATIONS ---
  const calculated = useMemo(() => {
    const totalDays = selectedMonths * DAYS_PER_MONTH;
    const totalValue = totalDays * PRICE_PER_DAY;
    return {
      totalDays,
      totalValue,
      endDate: new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000)
    };
  }, [selectedMonths]);

  // --- HANDLERS ---
  const handleCreateClick = () => {
    setSelectedMonths(1);
    setView('create');
  };

  const handleGoToCheckout = () => {
    setView('checkout');
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Create new campaign
      const newCampaign: SponsoredCampaign = {
        id: `camp-${Date.now()}`,
        startDate: new Date().toISOString(),
        endDate: calculated.endDate.toISOString(),
        durationMonths: selectedMonths,
        totalDays: calculated.totalDays,
        dailyPrice: PRICE_PER_DAY,
        totalPrice: calculated.totalValue,
        status: 'active',
        metrics: { impressions: 0, clicks: 0, leads: 0 } // Start fresh
      };

      setCampaigns([newCampaign, ...campaigns]);
      setSelectedCampaign(newCampaign); // For dashboard link
      setIsProcessing(false);
      setView('success');
    }, 2000);
  };

  const handleViewDetails = (camp: SponsoredCampaign) => {
    setSelectedCampaign(camp);
    setView('details');
  };

  // --- SUB-VIEWS ---

  const ListView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
        {/* Hero CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
                    <Megaphone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Destaque sua Loja</h2>
                <p className="text-sm text-blue-100 font-medium mb-6 max-w-xs mx-auto">
                    Apareça no topo das listas e atraia mais clientes por apenas <strong>R$ 0,99/dia</strong>.
                </p>
                <button 
                    onClick={handleCreateClick}
                    className="w-full bg-white text-blue-600 font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                    <Plus size={16} /> Criar Patrocinado
                </button>
            </div>
        </div>

        {/* Campaign List */}
        <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 mb-3">Minhas Campanhas</h3>
            <div className="space-y-3">
                {campaigns.map((camp) => (
                    <div 
                        key={camp.id} 
                        onClick={() => handleViewDetails(camp)}
                        className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${camp.status === 'active' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                                {camp.status === 'active' ? <TrendingUp size={20} /> : <Clock size={20} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Campanha {camp.durationMonths} {camp.durationMonths === 1 ? 'Mês' : 'Meses'}</h4>
                                    {camp.status === 'active' && (
                                        <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Ativa</span>
                                    )}
                                    {camp.status === 'ended' && (
                                        <span className="bg-gray-100 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Encerrada</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">
                                    {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const CreateView = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
        <div className="text-center">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Configure sua Campanha</h2>
            <p className="text-sm text-gray-500 font-medium mt-2">Escolha por quanto tempo deseja destacar sua loja.</p>
        </div>

        {/* Slider Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duração</p>
                    <p className="text-3xl font-black text-[#1E5BFF]">{selectedMonths} {selectedMonths === 1 ? 'Mês' : 'Meses'}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total de dias</p>
                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{calculated.totalDays} dias</p>
                </div>
            </div>

            <input 
                type="range" 
                min="1" 
                max="6" 
                step="1" 
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1E5BFF]"
            />
            <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase">
                <span>1 Mês</span>
                <span>6 Meses</span>
            </div>
        </div>

        {/* Live Calculation */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <span className="text-xs font-medium text-slate-400">Valor por dia</span>
                <span className="text-sm font-bold">R$ {PRICE_PER_DAY.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-widest">Total a Pagar</span>
                <span className="text-3xl font-black text-[#1E5BFF]">R$ {calculated.totalValue.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>

        <button 
            onClick={handleGoToCheckout}
            className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
            Continuar para Pagamento <ArrowRight size={16} />
        </button>
    </div>
  );

  const CheckoutView = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Resumo do Pedido</h3>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Duração</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedMonths} meses ({calculated.totalDays} dias)</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Preço diário</span>
                <span className="font-bold text-gray-900 dark:text-white">R$ {PRICE_PER_DAY}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Total</span>
                <span className="text-2xl font-black text-[#1E5BFF]">R$ {calculated.totalValue.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>

        <div className="space-y-4">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Forma de Pagamento</h3>
             <div className="flex gap-3">
                <button 
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pix' ? 'bg-blue-50 dark:bg-blue-900/20 border-[#1E5BFF] text-[#1E5BFF]' : 'bg-white dark:bg-gray-800 border-transparent text-gray-400'}`}
                >
                    <QrCode size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">PIX</span>
                </button>
                <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-blue-50 dark:bg-blue-900/20 border-[#1E5BFF] text-[#1E5BFF]' : 'bg-white dark:bg-gray-800 border-transparent text-gray-400'}`}
                >
                    <CreditCard size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cartão</span>
                </button>
             </div>
        </div>

        <button 
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-70"
        >
            {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                    <CheckCircle2 size={18} /> Confirmar e Ativar
                </>
            )}
        </button>
    </div>
  );

  const SuccessView = () => (
    <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 text-emerald-500 shadow-xl">
            <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Sucesso!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed mb-10">
            Sua campanha patrocinada foi ativada. Agora sua loja terá destaque especial no app.
        </p>
        
        <button 
            onClick={() => setView('details')}
            className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs mb-4"
        >
            Acompanhar Campanha
        </button>
        <button onClick={() => setView('list')} className="text-gray-400 font-bold text-xs">Voltar para lista</button>
    </div>
  );

  const DetailsView = () => {
      if (!selectedCampaign) return null;

      // Mock Real-time increment
      const [metrics, setMetrics] = useState(selectedCampaign.metrics);
      
      useEffect(() => {
        if (selectedCampaign.status !== 'active') return;
        const interval = setInterval(() => {
            setMetrics(prev => ({
                impressions: prev.impressions + Math.floor(Math.random() * 5),
                clicks: prev.clicks + (Math.random() > 0.7 ? 1 : 0),
                leads: prev.leads
            }));
        }, 3000);
        return () => clearInterval(interval);
      }, []);

      const ctr = metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) : '0.00';
      const daysLeft = Math.ceil((new Date(selectedCampaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const progress = Math.min(100, ((selectedCampaign.totalDays - daysLeft) / selectedCampaign.totalDays) * 100);

      return (
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
            {/* Status Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${selectedCampaign.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                <span className="text-lg font-black uppercase">{selectedCampaign.status === 'active' ? 'Ativa' : 'Encerrada'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Término</p>
                            <p className="text-sm font-bold mt-1">{new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-blue-300">
                            <span>Progresso</span>
                            <span>{daysLeft} dias restantes</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                        <Eye size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Impressões</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.impressions.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-purple-500">
                        <MousePointerClick size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Cliques</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.clicks.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-emerald-500">
                        <BarChart3 size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">CTR</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{ctr}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-amber-500">
                        <TrendingUp size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Leads</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.leads}</p>
                </div>
            </div>

            <button onClick={() => setView('list')} className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">Voltar para lista</button>
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={view === 'list' ? onBack : () => setView('list')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Patrocinados</h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Impulsione sua Loja</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto w-full">
        {view === 'list' && <ListView />}
        {view === 'create' && <CreateView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
        {view === 'details' && <DetailsView />}
      </main>
    </div>
  );
};
