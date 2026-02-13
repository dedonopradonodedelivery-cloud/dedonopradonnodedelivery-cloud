
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  // FIX: Added missing ChevronRight icon to the imports
  ChevronRight,
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
  Clock,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  userRole: 'cliente' | 'lojista' | 'admin' | null;
}

const INITIAL_MOCK_NOTIFS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'visitante',
    title: 'Bem-vindo ao Atual Clube! 🧡',
    message: 'Agora você have acesso a benefícios exclusivos em toda Jacarepaguá. Confira seu painel.',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'visitante',
    title: 'Dica do Tuco: Trânsito Livre 🦜',
    message: 'A Linha Amarela apresenta fluxo bom no sentido Barra agora. Aproveite!',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'visitante',
    title: 'Novo Cupom Disponível! 🎟️',
    message: 'A Hamburgueria Brasa liberou 15% OFF para moradores da Freguesia.',
    type: 'coupon',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 'visitante',
    title: 'Acontecendo Agora em JPA 🔥',
    message: 'Nova postagem no JPA Conversa sobre a feira orgânica da Praça.',
    type: 'ad',
    read: false,
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
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

    switch (notif.type) {
      case 'chat':
        onNavigate('service_chat', { requestId: notif.referenceId });
        break;
      case 'coupon':
        onNavigate('user_coupons');
        break;
      case 'ad':
        onNavigate('neighborhood_posts');
        break;
      case 'system':
        onNavigate('patrocinador_master');
        break;
      default:
        // Apenas marca como lida se não tiver rota específica
        break;
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
      case 'ad': return { icon: <Flame size={20} />, bg: 'bg-orange-100 text-orange-600' };
      case 'system': return { icon: <ShieldCheck size={20} />, bg: 'bg-[#FF6501]/10 text-[#FF6501]' };
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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900 active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Avisos</h1>
            <p className="text-[10px] text-blue-50 font-bold uppercase tracking-widest mt-1">Sua atividade no bairro</p>
          </div>
        </div>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">Limpar</button>
        )}
      </header>

      <main className="flex-1 p-5 space-y-4 overflow-y-auto no-scrollbar pb-32">
        {loading ? (
          <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <Bell size={32} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nenhum aviso novo por aqui 😊</h3>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => {
              const style = getIcon(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] ${
                    notif.read 
                      ? 'bg-white/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-70' 
                      : 'bg-white dark:bg-gray-900 border-white dark:border-gray-800 shadow-xl shadow-blue-900/5'
                  }`}
                >
                  {!notif.read && (
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-[#FF6501] rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>
                  )}
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-black leading-tight mb-1 ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
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
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl flex items-center justify-between group cursor-pointer border border-white/5" onClick={() => onNavigate('patrocinador_master')}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FF6501]/20 rounded-xl flex items-center justify-center text-[#FF6501]"><Sparkles size={20} /></div>
                <div>
                    <p className="text-[9px] font-black text-[#FF6501] uppercase tracking-widest mb-0.5">Clube de Vantagens</p>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Conheça o Atual Clube</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
