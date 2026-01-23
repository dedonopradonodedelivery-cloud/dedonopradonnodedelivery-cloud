import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Users, Store, BarChart3, History, Eye, Search, 
  ArrowLeft, Download, Filter, TrendingUp, AlertTriangle, 
  Clock, DollarSign, Calendar, ChevronRight, LayoutDashboard,
  CheckCircle, XCircle, LogOut, Megaphone, User as UserIcon, Building, Flag, PauseCircle, Image as ImageIcon,
  Plus, Loader2,
  Heart,
  Share2,
  Phone,
  MousePointerClick,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Target,
  Zap,
  Crown,
  Handshake,
  Sparkles
} from 'lucide-react';
import { getAdminGlobalMetrics, fetchAdminMerchants, fetchAdminUsers, fetchAdminLedger } from '../backend/services';
import { supabase } from '../lib/supabaseClient';

// --- TYPES ---
type FinancialProductType = 'banner' | 'highlight' | 'master' | 'connect';
type PaymentStatus = 'paid' | 'pending' | 'cancelled';
type DateRangeOption = 'today' | '7d' | '30d' | 'month' | 'custom';

interface FinancialTransaction {
  id: string;
  date: string;
  type: FinancialProductType;
  client: string;
  amount: number;
  status: PaymentStatus;
  method: string;
}

// --- MOCK DATA GENERATOR ---
const generateFinancialData = (days: number): FinancialTransaction[] => {
  const data: FinancialTransaction[] = [];
  const now = new Date();
  
  const types: FinancialProductType[] = ['banner', 'highlight', 'master', 'connect'];
  const clients = ['Hamburgueria Brasa', 'Padaria Imperial', 'PetShop Amigo', 'Farmácia Central', 'Studio Hair', 'Mercado Boa Praça'];
  const methods = ['PIX', 'Cartão de Crédito'];

  // Base prices roughly
  const prices = { banner: 49.90, highlight: 19.90, master: 4000.00, connect: 200.00 };

  for (let i = 0; i < days * 3; i++) { // Approx 3 transactions per day avg
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    
    const type = types[Math.floor(Math.random() * types.length)];
    // Master sponsor is rarer
    if (type === 'master' && Math.random() > 0.05) continue; 

    data.push({
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      date: date.toISOString(),
      type,
      client: clients[Math.floor(Math.random() * clients.length)],
      amount: prices[type],
      status: Math.random() > 0.1 ? 'paid' : (Math.random() > 0.5 ? 'pending' : 'cancelled'),
      method: methods[Math.floor(Math.random() * methods.length)]
    });
  }
  
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// --- CHART COMPONENT (SVG) ---
const FinancialChart: React.FC<{ data: FinancialTransaction[], days: number }> = ({ data, days }) => {
  const chartData = useMemo(() => {
    const grouped: Record<string, Record<FinancialProductType, number>> = {};
    const today = new Date();
    
    // Initialize last 'days'
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('pt-BR');
      grouped[key] = { banner: 0, highlight: 0, master: 0, connect: 0 };
    }

    data.forEach(tx => {
      const key = new Date(tx.date).toLocaleDateString('pt-BR');
      if (grouped[key] && tx.status === 'paid') {
        grouped[key][tx.type] += tx.amount;
      }
    });

    return Object.entries(grouped).map(([date, values]) => ({ date, ...values }));
  }, [data, days]);

  const height = 200;
  const width = 600;
  const padding = 20;
  
  const maxVal = Math.max(...chartData.map(d => d.banner + d.highlight + d.master + d.connect), 100);
  const points = chartData.length;
  const stepX = (width - padding * 2) / (points - 1);

  const makePath = (type: FinancialProductType, color: string) => {
    const pathD = chartData.map((d, i) => {
      const x = padding + i * stepX;
      // Stack logic can be complex, doing simple lines for clarity
      const val = d[type]; 
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
  };

  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
           <line key={p} x1={padding} y1={height - padding - (p * (height - padding*2))} x2={width - padding} y2={height - padding - (p * (height - padding*2))} stroke="#ffffff10" />
        ))}
        
        {makePath('master', '#F59E0B')} 
        {makePath('connect', '#6366F1')}
        {makePath('banner', '#3B82F6')}
        {makePath('highlight', '#A855F7')}
      </svg>
      <div className="flex justify-between px-2 text-[10px] text-slate-500 mt-2 font-mono">
        <span>{chartData[0]?.date}</span>
        <span>{chartData[chartData.length - 1]?.date}</span>
      </div>
    </div>
  );
};

// --- FINANCIAL DASHBOARD COMPONENT ---
const AdminFinancialDashboard: React.FC = () => {
  const [range, setRange] = useState<DateRangeOption>('30d');
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const daysMap = { 'today': 1, '7d': 7, '30d': 30, 'month': 30, 'custom': 60 };
      const data = generateFinancialData(daysMap[range]);
      setTransactions(data);
      setLoading(false);
    }, 600);
  }, [range]);

  const kpis = useMemo(() => {
    const paidTxs = transactions.filter(t => t.status === 'paid');
    const totalRevenue = paidTxs.reduce((acc, t) => acc + t.amount, 0);
    const totalOrders = transactions.length;
    const activeOrders = transactions.filter(t => t.status === 'paid').length; // Treating paid as active/completed for simplicity or 'pending'
    const pendingOrders = transactions.filter(t => t.status === 'pending').length;
    const avgTicket = totalRevenue / (paidTxs.length || 1);

    // Breakdown
    const byProduct = (['banner', 'highlight', 'master', 'connect'] as FinancialProductType[]).map(type => {
      const typeTxs = paidTxs.filter(t => t.type === type);
      const revenue = typeTxs.reduce((acc, t) => acc + t.amount, 0);
      const count = typeTxs.length;
      return { type, revenue, count, share: (revenue / (totalRevenue || 1)) * 100 };
    });

    return { totalRevenue, totalOrders, activeOrders, pendingOrders, avgTicket, byProduct };
  }, [transactions]);

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getProductConfig = (type: FinancialProductType) => {
     switch(type) {
         case 'banner': return { label: 'Banners', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Megaphone };
         case 'highlight': return { label: 'Destaque Patrocinado', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Sparkles };
         case 'master': return { label: 'Patrocinador Master', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Crown };
         case 'connect': return { label: 'JPA Connect', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: Handshake };
     }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* FILTERS HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-4 rounded-3xl border border-white/5 shadow-lg">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h2 className="font-bold text-white text-sm">Painel Financeiro</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Controle de Receita</p>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {(['today', '7d', '30d', 'month'] as const).map(opt => (
                    <button 
                        key={opt}
                        onClick={() => setRange(opt)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${range === opt ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {opt === 'today' ? 'Hoje' : opt === 'month' ? 'Mês Atual' : opt.toUpperCase()}
                    </button>
                ))}
                <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center gap-2">
                    <Calendar size={12} /> Custom
                </button>
            </div>
        </div>

        {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#1E5BFF] animate-spin" /></div>
        ) : (
            <>
                {/* 1. GENERAL SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Faturamento Total</p>
                        <h3 className="text-3xl font-black text-white">{formatCurrency(kpis.totalRevenue)}</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-bold">
                            <ArrowUpRight size={14} /> <span>+12.5%</span> <span className="text-slate-600 font-medium ml-1">vs anterior</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-sm">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Pedidos</p>
                        <h3 className="text-3xl font-black text-white">{kpis.totalOrders}</h3>
                        <p className="text-xs text-slate-500 mt-2">{kpis.pendingOrders} pendentes de pagamento</p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-sm">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ticket Médio</p>
                        <h3 className="text-3xl font-black text-white">{formatCurrency(kpis.avgTicket)}</h3>
                        <div className="flex items-center gap-1 mt-2 text-rose-400 text-xs font-bold">
                            <ArrowDownRight size={14} /> <span>-2.1%</span> <span className="text-slate-600 font-medium ml-1">vs anterior</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
                             <Target className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Meta Mensal</p>
                        <p className="text-lg font-black text-white">82% <span className="text-xs text-slate-600 font-medium">Atingida</span></p>
                    </div>
                </div>

                {/* 2. REVENUE BY PRODUCT */}
                <div>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Receita por Produto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {kpis.byProduct.map(prod => {
                            const config = getProductConfig(prod.type);
                            const Icon = config.icon;
                            return (
                                <div key={prod.type} className={`bg-slate-900 p-5 rounded-3xl border ${config.border} shadow-lg relative overflow-hidden group hover:bg-slate-800/50 transition-colors`}>
                                    <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center ${config.color} mb-3`}>
                                        <Icon size={20} />
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-0.5">{config.label}</h4>
                                    <p className={`text-xl font-black ${config.color}`}>{formatCurrency(prod.revenue)}</p>
                                    
                                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Vendas</p>
                                            <p className="text-sm font-bold text-slate-300">{prod.count}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Share</p>
                                            <p className="text-sm font-bold text-white">{prod.share.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. EVOLUTION CHART & INSIGHTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" /> Evolução da Receita
                             </h3>
                             <div className="flex gap-3">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Banners</div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Destaque</div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Master</div>
                             </div>
                        </div>
                        <div className="h-64 w-full">
                            <FinancialChart data={transactions} days={transactions.length > 50 ? 60 : 30} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-[2.5rem] border border-indigo-500/20 shadow-xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 relative z-10">
                            <Sparkles className="w-4 h-4 text-amber-400" /> Insights Automáticos
                        </h3>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Campeão de Vendas</p>
                                <p className="text-sm text-white font-medium">
                                    <strong className="text-indigo-400">Banners Home</strong> representam <strong>42%</strong> do faturamento deste período.
                                </p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Oportunidade</p>
                                <p className="text-sm text-white font-medium">
                                    O <strong className="text-emerald-400">JPA Connect</strong> teve um crescimento de 15% na última semana.
                                </p>
                            </div>
                             <div className="bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Atenção</p>
                                <p className="text-sm text-white font-medium">
                                    A ocupação do <strong className="text-amber-400">Patrocinador Master</strong> está em 100% para o próximo mês.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. DETAILED TABLE */}
                <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-xl overflow-hidden">
                    <div className="px-8 py-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fluxo Transacional Detalhado</span>
                        <button className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
                            <Download size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50">
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Produto</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Valor</th>
                                    <th className="px-6 py-4">Pagamento</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {transactions.slice(0, 10).map((tx, i) => (
                                    <tr key={tx.id} className={`hover:bg-white/5 transition-colors border-b border-white/5 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/20'}`}>
                                        <td className="px-6 py-4 text-slate-400 font-mono">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getProductConfig(tx.type).icon({ size: 14, className: getProductConfig(tx.type).color })}
                                                <span className="font-bold text-slate-200">{getProductConfig(tx.type).label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 font-medium">{tx.client}</td>
                                        <td className="px-6 py-4 font-black text-white">{formatCurrency(tx.amount)}</td>
                                        <td className="px-6 py-4 text-slate-400">{tx.method}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                                                tx.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                                            }`}>
                                                {tx.status === 'paid' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {transactions.length > 10 && (
                        <div className="p-4 text-center border-t border-white/5">
                            <button className="text-xs text-slate-400 hover:text-white font-bold transition-colors">Ver todos os registros</button>
                        </div>
                    )}
                </div>

            </>
        )}
    </div>
  );
};

// --- BANNER PREVIEW COMPONENTS (COPIED FOR HISTORY VIEW) ---
const TemplateBannerRender: React.FC<{ config: any }> = ({ config }) => {
    if (!config) return <div className="p-2 text-xs text-slate-500">Configuração ausente</div>;
    const { template_id, headline, subheadline, product_image_url } = config;
    switch (template_id) {
      case 'oferta_relampago':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 text-white p-4 flex items-center justify-between overflow-hidden relative text-xs">
            <div className="relative z-10">
              <span className="text-[10px] font-bold bg-yellow-300 text-red-700 px-2 py-0.5 rounded-full uppercase">{headline || 'XX% OFF'}</span>
              <h3 className="text-lg font-black mt-2 max-w-[120px] leading-tight">{subheadline || 'Produto'}</h3>
            </div>
            <div className="relative z-10 w-16 h-16 rounded-full border-2 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {product_image_url ? <img src={product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 flex items-end justify-between overflow-hidden relative text-xs">
             <img src={product_image_url || 'https://via.placeholder.com/150'} className="absolute inset-0 w-full h-full object-cover opacity-30" />
             <div className="relative z-10">
                <span className="text-[8px] font-black uppercase tracking-widest text-cyan-300">{headline || 'LANÇAMENTO'}</span>
                <h3 className="text-base font-bold mt-1 max-w-[150px] leading-tight">{subheadline || 'Descrição'}</h3>
             </div>
          </div>
        );
      default: return <div className="p-2 text-xs">Template desconhecido</div>;
    }
};
const CustomBannerRender: React.FC<{ config: any }> = ({ config }) => {
    if (!config) return <div className="p-2 text-xs text-slate-500">Configuração ausente</div>;
    const { background_color, text_color, title, subtitle } = config;
    return (
        <div className="w-full h-full p-4 flex flex-col justify-center text-xs" style={{ backgroundColor: background_color, color: text_color }}>
            <h3 className="font-black text-base leading-tight line-clamp-2">{title || "Título"}</h3>
            <p className="opacity-80 mt-1 line-clamp-2">{subtitle || "Subtítulo"}</p>
        </div>
    );
};
// --- END BANNER PREVIEW ---

const BannerHistoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!supabase) { setLoading(false); return; }
            try {
                const { data, error } = await supabase
                    .from('banner_audit_log')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);
                if (error) throw error;
                setHistory(data || []);
            } catch (e) {
                console.error("Failed to fetch banner history", e);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    const renderBannerPreview = (log: any) => {
        const config = log.details?.config || log.details;
        if (!config) return <div className="p-2 text-xs text-slate-500">Preview Indisponível</div>;
        return config.type === 'template' ? <TemplateBannerRender config={config} /> : <CustomBannerRender config={config} />;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2.5 bg-[#1F2937] text-gray-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="font-black text-lg text-white">Histórico de Banners</h2>
                    <p className="text-xs text-slate-500 font-medium">Auditoria de criação e moderação</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : history.length === 0 ? (
                <div className="text-center py-20 text-slate-600">
                    <History size={40} className="mx-auto mb-4" />
                    <p className="font-bold">Nenhum registro encontrado.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(log => (
                        <div key={log.id} className="bg-slate-900 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${log.action.includes('created') ? 'text-cyan-400' : 'text-rose-400'}`}>
                                    {log.action.includes('created') ? <Plus size={14} /> : <PauseCircle size={14} />}
                                    {log.action.includes('created') ? 'Criação/Update' : `Moderação: ${log.action}`}
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium">{formatDate(log.created_at)}</span>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="w-48 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                                    {renderBannerPreview(log)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 text-sm">
                                        <UserIcon size={14} className="text-slate-400 shrink-0" />
                                        <span className="font-bold text-white truncate">{log.details?.shopName || log.actor_email}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2 truncate">Ator ID: {log.actor_id}</p>
                                    
                                    {log.details?.isFirstBanner && (
                                        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full w-fit border border-green-500/20">
                                            <Flag size={10} /> Primeiro Banner!
                                        </div>
                                    )}
                                    <div className="mt-2 text-[10px] text-slate-500 font-medium uppercase tracking-wider bg-slate-800 px-2 py-1 rounded w-fit">
                                        Destino: {log.details?.target || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface AdminPanelProps {
  user: any;
  onLogout: () => void;
  viewMode: string;
  onOpenViewSwitcher: () => void;
  onNavigateToApp: (view: string) => void;
  onInspectMerchant?: (store: any) => void;
  onInspectUser?: (userId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  user, 
  onLogout, 
  viewMode, 
  onOpenViewSwitcher, 
  onNavigateToApp,
  onInspectMerchant,
  onInspectUser
}) => {
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');
  const [activeTab, setActiveTab] = useState<'metrics' | 'merchants' | 'users' | 'ledger' | 'financial'>('metrics');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({ totalGenerated: 0, totalUsed: 0, totalExpired: 0 });
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    if(view === 'dashboard' && activeTab !== 'financial') loadData();
    if(activeTab === 'financial') setLoading(false); // Finance dashboard loads its own data
  }, [activeTab, searchTerm, view]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'metrics') setMetrics(await getAdminGlobalMetrics());
      if (activeTab === 'merchants') setMerchants(await fetchAdminMerchants(searchTerm));
      if (activeTab === 'users') setUsers(await fetchAdminUsers(searchTerm));
      if (activeTab === 'ledger') setLedger(await fetchAdminLedger());
    } finally {
      setLoading(false);
    }
  };

  const formatBRL = (cents: number) => 
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (view === 'history') {
    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
            <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50">
                <h1 className="font-black text-xl uppercase tracking-tighter text-white">Histórico</h1>
            </header>
            <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
                <BannerHistoryView onBack={() => setView('dashboard')} />
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      {/* Admin Navbar */}
      <header className="bg-slate-900 border-b border-white/5 px-6 py-6 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <ShieldCheck size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="font-black text-xl uppercase tracking-tighter text-white">Central Localizei</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Painel Admin • Jacarepaguá</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onOpenViewSwitcher} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                    Visão: {viewMode}
                </button>
                <button onClick={() => onNavigateToApp('home')} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                    <ArrowLeft size={20} />
                </button>
                <button onClick={onLogout} className="p-2.5 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all">
                    <LogOut size={20} />
                </button>
            </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
                { id: 'metrics', label: 'Métricas', icon: BarChart3 },
                { id: 'financial', label: 'Financeiro', icon: DollarSign },
                { id: 'merchants', label: 'Lojistas', icon: Store },
                { id: 'users', label: 'Usuários', icon: Users },
                { id: 'ledger', label: 'Audit / Ledger', icon: History }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
                    className={`flex-1 min-w-fit px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id 
                        ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                >
                    <tab.icon size={14} />
                    {tab.label}
                </button>
            ))}
        </nav>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
        
        {/* Only show Moderation buttons if NOT in financial tab */}
        {activeTab !== 'financial' && (
          <div className="mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Auditoria e Moderação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                      onClick={() => onNavigateToApp('admin_banner_moderation')}
                      className="w-full bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-rose-500/30 transition-all"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-400 transition-colors">
                              <Megaphone size={24} />
                          </div>
                          <div>
                              <h4 className="font-bold text-white text-base text-left">Moderar Banners</h4>
                              <p className="text-xs text-slate-500 text-left">Analisar e pausar.</p>
                          </div>
                      </div>
                  </button>
                  <button
                      onClick={() => setView('history')}
                      className="w-full bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                              <History size={24} />
                          </div>
                          <div>
                              <h4 className="font-bold text-white text-base text-left">Histórico de Banners</h4>
                              <p className="text-xs text-slate-500 text-left">Logs de criação e moderação.</p>
                          </div>
                      </div>
                  </button>
              </div>
          </div>
        )}

        {activeTab !== 'metrics' && activeTab !== 'financial' && (
            <div className="relative mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1E5BFF] transition-colors" />
                <input 
                    type="text" 
                    placeholder={`Buscar em ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all shadow-inner"
                />
            </div>
        )}

        {loading && activeTab !== 'financial' ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Carregando Auditoria...</p>
            </div>
        ) : (
          <>
            {activeTab === 'financial' && <AdminFinancialDashboard />}

            {activeTab === 'metrics' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl">
                            <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                <TrendingUp size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Total Gerado</span>
                            </div>
                            <h2 className="text-4xl font-black text-white">{formatBRL(metrics.totalGenerated)}</h2>
                            <p className="text-xs text-slate-500 mt-2">Volume acumulado de créditos</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl">
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <CheckCircle size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Total Resgatado</span>
                            </div>
                            <h2 className="text-4xl font-black text-white">{formatBRL(metrics.totalUsed)}</h2>
                            <p className="text-xs text-slate-500 mt-2">Volume gasto nas lojas</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl">
                            <div className="flex items-center gap-2 mb-4 text-rose-400">
                                <Clock size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Total Expirado</span>
                            </div>
                            <h2 className="text-4xl font-black text-white">{formatBRL(metrics.totalExpired)}</h2>
                            <p className="text-xs text-slate-500 mt-2">Créditos não aproveitados</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <LayoutDashboard className="w-12 h-12 text-[#1E5BFF] mb-4" />
                            <h3 className="text-2xl font-black text-white mb-2">Ecossistema Saudável</h3>
                            <p className="text-slate-500 text-sm max-w-sm mb-6">
                                O dinheiro circulando no bairro atualmente é de <span className="text-white font-bold">{formatBRL(metrics.totalGenerated - metrics.totalUsed - metrics.totalExpired)}</span>.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Taxa de Retenção</p>
                                    <p className="text-xl font-black text-white">78%</p>
                                </div>
                                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Churn Mensal</p>
                                    <p className="text-xl font-black text-white">4.2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'merchants' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-500">
                    {merchants.map(merchant => (
                        <div key={merchant.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-[#1E5BFF]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl overflow-hidden border border-white/5">
                                    <img src={merchant.logo_url} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{merchant.name}</h4>
                                    <p className="text-xs text-slate-500">{merchant.category} • {merchant.profiles?.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onInspectMerchant?.(merchant)}
                                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#1E5BFF] hover:text-white transition-all"
                            >
                                <Eye size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-4 animate-in slide-in-from-left duration-500">
                    {users.map(u => (
                        <div key={u.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                    {u.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{u.full_name || 'Usuário'}</h4>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-600 uppercase">Saldo Global</p>
                                    <p className="text-lg font-black text-emerald-400">
                                        {formatBRL(u.cashback_balances?.reduce((a: any, b: any) => a + b.balance_cents, 0) || 0)}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => onInspectUser?.(u.id)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#1E5BFF] hover:text-white transition-all"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'ledger' && (
                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700">
                    <div className="px-8 py-4 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fluxo Transacional Detalhado</span>
                        <button className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors">
                            <Download size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[9px] font-black text-slate-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="px-8 py-5">Data</th>
                                    <th className="px-8 py-5">Usuário</th>
                                    <th className="px-8 py-5">Loja</th>
                                    <th className="px-8 py-5">Tipo</th>
                                    <th className="px-8 py-5 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                {ledger.map(tx => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-4 text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        <td className="px-8 py-4 font-bold text-white">{tx.profiles?.full_name || '---'}</td>
                                        <td className="px-8 py-4 text-slate-400">{tx.merchants?.name}</td>
                                        <td className="px-8 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                                                tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                            }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className={`px-8 py-4 text-right font-black ${
                                            tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                                        }`}>
                                            {formatBRL(tx.amount_cents)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
          </>
        )}
      </main>

      {/* Admin Safety Banner */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-amber-500/10 border-t border-amber-500/20 flex items-center justify-center gap-3 backdrop-blur-md">
          <AlertTriangle size={14} className="text-amber-500" />
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            Modo Auditoria: Alteração de saldos manuais está bloqueada por política de segurança.
          </p>
      </div>
    </div>
  );
};