
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Tag, PiggyBank } from 'lucide-react';

interface UserCouponsHistoryViewProps {
  onBack: () => void;
}

const COUPON_HISTORY = [
  { id: '1', storeName: 'Hamburgueria Brasa', date: '2023-11-14T19:30:00', saved: 15.50, status: 'used', discountLabel: 'R$ 15,50' },
  { id: '2', storeName: 'Padaria Imperial', date: '2023-11-10T09:15:00', saved: 5.00, status: 'used', discountLabel: '5% OFF' },
  { id: '3', storeName: 'Pet Shop Amigo', date: '2023-11-05T14:20:00', saved: 12.00, status: 'expired', discountLabel: 'R$ 12,00' },
];

export const UserCouponsHistoryView: React.FC<UserCouponsHistoryViewProps> = ({ onBack }) => {
  const totalSaved = useMemo(() => {
    return COUPON_HISTORY.filter(c => c.status === 'used').reduce((acc, curr) => acc + curr.saved, 0);
  }, []);

  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Histórico de Cupons</h1>
      </header>

      <main className="p-5 pb-24">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl mb-8">
            <div className="flex items-center gap-2 mb-2 text-emerald-100">
                <PiggyBank className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Total Economizado</span>
            </div>
            <h2 className="text-4xl font-black">R$ {totalSaved.toFixed(2)}</h2>
        </div>

        <div className="space-y-3">
            {COUPON_HISTORY.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.storeName}</h4>
                        <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                    </div>
                    <div className={`text-sm font-bold px-2 py-1 rounded-lg ${item.status === 'used' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.status === 'used' ? `- R$ ${item.saved.toFixed(2)}` : 'Expirado'}
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};
