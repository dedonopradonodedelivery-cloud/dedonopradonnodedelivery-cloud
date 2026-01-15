
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
  <div className="bg-white dark:bg-gray-800 p-8 flex flex-col gap-4">
    <div className={`w-12 h-12 flex items-center justify-center ${color} bg-opacity-10 text-${color.split('-')[1]}-600 rounded-none`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-white leading-tight mt-1 tracking-tighter">{value}</p>
    </div>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigateToApp, onLogout }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'monetization_model'>('dashboard');

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-red-50 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">403 - Negado</h1>
        <p className="text-gray-500 mb-8 max-w-xs text-sm">Acesso restrito ao administrador.</p>
        <button onClick={onNavigateToApp} className="bg-gray-900 text-white px-10 py-4 font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
          Voltar para o App
        </button>
      </div>
    );
  }

  const renderInvestorModel = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-16 bg-white dark:bg-gray-900 min-h-screen pb-32">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={32} />
          </button>
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-display">Modelo de Monetização</h2>
            <p className="text-[11px] text-[#1E5BFF] font-black uppercase tracking-[0.3em] mt-2">Relatório Executivo v1.1</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-5 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Propriedade Intelectual</span>
        </div>
      </div>

      {/* Visão Geral */}
      <section className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
            <Globe size={18} className="text-[#1E5BFF]" />
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Visão Geral</h3>
        </div>
        <p className="text-gray-800 dark:text-gray-300 text-lg leading-relaxed font-medium">
          O Localizei JPA é um marketplace local baseado em economia de bairro. O modelo de monetização é 100% digital, escalável e recorrente, unificando publicidade de impacto com ferramentas de performance B2B.
        </p>
      </section>

      {/* Canais de Receita */}
      <div className="space-y-20">
        
        {/* 1. Patrocinador Master */}
        <div className="space-y-6">
          <div className="flex justify-between items-center max-w-xl">
            <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">01. Patrocinador Master</h4>
            <span className="text-[#1E5BFF] text-[9px] font-black uppercase tracking-widest">Exclusividade Total</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white max-w-lg">Presença em 100% das sessões da home, gerando autoridade máxima no ecossistema.</p>
          <div className="flex gap-12 items-baseline pt-4">
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Padrão</p>
                <p className="text-4xl font-black text-[#1E5BFF] tracking-tighter">R$ 4.000<span className="text-sm">/mês</span></p>
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Inauguração</p>
                <p className="text-2xl font-black text-gray-200">R$ 2.500</p>
            </div>
          </div>
        </div>

        {/* 2. Banners Home */}
        <div className="space-y-8">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">02. Banners da Home (Por Bairro)</h4>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
            Inventário pulverizado em 9 bairros, permitindo que lojistas comprem visibilidade geolocalizada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-8 bg-gray-50 dark:bg-gray-800/50 px-12">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Vagas Mensais</p>
              <p className="text-2xl font-black">36 Slots</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Valor Unitário</p>
              <p className="text-2xl font-black text-[#1E5BFF]">R$ 297</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Potencial Máx.</p>
              <p className="text-2xl font-black text-emerald-600">R$ 10.692</p>
            </div>
          </div>
        </div>

        {/* 3. Banners Categorias */}
        <div className="space-y-8">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">03. Banners nas Categorias</h4>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
            Nicho e localidade: a combinação perfeita para conversão direta em 144 pontos de contato.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-8 bg-gray-50 dark:bg-gray-800/50 px-12">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Inventário</p>
              <p className="text-2xl font-black">144 Slots</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Valor Unitário</p>
              <p className="text-2xl font-black text-[#1E5BFF]">R$ 197</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Potencial Máx.</p>
              <p className="text-2xl font-black text-emerald-600">R$ 28.368</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ads e Performance */}
      <section className="space-y-12">
        <div className="flex items-center gap-3">
            <Zap size={18} className="text-[#1E5BFF]" />
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Ads e Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { label: 'Ads Básico', price: 'R$ 0,99/dia', desc: 'Foco em pequenas empresas' },
            { label: 'Ads Premium / Serviços', price: 'R$ 3,99/dia', desc: 'Prioridade absoluta em listas' },
            { label: 'Ads Vagas de Emprego', price: 'R$ 1,90/dia', desc: 'RH localizado e ágil' },
            { label: 'Cupons Promocionais', price: 'R$ 9,90/sem', desc: 'Incentivo de curto prazo' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-4">
               <div>
                  <h5 className="font-black text-base text-gray-900 dark:text-white uppercase tracking-tight">{item.label}</h5>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-widest">{item.desc}</p>
               </div>
               <p className="font-black text-[#1E5BFF] text-lg">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Leads */}
      <div className="bg-slate-900 text-white p-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-8">
            <Zap size={40} className="text-[#1E5BFF]" fill="currentColor" />
            <div>
               <h4 className="text-2xl font-black uppercase tracking-tighter">Leads WhatsApp</h4>
               <p className="text-slate-400 font-medium mt-2">Cotações diretas em tempo real para prestadores.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Custo por Lead</p>
            <p className="text-5xl font-black text-[#1E5BFF] tracking-tighter">R$ 3,90</p>
          </div>
      </div>

      {/* Resumo Final */}
      <section className="bg-gray-900 p-16 text-white">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-12 font-display">Faturamento Potencial de Mídia</h3>
        <div className="space-y-8 mb-16 opacity-80">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.3em]">Cotas Master</span>
                <span className="text-lg font-bold">R$ 4.000</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.3em]">Banners Home</span>
                <span className="text-lg font-bold">R$ 10.692</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.3em]">Banners Categorias</span>
                <span className="text-lg font-bold">R$ 28.368</span>
            </div>
        </div>
        <div className="text-center md:text-right">
            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Total Mensal Projetado (Mídia Estática)</p>
            <h2 className="text-8xl font-black tracking-tighter text-emerald-400">R$ 43.060<span className="text-3xl">,00</span></h2>
            <p className="text-[10px] text-gray-500 mt-10 italic font-bold uppercase tracking-widest">Base de cálculo: Jacarepaguá v1.1</p>
        </div>
      </section>

      {/* Strategic Values */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-12 pb-24 opacity-60">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Repeat size={20} /><span className="font-black text-[10px] uppercase tracking-widest">Recorrência</span></div>
          <p className="text-xs font-bold leading-relaxed">Modelo de assinatura e créditos garantindo fluxo de caixa.</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Layers size={20} /><span className="font-black text-[10px] uppercase tracking-widest">Escalabilidade</span></div>
          <p className="text-xs font-bold leading-relaxed">Infraestrutura pronta para replicação em novas regiões.</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white"><Target size={20} /><span className="font-black text-[10px] uppercase tracking-widest">Performance</span></div>
          <p className="text-xs font-bold leading-relaxed">Baixo custo marginal com foco em automação e autoatendimento.</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden">
      {/* Header Admin */}
      <header className="bg-gray-900 text-white px-8 py-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-500 flex items-center justify-center">
            <ShieldCheck className="text-gray-900" size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-2xl uppercase tracking-tighter leading-none">Painel ADM</h1>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mt-2">Localizei JPA Business</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <button 
              onClick={onNavigateToApp}
              className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-3"
          >
              <Eye size={18} /> Modo Usuário
          </button>
          <button onClick={onLogout} className="text-red-500 hover:text-red-400 transition-colors">
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="p-10 space-y-20 max-w-5xl mx-auto w-full">
        
        {activeView === 'dashboard' ? (
          <>
            {/* KPIs */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <KPICard icon={Users} label="Base Usuários" value="2.842" color="bg-blue-500" />
                <KPICard icon={Store} label="Parceiros" value="156" color="bg-purple-500" />
                <KPICard icon={DollarSign} label="Vendas Potenciais" value="R$ 43k" color="bg-amber-500" />
                <KPICard icon={TrendingUp} label="Crescimento" value="+412" color="bg-emerald-500" />
            </section>

            {/* Gestão Central */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                
                {/* Botão Monetização */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-white dark:bg-gray-900 p-16 flex flex-col items-center text-center gap-8 active:scale-[0.99] transition-all group"
                >
                    <div className="w-20 h-20 bg-[#1E5BFF] flex items-center justify-center text-white">
                        <Presentation size={40} />
                    </div>
                    <div>
                      <h3 className="font-black text-3xl uppercase tracking-tighter">Modelo de Monetização</h3>
                      <p className="text-sm text-gray-400 mt-4 font-bold leading-relaxed">Apresentação para investidores com projeções, métricas e inventário detalhado.</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#1E5BFF] text-[11px] font-black uppercase tracking-widest mt-2 group-hover:gap-6 transition-all">
                        Abrir Relatório <ChevronRight size={16} />
                    </div>
                </button>

                {/* Lista de Novas Lojas */}
                <div className="bg-white dark:bg-gray-900 p-10 flex flex-col">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.25em]">Solicitações Pendentes</h3>
                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Ação Necessária</span>
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'Sushi Taquara', cat: 'Alimentação' },
                            { name: 'Dra. Ana Pet', cat: 'Saúde' },
                            { name: 'Mecânica JPA', cat: 'Autos' }
                        ].map((item, i) => (
                            <div key={i} className="px-2 py-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Store size={24} />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.cat}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-200 group-hover:text-[#1E5BFF] transition-colors" size={24} />
                            </div>
                        ))}
                    </div>
                    <button className="mt-10 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] text-center hover:text-gray-900 transition-colors">Ver todas solicitações</button>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <button className="bg-white dark:bg-gray-900 p-8 flex flex-col items-center gap-3 active:bg-blue-500 active:text-white transition-all group">
                    <Zap className="text-amber-500 group-active:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-active:text-white">Push Global</span>
                </button>
                <button className="bg-white dark:bg-gray-900 p-8 flex flex-col items-center gap-3 active:bg-blue-500 active:text-white transition-all group">
                    <Globe className="text-blue-500 group-active:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-active:text-white">Broadcast</span>
                </button>
                <button className="bg-white dark:bg-gray-900 p-8 flex flex-col items-center gap-3 active:bg-blue-500 active:text-white transition-all group">
                    <Mail className="text-indigo-500 group-active:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-active:text-white">Newsletter</span>
                </button>
                <button className="bg-white dark:bg-gray-900 p-8 flex flex-col items-center gap-3 active:bg-blue-500 active:text-white transition-all group">
                    <Search className="text-slate-500 group-active:text-white" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-active:text-white">Audit Logs</span>
                </button>
            </div>
          </>
        ) : (
          renderInvestorModel()
        )}

      </main>

      <footer className="mt-auto py-16 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-500">Localizei JPA Core System 1.1.2</p>
      </footer>
    </div>
  );
};
