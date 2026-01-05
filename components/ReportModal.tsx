
import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Ban, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { ReportReason } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);

  if (!isOpen) return null;

  const reasons: { id: ReportReason; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'spam', label: 'Spam / Propaganda Indevida', icon: MessageSquare, color: 'text-yellow-500' },
    { id: 'offensive', label: 'Conteúdo Ofensivo', icon: ShieldAlert, color: 'text-red-500' },
    { id: 'fraud', label: 'Golpe / Fraude', icon: Ban, color: 'text-red-600' },
    { id: 'wrong_neighborhood', label: 'Conteúdo fora do bairro', icon: MapPin, color: 'text-blue-500' },
    { id: 'other', label: 'Outro motivo', icon: AlertTriangle, color: 'text-gray-500' },
  ];

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Denunciar publicação
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Ajude a manter a comunidade segura. Qual é o problema com esta publicação?
        </p>

        <div className="space-y-3 mb-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            const isSelected = selectedReason === reason.id;
            return (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  isSelected 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 ring-1 ring-red-500' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Icon className={`w-5 h-5 ${reason.color}`} />
                </div>
                <span className={`font-medium text-sm flex-1 ${isSelected ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-200'}`}>
                  {reason.label}
                </span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedReason}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:cursor-not-allowed"
        >
          Enviar Denúncia
        </button>
      </div>
    </div>
  );
};
