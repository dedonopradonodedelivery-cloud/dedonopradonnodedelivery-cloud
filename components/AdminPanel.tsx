
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
  CheckCircle2,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onNavigateToApp: () => void;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const KPICard: React.FC<{ icon: any, label: string, value: string }> = ({ icon: Icon, label, value }) => (
  <div className="bg-[#111827] p-5 flex flex-col gap-2">
    <div className="w-10 h-10 flex items-center justify-center bg-white/5 text-white rounded-none">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.15em]">{label}</p>
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
    <div className="animate-in slide-in-from-right duration-500 space-y-10 bg-[#0F172A] min-h-screen pb-24 text-white">
      {/* Executive Header - Investor Palette */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-1 text-[#9CA3AF] hover:text-[#059669] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display">Modelo de Monetização</h2>
            <p className="text-[10px] text-[#059669] font-black uppercase tracking-[0.2em] mt-1">Plano de Expansão e Receita JPA v1.1.2</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-4 py-1.5 bg-[#111827] text-[#9CA3AF] text-[9px] font-black uppercase tracking-[0.3em] border border-white/5">IP Protected</span>
        </div>
      </div>

      {/* Visão Geral */}
      <section className="max-w-xl px-6">
        <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-[#059669]" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Visão Estratégica</h3>
        </div>
        <p className="text-[#9CA3AF] text-base leading-relaxed font-medium">
          O Localizei JPA opera como um ecossistema de micro-ads geolocalizados. O modelo é focado em alta densidade por bairro, garantindo escalabilidade via replicação de inventário digital com custo marginal zero.
        </p>
      </section>

      {/* Canais de Receita - Emerald Highlights */}
      <div className="space-y-10 px-6">
        
        {/* 1. Patrocinador Master */}
        <div className="space-y-4">
          <div className="flex justify-between items-center max-w-lg">
            <h4 className="font-black text-[10px] text-[#9CA3AF] uppercase tracking-[0.15em]">01. Patrocinador Master</h4>
            <span className="text-white text-[8px] font-black uppercase tracking-widest bg-[#059669] px-2 py-0.5 shadow-lg shadow-[#059669]/20">Cota Única</span>
          </div>
          <p className="text-lg font-bold text-white max-w-lg">Posicionamento institucional fixo em todas as páginas do ecossistema.</p>
          <div className="flex gap-8 items-baseline">
            <div>
                <p className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Fee Mensal</p>
                <p className="text-3xl font-black text-[#059669] tracking-tighter">R$ 4.000</p>
            </div>
            <div>
                <p className="text-[8px] font-black text-[#9CA3AF]/40 uppercase tracking-widest mb-1">Mínimo Anual</p>
                <p className="text-xl font-black text-white/20">R$ 48k</p>
            </div>
          </div>
        </div>

        {/* 2. Banners Home */}
        <div className="space-y-5">
          <h4 className="font-black text-[10px] text-[#9CA3AF] uppercase tracking-[0.15em]">02. Banners Home (9 Micro-regiões)</h4>
          <p className="text-base text-[#9CA3AF] leading-relaxed max-w-lg">
            Impacto visual no funil de entrada, segmentado por bairro do morador.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 bg-[#111827] px-8 border-l-2 border-[#059669]">
            <div>
              <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Slots</p>
              <p className="text-xl font-black text-white">36 Vagas</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Ticket Médio</p>
              <p className="text-xl font-black text-[#059669]">R$ 297</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Potencial/Mês</p>
              <p className="text-xl font-black text-[#059669]">R$ 10.692</p>
            </div>
          </div>
        </div>

        {/* 3. Banners Categorias */}
        <div className="space-y-5">
          <h4 className="font-black text-[10px] text-[#9CA3AF] uppercase tracking-[0.15em]">03. Inventário de Categorias</h4>
          <p className="text-base text-[#9CA3AF] leading-relaxed max-w-lg">
            Ads por nicho (ex: Pet, Comida, Saúde) com alta intenção de compra.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 bg-[#111827] px-8 border-l-2 border-[#059669]">
            <div>
              <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Capacidade</p>
              <p className="text-xl font-black text-white">144 Slots</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Ticket Médio</p>
              <p className="text-xl font-black text-[#059669]">R$ 197</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1.5">Potencial/Mês</p>
              <p className="text-xl font-black text-[#059669]">R$ 28.368</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ads e Performance */}
      <section className="space-y-6 px-6">
        <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-[#059669]" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Receita Recorrente (Micro-Ads)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          {[
            { label: 'Merchant Ads Básico', price: 'R$ 29/mês', desc: 'Presença garantida' },
            { label: 'Merchant Ads Premium', price: 'R$ 117/mês', desc: 'Prioridade no topo' },
            { label: 'HR Portal Jobs', price: 'R$ 57/vaga', desc: 'Recrutamento local' },
            { label: 'Coupon Packs', price: 'R$ 39/sem', desc: 'Incentivo de fluxo' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
               <div>
                  <h5 className="font-black text-sm text-white uppercase tracking-tight">{item.label}</h5>
                  <p className="text-[9px] text-[#9CA3AF] font-black uppercase mt-0.5 tracking-widest">{item.desc}</p>
               </div>
               <p className="font-black text-[#059669] text-sm">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Leads - Emerald CTA Style */}
      <div className="bg-[#111827] mx-6 p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-[#059669]/20">
          <div className="flex items-center gap-6">
            <Zap size={28} className="text-[#059669]" fill="currentColor" />
            <div>
               <h4 className="text-xl font-black uppercase tracking-tighter leading-none text-white">Service Lead Model</h4>
               <p className="text-[#9CA3AF] text-[10px] font-medium mt-1 uppercase tracking-widest">Cotações diretas em tempo real.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-1">CPA (Custo por Aquisição)</p>
            <p className="text-4xl font-black text-[#059669] tracking-tighter leading-none">R$ 3,90</p>
          </div>
      </div>

      {/* Resumo Financeiro Final - Credibility Section */}
      <section className="bg-[#111827] mx-6 p-10 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
            <BarChart3 size={20} className="text-[#059669]" />
            <h3 className="text-xl font-black uppercase tracking-tighter font-display text-white">Projeção Bruta Mensal</h3>
        </div>
        <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center opacity-80">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Mídia Fixa (Master)</span>
                <span className="text-base font-bold text-white">R$ 4.000</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Display Geolocalizado (Home)</span>
                <span className="text-base font-bold text-white">R$ 10.692</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">Display Segmentado (Categorias)</span>
                <span className="text-base font-bold text-white">R$ 28.368</span>
            </div>
            <div className="h-px bg-white/5 mt-4"></div>
        </div>
        <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-[#059669] uppercase tracking-[0.3em] mb-2">Total Estimado de Mídia Estática</p>
            <h2 className="text-7xl font-black tracking-tighter text-[#059669] leading-none">R$ 43.060<span className="text-2xl">,00</span></h2>
            <p className="text-[9px] text-[#9CA3AF] mt-6 italic font-bold uppercase tracking-widest">Exclui comissões de transação e leads.</p>
        </div>
      </section>

      {/* Strategic Values */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pt-8 pb-16 opacity-60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#059669]"><Repeat size={16} /><span className="font-black text-[9px] uppercase tracking-widest">Recorrência</span></div>
          <p className="text-[11px] font-bold text-[#9CA3AF] leading-tight">Fluxo de caixa garantido por assinatura.</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#059669]"><Layers size={16} /><span className="font-black text-[9px] uppercase tracking-widest">Escalabilidade</span></div>
          <p className="text-[11px] font-bold text-[#9CA3AF] leading-tight">Modelo replicável para qualquer bairro.</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#059669]"><Target size={16} /><span className="font-black text-[9px] uppercase tracking-widest">Atividade</span></div>
          <p className="text-[11px] font-bold text-[#9CA3AF] leading-tight">Foco em ROAS para o lojista local.</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden text-white">
      {/* Header Admin */}
      <header className="bg-[#111827] text-white px-6 py-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white text-[#0F172A] flex items-center justify-center">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-lg uppercase tracking-tighter leading-none text-white">Painel ADM</h1>
            <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mt-1.5">Localizei JPA Business</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <button 
              onClick={onNavigateToApp}
              className="text-[#9CA3AF] hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
          >
              <Eye size={16} /> Modo Usuário
          </button>
          <button onClick={onLogout} className="text-[#9CA3AF] hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-10 max-w-4xl mx-auto w-full bg-[#0F172A]">
        
        {activeView === 'dashboard' ? (
          <>
            {/* KPIs */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard icon={Users} label="Base Usuários" value="2.842" />
                <KPICard icon={Store} label="Parceiros" value="156" />
                <KPICard icon={DollarSign} label="Vendas Potenciais" value="R$ 43k" />
                <KPICard icon={TrendingUp} label="Crescimento" value="+412" />
            </section>

            {/* Gestão Central */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Botão Monetização */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-[#111827] text-white p-8 flex flex-col items-center text-center gap-5 active:scale-[0.99] transition-all group"
                >
                    <div className="w-14 h-14 bg-white/5 flex items-center justify-center text-white">
                        <Presentation size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tighter">Modelo de Monetização</h3>
                      <p className="text-xs text-[#9CA3AF] mt-2 font-bold leading-tight">Projeções, métricas e inventário detalhado para investidores.</p>
                    </div>
                    <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest mt-1 group-hover:gap-4 transition-all">
                        Abrir Relatório <ChevronRight size={14} />
                    </div>
                </button>

                {/* Lista de Novas Lojas */}
                <div className="bg-[#111827] p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Solicitações</h3>
                        <span className="text-amber-500 text-[9px] font-black uppercase tracking-widest animate-pulse">Pendente</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Sushi Taquara', cat: 'Alimentação' },
                            { name: 'Dra. Ana Pet', cat: 'Saúde' },
                            { name: 'Mecânica JPA', cat: 'Autos' }
                        ].map((item, i) => (
                            <div key={i} className="px-2 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-white/5 flex items-center justify-center text-[#9CA3AF] group-hover:bg-white group-hover:text-[#0F172A] transition-colors">
                                        <Store size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white tracking-tight leading-none mb-1">{item.name}</p>
                                        <p className="text-[9px] text-[#9CA3AF] uppercase font-black tracking-widest">{item.cat}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-white/20 group-hover:text-white transition-colors" size={20} />
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] text-center hover:text-white transition-colors">Ver todas</button>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-[#111827] p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#0F172A] transition-all group">
                    <Zap className="text-white group-active:text-[#0F172A]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#9CA3AF] group-active:text-[#0F172A]">Push Global</span>
                </button>
                <button className="bg-[#111827] p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#0F172A] transition-all group">
                    <Globe className="text-white group-active:text-[#0F172A]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#9CA3AF] group-active:text-[#0F172A]">Broadcast</span>
                </button>
                <button className="bg-[#111827] p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#0F172A] transition-all group">
                    <Mail className="text-white group-active:text-[#0F172A]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#9CA3AF] group-active:text-[#0F172A]">Newsletter</span>
                </button>
                <button className="bg-[#111827] p-5 flex flex-col items-center gap-2 active:bg-white active:text-[#0F172A] transition-all group">
                    <Search className="text-white group-active:text-[#0F172A]" size={20} />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#9CA3AF] group-active:text-[#0F172A]">Audit Logs</span>
                </button>
            </div>
          </>
        ) : (
          renderInvestorModel()
        )}

      </main>

      <footer className="mt-auto py-10 text-center opacity-40">
        <p className="text-[9px] font-black uppercase tracking-[0.7em] text-[#9CA3AF]">Localizei JPA Core 1.1.2</p>
      </footer>
    </div>
  );
};
