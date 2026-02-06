import React from 'react';
import { 
  ChevronRight, 
  Building, 
  Store as StoreIcon, 
  Tag, 
  Zap, 
  Ticket
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { MandatoryVideoLock } from './MandatoryVideoLock';
import { useFeatures } from '../contexts/FeatureContext';

// Fixed: Defined StoreAreaViewProps
interface StoreAreaViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: SupabaseUser | null;
}

// Fixed: Defined NavCard
const NavCard: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick: () => void;
  colorClass?: string;
  topRightTag?: React.ReactNode;
}> = ({ icon: Icon, label, description, onClick, colorClass, topRightTag }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-blue-100/50 dark:border-white/5 last:border-b-0 active:bg-blue-50 transition-colors group rounded-2xl mb-2 shadow-sm relative"
  >
    {topRightTag}
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${colorClass || 'bg-blue-50 dark:bg-slate-800 text-gray-400 group-hover:text-[#1E5BFF]'}`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{label}</p>
        {description && <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1E5BFF]" />
  </button>
);

// Fixed: Defined SectionHeader
const SectionHeader: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-8 px-2 first:mt-0">
    {Icon && <Icon size={14} className="text-[#1E5BFF]" />}
    <h2 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">{title}</h2>
  </div>
);

export const StoreAreaView: React.FC<StoreAreaViewProps> = ({ onBack, onNavigate, user }) => {
  const { isFeatureActive } = useFeatures();

  return (
    <MandatoryVideoLock videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" storageKey="store_area">
      <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans animate-in fade-in duration-500 pb-40">
        
        <div className="p-6 pt-12 pb-8 bg-white dark:bg-gray-900 border-b border-blue-50 dark:border-gray-800 mb-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Painel do Lojista</h1>
        </div>

        <div className="px-5">
          
          <section>
            <SectionHeader title="Minha Loja" icon={Building} />
            <NavCard 
              icon={StoreIcon} 
              label="Perfil Público da Loja" 
              description="Informações visíveis, busca e dados para emissão de nota"
              onClick={() => onNavigate('store_profile')} 
            />
          </section>

          <section>
            <SectionHeader title="Promoções e Vendas" icon={Tag} />
            <NavCard 
                icon={Zap} 
                label="Postar no Acontecendo Agora" 
                description="Promoção relâmpago, aviso ou evento (2h, 6h ou 24h)"
                onClick={() => onNavigate('happening_now_form')}
                colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                topRightTag={<span className="absolute -top-2 -right-1 bg-red-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase">Novo</span>}
            />
            {isFeatureActive('coupons') && (
                <NavCard 
                icon={Ticket} 
                label="Cupons de Desconto" 
                description="Crie e gerencie seus cupons"
                onClick={() => onNavigate('merchant_coupons')}
                colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                />
            )}
            {isFeatureActive('banner_highlights') && (
                <NavCard 
                icon={Zap} 
                label="Promoções Ativas" 
                description="Vitrine de ofertas especiais"
                onClick={() => onNavigate('merchant_promotions')} 
                />
            )}
          </section>
        </div>
      </div>
    </MandatoryVideoLock>
  );
};