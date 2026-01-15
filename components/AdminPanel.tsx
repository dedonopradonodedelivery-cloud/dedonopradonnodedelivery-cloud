
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
  TrendingUp as TrendingIcon
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: SupabaseUser | null;
  onNavigateToApp: () => void;
  onLogout: () => void;
}

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const KPICard: React.FC<{ icon: any, label: string, value: string }> = ({ icon: Icon, label, value }) => (
  <div className="bg-[#111827] p-6 flex flex-col items-center justify-center text-center h-36 border border-white/5">
    <div className="w-10 h-10 flex items-center justify-center bg-white/5 text-white mb-4">
      <Icon size={20} />
    </div>
    <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-1.5">{label}</p>
    <p className="text-2xl font-black text-white leading-none tracking-tighter">{value}</p>
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
    <div className="animate-in slide-in-from-right duration-500 space-y-12 bg-[#0F172A] min-h-screen pb-32 text-white">
      {/* Executive Header */}
      <div className="flex items-center justify-between px-2 pt-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="p-2.5 bg-[#111827] text-[#9CA3AF] hover:text-[#059669] transition-colors border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Apresentação Executiva</h2>
            <p className="text-[10px] text-[#059669] font-black uppercase tracking-[0.25em] mt-2">Modelo de Negócio e Monetização v1.1.2</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="px-5 py-2.5 bg-[#111827] text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.3em] border border-white/5">Strictly Confidential</span>
        </div>
      </div>

      {/* Visão Estratégica - Reduzida para foco */}
      <section className="px-2">
        <div className="bg-[#111827] p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#059669]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-5">
                <Globe size={16} className="text-[#059669]" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Visão Estratégica do Marketplace</h3>
            </div>
            <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium max-w-2xl">
              Plataforma hyperlocal projetada para Jacarepaguá. O modelo combina <span className="text-white">mídia programática de bairro</span> com ferramentas de performance B2B, escalando receitas com custo marginal próximo de zero.
            </p>
        </div>
      </section>

      {/* BLOCO 01 - Patrocinador Master */}
      <section className="px-2">
        <div className="bg-[#111827] p-8 border border-white/5 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-black text-[11px] text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">01. Patrocinador Master (Cota Global)</h4>
              <p className="text-xl font-bold text-white max-w-md leading-snug">Exposição fixa e exclusiva em 100% dos pontos de contato do app.</p>
            </div>
            <span className="text-white text-[9px] font-black uppercase tracking-widest bg-[#059669] px-3 py-1 shadow-lg shadow-[#059669]/20">Inventory Sold Out</span>
          </div>
          
          <div className="flex gap-12 items-end pt-4 border-t border-white/5">
            <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-1.5">Recorrência Mensal</p>
                <p className="text-5xl font-black text-[#059669] tracking-tighter tabular-nums">R$ 4.000</p>
            </div>
            <div className="pb-1">
                <p className="text-[9px] font-black text-[#9CA3AF]/40 uppercase tracking-[0.2em] mb-1.5">Projeção Anual</p>
                <p className="text-2xl font-black text-white/20 tabular-nums">R$ 48.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCOS 02 E 03 - Mídia de Display */}
      <section className="px-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 02 */}
            <div className="bg-[#111827] p-8 border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-[11px] text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">02. Banners Home (Microrregiões)</h4>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-8">Segmentação geográfica por bairro para alta relevância local.</p>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Capacidade</span>
                        <span className="text-lg font-black text-white">36 Slots</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Teto de Receita</span>
                        <span className="text-2xl font-black text-[#059669] tabular-nums">R$ 10.692</span>
                    </div>
                </div>
            </div>

            {/* Bloco 03 */}
            <div className="bg-[#111827] p-8 border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-[11px] text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">03. Banners Categorias (Nicho)</h4>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-8">Segmentação por intenção de compra imediata por segmento.</p>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Capacidade</span>
                        <span className="text-lg font-black text-white">144 Slots</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Teto de Receita</span>
                        <span className="text-2xl font-black text-[#059669] tabular-nums">R$ 28.368</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* PERFORMANCE ADS - LISTA ESTRUTURADA */}
      <section className="px-2">
        <div className="bg-[#111827] p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-10">
                <TrendingIcon size={16} className="text-[#059669]" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Micro-Ads e Performance (PME)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
              {[
                { label: 'Ads Merchant Básico', price: 'R$ 29/mês', desc: 'Presença digital garantida no bairro' },
                { label: 'Ads Merchant Premium', price: 'R$ 117/mês', desc: 'Algoritmo de prioridade no topo da lista' },
                { label: 'Portal de Vagas JPA', price: 'R$ 57/vaga', desc: 'Recrutamento local de alta conversão' },
                { label: 'Pack de Cupons Semanal', price: 'R$ 39/sem', desc: 'Ações de fluxo rápido de clientes' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:md:border-b-0">
                   <div className="max-w-[70%]">
                      <h5 className="font-bold text-sm text-white uppercase tracking-tight mb-1">{item.label}</h5>
                      <p className="text-[10px] text-[#9CA3AF] font-medium leading-relaxed">{item.desc}</p>
                   </div>
                   <p className="font-black text-[#059669] text-base tabular-nums whitespace-nowrap">{item.price}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* LEADS MODEL - IMPACT BLOCK */}
      <section className="px-2">
        <div className="bg-[#111827] p-8 border border-[#059669]/30 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#059669]"></div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#059669]/10 rounded-2xl flex items-center justify-center text-[#059669] border border-[#059669]/20">
               <Zap size={32} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="max-w-xs text-center md:text-left">
               <h4 className="text-xl font-black uppercase tracking-tighter text-white">Modelo de Leads Diretos</h4>
               <p className="text-[#9CA3AF] text-sm font-medium mt-1.5 leading-relaxed">Monetização por cotação gerada para prestadores de serviço em tempo real.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.25em] mb-2">Custo Fixo por Lead</p>
            <p className="text-5xl font-black text-[#059669] tracking-tighter tabular-nums">R$ 3,90</p>
          </div>
        </div>
      </section>

      {/* FINAL FINANCIAL SUMMARY */}
      <section className="px-2">
          <div className="bg-white p-12 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-2 justify-center md:justify-start text-[#0F172A] opacity-30 mb-2">
                    <BarChart3 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Finance Projection</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-[#0F172A]">Faturamento Potencial Mensal</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Cenário Jacarepaguá Base v1.1.2</p>
            </div>
            <div className="text-center md:text-right">
                <p className="text-[10px] font-black text-[#059669] uppercase tracking-[0.3em] mb-3">Total Bruto Estimado (Mídia Estática)</p>
                <div className="flex items-baseline justify-center md:justify-end gap-1">
                    <span className="text-2xl font-black text-[#059669]">R$</span>
                    <h2 className="text-8xl font-black tracking-tighter text-[#059669] leading-none tabular-nums">43.060</h2>
                </div>
            </div>
          </div>
      </section>

      {/* Strategic Footer */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 pt-6">
        {[
          { icon: Repeat, label: 'Recorrência', text: 'Cashflow baseado em assinaturas e créditos pré-pagos.' },
          { icon: Layers, label: 'Escala Modular', text: 'Infraestrutura pronta para replicação em novas regiões.' },
          { icon: Target, label: 'Atividade Real', text: 'Foco total em ROI e geração de valor para o lojista.' }
        ].map((v, i) => (
          <div key={i} className="bg-[#111827] p-6 border border-white/5 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#059669]/5 flex items-center justify-center">
                <v.icon size={20} className="text-[#059669]" />
            </div>
            <div>
              <p className="font-black text-[10px] uppercase tracking-[0.25em] text-white mb-2">{v.label}</p>
              <p className="text-xs font-medium text-[#9CA3AF] leading-relaxed">{v.text}</p>
            </div>
          </div>
        ))}
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] font-sans animate-in fade-in duration-500 flex flex-col overflow-x-hidden text-white">
      {/* Header Admin */}
      <header className="bg-[#111827] text-white px-6 py-8 flex items-center justify-between shrink-0 border-b border-white/5">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white text-[#0F172A] flex items-center justify-center shadow-lg">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-xl uppercase tracking-tighter leading-none text-white">Centro de Operações</h1>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.25em] mt-2.5">Painel Gestor Localizei v2.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <button 
              onClick={onNavigateToApp}
              className="hidden md:flex text-[#9CA3AF] hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors items-center gap-2.5"
          >
              <Eye size={18} /> Modo Usuário
          </button>
          <button onClick={onLogout} className="p-3 text-[#9CA3AF] hover:text-red-500 transition-colors bg-white/5 border border-white/5">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto w-full space-y-10">
        
        {activeView === 'dashboard' ? (
          <>
            {/* Grid de KPIs Uniforme */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard icon={Users} label="Base Ativa" value="2.842" />
                <KPICard icon={Store} label="Lojistas" value="156" />
                <KPICard icon={DollarSign} label="Projeção" value="R$ 43k" />
                <KPICard icon={TrendingUp} label="Crescimento" value="+412" />
            </section>

            {/* Gestão Central - Duas Colunas Equilibradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Botão Monetização */}
                <button 
                  onClick={() => setActiveView('monetization_model')}
                  className="bg-white text-[#0F172A] p-10 flex flex-col items-center justify-center text-center gap-8 active:scale-[0.99] transition-all group border-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                    <div className="w-20 h-20 bg-[#0F172A] flex items-center justify-center text-white rounded-none">
                        <Presentation size={40} />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase tracking-tighter mb-3">Apresentação para Investidor</h3>
                      <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-[240px] mx-auto">Relatório analítico de monetização, teto de faturamento e inventário digital.</p>
                    </div>
                    <div className="flex items-center gap-3 text-[#1E5BFF] text-[12px] font-black uppercase tracking-widest group-hover:gap-6 transition-all border-b-2 border-[#1E5BFF] pb-1">
                        Acessar Estratégia <ChevronRight size={16} strokeWidth={3} />
                    </div>
                </button>

                {/* Lista de Novas Lojas */}
                <div className="bg-[#111827] p-8 flex flex-col border border-white/5">
                    <div className="flex justify-between items-center mb-8 px-1">
                        <div>
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">Aguardando Ativação</h3>
                          <p className="text-[10px] text-[#9CA3AF] mt-2 font-bold uppercase tracking-wider">Solicitações de novos lojistas</p>
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
                                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-[#9CA3AF] group-hover:bg-white group-hover:text-[#0F172A] transition-colors shadow-inner">
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

            {/* Ações Rápidas - Grid 4 Colunas */}
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
