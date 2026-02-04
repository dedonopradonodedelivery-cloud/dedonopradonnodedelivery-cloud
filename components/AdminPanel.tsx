
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Users, Store, History, Search, 
  ArrowLeft, Download, TrendingUp, AlertTriangle, 
  Clock, DollarSign, Calendar, LayoutDashboard,
  LogOut, User as UserIcon, Building, MessageSquare, 
  MessageCircle, Paintbrush, Wrench, CheckCircle2,
  ArrowUpRight, ArrowDownRight, PieChart, FileText,
  Zap, ChevronRight, Lightbulb, Bug, Activity,
  Settings, BarChart3, X, Filter, Newspaper, Crown,
  UserCheck, ArrowRightLeft, CreditCard,
  LayoutGrid, Home, Mail, Smartphone, BadgeCheck,
  ShieldAlert, Copy, Check, Coins
} from 'lucide-react';
import { fetchAdminMerchants, fetchAdminUsers } from '../backend/services';
import { ServiceRequest, AppSuggestion } from '../types';
import { AdminModerationPanel } from './AdminModerationPanel';
import { AdminMonetizationView } from './AdminMonetizationView';

// --- TYPES ---
type DateRangeOption = 'today' | '7d' | '30d' | '90d';
type MonetizationType = 'all' | 'sponsored' | 'banners' | 'master' | 'real_estate' | 'connect';

interface Transaction {
    id: string;
    date: string;
    type: MonetizationType;
    client: string;
    amount: number;
    status: 'paid' | 'pending';
}

const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800";

// --- MOCK DATA ---
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'TX-001', date: '2024-03-24T10:00:00Z', type: 'banners', client: 'Bibi Lanches', amount: 49.90, status: 'paid' },
    { id: 'TX-002', date: '2024-03-24T09:30:00Z', type: 'connect', client: 'Rodrigo Bessa', amount: 200.00, status: 'paid' },
    { id: 'TX-003', date: '2024-03-23T18:00:00Z', type: 'sponsored', client: 'Pet Shop Alegria', amount: 19.90, status: 'paid' },
    { id: 'TX-004', date: '2024-03-23T14:20:00Z', type: 'master', client: 'Grupo Esquematiza', amount: 1000.00, status: 'paid' },
    { id: 'TX-005', date: '2024-03-22T11:00:00Z', type: 'real_estate', client: 'Imobiliária JPA', amount: 99.90, status: 'paid' },
];

const MONETIZATION_CONFIG = {
    sponsored: { label: 'Patrocinados', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    banners: { label: 'Banners', icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-50' },
    master: { label: 'Patrocinador Master', icon: Crown, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    real_estate: { label: 'Planos Imóveis', icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    connect: { label: 'JPA Connect', icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
};

// --- SUB-COMPONENTS ---

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy} 
      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-blue-500"
      title="Copiar"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
};

const FinancialCard: React.FC<{ 
    type: keyof typeof MONETIZATION_CONFIG; 
    revenue: number; 
    salesCount: number; 
    pending?: number;
    onClick: () => void;
}> = ({ type, revenue, salesCount, pending, onClick }) => {
    const config = MONETIZATION_CONFIG[type];
    const Icon = config.icon;

    return (
        <button 
            onClick={onClick}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col group active:scale-[0.98]"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${config.bg} ${config.color} rounded-2xl flex items-center justify-center`}>
                    <Icon size={24} />
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-gray-300 group-hover:text-blue-500 transition-colors">
                    <ChevronRight size={18} />
                </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{config.label}</p>
            <p className="text-2xl font-black text-gray-900">R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500">{salesCount} vendas</span>
                {pending && pending > 0 ? (
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">{pending} pendentes</span>
                ) : (
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Em dia</span>
                )}
            </div>
        </button>
    );
};

const BannersDetailView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="animate-in slide-in-from-right duration-300 space-y-6">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="p-2 bg-white rounded-xl text-gray-400 border border-gray-200"><ArrowLeft size={20}/></button>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Detalhes: Banners</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { label: 'Banner Home', revenue: 12450.00, sales: 24, icon: Home },
                { label: 'Categorias', revenue: 8200.00, sales: 18, icon: LayoutGrid },
                { label: 'Subcategorias', revenue: 3500.00, sales: 12, icon: Filter },
                { label: 'Classificados', revenue: 2100.00, sales: 10, icon: Newspaper },
            ].map(item => (
                <div key={item.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><item.icon size={20}/></div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{item.label}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.sales} ativos</p>
                        </div>
                    </div>
                    <p className="text-lg font-black text-gray-900">R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
            ))}
        </div>
    </div>
);

const SubscriptionDetailView: React.FC<{ title: string, onBack: () => void }> = ({ title, onBack }) => (
    <div className="animate-in slide-in-from-right duration-300 space-y-8">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="p-2 bg-white rounded-xl text-gray-400 border border-gray-200"><ArrowLeft size={20}/></button>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Detalhes: {title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">MRR (Recorrência)</p>
                <p className="text-3xl font-black text-blue-600">R$ 14.200,00</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assinaturas Ativas</p>
                <p className="text-3xl font-black text-gray-900">72</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Churn Rate</p>
                <p className="text-3xl font-black text-rose-500">2.4%</p>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-900 uppercase">Movimentação da Base</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Últimos 30 dias</span>
            </div>
            <div className="divide-y divide-gray-50">
                {[
                    { label: 'Novas Assinaturas', value: '+12', color: 'text-emerald-500' },
                    { label: 'Renovações', value: '58', color: 'text-blue-500' },
                    { label: 'Cancelamentos', value: '-02', color: 'text-rose-500' },
                ].map(row => (
                    <div key={row.label} className="p-5 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">{row.label}</span>
                        <span className={`text-lg font-black ${row.color}`}>{row.value}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SectionHeader: React.FC<{ title: string; onBack: () => void; rightElement?: React.ReactNode }> = ({ title, onBack, rightElement }) => (
  <div className="flex items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-4">
        <button 
        onClick={onBack} 
        className="p-2 bg-white/5 rounded-xl text-slate-400 border border-white/10 hover:text-white transition-all active:scale-95 shadow-sm"
        >
        <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{title}</h2>
    </div>
    {rightElement}
  </div>
);

const AdminHub: React.FC<{ onSelect: (tab: any) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
    <button onClick={() => onSelect('moderation')} className="bg-red-50 p-5 rounded-3xl border border-red-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-red-100"><ShieldAlert size={20}/></div>
        <h3 className="font-black text-sm text-red-900 uppercase tracking-tighter mb-1">Aprovações</h3>
        <p className="text-[10px] text-red-700 leading-relaxed font-medium">Categorias, denúncias e reivindicações.</p>
    </button>
    <button onClick={() => onSelect('financial')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-100"><DollarSign size={20}/></div>
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter mb-1">Financeiro</h3>
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Gestão de faturamento, MRR e transações.</p>
    </button>
    <button onClick={() => onSelect('monetization')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-100"><Coins size={20}/></div>
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter mb-1">Monetizações</h3>
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Tabela de preços e fontes de receita.</p>
    </button>
    <button onClick={() => onSelect('management')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-100"><Users size={20}/></div>
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter mb-1">Gerenciamento</h3>
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Base de clientes e lojistas parceiros.</p>
    </button>
    <button onClick={() => onSelect('conversations')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-indigo-100"><MessageCircle size={20}/></div>
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter mb-1">Conversas</h3>
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Auditoria de chats de serviços.</p>
    </button>
    <button onClick={() => onSelect('suggestions')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-100"><Lightbulb size={20}/></div>
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter mb-1">Sugestões</h3>
        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Feedback dos moradores e melhorias.</p>
    </button>
  </div>
);

const MonitoringView: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" /> Atividade no Bairro
            </h3>
            <div className="space-y-4">
                {[
                    { label: 'Novos Cadastros', value: '+12', time: 'Última hora', color: 'text-blue-600' },
                    { label: 'Buscas Realizadas', value: '1.240', time: 'Hoje', color: 'text-slate-900' },
                    { label: 'Orçamentos Pedidos', value: '28', time: 'Hoje', color: 'text-indigo-600' },
                ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                        <div>
                            <p className="text-sm font-bold text-gray-700">{item.label}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.time}</p>
                        </div>
                        <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" /> Saúde das APIs
            </h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Latência Média</span>
                    <span className="text-sm font-black text-emerald-600">42ms</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Uptime Mensal</span>
                    <span className="text-sm font-black text-emerald-600">99.98%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">Carga CPU</span>
                    <span className="text-sm font-black text-blue-600">14%</span>
                </div>
            </div>
        </div>
    </div>
);

// --- MAIN FINANCIAL DASHBOARD ---

const AdminFinancialDashboard: React.FC = () => {
  const [range, setRange] = useState<DateRangeOption>('30d');
  const [detailView, setDetailView] = useState<MonetizationType | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<MonetizationType>('all');

  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') return MOCK_TRANSACTIONS;
    return MOCK_TRANSACTIONS.filter(t => t.type === transactionFilter);
  }, [transactionFilter]);

  if (detailView === 'banners') return <BannersDetailView onBack={() => setDetailView(null)} />;
  if (detailView === 'real_estate') return <SubscriptionDetailView title="Planos Imóveis" onBack={() => setDetailView(null)} />;
  if (detailView === 'connect') return <SubscriptionDetailView title="JPA Connect" onBack={() => setDetailView(null)} />;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
        
        {/* FILTROS E TOTAL */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-1 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
                {(['today', '7d', '30d', '90d'] as DateRangeOption[]).map(r => (
                    <button 
                        key={r} 
                        onClick={() => setRange(r)}
                        className={`px-5 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${range === r ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>
            <button className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <Download size={14}/> Exportar
            </button>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Receita Total no Período</p>
             <h2 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">R$ 42.850,00</h2>
             <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                <TrendingUp size={16} />
                <span className="text-xs font-black uppercase tracking-widest">+12.5% vs período anterior</span>
             </div>
          </div>
        </section>

        {/* HUB DE MONETIZAÇÃO */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-1">
            <PieChart size={18} className="text-blue-500" />
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Receita por Monetização</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FinancialCard type="sponsored" revenue={1245.50} salesCount={42} onClick={() => {}} />
             <FinancialCard type="banners" revenue={18950.00} salesCount={64} onClick={() => setDetailView('banners')} />
             <FinancialCard type="master" revenue={1000.00} salesCount={1} onClick={() => {}} />
             <FinancialCard type="real_estate" revenue={8450.00} salesCount={85} onClick={() => setDetailView('real_estate')} />
             <FinancialCard type="connect" revenue={14204.50} salesCount={72} onClick={() => setDetailView('connect')} />
          </div>
        </section>

        {/* ÚLTIMAS TRANSAÇÕES COM FILTRO */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-1">
            <div className="flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Últimas Transações</h3>
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
                {(['all', 'sponsored', 'banners', 'master', 'real_estate', 'connect'] as MonetizationType[]).map(t => (
                    <button 
                        key={t}
                        onClick={() => setTransactionFilter(t)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all whitespace-nowrap ${transactionFilter === t ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                        {t === 'all' ? 'Todas' : MONETIZATION_CONFIG[t as keyof typeof MONETIZATION_CONFIG].label}
                    </button>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
             {filteredTransactions.length > 0 ? filteredTransactions.map((tx, idx) => (
                 <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <CreditCard size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{tx.client}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                {new Date(tx.date).toLocaleDateString()} • {tx.type === 'all' ? '' : MONETIZATION_CONFIG[tx.type as keyof typeof MONETIZATION_CONFIG].label}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-gray-900">R$ {tx.amount.toFixed(2)}</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                    </div>
                 </div>
             )) : (
                 <div className="p-20 text-center flex flex-col items-center opacity-30">
                    <History size={48} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">Nenhuma transação encontrada</p>
                 </div>
             )}
          </div>
        </section>
    </div>
  );
};

// --- CORE COMPONENT ---

export const AdminPanel: React.FC<any> = ({ onLogout, viewMode, onOpenViewSwitcher, onNavigateToApp, onOpenMonitorChat }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'management' | 'financial' | 'monitoring' | 'suggestions' | 'conversations' | 'moderation' | 'monetization'>('hub');
  const [managementTab, setManagementTab] = useState<'clients' | 'merchants'>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [suggestions, setSuggestions] = useState<AppSuggestion[]>([]);
  const [showActiveResidentsOnly, setShowActiveResidentsOnly] = useState(false);

  useEffect(() => {
    if (activeTab === 'management') {
        if (managementTab === 'clients') loadUsers();
        else loadMerchants();
    }
    if(activeTab === 'conversations') loadMonitoring();
    if(activeTab === 'suggestions') loadSuggestions();
  }, [activeTab, managementTab, searchTerm]);

  const loadMerchants = async () => { 
    const data = await fetchAdminMerchants(searchTerm);
    const enriched = data.map(m => ({
        ...m,
        responsible: m.responsible || 'Responsável não informado',
        plan: m.plan || 'free',
        status: m.status || 'active',
        created_at: m.created_at || new Date().toISOString()
    }));
    setMerchants(enriched); 
  };

  const loadUsers = async () => { 
    const data = await fetchAdminUsers(searchTerm);
    const enriched = data.map(u => ({
        ...u,
        status: u.status || 'active',
        neighborhood: u.neighborhood || 'Jacarepaguá',
        created_at: u.created_at || new Date().toISOString(),
        isActiveResident: Math.random() > 0.8, 
        engagementScore: Math.floor(Math.random() * 100) 
    }));
    setUsers(enriched); 
  };

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

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    const isUsers = activeTab === 'management' && managementTab === 'clients';
    
    if (isUsers) {
      csvContent += "Nome,E-mail,Telefone,Bairro,Data de Cadastro,Status,Morador Ativo\n";
      users.forEach(u => {
        csvContent += `"${u.full_name || 'N/A'}","${u.email}","${u.phone || 'N/A'}","${u.neighborhood}","${new Date(u.created_at).toLocaleDateString()}","${u.status}","${u.isActiveResident ? 'Sim' : 'Não'}"\n`;
      });
    } else if (activeTab === 'management' && managementTab === 'merchants') {
      csvContent += "Nome da Loja,Responsável,E-mail,Telefone,Categoria,Plano,Status,Data de Cadastro\n";
      merchants.forEach(m => {
        csvContent += `"${m.name}","${m.responsible}","${m.profiles?.email || 'N/A'}","${m.phone || 'N/A'}","${m.category}","${m.plan}","${m.status}","${new Date(m.created_at).toLocaleDateString()}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_${activeTab}_${managementTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleActiveResidentBadge = (userId: string) => {
    setUsers(prev => prev.map(u => 
        u.id === userId 
        ? { ...u, isActiveResident: !u.isActiveResident } 
        : u
    ));
  };

  // EARLY RETURNS PARA COMPONENTES DE PÁGINA INTEIRA
  if (activeTab === 'moderation') {
      return <AdminModerationPanel onBack={() => setActiveTab('hub')} />;
  }

  if (activeTab === 'monetization') {
      return <AdminMonetizationView onBack={() => setActiveTab('hub')} />;
  }

  const filteredUsers = useMemo(() => {
    if (!showActiveResidentsOnly) return users;
    return users.filter(u => u.isActiveResident);
  }, [users, showActiveResidentsOnly]);

  const headerTitle = useMemo(() => {
      switch(activeTab) {
          case 'financial': return 'Finanças';
          case 'management': return 'Gerenciamento';
          case 'conversations': return 'Conversas';
          case 'monitoring': return 'Monitoramento';
          case 'suggestions': return 'Sugestões';
          default: return 'Central Localizei';
      }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      <header className="bg-[#0F172A] border-b border-white/10 px-6 py-6 sticky top-0 z-50 shadow-sm shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    {activeTab === 'hub' ? <ShieldCheck size={24} className="text-white" /> : (
                        <button onClick={() => setActiveTab('hub')} className="text-white hover:scale-110 transition-transform"><ArrowLeft size={24}/></button>
                    )}
                </div>
                <div>
                    <h1 className="font-black text-xl uppercase tracking-tighter text-white">
                        {headerTitle}
                    </h1>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Painel Administrativo</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onOpenViewSwitcher} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 border border-white/10 shadow-sm">Visão: {viewMode}</button>
                <button onClick={() => onNavigateToApp('home')} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95"><ArrowLeft size={20} /></button>
                <button onClick={onLogout} className="p-2.5 bg-rose-900/20 rounded-xl text-rose-500 hover:bg-rose-900/40 border border-rose-900/50 transition-all active:scale-95"><LogOut size={20} /></button>
            </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto no-scrollbar pb-32 max-w-7xl mx-auto w-full">
        
        {/* VIEW MANAGER */}
        {activeTab === 'hub' && <AdminHub onSelect={setActiveTab} />}

        {activeTab === 'monitoring' && (
            <>
                <SectionHeader title="Monitoramento do Dia" onBack={() => setActiveTab('hub')} />
                <MonitoringView />
            </>
        )}

        {activeTab === 'financial' && (
            <AdminFinancialDashboard />
        )}

        {activeTab === 'conversations' && (
            <div className="space-y-6">
                <SectionHeader title="Auditoria de Conversas" onBack={() => setActiveTab('hub')} />
                <div className="grid gap-4">
                    {serviceRequests.length === 0 ? (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center"><MessageCircle size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma conversa ativa</p></div>
                    ) : serviceRequests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors"><Wrench size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-none mb-1">{req.serviceType}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">Cliente: {req.userName} • {req.neighborhood}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onOpenMonitorChat(req.id)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
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
                <SectionHeader title="Sugestões dos Moradores" onBack={() => setActiveTab('hub')} />
                <div className="grid gap-4">
                    {suggestions.length === 0 ? (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center">
                            <Lightbulb size={48} className="mb-4 text-gray-200" />
                            <p className="font-bold uppercase tracking-widest text-xs">Nenhuma sugestão recebida</p>
                        </div>
                    ) : (
                        suggestions.map(sug => (
                            <div key={sug.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-500 border border-gray-100">
                                            {sug.category === 'bug' ? <Bug size={20}/> : <Lightbulb size={20}/>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-none mb-1">{sug.subject}</h4>
                                            <p className="text-[9px] text-gray-400 uppercase font-black">Por: {sug.userName} • {new Date(sug.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <select 
                                        value={sug.status} 
                                        onChange={(e) => updateSuggestionStatus(sug.id, e.target.value as any)}
                                        className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg border outline-none bg-gray-50 transition-all ${
                                            sug.status === 'new' ? 'text-blue-600 border-blue-100' :
                                            sug.status === 'analyzing' ? 'text-amber-600 border-amber-100' :
                                            'text-emerald-600 border-emerald-100'
                                        }`}
                                    >
                                        <option value="new">Novo</option>
                                        <option value="analyzing">Análise</option>
                                        <option value="responded">Resolvido</option>
                                    </select>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{sug.message}"</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {activeTab === 'management' && (
           <div className="space-y-6">
             <SectionHeader 
                title="Gerenciamento de Usuários" 
                onBack={() => setActiveTab('hub')} 
                rightElement={
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm active:scale-95 transition-all">
                        <Download size={14} /> Exportar CSV
                    </button>
                }
             />
             
             {/* Busca e Abas */}
             <div className="flex flex-col md:flex-row gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Buscar por nome ou e-mail..." 
                      className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                 </div>
                 <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm shrink-0">
                    <button 
                        onClick={() => setManagementTab('clients')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${managementTab === 'clients' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Clientes
                    </button>
                    <button 
                        onClick={() => setManagementTab('merchants')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${managementTab === 'merchants' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Lojistas
                    </button>
                 </div>
             </div>

             {/* Filtro Extra para Morador Ativo */}
             {managementTab === 'clients' && (
                 <div className="flex items-center gap-2 px-1">
                     <button 
                        onClick={() => setShowActiveResidentsOnly(!showActiveResidentsOnly)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${showActiveResidentsOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
                     >
                        <Zap size={10} className="inline mr-1" />
                        {showActiveResidentsOnly ? 'Mostrando apenas Moradores Ativos' : 'Filtrar Moradores Ativos'}
                     </button>
                 </div>
             )}

             {/* Lista de Clientes */}
             {managementTab === 'clients' && (
                 <div className="grid gap-4">
                    {filteredUsers.map(u => (
                        <div key={u.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors relative">
                                    <UserIcon size={20} />
                                    {u.isActiveResident && (
                                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                                            <Zap size={8} className="text-white fill-current" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{u.full_name || 'Anônimo'}</h4>
                                        {u.isActiveResident && <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wider border border-blue-100">Morador Ativo</span>}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Mail size={12} />
                                            <span>{u.email}</span>
                                            <CopyButton text={u.email} />
                                        </div>
                                        {u.phone && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 border-l border-gray-200 pl-3">
                                                <Smartphone size={12} />
                                                <span>{u.phone}</span>
                                                <CopyButton text={u.phone} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{u.neighborhood}</p>
                                        <span className="text-[10px] text-gray-300">•</span>
                                        <p className="text-[10px] text-gray-400 font-bold">Engajamento: {u.engagementScore || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex flex-col gap-2 items-end">
                               <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{u.status}</span>
                               <button 
                                    onClick={() => toggleActiveResidentBadge(u.id)}
                                    className={`text-[9px] font-bold uppercase tracking-wide hover:underline ${u.isActiveResident ? 'text-red-500' : 'text-blue-500'}`}
                                >
                                    {u.isActiveResident ? 'Revogar Selo' : 'Conceder Selo'}
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
             )}

             {/* Lista de Lojistas */}
             {managementTab === 'merchants' && (
                 <div className="grid gap-4">
                    {merchants.map(m => (
                        <div key={m.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:border-blue-500 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <Building size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{m.name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase font-black">{m.category} • {m.plan.toUpperCase()}</p>
                                    </div>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${m.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{m.status}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <UserIcon size={14} className="text-gray-300"/> 
                                    <span>{m.responsible}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail size={14} className="text-gray-300"/> 
                                    <span className="truncate">{m.profiles?.email || 'N/A'}</span>
                                    {m.profiles?.email && <CopyButton text={m.profiles.email} />}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Smartphone size={14} className="text-gray-300"/> 
                                    <span>{m.phone || 'N/A'}</span>
                                    {m.phone && <CopyButton text={m.phone} />}
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
             )}
           </div>
        )}
      </main>
    </div>
  );
};
