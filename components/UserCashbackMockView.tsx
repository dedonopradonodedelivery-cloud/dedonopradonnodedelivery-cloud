import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Info, 
  Calendar,
  Filter,
  Check,
  X,
  Store,
  ChevronDown
} from 'lucide-react';

interface UserCashbackMockViewProps {
  onBack: () => void;
  storeName?: string;
}

const MOCK_BALANCE = 148.90;

// Adicionando datas para os mocks para viabilizar os filtros
const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const MOCK_TRANSACTIONS = [
  { id: '1', date: today, fullDate: new Date(), store: 'Hamburgueria Brasa', type: 'earn', description: 'Compra na Loja — 8% de cashback', value: 12.40 },
  { id: '2', date: today, fullDate: new Date(), store: 'Padaria Imperial', type: 'earn', description: 'Compra na Loja — 5% de cashback', value: 4.50 },
  { id: '3', date: yesterday, fullDate: new Date(Date.now() - 86400000), store: 'Pet Shop Amigo', type: 'spend', description: 'Uso de cashback em ração', value: -15.00 },
  { id: '4', date: '10 Nov', fullDate: new Date('2024-11-10'), store: 'Farmácia Central', type: 'earn', description: 'Compra na Loja — 3% de cashback', value: 2.30 },
  { id: '5', date: '08 Nov', fullDate: new Date('2024-11-08'), store: 'Studio Hair Vip', type: 'spend', description: 'Uso de saldo em serviço', value: -10.00 },
];

const AVAILABLE_STORES = Array.from(new Set(MOCK_TRANSACTIONS.map(t => t.store)));

export const UserCashbackMockView: React.FC<UserCashbackMockViewProps> = ({ onBack, storeName }) => {
  const [activePeriod, setActivePeriod] = useState('30 dias');
  const [selectedStores, setSelectedStores] = useState<string[]>(storeName ? [storeName] : []);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  const periods = ['Hoje', '7 dias', '15 dias', '30 dias', '60 dias', '90 dias', 'Personalizado'];

  // Lógica de Filtragem Mockada
  const filteredTransactions = useMemo(() => {
    let list = [...MOCK_TRANSACTIONS];

    // 1. Filtro por Loja
    if (selectedStores.length > 0) {
      list = list.filter(t => selectedStores.includes(t.store));
    }

    // 2. Filtro por Período
    const now = new Date();
    if (activePeriod === 'Hoje') {
      const todayStr = now.toDateString();
      list = list.filter(t => t.fullDate.toDateString() === todayStr);
    } else if (activePeriod === 'Personalizado' && customDates.start && customDates.end) {
      const start = new Date(customDates.start);
      const end = new Date(customDates.end);
      list = list.filter(t => t.fullDate >= start && t.fullDate <= end);
    } else if (activePeriod.includes('dias')) {
      const days = parseInt(activePeriod);
      const limitDate = new Date();
      limitDate.setDate(now.getDate() - days);
      list = list.filter(t => t.fullDate >= limitDate);
    }

    return list;
  }, [activePeriod, selectedStores, customDates]);

  const toggleStore = (store: string) => {
    setSelectedStores(prev => 
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Meus Créditos</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Extrato de Benefícios</p>
        </div>
      </header>

      <main className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Resumo Financeiro */}
        <div className="bg-gradient-to-br from-[#1E5BFF] to-[#0040DD] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Wallet size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Saldo Total</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2">R$ {MOCK_BALANCE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                <div className="flex items-center gap-2 mt-6 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">
                    <Info size={12} className="text-blue-200" />
                    <span className="text-[10px] font-bold text-blue-100">Atualizado agora</span>
                </div>
            </div>
        </div>

        {/* Filtros Superiores */}
        <section className="space-y-4">
            <div className="flex items-center justify-between ml-1">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Período</h3>
                </div>
                {activePeriod === 'Personalizado' && customDates.start && (
                  <span className="text-[9px] font-bold text-[#1E5BFF] bg-blue-50 px-2 py-0.5 rounded-md">
                    {new Date(customDates.start).toLocaleDateString()} - {new Date(customDates.end).toLocaleDateString()}
                  </span>
                )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
                {periods.map(f => (
                    <button 
                        key={f}
                        onClick={() => {
                          setActivePeriod(f);
                          if (f === 'Personalizado') setIsCustomDateOpen(true);
                        }}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                            activePeriod === f 
                            ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </section>

        {/* Filtro por Lojas */}
        <section>
            <div className="flex items-center gap-2 mb-4 ml-1">
                <Store size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtrar Lojas</h3>
            </div>
            <button 
              onClick={() => setIsStoreModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[#1E5BFF]">
                  <Filter size={16} />
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  {selectedStores.length === 0 ? 'Todas as lojas' : 
                   selectedStores.length === 1 ? selectedStores[0] : 
                   `${selectedStores.length} lojas selecionadas`}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
        </section>

        {/* Extrato Principal */}
        <section className="space-y-4 pb-20">
            <div className="flex items-center gap-2 ml-1">
                <TrendingUp size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Extrato Detalhado</h3>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm min-h-[200px]">
                {filteredTransactions.length > 0 ? filteredTransactions.map((tx, idx) => (
                    <div 
                        key={tx.id} 
                        className={`p-5 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            idx !== filteredTransactions.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''
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
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{tx.store}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{tx.date}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{tx.description}</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-gray-900 dark:text-gray-200'}`}>
                                {tx.type === 'earn' ? '+' : ''} R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Conf: {tx.id}</span>
                        </div>
                    </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Info size={32} className="text-gray-200 mb-3" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nenhuma movimentação<br/>encontrada.</p>
                    <button 
                      onClick={() => { setActivePeriod('30 dias'); setSelectedStores([]); }}
                      className="mt-4 text-[10px] font-black text-[#1E5BFF] uppercase underline"
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}
            </div>
        </section>

      </main>

      {/* --- MODAL DE LOJAS (BOTTOM SHEET) --- */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtrar Lojas</h3>
              <button onClick={() => setIsStoreModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pr-1">
              <button 
                onClick={() => setSelectedStores([])}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedStores.length === 0 ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
              >
                <span className="text-sm font-bold uppercase tracking-tight">Todas as lojas</span>
                {selectedStores.length === 0 && <Check size={18} />}
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>

              {AVAILABLE_STORES.map(store => (
                <button 
                  key={store}
                  onClick={() => toggleStore(store)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedStores.includes(store) ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                >
                  <span className="text-sm font-bold truncate pr-4">{store}</span>
                  {selectedStores.includes(store) && <Check size={18} />}
                </button>
              ))}
            </div>

            <div className="pt-6">
              <button 
                onClick={() => setIsStoreModalOpen(false)}
                className="w-full py-4 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
              >
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE DATA PERSONALIZADA --- */}
      {isCustomDateOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Período Customizado</h3>
            <p className="text-xs text-gray-400 mb-6 font-medium">Limite: Últimos 12 meses.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Data Inicial</label>
                <input 
                  type="date" 
                  value={customDates.start}
                  onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Data Final</label>
                <input 
                  type="date" 
                  value={customDates.end}
                  onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                 <button 
                  onClick={() => { setIsCustomDateOpen(false); setActivePeriod('30 dias'); }}
                  className="flex-1 py-4 text-gray-400 text-xs font-black uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setIsCustomDateOpen(false)}
                  disabled={!customDates.start || !customDates.end}
                  className="flex-[2] py-4 bg-[#1E5BFF] text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};