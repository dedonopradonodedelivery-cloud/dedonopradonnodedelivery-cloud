
import React from 'react';
import { X, User, Store, ShieldCheck, UserX, Check } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: string;
  onModeChange: (mode: string) => void;
}

const MODES = [
  { id: 'Visitante', label: 'Visitante', icon: UserX, desc: 'Sem conta / Primeiro acesso', color: 'text-gray-500', bg: 'bg-gray-50' },
  { id: 'Usuário', label: 'Morador', icon: User, desc: 'Perfil de cliente logado', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'Lojista', label: 'Parceiro', icon: Store, desc: 'Painel de negócios ativo', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'ADM', label: 'Administrador', icon: ShieldCheck, desc: 'Gestão total do app', color: 'text-amber-600', bg: 'bg-amber-50' },
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose, currentMode, onModeChange }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-6"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none uppercase tracking-tighter">Trocar de Modo</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Simulador de Experiência</p>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          {MODES.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  onModeChange(mode.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] text-left ${
                  isActive 
                  ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm' 
                  : 'border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mode.bg} ${mode.color}`}>
                  <mode.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm uppercase tracking-tight ${isActive ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-900 dark:text-white'}`}>
                    {mode.label}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">{mode.desc}</p>
                </div>
                {isActive && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Check size={14} strokeWidth={4} />
                    </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-center">
            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                Este seletor altera apenas a camada visual e as permissões de acesso da interface para testes.
            </p>
        </div>
      </div>
    </div>
  );
};
