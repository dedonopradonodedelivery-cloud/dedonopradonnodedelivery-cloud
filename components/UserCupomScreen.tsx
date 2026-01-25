
import React, { useState, useMemo } from 'react';
// Added Clock to fix "Cannot find name 'Clock'" error on line 112
import { ChevronLeft, Ticket, Calendar, MapPin, Tag, Info, AlertTriangle, X, Search, ChevronRight, Clock } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface UserCupomScreenProps {
  user: User | null;
  onBack: () => void;
  onHistory: () => void;
}

export const UserCupomScreen: React.FC<UserCupomScreenProps> = ({ user, onBack, onHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'soon'>('all');

  const savedCoupons = useMemo(() => {
    const coupons = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
    return coupons.filter((c: any) => c.status === 'available');
  }, []);

  const filteredCoupons = useMemo(() => {
    let list = [...savedCoupons];
    if (searchTerm) {
        list = list.filter(c => c.storeName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filter === 'soon') {
        // Ordena por validade
        list.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    }
    return list;
  }, [savedCoupons, searchTerm, filter]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-24 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-8 pb-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Meus Cupons</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{savedCoupons.length} disponíveis</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        
        {/* Barra de Busca e Filtro */}
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar loja..."
                    className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:border-[#1E5BFF] transition-all"
                />
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === 'all' ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/10' : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-400'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setFilter('soon')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filter === 'soon' ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/10' : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-400'}`}
                >
                    Vencendo em breve
                </button>
            </div>
        </div>

        {/* Notificação de Regra de Uso */}
        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-800/30 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
                <h4 className="font-bold text-amber-700 dark:text-amber-300 text-sm">Regra importante</h4>
                <p className="text-xs text-amber-600/80 dark:text-amber-400 leading-relaxed mt-1">
                    Você pode usar **apenas 1 cupom por vez**. Este benefício não pode ser combinado com outros.
                </p>
            </div>
        </div>

        {/* Lista de Cupons Salvos */}
        <div className="space-y-4">
            {filteredCoupons.length > 0 ? filteredCoupons.map((coupon: any) => (
                <div 
                    key={coupon.id}
                    className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
                >
                    <div className="p-6 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{coupon.storeName}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <Tag size={12} /> {coupon.category}
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                Benefício Salvo
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-rose-500 font-bold text-[10px] uppercase">
                            <Clock size={12} />
                            Expira em: {new Date(coupon.expiresAt).toLocaleDateString()}
                        </div>
                        <button className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1 hover:underline">
                            Usar cupom <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            )) : (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                    <Ticket size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Você não tem cupons<br/>disponíveis no momento.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};
