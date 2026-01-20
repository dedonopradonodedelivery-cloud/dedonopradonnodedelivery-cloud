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
  Loader2
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  user?: User | null;
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

const MenuLink: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void; highlight?: boolean; subtitle?: string }> = ({ icon: Icon, label, onClick, highlight, subtitle }) => (
  <button onClick={onClick} className={`w-full bg-white dark:bg-gray-800 p-4 border-b last:border-b-0 border-gray-100 dark:border-gray-700 flex items-center justify-between group active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors`}>
    <div className="flex items-center gap-3">
      <div className={`${highlight ? 'text-[#1E5BFF]' : 'text-gray-400'} group-hover:text-[#2D6DF6] transition-colors`}><Icon className="w-5 h-5" /></div>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-semibold ${highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
        {subtitle && <span className="text-[10px] text-gray-400 font-medium">{subtitle}</span>}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300" />
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

const PerformanceDashboard: React.FC<{ storeId: string }> = ({ storeId }) => {
    const [dateRange, setDateRange] = useState<string>('30d');
    const [displayPeriod, setDisplayPeriod] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [adPlacementFilter, setAdPlacementFilter] = useState<'all' | 'home' | 'category'>('all');

    useEffect(() => {
        const fetchData = async () => {
            if (!storeId || !supabase) return;
            setLoading(true);

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
                default: days = 30; // '30d'
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

            const { data: metricsData, error: metricsError } = await supabase
                .from('metrics_daily')
                .select('*')
                .eq('store_id', storeId)
                .gte('date', startDateISO)
                .lte('date', endDateISO);
            
            const { data: eventsData, error: eventsError } = await supabase
                .from('store_organic_events')
                .select('event_type')
                .eq('store_id', storeId)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .in('event_type', ['store_click_whatsapp', 'store_click_call', 'store_click_directions', 'store_click_share', 'store_click_favorite']);

            if (metricsError || eventsError) {
                console.error(metricsError || eventsError);
                setLoading(false);
                return;
            }

            // Process KPIs
            const totalViews = metricsData.reduce((sum, m) => sum + (m.channel === 'organic' ? m.views : 0), 0);
            const totalAdClicks = metricsData.reduce((sum, m) => sum + (m.channel === 'paid' ? m.clicks : 0), 0);
            const totalLeads = metricsData.reduce((sum, m) => sum + (m.channel === 'organic' ? m.leads : 0), 0);
            const totalImpressions = metricsData.reduce((sum, m) => sum + (m.channel === 'paid' ? m.impressions : 0), 0);
            const generalCtr = totalImpressions > 0 ? ((totalAdClicks / totalImpressions) * 100).toFixed(1) + '%' : '0%';

            // Process Organic Chart Data
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

            // Process Organic Top Actions
            const topActions = (eventsData || []).reduce((acc, { event_type }) => {
                const label = event_type.replace('store_click_', '');
                acc[label] = (acc[label] || 0) + 1;
                return acc;
            }, {});
            const sortedTopActions = Object.entries(topActions).sort(([,a],[,b]) => (b as number) - (a as number));

            // Process ADS Data
            const adMetrics = metricsData.filter(m => m.channel === 'paid');
            const adsByBanner = adMetrics.reduce((acc, metric) => {
                const id = metric.banner_id || 'unknown';
                if (!acc[id]) {
                    acc[id] = { id, impressions: 0, clicks: 0, placements: new Set(), neighborhoods: new Set() };
                }
                acc[id].impressions += metric.impressions;
                acc[id].clicks += metric.clicks;
                if(metric.placement) acc[id].placements.add(metric.placement);
                if(metric.neighborhood) acc[id].neighborhoods.add(metric.neighborhood);
                return acc;
            }, {} as any);
            const adsTableData = Object.values(adsByBanner).map((b: any) => ({
                ...b,
                ctr: b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) + '%' : '0.00%',
                placements: Array.from(b.placements)
            }));
            
            setStats({ kpis: { totalViews, totalAdClicks, totalLeads, generalCtr }, organicChartData, sortedTopActions, adsTableData });
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
        if (stats.kpis.totalViews > 1000) insightsArr.push({ icon: TrendingUp, text: "Parabéns pelo alto número de visualizações! Mantenha seu perfil atualizado para converter visitas em clientes." });
        else insightsArr.push({ icon: TrendingUp, text: "Aumente suas visualizações! Crie um anúncio na home para alcançar mais moradores." });
        
        const lowCtrBanner = stats.adsTableData.find((ad:any) => parseFloat(ad.ctr) < 0.5 && ad.impressions > 5000);
        if(lowCtrBanner) insightsArr.push({ icon: MousePointerClick, text: `Seu banner "${lowCtrBanner.id.substring(0,15)}..." tem um CTR baixo. Tente usar uma imagem mais atrativa ou um texto de oferta mais claro.` });
        else insightsArr.push({ icon: MousePointerClick, text: "Seus anúncios estão com bom desempenho. Considere criar uma oferta especial para a categoria 'Comida' para aumentar ainda mais os cliques." });
        
        if (stats.sortedTopActions[0]?.[0] === 'whatsapp') insightsArr.push({ icon: MessageSquare, text: "A maioria dos seus leads vem do WhatsApp. Garanta um atendimento rápido para não perder vendas." });
        else insightsArr.push({ icon: MapPin, text: "Muitos usuários clicam em 'Rotas'. Verifique se o endereço no seu perfil está correto e bem visível." });
        return insightsArr;
    }, [stats]);


    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }
    if (!stats) return <div className="text-center text-gray-400">Não há dados para exibir.</div>;
    
    const topActionIcons: {[key: string]: React.ElementType} = { whatsapp: MessageSquare, call: Phone, directions: MapPin, share: Share2, favorite: Heart };

    return (
        <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-[#2D6DF6]" />Desempenho da Loja</h2>
            </div>
            
            <div className="mb-6">
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                >
                    {dateRangeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <p className="text-[10px] text-gray-400 font-bold text-center mt-2 uppercase tracking-wider">{displayPeriod}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KPICard icon={Eye} label="Visitas ao Perfil" value={stats.kpis.totalViews.toLocaleString()} color="bg-blue-500" />
                <KPICard icon={MousePointerClick} label="Cliques em Ads" value={stats.kpis.totalAdClicks.toLocaleString()} color="bg-indigo-500" />
                <KPICard icon={HeartHandshake} label="Leads Orgânicos" value={stats.kpis.totalLeads.toLocaleString()} color="bg-green-500" />
                <KPICard icon={TrendingUp} label="CTR Geral (Ads)" value={stats.kpis.generalCtr} color="bg-purple-500" />
            </div>

            <div className="mt-8 space-y-8">
                {/* Seção Orgânico */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Orgânico</h3>
                    <div className="space-y-4">
                        <BarChart data={stats.organicChartData} />
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Top Ações no Perfil</h4>
                             <div className="space-y-2">
                                {stats.sortedTopActions.map(([label, count]: [string, number]) => {
                                    const Icon = topActionIcons[label] || Heart;
                                    return (
                                        <div key={label} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-xs">
                                            <span className="flex items-center gap-2 font-bold text-gray-600 dark:text-gray-300 capitalize"><Icon className="w-4 h-4"/>{label}</span>
                                            <span className="font-black text-gray-800 dark:text-white">{count}</span>
                                        </div>
                                    );
                                })}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Seção ADS */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">ADS</h3>
                    <div className="space-y-4">
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                           {(['all', 'home', 'category'] as const).map(p => (
                               <button key={p} onClick={() => setAdPlacementFilter(p)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${adPlacementFilter === p ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>{p}</button>
                           ))}
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredAds.map((ad: any) => (
                                <div key={ad.id} className="p-3">
                                    <p className="text-[10px] font-bold text-gray-400 truncate">{ad.id}</p>
                                    <div className="grid grid-cols-3 gap-2 text-center mt-2">
                                        <div><p className="text-xs text-gray-400">Impr.</p><p className="font-bold text-sm dark:text-white">{ad.impressions.toLocaleString()}</p></div>
                                        <div><p className="text-xs text-gray-400">Cliques</p><p className="font-bold text-sm dark:text-white">{ad.clicks.toLocaleString()}</p></div>
                                        <div><p className="text-xs text-gray-400">CTR</p><p className="font-bold text-sm text-blue-500">{ad.ctr}</p></div>
                                    </div>
                                    <p className="text-[9px] text-gray-400 mt-2 truncate">Bairros: {Array.from(ad.neighborhoods).join(', ') || 'N/A'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seção Insights */}
                <div>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Insights</h3>
                     <div className="space-y-3">
                        {insights.map((insight, i) => {
                            const Icon = insight.icon;
                            return (
                                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 mt-1"><Icon className="w-4 h-4"/></div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{insight.text}</p>
                                </div>
                            );
                        })}
                     </div>
                </div>
            </div>
        </div>
    );
};

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate }) => {
  // Mocking the storeId for a logged-in merchant. In a real app, this would be fetched based on the user object.
  const storeId = 'grupo-esquematiza'; 

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
        <PerformanceDashboard storeId={storeId} />
        
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Ações</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <MenuLink icon={Megaphone} label="Anúncios e Banners" subtitle="Destaque sua loja no app" highlight={true} onClick={() => onNavigate?.('store_ads_module')} />
                <MenuLink icon={Tag} label="Promoção da Semana" highlight={true} onClick={() => onNavigate?.('weekly_promo')} />
                <MenuLink icon={Briefcase} label="Vagas de Emprego" highlight={true} onClick={() => onNavigate?.('merchant_jobs')} />
                <MenuLink icon={Settings} label="Minha Loja (Perfil Público)" onClick={() => onNavigate?.('store_profile')} />
                <MenuLink icon={HelpCircle} label="Suporte ao Lojista" onClick={() => onNavigate?.('store_support')} />
            </div>
        </div>
      </div>
    </div>
  );
};