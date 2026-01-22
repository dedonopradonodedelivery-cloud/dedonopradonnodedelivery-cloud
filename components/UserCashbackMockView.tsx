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
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  History
} from 'lucide-react';

interface UserCashbackMockViewProps {
  onBack: () => void;
  storeName?: string;
}

// --- CONFIGURAÇÃO DE DADOS FAKE (MOCK) ---

const STORES_MOCK = [
  { id: 's1', name: 'Hamburgueria Brasa', balance: 42.50 },
  { id: 's2', name: 'Padaria Imperial', balance: 12.30 },
  { id: 's3', name: 'Pet Shop Amigo', balance: 85.00 },
  { id: 's4', name: 'Farmácia Central', balance: 4.20 },
  { id: 's5', name: 'Studio Hair Vip', balance: 10.00 },
  { id: 's6', name: 'Mercado Boa Praça', balance: 22.90 },
  { id: 's7', name: 'Academia FitBairro', balance: 0.00 },
  { id: 's8', name: 'Pizzaria do Zé', balance: 15.75 },
  { id: 's9', name: 'Boutique Chic', balance: 35.00 },
  { id: 's10', name: 'Ótica Visão', balance: 110.00 },
];

const now = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

const TRANSACTIONS_MOCK = [
  { id: 't1', storeId: 's1', type: 'earn', amount: 12.40, desc: 'Compra no balcão', date: formatDate(0) }, // Hoje
  { id: 't2', storeId: 's2', type: 'earn', amount: 4.50, desc: 'Café da manhã', date: formatDate(0) }, // Hoje
  { id: 't3', storeId: 's3', type: 'spend', amount: -15.00, desc: 'Resgate em ração', date: formatDate(1) }, // Ontem
  { id: 't4', storeId: 's1', type: 'earn', amount: 8.90, desc: 'Combo Burger', date: formatDate(2) },
  { id: 't5', storeId: 's6', type: 'earn', amount: 22.90, desc: 'Compras mensais', date: formatDate(5) },
  { id: 't6', storeId: 's4', type: 'earn', amount: 2.30, desc: 'Medicamentos', date: formatDate(10) },
  { id: 't7', storeId: 's9', type: 'spend', amount: -25.00, desc: 'Uso em acessórios', date: formatDate(15) },
  { id: 't8', storeId: 's10', type: 'earn', amount: 45.00, desc: 'Lentes novas', date: formatDate(45) },
  { id: 't9', storeId: 's5', type: 'earn', amount: 10.00, desc: 'Corte de cabelo', date: formatDate(60) },
  { id: 't10', storeId: 's8', type: 'spend', amount: -12.50, desc: 'Pizza de sexta', date: formatDate(1) },
];

export const UserCashbackMockView: React.FC<UserCashbackMockViewProps> = ({ onBack, storeName }) => {
  // --- ESTADOS ---
  const [activePeriod, setActivePeriod] = useState('30 dias');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');
  const [showValues, setShowValues] = useState(true);

  const periods = ['Hoje', '7 dias', '15 dias', '30 dias', '60 dias', '90 dias'];

  // --- LÓGICA DINÂMICA ---

  const filteredStoresInModal = useMemo(() => {
    return STORES_MOCK.filter(s => s.name.toLowerCase().includes(storeSearch.toLowerCase()));
  }, [storeSearch]);

  const currentBalance = useMemo(() => {
    if (selectedStoreIds.length === 0) {
      return STORES_MOCK.reduce((acc, s) => acc + s.balance, 0);
    }
    return STORES_MOCK
      .filter(s => selectedStoreIds.includes(s.id))
      .reduce((acc, s) => acc + s.balance, 0);
  }, [selectedStoreIds]);

  const filteredTransactions = useMemo(() => {
    let list = [...TRANSACTIONS_MOCK];

    // 1. Filtro por Loja
    if (selectedStoreIds.length > 0) {
      list = list.filter(t => selectedStoreIds.includes(t.storeId));
    }

    // 2. Filtro por Período
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activePeriod === 'Hoje') {
      list = list.filter(t => t.date >= today);
    } else if (activePeriod.includes('dias')) {
      const days = parseInt(activePeriod);
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - days);
      list = list.filter(t => t.date >= limitDate);
    }

    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [selectedStoreIds, activePeriod]);

  // --- HANDLERS ---

  const toggleStoreSelection = (id: string) => {
    setSelectedStoreIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStoreName = (id: string) => STORES_MOCK.find(s => s.id === id)?.name || 'Loja Desconhecida';

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Meus Créditos</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Extrato de Benefícios</p>
        </div>
      </header>

      <main className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Resumo Financeiro Dinâmico */}
        <div className="bg-gradient-to-br from-[#1E5BFF] to-[#0040DD] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 opacity-80">
                        <Wallet size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Saldo de Cashback</span>
                    </div>
                    <button 
                      onClick={() => setShowValues(!showValues)}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      {showValues ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
                
                <h2 className="text-4xl font-black tracking-tight mb-2 flex items-baseline gap-2">
                    <span className="text-xl font-bold opacity-60">R$</span>
                    {showValues ? currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '••••••'}
                </h2>

                <div className="flex items-center gap-2 mt-6">
                  <div className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <Info size={12} className="text-blue-200" />
                    <span className="text-[9px] font-bold text-blue-50">
                      {selectedStoreIds.length === 0 ? 'Total acumulado no bairro' : 'Saldo das lojas selecionadas'}
                    </span>
                  </div>
                </div>
            </div>
        </div>

        {/* Barra de Filtros Rápidos */}
        <section className="space-y-6">
            {/* Filtro por Loja */}
            <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                    <div className="flex items-center gap-2">
                        <Store size={14} className="text-gray-400" />
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtrar por Estabelecimento</h3>
                    </div>
                    {selectedStoreIds.length > 0 && (
                      <button 
                        onClick={() => setSelectedStoreIds([])}
                        className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest"
                      >
                        Limpar
                      </button>
                    )}
                </div>
                <button 
                  onClick={() => setIsStoreModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[#1E5BFF] shrink-0">
                      <Filter size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">
                      {selectedStoreIds.length === 0 
                        ? 'Todas as lojas participantes' 
                        : selectedStoreIds.length === 1 
                          ? getStoreName(selectedStoreIds[0])
                          : `${selectedStoreIds.length} lojas selecionadas`}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 shrink-0 ml-2" />
                </button>
            </div>

            {/* Filtro por Período */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                    <Calendar size={14} className="text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Período do Extrato</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
                    {periods.map(p => (
                        <button 
                            key={p}
                            onClick={() => setActivePeriod(p)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                                activePeriod === p 
                                ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' 
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* Lista de Transações */}
        <section className="space-y-4 pb-20">
            <div className="flex items-center justify-between ml-1">
                <div className="flex items-center gap-2">
                    <History size={14} className="text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Movimentações</h3>
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  {filteredTransactions.length} registros
                </span>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm min-h-[300px]">
                {filteredTransactions.length > 0 ? filteredTransactions.map((tx, idx) => (
                    <div 
                        key={tx.id} 
                        className={`p-5 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            idx !== filteredTransactions.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''
                        }`}
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                tx.type === 'earn' 
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' 
                                : 'bg-blue-50 text-[#1E5BFF] dark:bg-blue-900/20'
                            }`}>
                                {tx.type === 'earn' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
                                    {getStoreName(tx.storeId)}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                                  {tx.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {tx.desc}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                            <p className={`font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-gray-900 dark:text-gray-200'}`}>
                                {showValues 
                                  ? `${tx.type === 'earn' ? '+' : ''} R$ ${Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                                  : 'R$ •••'}
                            </p>
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Conf: {tx.id}</span>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                          <History size={32} className="text-gray-200" />
                        </div>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest leading-relaxed">
                            Nenhuma movimentação<br/>neste período.
                        </p>
                        <button 
                            onClick={() => { setSelectedStoreIds([]); setActivePeriod('30 dias'); }}
                            className="mt-6 text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
        </section>

      </main>

      {/* --- MODAL DE SELEÇÃO DE LOJAS (BOTTOM SHEET) --- */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
            
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Filtrar Lojas</h3>
              <button onClick={() => setIsStoreModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            {/* Barra de Busca de Loja */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar estabelecimento..." 
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-[#1E5BFF]/50 outline-none shadow-inner"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pr-1">
              {/* Opção Todas */}
              <button 
                onClick={() => setSelectedStoreIds([])}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedStoreIds.length === 0 ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedStoreIds.length === 0 ? 'bg-blue-100' : 'bg-gray-200'}`}>
                    <TrendingUp size={14} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-tight">Todas as lojas</span>
                </div>
                {selectedStoreIds.length === 0 && <Check size={18} />}
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>

              {/* Lista de Lojas */}
              {filteredStoresInModal.length > 0 ? filteredStoresInModal.map(store => (
                <button 
                  key={store.id}
                  onClick={() => toggleStoreSelection(store.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedStoreIds.includes(store.id) ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF]' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${selectedStoreIds.includes(store.id) ? 'bg-[#1E5BFF] text-white' : 'bg-white dark:bg-gray-700 text-gray-400 border border-gray-100 dark:border-gray-600'}`}>
                      {store.name.charAt(0)}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-bold truncate">{store.name}</p>
                      <p className="text-[10px] font-medium opacity-60">Saldo: R$ {store.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  {selectedStoreIds.includes(store.id) && <Check size={18} />}
                </button>
              )) : (
                <div className="py-10 text-center text-gray-400">
                  <p className="text-sm font-bold">Nenhuma loja encontrada.</p>
                </div>
              )}
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

    </div>
  );
};