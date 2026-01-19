
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Store, BarChart3, History, Eye, Search, 
  ArrowLeft, Download, Filter, TrendingUp, AlertTriangle, 
  Clock, DollarSign, Calendar, ChevronRight, LayoutDashboard,
  CheckCircle, XCircle, LogOut
} from 'lucide-react';
import { getAdminGlobalMetrics, fetchAdminMerchants, fetchAdminUsers, fetchAdminLedger } from '../backend/services';

interface AdminPanelProps {
  user: any;
  onLogout: () => void;
  viewMode: string;
  onOpenViewSwitcher: () => void;
  onNavigateToApp: () => void;
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
  const [activeTab, setActiveTab] = useState<'metrics' | 'merchants' | 'users' | 'ledger'>('metrics');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({ totalGenerated: 0, totalUsed: 0, totalExpired: 0 });
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab, searchTerm]);

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
                <button onClick={onNavigateToApp} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
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
        {activeTab !== 'metrics' && (
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

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Carregando Auditoria...</p>
            </div>
        ) : (
          <>
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
