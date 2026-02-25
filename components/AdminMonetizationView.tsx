
import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Zap, 
  LayoutGrid, 
  Crown, 
  Home, 
  Info,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  Newspaper,
  Loader2,
  Award,
  ShieldCheck,
  ArrowDownToLine,
  Gem
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
    baseValue: number;
    founder?: string;
    founderValue?: number;
    upfront?: string;
  };
  founder_price_locked?: boolean;
  founder_price_duration_months?: number;
  founder_price_note?: string;
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
    founder_price_locked: true,
    founder_price_duration_months: 12,
    founder_price_note: 'Válido para fundadores que contratarem no 1º mês',
    pricing: {
      base: 'R$ 199,90 / mês',
      baseValue: 199.90,
      founder: 'R$ 69,90 / mês',
      founderValue: 69.90,
      upfront: 'R$ 49,90 / mês (à vista)'
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
    founder_price_locked: true,
    founder_price_duration_months: 12,
    founder_price_note: 'Preço travado para contratos de inauguração',
    pricing: {
      base: 'R$ 159,90 / mês',
      baseValue: 159.90,
      founder: 'R$ 49,90 / mês',
      founderValue: 49.90,
      upfront: 'R$ 39,90 / mês (à vista)'
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
      base: 'R$ 49,90 a R$ 199,90',
      baseValue: 49.90
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
      base: 'R$ 200,00 / pessoa / mês',
      baseValue: 200.00
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
    founder_price_locked: false,
    pricing: {
      base: 'R$ 4.000,00 / mês',
      baseValue: 4000.00,
      founder: 'R$ 1.497,00 / mês',
      founderValue: 1497.00
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
      base: 'R$ 0,90 / dia',
      baseValue: 0.90
    },
    observations: 'Preço promocional de lançamento.'
  }
];

export const AdminMonetizationView: React.FC<object> = () => {
  const [items, setItems] = useState<MonetizationItem[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

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
    setTimeout(() => {
      const updatedItems = items.map(item => {
        if (item.id === id) {
          const newStatus = item.status === 'Ativa' ? 'Inativa' : 'Ativa';
          return { ...item, status: newStatus as 'Ativa' | 'Inativa' };
        }
        return item;
      });
      setItems(updatedItems);
      const statusMap = updatedItems.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.status }), {});
      localStorage.setItem('admin_monetization_status', JSON.stringify(statusMap));
      setIsUpdating(null);
    }, 600);
  };

  const calculateVantage = (item: MonetizationItem) => {
    if (!item.pricing.founderValue || !item.pricing.baseValue) return null;
    
    const monthlySaving = item.pricing.baseValue - item.pricing.founderValue;
    // Usando precisão de uma casa decimal para alinhar com o requisito de 62.6%
    const discountPercent = parseFloat(((monthlySaving / item.pricing.baseValue) * 100).toFixed(1));
    const annualSaving = monthlySaving * 12;

    return {
      discountPercent,
      monthlySaving,
      annualSaving
    };
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
                    <p className="text-sm text-slate-400 font-medium max-w-md">Controle de ativação e análise de ROI para os Planos Fundadores.</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                    <TrendingUp size={18} className="text-emerald-500" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Preços: v2.7 (Build Fix)</span>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Última atualização: Hoje, 18:45</p>
            </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {items.map((item) => {
                const vantage = calculateVantage(item);
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className={`bg-slate-900 rounded-[2.5rem] border transition-all duration-300 p-8 flex flex-col shadow-sm group ${item.status === 'Inativa' ? 'border-red-500/20 opacity-60 grayscale' : 'border-white/5 hover:border-blue-500/30'}`}>
                      
                      <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-sm border border-current opacity-70 group-hover:scale-110 transition-transform`}>
                              <ItemIcon size={28} />
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
                                  {isUpdating === item.id ? <Loader2 size={14} className="animate-spin" /> : item.status === 'Ativa' ? <><CheckCircle2 size={14} /> ATIVA</> : <><XCircle size={14} /> INATIVA</>}
                              </button>
                              {item.capacity && (
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                      Capacidade: {item.capacity} {item.unit}
                                  </span>
                              )}
                          </div>
                      </div>

                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                          {item.description}
                      </p>

                      <div className="space-y-6 pt-6 border-t border-white/5 flex-1">
                          <div className="space-y-4">
                              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preço Padrão</span>
                                  <span className="text-2xl font-black text-white">{item.pricing.base}</span>
                              </div>

                              {item.founder_price_locked && (
                                <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] animate-in zoom-in-95 duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                      <Gem size={32} className="text-amber-500" />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/30 shadow-inner">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Fundador Anual Protegido</h4>
                                            <p className="text-[9px] text-amber-400 font-bold uppercase mt-1">valor garantido por 12 meses</p>
                                        </div>
                                    </div>

                                    {vantage && (
                                      <div className="space-y-4 mt-4">
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Preço Fundador</p>
                                            <p className="text-lg font-black text-[#1E5BFF] leading-none">{item.pricing.founder}</p>
                                          </div>
                                          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Economia/mês</p>
                                            <p className="text-lg font-black text-emerald-400 leading-none">R$ {vantage.monthlySaving.toFixed(2)}</p>
                                          </div>
                                        </div>

                                        <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <ArrowDownToLine size={14} className="text-emerald-400" />
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Economia Anual (12 Meses)</p>
                                          </div>
                                          <p className="text-lg font-black text-emerald-400">R$ {vantage.annualSaving.toFixed(2)}</p>
                                        </div>

                                        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg">
                                           {vantage.discountPercent}% OFF
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}

                              {item.id === 'master_sponsor' && vantage && (
                                <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-[#1E5BFF]">
                                              <Award size={18} />
                                            </div>
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Valor Lançamento</span>
                                        </div>
                                        <span className="text-xl font-black text-[#1E5BFF]">{item.pricing.founder}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-slate-500 uppercase">Economia Mensal</span>
                                        <span className="text-emerald-500">R$ {vantage.monthlySaving.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-slate-500 uppercase">Desconto Especial</span>
                                        <span className="text-blue-500">{vantage.discountPercent}% OFF</span>
                                    </div>
                                </div>
                              )}

                              {item.tiers && (
                                  <div className="space-y-2 pt-2">
                                      {item.tiers.map((tier, idx) => (
                                          <div key={idx} className="flex justify-between items-center text-xs bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                              <span className="font-bold text-slate-400 uppercase tracking-wide">{tier.label}</span>
                                              <span className="font-black text-white">{tier.value}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>

                          {item.observations && (
                              <div className="flex items-start gap-3 opacity-50 px-2">
                                  <Info size={14} className="text-slate-500 shrink-0 mt-0.5" />
                                  <p className="text-[9px] text-slate-500 font-bold uppercase leading-tight tracking-tight">
                                      {item.observations}
                                  </p>
                              </div>
                          )}
                      </div>
                  </div>
                );
            })}
        </section>

        <section className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/20 flex gap-4 items-start mb-10">
            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
            <div className="space-y-1">
                <p className="text-xs text-amber-200 font-black uppercase tracking-widest leading-none">Status de Dados</p>
                <p className="text-xs text-amber-400/80 font-medium leading-relaxed">
                    Painel administrativo atualizado para o novo ciclo de monetização v2.7. Sincronização de economia anual automatizada para categorias de Banner.
                </p>
            </div>
        </section>
    </div>
  );
};
