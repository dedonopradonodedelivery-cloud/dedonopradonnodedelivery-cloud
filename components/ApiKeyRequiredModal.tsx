
import React from 'react';
import { ShieldAlert, KeyRound, X } from 'lucide-react';

interface ApiKeyRequiredModalProps {
  onSelectApiKey: () => void;
  onClose: () => void;
}

export const ApiKeyRequiredModal: React.FC<ApiKeyRequiredModalProps> = ({ onSelectApiKey, onClose }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-8 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Chave de API Necessária</h2>
        <p className="text-gray-500 text-sm mb-6">Para usar os recursos de IA, você precisa selecionar uma chave válida.</p>
        <button onClick={onSelectApiKey} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
          <KeyRound size={20}/> Selecionar Chave
        </button>
      </div>
    </div>
  );
};
