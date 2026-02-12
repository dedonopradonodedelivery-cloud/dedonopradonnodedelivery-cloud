
import React, { useMemo } from 'react';
import { Search, MapPin, Bell, Mic, Heart, Wrench, Shirt, Scissors, PawPrint, Plus, Sun, Activity, ChevronDown, Sparkles } from 'lucide-react';
import { useNeighborhood } from '../../contexts/NeighborhoodContext';
import { Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface HeaderProps {
  onNotificationClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectCategory: (category: Category) => void;
  onOpenMoreCategories: () => void;
  onOpenJota: (initialQuery?: string) => void;
  onNavigate?: (tab: string) => void;
  activeTab?: string;
}

const CategoryButton: React.FC<{ icon: React.ElementType, label: string, onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[58px] group">
    <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
    </div>
    <span className="text-[9px] font-black text-white uppercase tracking-tighter">{label}</span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick, 
  user,
  searchTerm,
  onSearchChange,
  onSelectCategory,
  onOpenMoreCategories,
  onOpenJota
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();

  const userName = useMemo(() => {
    if (!user) return 'Visitante';
    const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
    return fullName?.split(' ')[0] || 'Usuário';
  }, [user]);

  const categoriesToShow = useMemo(() => {
    const ids = ['cat-saude', 'cat-services', 'cat-fashion', 'cat-beauty', 'cat-pets'];
    const icons: { [key: string]: React.ElementType } = {
        'cat-saude': Heart,
        'cat-services': Wrench,
        'cat-fashion': Shirt,
        'cat-beauty': Scissors,
        'cat-pets': PawPrint,
    };
    const labels: { [key: string]: string } = {
        'cat-saude': 'Saúde',
        'cat-services': 'Serviços',
        'cat-fashion': 'Moda',
        'cat-beauty': 'Beleza',
        'cat-pets': 'Pets'
    };
    return ids.map(id => {
        const cat = CATEGORIES.find(c => c.id === id);
        return cat ? { ...cat, icon: icons[id], name: labels[id] } : null;
    }).filter((c): c is Category & { icon: React.ElementType } => c !== null);
  }, []);

  const dynamicPlaceholder = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return "Peça algo ao Jota...";
    }
    return `O que você precisa em ${currentNeighborhood}?`;
  }, [currentNeighborhood]);

  return (
    <header className="sticky top-0 z-30 bg-[#1E5BFF]">
      <div className="px-5 pt-12 pb-4">
        {/* Saudação, Bairro, Notificações */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-white tracking-tight font-display">
            Olá, {userName}
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleSelector} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">{currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood}</span>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </button>
            <button onClick={onNotificationClick} className="relative p-2.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <Bell size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Barra de Busca Inteligente (Jota Trigger) */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => onOpenJota(searchTerm)}
              onKeyDown={(e) => e.key === 'Enter' && onOpenJota(searchTerm)}
              placeholder={dynamicPlaceholder} 
              className="w-full pl-12 pr-12 py-4 bg-white/10 border-2 border-transparent focus:border-white/30 text-white placeholder-white/50 rounded-2xl text-sm font-bold focus:outline-none transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <button 
                  onClick={() => onOpenJota(searchTerm)}
                  className="p-2 text-white hover:text-amber-400 transition-colors"
                >
                  <Sparkles size={20} fill="currentColor" className="opacity-80" />
                </button>
            </div>
        </div>

        {/* Categorias */}
        <div className="flex justify-between items-start mb-6">
          {categoriesToShow.map(cat => (
            <CategoryButton 
              key={cat.id} 
              icon={cat.icon}
              label={cat.name}
              onClick={() => onSelectCategory(cat)}
            />
          ))}
          <CategoryButton icon={Plus} label="Mais" onClick={onOpenMoreCategories} />
        </div>
        
        {/* Linha Informativa */}
        <div>
          <div className="bg-black/10 backdrop-blur-md rounded-full px-3 py-2 flex items-center justify-between border border-white/10 shadow-sm">
            <div className="flex items-center gap-1.5 text-white text-[10px] font-bold">
              <MapPin size={14} className="text-white/70" />
              <span className="uppercase tracking-wider">JACAREPAGUÁ</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1.5 text-white text-[10px] font-bold">
              <Sun size={14} className="text-yellow-300" />
              <span>28°</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1.5 text-white text-[10px] font-bold">
              <Activity size={14} className="text-red-400" />
              <span className="text-red-300 uppercase tracking-wider">TRÂNSITO INTENSO</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
