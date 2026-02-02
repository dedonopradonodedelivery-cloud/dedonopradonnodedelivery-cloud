
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Users, Store, History, Eye, Search, 
  ArrowLeft, Download, Filter, TrendingUp, AlertTriangle, 
  Clock, DollarSign, Calendar, ChevronRight, LayoutDashboard,
  CheckCircle, XCircle, LogOut, Megaphone, User as UserIcon, Building, Flag, PauseCircle, Image as ImageIcon,
  Plus, Loader2,
  Heart,
  Share2,
  Phone,
  MousePointerClick,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Target,
  Zap,
  Crown,
  Handshake,
  Sparkles,
  FileText,
  MessageCircle,
  MessageSquare,
  Wrench,
  Lightbulb,
  Bug,
  CheckCircle2,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { fetchAdminMerchants, fetchAdminUsers } from '../backend/services';
import { supabase } from '../lib/supabaseClient';
import { ServiceRequest, AppSuggestion } from '../types';

// --- TYPES ---
type FinancialProductType = 'banner' | 'highlight' | 'master' | 'connect' | 'lead';
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
  
  const types: FinancialProductType[] = ['banner', 'highlight', 'master', 'connect', 'lead'];
  const clients = ['Hamburgueria Brasa', 'Padaria Imperial', 'PetShop Amigo', 'Farmácia Central', 'Studio Hair', 'Mercado Boa Praça'];
  const methods = ['PIX', 'Cartão de Crédito'];

  const prices = { banner: 49.90, highlight: 19.90, master: 4000.00, connect: 200.00, lead: 5.90 };

  for (let i = 0; i < days * 4; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    
    const type = types[Math.floor(Math.random() * types.length)];
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

const FinancialChart: React.FC<{ data: FinancialTransaction[], days: number }> = ({ data, days }) => {
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('pt-BR');
      grouped[key] = 0;
    }

    data.forEach(tx => {
      const key = new Date(tx.date).toLocaleDateString('pt-BR');
      if (grouped[key] !== undefined && tx.status === 'paid') {
        grouped[key] += tx.amount;
      }
    });

    return Object.entries(grouped).map(([date, value]) => ({ date, value }));
  }, [data, days]);

  const height = 140;
  const width = 600;
  const padding = 10;
  
  const maxVal = Math.max(...chartData.map(d => d.value), 100);
  const points = chartData.length;
  const stepX = (width - padding * 2) / (points - 1);

  const pathD = chartData.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / maxVal) * (height - padding * 2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaD = `${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E5BFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E5BFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#chartGradient)" />
        <path d={pathD} fill="none" stroke="#1E5BFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between px-2 text-[8px] text-slate-500 mt-2 font-mono uppercase">
        <span>{chartData[0]?.date}</span>
        <span>{chartData[chartData.length - 1]?.date}</span>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ElementType; color?: string }> = ({ title, subtitle, icon: Icon, color = "text-slate-400" }) => (
  <div className="flex flex-col gap-0.5 mb-5 px-1">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className={color} />}
      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{title}</h3>
    </div>
    {subtitle && <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>}
  </div>
);

const AdminFinancialDashboard: React.FC = () => {
  const [range, setRange] = useState<DateRangeOption>('30d');
  const [data, setData] = useState<FinancialTransaction[]>([]);
  
  useEffect(() => {
    const days = range === 'today' ? 1 : range === '7d' ? 7 : 30;
    setData(generateFinancialData(days));
  }, [range]);

  const todayRevenue = useMemo(() => data.filter(t => {
    const d = new Date(t.date);
    const today = new Date();
    return d.getDate() === today.getDate() && t.status === 'paid';
  }).reduce((acc, t) => acc + t.amount, 0), [data]);

  const todayTransactions = useMemo(() => data.filter(t => {
    const d = new Date(t.date);
    const today = new Date();
    return d.getDate() === today.getDate() && t.status === 'paid';
  }).length, [data]);

  const todayPendencies = useMemo(() => data.filter(t => {
    const d = new Date(t.date);
    const today = new Date();
    return d.getDate() === today.getDate() && t.status === 'pending';
  }).length, [data]);

  const totalRevenue = useMemo(() => data.filter(t => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0), [data]);
  const pendingRevenueTotal = useMemo(() => data.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0), [data]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
        
        {/* 1. RESUMO DO DIA (Prioridade Máxima) */}
        <section>
          <SectionHeader title="Resumo do Dia" subtitle="Saúde operacional imediata" icon={Zap} color="text-amber-400" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><DollarSign size={20} /></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded">Hoje</span>
              </div>
              <p className="text-3xl font-black text-white leading-none">R$ {todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">Receita processada hoje</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><CheckCircle2 size={20} /></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Atividade</span>
              </div>
              <p className="text-3xl font-black text-white leading-none">{todayTransactions}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">Vendas concluídas hoje</p>
            </div>

            <div className={`p-6 rounded-[2rem] border transition-all shadow-xl group ${todayPendencies > 0 ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-900 border-white/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${todayPendencies > 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  <AlertTriangle size={20} />
                </div>
                {todayPendencies > 0 && (
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Atenção</span>
                )}
              </div>
              <p className={`text-3xl font-black leading-none ${todayPendencies > 0 ? 'text-amber-500' : 'text-white'}`}>{todayPendencies}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2">Pendências urgentes hoje</p>
            </div>
          </div>
        </section>

        {/* 2. PERFORMANCE DO APP */}
        <section>
          <SectionHeader title="Performance" subtitle="Eficiência da plataforma" icon={TrendingUp} color="text-indigo-400" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl"><Users size={16} /></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conversão Leads</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-white">24.8%</p>
                <div className="flex items-center text-emerald-400 text-[10px] font-bold mb-1">
                  <ArrowUpRight size={12} /> 2.1%
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl"><CreditCard size={16} /></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ticket Médio</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-white">R$ 54,90</p>
                <div className="flex items-center text-rose-400 text-[10px] font-bold mb-1">
                  <ArrowDownRight size={12} /> R$ 3,10
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-800 text-slate-400 rounded-xl"><Calendar size={16} /></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Churn Rate</p>
              </div>
              <p className="text-2xl font-black text-white">1.2%</p>
            </div>
          </div>
        </section>

        {/* 3. VISÃO FINANCEIRA GERAL */}
        <section>
          <SectionHeader title="Faturamento Geral" subtitle="Consolidado acumulado" icon={PieChart} color="text-blue-400" />
          <div className="bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Receita Bruta Acumulada</p>
                  <h4 className="text-4xl font-black text-white tracking-tighter">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                  <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-[10px] font-bold uppercase">
                    <TrendingUp size={12} /> +15.4% em relação ao mês anterior
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Pendente (Geral)</p>
                  <p className="text-2xl font-black text-amber-500">R$ {pendingRevenueTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="h-full min-h-[140px] pt-4">
                <FinancialChart data={data} days={30} />
              </div>
            </div>
            
            <div className="p-4 bg-slate-950/50 border-t border-white/5 flex justify-between items-center">
               <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                 <FileText size={14} /> Exportar Relatório Detalhado
               </button>
               <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                  {['7d', '30d'].map(r => (
                      <button key={r} onClick={() => setRange(r as any)} className={`px-4 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${range === r ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                          {r}
                      </button>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* ÚLTIMAS TRANSAÇÕES (Simplified) */}
        <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Últimas Transações</h3>
            <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    {data.slice(0, 5).map(tx => (
                        <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-tighter ${
                                    tx.type === 'master' ? 'bg-amber-500/10 text-amber-500' : 
                                    tx.type === 'banner' ? 'bg-blue-500/10 text-blue-500' : 
                                    'bg-slate-800 text-slate-400'
                                }`}>
                                    {tx.type.slice(0, 3)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{tx.client}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">{new Date(tx.date).toLocaleDateString('pt-BR')} • {tx.method}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white">R$ {tx.amount.toFixed(2).replace('.', ',')}</p>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                    tx.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                    tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                    'text-rose-400'
                                }`}>
                                    {tx.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-all bg-slate-950/20">Ver Todas</button>
            </div>
        </section>
    </div>
  );
};

export const AdminPanel: React.FC<any> = ({ onLogout, viewMode, onOpenViewSwitcher, onNavigateToApp, onOpenMonitorChat }) => {
  const [activeTab, setActiveTab] = useState<'merchants' | 'users' | 'financial' | 'monitoring' | 'suggestions'>('financial');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [suggestions, setSuggestions] = useState<AppSuggestion[]>([]);

  useEffect(() => {
    if(activeTab === 'merchants') loadMerchants();
    if(activeTab === 'users') loadUsers();
    if(activeTab === 'monitoring') loadMonitoring();
    if(activeTab === 'suggestions') loadSuggestions();
  }, [activeTab, searchTerm]);

  const loadMerchants = async () => { setLoading(true); setMerchants(await fetchAdminMerchants(searchTerm)); setLoading(false); };
  const loadUsers = async () => { setLoading(true); setUsers(await fetchAdminUsers(searchTerm)); setLoading(false); };
  const loadMonitoring = () => {
    const saved = localStorage.getItem('service_requests_mock');
    if (saved) setServiceRequests(JSON.parse(saved));
  };
  const loadSuggestions = () => {
    const saved = localStorage.getItem('app_suggestions_mock');
    if (saved) setSuggestions(JSON.parse(saved));
  };

  const updateSuggestionStatus = (id: string, status: AppSuggestion['status']) => {
    const updated = suggestions.map(s => s.id === id ? { ...s, status } : s);
    setSuggestions(updated);
    localStorage.setItem('app_suggestions_mock', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-6 sticky top-0 z-50 shadow-2xl shrink-0">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"><ShieldCheck size={24} className="text-white" /></div>
                <div><h1 className="font-black text-xl uppercase tracking-tighter text-white">Central Localizei</h1><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Painel Admin</p></div>
            </div>
            <div className="flex gap-2">
                <button onClick={onOpenViewSwitcher} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">Visão: {viewMode}</button>
                <button onClick={() => onNavigateToApp('home')} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></button>
                <button onClick={onLogout} className="p-2.5 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><LogOut size={20} /></button>
            </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
                { id: 'financial', label: 'Monitoramento', icon: LayoutDashboard },
                { id: 'merchants', label: 'Lojistas', icon: Store },
                { id: 'users', label: 'Usuários', icon: Users },
                { id: 'monitoring', label: 'Conversas', icon: MessageSquare },
                { id: 'suggestions', label: 'Sugestões', icon: Lightbulb },
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-fit px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#1E5BFF] text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </nav>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'financial' && <AdminFinancialDashboard />}
        
        {activeTab === 'monitoring' && (
            <div className="space-y-6">
                <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Monitoramento de Conversas</h2>
                    <p className="text-xs text-slate-500">Auditoria visual de todos os pedidos de serviço.</p>
                </div>
                <div className="grid gap-4">
                    {serviceRequests.length === 0 ? (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center"><MessageCircle size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma conversa ativa</p></div>
                    ) : serviceRequests.map(req => (
                        <div key={req.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-400"><Wrench size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-white leading-none mb-1">{req.serviceType}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-black">Cliente: {req.userName} • {req.neighborhood}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onOpenMonitorChat(req.id)}
                                className="bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Inspecionar Chat
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'suggestions' && (
            <div className="space-y-6">
                <div className="flex flex-col gap-1 px-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">Sugestões de Melhoria</h2>
                    <p className="text-xs text-slate-500">O que os moradores estão pedindo.</p>
                </div>
                <div className="grid gap-4">
                    {suggestions.length === 0 ? (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center">
                            <Lightbulb size={48} className="mb-4 text-slate-700" />
                            <p className="font-bold uppercase tracking-widest text-xs">Nenhuma sugestão recebida</p>
                        </div>
                    ) : (
                        suggestions.map(sug => {
                            return (
                                <div key={sug.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                                                {sug.category === 'bug' ? <Bug size={20}/> : <Lightbulb size={20}/>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white leading-none mb-1">{sug.subject}</h4>
                                                <p className="text-[9px] text-slate-500 uppercase font-black">Por: {sug.userName} • {new Date(sug.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <select 
                                            value={sug.status} 
                                            onChange={(e) => updateSuggestionStatus(sug.id, e.target.value as any)}
                                            className={`text-[8px] font-black uppercase px-2 py-1 rounded-md border bg-transparent outline-none ${
                                                sug.status === 'new' ? 'text-blue-400 border-blue-500/30' :
                                                sug.status === 'analyzing' ? 'text-amber-400 border-amber-500/30' :
                                                'text-emerald-400 border-emerald-500/30'
                                            }`}
                                        >
                                            <option value="new">Novo</option>
                                            <option value="analyzing">Em análise</option>
                                            <option value="responded">Respondido</option>
                                        </select>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">"{sug.message}"</p>
                                    <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            {sug.contactConsent ? (
                                                <span className="text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-1"><CheckCircle2 size={10}/> Aceita contato</span>
                                            ) : (
                                                <span className="text-[8px] font-bold text-slate-600 uppercase">Não quer contato</span>
                                            )}
                                        </div>
                                        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Ver Perfil</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        )}

        {/* Lojistas view */}
        {activeTab === 'merchants' && (
           <div className="space-y-6">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Pesquisar lojista por nome ou e-mail..." 
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500 transition-all"
                />
             </div>
             <div className="grid gap-4">
                {merchants.map(m => (
                    <div key={m.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500"><Building size={20} /></div>
                            <div>
                                <h4 className="font-bold text-white leading-none mb-1">{m.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{m.profiles?.email || 'N/A'}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-700" />
                    </div>
                ))}
             </div>
           </div>
        )}

        {/* Usuários view */}
        {activeTab === 'users' && (
           <div className="space-y-6">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Pesquisar usuário..." 
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-blue-500 transition-all"
                />
             </div>
             <div className="grid gap-4">
                {users.map(u => (
                    <div key={u.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500"><UserIcon size={20} /></div>
                            <div>
                                <h4 className="font-bold text-white leading-none mb-1">{u.full_name || 'Anônimo'}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{u.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-emerald-400 uppercase">R$ 0,00</p>
                           <p className="text-[8px] text-slate-600 font-bold uppercase">Saldo Cashback</p>
                        </div>
                    </div>
                ))}
             </div>
           </div>
        )}
      </main>
    </div>
  );
};
