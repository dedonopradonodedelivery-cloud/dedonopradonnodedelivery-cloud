import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  BadgeCheck, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Calendar,
  Briefcase,
  ArrowRight,
  Rocket,
  Tag,
  Coins,
  QrCode,
  Megaphone,
  Eye,
  Heart,
  Share2,
  Phone,
  MousePointerClick,
  TrendingUp,
  MapPin,
  HeartHandshake,
  MessageSquare,
  Lightbulb,
  Loader2,
  LogOut
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { BannerOrder, BannerMessage } from '../types';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
  bannerOrders?: BannerOrder[];
  bannerMessages?: BannerMessage[];
  onViewOrder?: (orderId: string) => void;
}

const STORE_DATA = {
  name: "Hamburgueria Brasa",
  isVerified: true,
  logo: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop",
};

const KPICard: React.FC<{ icon: React.ElementType; label: string; value: string; color: string; trend?: string; }> = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-28">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide truncate">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
        {trend && <p className="text-xs font-bold text-green-500">{trend}</p>}
      </div>
    </div>
  </div>
);

const MenuLink: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void; highlight?: boolean; subtitle?: string; badge?: boolean; }> = ({ icon: Icon, label, onClick, highlight, subtitle, badge }) => (
  <button onClick={onClick} className={`w-full bg-white dark:bg-gray-800 p-4 border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors`}>
    <div className="flex items-center gap-3">
      <div className={`${highlight ? 'text-[#1E5BFF]' : 'text-gray-400'} group-hover:text-[#2D6DF6] transition-colors relative`}><Icon className="w-5 h-5" /></div>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-semibold ${highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
        {subtitle && <span className="text-[10px] text-gray-400 font-medium">{subtitle}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2">
        {badge && <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>}
        <ChevronRight className="w-4 h-4 text-gray-300" />
    </div>
  </button>
);

const BarChart: React.FC<{ data: { label: string; views: number; leads: number }[] }> = ({ data }) => {
    const max = useMemo(() => Math.max(...data.map(d => d.views), ...data.map(d => d.leads), 1), [data]);
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Tendência Orgânica</h4>
                    <p className="text-xs text-gray-400">Visualizações e Leads por dia</p>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Views</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>Leads</span>
                </div>
             </div>
             <div className="flex gap-1.5 items-end h-32">
                 {data.map((day, index) => (
                    <div key={index} title={`${day.views} views, ${day.leads} leads`} className="flex-1 flex flex-col items-center gap-0.5 group">
                        <div className="relative w-full h-full flex items-end gap-px">
                            <div className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-md group-hover:bg-blue-400 transition-colors" style={{ height: `${(day.views / max) * 100}%` }}></div>
                            <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-t-md group-hover:bg-green-400 transition-colors" style={{ height: `${(day.leads / max) * 100}%` }}></div>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold">{day.label}</span>
                    </div>
                 ))}
             </div>
        </div>
    );
};

const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: '7d', label: 'Semana (últimos 7 dias)' },
    { value: '15d', label: 'Quinzena (últimos 15 dias)' },
    { value: '30d', label: 'Mês (últimos 30 dias)' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '180d', label: 'Últimos 6 meses' },
    { value: '365d', label: 'Último ano' },
];

const generateMockData = (days: number) => {
    const kpis = {
        totalViews: 1284,
        totalAdClicks: 96,
        totalLeads: 188,
        totalButtonClicks: 327,
        generalCtr: '8.32%'
    };

    const organicChartData = Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return {
            label: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
            views: Math.max(0, Math.floor(kpis.totalViews / days) + (Math.floor(Math.random() * 20) - 10)),
            leads: Math.max(0, Math.floor(kpis.totalLeads / days) + (Math.floor(Math.random() * 5) - 2))
        };
    });
    
    const sortedTopActions = [ ['whatsapp', 152], ['directions', 98], ['call', 77] ];
    const adsTableData = [
        { id: 'Banner Home', impressions: 842, clicks: 71, ctr: ((71 / 842) * 100).toFixed(2) + '%', placements: ['home'], neighborhoods: new Set(['Freguesia', 'Anil']), status: '🟢 Ativo' },
        { id: 'Banner Categoria (Comida)', impressions: 312, clicks: 25, ctr: ((25 / 312) * 100).toFixed(2) + '%', placements: ['category'], neighborhoods: new Set(['Taquara']), status: '🟡 Em teste' }
    ];
    return { kpis, organicChartData, sortedTopActions, adsTableData };
};


const PerformanceDashboard: React.FC<{ storeId: string }> = ({ storeId }) => {
    const [dateRange, setDateRange] = useState<string>('30d');
    const [displayPeriod, setDisplayPeriod] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [adPlacementFilter, setAdPlacementFilter] = useState<'all' | 'home' | 'category'>('all');
    const [isMockData, setIsMockData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!storeId || !supabase) return;
            setLoading(true);
            setIsMockData(false);

            const endDate = new Date();
            const startDate = new Date();
            let days = 30;

            switch (dateRange) {
                case 'today': days = 1; break;
                case '7d': days = 7; break;
                case '15d': days = 15; break;
                case '90d': days = 90; break;
                case '180d': days = 180; break;
                case '365d': days = 365; break;
                default: days = 30;
            }

            if (dateRange === 'today') {
                startDate.setHours(0, 0, 0, 0);
            } else {
                startDate.setDate(endDate.getDate() - (days - 1));
            }
            
            const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            setDisplayPeriod(`Período: ${formatDate(startDate)} a ${formatDate(endDate)}`);

            const startDateISO = startDate.toISOString().split('T')[0];
            const endDateISO = endDate.toISOString().split('T')[0];

            const { data: metricsData, error: metricsError } = await supabase.from('metrics_daily').select('*').eq('store_id', storeId).gte('date', startDateISO).lte('date', endDateISO);
            const { data: eventsData, error: eventsError } = await supabase.from('store_organic_events').select('event_type').eq('store_id', storeId).gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString()).in('event_type', ['store_click_whatsapp', 'store_click_call', 'store_click_directions', 'store_click_share', 'store_click_favorite']);

            if (metricsError || eventsError) console.error(metricsError || eventsError);
            if (!metricsData || metricsData.length === 0) {
                setIsMockData(true);
                setStats(generateMockData(days));
                setLoading(false);
                return;
            }

            const totalViews = metricsData.reduce((sum, m) => sum + (m.channel === 'organic' ? m.views : 0), 0);
            const totalAdClicks = metricsData.reduce((sum, m) => sum + (m.channel === 'paid' ? m.clicks : 0), 0);
            const totalLeads = metricsData.reduce((sum, m) => sum + (m.channel === 'organic' ? m.leads : 0), 0);
            const totalImpressions = metricsData.reduce((sum, m) => sum + (m.channel === 'paid' ? m.impressions : 0), 0);
            const generalCtr = totalImpressions > 0 ? ((totalAdClicks / totalImpressions) * 100).toFixed(1) + '%' : '0%';

            const topActions = (eventsData || []).reduce((acc, { event_type }) => {
                const label = event_type.replace('store_click_', '');
                acc[label] = (acc[label] || 0) + 1;
                return acc;
            }, {});
            const sortedTopActions = Object.entries(topActions).sort(([,a],[,b]) => (b as number) - (a as number));
            const totalButtonClicks = sortedTopActions.filter(([label]) => ['whatsapp', 'call', 'directions'].includes(label)).reduce((sum, [, count]) => sum + (count as number), 0);
            
            const organicChartData = Array.from({ length: days }, (_, i) => {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                const metricsForDay = metricsData.filter(m => m.date === dateStr && m.channel === 'organic');
                return {
                    label: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
                    views: metricsForDay.reduce((s, m) => s + m.views, 0),
                    leads: metricsForDay.reduce((s, m) => s + m.leads, 0)
                };
            });

            const adMetrics = metricsData.filter(m => m.channel === 'paid');
            const adsByBanner = adMetrics.reduce((acc, metric) => {
                const id = metric.banner_id || 'unknown';
                if (!acc[id]) { acc[id] = { id, impressions: 0, clicks: 0, placements: new Set(), neighborhoods: new Set() }; }
                acc[id].impressions += metric.impressions;
                acc[id].clicks += metric.clicks;
                if(metric.placement) acc[id].placements.add(metric.placement);
                if(metric.neighborhood) acc[id].neighborhoods.add(metric.neighborhood);
                return acc;
            }, {} as any);
            const adsTableData = Object.values(adsByBanner).map((b: any) => ({
                ...b,
                ctr: b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) + '%' : '0.00%',
                placements: Array.from(b.placements),
                status: '🟢 Ativo'
            }));
            
            setStats({ kpis: { totalViews, totalAdClicks, totalLeads, generalCtr, totalButtonClicks }, organicChartData, sortedTopActions, adsTableData });
            setLoading(false);
        };
        fetchData();
    }, [dateRange, storeId]);

    const filteredAds = useMemo(() => {
        if (!stats?.adsTableData) return [];
        if (adPlacementFilter === 'all') return stats.adsTableData;
        return stats.adsTableData.filter((ad: any) => ad.placements.includes(adPlacementFilter));
    }, [stats?.adsTableData, adPlacementFilter]);
    
    const insights = useMemo(() => {
        if (!stats) return [];
        let insightsArr = [];
        insightsArr.push({ icon: TrendingUp, text: stats.kpis.totalViews > 1000 ? "Parabéns pelo alto número de visualizações! Mantenha seu perfil atualizado." : "Aumente suas visualizações! Crie um anúncio na home para alcançar mais moradores." });
        const lowCtrBanner = stats.adsTableData.find((ad:any) => parseFloat(ad.ctr) < 0.5 && ad.impressions > 5000);
        insightsArr.push({ icon: MousePointerClick, text: lowCtrBanner ? `Seu banner "${lowCtrBanner.id.substring(0,15)}..." tem um CTR baixo. Tente usar uma imagem mais atrativa.` : "Seus anúncios estão com bom desempenho. Considere criar uma oferta para a categoria 'Comida'." });
        insightsArr.push({ icon: MessageSquare, text: stats.sortedTopActions[0]?.[0] === 'whatsapp' ? "A maioria dos seus leads vem do WhatsApp. Garanta um atendimento rápido." : "Muitos usuários clicam em 'Rotas'. Verifique se o endereço no seu perfil está correto." });
        return insightsArr;
    }, [stats]);


    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    if (!stats) return <div className="text-center text-gray-400 p-8 bg-gray-100 rounded-2xl">Não foi possível carregar os dados.</div>;
    
    const topActionIcons: {[key: string]: React.ElementType} = { whatsapp: MessageSquare, call: Phone, directions: MapPin, share: Share2, favorite: Heart };

    return (
        <div>
            <div className="mb-6">
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
                    {dateRangeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <p className="text-[10px] text-gray-400 font-bold text-center mt-2 uppercase tracking-wider">{displayPeriod}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <KPICard icon={Eye} label="Visitas ao Perfil" value={stats.kpis.totalViews.toLocaleString()} color="bg-blue-500" />
                <KPICard icon={MousePointerClick} label="Cliques em Botões" value={stats.kpis.totalButtonClicks.toLocaleString()} color="bg-indigo-500" />
                <KPICard icon={HeartHandshake} label="Leads Orgânicos" value={stats.kpis.totalLeads.toLocaleString()} color="bg-green-500" />
                <KPICard icon={Rocket} label="Cliques em Ads" value={stats.kpis.totalAdClicks.toLocaleString()} color="bg-purple-500" />
                <div className="col-span-2"><KPICard icon={TrendingUp} label="CTR Geral (Ads)" value={stats.kpis.generalCtr} color="bg-orange-500" /></div>
            </div>

            <div className="mt-8 space-y-8">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Orgânico</h3>
                    <div className="space-y-4">
                        <BarChart data={stats.organicChartData} />
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Top Ações no Perfil</h4>
                             <div className="space-y-2">{stats.sortedTopActions.map(([label, count]: [string, number]) => { const Icon = topActionIcons[label] || Heart; return (<div key={label} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-xs"><span className="flex items-center gap-2 font-bold text-gray-600 dark:text-gray-300 capitalize"><Icon className="w-4 h-4"/>{label}</span><span className="font-black text-gray-800 dark:text-white">{count}</span></div>);})}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">ADS</h3>
                    <div className="space-y-4">
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">{(['all', 'home', 'category'] as const).map(p => <button key={p} onClick={() => setAdPlacementFilter(p)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${adPlacementFilter === p ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>{p}</button>)}</div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">{filteredAds.map((ad: any) => <div key={ad.id} className="p-3"><div className="flex justify-between items-center mb-2"><p className="text-[10px] font-bold text-gray-400 truncate">{ad.id}</p>{ad.status && <p className="text-[10px] font-bold">{ad.status}</p>}</div><div className="grid grid-cols-3 gap-2 text-center"><div><p className="text-xs text-gray-400">Impr.</p><p className="font-bold text-sm dark:text-white">{ad.impressions.toLocaleString()}</p></div><div><p className="text-xs text-gray-400">Cliques</p><p className="font-bold text-sm dark:text-white">{ad.clicks.toLocaleString()}</p></div><div><p className="text-xs text-gray-400">CTR</p><p className="font-bold text-sm text-blue-500">{ad.ctr}</p></div></div><p className="text-[9px] text-gray-400 mt-2 truncate">Bairros: {Array.from(ad.neighborhoods).join(', ') || 'N/A'}</p></div>)}</div>
                    </div>
                </div>

                <div>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Insights</h3>
                     <div className="space-y-3">{insights.map((insight, i) => { const Icon = insight.icon; return (<div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-start gap-3"><div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 mt-1"><Icon className="w-4 h-4"/></div><p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{insight.text}</p></div>);})}</div>
                </div>
            </div>
            {isMockData && <div className="text-center mt-8 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800"><p className="text-[10px] text-yellow-700 dark:text-yellow-300 font-medium">Dados ilustrativos para visualização do painel.</p></div>}
        </div>
    );
};

const CashbackDashboard: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [isActive, setIsActive] = useState(true);
  const isMockData = true; // Always mock for now as per request

  const mockData = {
    configuredPercent: '5%',
    totalGenerated: 'R$ 622,50',
    totalRedeemed: 'R$ 189,70',
    uniqueCustomers: 114
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <h3 className="font-bold text-gray-900 dark:text-white">Status do Programa</h3>
            </div>
             <button onClick={() => setIsActive(!isActive)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <KPICard icon={Tag} label="Configurado" value={mockData.configuredPercent} color="bg-blue-500" />
        <KPICard icon={TrendingUp} label="Total Gerado" value={mockData.totalGenerated} color="bg-green-500" />
        <KPICard icon={ShoppingBag} label="Total Resgatado" value={mockData.totalRedeemed} color="bg-indigo-500" />
        <KPICard icon={Users} label="Clientes Únicos" value={mockData.uniqueCustomers.toString()} color="bg-purple-500" />
      </div>

      <button onClick={() => onNavigate?.('store_cashback_module')} className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <Settings className="w-4 h-4" /> Configurar Cashback
      </button>

      {isMockData && (
        <div className="text-center mt-6 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <p className="text-[10px] text-yellow-700 dark:text-yellow-300 font-medium">
                Dados ilustrativos para visualização do painel.
            </p>
        </div>
      )}
    </div>
  );
};

const InternalViewWrapper: React.FC<{ title: string; icon: React.ElementType; onBack: () => void; children: React.ReactNode }> = ({ title, icon: Icon, onBack, children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
    <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[#2D6DF6]" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
      </div>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user, bannerOrders = [], bannerMessages = [], onViewOrder }) => {
  const storeId = user?.id || 'grupo-esquematiza';
  const [internalView, setInternalView] = useState<'main' | 'performance' | 'cashback'>('main');
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hasUnreadMessages = useMemo(() => {
    const professionalOrders = bannerOrders.filter(o => o.bannerType === 'professional');
    return professionalOrders.some(order => {
        const lastTeamMessage = bannerMessages
            .filter(m => m.orderId === order.id && m.senderType === 'team')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        
        if (!lastTeamMessage) return false;
        if (!order.lastViewedAt) return true;
        
        return new Date(lastTeamMessage.createdAt) > new Date(order.lastViewedAt);
    });
  }, [bannerOrders, bannerMessages]);

  const professionalOrders = bannerOrders.filter(o => o.bannerType === 'professional');

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
        await signOut();
        if (onNavigate) onNavigate('home');
    } catch (error) {
        console.error("Logout failed", error);
    } finally {
        setIsLoggingOut(false);
    }
  };

  if (internalView === 'performance') {
    return (
      <InternalViewWrapper title="Desempenho do seu negócio" icon={LayoutDashboard} onBack={() => setInternalView('main')}>
        <PerformanceDashboard storeId={storeId} />
      </InternalViewWrapper>
    );
  }

  if (internalView === 'cashback') {
    return (
      <InternalViewWrapper title="Sistema de Cashback" icon={Coins} onBack={() => setInternalView('main')}>
        <CashbackDashboard onNavigate={onNavigate} />
      </InternalViewWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-sans animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-1"><button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"><ChevronLeft className="w-6 h-6" /></button><span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Painel do Parceiro</span></div>
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-gray-100 dark:border-gray-600 shadow-sm"><img src={STORE_DATA.logo} alt="Logo" className="w-full h-full object-cover" /></div>
            <div>
                <div className="flex items-center gap-1.5"><h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display leading-tight">{STORE_DATA.name}</h1>{STORE_DATA.isVerified && <BadgeCheck className="w-5 h-5 text-white fill-[#1E5BFF]" />}</div>
                <p className="text-xs font-medium text-gray-500">Operação Ativa</p>
            </div>
        </div>
      </div>
      <div className="p-5 space-y-8">
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Ações</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <MenuLink icon={LayoutDashboard} label="Desempenho do seu negócio" onClick={() => setInternalView('performance')} highlight />
                <MenuLink icon={Coins} label="Sistema de Cashback" onClick={() => setInternalView('cashback')} highlight />
                <MenuLink icon={Megaphone} label="Anúncios de Banners" subtitle="Criação e gestão de banners" onClick={() => onNavigate?.('banner_config')} />
                {professionalOrders.length > 0 && (
                  <MenuLink 
                    icon={Briefcase} 
                    label="Acompanhar Pedidos" 
                    subtitle={`${professionalOrders.length} pedido(s) em andamento`}
                    onClick={() => {
                        if (professionalOrders.length === 1 && onViewOrder) {
                            onViewOrder(professionalOrders[0].id);
                        } else {
                            // Future: navigate to a list of orders
                            onNavigate?.('banner_orders_list');
                        }
                    }}
                    badge={hasUnreadMessages} 
                  />
                )}
                <MenuLink icon={Rocket} label="ADS / Patrocinados" subtitle="Apareça em destaque para mais clientes" onClick={() => onNavigate?.('sponsored_ads')} />
                <MenuLink icon={Tag} label="Promoção da Semana" subtitle="Ofertas em destaque na Home" onClick={() => onNavigate?.('weekly_promo')} />
                <MenuLink icon={Settings} label="Minha Loja (Perfil)" onClick={() => onNavigate?.('store_profile')} />
                <MenuLink icon={HelpCircle} label="Suporte" onClick={() => onNavigate?.('store_support')} />
            </div>
        </div>
        <div className="pt-4">
            <button 
                onClick={handleLogout} 
                disabled={isLoggingOut} 
                className="w-full bg-red-50 dark:bg-red-900/10 p-5 rounded-[2rem] border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
                {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin text-red-600" /> : <LogOut className="w-5 h-5 text-red-600" />}
                <span className="font-bold text-red-600 text-sm">Sair da conta</span>
            </button>
        </div>
      </div>
    </div>
  );
};
