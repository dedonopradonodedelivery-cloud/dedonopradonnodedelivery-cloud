
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
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onNavigateToApp: (requestedRole?: string) => void;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const KPICard: React.FC<{ icon: any, label: string, value: string }> = ({ icon: Icon, label, value }) => (
  <div className="bg-[#111827] p-6 flex flex-col items-center justify-center text-center h-36 border border-white/5 shadow-xl">
    <div className="w-10 h-10 flex items-center justify-center bg-white/5 text-white mb-4">
      <Icon size={20} />
    </div>
    <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-1.5">{label}</p>
    <p className="text-2xl font-black text-white leading-none tracking-tighter">{value}</p>
  </div>
);

type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigateToApp, onLogout }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'monetization_model'>('dashboard');
  const [isRoleSheetOpen, setIsRoleSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<RoleMode>('ADM');

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 flex items-center justify-center mb-4">
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

  const roles: { id: RoleMode; label: string; desc: string; icon: any }[] = [
    { id: 'ADM', label: 'Administrador', desc: 'Controle total do sistema e projeções.', icon: ShieldCheck },
    { id: 'Usuário', label: 'Usuário', desc: 'Visão do morador, feed e cupons.', icon: UserIcon },
    { id: 'Lojista', label: 'Lojista', desc: 'Painel de vendas, ads e terminal.', icon: Store },
    { id: 'Visitante', label: 'Visitante', desc: 'Experiência de quem não tem conta.', icon: EyeOff },
  ];

  const handleRoleSwitch = (role: RoleMode) => {
    setViewMode(role);
    setIsRoleSheetOpen(false);
    localStorage.setItem('admin_view_override', role);
    
    if (role !== 'ADM') {
      setTimeout(() => onNavigateToApp(role), 300);
    }
  };

  const renderInvestorModel = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-12 bg-[#F8FAFC] min-h-screen pb-32 text-slate-900">
      {/* Executive Header - Light Theme */}
      <div className="flex items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 transition-colors border border-slate-200 shadow-sm rounded-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Projeção Financeira</h2>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.25em] mt-2">Modelo de Receita JPA v1.1.2</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-5 py-2.5 bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg">Investor Access</span>
        </div>
      </div>

      {/* Visão Estratégica - Light Theme */}
      <section className="px-6">
        <div className="bg-white p-8 border border-slate-200 shadow-sm rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-5">
                <Globe size={16} className="text-indigo-600" />
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Visão Estratégica</h3>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed font-medium max-w-2xl">
              Ecossistema de marketplace hyperlocal. O modelo escala via <span className="text-slate-900 font-bold">densidade de micro-ads</span> por bairro, operando com margens crescentes e infraestrutura técnica de baixo custo fixo.
            </p>
        </div>
      </section>

      {/* BLOCO 01 - Patrocinador Master */}
      <section className="px-6">
        <div className="bg-white p-8 border border-slate-200 rounded-[2rem] shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] mb-2">01. Patrocinador Master</h4>
              <p className="text-xl font-bold text-slate-900 max-w-md leading-snug">Exclusividade institucional em todas as interfaces de usuário.</p>
            </div>
            <span className="text-indigo-600 text-[9px] font-black uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1">Cota Única</span>
          </div>
          
          <div className="flex gap-12 items-end pt-4 border-t border-slate-100">
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Recorrência Mensal</p>
                <p className="text-5xl font-black text-indigo-600 tracking-tighter tabular-nums">R$ 4.000</p>
            </div>
            <div className="pb-1">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">LTV Estimado (12m)</p>
                <p className="text-2xl font-black text-slate-300 tabular-nums">R$ 48.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCOS 02 E 03 - Display */}
      <section className="px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 border border-slate-200 rounded-[2rem] shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] mb-3">02. Banners Home</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">9 microrregiões segmentadas por CEP do morador.</p>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Capacidade</span>
                        <span className="text-lg font-black text-slate-900">36 Slots</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Receita Bruta</span>
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">R$ 10.692</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 rounded-[2rem] shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] mb-3">03. Inventário Categorias</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">Ads por nicho com alta taxa de conversão (Intent Ads).</p>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Capacidade</span>
                        <span className="text-lg font-black text-slate-900">144 Slots</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Receita Bruta</span>
                        <span className="text-2xl font-black text-emerald-600 tabular-nums">R$ 28.368</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FINAL SUMMARY - INVESTOR STYLE */}
      <section className="px-6">
          <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start text-white/30 mb-2">
                    <BarChart3 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Finance Summary</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Total Potencial Mensal</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Base Jacarepaguá • Mídia Estática</p>
            </div>
            <div className="text-center md:text-right">
                <div className="flex items-baseline justify-center md:justify-end gap-1">
                    <span className="text-2xl font-black text-emerald-400">R$</span>
                    <h2 className="text-8xl font-black tracking-tighter text-emerald-400 leading-none tabular-nums">43.060</h2>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Teto Operacional v1.1</p>
            </div>
          </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden text-white relative">
      {/* Header Admin - Dark Graphite Only */}
      <header className="bg-[#111827] text-white px-6 py-8 flex items-center justify-between shrink-0 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white text-[#0F172A] flex items-center justify-center shadow-lg">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-xl uppercase tracking-tighter leading-none text-white">Centro de Operações</h1>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.25em] mt-2.5">Painel Gestor Localizei v2.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
              onClick={() => setIsRoleSheetOpen(true)}
              className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95"
          >
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none mb-0.5">Visualização</span>
                <span className="text-xs font-bold text-white uppercase tracking-tight">{viewMode}</span>
              </div>
              <ChevronDown size={16} className="text-[#9CA3AF]" />
          </button>

          <button onClick={onLogout} className="p-3 text-[#9CA3AF] hover:text-red-500 transition-colors bg-white/5 border border-white/10 rounded-xl">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto w-full space-y-10">
        
        {activeView === 'dashboard' ? (
          <>
            {/* Grid de KPIs - Dark Graphite */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard icon={Users} label="Base Ativa" value="2.842" />
                <KPICard icon={Store} label="Lojistas" value="156" />
                <KPICard icon={DollarSign} label="Projeção" value="R$ 43k" />
                <KPICard icon={TrendingUp} label="Crescimento" value="+412" />
            </section>

            {/* Gestão Central - Dark Graphite theme preserved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Botão Monetização - NOW DARK PREMIUM */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-[#111827] text-white p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5BFF]/5 rounded-full blur-3xl"></div>
                    <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center text-white rounded-none group-hover:border-[#1E5BFF]/50 transition-colors">
                        <Presentation size={40} className="group-hover:text-[#1E5BFF] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tighter mb-3">Modelo de Monetização</h3>
                      <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-[240px] mx-auto">Relatório analítico de teto de faturamento e projeção para investidores.</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#1E5BFF] text-[12px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b-2 border-[#1E5BFF] pb-1">
                        Ver Apresentação <ArrowUpRight size={16} strokeWidth={3} />
                    </div>
                </button>

                {/* Lista de Novas Lojas - Dark Graphite */}
                <div className="bg-[#111827] p-8 flex flex-col border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-8 px-1">
                        <div>
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">Aguardando Ativação</h3>
                          <p className="text-[10px] text-[#9CA3AF] mt-2 font-bold uppercase tracking-wider">Pedidos de novos lojistas</p>
                        </div>
                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div> 3 Novos
                        </span>
                    </div>
                    
                    <div className="space-y-1 flex-1">
                        {[
                            { name: 'Sushi Taquara', cat: 'Alimentação' },
                            { name: 'Dra. Ana Pet', cat: 'Saúde' },
                            { name: 'Mecânica JPA', cat: 'Autos' }
                        ].map((item, i) => (
                            <div key={i} className="px-4 py-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-[#9CA3AF] group-hover:text-white transition-colors">
                                        <Store size={22} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white tracking-tight leading-none mb-2">{item.name}</p>
                                        <p className="text-[10px] text-[#9CA3AF] uppercase font-black tracking-[0.15em]">{item.cat}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-white/10 group-hover:text-[#1E5BFF] transition-colors" size={24} />
                            </div>
                        ))}
                    </div>
                    
                    <button className="mt-10 py-5 text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.4em] text-center hover:text-white transition-colors border-t border-white/5">
                        Gerenciar todos os pedidos
                    </button>
                </div>
            </div>

            {/* Ações Rápidas - Dark Graphite */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Zap, label: 'Push Global' },
                  { icon: Globe, label: 'Broadcast' },
                  { icon: Mail, label: 'Newsletter' },
                  { icon: Search, label: 'Audit Logs' }
                ].map((act, i) => (
                  <button key={i} className="bg-[#111827] p-8 flex flex-col items-center gap-4 border border-white/5 active:bg-white active:text-[#0F172A] transition-all group shadow-lg">
                      <act.icon className="text-[#9CA3AF] group-active:text-[#0F172A]" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] group-active:text-[#0F172A]">{act.label}</span>
                  </button>
                ))}
            </div>
          </>
        ) : (
          renderInvestorModel()
        )}

      </main>

      <footer className="mt-auto py-12 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[#9CA3AF]">Localizei JPA Core Enterprise 1.1.2</p>
      </footer>
    </div>
  );
};
