
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
  ShieldAlert, Copy, Check, Coins, ToggleLeft, ToggleRight,
  // FIX: Imported missing Info icon from lucide-react
  Info
} from 'lucide-react';
import { fetchAdminMerchants, fetchAdminUsers } from '../backend/services';
import { ServiceRequest, AppSuggestion } from '../types';
import { AdminModerationPanel } from './AdminModerationPanel';
import { AdminMonetizationView } from './AdminMonetizationView';
import { useFeatures, FeatureKey } from '../contexts/FeatureContext';

// --- SUB-COMPONENTS ---

const FeatureManagement: React.FC = () => {
    const { featureList, toggleFeature } = useFeatures();

    const sections = [
        { id: 'navigation', label: 'Abas de Navegação' },
        { id: 'growth', label: 'Crescimento e Anúncios' },
        { id: 'other', label: 'Outros Módulos' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {sections.map(section => {
                const items = featureList.filter(f => f.category === section.id);
                if (items.length === 0) return null;

                return (
                    <div key={section.id} className="space-y-4">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
                                {section.label}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {items.map(feature => (
                                <div key={feature.id} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group transition-all hover:border-blue-500/30 shadow-sm">
                                    <div className="space-y-1">
                                        <p className="font-bold text-white text-sm tracking-tight">{feature.label}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${feature.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                                            <p className={`text-[9px] font-black uppercase tracking-widest ${feature.active ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                {feature.active ? 'ATIVADO (ON)' : 'DESATIVADO (OFF)'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleFeature(feature.id)}
                                        className={`p-1 rounded-full transition-all active:scale-90 ${feature.active ? 'text-blue-500' : 'text-slate-700'}`}
                                    >
                                        {feature.active ? <ToggleRight size={44} strokeWidth={1.5} /> : <ToggleLeft size={44} strokeWidth={1.5} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            
            <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-[2.5rem] mt-12">
                <div className="flex gap-4">
                    {/* Info icon was previously undefined */}
                    <Info className="text-blue-400 shrink-0" size={20} />
                    <p className="text-xs text-blue-200/70 leading-relaxed">
                        <strong>Nota do Sistema:</strong> As alterações nas abas e módulos são aplicadas instantaneamente em todos os dispositivos sem necessidade de atualização da página ou do aplicativo.
                    </p>
                </div>
            </div>
        </div>
    );
};

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
    <button onClick={() => onSelect('features')} className="bg-blue-900/40 p-6 rounded-[2.5rem] border border-blue-500/30 shadow-xl hover:shadow-blue-500/10 transition-all text-left group col-span-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-blue-100 shadow-sm"><Zap size={24} fill="currentColor"/></div>
        <h3 className="font-black text-base text-white uppercase tracking-tight mb-1">Gerenciamento de Funcionalidades</h3>
        <p className="text-[11px] text-blue-200 leading-relaxed font-medium max-w-xs">Ligar/Desligar abas de navegação, blocos da Home e módulos do aplicativo em tempo real.</p>
        <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest">
            Acessar Controle <ChevronRight size={12} />
        </div>
    </button>
    <button onClick={() => onSelect('moderation')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group">
        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-red-100"><ShieldAlert size={20}/></div>
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
  </div>
);

// --- CORE COMPONENT ---

export const AdminPanel: React.FC<any> = ({ onLogout, viewMode, onOpenViewSwitcher, onNavigateToApp, onOpenMonitorChat, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'management' | 'financial' | 'monitoring' | 'suggestions' | 'conversations' | 'moderation' | 'monetization' | 'features'>(initialTab || 'hub');
  const [managementTab, setManagementTab] = useState<'clients' | 'merchants'>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'management') {
        if (managementTab === 'clients') loadUsers();
        else loadMerchants();
    }
  }, [activeTab, managementTab, searchTerm]);

  const loadMerchants = async () => { 
    const data = await fetchAdminMerchants(searchTerm);
    setMerchants(data); 
  };

  const loadUsers = async () => { 
    const data = await fetchAdminUsers(searchTerm);
    setUsers(data); 
  };

  const headerTitle = useMemo(() => {
      switch(activeTab) {
          case 'financial': return 'Finanças';
          case 'management': return 'Gerenciamento';
          case 'conversations': return 'Conversas';
          case 'monitoring': return 'Monitoramento';
          case 'suggestions': return 'Sugestões';
          case 'moderation': return 'Aprovações';
          case 'monetization': return 'Monetizações';
          case 'features': return 'Funcionalidades';
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
        
        {activeTab === 'hub' && <AdminHub onSelect={setActiveTab} />}

        {activeTab === 'features' && (
            <div className="space-y-6">
                <SectionHeader title="Controle de Recursos" onBack={() => setActiveTab('hub')} />
                <FeatureManagement />
            </div>
        )}

        {activeTab === 'moderation' && (
            <AdminModerationPanel onBack={() => setActiveTab('hub')} />
        )}

        {activeTab === 'monetization' && (
            <AdminMonetizationView onBack={() => setActiveTab('hub')} />
        )}
        
      </main>
    </div>
  );
};
