
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
  CheckCircle2,
  Calendar,
  Rocket,
  LineChart,
  ArrowUp
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
      {/* INVESTOR HEADER */}
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
              Evolução do Faturamento • Jacarepaguá v1.1.2
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

      <main className="p-8 max-w-5xl mx-auto w-full space-y-12 pb-32">
        
        {/* CENÁRIO 1: INAUGURAÇÃO (DETALHADO) */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
           <div className="flex items-center gap-2 mb-6">
              <Rocket className="text-indigo-600" size={20} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Cenário 1 — Inauguração (Meses 1 a 3)</h2>
           </div>
           
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ocupação Média</span>
                    <p className="text-sm font-bold text-slate-700">30% dos Slots</p>
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Política de Preços</span>
                    <p className="text-sm font-bold text-slate-700">Promocionais (Incentivo)</p>
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adoção</span>
                    <p className="text-sm font-bold text-slate-700">Lojistas Early Adopters</p>
                 </div>
              </div>

              <div className="p-0">
                 {[
                   { label: 'Patrocinador Master (Promo)', desc: 'Cota de impacto institucional', value: '2.500', icon: Crown, color: 'text-amber-500' },
                   { label: 'Banners Home', desc: '11 slots ativos x R$ 149 (30% ocupação)', value: '1.639', icon: LayoutGrid, color: 'text-blue-500' },
                   { label: 'Banners de Categorias', desc: '43 slots ativos x R$ 149 (30% ocupação)', value: '6.407', icon: PieChart, color: 'text-indigo-500' },
                   { label: 'Ads Recorrentes (Diários)', desc: 'Base inicial: 20 lojistas (Avg R$ 120/mês)', value: '2.400', icon: Zap, color: 'text-emerald-500' },
                   { label: 'Leads de Serviços', desc: 'Monetização transacional direta', value: '735', icon: Target, color: 'text-rose-500' },
                   { label: 'Cupons Promocionais', desc: 'Adoção inicial: 20 lojistas ativos', value: '792', icon: Percent, color: 'text-emerald-600' },
                   { label: 'JPA Connect', desc: '1 grupo de networking empresarial ativo', value: '3.000', icon: Users, color: 'text-indigo-600' }
                 ].map((item, i) => (
                   <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center ${item.color}`}>
                          <item.icon size={16} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 mr-1">R$</span>
                        <span className="text-sm font-black text-[#059669]">{item.value}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-8 bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div>
                    <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Total Faturamento Mensal (Inauguração)</h3>
                    <p className="text-white text-xs font-medium opacity-60">Maturação inicial de Jacarepaguá</p>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-[#059669]">R$</span>
                    <span className="text-5xl font-black text-[#059669] tracking-tighter tabular-nums">17.473</span>
                 </div>
              </div>
           </div>
        </section>

        {/* ROADMAP DE CRESCIMENTO */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 mb-2">
              <LineChart className="text-indigo-600" size={20} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Roadmap de Escalabilidade</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CENÁRIO 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Cenário 2</span>
                       <h3 className="text-lg font-black text-slate-900 mt-3 uppercase tracking-tight">Após Promoção</h3>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                       <ArrowUpRight size={20} />
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed mb-8">
                    A partir do 4º mês. Normalização de preços de tabela e expansão para 50% de ocupação.
                 </p>
                 <div className="flex items-baseline gap-2 pt-6 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400">R$</span>
                    <span className="text-3xl font-black text-slate-900 tabular-nums">49.000</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">/mês</span>
                 </div>
              </div>

              {/* CENÁRIO 3 - HIGHLIGHTED */}
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none"></div>
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <span className="text-[10px] font-black text-[#059669] uppercase tracking-widest bg-[#059669]/10 px-2 py-1 rounded">Cenário 3</span>
                       <h3 className="text-lg font-black text-white mt-3 uppercase tracking-tight">1 Ano de Operação</h3>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#059669]">
                       <TrendingUp size={20} />
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed mb-8">
                    Base consolidada com 70% de ocupação média e crescimento orgânico através de parcerias B2B.
                 </p>
                 <div className="flex items-baseline gap-2 pt-6 border-t border-white/5">
                    <span className="text-xs font-bold text-[#059669]">R$</span>
                    <span className="text-4xl font-black text-[#059669] tabular-nums">85.000<span className="text-lg ml-1 opacity-60">+</span></span>
                    <span className="text-[10px] font-bold text-[#059669]/60 uppercase ml-2 tracking-widest">/mês</span>
                 </div>
              </div>
           </div>
        </section>

        {/* THE BOTTOM LINE (INVESTOR MESSAGE) */}
        <section className="pt-6">
           <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                 <CheckCircle2 className="text-indigo-600" size={20} />
                 <h3 className="text-sm font-bold text-slate-900 uppercase">Mensagem para o Investidor</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                O Localizei JPA apresenta um roadmap financeiro sustentável: inicia com <strong>R$ 17 mil/mês</strong> em fase promocional, escala para <strong>R$ 49 mil/mês</strong> com a maturidade comercial e atinge o teto de <strong>R$ 85 mil/mês</strong> ao completar 1 ano. É um modelo de alta margem, low-asset e extremamente replicável para novos CEPs.
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                 <div className="flex items-center gap-1.5"><ArrowUp size={14} /> Receita Recorrente</div>
                 <div className="flex items-center gap-1.5"><Layers size={14} /> Escalabilidade Regional</div>
                 <div className="flex items-center gap-1.5"><Briefcase size={14} /> Modelo B2B/B2C</div>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-12 border-t border-slate-200 mt-auto text-center bg-white/50">
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
          <KPICard icon={DollarSign} label="Projeção" value="R$ 85k" isPositive />
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
                <p className="text-xs text-[#9CA3AF] font-bold leading-relaxed max-w-[240px] mx-auto">Relatório analítico de teto de faturamento e evolução de receita.</p>
              </div>
              <div className="flex items-center gap-3 text-[#059669] text-[10px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b border-[#059669]/30 pb-1">
                  Ver Evolução <ArrowUpRight size={14} strokeWidth={3} />
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
