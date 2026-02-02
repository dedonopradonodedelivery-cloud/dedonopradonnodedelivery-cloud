
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Users, Store, History, Search, 
  ArrowLeft, Download, TrendingUp, AlertTriangle, 
  Clock, DollarSign, Calendar, LayoutDashboard,
  LogOut, User as UserIcon, Building, MessageSquare, 
  MessageCircle, Paintbrush, Wrench, CheckCircle2,
  ArrowUpRight, ArrowDownRight, PieChart, FileText,
  Zap, ChevronRight, Lightbulb, Bug, Activity,
  Settings, BarChart3, X
} from 'lucide-react';
import { fetchAdminMerchants, fetchAdminUsers } from '../backend/services';
import { ServiceRequest, AppSuggestion } from '../types';

// --- SUB-COMPONENTS FOR SPECIFIC TOPICS ---

const SectionHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button 
      onClick={onBack}
      className="p-2 bg-white rounded-xl text-gray-400 hover:text-gray-900 border border-gray-200 shadow-sm transition-all active:scale-95"
    >
      <ArrowLeft size={20} />
    </button>
    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{title}</h2>
  </div>
);

// --- 1. MONITORAMENTO (Saúde do Dia) ---
const MonitoringView: React.FC = () => {
    const todayRevenue = 450.90;
    const todayTransactions = 12;
    const todayPendencies = 3;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <DollarSign size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Receita Hoje</p>
                    <p className="text-3xl font-black text-gray-900">R$ {todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <CheckCircle2 size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transações</p>
                    <p className="text-3xl font-black text-gray-900">{todayTransactions}</p>
                </div>
                <div className={`p-8 rounded-[2.5rem] border shadow-sm ${todayPendencies > 0 ? 'bg-rose-50 border-rose-100' : 'bg-white border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${todayPendencies > 0 ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pendências</p>
                    <p className={`text-3xl font-black ${todayPendencies > 0 ? 'text-rose-600' : 'text-gray-900'}`}>{todayPendencies}</p>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6">Eficiência da Plataforma</h3>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Conversão Leads</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-black text-gray-900">24.8%</span>
                            <span className="text-emerald-500 text-xs font-bold mb-1">↑ 2.1%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">SLA Médio Chat</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-black text-gray-900">14 min</span>
                            <span className="text-rose-500 text-xs font-bold mb-1">↓ 3m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. FINANCEIRO (Gráficos e Extratos) ---
const FinancialView: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Faturamento Bruto Acumulado</p>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">R$ 425.800,00</h3>
                    </div>
                    <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        {['7d', '30d', '90d'].map(p => (
                            <button key={p} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg ${p === '30d' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>{p}</button>
                        ))}
                    </div>
                </div>
                {/* Simulação de gráfico simplificada para visual claro */}
                <div className="h-48 w-full bg-gray-50 rounded-2xl flex items-end justify-around p-4 gap-2">
                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-500 rounded-t-lg transition-all hover:brightness-110" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-sm font-black text-gray-900 uppercase">Últimas Transações</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400"><DollarSign size={18}/></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Loja Exemplo {i}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">Banner Home • PIX</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900">R$ 69,90</p>
                                <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">Pago</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- HUB COMPONENT ---
const AdminHub: React.FC<{ onSelect: (id: any) => void }> = ({ onSelect }) => {
    const cards = [
        { id: 'monitoring', label: 'Monitoramento', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'merchants', label: 'Lojistas', icon: Store, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'users', label: 'Usuários', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'conversations', label: 'Conversas', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'suggestions', label: 'Sugestões', icon: Lightbulb, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'financial', label: 'Financeiro', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {cards.map(card => (
                <button 
                    key={card.id}
                    onClick={() => onSelect(card.id)}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-6 group"
                >
                    <div className={`w-20 h-20 ${card.bg} rounded-[2rem] flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
                        <card.icon size={40} />
                    </div>
                    <span className="font-black text-gray-900 uppercase tracking-tighter text-lg">{card.label}</span>
                </button>
            ))}
        </div>
    );
};

export const AdminPanel: React.FC<any> = ({ onLogout, viewMode, onOpenViewSwitcher, onNavigateToApp, onOpenMonitorChat }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'merchants' | 'users' | 'financial' | 'monitoring' | 'suggestions' | 'conversations'>('hub');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [suggestions, setSuggestions] = useState<AppSuggestion[]>([]);

  useEffect(() => {
    if(activeTab === 'merchants') loadMerchants();
    if(activeTab === 'users') loadUsers();
    if(activeTab === 'conversations') loadMonitoring();
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
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-50 shadow-sm shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"><ShieldCheck size={24} className="text-white" /></div>
                <div><h1 className="font-black text-xl uppercase tracking-tighter text-gray-900">Central Localizei</h1><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Painel de Administração</p></div>
            </div>
            <div className="flex gap-2">
                <button onClick={onOpenViewSwitcher} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 border border-gray-200 shadow-sm">Visão: {viewMode}</button>
                <button onClick={() => onNavigateToApp('home')} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 border border-gray-200 transition-all active:scale-95"><ArrowLeft size={20} /></button>
                <button onClick={onLogout} className="p-2.5 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-100 border border-rose-100 transition-all active:scale-95"><LogOut size={20} /></button>
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
            <>
                <SectionHeader title="Visão Financeira" onBack={() => setActiveTab('hub')} />
                <FinancialView />
            </>
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

        {/* Lojistas view */}
        {activeTab === 'merchants' && (
           <div className="space-y-6">
             <SectionHeader title="Base de Lojistas" onBack={() => setActiveTab('hub')} />
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Pesquisar lojista por nome ou e-mail..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
             </div>
             <div className="grid gap-4">
                {merchants.map(m => (
                    <div key={m.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors"><Building size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 leading-none mb-1">{m.name}</h4>
                                <p className="text-[10px] text-gray-400 uppercase font-black">{m.profiles?.email || 'N/A'}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </div>
                ))}
             </div>
           </div>
        )}

        {/* Usuários view */}
        {activeTab === 'users' && (
           <div className="space-y-6">
             <SectionHeader title="Base de Usuários" onBack={() => setActiveTab('hub')} />
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  placeholder="Pesquisar usuário..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
             </div>
             <div className="grid gap-4">
                {users.map(u => (
                    <div key={u.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors"><UserIcon size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 leading-none mb-1">{u.full_name || 'Anônimo'}</h4>
                                <p className="text-[10px] text-gray-400 uppercase font-black">{u.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-emerald-600 uppercase">R$ 0,00</p>
                           <p className="text-[8px] text-gray-400 font-bold uppercase">Saldo Cashback</p>
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
