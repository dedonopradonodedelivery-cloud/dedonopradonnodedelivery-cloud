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
  Handshake
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
                        <div className="flex