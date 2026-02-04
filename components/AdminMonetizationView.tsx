
import React from 'react';
import { 
  Coins, 
  Zap, 
  LayoutGrid, 
  Crown, 
  Home, 
  UserCheck, 
  Info,
  TrendingUp,
  Tag,
  ShoppingBag,
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
    description: 'Lojista paga por dia para aparecer em destaque no topo das listas de lojas e serviços no bairro selecionado.',
    value: 'R$ 0,90 / dia',
    status: 'Ativa',
    observations: 'Valor fixo promocional de lançamento. Cobrança pré-paga.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    id: 'classifieds',
    name: 'Classificados',
    description: 'Taxa para publicação de anúncios adicionais ou em categorias de alta concorrência.',
    value: 'R$ 29,99 / unit.',
    status: 'Ativa',
    observations: 'Fase de testes nos bairros Freguesia e Taquara.',
    icon: ShoppingBag,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 'coupons',
    name: 'Cupons',
    description: 'Comissão sobre resgates de cupons ou taxa fixa por campanha de desconto ativa.',
    value: 'A definir',
    status: 'Inativa',
    observations: 'Modelo de performance (CPA) em estudo.',
    icon: Tag,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    id: 'subscriptions',
    name: 'Planos Mensais',
    description: 'Planos para lojistas (Empresa Bairro, Master Imobiliário) com ferramentas avançadas.',
    value: 'R$ 49,90 a R$ 199,90',
    status: 'Ativa',
    observations: 'Assinaturas recorrentes via cartão ou pix mensal.',
    icon: UserCheck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  }
];

export const AdminMonetizationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <section className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-5 relative z-10 text-center md:text-left">
                <div className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-500 shadow-inner border border-blue-500/20">
                    <Coins size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Faturamento do App</h2>
                    <p className="text-sm text-slate-400 font-medium max-w-md">Painel analítico das fontes de receita e tabela de preços ativa no ecossistema Localizei JPA.</p>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 shrink-0">
                <TrendingUp size={18} className="text-emerald-500" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Metas: Mar/2024</span>
            </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MONETIZATION_ITEMS.map((item) => (
                <div key={item.id} className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 flex flex-col shadow-sm group hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-sm border border-current opacity-70`}>
                            <item.icon size={28} />
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${
                            item.status === 'Ativa' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-white/5 text-slate-500 border-white/10'
                        }`}>
                            {item.status}
                        </span>
                    </div>

                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium mb-8 flex-1">
                        {item.description}
                    </p>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Custo Base</span>
                            <span className={`text-lg font-black italic leading-none ${item.value === 'A definir' ? 'text-slate-600' : 'text-[#1E5BFF]'}`}>
                                {item.value}
                            </span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl flex gap-3">
                            <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 font-bold leading-tight uppercase tracking-tight">
                                {item.observations}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>

        <section className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/20 flex gap-4 items-start mb-20">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <div className="space-y-1">
                <p className="text-xs text-amber-200 font-black uppercase tracking-widest leading-none">Aviso aos Administradores</p>
                <p className="text-xs text-amber-400/80 font-medium leading-relaxed">
                    A tabela de preços reflete as configurações globais do banco de dados. Alterações impactam diretamente no checkout dos lojistas.
                </p>
            </div>
        </section>
    </div>
  );
};
