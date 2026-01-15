
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
  Crown,
  TrendingDown,
  Percent,
  CheckCircle2
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
      {/* EXECUTIVE INVESTOR HEADER */}
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
              <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]">
                Year 1 Snapshot
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
              Estado Atual • 12 Meses de Operação • v1.1.2
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

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8 pb-32">
        
        {/* VISÃO ESTRATÉGICA */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-indigo-600" size={20} />
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Visão Estratégica</h2>
                </div>
                <p className="text-xl font-semibold text-slate-800 leading-relaxed max-w-4xl tracking-tight">
                  Marketplace hiperlocal escalável com monetização baseada em <span className="text-slate-950 font-black border-b-2 border-indigo-200">densidade de micro-ads</span> por bairro. Modelo validado com infraestrutura de baixo custo fixo e crescimento orgânico controlado através de redes de networking B2B.
                </p>
              </div>
           </div>
        </section>

        {/* FONTES DE RECEITA - GRID ANALÍTICO */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Fluxos de Receita Mensal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. PATROCINADOR MASTER */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Crown size={20} />
                  </div>
                  <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">Cota Única</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Patrocinador Master</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">Exclusividade institucional em todas as interfaces. Valor pós-inauguração.</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">1 Unidade Ativa</div>
                <div className="text-xl font-black text-[#059669]">R$ 4.000,00</div>
              </div>
            </div>

            {/* 2. BANNERS HOME */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <LayoutGrid size={20} />
                  </div>
                  <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-wider">Ocupação 70%</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Banners Home (Bairro)</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">36 slots totais (4 por bairro x 9 bairros). Visibilidade máxima rotativa.</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">25 Slots × R$ 297</div>
                <div className="text-xl font-black text-[#059669]">R$ 7.425,00</div>
              </div>
            </div>

            {/* 3. BANNERS CATEGORIAS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <PieChart size={20} />
                  </div>
                  <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">Ocupação 70%</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Banners de Categorias</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">144 slots totais (16 por bairro). Segmentação por nicho de consumo.</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">101 Slots × R$ 297</div>
                <div className="text-xl font-black text-[#059669]">R$ 29.997,00</div>
              </div>
            </div>

            {/* 4. ADS RECORRENTES */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">80 Lojistas</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Ads Diários (Premium/Jobs)</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">Modelo freemium com upgrades diários. Ticket médio de R$ 120/mês.</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Base Ativa Est.</div>
                <div className="text-xl font-black text-[#059669]">R$ 9.600,00</div>
              </div>
            </div>

            {/* 5. JPA CONNECT */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between md:col-span-2">
              <div className="flex flex-col md:row items-start md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-4 text-amber-400">
                      <Users size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Networking Corporativo</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">JPA Connect (Year 1)</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Grupos de networking empresarial com 30 empresários cada. Fonte de receita de alta fidelidade e baixo churn.
                    </p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">10 Grupos × R$ 3.000</span>
                      <p className="text-3xl font-black text-[#059669]">R$ 30.000,00</p>
                    </div>
                </div>
              </div>
            </div>

            {/* 6. OUTROS (LEADS E CUPONS) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Leads de Serviços</h4>
                <p className="text-[10px] text-slate-500 mb-4">Custo por lead: R$ 4,90. Média de 5 prestadores/dia.</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#059669]">R$ 735,00</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Cupons Promocionais</h4>
                <p className="text-[10px] text-slate-500 mb-4">Adoção de 60 lojistas. R$ 39,60/mês por base.</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#059669]">R$ 2.376,00</span>
              </div>
            </div>

          </div>
        </section>

        {/* RESUMO CONSOLIDADO - THE BOTTOM LINE */}
        <section className="pt-10">
           <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-10 text-center relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#059669] to-transparent opacity-40"></div>
                 <div className="relative z-10 flex flex-col items-center">
                    <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Total Projetado (Mensal)</h2>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-2xl font-black text-[#059669]">R$</span>
                      <h1 className="text-7xl font-black tracking-tighter text-[#059669] leading-none tabular-nums">84.133</h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                      Cenário Conservador • Ano 1 Consolidado
                    </p>
                 </div>
              </div>
              
              <div className="bg-white p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 className="text-[#059669]" size={20} />
                    <h3 className="text-sm font-bold text-slate-900 uppercase">Mensagem para o Investidor</h3>
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                   Com 12 meses de operação e taxas de ocupação médias (70%), o Localizei JPA atinge a marca de aproximadamente <strong>R$ 85.000,00</strong> em faturamento recorrente. O modelo é altamente escalável para qualquer bairro, mantendo uma estrutura técnica centralizada de baixo custo fixo, o que garante margens líquidas robustas desde os primeiros estágios.
                 </p>
                 <div className="mt-8 flex flex-wrap gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-50 pt-8">
                    <div className="flex items-center gap-1.5"><Check size={14} className="text-[#059669]" /> Sem renovação automática</div>
                    <div className="flex items-center gap-1.5"><Check size={14} className="text-[#059669]" /> Pagamento Antecipado</div>
                    <div className="flex items-center gap-1.5"><Check size={14} className="text-[#059669]" /> Modelo Low-Asset</div>
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
