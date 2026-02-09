import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, LogOut, Zap, ChevronRight, 
  ArrowLeft, Coins, ToggleLeft, ToggleRight, Info,
  ShieldAlert, ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
// FIX: Imports pointing to root directory based on project structure
import { fetchAdminMerchants, fetchAdminUsers } from '../backend/services';
import { AdminModerationPanel } from './AdminModerationPanel';
import { AdminMonetizationView } from './AdminMonetizationView';
import { useFeatures, FeatureState } from '../contexts/FeatureContext';

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
                // FIX: Added explicit type to 'f'
                const items = featureList.filter((f: FeatureState) => f.category === section.id);
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
                            {/* FIX: Added explicit type to 'feature' */}
                            {items.map((feature: FeatureState) => (
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

const AdminHub: React.FC<{ onSelect: (tab: string) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
    <button onClick={() => onSelect('features')} className="bg-blue-900/40 p-6 rounded-[2.5rem] border border-blue-500/30 shadow-xl hover:shadow-blue-500/10 transition-all text-left group md:col-span-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-blue-100 shadow-sm"><Zap size={24} fill="currentColor"/></div>
        <h3 className="font-black text-base text-white uppercase tracking-tight">Gestor de Funcionalidades</h3>
        <p className="text-xs text-blue-200/70 mt-1">Ative ou desative módulos do app em tempo real.</p>
    </button>
    
    <button onClick={() => onSelect('moderation')} className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 hover:border-red-500/30 transition-all text-left group">
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 text-red-500 border border-red-500/20"><ShieldAlert size={24}/></div>
        <h3 className="font-black text-sm text-white uppercase tracking-tight">Moderação</h3>
        <p className="text-xs text-slate-400 mt-1">Denúncias e Sugestões.</p>
    </button>

    <button onClick={() => onSelect('monetization')} className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all text-left group">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 text-emerald-500 border border-emerald-500/20"><Coins size={24}/></div>
        <h3 className="font-black text-sm text-white uppercase tracking-tight">Monetização</h3>
        <p className="text-xs text-slate-400 mt-1">Preços e Produtos.</p>
    </button>
  </div>
);

interface AdminPanelProps {
  onLogout: () => void;
  viewMode: string;
  onOpenViewSwitcher: () => void;
  onNavigateToApp: (view: string, data?: any) => void;
  onOpenMonitorChat: (id: string) => void;
  initialTab?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onLogout, 
  viewMode, 
  onOpenViewSwitcher, 
  initialTab
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'hub');
  
  useEffect(() => {
    if(initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col animate-in fade-in duration-500">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
                <h1 className="font-black text-lg text-white">Painel ADM</h1>
                <p className="text-xs text-slate-500 font-medium">Localizei JPA v3.3</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={onOpenViewSwitcher} className="bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl border border-white/5">{viewMode}</button>
           <button onClick={onLogout} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl border border-white/5"><LogOut size={16}/></button>
        </div>
      </header>

      <main className="p-6 flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'hub' && <AdminHub onSelect={setActiveTab} />}
        
        {activeTab === 'features' && (
          <div>
            <SectionHeader title="Gestor de Funcionalidades" onBack={() => setActiveTab('hub')} />
            <FeatureManagement />
          </div>
        )}

        {activeTab === 'moderation' && (
          <div>
            <SectionHeader title="Moderação" onBack={() => setActiveTab('hub')} />
            <AdminModerationPanel onBack={() => setActiveTab('hub')} />
          </div>
        )}

        {activeTab === 'monetization' && (
          <div>
            <SectionHeader title="Monetização" onBack={() => setActiveTab('hub')} />
            <AdminMonetizationView onBack={() => setActiveTab('hub')} />
          </div>
        )}
      </main>
    </div>
  );
};