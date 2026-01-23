
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Palette, 
  ChevronLeft, 
  ChevronRight,
  X, 
  Search, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  Paperclip,
  Check,
  Building,
  Loader2,
  Calendar,
  Hourglass,
  Flag,
  Bell
} from 'lucide-react';

interface DesignerPanelProps {
  user: User;
  onBack: () => void;
}

interface OrderCard {
  id: string;
  merchantId: string;
  merchantName: string;
  serviceType: string;
  status: 'new' | 'production' | 'review' | 'done';
  date: string;
  priority?: 'urgent' | 'priority' | 'normal';
  purchaseDate: string;
  deliveryDeadline: string;
  hasUnreadMessages?: boolean; // Novo campo para notificação
}

interface ChatMessage {
  id: number;
  role: 'user' | 'designer' | 'system';
  text: string;
  timestamp: string;
  type?: 'text' | 'image' | 'file';
}

const INITIAL_ORDERS: OrderCard[] = [
  { id: 'ord-001', merchantId: 'm-123', merchantName: 'Hamburgueria Brasa', serviceType: 'Banner Home', status: 'new', date: 'Hoje, 10:30', priority: 'urgent', purchaseDate: '22/01/2026', deliveryDeadline: '25/01/2026', hasUnreadMessages: false },
  { id: 'ord-002', merchantId: 'm-456', merchantName: 'Studio Hair Vip', serviceType: 'Destaque Categoria', status: 'production', date: 'Ontem, 16:20', priority: 'priority', purchaseDate: '21/01/2026', deliveryDeadline: '24/01/2026', hasUnreadMessages: false },
  { id: 'ord-003', merchantId: 'm-789', merchantName: 'PetShop Amigo', serviceType: 'Arte Instagram', status: 'review', date: '10/11', priority: 'normal', purchaseDate: '19/01/2026', deliveryDeadline: '22/01/2026', hasUnreadMessages: false },
  { id: 'ord-004', merchantId: 'm-321', merchantName: 'Farmácia Central', serviceType: 'Banner Promo', status: 'done', date: '08/11', priority: 'normal', purchaseDate: '15/01/2026', deliveryDeadline: '18/01/2026', hasUnreadMessages: false },
  { id: 'ord-005', merchantId: 'm-654', merchantName: 'Pizzaria do Zé', serviceType: 'Banner Home', status: 'new', date: 'Hoje, 09:15', priority: 'normal', purchaseDate: '23/01/2026', deliveryDeadline: '26/01/2026', hasUnreadMessages: false },
];

const COLUMNS = [
  { id: 'new', title: 'Novos', color: 'bg-blue-500' },
  { id: 'production', title: 'Em Produção', color: 'bg-amber-500' },
  { id: 'review', title: 'Revisão', color: 'bg-purple-500' },
  { id: 'done', title: 'Concluído', color: 'bg-emerald-500' },
];

export const DesignerPanel: React.FC<DesignerPanelProps> = ({ user, onBack }) => {
  const [activeView, setActiveView] = useState<'board' | 'chat'>('board');
  const [orders, setOrders] = useState<OrderCard[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderCard | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  
  // State for priority menu
  const [openPriorityMenu, setOpenPriorityMenu] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- SIMULAÇÃO DE MENSAGEM EM TEMPO REAL ---
  useEffect(() => {
    // Simula o recebimento de uma mensagem do Lojista (ord-002) após 5 segundos
    const timer = setTimeout(() => {
        setOrders(prevOrders => prevOrders.map(o => {
            if (o.id === 'ord-002') {
                // Regra anti-bug: Se o designer já está no chat deste pedido, não marca como não lida
                if (activeView === 'chat' && selectedOrder?.id === 'ord-002') {
                    return o;
                }
                return { ...o, hasUnreadMessages: true };
            }
            return o;
        }));
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeView, selectedOrder]);

  // Handle Opening Chat
  const handleOpenChat = (order: OrderCard) => {
    // Remove notificação de "Nova mensagem" ao abrir o chat (Regra 4)
    if (order.hasUnreadMessages) {
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, hasUnreadMessages: false } : o));
    }

    setLoading(true);
    setSelectedOrder(order);
    
    // Simulate fetching chat history based on orderID
    setTimeout(() => {
      const mockHistory: ChatMessage[] = [
        { id: 1, role: 'system', text: `Chat iniciado para o pedido #${order.id} - ${order.serviceType}`, timestamp: order.date },
        { id: 2, role: 'system', text: 'Olá! Me envie as informações/briefing para iniciarmos seu material.', timestamp: 'Automático' }
      ];
      
      // Add some fake context if it's not "new"
      if (order.status !== 'new') {
        mockHistory.push({ id: 3, role: 'user', text: 'Oi! Segue o logo em anexo.', timestamp: 'Ontem, 10:00', type: 'text' });
        mockHistory.push({ id: 4, role: 'designer', text: 'Recebido! Vou iniciar o esboço.', timestamp: 'Ontem, 10:15', type: 'text' });
      }

      setMessages(mockHistory);
      setActiveView('chat');
      setLoading(false);
    }, 600);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      role: 'designer',
      text: chatInput,
      timestamp: 'Agora',
      type: 'text'
    };

    setMessages([...messages, newMsg]);
    setChatInput('');
    
    // Scroll to bottom
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleBackToBoard = () => {
    setActiveView('board');
    setSelectedOrder(null);
    setMessages([]);
  };

  // --- ACTIONS: Priority & Move ---

  const handleChangePriority = (e: React.MouseEvent, orderId: string, newPriority: 'urgent' | 'priority' | 'normal') => {
    e.stopPropagation();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, priority: newPriority } : o));
    setOpenPriorityMenu(null);
  };

  const handleMoveCard = (e: React.MouseEvent, order: OrderCard, direction: 'prev' | 'next') => {
    e.stopPropagation();
    
    const statusOrder: OrderCard['status'][] = ['new', 'production', 'review', 'done'];
    const currentIndex = statusOrder.indexOf(order.status);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < statusOrder.length) {
        const newStatus = statusOrder[newIndex];
        const oldStatusLabel = COLUMNS.find(c => c.id === order.status)?.title;
        const newStatusLabel = COLUMNS.find(c => c.id === newStatus)?.title;

        // 1. Update Order State
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

        // 2. Log Message to Chat (simulated)
        const systemMsg: ChatMessage = {
            id: Date.now(),
            role: 'system',
            text: `🔔 Atualização do seu pedido ${order.id}: status mudou de ${oldStatusLabel} para ${newStatusLabel}.`,
            timestamp: 'Agora'
        };

        // If chat is open for this order, append immediately
        if (selectedOrder?.id === order.id) {
            setMessages(prev => [...prev, systemMsg]);
        }
        // In a real app, you would dispatch this message to the backend here.
    }
  };

  const togglePriorityMenu = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setOpenPriorityMenu(openPriorityMenu === orderId ? null : orderId);
  };

  if (loading && !selectedOrder) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">Carregando Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col" onClick={() => setOpenPriorityMenu(null)}>
      
      {/* --- BOARD VIEW --- */}
      {activeView === 'board' && (
        <>
          <header className="bg-slate-900 border-b border-white/5 px-6 py-4 sticky top-0 z-50 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Palette size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-black text-lg text-white uppercase tracking-tighter leading-none">Designer Panel</h1>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Kanban de Pedidos</p>
              </div>
            </div>
            <button onClick={onBack} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </header>

          <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex items-stretch h-full min-w-max px-2">
              {COLUMNS.map((col, index) => {
                const colOrders = orders.filter(o => o.status === col.id);
                return (
                  <React.Fragment key={col.id}>
                    <div className="w-72 flex flex-col h-full bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
                      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                          <h3 className="font-bold text-sm text-slate-300">{col.title}</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{colOrders.length}</span>
                      </div>
                      
                      <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                        {colOrders.map(order => (
                          <div 
                            key={order.id} 
                            onClick={() => handleOpenChat(order)}
                            className={`bg-slate-800 p-4 rounded-xl shadow-sm border ${order.hasUnreadMessages ? 'border-blue-500/50 shadow-blue-500/20' : 'border-white/5'} hover:border-indigo-500/50 hover:shadow-indigo-500/10 cursor-pointer transition-all active:scale-[0.98] group relative`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{order.id}</span>
                              
                              <div className="flex gap-2">
                                  {/* --- NOTIFICAÇÃO DE NOVA MENSAGEM --- */}
                                  {order.hasUnreadMessages && (
                                    <span className="text-[8px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse shadow-sm shadow-blue-500/50">
                                      <MessageSquare size={8} className="fill-current" /> Nova msg
                                    </span>
                                  )}

                                  {/* --- INTERACTIVE PRIORITY LABEL --- */}
                                  <div className="relative">
                                      {order.priority === 'urgent' && (
                                        <button onClick={(e) => togglePriorityMenu(e, order.id)} className="text-[8px] font-bold bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors">URGENTE</button>
                                      )}
                                      {order.priority === 'priority' && (
                                        <button onClick={(e) => togglePriorityMenu(e, order.id)} className="text-[8px] font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 hover:bg-amber-500/20 transition-colors">PRIORIDADE</button>
                                      )}
                                      {order.priority === 'normal' && (
                                        <button onClick={(e) => togglePriorityMenu(e, order.id)} className="text-[8px] font-bold bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-600/50 hover:bg-slate-700 transition-colors">NORMAL</button>
                                      )}
                                      
                                      {/* Priority Dropdown */}
                                      {openPriorityMenu === order.id && (
                                          <div className="absolute top-full right-0 mt-1 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-20 flex flex-col w-24 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                              <button onClick={(e) => handleChangePriority(e, order.id, 'urgent')} className="px-3 py-2 text-left text-[9px] font-bold text-red-400 hover:bg-white/5 flex items-center gap-2"><Flag size={10} /> Urgente</button>
                                              <button onClick={(e) => handleChangePriority(e, order.id, 'priority')} className="px-3 py-2 text-left text-[9px] font-bold text-amber-400 hover:bg-white/5 flex items-center gap-2"><Flag size={10} /> Prioridade</button>
                                              <button onClick={(e) => handleChangePriority(e, order.id, 'normal')} className="px-3 py-2 text-left text-[9px] font-bold text-slate-400 hover:bg-white/5 flex items-center gap-2"><Flag size={10} /> Normal</button>
                                          </div>
                                      )}
                                  </div>
                              </div>
                            </div>
                            
                            <h4 className="font-bold text-white text-sm mb-1 leading-tight group-hover:text-indigo-400 transition-colors">{order.merchantName}</h4>
                            <p className="text-xs text-slate-400 mb-3">{order.serviceType}</p>
                            
                            {/* Datas de Compra e Entrega */}
                            <div className="mb-3 pt-3 border-t border-white/5 grid grid-cols-1 gap-1">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <Calendar size={10} className="text-slate-500" />
                                    <span>Compra: <span className="text-slate-300 font-medium">{order.purchaseDate}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <Hourglass size={10} className="text-indigo-400" />
                                    <span>Entrega: <span className="text-indigo-300 font-bold">{order.deliveryDeadline}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <Clock size={12} /> {order.date}
                              </div>
                              
                              {/* --- COLUMN NAVIGATION ARROWS --- */}
                              <div className="flex items-center gap-1">
                                {index > 0 && (
                                    <button 
                                        onClick={(e) => handleMoveCard(e, order, 'prev')} 
                                        className="p-1 rounded bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                                        title="Mover para coluna anterior"
                                    >
                                        <ChevronLeft size={12} />
                                    </button>
                                )}
                                
                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 ml-1">
                                    <MessageSquare size={12} />
                                </div>

                                {index < COLUMNS.length - 1 && (
                                    <button 
                                        onClick={(e) => handleMoveCard(e, order, 'next')} 
                                        className="p-1 rounded bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors ml-1"
                                        title="Mover para próxima coluna"
                                    >
                                        <ChevronRight size={12} />
                                    </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {colOrders.length === 0 && (
                          <div className="h-24 flex items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-xl">
                            <p className="text-[10px] font-bold uppercase tracking-widest">Vazio</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linha Divisória Vertical - Reforçada */}
                    {index < COLUMNS.length - 1 && (
                      <div className="w-[2px] h-full bg-indigo-500/20 mx-4 shrink-0 rounded-full" />
                    )}
                  </React.Fragment>
                );
              })}
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
