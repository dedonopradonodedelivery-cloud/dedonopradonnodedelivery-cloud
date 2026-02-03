
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
  ChevronRight
} from 'lucide-react';

interface StoreSponsoredAdsProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

type ViewState = 'list' | 'create' | 'checkout' | 'success' | 'details';

// Mock de campanhas existentes
const MOCK_CAMPAIGNS = [
  { id: 'camp-01', status: 'active', start: '20/10/2023', end: '20/01/2024', duration: '3 Meses', type: 'Patrocinado' },
  { id: 'camp-02', status: 'ended', start: '15/06/2023', end: '15/07/2023', duration: '1 Mês', type: 'Patrocinado' },
];

export const StoreSponsoredAds: React.FC<StoreSponsoredAdsProps> = ({ onBack, onNavigate }) => {
  const [view, setView] = useState<ViewState>('list');
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // --- Lógica de Preço ---
  const PRICE_PER_DAY = 0.99;
  const DAYS_IN_MONTH = 30;
  
  const calculation = useMemo(() => {
    const totalDays = selectedMonths * DAYS_IN_MONTH;
    const totalPrice = totalDays * PRICE_PER_DAY;
    return { totalDays, totalPrice };
  }, [selectedMonths]);

  // --- Handlers ---
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

  // --- Sub-Components ---

  const CampaignMetrics = () => {
    // Simulação de Real-time
    const [metrics, setMetrics] = useState({
      impressions: 12450,
      clicks: 342,
      leads: 18,
      ctr: 2.7
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          impressions: prev.impressions + Math.floor(Math.random() * 5),
          clicks: prev.clicks + (Math.random() > 0.7 ? 1 : 0),
          // Recalcula CTR
          ctr: parseFloat((((prev.clicks + (Math.random() > 0.7 ? 1 : 0)) / (prev.impressions + 1)) * 100).toFixed(2))
        }));
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Campanha Ativa</h3>
              <p className="text-xs text-gray-500 font-medium">Patrocinado Padrão</p>
            </div>
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> Ativo
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-500" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
               Encerra em: <span className="text-gray-900 dark:text-white">20/01/2024</span>
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3 rounded-full"></div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-right">35 dias restantes</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-purple-500">
              <Eye size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Impressões</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.impressions.toLocaleString()}</p>
            <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1"><TrendingUp size={10}/> +12% hoje</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <MousePointerClick size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cliques</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.clicks.toLocaleString()}</p>
            <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1"><TrendingUp size={10}/> +5% hoje</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-500">
              <BarChart3 size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">CTR Médio</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.ctr}%</p>
            <p className="text-[9px] text-gray-400 mt-1">Taxa de conversão</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-amber-500">
              <CheckCircle2 size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Leads</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{metrics.leads}</p>
            <p className="text-[9px] text-gray-400 mt-1">Contatos diretos</p>
          </div>
        </div>

        <div className="flex gap-2">
            <button className="flex-1 py-3 text-[10px] font-bold bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">Hoje</button>
            <button className="flex-1 py-3 text-[10px] font-bold bg-white dark:bg-gray-700 rounded-xl text-blue-600 dark:text-white shadow-sm">7 dias</button>
            <button className="flex-1 py-3 text-[10px] font-bold bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">30 dias</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-300 pb-32">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm shrink-0">
        <button 
          onClick={view === 'list' ? onBack : () => setView('list')} 
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            {view === 'details' ? 'Métricas' : 'Patrocinados'}
          </h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Destaque sua loja</p>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
        
        {/* VIEW: LISTA */}
        {view === 'list' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center py-6">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg">
                    <Megaphone className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Impulsione sua Loja</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 max-w-[260px] mx-auto">
                    Apareça para mais de 450 mil moradores por apenas <span className="text-emerald-500 font-bold">R$ 0,99/dia</span>.
                </p>
                <button 
                    onClick={handleCreateClick}
                    className="mt-6 w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Criar Patrocinado <ArrowRight size={16} />
                </button>
            </div>

            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Suas Campanhas</h3>
                <div className="space-y-3">
                    {MOCK_CAMPAIGNS.map(camp => (
                        <div 
                            key={camp.id}
                            onClick={() => handleViewDetails(camp.id)}
                            className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Campanha {camp.duration}</h4>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${camp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {camp.status === 'active' ? 'Ativa' : 'Encerrada'}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold">{camp.start} - {camp.end}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* VIEW: CRIAR (CONFIGURAÇÃO) */}
        {view === 'create' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-center font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm mb-8">Defina a Duração</h3>
                
                {/* Visualizador de Dias */}
                <div className="flex justify-center mb-8">
                    <div className="text-center">
                        <span className="text-6xl font-black text-[#1E5BFF] tracking-tighter">{selectedMonths}</span>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meses</p>
                    </div>
                </div>

                {/* Slider Customizado */}
                <div className="px-4 mb-8">
                    <input 
                        type="range" 
                        min="1" 
                        max="6" 
                        step="1"
                        value={selectedMonths}
                        onChange={(e) => setSelectedMonths(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>1 Mês</span>
                        <span>6 Meses</span>
                    </div>
                </div>

                {/* Resumo Dinâmico */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>Dias Totais</span>
                        <span>{calculation.totalDays} dias</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>Valor por dia</span>
                        <span>R$ {PRICE_PER_DAY}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-black text-gray-900 dark:text-white uppercase text-sm">Total a Pagar</span>
                        <span className="text-2xl font-black text-emerald-600">R$ {calculation.totalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
             </div>

             <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                Continuar para pagamento <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* VIEW: CHECKOUT */}
        {view === 'checkout' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total do Pedido</p>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-8">
                    R$ {calculation.totalPrice.toFixed(2).replace('.', ',')}
                </h2>
                
                <div className="space-y-3">
                    <button className="w-full p-4 rounded-2xl border-2 border-[#1E5BFF] bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between group transition-all">
                        <div className="flex items-center gap-3">
                            <QrCode className="text-[#1E5BFF]" size={20} />
                            <span className="font-bold text-gray-900 dark:text-white text-sm">PIX (Aprovação Imediata)</span>
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

             <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    Sua campanha será ativada automaticamente assim que o pagamento for confirmado.
                </p>
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

        {/* VIEW: SUCESSO */}
        {view === 'success' && (
          <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 text-emerald-600">
                <CheckCircle2 size={48} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Pagamento Confirmado!</h2>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-12 max-w-[260px] leading-relaxed">
                Sua campanha de patrocinado já está ativa e rodando no app.
             </p>
             <button 
                onClick={() => setView('details')}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
             >
                Acompanhar Campanha
             </button>
          </div>
        )}

        {/* VIEW: DETALHES (METRICAS) */}
        {view === 'details' && <CampaignMetrics />}

      </main>
    </div>
  );
};
