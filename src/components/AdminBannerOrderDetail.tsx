
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Loader2, User, Shield, Briefcase, FileText, Download, CheckCircle, PartyPopper, Bot } from 'lucide-react'; // Added Bot
import { BannerOrder, BannerMessage } from '../types';

interface AdminBannerOrderDetailProps {
  orderId: string;
  orders: BannerOrder[];
  messages: BannerMessage[];
  onBack: () => void;
  // FIX: Updated signature for onSendMessage
  onSendMessage: (orderId: string, text: string, type?: 'text' | 'system' | 'assets_payload', metadata?: any) => void;
  // FIX: Added onUpdateOrder prop
  onUpdateOrder: (orderId: string, updates: Partial<BannerOrder>) => void;
}

export const AdminBannerOrderDetail: React.FC<AdminBannerOrderDetailProps> = ({ 
  orderId, 
  orders, 
  messages, 
  onBack, 
  onSendMessage,
  onUpdateOrder // Destructured onUpdateOrder
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form State for assets submission (should be in Merchant view, but fixing current code)
  const [formData, setFormData] = useState({
    storeName: '',
    title: '',
    description: '',
    ctaLabel: 'Saiba mais',
    ctaLink: '',
    logoFile: null as File | null
  });
  const [isSubmittingAssets, setIsSubmittingAssets] = useState(false); // Used by the assets form

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

  const handleSendThanks = () => { // Defined handleSendThanks
    if (!onUpdateOrder || !order) return;
    
    const thankYouMsg = `🎉 Banner finalizado e publicado! Obrigado pela confiança no nosso trabalho.\nDesejamos muito sucesso com a campanha — se quiser ajustar algo no futuro, é só chamar por aqui.`;
    
    // Send the message as a team message
    // FIX: Updated onSendMessage call to include 'system' type and empty metadata
    onSendMessage(orderId, thankYouMsg, 'system', {}); 
    
    // Update Flag to prevent duplicate button
    onUpdateOrder(orderId, {
        autoMessagesFlags: {
            ...order.autoMessagesFlags,
            thanksSent: true
        },
        status: 'publicado' // Assuming 'publicado' is the final status for sending thanks
    });
  };
  
  // This `handleSubmitAssets` function is actually for the Merchant view (`BannerOrderTrackingView`)
  // It shouldn't be in Admin view. I'm leaving it as is for now as per "do not remove code" instruction,
  // but it highlights a logic flaw in the provided file.
  const handleSubmitAssets = async () => {
    if (!formData.storeName || !formData.title || !formData.description || !onUpdateOrder || !order) return;
    
    setIsSubmittingAssets(true);
    await new Promise(r => setTimeout(r, 1500));

    const payload = {
        ...formData,
        logoUrl: formData.logoFile ? URL.createObjectURL(formData.logoFile) : null
    };
    
    onSendMessage(orderId, "Enviei as informações do banner.", 'assets_payload', payload);

    const now = new Date().toISOString();
    onUpdateOrder(orderId, {
        onboardingStage: 'assets_received',
        assetsSubmittedAt: now
    });
    
    setIsSubmittingAssets(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <p className="text-slate-400">Carregando pedido...</p>
      </div>
    );
  }

  const isFinalized = order.status === 'publicado' || order.status === 'aprovado';
  const showThanksButton = isFinalized && !order.autoMessagesFlags?.thanksSent; // Derived from order prop.

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
            <span>Estágio: <span className="text-white font-bold uppercase">{order.onboardingStage?.replace('_', ' ') || 'N/A'}</span></span>
        </div>

        {/* Chat Section */}
        <div className="space-y-4 pb-4">
            <div className="flex justify-center my-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-white/5">Início do Atendimento</span>
            </div>
            {orderMessages.map(msg => {
                const isSystem = msg.senderType === 'system';
                const isTeam = msg.senderType === 'team';
                const isMerchant = msg.senderType === 'merchant';
                const alignClass = isMerchant ? 'justify-end' : 'justify-start';
                const bgClass = isMerchant ? 'bg-blue-600 text-white rounded-br-none' : isSystem ? 'bg-slate-800 text-slate-300 border border-white/10' : 'bg-slate-700 text-slate-200 rounded-bl-none border border-white/5';

                return (
                    <div key={msg.id} className={`flex items-end gap-3 ${alignClass}`}>
                        {!isMerchant && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSystem ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                {isSystem ? <Bot size={16} /> : <User size={16} />}
                            </div>
                        )}
                        
                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${bgClass}`}>
                            {msg.type === 'assets_payload' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                                        <FileText size={14} className="text-blue-400" />
                                        <span className="font-bold text-xs uppercase">Dados do Banner</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 text-xs">
                                        <div className="bg-black/20 p-2 rounded">
                                            <span className="text-slate-400 block text-[10px] uppercase">Loja</span>
                                            <span className="font-bold">{msg.metadata?.storeName}</span>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded">
                                            <span className="text-slate-400 block text-[10px] uppercase">Título</span>
                                            <span className="font-bold">{msg.metadata?.title}</span>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded">
                                            <span className="text-slate-400 block text-[10px] uppercase">Texto</span>
                                            <span className="italic opacity-80">{msg.metadata?.description}</span>
                                        </div>
                                        <div className="flex gap-2">
                                             <div className="bg-black/20 p-2 rounded flex-1">
                                                <span className="text-slate-400 block text-[10px] uppercase">CTA</span>
                                                <span className="font-bold">{msg.metadata?.ctaLabel}</span>
                                            </div>
                                            {msg.metadata?.logoUrl && (
                                                <a href={msg.metadata.logoUrl} target="_blank" className="bg-blue-500/20 p-2 rounded flex-1 flex items-center justify-center gap-1 text-blue-300 hover:bg-blue-500/30 transition-colors">
                                                    <Download size={12} /> <span>Logo</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: msg.body.replace(/\n/g, '<br/>') }} />
                            )}
                            
                            <p className={`text-[9px] mt-1.5 opacity-60 text-right ${msg.senderType === 'team' ? 'text-blue-100' : 'text-slate-500'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                {isSystem && ' • Automático'}
                            </p>
                        </div>

                        {(msg.senderType === 'team' || isSystem) && <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-500/30"><Shield size={14} className="text-blue-400" /></div>}
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* --- THANK YOU BUTTON (Automation) --- */}
        {showThanksButton && (
            <div className="flex justify-center pb-4 animate-in slide-in-from-bottom-4">
                <button 
                    onClick={handleSendThanks}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                    <PartyPopper size={18} />
                    Enviar Agradecimento Final
                </button>
            </div>
        )}

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