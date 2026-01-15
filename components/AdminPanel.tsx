
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  LogOut,
  Mail,
  Zap,
  Globe,
  Lock,
  Eye,
  DollarSign,
  ArrowLeft,
  Presentation,
  Target,
  Layers,
  Repeat,
  BarChart3,
  ChevronDown,
  User as UserIcon,
  EyeOff,
  Check,
  X,
  ArrowUpRight,
  Activity,
  Cpu,
  Server,
  Bell,
  ShieldAlert
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onNavigateToApp: (requestedRole?: string) => void;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

type AdminView = 'dashboard' | 'operations' | 'monetization_model';
type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

const KPICard: React.FC<{ icon: any, label: string, value: string }> = ({ icon: Icon, label, value }) => (
  <div className="bg-[#111827] p-6 flex flex-col items-center justify-center text-center h-36 border border-white/5 shadow-xl rounded-2xl">
    <div className="w-10 h-10 flex items-center justify-center bg-white/5 text-white mb-4 rounded-xl">
      <Icon size={20} />
    </div>
    <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-1.5">{label}</p>
    <p className="text-2xl font-black text-white leading-none tracking-tighter">{value}</p>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigateToApp, onLogout }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [viewMode, setViewMode] = useState<RoleMode>(() => {
    return (localStorage.getItem('admin_view_mode') as RoleMode) || 'ADM';
  });
  const [isRoleSheetOpen, setIsRoleSheetOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_view_mode', viewMode);
  }, [viewMode]);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 flex items-center justify-center mb-4 rounded-2xl">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tighter">403 - Negado</h1>
        <p className="text-gray-500 mb-6 max-w-xs text-xs">Acesso restrito ao administrador.</p>
        <button onClick={() => onNavigateToApp()} className="bg-gray-900 text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
          Voltar para o App
        </button>
      </div>
    );
  }

  const handleRoleSwitch = (role: RoleMode) => {
    setViewMode(role);
    setIsRoleSheetOpen(false);
  };

  const isAuthorized = (view: AdminView) => {
    if (viewMode === 'ADM') return true;
    if (view === 'monetization_model' && viewMode === 'Visitante') return true;
    return false;
  };

  const roles: { id: RoleMode; label: string; desc: string; icon: any }[] = [
    { id: 'ADM', label: 'Administrador', desc: 'Acesso total e controle operacional.', icon: ShieldCheck },
    { id: 'Usuário', label: 'Usuário', desc: 'Simula visão do morador/cliente.', icon: UserIcon },
    { id: 'Lojista', label: 'Lojista', desc: 'Simula visão do dono de negócio.', icon: Store },
    { id: 'Visitante', label: 'Visitante', desc: 'Simula experiência externa/investidor.', icon: EyeOff },
  ];

  const RestrictedView = () => (
    <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/10 text-amber-500">
            <ShieldAlert size={40} />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Acesso Restrito ao Modo ADM</h2>
        <p className="text-gray-500 text-sm max-w-xs text-center leading-relaxed mb-8">
            Você está visualizando o painel como <span className="text-white font-bold">{viewMode}</span>. 
            Alterne para o modo <span className="text-indigo-400 font-bold">Administrador</span> para liberar estas ferramentas.
        </p>
        <button 
            onClick={() => handleRoleSwitch('ADM')}
            className="bg-white text-[#0F172A] px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
            Restaurar Acesso ADM
        </button>
    </div>
  );

  const Header = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
    const isDark = theme === 'dark';
    return (
      <header className={`px-6 py-8 flex items-center justify-between shrink-0 border-b transition-all sticky top-0 z-50 ${
        isDark ? 'bg-[#111827] border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 flex items-center justify-center shadow-lg rounded-2xl transition-colors ${
            isDark ? 'bg-white text-[#0F172A]' : 'bg-slate-900 text-white'
          }`}>
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className={`font-black text-xl uppercase tracking-tighter leading-none ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {activeView === 'dashboard' ? 'Painel Gestor' : 
               activeView === 'operations' ? 'Centro de Operações' : 'Projeção Financeira'}
            </h1>
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mt-2.5 ${
              isDark ? 'text-[#9CA3AF]' : 'text-indigo-600'
            }`}>
              Localizei JPA Enterprise v2.4
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
              onClick={() => setIsRoleSheetOpen(true)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-3 border transition-all active:scale-95 group ${
                isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
              }`}
          >
              <div className="flex flex-col items-end">
                <span className={`text-[8px] font-black uppercase tracking-widest leading-none mb-0.5 ${isDark ? 'text-[#9CA3AF]' : 'text-slate-500'}`}>Visualização</span>
                <span className={`text-xs font-bold uppercase tracking-tight ${viewMode !== 'ADM' ? 'text-amber-500' : ''}`}>{viewMode}</span>
              </div>
              <ChevronDown size={16} className={isDark ? 'text-[#9CA3AF]' : 'text-slate-400'} />
          </button>

          <button onClick={onLogout} className={`p-3 transition-colors border rounded-xl ${
            isDark ? 'text-[#9CA3AF] hover:text-red-500 bg-white/5 border-white/10' : 'text-slate-400 hover:text-red-500 bg-slate-50 border-slate-200'
          }`}>
            <LogOut size={22} />
          </button>
        </div>
      </header>
    );
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-10">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={Users} label="Base Ativa" value="2.842" />
          <KPICard icon={Store} label="Lojistas" value="156" />
          <KPICard icon={DollarSign} label="Projeção" value="R$ 43k" />
          <KPICard icon={TrendingUp} label="Crescimento" value="+412" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <button 
            onClick={() => setActiveView('monetization_model')}
            className="bg-[#111827] text-white p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border border-white/5 shadow-2xl relative overflow-hidden rounded-[2.5rem]"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5BFF]/5 rounded-full blur-3xl"></div>
              <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-[#1E5BFF]/50 transition-colors">
                  <Presentation size={40} className="group-hover:text-[#1E5BFF] transition-colors" />
              </div>
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-3">Projeção Financeira</h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-[240px] mx-auto">Relatório analítico de teto de faturamento para investidores externos.</p>
              </div>
              <div className="flex items-center gap-3 text-[#1E5BFF] text-[12px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b-2 border-[#1E5BFF] pb-1">
                  Ver Projeções <ArrowUpRight size={16} strokeWidth={3} />
              </div>
          </button>

          <button 
            onClick={() => setActiveView('operations')}
            className="bg-[#111827] text-white p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border border-white/5 shadow-2xl relative overflow-hidden rounded-[2.5rem]"
          >
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
              <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-emerald-500/50 transition-colors">
                  <Activity size={40} className="group-hover:text-emerald-500 transition-colors" />
              </div>
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-3">Centro de Operações</h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-[240px] mx-auto">Monitoramento em tempo real da rede e gestão de infraestrutura técnica.</p>
              </div>
              <div className="flex items-center gap-3 text-emerald-500 text-[12px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b-2 border-emerald-500 pb-1">
                  Gerenciar Rede <ChevronRight size={16} strokeWidth={3} />
              </div>
          </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Zap, label: 'Push Global' },
            { icon: Globe, label: 'Broadcast' },
            { icon: Mail, label: 'Newsletter' },
            { icon: Search, label: 'Audit Logs' }
          ].map((act, i) => (
            <button key={i} className="bg-[#111827] p-8 flex flex-col items-center gap-4 border border-white/5 active:bg-white active:text-[#0F172A] transition-all group shadow-lg rounded-2xl">
                <act.icon className="text-[#9CA3AF] group-active:text-[#0F172A]" size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] group-active:text-[#0F172A]">{act.label}</span>
            </button>
          ))}
      </div>
    </div>
  );

  const renderOperations = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-8">
      <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-2.5 bg-white/5 text-[#9CA3AF] hover:text-white transition-colors border border-white/10 rounded-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Status do Sistema</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Cloud Servers', value: 'Online', status: 'healthy', icon: Server },
            { label: 'Core API', value: '99.9% uptime', status: 'healthy', icon: Cpu },
            { label: 'Push Gateway', value: 'Operational', status: 'healthy', icon: Zap }
          ].map((sys, i) => (
            <div key={i} className="bg-[#111827] p-6 border border-white/5 rounded-3xl flex items-center gap-5">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sys.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  <sys.icon size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{sys.label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{sys.value}</p>
               </div>
            </div>
          ))}
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8">
          <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Últimas Requisições de Rede</h3>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-full animate-pulse">Live</span>
          </div>
          <div className="space-y-2">
              {[
                  { user: 'Visitante (Curicica)', act: 'GET /stores', time: 'Agora' },
                  { user: 'Lojista (Hamburgueria)', act: 'POST /vouchers', time: '1s atrás' },
                  { user: 'Admin (Master)', act: 'UPDATE /kpis', time: '3s atrás' }
              ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-[#1E5BFF]/30 transition-all">
                      <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                             <Activity size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{log.user}</p>
                            <p className="text-[9px] font-black text-indigo-400 uppercase font-mono mt-0.5">{log.act}</p>
                          </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{log.time}</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );

  const renderMonetizationModel = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-12 pb-32 text-slate-900">
      <div className="flex items-center gap-5 mb-8">
        <button 
          onClick={() => setActiveView('dashboard')}
          className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 transition-colors border border-slate-200 shadow-sm rounded-xl"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Análise de Investimento</h2>
      </div>

      <section>
        <div className="bg-white p-8 border border-slate-200 shadow-sm rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-5">
                <Globe size={16} className="text-indigo-600" />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Visão Estratégica</h3>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed font-medium max-w-2xl">
              Marketplace hyperlocal escalável. O modelo de receita foca em <span className="text-slate-900 font-bold">densidade de dados e visibilidade</span>, gerando valor direto para o lojista com custo de aquisição (CAC) otimizado.
            </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 border border-slate-200 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] mb-3">01. Micro-Ads Bairro</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">Segmentação geográfica por CEP e comportamento regional.</p>
              </div>
              <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Capacidade</span>
                  <span className="text-lg font-black text-slate-900">36 Slots</span>
              </div>
          </div>

          <div className="bg-white p-8 border border-slate-200 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] mb-3">02. Lead Generation</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">Conversão direta de solicitações para profissionais verificados.</p>
              </div>
              <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Custo Lead</span>
                  <span className="text-lg font-black text-slate-900">R$ 3,90</span>
              </div>
          </div>
      </div>

      <section>
          <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start text-white/30 mb-2">
                    <BarChart3 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Finance Projection</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Projeção Bruta Mensal</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Cenário Jacarepaguá v1.1.2</p>
            </div>
            <div className="text-center md:text-right">
                <div className="flex items-baseline justify-center md:justify-end gap-1">
                    <span className="text-2xl font-black text-emerald-400">R$</span>
                    <h2 className="text-8xl font-black tracking-tighter text-emerald-400 leading-none tabular-nums">43.060</h2>
                </div>
            </div>
          </div>
      </section>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden relative transition-colors ${
        activeView === 'monetization_model' ? 'bg-[#F8FAFC]' : 'bg-[#0F172A] text-white'
    }`}>
      
      <Header theme={activeView === 'monetization_model' ? 'light' : 'dark'} />

      <main className="p-6 max-w-5xl mx-auto w-full flex-1">
        {isAuthorized(activeView) ? (
            <>
                {activeView === 'dashboard' && renderDashboard()}
                {activeView === 'operations' && renderOperations()}
                {activeView === 'monetization_model' && renderMonetizationModel()}
            </>
        ) : (
            <RestrictedView />
        )}
      </main>

      {/* ROLE SWITCHER MODAL (CENTERED) */}
      {isRoleSheetOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-6"
          onClick={() => setIsRoleSheetOpen(false)}
        >
            <div 
                className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-8 px-2">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white">Modo de Visualização</h2>
                        <p className="text-[10px] text-[#9CA3AF] font-black uppercase tracking-[0.2em] mt-1">Simular experiência de perfil</p>
                    </div>
                    <button onClick={() => setIsRoleSheetOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors -mt-2 -mr-2">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    {roles.map((role) => {
                        const isSelected = viewMode === role.id;
                        return (
                            <button
                                key={role.id}
                                onClick={() => handleRoleSwitch(role.id)}
                                className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all text-left relative overflow-hidden group
                                    ${isSelected 
                                        ? 'bg-white text-[#0F172A] border-white shadow-xl scale-[1.02]' 
                                        : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                                    ${isSelected ? 'bg-[#0F172A] text-white' : 'bg-white/5 text-[#9CA3AF] group-hover:text-white'}`}>
                                    <role.icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-[#0F172A]' : 'text-white'}`}>{role.label}</p>
                                    <p className={`text-[10px] font-medium leading-tight mt-0.5 ${isSelected ? 'text-[#0F172A]/60' : 'text-[#9CA3AF]'}`}>{role.desc}</p>
                                </div>
                                {isSelected && (
                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Check size={14} strokeWidth={4} className="text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                <p className="text-center text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] mt-8 opacity-40">
                    Ambiente de Monitoramento Localizei JPA
                </p>
            </div>
        </div>
      )}

      <footer className="mt-auto py-12 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#9CA3AF]">Localizei JPA Enterprise 1.1.2</p>
      </footer>
    </div>
  );
};
