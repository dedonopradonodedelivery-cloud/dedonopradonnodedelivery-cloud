
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  User, 
  LogOut,
  Mail,
  Zap,
  Globe,
  Lock,
  Eye,
  DollarSign,
  ArrowLeft,
  PieChart,
  FileText,
  Presentation,
  Target,
  Layers,
  Repeat
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onNavigateToApp: () => void;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const KPICard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-none border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3">
    <div className={`w-10 h-10 rounded-none flex items-center justify-center ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight mt-1">{value}</p>
    </div>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigateToApp, onLogout }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'monetization_model'>('dashboard');

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-50">
          <Lock className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">403 - Acesso Negado</h1>
        <p className="text-gray-500 mb-8 max-w-xs">Seu e-mail não possui permissão para acessar o painel administrativo.</p>
        <button onClick={onNavigateToApp} className="bg-gray-900 text-white px-8 py-3 rounded-none font-bold active:scale-95 transition-all">
          Voltar para o App
        </button>
      </div>
    );
  }

  const renderInvestorModel = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-10 bg-white dark:bg-gray-900 min-h-screen p-1">
      {/* Executive Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Modelo de Monetização</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Apresentação Estratégica para Investidores</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100">Confidencial</span>
        </div>
      </div>

      {/* Visão Geral */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <Globe size={18} className="text-[#1E5BFF]" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Visão Geral do Ecossistema</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-l-4 border-[#1E5BFF]">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            O Localizei JPA é um marketplace hiper-local estruturado por bairro e categoria. Focamos em visibilidade, geração de demanda e relacionamento B2C. Nosso modelo de receita é diversificado, recorrente e escalável, combinando mídia local, performance (leads) e networking corporativo.
          </p>
        </div>
      </section>

      {/* Grid de Canais de Receita */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Patrocinador Master */}
        <div className="border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">1. Patrocinador Master</h4>
            <span className="bg-blue-50 text-[#1E5BFF] text-[9px] font-black px-2 py-0.5 uppercase">Exclusividade</span>
          </div>
          <p className="text-sm font-bold text-gray-800 dark:text-white">Cota fixa com presença em 100% das sessões da Home.</p>
          <div className="flex gap-4 items-baseline">
            <span className="text-xl font-black text-[#1E5BFF]">R$ 4.000,00<span className="text-[10px] font-medium text-gray-400">/mês</span></span>
            <span className="text-xs text-gray-400 font-bold">Inauguração: R$ 2.500</span>
          </div>
        </div>

        {/* 2. Banners Home */}
        <div className="border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">2. Banners Home (por bairro)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">4 espaços vendidos exclusivamente por bairro (9 bairros totais).</p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Inventário Mensal</p>
              <p className="text-sm font-black">36 Posições</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Ticket Médio</p>
              <p className="text-sm font-black">R$ 297/mês</p>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-gray-400">Faturamento Máx.</span>
            <span className="text-lg font-black text-emerald-600">R$ 10.692,00</span>
          </div>
        </div>

        {/* 3. Banners Categorias */}
        <div className="border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">3. Banners Categorias</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Segmentação direta: 16 categorias × 9 bairros (144 posições).</p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Unidades</p>
              <p className="text-sm font-black">144 Slots</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Ticket Médio</p>
              <p className="text-sm font-black">R$ 197/mês</p>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-gray-400">Faturamento Máx.</span>
            <span className="text-lg font-black text-emerald-600">R$ 28.368,00</span>
          </div>
        </div>

        {/* 4. JPA Connect */}
        <div className="border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">4. JPA Connect (Networking)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Grupo de elite para lojistas. Networking e parcerias estratégicas.</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Capacidade</p>
              <p className="text-sm font-black">30 membros</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Mensalidade</p>
              <p className="text-lg font-black text-indigo-600">R$ 200,00</p>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-gray-400">Receita Grupo Cheio</span>
            <span className="text-lg font-black text-gray-900">R$ 6.000,00</span>
          </div>
        </div>

      </div>

      {/* Ads & Micro-receitas */}
      <section className="space-y-6">
        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Anúncios Diários e Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Ads Básico', val: 'R$ 0,99', sub: 'Pequeno varejo' },
            { label: 'Ads Premium', val: 'R$ 3,99', sub: 'Destaque topo' },
            { label: 'Ads Serviços', val: 'R$ 3,99', sub: 'Prestadores' },
            { label: 'Vagas Emprego', val: 'R$ 1,90', sub: 'Recrutamento' },
            { label: 'Cupons', val: 'R$ 9,90', sub: 'Semanal' }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
               <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{item.label}</p>
               <p className="text-lg font-black text-gray-900 dark:text-white">{item.val}<span className="text-[8px] opacity-40">/dia</span></p>
               <p className="text-[9px] text-gray-400 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Leads */}
      <div className="bg-slate-900 text-white p-8 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Zap size={28} className="text-blue-400" />
            </div>
            <div>
               <h4 className="text-lg font-black uppercase">Leads via WhatsApp</h4>
               <p className="text-sm text-slate-400">Modelo de performance para cotações diretas.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Custo por Lead</p>
            <p className="text-3xl font-black text-blue-400">R$ 3,90</p>
          </div>
      </div>

      {/* Resumo de Potencial Final */}
      <section className="bg-[#1E5BFF] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Resumo - Potencial Mensal</h3>
               <div className="space-y-2 opacity-80 text-sm font-medium">
                  <p className="flex justify-between">Patrocinador Master: <span>R$ 4.000</span></p>
                  <p className="flex justify-between">Banners Home: <span>R$ 10.692</span></p>
                  <p className="flex justify-between border-b border-white/20 pb-2">Banners Categorias: <span>R$ 28.368</span></p>
               </div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em] mb-2">Potencial Médio de Mídia</p>
                <h2 className="text-6xl font-black tracking-tighter">R$ 43.060<span className="text-2xl">,00</span></h2>
                <p className="text-xs text-blue-100 mt-4 italic font-medium">Cálculo baseado em ocupação de inventário 100%.</p>
            </div>
        </div>
      </section>

      {/* Strategic Footer */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100 dark:border-gray-800 opacity-60">
        <div className="flex items-center gap-3">
          <Repeat size={18} className="text-[#1E5BFF]" />
          <p className="text-[10px] font-black uppercase tracking-widest">Receita Recorrente</p>
        </div>
        <div className="flex items-center gap-3">
          <Layers size={18} className="text-[#1E5BFF]" />
          <p className="text-[10px] font-black uppercase tracking-widest">Escala Linear por Região</p>
        </div>
        <div className="flex items-center gap-3">
          <Target size={18} className="text-[#1E5BFF]" />
          <p className="text-[10px] font-black uppercase tracking-widest">Baixo Custo Marginal</p>
        </div>
      </footer>
      
      <div className="py-20 text-center">
         <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.5em]">Localizei JPA Platform Strategy v1.0</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 flex flex-col">
      {/* Header Admin */}
      <header className="bg-gray-900 text-white px-6 py-6 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-none flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="text-gray-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-black text-lg uppercase tracking-tighter leading-none">Painel ADM</h1>
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">Gestão Localizei JPA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={onNavigateToApp}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-none text-xs font-bold transition-all flex items-center gap-2 border border-white/5"
            >
                <Eye size={14} /> Modo Usuário
            </button>
            <button onClick={onLogout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-none transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-4xl mx-auto w-full">
        
        {activeView === 'dashboard' ? (
          <>
            {/* KPIs Principais */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard icon={Users} label="Usuários" value="2.842" color="bg-blue-500" />
                <KPICard icon={Store} label="Lojistas" value="156" color="bg-purple-500" />
                <KPICard icon={DollarSign} label="Monetização" value="R$ 28k" color="bg-amber-500" />
                <KPICard icon={TrendingUp} label="Novos/Mês" value="+412" color="bg-emerald-500" />
            </section>

            {/* Listas de Gestão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NOVO: Atalho para Apresentação Investidor */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-white text-gray-900 border border-gray-100 rounded-none p-8 flex flex-col items-center text-center gap-4 shadow-xl active:scale-[0.98] transition-all group overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5BFF]/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-16 h-16 bg-[#1E5BFF] rounded-none flex items-center justify-center text-white shadow-lg">
                        <Presentation size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-tight">Modelo de Monetização</h3>
                      <p className="text-xs text-gray-400 mt-2">Documento estratégico com projeções de faturamento e inventário de mídia.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest mt-2">
                        Abrir Relatório <ChevronRight size={14} />
                    </div>
                </button>

                {/* Lojas Aguardando Verificação */}
                <div className="bg-white dark:bg-gray-800 rounded-none border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">Lojas para Aprovar</h3>
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-none">NOVO</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {[
                            { name: 'Sushi Taquara', cat: 'Alimentação', date: 'Hoje' },
                            { name: 'Dra. Ana Pet', cat: 'Saúde', date: 'Ontem' }
                        ].map((item, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-none bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        <Store size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{item.cat}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-[#1E5BFF]"><ChevronRight size={20} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Atalhos Rápidos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-white dark:bg-gray-800 p-4 rounded-none shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
                    <Zap className="text-amber-500" size={20} />
                    <span className="text-[10px] font-black uppercase text-gray-500">Impulsionar</span>
                </button>
                <button className="bg-white dark:bg-gray-800 p-4 rounded-none shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
                    <Globe className="text-blue-500" size={20} />
                    <span className="text-[10px] font-black uppercase text-gray-500">Broadcast</span>
                </button>
                <button className="bg-white dark:bg-gray-800 p-4 rounded-none shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
                    <Mail className="text-indigo-500" size={20} />
                    <span className="text-[10px] font-black uppercase text-gray-500">Newsletter</span>
                </button>
                <button className="bg-white dark:bg-gray-800 p-4 rounded-none shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 active:scale-95 transition-transform">
                    <Search className="text-slate-500" size={20} />
                    <span className="text-[10px] font-black uppercase text-gray-500">Logs</span>
                </button>
            </div>
          </>
        ) : (
          renderInvestorModel()
        )}

      </main>

      <footer className="mt-auto py-10 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500">Localizei JPA System Admin v1.0</p>
      </footer>
    </div>
  );
};
