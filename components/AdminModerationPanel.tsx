import React from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';

interface AdminModerationPanelProps {
  onBack: () => void;
}

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({ onBack }) => {
  return (
    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/5 text-center space-y-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
        <ShieldAlert size={32} />
      </div>
      <h2 className="text-xl font-bold text-white uppercase tracking-tight">Painel de Moderação</h2>
      <p className="text-slate-400 text-sm">Este módulo está em fase de implementação final. Em breve você poderá moderar posts e reivindicações aqui.</p>
      <div className="flex items-center gap-2 justify-center text-amber-500 text-xs font-bold uppercase tracking-widest pt-4">
        <AlertCircle size={14} />
        Aguardando Dados do Supabase
      </div>
    </div>
  );
};