
import React from 'react';
import { 
  Heart, 
  Baby, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Wind, 
  Sparkles, 
  Microscope,
  Stethoscope,
  Droplets,
  ChevronLeft
} from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

interface SubcategoryItem {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface HealthWomenViewProps {
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
  onBack: () => void;
}

const SUBCATEGORIES_DATA: SubcategoryItem[] = [
  { name: "Ginecologia", icon: Stethoscope, color: "bg-rose-500" },
  { name: "Obstetrícia", icon: Baby, color: "bg-pink-500" },
  { name: "Mastologia", icon: ShieldCheck, color: "bg-rose-600" },
  { name: "Uroginecologia", icon: Droplets, color: "bg-blue-400" },
  { name: "Endocrinologia Feminina", icon: Zap, color: "bg-amber-500" },
  { name: "Climatério", icon: Wind, color: "bg-indigo-400" },
  { name: "Menopausa", icon: Sparkles, color: "bg-purple-500" },
  { name: "Reprodução Humana", icon: Microscope, color: "bg-emerald-500" },
];

const SubcategoryCard: React.FC<{ item: SubcategoryItem; onClick: () => void }> = ({ item, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
    >
      <div className={`w-16 h-16 rounded-[1.5rem] ${item.color} bg-opacity-10 flex items-center justify-center ${item.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
        {item.name}
      </span>
    </button>
  );
};

export const HealthWomenView: React.FC<HealthWomenViewProps> = ({ onSelect, onNavigate, onStoreClick, onBack }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Centro de Saúde da Mulher JPA',
      category: 'Saúde',
      subcategory: 'Ginecologia & Obstetrícia',
      image: 'https://images.unsplash.com/photo-1551076805-e2983fe3600c?q=80&w=1200',
      description: 'O maior centro especializado em saúde feminina de Jacarepaguá. Atendimento humanizado e tecnologia de ponta para todas as fases da mulher.',
    } as Store);
  };

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Saúde da Mulher</h2>
          </div>

          <div 
              onClick={handleHeroClick}
              className="py-10 px-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/20 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all group"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                      <Heart size={24} fill="white" className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Cuidado Especializado</h3>
                      <p className="text-rose-100 text-xs font-medium leading-relaxed">Os melhores profissionais para cada fase da sua vida. <span className="underline ml-1">Conhecer</span></p>
                  </div>
              </div>
          </div>

          <section>
            <div className="grid grid-cols-2 gap-4">
              {SUBCATEGORIES_DATA.map((item, idx) => (
                <SubcategoryCard 
                  key={idx} 
                  item={item} 
                  onClick={() => onSelect(item.name)} 
                />
              ))}
            </div>
          </section>

          <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
              <div className="h-1 w-8 bg-gray-400 rounded-full mb-2"></div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Jacarepaguá Health Ecosystem</p>
          </div>
        </main>
      </div>
    </div>
  );
};
