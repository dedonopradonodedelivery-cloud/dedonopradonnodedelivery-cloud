
import React from 'react';
import { X, Wrench, Building2, Briefcase, PawPrint, Heart, Tag, ArrowRight } from 'lucide-react';

interface ClassifiedsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
}

const OPTIONS = [
  { id: 'servicos', name: 'Orçamento de Serviços', slug: 'services_landing', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
  { id: 'imoveis', name: 'Imóveis Comerciais', slug: 'real_estate_wizard', icon: Building2, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'emprego', name: 'Vaga de Emprego', slug: 'job_wizard', icon: Briefcase, color: 'bg-purple-50 text-purple-600' },
  { id: 'adocao', name: 'Adoção de Pets', slug: 'adoption', icon: PawPrint, color: 'bg-amber-50 text-amber-600' },
  { id: 'doacoes', name: 'Doações', slug: 'donations', icon: Heart, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'desapega', name: 'Desapega (Venda/Troca)', slug: 'desapega', icon: Tag, color: 'bg-rose-50 text-rose-600' },
];

export const ClassifiedsSelectionModal: React.FC<ClassifiedsSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">O que você quer anunciar?</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.slug)}
              className="w-full p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-blue-500 transition-all active:scale-[0.98] bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.color}`}>
                  <opt.icon size={24} />
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200">{opt.name}</span>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
          <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Todos os anúncios são validados por nossa equipe
          </p>
        </div>
      </div>
    </div>
  );
};
