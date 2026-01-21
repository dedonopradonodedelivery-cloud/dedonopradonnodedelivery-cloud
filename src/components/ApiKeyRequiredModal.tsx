

import React from 'react';
import { ShieldAlert, KeyRound, ExternalLink, X } from 'lucide-react';

interface ApiKeyRequiredModalProps {
  onSelectApiKey: () => void;
  onClose: () => void;
}

export const ApiKeyRequiredModal: React.FC<ApiKeyRequiredModalProps> = ({ onSelectApiKey, onClose }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative text-center">
        
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
            Chave de API Necessária
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs leading-relaxed">
            Para usar os recursos de IA (como o assistente virtual), você precisa selecionar uma chave de API paga do Google AI Studio.
          </p>

          <button
            onClick={onSelectApiKey}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <KeyRound className="w-5 h-5" />
            Selecionar Chave de API
          </button>

          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-sm text-[#1E5BFF] font-bold hover:underline flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Saiba mais sobre faturamento
          </a>
        </div>
      </div>
    </div>
  );
};
