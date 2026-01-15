
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
  <div className="bg-white dark:bg-gray-800 p-6 flex flex-col gap-3">
    <div className={`w-10 h-10 flex items-center justify-center ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
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
        <div className="w-20 h-20 bg-red-100 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">403 - Acesso Negado</h1>
        <p className="text-gray-500 mb-8 max-w-xs">Seu e-mail não possui permissão para acessar o painel administrativo.</p>
        <button onClick={onNavigateToApp} className="bg-gray-900 text-white px-8 py-3 font-bold active:scale-95 transition-all">
          Voltar para o App
        </button>
      </div>
    );
  }

  const renderInvestorModel = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-12 bg-white dark:bg-gray-900 min-h-screen pb-20">
      {/* Executive Header (Fluid) */}
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={28} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter font-display">Modelo de Monetização</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Estratégia Localizei JPA</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">Confidencial</span>
        </div>
      </div>

      {/* Visão Geral (Fluid) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
            <Globe size={18} className="text-[#1E5BFF]" />
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Visão Geral</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 p-8">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
            O Localizei JPA é um marketplace local estruturado por bairro e categoria. O modelo de monetização é diversificado, recorrente e escalável, combinando mídia local, anúncios diários, performance e networking.
          </p>
        </div>
      </section>

      {/* Canais de Receita (Fluid Grid) */}
      <div className="grid grid-cols-1 gap-12">
        
        {/* 1. Patrocinador Master */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">01. Patrocinador Master</h4>
            <span className="bg-blue-50 text-[#1E5BFF] text-[9px] font-black px-2 py-0.5 uppercase">Cota Exclusiva</span>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white max-w-lg">Cota exclusiva com presença fixa na home do aplicativo para todo o público.</p>
          <div className="flex gap-8 items-baseline pt-2">
            <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mensal</p>
                <p className="text-3xl font-black text-[#1E5BFF]">R$ 4.000</p>
            </div>
            <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inauguração</p>
                <p className="text-xl font-bold text-gray-300">R$ 2.500</p>
            </div>
          </div>
        </div>

        {/* 2. Banners Home */}
        <div className="space-y-6">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">02. Banners da Home (Por Bairro)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
            Inventário de 4 espaços rotativos vendidos comercialmente em cada um dos 9 bairros integrados.
          </p>
          <div className="grid grid-cols-3 gap-12 py-8 bg-gray-50 dark:bg-gray-800/50 px-8">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vagas</p>
              <p className="text-xl font-black">36 Slots</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Valor Unit.</p>
              <p className="text-xl font-black text-[#1E5BFF]">R$ 297</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Faturamento Máx.</p>
              <p className="text-xl font-black text-emerald-600">R$ 10.692</p>
            </div>
          </div>
        </div>

        {/* 3. Banners Categorias */}
        <div className="space-y-6">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">03. Banners nas Categorias</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
            Exibição focada por nicho e região. 16 categorias principais multiplicadas por 9 bairros.
          </p>
          <div className="grid grid-cols-3 gap-12 py-8 bg-gray-50 dark:bg-gray-800/50 px-8">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inventário</p>
              <p className="text-xl font-black">144 Slots</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Valor Unit.</p>
              <p className="text-xl font-black text-[#1E5BFF]">R$ 197</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Faturamento Máx.</p>
              <p className="text-xl font-black text-emerald-600">R$ 28.368</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ads e Performance (Fluid Flow) */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
            <Zap size={18} className="text-[#1E5BFF]" />
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Performance e Ads Diários</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800">
          {[
            { label: 'Ads Básico', price: 'R$ 0,99/dia', desc: 'Pequenos lojistas' },
            { label: 'Ads Premium / Serviços', price: 'R$ 3,99/dia', desc: 'Destaque no topo' },
            { label: 'Ads Vagas de Emprego', price: 'R$ 1,90/dia', desc: 'Recrutamento local' },
            { label: 'Cupons de Desconto', price: 'R$ 9,90/sem', desc: 'Campanhas promocionais' }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white dark:bg-gray-900 flex justify-between items-center group transition-colors">
               <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">{item.label}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{item.desc}</p>
               </div>
               <p className="font-black text-[#1E5BFF] text-sm">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Leads (Fluid) */}
      <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <Zap size={32} className="text-blue-400" />
            <div>
               <h4 className="text-lg font-black uppercase tracking-tight">Leads WhatsApp</h4>
               <p className="text-sm text-slate-400 font-medium mt-1">Orçamentos distribuídos para até 5 profissionais.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Custo por Lead</p>
            <p className="text-4xl font-black text-blue-400">R$ 3,90</p>
          </div>
      </div>

      {/* Resumo Final (Fluid) */}
      <section className="bg-gray-900 p-12 text-white">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 font-display">Resumo de Potencial Mensal</h3>
        <div className="space-y-6 mb-12">
            <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-widest">Patrocinador Master</span>
                <span className="text-base font-bold">R$ 4.000</span>
            </div>
            <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-widest">Banners Home (Todos bairros)</span>
                <span className="text-base font-bold">R$ 10.692</span>
            </div>
            <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-widest">Banners Categorias (Todas)</span>
                <span className="text-base font-bold">R$ 28.368</span>
            </div>
        </div>
        <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Potencial Médio Mídia Estática</p>
            <h2 className="text-7xl font-black tracking-tighter text-emerald-400">R$ 43.060<span className="text-2xl">,00</span></h2>
            <p className="text-[10px] text-gray-500 mt-6 italic font-medium uppercase tracking-widest">Não contabiliza performance e micro-ads</p>
        </div>
      </section>

      {/* Strategic (Fluid Footer) */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 pb-20 opacity-50">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900"><Repeat size={18} /><span className="font-black text-[10px] uppercase tracking-widest">Recorrência</span></div>
          <p className="text-xs font-medium">Fluxo de caixa previsível e escalável.</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900"><Layers size={18} /><span className="font-black text-[10px] uppercase tracking-widest">Escalabilidade</span></div>
          <p className="text-xs font-medium">Modelo replicável para novas regiões.</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900"><Target size={18} /><span className="font-black text-[10px] uppercase tracking-widest">Asset Light</span></div>
          <p className="text-xs font-medium">Baixíssimo custo marginal operacional.</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 font-sans animate-in fade-in duration-500 flex flex-col">
      {/* Header Admin (Fluid) */}
      <header className="bg-gray-900 text-white px-8 py-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 flex items-center justify-center">
            <ShieldCheck className="text-gray-900" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-xl uppercase tracking-tighter leading-none">Painel ADM</h1>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">Localizei JPA</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
              onClick={onNavigateToApp}
              className="text-white/50 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
          >
              <Eye size={16} /> Modo Usuário
          </button>
          <button onClick={onLogout} className="text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <main className="p-8 space-y-12 max-w-4xl mx-auto w-full">
        
        {activeView === 'dashboard' ? (
          <>
            {/* KPIs (Fluid Grid) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800">
                <KPICard icon={Users} label="Usuários" value="2.842" color="bg-blue-500" />
                <KPICard icon={Store} label="Lojistas" value="156" color="bg-purple-500" />
                <KPICard icon={DollarSign} label="Potencial" value="R$ 43k" color="bg-amber-500" />
                <KPICard icon={TrendingUp} label="Crescimento" value="+412" color="bg-emerald-500" />
            </section>

            {/* Gestão (Fluid Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Atalho Monetização (Fluid) */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-white dark:bg-gray-900 p-12 flex flex-col items-center text-center gap-6 active:scale-[0.99] transition-all group"
                >
                    <div className="w-16 h-16 bg-[#1E5BFF] flex items-center justify-center text-white">
                        <Presentation size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tighter">Modelo de Monetização</h3>
                      <p className="text-xs text-gray-400 mt-3 font-medium">Projeções estratégicas de faturamento e inventário de mídia para investidores.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest mt-2 group-hover:gap-4 transition-all">
                        Abrir Relatório <ChevronRight size={14} />
                    </div>
                </button>

                {/* Lojas para Aprovar (Fluid) */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Novas Lojas</h3>
                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Pendente</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {[
                            { name: 'Sushi Taquara', cat: 'Alimentação' },
                            { name: 'Dra. Ana Pet', cat: 'Saúde' }
                        ].map((item, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        <Store size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">{item.cat}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-200" size={20} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Atalhos Rápidos (Fluid) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800">
                <button className="bg-white dark:bg-gray-900 p-6 flex flex-col items-center gap-2 active:bg-gray-50 transition-colors">
                    <Zap className="text-amber-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Push</span>
                </button>
                <button className="bg-white dark:bg-gray-900 p-6 flex flex-col items-center gap-2 active:bg-gray-50 transition-colors">
                    <Globe className="text-blue-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Web</span>
                </button>
                <button className="bg-white dark:bg-gray-900 p-6 flex flex-col items-center gap-2 active:bg-gray-50 transition-colors">
                    <Mail className="text-indigo-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</span>
                </button>
                <button className="bg-white dark:bg-gray-900 p-6 flex flex-col items-center gap-2 active:bg-gray-50 transition-colors">
                    <Search className="text-slate-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Logs</span>
                </button>
            </div>
          </>
        ) : (
          renderInvestorModel()
        )}

      </main>

      <footer className="mt-auto py-12 text-center opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-500">Localizei JPA System Admin v1.1</p>
      </footer>
    </div>
  );
};
