
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Clock, User, Store, CheckCircle, Search, Send, Loader2, AlertCircle } from 'lucide-react';
import { SupportTicket, SupportMessage } from '../types';

interface AdminSupportViewProps {
  onBack: () => void;
}

export const AdminSupportView: React.FC<AdminSupportViewProps> = ({ onBack }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: '1', user_id: 'u1', user_name: 'Marcos Silva', profile_type: 'user', status: 'waiting', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), unread_count: 1 },
    { id: '2', user_id: 'm1', user_name: 'Pizzaria do Zé', profile_type: 'merchant', status: 'active', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), unread_count: 0 }
  ]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<Partial<SupportMessage>[]>([]);
  const [reply, setReply] = useState('');

  const getWaitTime = (createdAt: string) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));
    return `${diff} min`;
  };

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    // Simular carregamento de mensagens do ticket
    setMessages([
      { sender_type: 'user', text: 'Olá, meu cashback não caiu.', created_at: ticket.created_at },
      { sender_type: 'bot', text: 'Você entrou na fila. Tempo estimado: 10 min.', created_at: ticket.created_at }
    ]);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    setMessages(prev => [...prev, { sender_type: 'admin', text: reply, created_at: new Date().toISOString() }]);
    setReply('');
  };

  const resolveTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    setSelectedTicket(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col animate-in fade-in duration-500">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-slate-800 text-gray-400 hover:text-white rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-lg text-white uppercase tracking-tighter">Central de Atendimento</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suporte Humanizado Localizei</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Ticket List */}
        <div className={`w-full md:w-80 border-r border-white/5 bg-slate-900/50 flex flex-col ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input placeholder="Buscar ticket..." className="w-full bg-slate-800 border-none rounded-xl py-2 pl-10 text-xs outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
            {tickets.map(t => (
              <button 
                key={t.id}
                onClick={() => handleSelectTicket(t)}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                  selectedTicket?.id === t.id ? 'bg-[#1E5BFF] border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {t.profile_type === 'user' ? <User size={12} className="text-blue-400" /> : <Store size={12} className="text-purple-400" />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTicket?.id === t.id ? 'text-white' : 'text-slate-400'}`}>{t.profile_type === 'user' ? 'Usuário' : 'Lojista'}</span>
                  </div>
                  <span className="text-[9px] font-bold opacity-60 flex items-center gap-1"><Clock size={10} /> {getWaitTime(t.created_at)}</span>
                </div>
                <h4 className="font-bold text-sm truncate">{t.user_name}</h4>
                <p className={`text-[10px] mt-1 line-clamp-1 ${selectedTicket?.id === t.id ? 'text-blue-100' : 'text-slate-500'}`}>{t.last_message || 'Iniciou triagem...'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#0F172A] ${!selectedTicket ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {selectedTicket ? (
            <>
              <div className="p-4 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedTicket(null)} className="md:hidden p-2 text-slate-400"><ChevronLeft /></button>
                  <div>
                    <h3 className="font-bold text-white">{selectedTicket.user_name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Ticket #{selectedTicket.id.split('-')[1]}</p>
                  </div>
                </div>
                <button 
                  onClick={() => resolveTicket(selectedTicket.id)}
                  className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                >
                  Finalizar
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${
                      m.sender_type === 'admin' ? 'bg-[#1E5BFF] text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none border border-white/5'
                    }`}>
                      {m.text}
                      <p className="text-[9px] mt-2 opacity-50 text-right">{new Date(m.created_at!).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="p-4 bg-slate-900 border-t border-white/5 flex gap-3">
                <input 
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  className="flex-1 bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF]/50"
                />
                <button className="w-12 h-12 bg-[#1E5BFF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center opacity-30">
              <MessageSquare size={64} className="mx-auto mb-4" />
              <p className="font-black uppercase tracking-[0.3em]">Selecione um ticket <br/> para atender</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
