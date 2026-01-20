import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Clock, Send, Loader2, MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { BannerOrder, BannerMessage } from '../types';

interface BannerOrderTrackingViewProps {
  orderId: string;
  orders: BannerOrder[];
  messages: BannerMessage[];
  onBack: () => void;
  onSendMessage: (orderId: string, text: string) => void;
  onViewOrder: (orderId: string) => void;
}

const STATUS_MAP: { [key: string]: { text: string; color: string; progress: string } } = {
  em_analise: { text: 'Em Análise', color: 'text-amber-400', progress: '25%' },
  em_producao: { text: 'Em Produção', color: 'text-blue-400', progress: '50%' },
  aprovado: { text: 'Aprovado', color: 'text-purple-400', progress: '75%' },
  publicado: { text: 'Publicado', color: 'text-green-400', progress: '100%' },
};

export const BannerOrderTrackingView: React.FC<BannerOrderTrackingViewProps> = ({ orderId, orders, messages, onBack, onSendMessage, onViewOrder }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find(o => o.id === orderId);
  const orderMessages = messages
    .filter(m => m.orderId === orderId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    onViewOrder(orderId);
  }, [orderId, onViewOrder]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderMessages]);
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    setTimeout(() => {
        onSendMessage(orderId, newMessage.trim());
        setNewMessage('');
        setIsSending(false);
    }, 500);
  };
  
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <p className="text-slate-400">Carregando pedido...</p>
      </div>
    );
  }

  const currentStatus = STATUS_MAP[order.status];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border-white/5 rounded-xl active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Pedido #{order.id.slice(-6)}</h1>
          <p className="text-xs text-slate-500">Banner Profissional</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Status Section */}
        <section className="bg-slate-800 rounded-3xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm">Status do Pedido</h3>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentStatus.color.replace('text-', 'bg-')}/10 ${currentStatus.color}`}>{currentStatus.text}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{width: currentStatus.progress}}></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Prazo estimado: <span className="font-bold text-white">48h úteis</span></p>
        </section>

        {/* Messages Section */}
        <section>
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Mensagens do Pedido</h3>
            <div className="space-y-4">
                {orderMessages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.senderType === 'merchant' ? 'justify-end' : 'justify-start'}`}>
                        {msg.senderType === 'team' && <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0"><User size={16} /></div>}
                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${msg.senderType === 'merchant' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-700 text-slate-200 rounded-bl-lg'}`}>
                            {msg.body}
                            <p className="text-[10px] mt-2 opacity-50 text-right">{new Date(msg.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </section>
      </main>

      {/* Message Input Footer */}
      <footer className="sticky bottom-0 z-30 p-4 bg-slate-900 border-t border-white/5">
        <div className="flex gap-3">
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva uma mensagem para a equipe..."
                className="flex-1 bg-slate-800 text-white rounded-2xl p-4 text-sm resize-none border border-slate-700 focus:border-blue-500 outline-none transition-colors"
                rows={1}
            />
            <button
                onClick={handleSend}
                disabled={isSending || !newMessage.trim()}
                className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-50 active:scale-95 transition-transform"
            >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
        </div>
      </footer>
    </div>
  );
};
