
import React from 'react';
import { Flame, AlertTriangle, PartyPopper, ArrowRight } from 'lucide-react';
import { MOCK_RADAR_BAIRRO } from '@/constants';

interface RadarDoBairroProps {
    onNavigate: (view: string) => void;
}

const RadarCard: React.FC<{ item: any }> = ({ item }) => {
    
    const renderIcon = () => {
        switch (item.type) {
            case 'promo': return <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><Flame size={16}/></div>;
            case 'alert': return <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={16}/></div>;
            case 'event': return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><PartyPopper size={16}/></div>;
            default: return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            {renderIcon()}
            <div className="flex-1">
                <p className="font-bold text-xs text-gray-900 dark:text-white leading-tight">{item.title}</p>
                {item.description && <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{item.description}</p>}
                {item.location && <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{item.location} • {item.time}</p>}
                {item.expiresIn && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-0.5">Expira em {item.expiresIn}</p>}
            </div>
        </div>
    );
};

export const RadarDoBairro: React.FC<RadarDoBairroProps> = ({ onNavigate }) => {
    return (
        <section className="px-5 py-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-4">Radar do Bairro</h2>
            
            <div className="space-y-3">
                {MOCK_RADAR_BAIRRO.map(item => (
                    <RadarCard key={item.id} item={item} />
                ))}
            </div>

            <button 
                onClick={() => onNavigate('explore')}
                className="w-full mt-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
                Ver mais no radar
            </button>
        </section>
    );
};
