import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Paperclip, 
  Clock,
  User,
  MessageSquare
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DesignerPanelProps {
  user: SupabaseUser | null;
  onBack: () => void;
}

// Mock Data
const MOCK_ORDERS = [
  { id: 'ord-1', merchantName: 'Hamburgueria do Zé', serviceType: 'Banner Home', status: 'new', date: 'Hoje, 10:00' },
  { id: 'ord-2', merchantName: 'Studio Bella', serviceType: 'Destaque Categoria', status: 'in_progress', date: 'Ontem' },
  { id: 'ord-3', merchantName: 'PetShop Patas', serviceType: 'Banner Home', status: 'review', date: '02 Nov' },
];

const MOCK_MESSAGES = [
  { id: 1, role: 'system', text: 'Pedido iniciado. O cliente enviou os arquivos.', timestamp: '10:00' },
  { id: 2, role: 'merchant', text: 'Olá, gostaria de algo com cores vibrantes.', timestamp: '10:05' },
  { id: 3, role: 'designer', text: 'Perfeito! Vou preparar um esboço.', timestamp: '10:10' },
];

export const DesignerPanel: React.FC<DesignerPanelProps> = ({ user, onBack }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'chat'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setActiveView('chat');
    // Simulate loading messages
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleBackToBoard = () => {
    setSelectedOrder(null);
    setActiveView('dashboard');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      role: 'designer',
      text: chatInput,
      timestamp: 'Agora'
    };
    
    setMessages([...messages, newMsg]);
    setChatInput('');
  };

  useEffect(() => {
    if (activeView === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeView]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      {activeView === 'dashboard' && (
        <>
          <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2.5 bg-[#1F2937] text-gray-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-black text-lg text-white">Painel do Designer</h1>
              <p className="text-xs text-slate-500 font-medium">Gerenciamento de pedidos</p>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
             <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Pedidos Recentes</h3>
                {MOCK_ORDERS.map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => handleOrderClick(order)}
                    className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-all active:scale-[0.98]"
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          order.status === 'new' ? 'bg-blue-500/10 text-blue-400' : 
                          order.status === 'review' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                           <User size={20} />
                        </div>
                        <div>
                           <h4 className="font-bold text-white text-sm">{order.merchantName}</h4>
                           <p className="text-xs text-slate-500">{order.serviceType} • {order.date}</p>
                        </div>
                     </div>
                     {order.status === 'new' && (
                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                     )}
                  </div>
                ))}
             </div>
          </main>
        </>
      )}

      {/* --- CHAT VIEW --- */}
      {activeView === 'chat' && selectedOrder && (
        <div className="flex flex-col h-full bg-[#0F172A] fixed inset-0 z-[60]">
          
          {/* Chat Header */}
          <header className="bg-slate-900 border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <button onClick={handleBackToBoard} className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="font-bold text-white text-sm flex items-center gap-2">
                  {selectedOrder.merchantName}
                  <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wide">
                    {selectedOrder.serviceType}
                  </span>
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 font-medium">Online no pedido #{selectedOrder.id}</p>
                </div>
              </div>
            </div>
            
            <button className="p-2 text-slate-500 hover:text-white">
              <MoreHorizontal size={20} />
            </button>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
             {loading ? (
               <div className="flex justify-center pt-10"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
             ) : (
               <>
                 {messages.map((msg) => (
                   <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === 'designer' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      {msg.role === 'system' ? (
                        <div className="w-full flex justify-center my-4">
                          <div className="bg-slate-800/50 border border-white/5 rounded-full px-4 py-1.5 text-[10px] text-slate-400 font-medium text-center">
                            {msg.text}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                            msg.role === 'designer' 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-600 font-bold mt-1 px-1">{msg.timestamp}</span>
                        </>
                      )}
                   </div>
                 ))}
                 <div ref={chatEndRef} />
               </>
             )}
          </div>

          {/* Input Area */}
          <footer className="p-4 bg-slate-900 border-t border-white/5">
             {/* Quick Actions (optional) */}
             {selectedOrder.status === 'review' && (
                <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                   <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-green-500/20">
                      <CheckCircle2 size={12} /> Aprovar Arte
                   </button>
                   <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-amber-500/20">
                      <AlertCircle size={12} /> Pedir Alteração
                   </button>
                </div>
             )}

             <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <button type="button" className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                   <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                   <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={!chatInput.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
                >
                   <Send size={20} className={chatInput.trim() ? 'fill-current' : ''} />
                </button>
             </form>
          </footer>
        </div>
      )}
    </div>
  );
};