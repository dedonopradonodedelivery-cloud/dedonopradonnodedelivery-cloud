
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
    <div className="animate-in slide-in-from-right duration-500 space-y-10 bg-white dark:bg-gray-900 min-h-screen p-1 pb-20">
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
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display">Modelo de Monetização</h2>
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
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
            O Localizei JPA é um marketplace local estruturado por bairro e categoria, com foco em visibilidade, geração de demanda e relacionamento entre lojistas e consumidores. Nosso modelo de monetização é diversificado, recorrente e escalável.
          </p>
        </div>
      </section>

      {/* Canais de Receita Principais */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* 1. Patrocinador Master */}
        <div className="border border-gray-100 dark:border-gray-800 p-8 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">1. Patrocinador Master</h4>
            <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 uppercase">Cota Exclusiva</span>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">Cota exclusiva com presença fixa e autoridade máxima na home do app.</p>
          <div className="flex gap-6 items-baseline pt-2">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Valor Padrão</p>
                <p className="text-2xl font-black text-[#1E5BFF]">R$ 4.000<span className="text-sm">/mês</span></p>
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Inauguração</p>
                <p className="text-xl font-bold text-gray-400">R$ 2.500</p>
            </div>
          </div>
        </div>

        {/* 2. Banners Home */}
        <div className="border border-gray-100 dark:border-gray-800 p-8 space-y-5">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">2. Banners da Home (Inventário por Bairro)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Total de 5 banners na home, sendo 1 master e 4 espaços vendidos comercialmente por bairro. 
            O lojista escolhe em qual bairro deseja focar sua visibilidade.
          </p>
          <div className="grid grid-cols-3 gap-4 py-4 bg-gray-50 dark:bg-gray-800/50 p-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Espaços x Bairros</p>
              <p className="text-lg font-black">4 × 9</p>
              <p className="text-[8px] font-bold text-gray-400">36 posições</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Valor Un.</p>
              <p className="text-lg font-black text-[#1E5BFF]">R$ 297</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Potencial Máx.</p>
              <p className="text-lg font-black text-emerald-600 uppercase">R$ 10.692</p>
            </div>
          </div>
        </div>

        {/* 3. Banners Categorias */}
        <div className="border border-gray-100 dark:border-gray-800 p-8 space-y-5">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest">3. Banners das Categorias (Nicho + Local)</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Segmentação cirúrgica: o lojista escolhe a categoria e o bairro exato. 
            Ex: "Pizzaria" na "Freguesia". Total de 16 categorias em 9 bairros.
          </p>
          <div className="grid grid-cols-3 gap-4 py-4 bg-gray-50 dark:bg-gray-800/50 p-6">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Cat. x Bairros</p>
              <p className="text-lg font-black">16 × 9</p>
              <p className="text-[8px] font-bold text-gray-400">144 posições</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Valor Un.</p>
              <p className="text-lg font-black text-[#1E5BFF]">R$ 197</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase">Potencial Máx.</p>
              <p className="text-lg font-black text-emerald-600 uppercase">R$ 28.368</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ads e Micro-receitas */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-[#1E5BFF]" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Mídia de Performance e Serviços</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Ads Básico', price: 'R$ 0,99/dia', desc: 'Plano de entrada para pequenos lojistas (R$ 29,70/mês)' },
            { label: 'Ads Premium / Serviços', price: 'R$ 3,99/dia', desc: 'Destaque no topo das listas (R$ 119,70/mês)' },
            { label: 'Ads Vagas de Emprego', price: 'R$ 1,90/dia', desc: 'Recrutamento ágil no bairro (R$ 57,00/mês)' },
            { label: 'Cupons', price: 'R$ 9,90/semana', desc: 'Promoções de curta duração (15 a 90 dias)' }
          ].map((item, i) => (
            <div key={i} className="p-5 border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:bg-gray-50 transition-colors">
               <div>
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">{item.label}</h5>
                  <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{item.desc}</p>
               </div>
               <p className="font-black text-[#1E5BFF] text-sm whitespace-nowrap">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Networking e Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white p-8 rounded-none flex flex-col justify-between">
            <div>
                <h4 className="font-black text-xs text-blue-400 uppercase tracking-widest mb-4">Leads de Orçamento (WhatsApp)</h4>
                <p className="text-sm text-slate-300 mb-6">Modelo baseado em performance. Cobrança por lead entregue para até 5 profissionais simultâneos.</p>
            </div>
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Custo por Lead</span>
                <span className="text-3xl font-black text-white">R$ 3,90</span>
            </div>
        </div>

        <div className="bg-indigo-600 text-white p-8 rounded-none flex flex-col justify-between">
            <div>
                <h4 className="font-black text-xs text-indigo-200 uppercase tracking-widest mb-4">JPA Connect (Networking VIP)</h4>
                <p className="text-sm text-indigo-100 mb-6">Grupo fechado de relacionamento e negócios. Máximo de 30 participantes por grupo.</p>
            </div>
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-indigo-200 uppercase">Receita Grupo Cheio</span>
                <span className="text-3xl font-black text-white">R$ 6.000<span className="text-xs">/mês</span></span>
            </div>
        </div>
      </div>

      {/* Resumo - Potencial de Mídia */}
      <section className="bg-gray-900 p-10 text-white">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8 font-display">Resumo: Potencial Mensal de Mídia</h3>
        <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-sm font-medium text-gray-400 uppercase">Patrocinador Master</span>
                <span className="text-lg font-bold">R$ 4.000</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-sm font-medium text-gray-400 uppercase">Banners Home (9 Bairros)</span>
                <span className="text-lg font-bold">R$ 10.692</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-sm font-medium text-gray-400 uppercase">Banners Categorias (16 x 9)</span>
                <span className="text-lg font-bold">R$ 28.368</span>
            </div>
        </div>
        <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Total Potencial (Somente Mídia)</p>
            <h2 className="text-7xl font-black tracking-tighter text-emerald-400">R$ 43.060<span className="text-2xl">,00</span></h2>
            <p className="text-xs text-gray-500 mt-4 italic font-medium">*Não inclui receitas de Ads diários, leads ou networking.</p>
        </div>
      </section>

      {/* Observação Estratégica */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12 border-t border-gray-100 opacity-60 pb-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900"><Repeat size={18} /><span className="font-black text-[10px] uppercase">Recorrência</span></div>
          <p className="text-xs leading-relaxed">Modelo baseado em assinaturas e créditos, garantindo previsibilidade de caixa.</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900"><Layers size={18} /><span className="font-black text-[10px] uppercase">Escalabilidade</span></div>
          <p className="text-xs leading-relaxed">Crescimento linear conforme abertura de novas categorias ou bairros.</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900"><Target size={18} /><span className="font-black text-[10px] uppercase">Asset Light</span></div>
          <p className="text-xs leading-relaxed">Baixo custo marginal por novo lojista. Modelo altamente replicável.</p>
        </div>
      </footer>
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
                <KPICard icon={DollarSign} label="Monetização" value="R$ 43k" color="bg-amber-500" />
                <KPICard icon={TrendingUp} label="Novos/Mês" value="+412" color="bg-emerald-500" />
            </section>

            {/* Listas de Gestão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Atalho para Modelo de Monetização (Apresentação Investidor) */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 rounded-none p-8 flex flex-col items-center text-center gap-4 shadow-xl active:scale-[0.98] transition-all group overflow-hidden relative"
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
