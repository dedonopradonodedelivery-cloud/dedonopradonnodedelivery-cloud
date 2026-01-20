import React, { useMemo, useState } from 'react';
import { ChevronLeft, Filter, Search, Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { BannerOrder, BannerMessage } from '../types';

interface AdminBannerOrdersListProps {
  orders: BannerOrder[];
  messages: BannerMessage[];
  onBack: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const AdminBannerOrdersList: React.FC<AdminBannerOrdersListProps> = ({ orders, messages, onBack, onSelectOrder }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    let list = orders.filter(o => o.bannerType === 'professional');
    
    if (filter === 'pending') list = list.filter(o => o.status === 'em_analise' || o.status === 'em_producao');
    if (filter === 'active') list = list.filter(o => o.status === 'publicado');
    
    if (searchTerm) {
      list = list.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, filter, searchTerm]);

  // Helper to check for unread messages from MERCHANT
  const hasUnread = (order: BannerOrder) => {
    // In Admin view, "unread" means the merchant sent a message that the admin hasn't seen yet
    // Since we don't track admin's last view in this simple MVP, we can't implement a true "unread" badge 
    // unless we add a 'lastViewedAtAdmin' field.
    // For now, let's assume if the last message is from 'merchant', it might need attention.
    const lastMsg = messages
        .filter(m => m.orderId === order.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    return lastMsg && lastMsg.senderType === 'merchant';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'em_analise': return 'text-amber-400 bg-amber-400/10';
        case 'em_producao': return 'text-blue-400 bg-blue-400/10';
        case 'aprovado': return 'text-purple-400 bg-purple-400/10';
        case 'publicado': return 'text-green-400 bg-green-400/10';
        default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatStatus = (status: string) => {
      return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col animate-in fade-in duration-300">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-[#1F2937] text-gray-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-black text-lg text-white">Pedidos de Banner</h1>
          <p className="text-xs text-slate-500 font-medium">Gerenciar solicitações</p>
        </div>
      </header>

      <div className="p-4 border-b border-white/5 bg-slate-900/50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
             {['all', 'pending', 'active'].map(f => (
                 <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-[#1E5BFF] text-white' : 'bg-slate-800 text-slate-400'}`}
                 >
                     {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Ativos'}
                 </button>
             ))}
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar ID do pedido..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#1E5BFF]"
            />
        </div>
      </div>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar pb-32 space-y-3">
        {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">Nenhum pedido encontrado.</p>
            </div>
        ) : (
            filteredOrders.map(order => {
                const needsAttention = hasUnread(order);
                const lastMsg = messages
                    .filter(m => m.orderId === order.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                return (
                    <button 
                        key={order.id} 
                        onClick={() => onSelectOrder(order.id)}
                        className="w-full bg-slate-800 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all text-left relative group active:scale-[0.99]"
                    >
                        {needsAttention && (
                            <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                        )}
                        
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-slate-500">#{order.id.slice(-6)}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                {formatStatus(order.status)}
                            </span>
                        </div>
                        
                        <h3 className="font-bold text-white text-base mb-1">Loja (ID: {order.merchantId.slice(0,6)})</h3>
                        
                        {lastMsg ? (
                            <p className="text-xs text-slate-400 line-clamp-1">
                                <span className={lastMsg.senderType === 'team' ? 'text-[#1E5BFF]' : 'text-slate-300'}>
                                    {lastMsg.senderType === 'team' ? 'Você: ' : 'Lojista: '}
                                </span>
                                {lastMsg.body}
                            </p>
                        ) : (
                            <p className="text-xs text-slate-500 italic">Nenhuma mensagem ainda.</p>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </button>
                );
            })
        )}
      </main>
    </div>
  );
};