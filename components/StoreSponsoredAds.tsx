
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
  ChevronRight,
  DollarSign,
  Info,
  ShieldCheck,
  Zap,
  Target,
  BadgeCheck,
  Store as StoreIcon
} from 'lucide-react';
import { MandatoryVideoLock } from './MandatoryVideoLock';

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
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const PRICE_PER_DAY = 0.90;

  const calculation = useMemo(() => {
    const baseValue = days * PRICE_PER_DAY;
    const monthsMultiplier = repeatMonths === 0 ? 1 : repeatMonths;
    const totalValue = baseValue * monthsMultiplier;
    
    return {
      baseValue,
      totalValue,
      monthlyValue: baseValue,
      isRecurring: repeatMonths > 0 && billingType === 'recurring',
      savings: totalValue * 0.1 
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
        <div className="bg-slate-900 rounded-[2.5rem] p-6 border border-white/5 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter">Status da Campanha</h3>
              <p className="text-xs text-slate-400 font-medium">Patrocinado Ativo</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Ativo
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-500" />
            <p className="text-xs font-bold text-slate-300">
               Expira em: <span className="text-white font-black">22/12/2023</span>
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-blue-600 w-1/3 rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-right font-bold uppercase tracking-widest">12 dias restantes</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-5 rounded-3xl border border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-purple-500">
              <Eye size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Impressões</span>
            </div>
            <p className="text-2xl font-black text-white">{metrics.impressions.toLocaleString()}</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl border border-white/5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-500">
              <MousePointerClick size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cliques</span>
            </div>
            <p className="text-2xl font-black text-white">{metrics.clicks.toLocaleString()}</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-3xl border border-white/5 shadow-sm col-span-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500">
                    <BarChart3 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Performance (CTR)</span>
                </div>
                <p className="text-xl font-black text-white">{metrics.ctr}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="store_sponsored"
    >
      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col animate-in fade-in duration-300 pb-32">
        <style>{`
          input[type='range']::-webkit-slider-runnable-track {
            background: #1e293b;
            height: 8px;
            border-radius: 4px;
          }
          input[type='range']::-webkit-slider-thumb {
            margin-top: -6px;
            width: 20px;
            height: 20px;
            background: #1e5bff;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
          @keyframes subtle-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          .animate-subtle-pulse {
            animation: subtle-pulse 6s ease-in-out infinite;
          }
          @keyframes float-card {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-6px) rotate(-1deg); }
          }
          .animate-float-card {
            animation: float-card 8s ease-in-out infinite;
          }
          @keyframes cta-attention {
            0% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(30, 91, 255, 0.3); }
            8% { transform: scale(1.04); box-shadow: 0 20px 30px -5px rgba(30, 91, 255, 0.6); }
            16% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(30, 91, 255, 0.3); }
            100% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(30, 91, 255, 0.3); }
          }
          .animate-cta-conversion {
            animation: cta-attention 5s ease-in-out infinite;
            animation-delay: 1.5s;
          }
        `}</style>
        
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl px-5 h-20 flex items-center gap-4 border-b border-white/5 shadow-sm shrink-0">
          <button 
            onClick={view === 'list' ? onBack : () => setView('list')} 
            className="p-2.5 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-lg text-white uppercase tracking-tighter leading-none">
              Patrocinados
            </h1>
            <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Sua loja no topo</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
          
          {view === 'list' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-300">
              <section className="space-y-6">
                  <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5">
                      <div className="relative aspect-[16/9]">
                          <img 
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop" 
                            alt="Destaque Patrocinado"
                            className="w-full h-full object-cover opacity-20 mix-blend-luminosity filter blur-[2px]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                          
                          <div className="absolute inset-0 flex items-center justify-center p-6">
                              <div className="w-full max-w-[240px] bg-slate-800 rounded-2xl p-4 shadow-2xl border border-blue-500/20 animate-float-card">
                                  <div className="flex gap-3">
                                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <StoreIcon className="text-blue-400" size={24} />
                                      </div>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-center">
                                              <div className="h-3 w-20 bg-slate-700 rounded"></div>
                                              <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase">Patrocinado</span>
                                          </div>
                                          <div className="h-2 w-12 bg-slate-800 rounded mt-2"></div>
                                          <div className="flex gap-1 mt-2">
                                              <div className="h-2 w-4 bg-yellow-400 rounded"></div>
                                              <div className="h-2 w-16 bg-slate-800 rounded"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="px-8 pb-8 -mt-6 relative z-10 text-center">
                          <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                              Apareça antes dos concorrentes no seu bairro
                          </h2>
                          <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                              O Patrocinado destaca sua loja no topo das listas do bairro, colocando você na frente dos concorrentes quando o cliente procura por serviços como o seu. <strong className="text-white">Mais visibilidade e vendas.</strong>
                          </p>

                          <div className="grid grid-cols-3 gap-2 mb-10">
                              <div className="flex flex-col items-center text-center gap-1.5 group">
                                  <div className="p-2.5 bg-white/5 rounded-2xl text-emerald-400 border border-emerald-500/10 transition-all duration-700 animate-subtle-pulse" style={{ animationDelay: '0s' }}>
                                    <CheckCircle2 size={18} />
                                  </div>
                                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Sem contrato</span>
                              </div>
                              <div className="flex flex-col items-center text-center gap-1.5 group">
                                  <div className="p-2.5 bg-white/5 rounded-2xl text-blue-400 border border-blue-500/10 transition-all duration-700 animate-subtle-pulse" style={{ animationDelay: '2s' }}>
                                    <Calendar size={18} />
                                  </div>
                                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Escolha os dias</span>
                              </div>
                              <div className="flex flex-col items-center text-center gap-1.5 group">
                                  <div className="p-2.5 bg-white/5 rounded-2xl text-amber-400 border border-amber-500/10 transition-all duration-700 animate-subtle-pulse" style={{ animationDelay: '4s' }}>
                                    <DollarSign size={18} />
                                  </div>
                                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">R$ 0,90/dia</span>
                              </div>
                          </div>

                          <button 
                              onClick={handleCreateClick}
                              className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs animate-cta-conversion"
                          >
                              Patrocinar por R$ 0,90/dia <ArrowRight size={18} />
                          </button>
                      </div>
                  </div>
              </section>

              <section>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Minhas Campanhas</h3>
                  <div className="space-y-3">
                      {MOCK_CAMPAIGNS.map(camp => (
                          <div 
                              key={camp.id}
                              onClick={() => handleViewDetails(camp.id)}
                              className="bg-slate-900 p-5 rounded-3xl border border-white/5 shadow-sm flex justify-between items-center cursor-pointer active:scale-[0.98] transition-all group"
                          >
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${camp.status === 'active' ? 'bg-emerald-50/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                                      <Megaphone size={18} />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-white text-sm">Campanha {camp.duration} dias</h4>
                                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{camp.start} - {camp.end}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${camp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
                                      {camp.status === 'active' ? 'Ativa' : 'Encerrada'}
                                  </span>
                                  <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                              </div>
                          </div>
                      ))}
                  </div>
              </section>
            </div>
          )}

          {view === 'create' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <section className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                      <Calendar className="text-blue-500" size={20} />
                      <h3 className="font-black text-white uppercase tracking-widest text-sm">Duração do Destaque</h3>
                  </div>
                  
                  <div className="text-center mb-8">
                      <span className="text-7xl font-black text-[#1E5BFF] tracking-tighter leading-none">{days}</span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Dias Selecionados</p>
                      <p className="text-xl font-black text-emerald-400 mt-4">{formatBRL(calculation.baseValue)}</p>
                  </div>

                  <div className="px-2 mb-10">
                      <input 
                          type="range" 
                          min="7" 
                          max="30" 
                          step="1"
                          value={days}
                          onChange={(e) => setDays(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <span>7 Dias (Mín)</span>
                          <span>30 Dias (Máx)</span>
                      </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                      <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Repetir por quantos meses?</label>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                              {[0, 2, 3, 4, 5, 6].map(m => (
                                  <button 
                                      key={m}
                                      onClick={() => setRepeatMonths(m)}
                                      className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex-shrink-0 min-w-[60px] ${repeatMonths === m ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}
                                  >
                                      {m === 0 ? 'Não' : `${m}m`}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {repeatMonths > 0 && (
                          <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Modelo de Cobrança</label>
                              <div className="grid grid-cols-1 gap-3">
                                  <button 
                                      onClick={() => setBillingType('one_time')}
                                      className={`p-4 rounded-2xl border-2 text-left transition-all ${billingType === 'one_time' ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-slate-800 border-white/5'}`}
                                  >
                                      <div className="flex justify-between items-center mb-1">
                                          <p className={`font-black text-sm uppercase ${billingType === 'one_time' ? 'text-white' : 'text-slate-400'}`}>Pagar tudo agora (Antecipado)</p>
                                          {billingType === 'one_time' && <CheckCircle2 size={16} className="text-blue-500" />}
                                      </div>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase">Pagamento único de {formatBRL(calculation.totalValue)}</p>
                                  </button>
                                  <button 
                                      onClick={() => setBillingType('recurring')}
                                      className={`p-4 rounded-2xl border-2 text-left transition-all ${billingType === 'recurring' ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-slate-800 border-white/5'}`}
                                  >
                                      <div className="flex justify-between items-center mb-1">
                                          <p className={`font-black text-sm uppercase ${billingType === 'recurring' ? 'text-white' : 'text-slate-400'}`}>Recorrente (Mensal)</p>
                                          {billingType === 'recurring' && <CheckCircle2 size={16} className="text-blue-500" />}
                                      </div>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase">Cobrança automática todo mês</p>
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
               </section>

               <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 space-y-3 shadow-2xl">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tight">
                      <span>Dias selecionados:</span>
                      <span className="text-white">{days}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tight">
                      <span>Valor por dia:</span>
                      <span className="text-white">R$ 0,90</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tight">
                      <span>Repetir por:</span>
                      <span className="text-white">{repeatMonths === 0 ? 'Não' : `${repeatMonths} meses`}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-sm font-black text-white uppercase tracking-tighter">
                          {billingType === 'recurring' && repeatMonths > 0 ? 'Valor Mensal' : 'Total'}
                      </span>
                      <span className="text-3xl font-black text-emerald-400">
                          {formatBRL(billingType === 'recurring' && repeatMonths > 0 ? calculation.monthlyValue : calculation.totalValue)}
                      </span>
                  </div>
               </div>

               <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                  Assinar Patrocinado <ArrowRight size={16} />
              </button>
            </div>
          )}

          {view === 'checkout' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Resumo do Pedido</p>
                  
                  <div className="bg-slate-950 p-6 rounded-3xl space-y-4 mb-8 border border-white/5">
                      <div className="flex justify-between text-sm uppercase tracking-tight"><span className="text-slate-500 font-bold">Duração</span><span className="font-black text-white">{days} dias / mês</span></div>
                      <div className="flex justify-between text-sm uppercase tracking-tight"><span className="text-slate-500 font-bold">Meses</span><span className="font-black text-white">{repeatMonths === 0 ? 'Apenas 1 mês' : `${repeatMonths} meses`}</span></div>
                      <div className="flex justify-between text-sm uppercase tracking-tight"><span className="text-slate-500 font-bold">Cobrança</span><span className="font-black text-blue-400 uppercase">{billingType === 'one_time' ? 'Antecipado' : 'Mensal'}</span></div>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                          <span className="font-black text-slate-300 uppercase text-xs">Total {billingType === 'recurring' ? 'p/ mês' : ''}</span>
                          <span className="text-3xl font-black text-emerald-400">{formatBRL(billingType === 'recurring' ? calculation.monthlyValue : calculation.totalValue)}</span>
                      </div>
                  </div>
                  
                  <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 text-left ml-2">Escolha como pagar</p>
                      <button 
                          onClick={() => setPaymentMethod('pix')} 
                          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'pix' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}
                      >
                          <div className="flex items-center gap-4 text-left">
                              <div className={`p-2 rounded-xl ${paymentMethod === 'pix' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}><QrCode size={20} /></div>
                              <div>
                                  <p className="font-black text-sm uppercase text-white">PIX Imediato</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Ativação instantânea</p>
                              </div>
                          </div>
                          {paymentMethod === 'pix' && <CheckCircle2 size={18} className="text-blue-500" />}
                      </button>
                      <button 
                          onClick={() => setPaymentMethod('card')} 
                          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950 border-transparent'}`}
                      >
                          <div className="flex items-center gap-4 text-left">
                              <div className={`p-2 rounded-xl ${paymentMethod === 'card' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}><CreditCard size={20} /></div>
                              <div>
                                  <p className="font-black text-sm uppercase text-white">Cartão de Crédito</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Até 12x no bairro</p>
                              </div>
                          </div>
                          {paymentMethod === 'card' && <CheckCircle2 size={18} className="text-blue-500" />}
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
            <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-500 h-full min-h-[60vh]">
               <div className="w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-400 border border-emerald-500/30 shadow-2xl">
                  <CheckCircle2 size={48} />
               </div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Destaque Ativado!</h2>
               <p className="text-slate-400 text-sm mb-12 max-w-[260px] mx-auto leading-relaxed font-medium">
                  Parabéns! Sua loja já está no topo dos resultados patrocinados do bairro.
               </p>
               <button 
                  onClick={() => setView('details')}
                  className="w-full max-w-sm bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
               >
                  Acompanhar Resultados
               </button>
            </div>
          )}

          {view === 'details' && <CampaignMetrics />}

        </main>

        <div className="fixed bottom-0 left-0 right-0 p-8 flex flex-col items-center justify-center opacity-10 pointer-events-none bg-gradient-to-t from-black to-transparent">
          <DollarSign className="w-4 h-4 mb-2 text-white" />
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white text-center">Localizei Patrocinados v1.0</p>
        </div>

      </div>
    </MandatoryVideoLock>
  );
};
