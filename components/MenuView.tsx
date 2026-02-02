
import React, { useState, useMemo } from 'react';
import { 
  User as UserIcon, 
  ChevronRight, 
  X, 
  Bell, 
  Heart, 
  HelpCircle, 
  LogOut, 
  Loader2, 
  Info, 
  MessageSquare, 
  Tag, 
  Bookmark, 
  Ticket, 
  Package, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Moon, 
  CheckCircle2, 
  Crown,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '@supabase/supabase-js';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface MenuViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  onAuthClick: () => void;
  onNavigate: (view: string, data?: any) => void;
  onBack?: () => void;
}

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3 mb-8">
    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2">{title}</h3>
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
      {children}
    </div>
  </div>
);

const MenuItem: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  sublabel?: string; 
  badge?: string | number; 
  onClick: () => void; 
  isDestructive?: boolean;
  color?: string;
}> = ({ icon: Icon, label, sublabel, badge, onClick, isDestructive, color = "text-gray-500" }) => (
  <button 
    onClick={onClick} 
    className="w-full p-4 flex items-center justify-between border-b last:border-b-0 border-gray-50 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isDestructive ? 'bg-red-50 text-red-500' : `bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 ${color}`}`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
            {badge && (
                <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">{badge}</span>
            )}
        </div>
        {sublabel && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sublabel}</p>}
      </div>
    </div>
    <ChevronRight className={`w-4 h-4 ${isDestructive ? 'text-red-200' : 'text-gray-300'}`} />
  </button>
);

export const MenuView: React.FC<MenuViewProps> = ({ 
  user, 
  onAuthClick, 
  onNavigate, 
  onBack 
}) => {
  const { signOut } = useAuth();
  const { currentNeighborhood } = useNeighborhood();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try { await signOut(); onNavigate('home'); } catch (error) { console.warn(error); } finally { setIsLoggingOut(false); }
  };

  const couponsCount = 2; // Mock

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="bg-white dark:bg-gray-900 px-4 pt-10 pb-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Menu</h2>
          {onBack && (<button onClick={onBack} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"><X className="w-5 h-5" /></button>)}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100 transform -rotate-6"><UserIcon className="w-10 h-10 text-[#1E5BFF]" /></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Sua comunidade te espera</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs">Entre para anunciar, comentar no feed e salvar seus cupons.</p>
          <button onClick={onAuthClick} className="w-full max-w-xs bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Entrar ou Criar Conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 pb-32 animate-in fade-in duration-300">
      {/* Header Fixo */}
      <div className="bg-white dark:bg-gray-900 px-5 pt-12 pb-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-gray-900 dark:text-white font-display uppercase tracking-tighter">Menu</h2></div>
        {onBack && (<button onClick={onBack} className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 active:scale-90 transition-all"><X className="w-6 h-6" /></button>)}
      </div>

      <div className="px-5">
        {/* 1. TOPO DO MENU: Perfil */}
        <div 
          onClick={() => onNavigate('store_profile')} 
          className="mt-6 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 cursor-pointer active:scale-[0.98] mb-8 group transition-all"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-950 shadow-md group-hover:scale-105 transition-transform">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-7 h-7 text-gray-400" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-black text-gray-900 dark:text-white text-lg truncate leading-tight uppercase tracking-tighter">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </h3>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                Ativo em {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
            </p>
            <span className="text-[9px] font-bold text-gray-400 underline mt-2 block">Ver perfil completo</span>
          </div>
        </div>

        {/* 2. BLOCO: MINHA ATIVIDADE NO BAIRRO */}
        <MenuSection title="Minha atividade no bairro">
            <MenuItem 
                icon={MessageSquare} 
                label="Meus comentários" 
                sublabel="Histórico no JPA Conversa"
                onClick={() => onNavigate('user_activity', { type: 'comentarios' })}
                color="text-indigo-500"
            />
            <MenuItem 
                icon={Package} 
                label="Meus anúncios" 
                sublabel="Gerenciar seus itens nos Classificados"
                onClick={() => onNavigate('user_activity', { type: 'anuncios' })}
                color="text-amber-500"
            />
            <MenuItem 
                icon={Bell} 
                label="Minhas solicitações" 
                sublabel="Pedidos de orçamento e serviços"
                onClick={() => onNavigate('service_messages_list')}
                color="text-blue-500"
            />
            <MenuItem 
                icon={Star} 
                label="Avaliações que fiz" 
                sublabel="Sua opinião sobre os lojistas"
                onClick={() => onNavigate('user_activity', { type: 'avaliacoes' })}
                color="text-yellow-500"
            />
        </MenuSection>

        {/* 3. BLOCO: GERAL */}
        <MenuSection title="Geral">
            <MenuItem 
                icon={Ticket} 
                label="Meus Cupons" 
                badge={couponsCount > 0 ? `${couponsCount} ativos` : undefined}
                onClick={() => onNavigate('user_coupons')}
                color="text-emerald-500"
            />
            <MenuItem 
                icon={Heart} 
                label="Favoritos" 
                sublabel="Lojas e anúncios que você marcou"
                onClick={() => onNavigate('favorites')}
                color="text-rose-500"
            />
            <MenuItem 
                icon={Bookmark} 
                label="Postagens Salvas" 
                sublabel="Conteúdos do JPA Conversa"
                onClick={() => onNavigate('saved_posts')}
                color="text-blue-400"
            />
            <MenuItem 
                icon={MapPin} 
                label="Meus Bairros" 
                sublabel="Bairro principal e interesses"
                onClick={() => onNavigate('my_neighborhoods')}
                color="text-orange-500"
            />
        </MenuSection>

        {/* 4. NOTIFICAÇÕES */}
        <MenuSection title="Comunicação">
            <MenuItem 
                icon={Bell} 
                label="Notificações" 
                sublabel="Alertas, respostas e cupons"
                onClick={() => onNavigate('notifications')}
                color="text-blue-600"
            />
        </MenuSection>

        {/* 5. INSTITUCIONAL */}
        <MenuSection title="Institucional">
            <MenuItem 
                icon={Info} 
                label="Quem Somos" 
                sublabel="Manifesto, missão e valores"
                onClick={() => onNavigate('about')}
                color="text-slate-500"
            />
            <MenuItem 
                icon={HelpCircle} 
                label="Suporte" 
                sublabel="contato.localizeijpa@gmail.com"
                onClick={() => onNavigate('support')}
                color="text-indigo-400"
            />
            <MenuItem 
                icon={Lightbulb} 
                label="Sugerir melhoria no app" 
                sublabel="Ajude a melhorar o Localizei JPA"
                onClick={() => onNavigate('app_suggestion')}
                color="text-amber-500"
            />
        </MenuSection>

        {/* 6. CONFIGURAÇÕES */}
        <MenuSection title="Configurações">
            <MenuItem 
                icon={Moon} 
                label="Modo escuro" 
                sublabel="Em breve"
                onClick={() => {}}
                color="text-gray-400"
            />
            <MenuItem 
                icon={ShieldCheck} 
                label="Privacidade" 
                sublabel="Seus dados e termos"
                onClick={() => onNavigate('privacy_policy')}
                color="text-emerald-600"
            />
            <MenuItem 
                icon={LogOut} 
                label="Sair da conta" 
                onClick={handleLogout}
                isDestructive
            />
        </MenuSection>

        {/* 7. PATROCINADOR MASTER FINAL */}
        <div className="mt-4 mb-10 px-2 opacity-80 hover:opacity-100 transition-opacity">
            <div 
              onClick={() => onNavigate('patrocinador_master')}
              className="bg-slate-900 rounded-3xl p-5 border border-white/5 flex items-center justify-between cursor-pointer group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                        <Crown size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">Patrocinador Master do Localizei JPA</p>
                        <p className="text-sm font-bold text-white mt-1">Grupo Esquematiza</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
        </div>

        <div className="text-center opacity-30 py-4">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • v1.6.0</p>
        </div>
      </div>
    </div>
  );
};
