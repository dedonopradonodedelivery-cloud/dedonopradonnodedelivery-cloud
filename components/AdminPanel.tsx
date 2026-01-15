
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
  ArrowUp,
  Coins,
  Handshake,
  Dices,
  Sparkles,
  MapPin,
  Globe2,
  Mic,
  Building2,
  Info,
  Scale,
  Megaphone,
  ImageIcon,
  Flame,
  Milestone,
  History,
  PartyPopper
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

const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            backgroundColor: ['#1E5BFF', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#F472B6'][i % 6],
            top: '-5%',
            left: `${Math.random() * 100}%`,
            animation: `fall ${1.5 + Math.random() * 1.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            opacity: 1,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout, viewMode, onOpenViewSwitcher, onNavigateToApp }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-gradient-to-br from-[#111827] to-[#1e293b] border border-white/[0.04] flex items-center justify-center mb-4 rounded-xl">
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

  const handleCelebrate = () => {
    setShowWelcomeModal(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const renderMonetizationModel = () => (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans animate-in fade-in duration-500 flex flex-col">
      {/* INVESTOR HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all active:scale-90 border border-slate-200"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-sm sm:text-xl font-black tracking-tight text-slate-900 leading-none uppercase">Projeção Financeira</h1>
              <span className="bg-slate-900 text-white text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-[0.2em] whitespace-nowrap">
                Investor Access
              </span>
            </div>
            <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
              Evolução e Expansão • Jacarepaguá v1.1.2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
            <span className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest hidden xs:inline">Visualização</span>
            <span className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase">{viewMode === 'ADM' ? 'ADM' : 'INVEST'}</span>
            <ShieldCheck size={14} className="text-indigo-600" />
          </div>
        </div>
      </header>

      <main className="px-4 py-8 sm:p-8 max-w-5xl mx-auto w-full space-y-16 sm:space-y-20 pb-48">
        
        {/* CENÁRIO 1: INAUGURAÇÃO (RESUMO) */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
           <div className="flex items-center gap-2 mb-6">
              <Rocket className="text-indigo-600" size={20} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Cenário 1 — Inauguração (Meses 1 a 3)</h2>
           </div>
           
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
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

              <div className="p-0 overflow-x-hidden">
                 {[
                   { label: 'Patrocinador Master (Promo)', desc: 'Cota de impacto institucional', value: '2.500', icon: Crown, color: 'text-amber-500' },
                   { label: 'Banners Home', desc: '11 slots ativos (30% ocupação)', value: '1.639', icon: LayoutGrid, color: 'text-blue-500' },
                   { label: 'Banners de Categorias', desc: '43 slots ativos (30% ocupação)', value: '6.407', icon: PieChart, color: 'text-indigo-500' },
                   { label: 'Ads Recorrentes (Diários)', desc: 'Base inicial: 20 lojistas ativos', value: '2.400', icon: Zap, color: 'text-emerald-500' },
                   { label: 'Leads de Serviços', desc: 'Monetização transacional direta', value: '735', icon: Target, color: 'text-rose-500' },
                   { label: 'Cupons Promocionais', desc: 'Adoção inicial: 20 lojistas ativos', value: '792', icon: Percent, color: 'text-emerald-600' },
                   { label: 'JPA Connect', desc: '1 grupo de networking empresarial', value: '3.000', icon: Users, color: 'text-indigo-600' }
                 ].map((item, i) => (
                   <div key={i} className="px-4 sm:px-6 py-4 flex items-center gap-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className={`w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 ${item.color}`}>
                          <item.icon size={16} strokeWidth={2.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.label}</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate">{item.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 mr-1">R$</span>
                        <span className="text-sm sm:text-sm font-black text-[#059669]">{item.value}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-6 sm:p-8 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                 <div>
                    <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Total Faturamento Mensal (Inauguração)</h3>
                    <p className="text-white text-xs font-medium opacity-60">Maturação inicial de Jacarepaguá</p>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-[#059669]">R$</span>
                    <span className="text-4xl sm:text-5xl font-black text-[#059669] tracking-tighter tabular-nums">17.473</span>
                 </div>
              </div>
           </div>
        </section>

        {/* ROADMAP DE ESCALABILIDADE */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 mb-2">
              <LineChart className="text-indigo-600" size={20} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Roadmap de Escalabilidade</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Cenário 3</span>
                       <h3 className="text-lg font-black text-slate-900 mt-3 uppercase tracking-tight">1 Ano de Operação</h3>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                       <TrendingUp size={20} />
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed mb-8">
                    Base consolidada com 70% de ocupação média e crescimento orgânico conservador.
                 </p>
                 <div className="flex items-baseline gap-2 pt-6 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400">R$</span>
                    <span className="text-3xl font-black text-slate-900 tabular-nums">85.000<span className="text-lg ml-1 opacity-60">+</span></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">/mês</span>
                 </div>
              </div>
           </div>
        </section>

        {/* FASE V2 — NOVAS FRENTES DE MONETIZAÇÃO */}
        <section className="pt-8 space-y-12 animate-in fade-in duration-700 w-full">
           <div className="flex flex-col items-center text-center gap-6 border-b border-slate-200 pb-10 w-full">
              <div className="max-w-xl mx-auto flex flex-col items-center">
                 <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Fase V2 — Novas Frentes de Monetização</h2>
                 </div>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Alavancas estratégicas de crescimento escalável para maximizar o LTV (Life Time Value) dos parceiros e a eficiência do ecossistema.
                 </p>
              </div>
              <div className="bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100 shadow-sm shadow-indigo-100/50">
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">Expansion Mode</span>
              </div>
           </div>

           <div className="flex flex-col gap-6 w-full">
              {/* Cashback entre Lojas */}
              <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all group">
                 <div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <Handshake size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">Cashback entre Lojas</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                       Modelo de interoperabilidade: 1,99% de taxa de resgate sobre o valor transacionado no ecossistema.
                    </p>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl mb-6">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PREMISSAS DE CÁLCULO</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Base total estimada: 25.000 negócios na região</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Adoção conservadora: 5% da base (≈ 1.250 lojistas ativos)</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Faturamento médio por lojista: R$ 2.000 / mês</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Volume transacionado mensal: 1.250 × R$ 2.000 = R$ 2.500.000</p>
                       <div className="h-px bg-slate-200 my-1"></div>
                       <p className="text-[11px] text-slate-700 font-bold">• Taxa de resgate do cashback: 1,99% sobre o valor transacionado</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receita Est.</span>
                    <p className="text-lg font-black text-[#059669]">≈ R$ 49.750</p>
                 </div>
              </div>

              {/* Agência Localizei */}
              <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all group">
                 <div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <BarChart3 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">Agência Localizei</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                       Braço interno de performance digital e tráfego pago focado em resultados reais para lojistas locais.
                    </p>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl mb-6">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premissas</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Ticket médio: R$ 1.000/mês</p>
                       <p className="text-[11px] text-slate-600 font-medium">• 30 clientes ativos iniciais</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Expertise regional exclusiva</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receita Est.</span>
                    <p className="text-lg font-black text-[#059669]">≈ R$ 30.000</p>
                 </div>
              </div>

              {/* Plano Pet */}
              <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all group">
                 <div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <Percent size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">Plano Pet (Assinatura)</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                       Acesso premium a audiência segmentada e qualificada de donos de pets para ofertas direcionadas.
                    </p>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl mb-6">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premissas</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Valor: R$ 49,90/mês</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Universo: 500 lojistas pet</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Adoção alvo: 20% (100 contas)</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receita Est.</span>
                    <p className="text-lg font-black text-[#059669]">≈ R$ 4.990</p>
                 </div>
              </div>

              {/* Marketplace de Imóveis Comerciais */}
              <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all group">
                 <div>
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <Building2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">Marketplace de Imóveis Comerciais</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                       Plataforma proprietária para compra, venda e locação de salas e lojas, com busca segmentada por polos empresariais locais.
                    </p>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl mb-6">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Diferenciais</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Foco 100% não-residencial (B2B)</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Público qualificado (Lojistas/Investidores)</p>
                       <p className="text-[11px] text-slate-600 font-medium">• Hub completo do comércio local</p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receita Est.</span>
                    <p className="text-lg font-black text-slate-400 italic">Em validação</p>
                 </div>
              </div>

              {/* Podcast */}
              <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all group">
                 <div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <Mic size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">PodLocalizar</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                       Ecossistema de conteúdo proprietário com monetização via cotas de patrocínio por episódios.
                    </p>
                 </div>
                 <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receita Est.</span>
                    <p className="text-lg font-black text-slate-300 italic">Upside Estratégico</p>
                 </div>
              </div>

              {/* Note about Strategic Advice */}
              <div className="w-full bg-indigo-600 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                 <Info className="mb-4 opacity-50 shrink-0" size={24} />
                 <h4 className="text-sm font-black uppercase tracking-widest mb-3">Nota Estratégica</h4>
                 <p className="text-xs leading-relaxed font-medium">
                    Os itens marcados como upside representam alavancas a serem precificadas após validação de audiência e demanda orgânica do ecossistema.
                 </p>
              </div>
           </div>

           {/* TOTAL POTENCIAL V2 */}
           <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 w-full">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <TrendingUp className="text-indigo-400" size={28} />
                 </div>
                 <div className="min-w-0">
                    <h3 className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] mb-1">Total Adicional Estimado V2</h3>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-medium">Somatório das frentes de serviço e transacionais</p>
                 </div>
              </div>
              <div className="flex flex-wrap items-baseline justify-end gap-1 sm:gap-2 max-w-full w-full md:w-auto self-end md:self-auto px-1">
                 <span className="text-sm sm:text-lg font-black text-emerald-400">R$</span>
                 <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 tracking-tighter tabular-nums">84.740</span>
                 <span className="text-[8px] sm:text-[10px] font-black text-emerald-400/60 uppercase ml-1 sm:ml-2 tracking-widest whitespace-nowrap text-right">/mês</span>
              </div>
           </div>
        </section>

        {/* POTENCIAL DE EXPANSÃO GEOGRÁFICA */}
        <section className="pt-12 w-full">
           <div className="max-w-[420px] mx-auto w-full px-4 space-y-6">
              {/* Cabeçalho Seção */}
              <div className="text-center space-y-2">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                    <span className="text-2xl" role="img" aria-label="world">🌍</span>
                 </div>
                 <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">POTENCIAL DE EXPANSÃO GEOGRÁFICA</h2>
                 <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                    Modelo replicável por CEP, com baixa dependência de custo fixo e rápida maturação operacional.
                 </p>
              </div>

              {/* Card 1: Premissa */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                 <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400">R$</span>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">85.000</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ mês</span>
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-wider">
                    Premissa conservadora após 12 meses de operação por praça ativa.
                 </p>
              </div>

              {/* Card 2: Praças */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">14 Praças Estratégicas Mapeadas</h3>
                 <div className="grid grid-cols-2 gap-2">
                    {[
                      "Barra da Tijuca", "Recreio", "Zona Sul", "Centro", "Tijuca", "Méier",
                      "Ilha do Governador", "Niterói", "Duque de Caxias", "Nova Iguaçu",
                      "São João de Meriti", "Região dos Lagos", "Região Serrana", "Região Metropolitana"
                    ].map((praca, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 px-2 py-2 rounded-xl text-[9px] font-bold text-slate-600 text-center truncate">
                         {praca}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Faixa Informativa Inline */}
              <div className="bg-indigo-50/50 border-y border-indigo-100/50 py-4 px-2 text-center">
                 <p className="text-[10px] text-indigo-700 font-black leading-tight uppercase tracking-widest">
                    “Crescimento previsível e escalável, sem aumento proporcional da estrutura central.”
                 </p>
              </div>

              {/* Card Final: Consolidado */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">FATURAMENTO POTENCIAL CONSOLIDADO</p>
                 <div className="flex flex-col items-center gap-1 mb-4">
                    <div className="flex items-baseline justify-center gap-1.5">
                       <span className="text-sm font-black text-emerald-400">R$</span>
                       <h2 className="text-5xl font-black text-emerald-400 tracking-tighter tabular-nums leading-none">1.190.000</h2>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.2em]">/ mês</span>
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium">Baseado na ativação simultânea das 14 praças mapeadas.</p>
              </div>
           </div>
        </section>

        {/* APORTE MÍNIMO RECOMENDADO — CENÁRIO 1 */}
        <section className="w-full pt-8">
           <div className="max-w-[420px] mx-auto w-full px-4 space-y-8 flex flex-col items-center">
              
              {/* Título com ícone acima */}
              <div className="flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
                    <Coins className="text-indigo-600" size={24} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                    APORTE MÍNIMO<br/>
                    RECOMENDADO — CENÁRIO 1
                 </h2>
              </div>

              {/* Texto explicativo centralizado */}
              <p className="text-xs text-slate-500 font-medium text-center leading-relaxed max-w-[280px]">
                 “Recursos estratégicos para ativação operacional e validação de tração inicial da marca Localizei JPA.”
              </p>

              {/* Card — Aporte Necessário */}
              <div className="w-full max-w-[280px] bg-white border-2 border-indigo-600 rounded-[2rem] p-6 text-center shadow-xl shadow-indigo-100 flex flex-col items-center">
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Aporte Necessário</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-indigo-600">R$</span>
                    <h3 className="text-4xl font-black text-indigo-600 tracking-tighter">80.000</h3>
                 </div>
              </div>

              {/* Bloco — Ações Digitais (Grid 2x2) */}
              <div className="space-y-4 w-full">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AÇÕES DIGITAIS</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "MARKETING FULL", desc: "Estratégia multicanal agressiva" },
                      { title: "INFLUENCERS LOCAIS", desc: "Criadores regionais recorrentes" },
                      { title: "ANÚNCIOS MASSIVOS", desc: "Aquisição acelerada de usuários" },
                      { title: "PERFORMANCE & CAC", desc: "Otimização e escala previsível" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[100px] text-center">
                         <h4 className="text-[11px] font-black text-slate-900 uppercase leading-tight mb-1">{item.title}</h4>
                         <p className="text-[10px] text-slate-500 font-medium leading-tight">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Card Final — Resultado Esperado */}
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 w-full text-center relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-50"></div>
                 <div className="flex items-center justify-center gap-2 mb-3">
                    <CheckCircle2 className="text-emerald-400" size={18} />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">RESULTADO ESPERADO</h4>
                 </div>
                 <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    “Lançamento estruturado, validação do modelo de negócio e início do faturamento recorrente.”
                 </p>
              </div>

           </div>
        </section>

        {/* --- INVESTIMENTO IDEAL — ESCALA SAUDÁVEL (CENÁRIO 2) --- */}
        <section className="w-full">
           <div className="max-w-[420px] mx-auto w-full px-4 space-y-6 animate-in fade-in duration-700">
              
              {/* Cabeçalho da Seção */}
              <div className="text-left space-y-2">
                 <TrendingUp className="text-indigo-600 w-6 h-6" strokeWidth={3} />
                 <h2 className="text-xl font-black text-slate-900 uppercase leading-tight tracking-tight">
                    INVESTIMENTO IDEAL<br/>
                    <span className="text-indigo-600">ESCALA SAUDÁVEL</span>
                 </h2>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    “Aceleração massiva para garantir dominância regional e ocupação imediata de mercado.”
                 </p>
              </div>

              {/* Card — Aporte Recomendado */}
              <div className="bg-indigo-600 text-white rounded-[2rem] p-8 text-center shadow-xl shadow-indigo-200 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 opacity-80">APORTE RECOMENDADO</p>
                 <h3 className="text-4xl font-black tracking-tighter mb-4">R$ 200.000</h3>
                 <p className="text-[11px] font-medium opacity-90 leading-relaxed px-4">
                    “Estrutura ideal para crescimento acelerado e consolidação regional.”
                 </p>
              </div>

              {/* Bloco — Ações Digitais (Grid 2x2) */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AÇÕES DIGITAIS</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "Marketing Full", desc: "Estratégia multicanal agressiva" },
                      { title: "Influencers Locais", desc: "Criadores regionais recorrentes" },
                      { title: "Anúncios Massivos", desc: "Aquisição acelerada de usuários" },
                      { title: "Performance & CAC", desc: "Otimização e escala previsível" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[100px]">
                         <h4 className="text-[11px] font-black text-slate-900 uppercase leading-tight mb-1">{item.title}</h4>
                         <p className="text-[10px] text-slate-500 font-medium leading-tight">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Bloco — Ações Territoriais (Grid 2x2) */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AÇÕES TERRITORIAIS</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "Ativações Físicas", desc: "Presença visual em PDVs" },
                      { title: "Outdoors Estratégicos", desc: "Branding regional" },
                      { title: "Sala Comercial", desc: "Base fixa e estúdio próprio" },
                      { title: "Cloud VIP", desc: "Infra preparada para alta escala" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[100px]">
                         <h4 className="text-[11px] font-black text-slate-900 uppercase leading-tight mb-1">{item.title}</h4>
                         <p className="text-[10px] text-slate-500 font-medium leading-tight">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Card Final — Resultado Esperado */}
              <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                 <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">RESULTADO ESPERADO (ESCALA)</h4>
                 </div>
                 <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    “Reconhecimento total da marca, ocupação imediata de inventário e base consolidada para expansão geográfica.”
                 </p>
              </div>

           </div>
        </section>

        {/* ESTRUTURA DE APORTE EM FASES */}
        <section className="pt-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 opacity-5"></div>
              
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0">
                    <Milestone size={20} />
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">ESTRUTURA DE APORTE — 2 MOMENTOS</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Flexibilidade financeira e gestão de risco</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative max-w-2xl mx-auto">
                 {/* Timeline Line (Desktop) */}
                 <div className="hidden md:block absolute top-[52px] left-24 right-24 h-0.5 border-t-2 border-dashed border-slate-100 -z-0"></div>

                 {/* MOMENTO 1: T0 */}
                 <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-6 border-4 border-white">
                       <span className="font-black text-sm">T0</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-2">Aporte Inicial</h3>
                    <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                       <li className="flex items-start gap-2 justify-center">
                          <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1 shrink-0"></div>
                          Ajustes contratuais e pontapé inicial
                       </li>
                       <li className="flex items-start gap-2 justify-center">
                          <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1 shrink-0"></div>
                          Início imediato das ações de marketing
                       </li>
                    </ul>
                 </div>

                 {/* MOMENTO 2: +30 DIAS */}
                 <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm mb-6">
                       <span className="font-black text-sm">+30d</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-2">Segundo Aporte</h3>
                    <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                       <li className="flex items-start gap-2 justify-center">
                          <div className="w-1 h-1 rounded-full bg-slate-300 mt-1 shrink-0"></div>
                          Intensificar aquisição de base crítica
                       </li>
                       <li className="flex items-start gap-2 justify-center">
                          <div className="w-1 h-1 rounded-full bg-slate-300 mt-1 shrink-0"></div>
                          Expansão das campanhas de awareness
                       </li>
                    </ul>
                 </div>
              </div>

              <div className="mt-12 bg-slate-900 rounded-2xl p-6 flex items-start gap-4">
                 <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <Target className="text-indigo-400" size={20} />
                 </div>
                 <div>
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">Visão Estratégica</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                       O modelo de aporte em fases permite maior <strong>controle de risco</strong> e melhor alocação de capital, alinhando o desembolso financeiro à evolução real dos indicadores de tração da operação.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* BLOCO DE ENCERRAMENTO (CALL TO ACTION) */}
        <section className="pt-12 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 px-4">
           <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-indigo-200 animate-bounce">
                 <Handshake className="text-white" size={40} />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-10 font-display">
                “E aí Jabinha, está dentro com a gente?”
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
                <button 
                  onClick={handleCelebrate}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.95] transition-all uppercase tracking-widest text-sm hover:bg-blue-700"
                >
                  SIM
                </button>
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">OU</span>
                <button 
                  onClick={handleCelebrate}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.95] transition-all uppercase tracking-widest text-sm hover:bg-blue-700"
                >
                  SIM
                </button>
              </div>

              <div className="mt-8 text-5xl animate-in zoom-in duration-500">😄</div>
              
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">
                A maior oportunidade da Freguesia espera por você
              </p>
           </div>
        </section>

        {/* Welcome Modal */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowWelcomeModal(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-w-sm w-full text-center border border-slate-100 animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setShowWelcomeModal(false)}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <PartyPopper size={40} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2 font-display uppercase tracking-tight leading-tight">Parabéns, Jabinha!</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Seja muito bem-vindo à Localizei Jacarepaguá!
              </p>
            </div>
          </div>
        )}

        {showConfetti && <Confetti />}
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
              className="px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10 bg-white/10 text-white transition-all active:scale-95 group"
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
          <KPICard icon={DollarSign} label="Projeção" value="R$ 134k" isPositive />
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
                  Ver Projeções <ArrowUpRight size={14} strokeWidth={3} />
              </div>
          </button>

          <button 
            onClick={() => setActiveView('operations')}
            className="bg-[#111827] text-white p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border border-white/[0.04] shadow-2xl relative overflow-hidden rounded-[2.5rem] hover:bg-[#0B3A53]/20"
          >
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#0B3A53]/10 rounded-full blur-3xl"></div>
              <div className="w-20 h-20 bg-[#0B3A53]/20 border border-white/[0.04] flex items-center justify-center text-white group-hover:border-[#059669]/50 transition-colors rounded-[2rem]">
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
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sys.status === 'healthy' ? 'bg-[#059669]/10 text-[#059669]' : 'bg-red-50/10 text-red-500'}`}>
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
