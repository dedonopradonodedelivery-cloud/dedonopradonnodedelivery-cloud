import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface AdminModerationPanelProps {
  onBack?: () => void;
}

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = () => {
  return (
    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
        <ShieldAlert size={32} />
      </div>
      <h2 className="text-xl font-bold text-white uppercase tracking-tight">Painel de Moderação</h2>
      <p className="text-slate-400 text-sm mt-2">Este módulo está em construção.</p>
    </div>
  );
};