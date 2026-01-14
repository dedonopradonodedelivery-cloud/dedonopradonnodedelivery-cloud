
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  Store, 
  Filter, 
  ArrowDownWideNarrow, 
  Tag, 
  Search,
  PiggyBank
} from 'lucide-react';

interface UserCouponsHistoryViewProps {
  onBack: () => void;
}

// Mock Data para simulação
const COUPON_HISTORY = [
  { id: '1', store: 'Hamburgueria Brasa', date: '2023-11-14T19:30:00', saved: 15.50, category: 'Alimentação', discountLabel: 'R$ 15,50' },
  { id: '2', store: 'Padaria Imperial', date: '2023-11-10T09:15:00', saved: 5.00, category: 'Alimentação', discountLabel: '5% OFF' },
  { id: '3', store: 'Pet Shop Amigo', date: '2023-11-05T14:20:00', saved: 12.00, category: 'Pets', discountLabel: 'R$ 12,00' },
  { id: '4', store: 'Farmácia Central', date: '2023-10-28T18:40:00', saved: 8.90, category: 'Saúde', discountLabel: '10% OFF' },
  { id: '5', store: 'Moda Freguesia', date: '2023-10-15T11:00:00', saved: 25.00, category: 'Moda', discountLabel: 'R$ 25,00' },
];

export const UserCouponsHistoryView: React.FC<UserCouponsHistoryViewProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all'); // all, 30d, 90d
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Cálculos e Filtros
  const filteredData = useMemo(() => {
    let data = [...COUPON_HISTORY];

    // Filtro de Texto (Loja)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(item => item.store.toLowerCase().includes(lower));
    }

    // Filtro de Período
    const now = new Date();
    if (periodFilter === '30d') {
      const limit = new Date();
      limit.setDate(now.getDate() - 30);
      data = data.filter(item => new Date(item.date) >= limit);
    } else if (periodFilter === '90d') {
      const limit = new Date();
      limit.setDate(now.getDate() - 90);
      data = data.filter(item => new Date(item.date) >= limit);
    }

    // Ordenação
    data.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [searchTerm, periodFilter, sortOrder]);

  const totalSaved = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.saved, 0);
  }, [filteredData]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Meus Cupons</h1>
      </div>

      <div className="p-5 pb-24 flex-1 overflow-y-auto no-scrollbar">
        
        {/* Total Saved Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-emerald-100">
                    <PiggyBank className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Total Economizado</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-medium opacity-80">R$</span>
                    <h2 className="text-4xl font-black font-display tracking-tight">
                        {totalSaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h2>
                </div>
                <p className="text-xs text-emerald-100 mt-2 font-medium">
                    Valor acumulado com uso de cupons no bairro.
                </p>
            </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar loja..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:border-[#1E5BFF] outline-none dark:text-white transition-all"
                />
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <select 
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 outline-none"
                >
                    <option value="all">Todo o período</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                </select>

                <button 
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300"
                >
                    <ArrowDownWideNarrow className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                    {sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
                </button>
            </div>
        </div>

        {/* List */}
        <div className="space-y-3">
            {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.store}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                        {item.category}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(item.date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-sm font-black text-emerald-600 dark:text-emerald-400">
                                {item.discountLabel}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">Economizado</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Nenhum cupom encontrado com esses filtros.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
