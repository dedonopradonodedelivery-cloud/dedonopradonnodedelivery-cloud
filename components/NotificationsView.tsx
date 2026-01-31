import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Bell, 
  MessageSquare, 
  Tag, 
  Coins, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  // Added Loader2 to imports
  Loader2,
  Info
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  userRole: 'cliente' | 'lojista' | 'admin' | null;
}

const MOCK_NOTIFS: AppNotification[] = [
  {
    id: 'n1',
    userId: 'u1',
    title: 'Novo orçamento recebido',
    message: 'Um profissional enviou uma proposta para seu serviço de pintura.',
    type: 'system', // Usando chat contexto
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    userId: 'u1',
    title: 'Cashback Liberado! 🤑',
    message: 'Você acaba de ganhar R$ 4,50 em créditos na Padaria Imperial.',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: 'n3',
    userId: 'u1',
    title: 'Banner Publicado',
    message: 'Seu banner já está ativo na categoria de Alimentação.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
  }
];

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack, onNavigate, userRole }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar do localStorage ou usar mocks
    const saved = localStorage.getItem('app_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(MOCK_NOTIFS);
      localStorage.setItem('app_notifications', JSON.stringify(MOCK_NOTIFS));
    }
    setLoading(false);
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('app_notifications', JSON.stringify(updated));
  };

  const handleNotifClick = (notif: AppNotification) => {
    // Marcar como lida
    const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('app_notifications', JSON.stringify(updated));

    // Navegação baseada no conteúdo (Inteligência de contexto)
    if (notif.title.toLowerCase().includes('orçamento') || notif.title.toLowerCase().includes('proposta')) {
      onNavigate('services');
    } else if (notif.title.toLowerCase().includes('cashback')) {
      onNavigate('user_coupons');
    } else if (notif.title.toLowerCase().includes('banner')) {
      onNavigate('store_ads_module');
    }
  };

  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('cashback')) return <Coins className="text-emerald-500" />;
    if (title.toLowerCase().includes('banner')) return <Zap className="text-purple-500" />;
    if (title.toLowerCase().includes('orçamento')) return <MessageSquare className="text-blue-500" />;
    return <Info className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Notificações</h1>
        </div>
        <button onClick={markAllAsRead} className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">Limpar tudo</button>
      </header>

      <main className="flex-1 p-5 space-y-4 overflow-y-auto no-scrollbar pb-32">
        {/* Fixed "Cannot find name 'Loader2'" by adding it to imports */}
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <Bell size={48} className="mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] ${notif.read ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50'}`}
            >
              {!notif.read && <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>}
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800 shadow-sm border border-white/10'}`}>
                  {getIcon(notif.type, notif.title)}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-sm font-bold leading-tight ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                    {new Date(notif.createdAt).toLocaleDateString()} às {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
      
      {/* Banner de Ajuda no Rodapé */}
      <div className="px-5 pb-32">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('support')}>
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 shadow-sm"><Info size={18} /></div>
                  <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Problemas com avisos?</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black">Fale com nosso suporte</p>
                  </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
          </div>
      </div>
    </div>
  );
};