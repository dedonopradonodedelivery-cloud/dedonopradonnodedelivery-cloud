
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  BarChart3, 
  DollarSign, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Home,
  LayoutGrid,
  Megaphone,
  RefreshCw,
  Plus,
  Palette,
  ArrowRight,
  Calendar,
  MapPin,
  CheckCircle2,
  BarChart,
  LineChart,
  Target
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_ADS = [
  {
    id: 'ad1',
    type: 'Banner Home',
    badgeIcon: Home,
    locations: 'Freguesia, Pechincha',
    dateRange: '22/01/26 → 21/02/26',
    status: 'active',
    investment: 49.90,
    views: 4320,
    clicks: 128
  },
  {
    id: 'ad2',
    type: 'Banner Categoria',
    badgeIcon: LayoutGrid,
    locations: 'Taquara',
    dateRange: '15/01/26 → 14/02/26',
    status: 'active',
    investment: 29.90,
    views: 2150,
    clicks: 88
  },
  {
    id: 'ad3',
    type: 'ADS Patrocinado',
    badgeIcon: Megaphone,
    locations: 'Todo o Bairro',
    dateRange: '10/01/26 → 10/02/26',
    status: 'active',
    investment: 199.00,
    views: 8900,
    clicks: 312
  },
  {
    id: 'ad4',
    type: 'Banner Home',
    badgeIcon: Home,
    locations: 'Anil',
    dateRange: '01/01/26 → 31/01/26',
    status: 'ended',
    investment: 49.90,
    views: 3800,
    clicks: 95
  }
];

const MOCK_GRAPH_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  views: Math.floor(Math.random() * 100) + 50 + (i * 5),
  clicks: Math.floor(Math.random() * (i / 2 + 1)) + Math.floor(i / 5),
}));

// --- SUB-COMPONENTS ---

const DetailView: React.FC<{ ad: typeof MOCK_ADS[0]; onBack: () => void; }> = ({ ad, onBack }) => {
    const maxViews = Math.max(...MOCK_GRAPH_DATA.map(d => d.views));
    
    return (
        <div className="animate-in slide-in-from-right duration-500">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2.5 bg-[#1F2937] text-gray-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="font-black text-lg text-white leading-tight">{ad.type}</h2>
                    <p className="text-xs text-slate-500 font-medium">{ad.locations}</p>
                </div>
            </header>

            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 mb-8">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Desempenho (últimos 30 dias)</p>
                <div className="h-48 w-full relative">
                    {/* Graph SVG */}
                    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                        {/* Views Line */}
                        <path 
                            d={`M 0 ${100 - (MOCK_GRAPH_DATA[0].views / maxViews * 90)} ` + MOCK_GRAPH_DATA.map((d, i) => `L ${(i / 29) * 300} ${100 - (d.views / maxViews * 90)}`).join(' ')}
                            fill="none"
                            stroke="#1E5BFF"
                            strokeWidth="2"
                        />
                        <path 
                            d={`M 0 100 ` + MOCK_GRAPH_DATA.map((d, i) => `L ${(i / 29) * 300} ${100 - (d.views / maxViews * 90)}`).join(' ') + ` L 300 100 Z`}
                            fill="url(#viewsGradient)"
                        />
                        {/* Clicks Dots */}
                        {MOCK_GRAPH_DATA.map((d, i) => (
                            <circle 
                                key={i}
                                cx={(i / 29) * 300}
                                cy={100 - (d.views / maxViews * 90)}
                                r={d.clicks > 0 ? 2.5 : 0}
                                fill="#059669"
                                stroke="white"
                                strokeWidth="1"
                            />
                        ))}
                        <defs>
                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="100%">
                                <stop offset="0%" stopColor="#1E5BFF" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="#1E5BFF" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase mt-2 px-2">
                    <span>Início</span>
                    <span>Hoje</span>
                </div>
                <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1E5BFF]"></div><span className="text-xs text-slate-400">Visualizações</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-xs text-slate-400">Cliques</span></div>
                </div>
            </div>

            <p className="text-xs text-center text-slate-400 italic mb-8">
                Quanto mais alto o gráfico, mais pessoas viram seu anúncio.
            </p>

            <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-2 text-sm"><RefreshCw size={16} /> Renovar por mais 30 dias</button>
                <button className="w-full bg-slate-800 text-slate-300 font-bold p-4 rounded-2xl flex items-center justify-center gap-2 text-sm"><Plus size={16} /> Criar novo anúncio</button>
                <button className="w-full bg-slate-900 border border-white/10 text-slate-400 font-bold p-4 rounded-2xl flex items-center justify-center gap-2 text-sm"><Palette size={16} /> Editar arte</button>
            </div>
        </div>
    );
};


export const MerchantPerformanceDashboard: React.FC<{ onBack: () => void; onNavigate: (view: string) => void }> = ({ onBack, onNavigate }) => {
  const [selectedAd, setSelectedAd] = useState<typeof MOCK_ADS[0] | null>(null);

  const totalInvestment = MOCK_ADS.reduce((sum, ad) => sum + ad.investment, 0);
  const totalViews = MOCK_ADS.reduce((sum, ad) => sum + ad.views, 0);
  const totalClicks = MOCK_ADS.reduce((sum, ad) => sum + ad.clicks, 0);

  if (selectedAd) {
      return <DetailView ad={selectedAd} onBack={() => setSelectedAd(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col animate-in fade-in duration-500">
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95">
                <ChevronLeft size={20} />
            </button>
            <div>
                <h1 className="font-bold text-lg leading-none flex items-center gap-2">Meus Anúncios <BarChart3 size={16} className="text-[#1E5BFF]" /></h1>
                <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Painel de Desempenho</p>
            </div>
        </header>

        <main className="flex-1 p-6 space-y-12 pb-32 max-w-md mx-auto w-full">
            
            <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4 px-1">Visão Geral (Todos os Períodos)</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-5 rounded-3xl border border-white/5"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Investimento</p><p className="text-2xl font-black text-white">R$ {totalInvestment.toFixed(2)}</p></div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-white/5"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Visualizações</p><p className="text-2xl font-black text-white">{totalViews.toLocaleString()}</p></div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-white/5"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cliques</p><p className="text-2xl font-black text-white">{totalClicks}</p></div>
                    <div className="bg-slate-900 p-5 rounded-3xl border border-white/5"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Visibilidade</p><p className="text-2xl font-black text-emerald-400">+27%</p></div>
                </div>
            </section>

            <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4 px-1">Anúncios Ativos</h3>
                <div className="space-y-4">
                    {MOCK_ADS.filter(ad => ad.status === 'active').map(ad => {
                        const BadgeIcon = ad.badgeIcon;
                        return (
                            <div key={ad.id} className="bg-slate-900 rounded-[2.5rem] border border-white/10 p-6 space-y-4 shadow-lg group">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400"><BadgeIcon size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{ad.type}</h4>
                                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{ad.locations}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Ativo</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="bg-slate-800 p-3 rounded-2xl"><p className="text-[9px] text-slate-500 font-bold uppercase">Views</p><p className="text-lg font-black text-white">{ad.views.toLocaleString()}</p></div>
                                    <div className="bg-slate-800 p-3 rounded-2xl"><p className="text-[9px] text-slate-500 font-bold uppercase">Cliques</p><p className="text-lg font-black text-white">{ad.clicks}</p></div>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex gap-3">
                                    <button onClick={() => setSelectedAd(ad)} className="flex-1 py-3 bg-white/5 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Ver Detalhes</button>
                                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Renovar</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center text-emerald-400">
                    <TrendingUp size={24} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Seus anúncios tiveram bom desempenho.</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Anúncios ativos por mais tempo tendem a receber mais cliques e visibilidade.
                </p>
                <button onClick={() => onNavigate('store_ads_module')} className="bg-white text-black font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                    Continuar Anunciando <ArrowRight size={14} />
                </button>
            </section>
        </main>
    </div>
  );
};
