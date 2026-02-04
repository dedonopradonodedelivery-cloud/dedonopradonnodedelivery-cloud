
import React, { useState, useEffect } from 'react';
// FIX: Added Loader2, Award, and Sparkles to the imports from lucide-react.
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
  AlertTriangle,
  Users,
  Target,
  Package,
  CheckCircle2,
  XCircle,
  BarChart3,
  Calendar,
  Newspaper,
  Loader2,
  Award,
  Sparkles
} from 'lucide-react';

interface PricingTier {
  label: string;
  value: string;
  isPromo?: boolean;
}

interface MonetizationItem {
  id: string;
  name: string;
  description: string;
  status: 'Ativa' | 'Inativa';
  icon: React.ElementType;
  color: string;
  bg: string;
  capacity?: string;
  unit?: string;
  pricing: {
    base: string;
    founder?: string;
    upfront?: string;
    package_text?: string;
  };
  tiers?: PricingTier[];
  observations?: string;
}

const INITIAL_MONETIZATION_DATA: MonetizationItem[] = [
  {
    id: 'banner_home',
    name: 'Banner Home (Publicidade)',
    description: 'Espaço rotativo no carrossel principal da página inicial. Máxima visibilidade para todos os usuários que abrem o app.',
    status: 'Ativa',
    icon: Home,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    capacity: '36',
    unit: 'posições (4 por bairro)',
    pricing: {
      base: 'R$ 199,90 / mês',
      founder: 'R$ 69,90 / mês',
      upfront: 'R$ 49,90 / mês (à vista)',
      package_text: 'Pacote Fundador: Contrate 3 e ganhe +2 meses (Total 5)'
    }
  },
  {
    id: 'banner_subcat',
    name: 'Banner Subcategorias',
    description: 'Banner exclusivo no topo de cada subcategoria. Ideal para impactar o cliente no momento exato da busca.',
    status: 'Ativa',
    icon: LayoutGrid,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    capacity: '1152',
    unit: 'posições (1 por subcat/bairro)',
    pricing: {
      base: 'R$ 149,90 / mês',
      founder: 'R$ 59,90 / mês',
      upfront: 'R$ 39,90 / mês (à vista)',
      package_text: 'Pacote Fundador: Contrate 3 e ganhe +2 meses (Total 5)'
    }
  },
  {
    id: 'real_estate_plans',
    name: 'Planos Imobiliários',
    description: 'Planos mensais recorrentes para Corretores e Imobiliárias nos Classificados de Imóveis Comerciais.',
    status: 'Ativa',
    icon: Newspaper,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    unit: 'conforme plano',
    pricing: {
      base: 'R$ 49,90 a R$ 199,90'
    },
    tiers: [
      { label: 'PROFISSIONAL LOCAL', value: 'R$ 49,90' },
      { label: 'EMPRESA BAIRRO', value: 'R$ 99,90' },
      { label: 'MASTER IMOBILIÁRIO', value: 'R$ 199,99' }
    ],
    observations: 'Benefícios (limite de posts/destaques) a definir.'
  },
  {
    id: 'jpa_connect',
    name: 'JPA Connect',
    description: 'Grupo de networking presencial e digital. Apenas 1 empresário por nicho de atuação em Jacarepaguá.',
    status: 'Ativa',
    icon: Users,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    capacity: '30',
    unit: 'empresários por grupo',
    pricing: {
      base: 'R$ 200,00 / pessoa / mês'
    },
    observations: 'Inclui reunião presencial semanal com coffee break.'
  },
  {
    id: 'master_sponsor',
    name: 'Patrocinador Master',
    description: 'Destaque institucional premium em 90% das telas do app. Impacto direto em todo o ecossistema local.',
    status: 'Ativa',
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    capacity: '1',
    unit: 'cota única anual/mensal',
    pricing: {
      base: 'R$ 2.500,00 / mês',
      founder: 'R$ 1.500,00 / mês',
      package_text: 'Pacote Fundador: 3 meses pagos + 2 grátis (5 meses totais)'
    }
  },
  {
    id: 'ads_sponsored',
    name: 'Patrocinado / Ads',
    description: 'Destaque rápido no topo das listas orgânicas. Cobrança pré-paga por dia de visibilidade.',
    status: 'Ativa',
    icon: Zap,
    color: 'text-blue-600',
    bg: 'bg-blue-600/10',
    pricing: {
      base: 'R$ 0,90 / dia'
    },
    observations: 'Preço promocional de lançamento.'
  }
];

export const AdminMonetizationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<MonetizationItem[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Carregar estados persistidos
  useEffect(() => {
    const savedStatus = localStorage.getItem('admin_monetization_status');
    if (savedStatus) {
      const statusMap = JSON.parse(savedStatus);
      const merged = INITIAL_MONETIZATION_DATA.map(item => ({
        ...item,
        status: statusMap[item.id] || item.status
      }));
      setItems(merged);
    } else {
      setItems(INITIAL_MONETIZATION_DATA);
    }
  }, []);

  const toggleStatus = (id: string) => {
    setIsUpdating(id);
    
    // Simulação de delay de rede
    setTimeout(() => {
      const updatedItems = items.map(item => {
        if (item.id === id) {
          const newStatus = item.status === 'Ativa' ? 'Inativa' : 'Ativa';
          
          // Auditoria Simulada
          console.log(`[AUDIT] Monetização ${id} alterada para ${newStatus} por ADM em ${new Date().toISOString()}`);
          
          return { ...item, status: newStatus as 'Ativa' | 'Inativa' };
        }
        return item;
      });

      setItems(updatedItems);
      
      // Persistir no LocalStorage
      const statusMap = updatedItems.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.status
      }), {});
      localStorage.setItem('admin_monetization_status', JSON.stringify(statusMap));
      
      setIsUpdating(null);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <section className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-5 relative z-10 text-center md:text-left">
                <div className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-50 shadow-inner border border-blue-500/20">
                    <Coins size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Gestão de Receita</h2>
                    <p className="text-sm text-slate-400 font-medium max-w-md">Controle de ativação e tabela de preços de todas as fontes de renda do Localizei JPA.</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                    <TrendingUp size={18} className="text-emerald-500" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Preços: v2.4 (Mar/24)</span>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Última atualização: Hoje, 14:20</p>
            </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {items.map((item) => (
                <div key={item.id} className={`bg-slate-900 rounded-[2.5rem] border transition-all duration-300 p-8 flex flex-col shadow-sm group ${item.status === 'Inativa' ? 'border-red-500/20 opacity-60 grayscale' : 'border-white/5 hover:border-blue-500/30'}`}>
                    
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-sm border border-current opacity-70 group-hover:scale-110 transition-transform`}>
                            <item.icon size={28} />
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                            <button 
                                onClick={() => toggleStatus(item.id)}
                                disabled={isUpdating === item.id}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                                    item.status === 'Ativa' 
                                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' 
                                    : 'bg-slate-800 text-slate-400 border-white/5'
                                }`}
                            >
                                {isUpdating === item.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : item.status === 'Ativa' ? (
                                    <><CheckCircle2 size={14} /> ATIVA</>
                                ) : (
                                    <><XCircle size={14} /> INATIVA</>
                                )}
                            </button>
                            {item.capacity && (
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                    Capacidade: {item.capacity} {item.unit}
                                </span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{item.name}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                        {item.description}
                    </p>

                    {/* Bloco de Preços */}
                    <div className="space-y-4 pt-6 border-t border-white/5 flex-1">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Preço Base */}
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Preço Base</span>
                                <span className="text-lg font-black text-slate-300 italic">{item.pricing.base}</span>
                            </div>

                            {/* Promoção Fundador */}
                            {item.pricing.founder && (
                                <div className="flex justify-between items-center p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-[#1E5BFF]" />
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Promo Fundador</span>
                                    </div>
                                    <span className="text-lg font-black text-[#1E5BFF]">{item.pricing.founder}</span>
                                </div>
                            )}

                            {/* Pagamento Antecipado */}
                            {item.pricing.upfront && (
                                <div className="flex justify-between items-center px-3">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Antecipado (À vista)</span>
                                    <span className="text-base font-black text-emerald-400">{item.pricing.upfront}</span>
                                </div>
                            )}

                            {/* Tiers/Planos para Imóveis */}
                            {item.tiers && (
                                <div className="space-y-2 pt-2">
                                    {item.tiers.map((tier, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="font-bold text-slate-400 uppercase">{tier.label}</span>
                                            <span className="font-black text-white">{tier.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detalhes do Pacote */}
                        {item.pricing.package_text && (
                            <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex gap-3 items-center">
                                <Sparkles size={14} className="text-amber-500 shrink-0" />
                                <p className="text-[10px] text-amber-200/70 font-bold uppercase tracking-tight">
                                    {item.pricing.package_text}
                                </p>
                            </div>
                        )}

                        {item.observations && (
                            <div className="bg-white/5 p-3 rounded-xl flex gap-3">
                                <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
                                <p className="text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-tight">
                                    Obs: {item.observations}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </section>

        <section className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/20 flex gap-4 items-start mb-10">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <div className="space-y-1">
                <p className="text-xs text-amber-200 font-black uppercase tracking-widest leading-none">Controle Global de Checkout</p>
                <p className="text-xs text-amber-400/80 font-medium leading-relaxed">
                    Monetizações desativadas neste painel são suspensas instantaneamente em todo o aplicativo. O lojista não conseguirá iniciar novos checkouts ou renovações automáticas para itens inativos.
                </p>
            </div>
        </section>
    </div>
  );
};
