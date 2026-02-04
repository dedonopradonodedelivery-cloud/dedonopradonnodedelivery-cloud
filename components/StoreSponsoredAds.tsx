
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Megaphone, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  BarChart3, 
  QrCode, 
  Loader2, 
  ArrowRight,
  Clock,
  Play,
  ChevronRight,
  Repeat,
  DollarSign
} from 'lucide-react';

interface StoreSponsoredAdsProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

type ViewState = 'list' | 'create' | 'checkout' | 'success' | 'details';
type BillingType = 'one_time' | 'recurring';

interface Campaign {
  id: string;
  status: 'active' | 'pending' | 'ended' | 'canceled';
  start: string;
  end: string;
  duration: number;
  type: string;
  billing: BillingType;
  total: number;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'camp-01', status: 'active', start: '20/10/2023', end: '20/01/2024', duration: 30, type: 'Patrocinado', billing: 'recurring', total: 27.00 },
  { id: 'camp-02', status: 'ended', start: '15/06/2023', end: '15/07/2023', duration: 15, type: 'Patrocinado', billing: 'one_time', total: 13.50 },
];

export const StoreSponsoredAds: React.FC<StoreSponsoredAdsProps> = ({ onBack, onNavigate }) => {
  const [view, setView] = useState<ViewState>('list');
  const [days, setDays] = useState(7);
  const [repeatMonths, setRepeatMonths] = useState(0);
  const [billingType, setBillingType] = useState<BillingType>('one_time');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const PRICE_PER_DAY = 0.90;

  // --- Cálculos Dinâmicos ---
  const calculation = useMemo(() => {
    const baseValue = days * PRICE_PER_DAY;
    const monthsMultiplier = repeatMonths === 0 ? 1 : repeatMonths;
    const totalValue = baseValue * monthsMultiplier;
    
    return {
      baseValue,
      totalValue,
      monthlyValue: baseValue,
      isRecurring: repeatMonths > 0 && billingType === 'recurring'
    };
  }, [days, repeatMonths, billingType]);

  const handleCreateClick = () => setView('create');
  
  const handleCheckoutClick = () => setView('checkout');
  
  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setView('success');
    }, 2000);
  };

  const handleViewDetails = (id: string) => {
    setSelectedCampaignId(id);
    setView('details');
  };

  const formatBRL = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // --- Sub-Components ---

  const CampaignMetrics = () => {
    const [metrics, setMetrics] = useState({
      impressions: 12450,
      clicks: 342,
      ctr: 2.7
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          impressions: prev.impressions + Math.floor(Math.random() * 5),
          clicks: prev.clicks + (Math.random() > 0.8 ? 1 : 0),
          ctr: parseFloat((((prev.clicks + 1) / (prev.impressions + 5)) * 100).toFixed(2))
        }));
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Status da Campanha</h3>
              <p className="text-xs text-gray-500 font-medium">Patrocinado Ativo</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span> Ativo
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-500" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
               Expira em: <span className="text-gray-900 dark:text-white">22/12/2023</span>
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-right">12 dias restantes</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-purple-500">
              <Eye size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Impressões</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.impressions.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <MousePointerClick size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cliques</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.clicks.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm col-span-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500">
                    <BarChart3 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Performance (CTR)</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{metrics.ctr}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-300 pb-32">
      
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
        <button 
          onClick={view === 'list' ? onBack : () => setView('list')} 
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Patrocinados
          </h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Sua loja no topo</p>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
        
        {view === 'list' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <section className="text-center py-6">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-[#1E5BFF] shadow-lg shadow-blue-500/10">
                    <TrendingUp size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Venda mais no Bairro</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 max-w-[260px] mx-auto leading-relaxed">
                    Apareça antes dos concorrentes por apenas <span className="text-emerald-500 font-bold">R$ 0,90/dia</span>.
                </p>
                <button 
                    onClick={handleCreateClick}
                    className="mt-6 w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Novo Patrocinado <ArrowRight size={16} />
                </button>
            </section>

            <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Minhas Campanhas</h3>
                <div className="space-y-3">
                    {MOCK_CAMPAIGNS.map(camp => (
                        <div 
                            key={camp.id}
                            onClick={() => handleViewDetails(camp.id)}
                            className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex justify-between items-center cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${camp.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                    <Megaphone size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Campanha {camp.duration} dias</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{camp.start} - {camp.end}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${camp.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {camp.status === 'active' ? 'Ativa' : 'Encerrada'}
                                </span>
                                <ChevronRight size={16} className="text-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>
        )}

        {view === 'create' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <Calendar className="text-blue-500" size={20} />
                    <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">Duração do Destaque</h3>
                </div>
                
                <div className="text-center mb-8">
                    <span className="text-6xl font-black text-[#1E5BFF] tracking-tighter">{days}</span>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dias Selecionados</p>
                </div>

                <div className="px-2 mb-10">
                    <input 
                        type="range" 
                        min="7" 
                        max="30" 
                        step="1"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <span>7 Dias (Mín)</span>
                        <span>30 Dias (Máx)</span>
                    </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Repetir por quantos meses?</label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {[0, 2, 3, 4, 5, 6].map(m => (
                                <button 
                                    key={m}
                                    onClick={() => setRepeatMonths(m)}
                                    className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex-shrink-0 min-w-[60px] ${repeatMonths === m ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-transparent'}`}
                                >
                                    {m === 0 ? 'Não' : `${m}m`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {repeatMonths > 0 && (
                        <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Modelo de Cobrança</label>
                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => setBillingType('one_time')}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${billingType === 'one_time' ? 'bg-blue-50 dark:bg-blue-900/10 border-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <p className={`font-bold text-sm ${billingType === 'one_time' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>Pagar tudo agora (Antecipado)</p>
                                        {billingType === 'one_time' && <CheckCircle2 size={16} className="text-blue-600" />}
                                    </div>
                                    <p className="text-[10px] text-gray-500">Pagamento único de {formatBRL(calculation.totalValue)}</p>
                                </button>
                                <button 
                                    onClick={() => setBillingType('recurring')}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${billingType === 'recurring' ? 'bg-blue-50 dark:bg-blue-900/10 border-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <p className={`font-bold text-sm ${billingType === 'recurring' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>Recorrente (Mensal)</p>
                                        {billingType === 'recurring' && <CheckCircle2 size={16} className="text-blue-600" />}
                                    </div>
                                    <p className="text-[10px] text-gray-500">Cobrança automática no cartão todo mês</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
             </section>

             <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                Assinar Patrocinado <ArrowRight size={16} />
            </button>
          </div>
        )}

        {view === 'checkout' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resumo do Pedido</p>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl space-y-4 mb-8">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Duração</span><span className="font-bold text-gray-900 dark:text-white">{days} dias / mês</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Meses</span><span className="font-bold text-gray-900 dark:text-white">{repeatMonths === 0 ? 'Apenas 1 mês' : `${repeatMonths} meses`}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Cobrança</span><span className="font-bold text-gray-900 dark:text-white uppercase">{billingType === 'one_time' ? 'Antecipado' : 'Mensal'}</span></div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-black text-gray-900 dark:text-white uppercase text-xs">Total {billingType === 'recurring' ? 'p/ mês' : ''}</span>
                        <span className="text-2xl font-black text-emerald-600">{formatBRL(billingType === 'recurring' ? calculation.monthlyValue : calculation.totalValue)}</span>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <button className="w-full p-4 rounded-2xl border-2 border-[#1E5BFF] bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between group transition-all">
                        <div className="flex items-center gap-3">
                            <QrCode className="text-[#1E5BFF]" size={20} />
                            <span className="font-bold text-gray-900 dark:text-white text-sm">PIX (Imediato)</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#1E5BFF] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </button>
                    <button className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-gray-400" size={20} />
                            <span className="font-bold text-gray-500 text-sm">Cartão de Crédito</span>
                        </div>
                    </button>
                </div>
             </div>

             <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirmar e Pagar'}
            </button>
          </div>
        )}

        {view === 'success' && (
          <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 text-emerald-600">
                <CheckCircle2 size={48} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Destaque Ativado!</h2>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-12 max-w-[260px] mx-auto leading-relaxed">
                Parabéns! Sua loja já está no topo dos resultados patrocinados do bairro.
             </p>
             <button 
                onClick={() => setView('details')}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
             >
                Acompanhar Resultados
             </button>
          </div>
        )}

        {view === 'details' && <CampaignMetrics />}

      </main>

      {/* RODAPÉ INFORMATIVO */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-center opacity-30 pointer-events-none">
        <DollarSign className="w-4 h-4 mb-2 text-gray-500" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 text-center">Localizei Patrocinados v1.0</p>
      </div>

    </div>
  );
};
