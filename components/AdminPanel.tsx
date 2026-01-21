
import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Store, 
  Settings, 
  MessageSquare, 
  ChevronRight, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { RoleMode } from '../types';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
  viewMode: RoleMode;
  onOpenViewSwitcher: () => void;
  onNavigateToApp: (tab: string) => void;
  onInspectMerchant?: (id: string) => void;
  onInspectUser?: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  user, 
  onLogout, 
  viewMode, 
  onOpenViewSwitcher, 
  onNavigateToApp 
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'merchants' | 'users' | 'ledger'>('metrics');
  const [waitingTickets] = useState(1);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600 rounded-lg">
                <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
                <h1 className="font-black text-lg text-white uppercase tracking-tighter">Painel Administrativo</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acesso Restrito: {user.email}</p>
            </div>
        </div>
        <button onClick={onLogout} className="p-2 text-slate-500 hover:text-white transition-colors">
            <LogOut size={20} />
        </button>
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar pb-32">
        <div className="mb-8">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Atendimento e Suporte</h3>
            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={() => onNavigateToApp('admin_support')}
                    className="w-full bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-[#1E5BFF]/30 transition-all relative overflow-hidden"
                >
                    {waitingTickets > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl animate-pulse">
                         {waitingTickets} EM ESPERA
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base text-left">Chat de Suporte</h4>
                            <p className="text-xs text-slate-500 text-left">Atender usuários e lojistas.</p>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-700" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="text-emerald-400" />
                    <h3 className="font-bold text-white uppercase text-xs tracking-widest">Métricas Gerais</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Lojistas</p>
                        <p className="text-xl font-black">124</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Usuários</p>
                        <p className="text-xl font-black">2.5k</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <Users className="text-blue-400" />
                    <h3 className="font-bold text-white uppercase text-xs tracking-widest">Moderação</h3>
                </div>
                <button 
                  onClick={() => onNavigateToApp('admin_banner_moderation')}
                  className="w-full bg-slate-800 py-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    Gerenciar Banners Ativos
                </button>
            </div>
        </div>

        <button 
            onClick={onOpenViewSwitcher}
            className="w-full bg-slate-900 p-4 rounded-2xl border border-white/5 text-xs font-black uppercase text-slate-500 tracking-widest hover:text-white transition-all"
        >
            Alternar Modo: {viewMode}
        </button>
      </main>
    </div>
  );
};
