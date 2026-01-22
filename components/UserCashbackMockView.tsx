import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Coins, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Info, 
  Calendar,
  Filter
} from 'lucide-react';

interface UserCashbackMockViewProps {
  onBack: () => void;
  storeName?: string;
}

const MOCK_BALANCE = 148.90;

const MOCK_TRANSACTIONS = [
  { id: '1', date: 'Hoje, 14:20', store: 'Hamburgueria Brasa', type: 'earn', description: 'Compra na Loja — 8% de cashback', value: 12.40 },
  { id: '2', date: 'Ontem, 10:15', store: 'Padaria Imperial', type: 'earn', description: 'Compra na Loja — 5% de cashback', value: 4.50 },
  { id: '3', date: '12 Nov, 18:30', store: 'Pet Shop Amigo', type: 'spend', description: 'Uso de cashback em ração', value: -15.00 },
  { id: '4', date: '10 Nov, 09:45', store: 'Farmácia Central', type: 'earn', description: 'Compra na Loja — 3% de cashback', value: 2.30 },
  { id: '5', date: '08 Nov, 20:10', store: 'Studio Hair Vip', type: 'spend', description: 'Uso de saldo em serviço', value: -10.00 },
];

export const UserCashbackMockView: React.FC<UserCashbackMockViewProps> = ({ onBack, storeName }) => {
  const [activeFilter, setActiveFilter] = useState('30 dias');

  const filters = ['7 dias', '15 dias', '30 dias', '60 dias', '90 dias'];

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Meus Créditos</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cashback e Movimentações</p>
        </div>
      </header>

      <main className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Resumo Fake */}
        <div className="bg-gradient-to-br from-[#1E5BFF] to-[#0040DD] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Wallet size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Saldo Disponível</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2">R$ {MOCK_BALANCE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                <div className="flex items-center gap-2 mt-6 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                    <Info size={12} className="text-blue-200" />
                    <span className="text-[10px] font-bold text-blue-100">Valores ilustrativos</span>
                </div>
            </div>
        </div>

        {/* Filtro Visual */}
        <section>
            <div className="flex items-center gap-2 mb-4 ml-1">
                <Calendar size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Período</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
                {filters.map(f => (
                    <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                            activeFilter === f 
                            ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </section>

        {/* Extrato de Movimentações */}
        <section className="space-y-4">
            <div className="flex items-center justify-between ml-1">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Extrato de Movimentações</h3>
                </div>
                {storeName && (
                   <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                       Somente {storeName}
                   </span>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                {MOCK_TRANSACTIONS.map((tx, idx) => (
                    <div 
                        key={tx.id} 
                        className={`p-5 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            idx !== MOCK_TRANSACTIONS.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                tx.type === 'earn' 
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' 
                                : 'bg-blue-50 text-[#1E5BFF] dark:bg-blue-900/20'
                            }`}>
                                {tx.type === 'earn' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{tx.store}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{tx.date}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{tx.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-gray-900 dark:text-gray-200'}`}>
                                {tx.type === 'earn' ? '+' : ''} R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">ID: {tx.id}092</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Rodapé informativo */}
        <div className="text-center py-6">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Localizei JPA • Cashback</p>
        </div>

      </main>
    </div>
  );
};