
import React from 'react';
import { 
  ChevronLeft, 
  Coins, 
  Zap, 
  LayoutGrid, 
  Crown, 
  Home, 
  UserCheck, 
  Info,
  DollarSign,
  TrendingUp,
  Tag,
  ShoppingBag,
  ArrowUpRight,
  // FIX: Added missing AlertTriangle import from lucide-react
  AlertTriangle
} from 'lucide-react';

interface MonetizationItem {
  id: string;
  name: string;
  description: string;
  value: string;
  status: 'Ativa' | 'Inativa';
  observations: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const MONETIZATION_ITEMS: MonetizationItem[] = [
  {
    id: 'ads',
    name: 'Patrocinado / Ads',
    description: 'Lojista paga por dia para aparecer em destaque no topo das listas de lojas e serviços.',
    value: 'R$ 0,90 / dia',
    status: 'Ativa',
    observations: 'Valor fixo promocional de lançamento. Cobrança pré-paga.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  {
    id: 'classifieds',
    name: 'Classificados Avulsos',
    description: 'Custo para publicar anúncios adicionais além do limite gratuito (2 por mês).',
    value: 'R$ 19,90 / anúncio',
    status: 'Ativa',
    observations: 'Válido por 30 dias. Inclui destaque visual na categoria.',
    icon: ShoppingBag,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    id: 'subcategory_banner',
    name: 'Banner em Subcategoria',
    description: 'Banner fixo no topo de uma subcategoria (ex: Pizzarias) em um bairro específico.',
    value: 'R$ 29,90 / mês',
    status: 'Ativa',
    observations: 'Apenas 1 slot disponível por subcategoria para exclusividade.',
    icon: LayoutGrid,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 'home_banner',
    name: 'Banners Home',
    description: 'Banners de grande formato no carrossel da página inicial do aplicativo.',
    value: 'R$ 69,90 / mês',
    status: 'Ativa',
    observations: 'Máxima visibilidade. Limitado a 4 anunciantes por bairro.',
    icon: Home,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 'jpa_connect',
    name: 'JPA Connect',
    description: 'Assinatura para participar do grupo de networking e eventos empresariais.',
    value: 'R$ 200,00 / mês',
    status: 'Ativa',
    observations: 'Foco em lojistas e profissionais liberais. Encontros semanais.',
    icon: UserCheck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  {
    id: 'master_sponsor',
    name: 'Patrocinador Master',
    description: 'Destaque máximo em todo o app: Splash screen, topo da Home e rodapé global.',
    value: 'R$ 1.000,00 / mês',
    status: 'Ativa',
    observations: 'Apenas 1 marca permitida por período. Atualmente: Grupo Esquematiza.',
    icon: Crown,
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/30'
  }
];

export const AdminMonetizationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans animate-in fade-in duration-500 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-black text-lg text-white uppercase tracking-tighter leading-none">Monetizações</h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Fontes de Receita</p>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-10 pb-32">
        
        {/* RESUMO NO TOPO */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-[1.5rem] flex items-center justify-center text-blue-600">
                    <Coins size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Visão Estratégica</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Atualmente o app conta com {MONETIZATION_ITEMS.length} canais de faturamento ativos.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp size={18} className="text-emerald-600" />
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Modelo de Baixo Custo / Alto Volume</span>
            </div>
        </section>

        {/* LISTA DE MONETIZAÇÕES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MONETIZATION_ITEMS.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col shadow-sm group hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                            <item.icon size={24} />
                        </div>
                        <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800">
                            {item.status}
                        </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{item.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                        {item.description}
                    </p>

                    <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Atual</span>
                            <span className="text-base font-black text-blue-600 dark:text-blue-400 italic leading-none">{item.value}</span>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl flex gap-3">
                            <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-tight uppercase">
                                {item.observations}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>

        {/* FOOTER INFO */}
        <section className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-800/30 flex gap-4 items-start">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <div className="space-y-1">
                <p className="text-xs text-amber-900 dark:text-amber-200 font-black uppercase tracking-widest leading-none">Manual do Administrador</p>
                <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                    Estes valores são configurados via código no MVP v1. Para alteração massiva ou sazonal, consulte o arquivo de constantes do sistema. Mudanças aqui documentadas refletem o modelo de negócio atual apresentado aos parceiros.
                </p>
            </div>
        </section>

      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 flex items-center justify-center opacity-30 pointer-events-none bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Localizei JPA • Financeiro v1.0</p>
      </div>
    </div>
  );
};
