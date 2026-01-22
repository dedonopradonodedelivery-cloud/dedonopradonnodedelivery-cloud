
import React, { useState, useEffect } from 'react';
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
  Tags,
  Check,
  X,
  // Fixed: Added Info icon import missing for line 326
  Info
} from 'lucide-react';
import { getAdminGlobalMetrics, fetchAdminMerchants, fetchAdminUsers, fetchAdminLedger } from '../backend/services';
import { supabase } from '../lib/supabaseClient';
import { TaxonomySuggestion } from '../types';

// --- BANNER PREVIEW COMPONENTS ---
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
  const [activeTab, setActiveTab] = useState<'metrics' | 'merchants' | 'users' | 'ledger' | 'taxonomy'>('metrics');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({ totalGenerated: 0, totalUsed: 0, totalExpired: 0 });
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [taxonomySuggestions, setTaxonomySuggestions] = useState<any[]>([]);

  useEffect(() => {
    if(view === 'dashboard') loadData();
  }, [activeTab, searchTerm, view]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'metrics') setMetrics(await getAdminGlobalMetrics());
      if (activeTab === 'merchants') setMerchants(await fetchAdminMerchants(searchTerm));
      if (activeTab === 'users') setUsers(await fetchAdminUsers(searchTerm));
      if (activeTab === 'ledger') setLedger(await fetchAdminLedger());
      if (activeTab === 'taxonomy') {
          const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
          setTaxonomySuggestions(JSON.parse(saved).filter((s: any) => s.status === 'pending'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaxonomyAction = (id: string, action: 'approved' | 'rejected') => {
      const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
      let suggestions = JSON.parse(saved);
      suggestions = suggestions.map((s: any) => s.id === id ? { ...s, status: action } : s);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(suggestions));
      
      if (action === 'approved') {
          alert("Sugestão aprovada! Em um sistema real, o item seria adicionado às tabelas oficiais agora.");
      }
      
      setTaxonomySuggestions(prev => prev.filter(s => s.id !== id));
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
                { id: 'merchants', label: 'Lojistas', icon: Store },
                { id: 'users', label: 'Usuários', icon: Users },
                { id: 'ledger', label: 'Auditoria', icon: History },
                { id: 'taxonomy', label: 'Taxonomia', icon: Tags }
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
        
        {activeTab !== 'metrics' && activeTab !== 'taxonomy' && (
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
                    </div>
                </div>
            )}

            {activeTab === 'taxonomy' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl flex items-start gap-4">
                        <Info className="text-blue-400 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white text-sm">Sugestões de Taxonomia</h4>
                            <p className="text-xs text-slate-400 mt-1">Lojistas sugeriram novas categorias para expansão da base de dados.</p>
                        </div>
                    </div>

                    {taxonomySuggestions.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
                            <CheckCircle size={48} className="text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhuma sugestão pendente</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {taxonomySuggestions.map(sug => (
                                <div key={sug.id} className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                                <Tags size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base">{sug.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-800 rounded border border-white/5">{sug.type}</span>
                                                    {sug.parentId && <span className="text-[9px] text-slate-500">Pai: {sug.parentId}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-medium">há 10 min</span>
                                    </div>
                                    
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building size={12} className="text-slate-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Sugestão de: {sug.storeName || 'Loja'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleTaxonomyAction(sug.id, 'rejected')}
                                            className="flex-1 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 py-3 rounded-xl border border-white/5 hover:border-rose-500/20 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={14} /> Rejeitar
                                        </button>
                                        <button 
                                            onClick={() => handleTaxonomyAction(sug.id, 'approved')}
                                            className="flex-[2] bg-[#1E5BFF] hover:bg-[#1E5BFF]/90 text-white py-3 rounded-xl shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={14} /> Aprovar e Adicionar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
