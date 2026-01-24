

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Wallet, 
  Store, 
  History, 
  Coins, 
  Info, 
  Search, 
  PlayCircle, 
  ShoppingBag, 
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { StoreCredit, CashbackTransaction } from '../types';

interface UserWalletViewProps {
  userId: string;
  onBack: () => void;
  onStoreClick: (storeId: string) => void;
  onScanClick: () => void;
}

export const UserWalletView: React.FC<UserWalletViewProps> = ({ userId, onBack, onStoreClick, onScanClick }) => {
  const [activeTab, setActiveTab] = useState<'balances' | 'history'>('balances');
  const [credits, setCredits] = useState<StoreCredit[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        // Busca saldos consolidados por loja
        const { data: balanceData } = await supabase
          .from('store_credits')
          .select('*, stores(name, logoUrl)')
          .eq('user_id', userId)
          .gt('balance_cents', 0);
        
        // Busca histórico vindo do Ledger (Movimentações reais e auditáveis)
        const { data: ledgerData } = await supabase
          .from('cashback_ledger')
          .select('*, stores(name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        setCredits(balanceData || []);
        setHistory(ledgerData || []);
      } catch (err) {
        console.error("Erro ao buscar dados da carteira:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const totalBalanceCents = credits.reduce((acc, curr) => acc + curr.balance_cents, 0);

  const formatBRL = (cents: number) => 
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      {/* Header com Saldo Total */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white">Minha Carteira</h1>
          </div>
          <button onClick={onScanClick} className="bg-[#1E5BFF] text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Saldo em Jacarepaguá</p>
                <h2 className="text-3xl font-black">{formatBRL(totalBalanceCents)}</h2>
                <div className="flex items-center gap-2 mt-4 text-[10px] text-blue-400 font-bold bg-blue-500/10 w-fit px-3 py-1 rounded-full border border-blue-500/20">
                    <Info size={12} />
                    <span>O saldo é exclusivo para a loja que o gerou</span>
                </div>
            </div>
        </div>

        <div className="flex gap-1 mt-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
            <button 
                onClick={() => setActiveTab('balances')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'balances' ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
            >
                Saldos por Loja
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
            >
                Ledger / Extrato
            </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-32 space-y-6">
        {activeTab === 'balances' ? (
            <div className="space-y-3">
                {credits.length === 0 ? (
                    <div className="text-center py-20 opacity-40 flex flex-col items-center">
                        <Coins size={48} className="mb-4" />
                        <p className="text-sm font-bold">Você ainda não possui cashback.</p>
                    </div>
                ) : (
                    credits.map((credit) => (
                        <div key={credit.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                                    {credit.store_logo ? <img src={credit.store_logo} className="w-full h-full object-contain" /> : <Store className="text-gray-300" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{(credit as any).stores?.name}</h4>
                                    <p className="text-[10px] text-green-600 font-bold uppercase">Saldo Exclusivo</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="lg font-black text-gray-900 dark:text-white">{formatBRL(credit.balance_cents)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                {history.map((entry, idx) => (
                    <div key={entry.id} className={`p-5 flex items-center justify-between ${idx !== history.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                {entry.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-xs">{entry.stores?.name}</h4>
                                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                    {entry.type === 'credit' ? `Expira em ${new Date(entry.expires_at).toLocaleDateString()}` : 'Resgate de saldo'}
                                </p>
                            </div>
                        </div>
                        <p className={`font-black text-sm ${entry.type === 'credit' ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {entry.type === 'credit' ? '+' : '-'} {formatBRL(entry.amount_cents)}
                        </p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};