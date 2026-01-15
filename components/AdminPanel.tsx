
import React, { useState } from 'react';
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
  ShieldAlert,
  ArrowRight,
  Briefcase,
  PieChart,
  LayoutGrid,
  Crown
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  viewMode: string;
  onOpenViewSwitcher: () => void;
  onNavigateToApp: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

type AdminView = 'dashboard' | 'operations' | 'monetization_model';

const KPICard: React.FC<{ icon: any, label: string, value: string, isPositive?: boolean }> = ({ icon: Icon, label, value, isPositive }) => (
  <div className="bg-[#111827] p-6 flex flex-col items-center justify-center text-center h-36 border border-white/[0.04] shadow-md rounded-xl">
    <div className="w-10 h-10 flex items-center justify-center bg-[#0B3A53]/30 text-[#9CA3AF] mb-4 rounded-lg">
      <Icon size={20} strokeWidth={2} />
    </div>
    <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mb-1.5">{label}</p>
    <p className={`text-2xl font-black leading-none tracking-tighter ${isPositive ? 'text-[#059669]' : 'text-white'}`}>{value}</p>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout, viewMode, onOpenViewSwitcher, onNavigateToApp }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-[#111827] border border-white/[0.04] flex items-center justify-center mb-4 rounded-xl">
          <Lock className="w-8 h-8 text-[#9CA3AF]" />
        </div>
        <h1 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">403 - Negado</h1>
        <p className="text-[#9CA3AF] mb-6 max-w-xs text-xs font-medium">Acesso restrito ao administrador.</p>
        <button onClick={onNavigateToApp} className="bg-[#0B3A53] hover:bg-[#0B3A53]/80 text-white px-8 py-3 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all rounded-lg">
          Voltar para o App
        </button>
      </div>
    );
  }

  const renderMonetizationModel = () => (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans animate-in fade-in duration-500 flex flex-col">
      {/* INVESTOR HEADER - CLEAN & SOPHISTICATED */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all active:scale-90 border border-slate-200"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none uppercase">Projeção Financeira</h1>
              <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]">
                Investor Access
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
              Modelo de Receita • Jacarepaguá v1.1.2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visualização</span>
            <span className="text-[10px] font-black text-slate-900 uppercase">ADM</span>
            <ShieldCheck size={14} className="text-indigo-600" />
          </div>
        </div>
      </header>

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-24">
        
        {/* BLOCO: VISÃO ESTRATÉGICA - COMPACT & HIGH CONTRAST */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-indigo-600" size={20} />
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Visão Estratégica</h2>
                </div>
                <p className="text-xl font-semibold text-slate-800 leading-relaxed max-w-4xl tracking-tight">
                  Marketplace hiperlocal escalável. Modelo baseado em <span className="text-slate-950 font-black border-b-2 border-indigo-200">densidade de micro-ads</span> por bairro, gerando alta visibilidade, CAC otimizado e margens crescentes com infraestrutura técnica de baixo custo fixo.
                </p>
              </div>
           </div>
        </section>

        {/* BLOCO: MODELOS DE RECEITA - UNIFORM CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* MICRO-ADS */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="w-10 h-10 bg-slate-50 text-slate-900 border border-slate-100 rounded-xl flex items-center justify-center mb-5">
                  <LayoutGrid size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Micro-Ads de Bairro</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                  Monetização via espaços publicitários segmentados por geolocalização e comportamento de consumo regional.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                 <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Capacidade</span>
                   <p className="text-base font-black text-slate-900">36 Slots</p>
                 </div>
                 <div className="text-right">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receita Bruta Est.</span>
                   <p className="text-base font-black text-[#059669]">R$ 14.200,00</p>
                 </div>
              </div>
           </div>

           {/* LEAD GENERATION */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="w-10 h-10 bg-emerald-50 text-[#059669] border border-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Lead Generation</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                  Conversão direta de intenção de compra: receita por conexão entre solicitante e prestador verificado.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                 <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Custo por Lead</span>
                   <p className="text-base font-black text-slate-900">R$ 3,90</p>
                 </div>
                 <div className="text-right">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Volume Mensal</span>
                   <p className="text-base font-black text-[#059669]">R$ 8.500,00</p>
                 </div>
              </div>
           </div>
        </section>

        {/* BLOCO: PATROCINADOR MASTER - PREMIUM DARK REFINED */}
        <section>
           <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden border border-slate-800 shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-10 -mt-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-4">
                      <Crown size={18} className="text-amber-400" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-400/80">Premium Placement</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-2 uppercase leading-none">Patrocinador Master</h2>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                      Exclusividade institucional com visibilidade nativa em todas as camadas da jornada do usuário.
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                        <div className="px-3 py-1 bg-amber-400/10 rounded border border-amber-400/20 text-[9px] font-black text-amber-400 uppercase tracking-widest">
                        Cota Única
                        </div>
                        <div className="px-3 py-1 bg-emerald-400/10 rounded border border-emerald-400/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                        Disponível
                        </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-8 bg-black/30 p-6 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="text-center md:text-left">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Recorrência</span>
                      <p className="text-xl font-black text-white">R$ 4.000</p>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="text-center md:text-left">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">LTV Est. 12m</span>
                      <p className="text-xl font-black text-[#059669]">R$ 48.000</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* BLOCO: INVENTÁRIO DE CATEGORIAS - COMPACT LIST */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
             <div className="flex items-center gap-2">
                <PieChart size={18} className="text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Inventário por Nicho</h3>
             </div>
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Capacidade: 144 slots</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Food & Delivery', rev: '4.8k' },
               { label: 'Saúde & Wellness', rev: '3.2k' },
               { label: 'Serviços Pro', rev: '5.1k' },
               { label: 'Moda & Varejo', rev: '3.1k' }
             ].map((cat, i) => (
               <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-hover hover:border-slate-300">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2 truncate tracking-tight">{cat.label}</p>
                  <p className="text-lg font-black text-slate-900 leading-none">R$ {cat.rev}</p>
                  <div className="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[65%]" style={{ width: `${40 + (i * 15)}%` }}></div>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* BLOCO FINAL: PROJEÇÃO BRUTA - CLEAN & BOLD */}
        <section className="pt-4">
           <div className="bg-white p-10 rounded-2xl shadow-sm text-center relative overflow-hidden border border-slate-200">
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 border border-emerald-100">
                    <BarChart3 size={24} className="text-[#059669]" />
                 </div>
                 <h2 className="text-slate-900 text-lg font-black uppercase tracking-[0.3em] mb-4">Projeção Bruta Mensal</h2>
                 <div className="flex items-baseline justify-center gap-2 mb-2">
                   <span className="text-2xl font-black text-[#059669]">R$</span>
                   <h1 className="text-7xl font-black tracking-tighter text-[#059669] leading-none tabular-nums">43.060</h1>
                 </div>
                 <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                   Cenário Consolidado • Jacarepaguá
                 </p>
                 <div className="mt-10 flex flex-wrap justify-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-50 pt-8 w-full max-w-lg">
                    <div className="flex items-center gap-1.5"><Check size={14} className="text-[#059669]" /> Margem Alta</div>
                    <div className="flex items-center gap-1.5"><Check size={14} className="text-[#059669]" /> Escalabilidade</div>
                    <div className="flex items-center gap-1.5"><Check size={14} className="text-[#059669]" /> Hiperlocal</div>
                 </div>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-8 border-t border-slate-200 mt-auto text-center bg-white/50">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">Localizei JPA Enterprise 1.1.2</p>
      </footer>
    </div>
  );

  const Header = () => {
    return (
      <header className="px-6 py-6 flex items-center justify-between shrink-0 border-b border-white/[0.04] bg-[#0B3A53] shadow-2xl sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 flex items-center justify-center bg-white text-[#0B3A53] shadow-lg rounded-xl">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-lg uppercase tracking-tighter leading-none text-white">
              {activeView === 'dashboard' ? 'Painel Gestor' : 
               activeView === 'operations' ? 'Centro de Operações' : 'Projeção Financeira'}
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] mt-1.5 text-white/60">
              Localizei JPA Enterprise v2.4
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
              onClick={onOpenViewSwitcher}
              className="px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 group"
          >
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-widest leading-none mb-0.5 text-white/50">Visualização</span>
                <span className={`text-xs font-bold uppercase tracking-tight ${viewMode !== 'ADM' ? 'text-[#059669]' : ''}`}>{viewMode}</span>
              </div>
              <ChevronDown size={16} className="text-white/40" />
          </button>

          <button onClick={onLogout} className="p-3 transition-colors border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 bg-white/5">
            <LogOut size={20} />
          </button>
        </div>
      </header>
    );
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard icon={Users} label="Base Ativa" value="2.842" />
          <KPICard icon={Store} label="Lojistas" value="156" />
          <KPICard icon={DollarSign} label="Projeção" value="R$ 43k" isPositive />
          <KPICard icon={TrendingUp} label="Crescimento" value="+412" isPositive />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <button 
            onClick={() => setActiveView('monetization_model')}
            className="bg-[#111827] text-white p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border border-white/[0.04] shadow-2xl relative overflow-hidden rounded-[2.5rem] hover:bg-[#0B3A53]/20"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#059669]/5 rounded-full blur-3xl"></div>
              <div className="w-20 h-20 bg-[#0B3A53]/20 border border-white/[0.04] flex items-center justify-center text-white group-hover:border-[#059669]/50 transition-colors rounded-[2rem]">
                  <Presentation size={36} className="group-hover:text-[#059669] transition-colors" />
              </div>
              <div>
                <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Projeção Financeira</h3>
                <p className="text-xs text-[#9CA3AF] font-bold leading-relaxed max-w-[240px] mx-auto">Relatório analítico de teto de faturamento e monetização de dados.</p>
              </div>
              <div className="flex items-center gap-3 text-[#059669] text-[10px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b border-[#059669]/30 pb-1">
                  Ver Projeções <ArrowUpRight size={14} strokeWidth={3} />
              </div>
          </button>

          <button 
            onClick={() => setActiveView('operations')}
            className="bg-[#111827] text-white p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border border-white/[0.04] shadow-2xl relative overflow-hidden rounded-[2.5rem] hover:bg-[#0B3A53]/20"
          >
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#0B3A53]/10 rounded-full blur-3xl"></div>
              <div className="w-20 h-20 bg-[#0B3A53]/20 border border-white/[0.04] flex items-center justify-center text-white group-hover:border-[#0B3A53]/50 transition-colors rounded-[2rem]">
                  <Activity size={36} className="group-hover:text-[#9CA3AF] transition-colors" />
              </div>
              <div>
                <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Centro de Operações</h3>
                <p className="text-xs text-[#9CA3AF] font-bold leading-relaxed max-w-[240px] mx-auto">Monitoramento técnico da infraestrutura e logs de rede em tempo real.</p>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b border-white/10 pb-1">
                  Gerenciar Rede <ChevronRight size={14} strokeWidth={3} />
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
            <button key={i} className="bg-[#111827] p-8 flex flex-col items-center gap-4 border border-white/[0.04] hover:bg-[#0B3A53] transition-all group shadow-lg rounded-2xl">
                <act.icon className="text-[#9CA3AF] group-hover:text-white" size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] group-hover:text-white">{act.label}</span>
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
            className="p-2.5 bg-[#111827] text-[#9CA3AF] hover:text-white transition-colors border border-white/[0.04] rounded-xl"
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
            <div key={i} className="bg-[#111827] p-6 border border-white/[0.04] rounded-2xl flex items-center gap-5">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sys.status === 'healthy' ? 'bg-[#059669]/10 text-[#059669]' : 'bg-red-500/10 text-red-500'}`}>
                  <sys.icon size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{sys.label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{sys.value}</p>
               </div>
            </div>
          ))}
      </div>

      <div className="bg-[#111827] border border-white/[0.04] rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Requisições de Rede</h3>
              <span className="px-3 py-1 bg-[#059669]/10 text-[#059669] text-[10px] font-black uppercase tracking-widest border border-[#059669]/20 rounded-full animate-pulse">Live Monitoring</span>
          </div>
          <div className="space-y-2">
              {[
                  { user: 'Visitante (Curicica)', act: 'GET /stores', time: 'Agora' },
                  { user: 'Lojista (Hamburgueria)', act: 'POST /vouchers', time: '1s atrás' },
                  { user: 'Admin (Master)', act: 'UPDATE /kpis', time: '3s atrás' }
              ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#0F172A]/50 border border-white/[0.02] rounded-xl group hover:border-[#0B3A53] transition-all">
                      <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-[#0B3A53]/20 flex items-center justify-center text-[#9CA3AF]">
                             <Activity size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{log.user}</p>
                            <p className="text-[9px] font-black text-[#9CA3AF] uppercase font-mono mt-0.5">{log.act}</p>
                          </div>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF]/60 font-medium">{log.time}</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden relative transition-colors ${
        activeView === 'monetization_model' ? 'bg-[#F8FAFC]' : 'bg-[#0F172A] text-white'
    }`}>
      
      {activeView === 'monetization_model' ? renderMonetizationModel() : (
        <>
          <Header />
          <main className="p-8 max-w-6xl mx-auto w-full flex-1">
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'operations' && renderOperations()}
          </main>
          <footer className="mt-auto py-12 text-center opacity-30 border-t border-white/[0.02]">
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#9CA3AF]">Localizei JPA Enterprise 1.1.2</p>
          </footer>
        </>
      )}
    </div>
  );
};
