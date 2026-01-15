
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
  Repeat
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onNavigateToApp: () => void;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const KPICard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value }) => (
  <div className="bg-white/5 p-5 flex flex-col gap-2">
    <div className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-none">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.15em]">{label}</p>
      <p className="text-2xl font-black text-white leading-tight mt-0.5 tracking-tighter">{value}</p>
    </div>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigateToApp, onLogout }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'monetization_model'>('dashboard');

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tighter">403 - Negado</h1>
        <p className="text-gray-500 mb-6 max-w-xs text-xs">Acesso restrito ao administrador.</p>
        <button onClick={onNavigateToApp} className="bg-gray-900 text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
          Voltar para o App
        </button>
      </div>
    );
  }

  const renderInvestorModel = () => (
    <div className="animate-in slide-in-from-right duration-500 space-y-10 bg-[#1E5BFF] min-h-screen pb-20 text-white">
      {/* Executive Header - White on Blue */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display">Modelo de Monetização</h2>
            <p className="text-[10px] text-white/80 font-black uppercase tracking-[0.2em] mt-1">Estratégia JPA v1.1.2</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-4 py-1.5 bg-white/10 text-white/60 text-[9px] font-black uppercase tracking-[0.3em]">Confidencial</span>
        </div>
      </div>

      {/* Visão Geral */}
      <section className="max-w-xl">
        <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-white" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Visão Geral</h3>
        </div>
        <p className="text-white text-base leading-relaxed font-medium">
          Marketplace local baseado em economia de bairro. Monetização 100% digital, escalável e recorrente, unificando publicidade e performance B2B.
        </p>
      </section>

      {/* Canais de Receita */}
      <div className="space-y-12">
        
        {/* 1. Patrocinador Master */}
        <div className="space-y-4">
          <div className="flex justify-between items-center max-w-lg">
            <h4 className="font-black text-[10px] text-white/50 uppercase tracking-[0.15em]">01. Patrocinador Master</h4>
            <span className="text-white text-[8px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5">Exclusividade</span>
          </div>
          <p className="text-lg font-bold text-white max-w-lg">Autoridade máxima com presença fixa na home em 100% das sessões.</p>
          <div className="flex gap-8 items-baseline">
            <div>
                <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1">Mensal</p>
                <p className="text-3xl font-black text-white tracking-tighter">R$ 4.000</p>
            </div>
            <div>
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Early Bird</p>
                <p className="text-xl font-black text-white/30">R$ 2.500</p>
            </div>
          </div>
        </div>

        {/* 2. Banners Home */}
        <div className="space-y-5">
          <h4 className="font-black text-[10px] text-white/50 uppercase tracking-[0.15em]">02. Banners da Home (9 Bairros)</h4>
          <p className="text-base text-white/80 leading-relaxed max-w-lg">
            Visibilidade geolocalizada em 9 microrregiões estratégicas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 bg-white/5 px-8">
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">Inventário</p>
              <p className="text-xl font-black">36 Slots</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">Valor Un.</p>
              <p className="text-xl font-black text-white">R$ 297</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">Teto Médio</p>
              <p className="text-xl font-black text-white">R$ 10.692</p>
            </div>
          </div>
        </div>

        {/* 3. Banners Categorias */}
        <div className="space-y-5">
          <h4 className="font-black text-[10px] text-white/50 uppercase tracking-[0.15em]">03. Banners nas Categorias</h4>
          <p className="text-base text-white/80 leading-relaxed max-w-lg">
            Conversão por nicho e localidade em 144 pontos de contato direto.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 bg-white/5 px-8">
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">Disponível</p>
              <p className="text-xl font-black">144 Slots</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">Valor Un.</p>
              <p className="text-xl font-black text-white">R$ 197</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">Teto Médio</p>
              <p className="text-xl font-black text-white">R$ 28.368</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ads e Performance */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
            <Zap size={14} className="text-white" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Performance e Micro-Ads</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {[
            { label: 'Ads Básico', price: 'R$ 0,99/dia', desc: 'Pequenos lojistas' },
            { label: 'Ads Premium', price: 'R$ 3,99/dia', desc: 'Prioridade absoluta' },
            { label: 'Vagas Emprego', price: 'R$ 1,90/dia', desc: 'RH localizado' },
            { label: 'Cupons', price: 'R$ 9,90/sem', desc: 'Incentivo curto prazo' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
               <div>
                  <h5 className="font-black text-sm text-white uppercase tracking-tight">{item.label}</h5>
                  <p className="text-[9px] text-white/60 font-black uppercase mt-0.5 tracking-widest">{item.desc}</p>
               </div>
               <p className="font-black text-white text-sm">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Leads */}
      <div className="bg-white/10 text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <Zap size={28} className="text-white" fill="currentColor" />
            <div>
               <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Leads WhatsApp</h4>
               <p className="text-white/70 text-[10px] font-medium mt-1">Cotações em tempo real para prestadores.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Custo/Lead</p>
            <p className="text-4xl font-black text-white tracking-tighter leading-none">R$ 3,90</p>
          </div>
      </div>

      {/* Resumo Final */}
      <section className="bg-white text-[#1E5BFF] p-10">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 font-display">Faturamento Potencial Mensal</h3>
        <div className="space-y-4 mb-10 opacity-70">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cotas Master</span>
                <span className="text-base font-bold">R$ 4.000</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Banners Home</span>
                <span className="text-base font-bold">R$ 10.692</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Banners Categorias</span>
                <span className="text-base font-bold">R$ 28.368</span>
            </div>
        </div>
        <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.3em] mb-2">Total Projetado (Mídia Estática)</p>
            <h2 className="text-6xl font-black tracking-tighter text-[#1E5BFF] leading-none">R$ 43.060<span className="text-2xl">,00</span></h2>
            <p className="text-[9px] text-[#1E5BFF]/60 mt-6 italic font-bold uppercase tracking-widest">Base de cálculo: Jacarepaguá v1.1.2</p>
        </div>
      </section>

      {/* Strategic Values */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 pb-16 opacity-60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-white"><Repeat size={16} /><span className="font-black text-[9px] uppercase tracking-widest">Recorrência</span></div>
          <p className="text-[11px] font-bold leading-tight">Assinaturas e créditos garantindo caixa.</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-white"><Layers size={16} /><span className="font-black text-[9px] uppercase tracking-widest">Escala</span></div>
          <p className="text-[11px] font-bold leading-tight">Infraestrutura pronta para novas regiões.</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-white"><Target size={16} /><span className="font-black text-[9px] uppercase tracking-widest">Performance</span></div>
          <p className="text-[11px] font-bold leading-tight">Baixo custo marginal e automação.</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1E5BFF] font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden text-white">
      {/* Header Admin */}
      <header className="bg-white/5 text-white px-6 py-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white text-[#1E5BFF] flex items-center justify-center">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-lg uppercase tracking-tighter leading-none text-white">Painel ADM</h1>
            <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mt-1.5">Localizei JPA Business</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
              onClick={onNavigateToApp}
              className="text-white/60 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
          >
              <Eye size={16} /> Modo Usuário
          </button>
          <button onClick={onLogout} className="text-white/60 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-10 max-w-4xl mx-auto w-full">
        
        {activeView === 'dashboard' ? (
          <>
            {/* KPIs */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard icon={Users} label="Base Usuários" value="2.842" color="" />
                <KPICard icon={Store} label="Parceiros" value="156" color="" />
                <KPICard icon={DollarSign} label="Vendas Potenciais" value="R$ 43k" color="" />
                <KPICard icon={TrendingUp} label="Crescimento" value="+412" color="" />
            </section>

            {/* Gestão Central */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Botão Monetização */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-white text-[#1E5BFF] p-8 flex flex-col items-center text-center gap-5 active:scale-[0.99] transition-all group"
                >
                    <div className="w-14 h-14 bg-[#1E5BFF] flex items-center justify-center text-white">
                        <Presentation size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tighter">Modelo de Monetização</h3>
                      <p className="text-xs text-[#1E5BFF]/70 mt-2 font-bold leading-tight">Projeções, métricas e inventário detalhado para investidores.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#1E5BFF] text-[10px] font-black uppercase tracking-widest mt-1 group-hover:gap-4 transition-all">
                        Abrir Relatório <ChevronRight size={14} />
                    </div>
                </button>

                {/* Lista de Novas Lojas */}
                <div className="bg-white/5 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Solicitações</h3>
                        <span className="text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Pendente</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Sushi Taquara', cat: 'Alimentação' },
                            { name: 'Dra. Ana Pet', cat: 'Saúde' },
                            { name: 'Mecânica JPA', cat: 'Autos' }
                        ].map((item, i) => (
                            <div key={i} className="px-2 py-3.5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-white/10 flex items-center justify-center text-white/60 group-hover:bg-white group-hover:text-[#1E5BFF] transition-colors">
                                        <Store size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white tracking-tight leading-none mb-1">{item.name}</p>
                                        <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">{item.cat}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-white/20 group-hover:text-white transition-colors" size={20} />
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 text-[9px] font-black text-white/40 uppercase tracking-[0.3em] text-center hover:text-white transition-colors">Ver todas</button>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-white/5 p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#1E5BFF] transition-all group">
                    <Zap className="text-white group-active:text-[#1E5BFF]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white group-active:text-[#1E5BFF]">Push Global</span>
                </button>
                <button className="bg-white/5 p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#1E5BFF] transition-all group">
                    <Globe className="text-white group-active:text-[#1E5BFF]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white group-active:text-[#1E5BFF]">Broadcast</span>
                </button>
                <button className="bg-white/5 p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#1E5BFF] transition-all group">
                    <Mail className="text-white group-active:text-[#1E5BFF]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white group-active:text-[#1E5BFF]">Newsletter</span>
                </button>
                <button className="bg-white/5 p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#1E5BFF] transition-all group">
                    <Search className="text-white group-active:text-[#1E5BFF]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white group-active:text-[#1E5BFF]">Audit Logs</span>
                </button>
            </div>
          </>
        ) : (
          renderInvestorModel()
        )}

      </main>

      <footer className="mt-auto py-10 text-center opacity-40">
        <p className="text-[9px] font-black uppercase tracking-[0.7em] text-white">Localizei JPA Core 1.1.2</p>
      </footer>
    </div>
  );
};
