
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Stethoscope, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Baby, 
  HeartHandshake, 
  Activity, 
  Microscope, 
  Brain, 
  Smile, 
  Building2, 
  Apple, 
  Zap,
  Info,
  ArrowRight,
  Star,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { Store, AdType } from '../types';
import { STORES } from '../constants';

interface HealthImmersiveViewProps {
  group: 'Mulher' | 'Homem' | 'Pediatria' | 'Geriatria';
  onBack: () => void;
}

// Mapeamento de banners por especialidade para monetização
const HEALTH_ADS: Record<string, { title: string; subtitle: string; color: string }> = {
  // Banners Genéricos por Grupo
  'Mulher_generic': { title: 'Saúde da Mulher', subtitle: 'Encontre ginecologistas e clínicas especializadas perto de você.', color: 'from-pink-600 to-rose-700' },
  'Homem_generic': { title: 'Saúde do Homem', subtitle: 'Prevenção e cuidado especializado para o seu bem-estar.', color: 'from-blue-700 to-indigo-800' },
  'Pediatria_generic': { title: 'Cuidado Infantil', subtitle: 'Pediatras e especialistas para o crescimento saudável dos pequenos.', color: 'from-amber-500 to-orange-600' },
  'Geriatria_generic': { title: 'Melhor Idade', subtitle: 'Qualidade de vida e assistência para quem você ama.', color: 'from-emerald-600 to-teal-700' },
  
  // Banners Específicos (Exemplos de Venda de Espaço)
  'Ginecologia': { title: 'Dra. Ana Silva', subtitle: 'Ginecologia e Obstetrícia com atendimento humanizado na Freguesia.', color: 'from-rose-500 to-pink-600' },
  'Dentista': { title: 'Sorriso JPA', subtitle: 'Implantes e clareamento com tecnologia de ponta na Taquara.', color: 'from-cyan-600 to-blue-700' },
  'Pediatria': { title: 'Kids Clinic', subtitle: 'Pronto atendimento infantil 24h e vacinação completa.', color: 'from-orange-500 to-amber-600' },
  'Psicologia': { title: 'Equilíbrio Mental', subtitle: 'Psicoterapia para adultos e crianças. Agende sua consulta.', color: 'from-indigo-500 to-purple-600' }
};

const SPECIALTIES_BY_GROUP = {
  Mulher: [
    { name: 'Ginecologia', icon: <Stethoscope /> },
    { name: 'Obstetrícia', icon: <Heart /> },
    { name: 'Dermatologia', icon: <Sparkles /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Endocrino', icon: <Activity /> },
    { name: 'Exames', icon: <Microscope /> },
  ],
  Homem: [
    { name: 'Urologia', icon: <ShieldCheck /> },
    { name: 'Cardiologia', icon: <Activity /> },
    { name: 'Dermatologia', icon: <Sparkles /> },
    { name: 'Psicologia', icon: <Brain /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Fisioterapia', icon: <Zap /> },
    { name: 'Clínica', icon: <Building2 /> },
  ],
  Pediatria: [
    { name: 'Pediatria', icon: <Smile /> },
    { name: 'Psico Infantil', icon: <Brain /> },
    { name: 'Nutrição', icon: <Apple /> },
    { name: 'Fono', icon: <Activity /> },
    { name: 'Dentista', icon: <Smile /> },
    { name: 'Vacinas', icon: <ShieldCheck /> },
    { name: 'Exames', icon: <Microscope /> },
  ],
  Geriatria: [
    { name: 'Geriatria', icon: <HeartHandshake /> },
    { name: 'Fisioterapia', icon: <Zap /> },
    { name: 'Cardiologia', icon: <Activity /> },
    { name: 'Cuidadores', icon: <User /> },
    { name: 'Home Care', icon: <Building2 /> },
    { name: 'Exames', icon: <Microscope /> },
  ]
};

const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">Ads</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="flex items-center gap-1 font-bold text-[#1E5BFF]"><Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span className="truncate">{store.subcategory}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {store.distance && <span className="text-[10px] text-gray-400 font-medium">{store.distance}</span>}
          {store.verified && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5"><BadgeCheck className="w-3 h-3" /> Verificado</span>}
        </div>
      </div>
      <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300"><ChevronRight className="w-4 h-4" /></div>
    </div>
  );
};

export const HealthImmersiveView: React.FC<HealthImmersiveViewProps> = ({ group, onBack }) => {
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const specialties = SPECIALTIES_BY_GROUP[group];

  // Filtra as lojas baseado no grupo e na especialidade ativa
  const filteredStores = useMemo(() => {
    // Filtro inicial por categoria Saúde
    let list = STORES.filter(s => s.category === 'Saúde');
    
    // Filtro por Especialidade Ativa
    if (activeSpecialty) {
      list = list.filter(s => s.subcategory === activeSpecialty);
    }
    
    return list;
  }, [activeSpecialty]);

  // Busca os dados do banner (Monetização Contextual)
  const currentAd = useMemo(() => {
    if (activeSpecialty && HEALTH_ADS[activeSpecialty]) {
      return HEALTH_ADS[activeSpecialty];
    }
    return HEALTH_ADS[`${group}_generic`];
  }, [group, activeSpecialty]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-in fade-in duration-300 flex flex-col">
      {/* HEADER FIXO */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none">Saúde {group}</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
            {activeSpecialty ? activeSpecialty : 'Todas as especialidades'}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* BANNER PUBLICITÁRIO DINÂMICO (TOPO) */}
        <div className="px-5 pt-5 mb-4 animate-in slide-in-from-top duration-500">
            <div className={`w-full h-32 bg-gradient-to-br ${currentAd.color} rounded-3xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <div className="relative z-10">
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1 block">Anúncio {activeSpecialty ? 'Exclusivo' : 'Destaque'}</span>
                    <h3 className="text-white font-bold text-sm leading-tight max-w-[160px]">
                        {currentAd.title}
                    </h3>
                    <p className="text-[10px] text-white/80 mt-1 line-clamp-2 max-w-[180px]">
                        {currentAd.subtitle}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <ArrowRight size={18} />
                </div>
            </div>
        </div>

        {/* GRID DE CATEGORIAS (FILTRO) */}
        <div className="p-5 pb-2">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Especialidades
                </h3>
                {activeSpecialty && (
                    <button 
                        onClick={() => setActiveSpecialty(null)}
                        className="text-[10px] font-black text-blue-600 uppercase"
                    >
                        Ver Todas
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-4 gap-y-6 gap-x-3">
                {specialties.map((spec) => (
                    <button 
                        key={spec.name}
                        onClick={() => setActiveSpecialty(spec.name)}
                        className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
                    >
                        <div className={`w-14 h-14 rounded-full border transition-all flex items-center justify-center shadow-sm ${
                            activeSpecialty === spec.name 
                                ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] scale-110' 
                                : 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] border-blue-100 dark:border-blue-800/30'
                        }`}>
                            {React.cloneElement(spec.icon as any, { size: 24, strokeWidth: 2.5 })}
                        </div>
                        <span className={`text-[9px] font-bold text-center leading-tight uppercase tracking-tighter ${
                            activeSpecialty === spec.name ? 'text-[#1E5BFF]' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                            {spec.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        {/* LISTA DE NEGÓCIOS FILTRADA */}
        <div className="p-5 space-y-4">
            <div className="h-px bg-gray-100 dark:bg-gray-800 mb-2"></div>
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter px-1">
                {activeSpecialty ? `${activeSpecialty} em Jacarepaguá` : `Profissionais de Saúde (${group})`}
            </h3>
            
            <div className="space-y-3 pb-24">
                {filteredStores.length > 0 ? filteredStores.map(store => (
                    <StoreCard 
                        key={store.id} 
                        store={store} 
                        onClick={() => {
                            // Em uma implementação real, navegaria para store_detail
                            console.log("Navegar para loja:", store.name);
                        }} 
                    />
                )) : (
                    <div className="py-12 text-center bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-800">
                        <Info className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Nenhum profissional encontrado <br/> para esta especialidade.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};
