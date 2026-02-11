
import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { MOCK_RADAR_BAIRRO_V2 } from '@/constants';

interface RadarDoBairroProps {
    onNavigate: (view: string) => void;
}

const RadarCard: React.FC<{ item: any }> = ({ item }) => {
    return (
        <div className="flex-1 min-w-[160px] bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col p-3 gap-2">
            {item.image && (
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                </div>
            )}
            <div className="flex-1 flex flex-col p-2">
                <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight flex-1">
                    {item.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    {item.info_badge && (
                        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md uppercase tracking-tight">
                            {item.info_badge}
                        </span>
                    )}
                    {item.temei_badge && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md uppercase tracking-tight">
                            {item.temei_badge} <Star size={10} className="fill-current" />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const RadarDoBairro: React.FC<RadarDoBairroProps> = ({ onNavigate }) => {
    return (
        <section className="bg-white dark:bg-gray-950 pt-4 pb-6">
            <div className="px-5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Radar do Bairro</h2>
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </div>
                <button 
                  onClick={() => onNavigate('explore')} 
                  className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                >
                  Ver aí
                </button>
            </div>
            
            <div className="flex overflow-x-auto no-scrollbar -mx-5 px-5 gap-3">
                 <div className="w-1 shrink-0"></div>
                {MOCK_RADAR_BAIRRO_V2.map(item => (
                    <RadarCard key={item.id} item={item} />
                ))}
                 <div className="w-1 shrink-0"></div>
            </div>
        </section>
    );
};
