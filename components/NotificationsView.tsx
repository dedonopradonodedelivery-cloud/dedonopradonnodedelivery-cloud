

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
  Loader2,
  Info,
  CreditCard,
  Megaphone,
  Paintbrush,
  // FIX: Imported the missing Clock icon from lucide-react.
  Clock
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  userRole: 'cliente' | 'lojista' | 'admin' | null;
}

// MOCK INICIAL COM OS TIPOS SOLICITADOS
const INITIAL_MOCK_NOTIFS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'u1',
    title: 'Novo orçamento recebido',
    message: 'O profissional "Carlos Elétrica" enviou uma proposta.',
    type: 'chat',
    referenceId: 'REQ-4582',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'u1',
    title: 'Designer respondeu seu banner',
    message: 'A primeira versão da sua arte PRO já está pronta para revisão.',
    type: 'design',
    referenceId: 'DSG-8821',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'u1',
    title: 'Cupom do Dia liberado! 🎟️',
    message: 'Resgate agora seu desconto de 20% na Padaria Imperial.',
    type: 'coupon',
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 'u1',
    title: 'Pagamento confirmado',
    message: 'Seu destaque "Home + Cat" foi ativado com sucesso.',
    type: 'payment',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    userId: 'u1',
    title: 'Destaque aprovado',
    message: 'Sua marca já está aparecendo no topo da Freguesia.',
    type: 'ad',
    read: true,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  }
];

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack, onNavigate, userRole }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('app_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(INITIAL_MOCK_NOTIFS);
      localStorage.setItem('app_notifications', JSON.stringify(INITIAL_MOCK_NOTIFS));
    }
    setLoading(false);
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('app_notifications', JSON.stringify(updated));
  };

  const handleNotifClick = (notif: AppNotification) => {
    markAsRead(notif.id);

    // LÓGICA DE NAVEGAÇÃO POR TIPO
    switch (notif.type) {
      case 'chat':
        onNavigate('service_chat', { requestId: notif.referenceId });
        break;
      case 'design':
        // No contexto do design PRO, usamos o mesmo chat de serviço
        onNavigate('service_chat', { requestId: notif.referenceId });
        break;
      case 'coupon':
        onNavigate('user_coupons');
        break;
      case 'payment':
        // Direciona para o financeiro do lojista ou histórico do cliente
        onNavigate(userRole === 'lojista' ? 'store_finance' : 'user_coupons');
        break;
      case 'ad':
        onNavigate('store_ads_module');
        break;
      default:
        onBack();
    }
  };

  const clearAll = () => {
    if (confirm('Deseja limpar todas as notificações?')) {
      setNotifications([]);
      localStorage.setItem('app_notifications', JSON.stringify([]));
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'chat': return { icon: <MessageSquare size={20} />, bg: 'bg-blue-100 text-blue-600' };
      case 'design': return { icon: <Paintbrush size={20} />, bg: 'bg-purple-100 text-purple-600' };
      case 'coupon': return { icon: <Tag size={20} />, bg: 'bg-emerald-100 text-emerald-600' };
      case 'payment': return { icon: <CreditCard size={20} />, bg: 'bg-amber-100 text-amber-600' };
      case 'ad': return { icon: <Megaphone size={20} />, bg: 'bg-indigo-100 text-indigo-600' };
      default: return { icon: <Bell size={20} />, bg: 'bg-gray-100 text-gray-600' };
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Notificações</h1>
        </div>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500">Limpar</button>
        )}
      </header>

      <main className="flex-1 p-5 space-y-4 overflow-y-auto no-scrollbar pb-32">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <Bell size={32} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Você está em dia 😊</h3>
            <p className="text-sm text-gray-500 mt-2">Nenhum aviso novo por aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => {
              const style = getIcon(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] ${
                    notif.read 
                      ? 'bg-white/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-70' 
                      : 'bg-white dark:bg-gray-900 border-white dark:border-gray-800 shadow-xl shadow-blue-900/5'
                  }`}
                >
                  {!notif.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-black leading-tight ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Clock size={10} className="text-gray-400" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <div className="px-5 pb-32">
        <div className="bg-[#1E5BFF] p-6 rounded-[2.5rem] shadow-xl shadow-blue-500/20 flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('support')}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white"><Info size={20} /></div>
                <div>
                    <p className="text-xs font-bold text-white">Problemas com avisos?</p>
                    <p className="text-[10px] text-blue-100 uppercase font-black tracking-widest mt-0.5">Fale com nosso suporte</p>
                </div>
            </div>
            <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};