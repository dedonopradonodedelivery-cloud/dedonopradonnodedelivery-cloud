
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

  // --- Cálculos Dinâmicos ---
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

  return (
    <MandatoryVideoLock 
      videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
      storageKey="sponsored_ads"
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
                          <button 
                              onClick={handleCreateClick}
                              className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs animate-cta-conversion"
                          >
                              Patrocinar por R$ 0,90/dia <ArrowRight size={18} />
                          </button>
                      </div>
                  </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </MandatoryVideoLock>
  );
};
