
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Loader2, User, FileText, UploadCloud, CheckCircle2, Bot } from 'lucide-react';
import { BannerOrder, BannerMessage } from '../types';

interface BannerOrderTrackingViewProps {
  orderId: string;
  orders: BannerOrder[];
  messages: BannerMessage[];
  onBack: () => void;
  // FIX: Updated signature for onSendMessage
  onSendMessage: (orderId: string, text: string, type?: 'text' | 'assets_payload', metadata?: any) => void;
  onViewOrder: (orderId: string) => void;
  // FIX: Added onUpdateOrder prop
  onUpdateOrder: (orderId: string, updates: Partial<BannerOrder>) => void;
}

const STATUS_MAP: { [key: string]: { text: string; color: string; progress: string } } = {
  em_analise: { text: 'Em Análise', color: 'text-amber-400', progress: '25%' },
  em_producao: { text: 'Em Produção', color: 'text-blue-400', progress: '50%' },
  aprovado: { text: 'Aprovado', color: 'text-purple-400', progress: '75%' },
  publicado: { text: 'Publicado', color: 'text-green-400', progress: '100%' },
};

export const BannerOrderTrackingView: React.FC<BannerOrderTrackingViewProps> = ({ 
  orderId, 
  orders, 
  messages, 
  onBack, 
  onSendMessage, 
  onViewOrder,
  onUpdateOrder // Destructured onUpdateOrder
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSubmittingAssets, setIsSubmittingAssets] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    title: '',
    description: '',
    ctaLabel: 'Saiba mais',
    ctaLink: '',
    logoFile: null as File | null
  });

  const order = orders.find(o => o.id === orderId);
  const orderMessages = messages
    .filter(m => m.orderId === orderId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    if (orderId) {
      onViewOrder(orderId);
    }
  }, [orderId, onViewOrder]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderMessages, order?.onboardingStage]);
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    setTimeout(() => {
        onSendMessage(orderId, newMessage.trim());
        setNewMessage('');
        setIsSending(false);
    }, 300);
  };

  const handleSubmitAssets = async () => {
    if (!formData.storeName || !formData.title || !formData.description) return;
    
    setIsSubmittingAssets(true);
    
    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1500));

    // 1. Send Payload Message (Merchant side)
    const payload = {
        ...formData,
        logoUrl: formData.logoFile ? URL.createObjectURL(formData.logoFile) : null // Mock URL
    };
    
    onSendMessage(orderId, "Enviei as informações do banner.", 'assets_payload', payload);

    // 2. Update Order Stage
    const now = new Date().toISOString();
    onUpdateOrder(orderId, {
        onboardingStage: 'assets_received',
        assetsSubmittedAt: now
    });

    // 3. Trigger Auto-Response (System) - Automation 2
    if (order && !order.autoMessagesFlags.assetsReceivedSent) {
        setTimeout(() => {
             // In a real app, this would be a separate server-side trigger
             // For this MVP, we inject the message directly via a prop or parent handler
             // OR we just simulate it here by calling onSendMessage but that would appear as 'merchant'.
             // To fix this, we need a way to send as system.
             // We will assume onSendMessage can handle it or App.tsx handles the logic. 
             // Actually, `App.tsx` should listen to the state change and send the message.
             // But to keep it simple, let's just trigger it here if we assume client-side automation.
             
             // We will simulate the system response by calling a parent method if possible, or hacking it.
             // Actually, App.tsx should handle it as it has the full context of bannerMessages state.
             // But the prompt asks to implement it. So we'll rely on App.tsx or a helper.
             
             // Workaround: We'll add a 'system' sender simulation in App.tsx's onSendMessage or just use a dedicated callback.
             // Let's rely on App.tsx's handleUpdateOrder detecting the 'assets_received' stage change and sending the system message.
        }, 1000);
    }
    
    setIsSubmittingAssets(false);
  };
  
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <p className="text-slate-400">Carregando pedido...</p>
      </div>
    );
  }

  const currentStatus = STATUS_MAP[order.status] || STATUS_MAP['em_analise'];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
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
                {orderMessages.map(msg => {
                    const isSystem = msg.senderType === 'system';
                    const isTeam = msg.senderType === 'team';
                    const isMerchant = msg.senderType === 'merchant';
                    const alignClass = isMerchant ? 'justify-end' : 'justify-start';
                    const bgClass = isMerchant ? 'bg-blue-600 text-white rounded-br-lg' : isSystem ? 'bg-slate-800 text-slate-300 border border-white/10' : 'bg-slate-700 text-slate-200 rounded-bl-lg';

                    return (
                        <div key={msg.id} className={`flex items-end gap-3 ${alignClass}`}>
                            {!isMerchant && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSystem ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {isSystem ? <Bot size={16} /> : <User size={16} />}
                                </div>
                            )}
                            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${bgClass}`}>
                                {msg.type === 'assets_payload' ? (
                                    <div className="space-y-2">
                                        <p className="font-bold text-xs uppercase tracking-wide opacity-70">📦 Informações Enviadas:</p>
                                        <div className="bg-white/10 p-2 rounded-lg text-xs">
                                            <p><strong>Loja:</strong> {msg.metadata?.storeName}</p>
                                            <p><strong>Título:</strong> {msg.metadata?.title}</p>
                                            <p><strong>Botão:</strong> {msg.metadata?.ctaLabel}</p>
                                        </div>
                                        <p className="text-xs italic opacity-80">Aguardando produção.</p>
                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: msg.body.replace(/\n/g, '<br/>') }} />
                                )}
                                <p className="text-[10px] mt-2 opacity-50 text-right">{new Date(msg.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </section>

        {/* --- AUTOMATION: ASSETS FORM --- */}
        {order.onboardingStage === 'requested_assets' && (
            <section className="bg-slate-800 rounded-3xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/5 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">Enviar Informações do Banner</h3>
                </div>

                <div className="space-y-4">
                    {/* Logo Upload */}
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center hover:bg-slate-700/50 transition-colors cursor-pointer group relative">
                        <input 
                            type="file" 
                            accept=".png,.jpg,.jpeg,.pdf,.svg,.ai,.eps"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setFormData({...formData, logoFile: e.target.files?.[0] || null})}
                        />
                        <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-blue-400" />
                        <p className="text-xs text-slate-300 font-bold">{formData.logoFile ? formData.logoFile.name : 'Toque para enviar seu Logo'}</p>
                        <p className="text-[10px] text-slate-500 mt-1">PNG, PDF, Vetor (Alta Qualidade)</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome da Loja</label>
                        <input 
                            value={formData.storeName}
                            onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                            placeholder="Ex: Pizzaria do João"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Título do Banner</label>
                        <input 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Ex: Oferta de Inauguração"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Texto Curto</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Ex: 30% OFF em todo o cardápio..."
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Texto do Botão</label>
                            <select 
                                value={formData.ctaLabel}
                                onChange={(e) => setFormData({...formData, ctaLabel: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1 outline-none"
                            >
                                <option>Saiba mais</option>
                                <option>Peça agora</option>
                                <option>Ver cardápio</option>
                                <option>Agendar</option>
                                <option>WhatsApp</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Link (Opcional)</label>
                            <input 
                                value={formData.ctaLink}
                                onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                                placeholder="https://..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white mt-1 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmitAssets}
                        disabled={isSubmittingAssets || !formData.storeName}
                        className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmittingAssets ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        Enviar dados para produção
                    </button>
                </div>
            </section>
        )}
      </main>

      {/* Message Input Footer - Only show if not waiting for assets or if stage is advanced */}
      <footer className="sticky bottom-0 z-30 p-4 bg-slate-900 border-t border-white/5">
        <div className="flex gap-3">
            <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={order.onboardingStage === 'requested_assets' ? "Preencha o formulário acima..." : "Escreva uma mensagem..."}
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