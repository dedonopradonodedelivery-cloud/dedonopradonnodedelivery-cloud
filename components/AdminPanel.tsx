
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Store, BarChart3, History, Eye, Search, 
  ArrowLeft, Download, Filter, TrendingUp, AlertTriangle, 
  Clock, DollarSign, Calendar, ChevronRight, LayoutDashboard,
  CheckCircle, XCircle, LogOut, Megaphone, User as UserIcon, Building, Flag, PauseCircle, Image as ImageIcon,
  Plus, Loader2, Heart, Share2, Phone, MousePointerClick, Tags, Check, X, Info, GitBranch,
  MessageSquare
} from 'lucide-react';
import { getAdminGlobalMetrics, fetchAdminMerchants, fetchAdminUsers, fetchAdminLedger } from '../backend/services';
import { supabase } from '../lib/supabaseClient';
import { TaxonomySuggestion } from '../types';

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
  const [activeTab, setActiveTab] = useState<'metrics' | 'merchants' | 'ledger' | 'taxonomy'>('metrics');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({ totalGenerated: 0, totalUsed: 0, totalExpired: 0 });
  const [merchants, setMerchants] = useState<any[]>([]);
  const [taxonomySuggestions, setTaxonomySuggestions] = useState<TaxonomySuggestion[]>([]);

  useEffect(() => { loadData(); }, [activeTab, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'metrics') setMetrics(await getAdminGlobalMetrics());
      if (activeTab === 'merchants') setMerchants(await fetchAdminMerchants(searchTerm));
      if (activeTab === 'taxonomy') {
          const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
          setTaxonomySuggestions(JSON.parse(saved).filter((s: TaxonomySuggestion) => s.status === 'pending'));
      }
    } finally { setLoading(false); }
  };

  const handleTaxonomyAction = (id: string, action: 'approved' | 'rejected') => {
      const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
      let suggestions = JSON.parse(saved);
      suggestions = suggestions.map((s: TaxonomySuggestion) => s.id === id ? { ...s, status: action } : s);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(suggestions));
      
      // Em produção, isso dispararia um trigger para atualizar as constantes ou banco
      alert(`O item foi ${action === 'approved' ? 'aprovado e inserido no fluxo' : 'rejeitado'}.`);
      setTaxonomySuggestions(prev => prev.filter(s => s.id !== id));
  };

  const formatBRL = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-6 sticky top-0 z-50 shadow-2xl shrink-0">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShieldCheck size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="font-black text-xl uppercase tracking-tighter text-white leading-none">Central Localizei</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Governança de Dados</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onOpenViewSwitcher} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20 transition-all">Visão: {viewMode}</button>
                <button onClick={() => onNavigateToApp('home')} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></button>
                <button onClick={onLogout} className="p-2.5 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"><LogOut size={20} /></button>
            </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
                { id: 'metrics', label: 'Métricas', icon: BarChart3 },
                { id: 'merchants', label: 'Lojistas', icon: Store },
                { id: 'taxonomy', label: 'Classificação', icon: GitBranch }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
                    className={`min-w-fit px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                >
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </nav>
      </header>

      <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sincronizando Dados...</p>
            </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {activeTab === 'taxonomy' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-3xl flex items-start gap-4">
                        <Info className="text-indigo-400 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-bold text-white text-sm">Governança de Taxonomia</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Mantenha a árvore de Categorias, Subcategorias e Especialidades limpa. Sugestões aprovadas entram em tempo real.</p>
                        </div>
                    </div>

                    {taxonomySuggestions.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-white/10">
                            <CheckCircle size={48} className="text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhuma sugestão aguardando revisão</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {taxonomySuggestions.map(sug => (
                                <div key={sug.id} className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 flex flex-col gap-5 shadow-2xl">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20"><GitBranch size={24} /></div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg leading-tight">{sug.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded-lg border border-white/5">{sug.type}</span>
                                                    {sug.parentName && <span className="text-[9px] text-slate-500 font-bold">Vínculo: {sug.parentName}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Sugerido por: {sug.storeName || 'Loja'}</span>
                                    </div>

                                    {sug.justification && (
                                        <div className="bg-slate-950 p-4 rounded-xl border border-white/5 italic text-xs text-slate-400">
                                            "{sug.justification}"
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-3">
                                        <button onClick={() => handleTaxonomyAction(sug.id, 'rejected')} className="flex-1 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 py-3.5 rounded-2xl border border-white/5 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"><X size={14} /> Rejeitar</button>
                                        <button onClick={() => handleTaxonomyAction(sug.id, 'approved')} className="flex-[2] bg-[#1E5BFF] hover:bg-[#1E5BFF]/90 text-white py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"><Check size={14} /> Aprovar e Ativar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                        <TrendingUp size={24} className="text-emerald-400 mb-4" />
                        <h2 className="text-4xl font-black text-white">{formatBRL(metrics.totalGenerated)}</h2>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-2">Cashback Gerado no Bairro</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                        <CheckCircle size={24} className="text-blue-400 mb-4" />
                        <h2 className="text-4xl font-black text-white">{formatBRL(metrics.totalUsed)}</h2>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-2">Créditos Resgatados</p>
                    </div>
                </div>
            )}
            
            {activeTab === 'merchants' && (
                <div className="space-y-4">
                     <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Buscar lojista por nome..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    {merchants.map(m => (
                        <div key={m.id} className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                                    <Store size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{m.name}</h4>
                                    <p className="text-xs text-slate-500">{m.category}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-700" />
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-amber-500/10 border-t border-amber-500/20 flex items-center justify-center gap-3 backdrop-blur-md">
          <AlertTriangle size={14} className="text-amber-500" />
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Segurança: Alterações na árvore de taxonomia são auditadas e irreversíveis.</p>
      </div>
    </div>
  );
};
