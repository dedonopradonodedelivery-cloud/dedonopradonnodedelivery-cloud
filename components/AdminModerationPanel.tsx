import React from 'react';

export const AdminModerationPanel: React.FC<{ onBack?: () => void }> = () => {
  return (
    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/5 text-center">
      <h2 className="text-xl font-bold text-white uppercase tracking-tight">Moderação</h2>
      <p className="text-slate-400 text-sm mt-2">Módulo em construção.</p>
    </div>
  );
};