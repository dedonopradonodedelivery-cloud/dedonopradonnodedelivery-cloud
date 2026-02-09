import React from 'react';
import { Coins, TrendingUp } from 'lucide-react';

interface AdminMonetizationViewProps {
  onBack: () => void;
}

export const AdminMonetizationView: React.FC<AdminMonetizationViewProps> = ({ onBack }) => {
  return (
    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/5 text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto">
        <Coins size={32} />
      </div>
      <h2 className="text-xl font-bold text-white uppercase tracking-tight">Painel Financeiro</h2>
      <p className="text-slate-400 text-sm">Controle de faturamento, planos master e assinaturas de lojistas em Jacarepaguá.</p>
      <div className="flex items-center gap-2 justify-center text-emerald-500 text-xs font-bold uppercase tracking-widest pt-4">
        <TrendingUp size={14} />
        Módulo Operacional v1.0
      </div>
    </div>
  );
};