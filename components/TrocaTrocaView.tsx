import React from 'react';
import { ChevronLeft, MapPin, Repeat } from 'lucide-react';

const MOCK_TRADES = [
  { id: 't1', item1: { name: 'Violão Acústico', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400' }, item2: { name: 'Headphone Pro', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400' }, neighborhood: 'Freguesia' },
  { id: 't2', item1: { name: 'Bicicleta Aro 29', image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=400' }, item2: { name: 'Cadeira Gamer', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400' }, neighborhood: 'Taquara' },
  { id: 't3', item1: { name: 'Playstation 4', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400' }, item2: { name: 'Smart TV 42"', image: 'https://images.unsplash.com/photo-1593784653056-143414518a92?q=80&w=400' }, neighborhood: 'Pechincha' },
  { id: 't4', item1: { name: 'Tênis de Corrida', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400' }, item2: { name: 'Relógio Smart', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400' }, neighborhood: 'Anil' },
  { id: 't5', item1: { name: 'Mochila de Viagem', image: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=400' }, item2: { name: 'Jaqueta de Couro', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400' }, neighborhood: 'Freguesia' },
];

const TradeCard: React.FC<{ trade: typeof MOCK_TRADES[0]; onClick: () => void }> = ({ trade, onClick }) => (
    <div onClick={onClick} className="w-full bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] border border-slate-700 dark:border-slate-700 shadow-2xl shadow-black/20 group cursor-pointer transition-all active:scale-95">
    <div className="relative p-5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-700 dark:border-slate-600 z-10 shadow-lg group-hover:scale-110 transition-transform">
        <Repeat className="w-6 h-6 text-blue-400" />
      </div>

      <div className="flex justify-between items-center gap-3">
        <div className="w-[48%] flex flex-col gap-2 items-center text-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600">
            <img src={trade.item1.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={trade.item1.name} />
          </div>
          <p className="text-xs font-bold text-slate-200 dark:text-slate-200 truncate w-full pt-1">{trade.item1.name}</p>
        </div>

        <div className="w-[48%] flex flex-col gap-2 items-center text-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600">
            <img src={trade.item2.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={trade.item2.name} />
          </div>
          <p className="text-xs font-bold text-slate-200 dark:text-slate-200 truncate w-full pt-1">{trade.item2.name}</p>
        </div>
      </div>
    </div>
    
    <div className="px-5 pb-5 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <MapPin size={14} className="text-blue-500" />
          {trade.neighborhood}
        </div>
        <div className="text-xs font-black text-white bg-blue-600 px-5 py-3 rounded-full uppercase tracking-wider shadow-md group-hover:bg-blue-700 transition-colors">
          Ver Troca
        </div>
      </div>
    </div>
  </div>
);

interface TrocaTrocaViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const TrocaTrocaView: React.FC<TrocaTrocaViewProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 pt-12 pb-6 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 active:scale-90 transition-all">
            <ChevronLeft size={24} />
        </button>
        <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Troca-Troca do Bairro</h1>
            <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mt-1">Oportunidades entre vizinhos</p>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {MOCK_TRADES.map((trade) => (
            <TradeCard 
              key={trade.id} 
              trade={trade} 
              onClick={() => { /* no action for now */ }} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};
