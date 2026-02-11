
import React from 'react';
import { Sun, Cloud, CloudRain, Car, Bike, Pill, ShoppingCart, HeartPulse, PawPrint, Wrench, Ticket, ChevronRight } from 'lucide-react';
import { HOJE_NO_BAIRRO_CATEGORIES } from '@/constants';
import { Category } from '@/types';

interface HojeNoBairroProps {
    onSelectCategory: (category: Category) => void;
}

export const HojeNoBairro: React.FC<HojeNoBairroProps> = ({ onSelectCategory }) => {

    const handleCategoryClick = (slug: string) => {
        const category = HOJE_NO_BAIRRO_CATEGORIES.find(c => c.id === slug);
        if (category) {
            const fullCategory = { ...category, slug: category.id, color: '' }; // Adapt to Category type
            onSelectCategory(fullCategory);
        }
    };

    return (
        <section className="px-5 py-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-4">Hoje no bairro</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-500">
                        <Sun size={20} />
                    </div>
                    <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white">27°C</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ensolarado</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl flex items-center gap-3 border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-500">
                        <Car size={20} />
                    </div>
                    <div>
                        <p className="text-base font-black text-gray-900 dark:text-white">Trânsito</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fluindo</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {HOJE_NO_BAIRRO_CATEGORIES.map(cat => {
                    const Icon = cat.icon as React.ElementType;
                    return (
                        <button 
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-gray-100 dark:border-gray-800 text-center group active:scale-95 transition-all"
                        >
                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-50 transition-colors">
                                <Icon size={20} strokeWidth={2.5}/>
                            </div>
                            <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter leading-tight">{cat.name}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
