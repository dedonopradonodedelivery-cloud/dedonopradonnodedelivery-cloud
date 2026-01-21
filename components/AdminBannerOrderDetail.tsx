import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Loader2, User, Shield, Briefcase } from 'lucide-react';
import { BannerOrder, BannerMessage } from '../types';

interface AdminBannerOrderDetailProps {
  orderId: string;
  orders: BannerOrder[];
  messages: BannerMessage[];
  onBack: () => void;
  onSendMessage: (orderId: string, text: string) => void;
}

export const AdminBannerOrderDetail: React.FC<AdminBannerOrderDetailProps> = ({ orderId, orders, messages, onBack, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find(o => o.id === orderId);
  const orderMessages = messages
    .filter(m => m.orderId === orderId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderMessages]);
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    // Simulate network delay
    setTimeout(() => {
        onSendMessage(orderId, newMessage.trim());
        setNewMessage('');
        setIsSending(false);
    }, 500);
  };
  
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <p className="text-slate-400">Carregando pedido...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
            <ChevronLeft size={20} />
            </button>
            <div>
            <h1 className="font-bold text-lg leading-none">Pedido #{order.id.slice(-6)}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Briefcase size={10} /> Lojista ID: {order.merchantId.slice(0,6)}</p>
            </div>
        </div>
        <div className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold border border-white/10 uppercase">
            {order.status.replace('_', ' ')}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        
        {/* Info Card */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center text-xs text-slate-400">
            <span>Criado em: {new Date(order.createdAt).toLocaleDateString()}</span>
            <span>Valor: R$ {(order.total / 100).toFixed(2).replace('.', ',')}</span>
        </div>

        {/* Chat Section */}
        <div className="space-y-4 pb-4">
            <div className="flex justify-center my-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-white/5">Início do Atendimento</span>
            </div>
            {orderMessages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.senderType === 'team' ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderType === 'merchant' && <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-white/10"><User size={14} className="text-slate-400" /></div>}
                    
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.senderType === 'team' 
                        ? 'bg-[#1E5BFF] text-white rounded-br-none' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                    }`}>
                        {msg.body}
                        <p className={`text-[9px] mt-1.5 opacity-60 text-right ${msg.senderType === 'team' ? 'text-blue-100' : 'text-slate-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>

                    {msg.senderType === 'team' && <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-500/30"><Shield size={14} className="text-blue-400" /></div>}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="sticky bottom-0 z-30 p-4 bg-slate-900 border-t border-white/5">
        <div className="flex gap-3 items-end bg-slate-800/50 p-2 rounded-[20px] border border-white/5">
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Responder como Equipe..."
                className="flex-1 bg-transparent text-white p-3 text-sm resize-none outline-none max-h-32 placeholder-slate-500"
                rows={1}
                style={{ minHeight: '44px' }}
            />
            <button
                onClick={handleSend}
                disabled={isSending || !newMessage.trim()}
                className="w-10 h-10 bg-[#1E5BFF] rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 active:scale-90 transition-transform mb-1 mr-1"
            >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
            </button>
        </div>
      </footer>
    </div>
  );
};