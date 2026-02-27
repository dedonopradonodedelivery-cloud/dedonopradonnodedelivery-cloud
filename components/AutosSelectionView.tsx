
import React from 'react';
import { ChevronLeft, Car, Bike, Zap, Info, Truck, Anchor, Settings, Package } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface AutosSelectionViewProps {
  onBack: () => void;
  onSelect: (intent: string) => void;
  onNavigate: (view: string) => void;
}

const SelectionCard: React.FC<{
  icon: React.ElementType;
  label: string;
  sublabel: string;
  color: string;
  onClick: () => void;
}> = ({ icon: Icon, label, sublabel, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div className="text-left">
        <span className="block text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{label}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sublabel}</span>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
      <ArrowRight size={20} strokeWidth={3} />
    </div>
  </button>
);

export const AutosSelectionView: React.FC<AutosSelectionViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen">
      
      <div className="pt-12 pb-6 px-6 flex justify-end">
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </div>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
            <div className="text-center space-y-3 mb-4 relative">
                <button 
                  onClick={onBack}
                  className="absolute left-0 top-0 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-gray-900 active:scale-90 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-2 shadow-inner">
                    <Car size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                    Autos em <br/> Jacarepaguá <span className="text-blue-500">🚗✨</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Selecione para encontrar os serviços ideais.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onSelect('Carros')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 bg-opacity-10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                        <Car size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Carros
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Motos')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-500 bg-opacity-10 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform duration-500">
                        <Bike size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Motos
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Bikes')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500 bg-opacity-10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                        <Bike size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Bikes
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Elétricos')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 bg-opacity-10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-500">
                        <Zap size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Elétricos
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Caminhões')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500 bg-opacity-10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
                        <Truck size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Caminhões
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Barcos')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-cyan-500 bg-opacity-10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform duration-500">
                        <Anchor size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Barcos
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Oficinas')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gray-500 bg-opacity-10 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform duration-500">
                        <Settings size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Oficinas
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Peças')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-red-500 bg-opacity-10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-500">
                        <Package size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Peças
                    </span>
                </button>
            </div>

            <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
                <Info className="text-blue-500 shrink-0" size={18} />
                <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold leading-tight uppercase tracking-tight">
                    Os melhores profissionais e lojas automotivas de Jacarepaguá.
                </p>
            </div>
        </main>
        <footer className="p-10 text-center opacity-30">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Auto Hub</p>
        </footer>
      </div>
    </div>
  );
};
