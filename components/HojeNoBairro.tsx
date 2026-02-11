
import React from 'react';
import { Sun, Car, Pill, ShoppingCart, HeartPulse, PawPrint, Wrench, Ticket, ChevronRight, Utensils, Wind, Droplets } from 'lucide-react';
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Hoje no bairro</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Jacarepaguá • 24 de Março</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Sun size={20} className="text-amber-500" />
                        <span className="text-sm font-black text-gray-900 dark:text-white">27°C</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        Trânsito ok
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 p-5 bg-[#1E5BFF]/5 dark:bg-blue-900/10 rounded-[2.5rem] border border-[#1E5BFF]/10">
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1E5BFF] rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Wind size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Ar</p>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Qualidade Boa</p>
                    </div>
                </div>
                <div className="w-px bg-[#1E5BFF]/10"></div>
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Droplets size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Umidade</p>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">65%</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
