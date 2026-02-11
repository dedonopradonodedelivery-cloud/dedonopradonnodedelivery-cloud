
import React from 'react';
import { Sun, Car, Pill, ShoppingCart, HeartPulse, PawPrint, Wrench, Ticket, ChevronRight, Utensils } from 'lucide-react';
import { HOJE_NO_BAIRRO_CATEGORIES } from '@/constants';
import { Category } from '@/types';

interface HojeNoBairroProps {
    onSelectCategory: (category: Category) => void;
}

export const HojeNoBairro: React.FC<HojeNoBairroProps> = ({ onSelectCategory }) => {

    const handleCategoryClick = (slug: string) => {
        const category = HOJE_NO_BAIRRO_CATEGORIES.find(c => c.id === slug);
        if (category) {
            const fullCategory = { ...category, slug: category.id, color: '' };
            onSelectCategory(fullCategory);
        }
    };

    return (
        <section className="px-5 py-6 bg-white dark:bg-gray-950">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Hoje no bairro</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-white">
                        <Sun size={16} className="text-amber-500" />
                        <span>27°C</span>
                    </div>
                    <button className="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Trânsito fluindo
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
            
            <div className="flex overflow-x-auto no-scrollbar -mx-5 px-4 gap-2">
                {HOJE_NO_BAIRRO_CATEGORIES.map(cat => {
                    const Icon = cat.icon as React.ElementType;
                    return (
                        <button 
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl w-20 text-center group active:scale-95 transition-all"
                        >
                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <Icon size={24} strokeWidth={2}/>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter leading-tight">{cat.name}</span>
                        </button>
                    );
                })}
                 <div className="w-5 flex-shrink-0"></div>
            </div>
        </section>
    );
};
