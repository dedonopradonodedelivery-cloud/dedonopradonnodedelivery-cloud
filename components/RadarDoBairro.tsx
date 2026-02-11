
import React from 'react';
import { Tag, AlertTriangle, Calendar, Info, Search, MapPin, Medal, Trophy, Zap, Eye, CheckCircle2 } from 'lucide-react';
import { MOCK_RADAR_BAIRRO_V2 } from '@/constants';

interface RadarDoBairroProps {
    onNavigate: (view: string) => void;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    promocao: { label: 'Promoção', icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    aviso: { label: 'Aviso', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    evento: { label: 'Evento', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    achados: { label: 'Achados', icon: Search, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    comunicado: { label: 'Comunicado', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

const ENGAGEMENT_BADGES: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    hot: { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100' },
    official: { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100' },
    reward: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-100' },
    hero: { icon: Medal, color: 'text-rose-500', bg: 'bg-rose-100' },
};

const RadarCard: React.FC<{ item: any }> = ({ item }) => {
    const config = CATEGORY_CONFIG[item.type] || CATEGORY_CONFIG.comunicado;
    const Icon = config.icon;
    const badge = item.engagement ? ENGAGEMENT_BADGES[item.engagement.badge] : null;
    const BadgeIcon = badge?.icon;

    return (
        <div className="flex-shrink-0 w-44 bg-white dark:bg-gray-900 rounded-[2.2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden active:scale-[0.98] transition-all group">
            {/* Header com Selo de Engajamento */}
            <div className="relative">
                {item.image ? (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gray-50 dark:border-gray-800">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                    </div>
                ) : (
                    <div className={`aspect-[4/3] w-full ${config.bg} flex items-center justify-center opacity-40`}>
                        <Icon size={32} className={config.color} />
                    </div>
                )}
                
                {/* Badge Flutuante (Gamificação) */}
                {badge && (
                    <div className={`absolute top-2 right-2 p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900 ${badge.bg} animate-in zoom-in duration-500`}>
                        <BadgeIcon size={14} className={badge.color} />
                    </div>
                )}
            </div>
            
            <div className="p-3.5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${config.bg}`}>
                        <Icon size={8} className={config.color} />
                        <span className={`text-[7px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
                    </div>
                    {item.engagement && (
                         <div className="flex items-center gap-0.5 text-[8px] font-bold text-gray-400">
                            <Eye size={10} /> {item.engagement.views}
                         </div>
                    )}
                </div>

                <h3 className="font-bold text-[11px] text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">
                    {item.title}
                </h3>
                
                {/* Benefício Destravável (Simbólico) */}
                {item.engagement?.badge === 'reward' && (
                    <div className="mt-1 mb-3 py-1 px-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                        <p className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">🎁 Recompensa Destravada</p>
                    </div>
                )}

                <div className="mt-auto pt-2 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-gray-400 uppercase truncate">
                        <MapPin size={8} /> {item.neighborhood}
                    </div>
                    {item.engagement && (
                        <span className={`text-[7px] font-black uppercase ${badge?.color}`}>{item.engagement.label}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const RadarDoBairro: React.FC<RadarDoBairroProps> = ({ onNavigate }) => {
    return (
        <section className="bg-white dark:bg-gray-950 pt-4 pb-12">
            <div className="px-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none">Mural do Bairro</h2>
                        <div className="bg-amber-400 text-white p-1 rounded-lg shadow-sm">
                            <Trophy size={12} fill="currentColor" />
                        </div>
                    </div>
                    <button onClick={() => onNavigate('explore')} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline">Ver mural</button>
                </div>

                {/* BARRA DE PROGRESSO COMUNITÁRIO (Gamificação) */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Zap size={10} className="text-amber-500" fill="currentColor" /> Meta Comunitária: 35/50 posts úteis
                        </p>
                        <span className="text-[9px] font-black text-blue-600">70%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-[70%] rounded-full shadow-lg shadow-blue-500/20 transition-all duration-1000"></div>
                    </div>
                    <p className="text-[8px] text-gray-400 font-bold mt-2 uppercase tracking-tight">Próximo Benefício: <span className="text-emerald-500 italic">Selo "Morador Ativo" p/ todos</span></p>
                </div>
            </div>
            
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 gap-4">
                <div className="w-0.5 shrink-0"></div>
                {MOCK_RADAR_BAIRRO_V2.map(item => (
                    <RadarCard key={item.id} item={item} />
                ))}
                <div className="w-5 shrink-0"></div>
            </div>
        </section>
    );
};
