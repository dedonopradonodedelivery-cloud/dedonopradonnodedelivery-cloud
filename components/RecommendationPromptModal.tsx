

import React, { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, Smile, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RecommendationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onRecommend: (recommendationText: string, tags: string[]) => void;
  onDontRecommend: () => void;
}

const QUICK_TAGS = [
  "Bom atendimento",
  "Preço justo",
  "Resolveu meu problema",
  "Confio",
  "Entrega rápida",
  "Comida boa",
  "Ambiente agradável",
  "Variedade",
];

export const RecommendationPromptModal: React.FC<RecommendationPromptModalProps> = ({
  isOpen,
  onClose,
  storeName,
  onRecommend,
  onDontRecommend,
}) => {
  const [stage, setStage] = useState<'initial' | 'recommend_details' | 'success'>('initial');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRecommendClick = () => {
    setStage('recommend_details');
  };

  const handleSkipOrDontRecommend = () => {
    onDontRecommend(); // Lógica de não recomendar ou apenas fechar sem input
    // Replaced handleClose() with onClose() as handleClose was not defined.
    onClose();
    setStage('initial'); // Reset for next time
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitRecommendation = () => {
    setIsSubmitting(true);
    // Simular envio para backend
    setTimeout(() => {
      onRecommend(customText, selectedTags);
      setStage('success');
      setIsSubmitting(false);
      setTimeout(() => {
        onClose();
        setStage('initial'); // Reset after success and close
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {stage === 'initial' && (
          <div className="text-center flex flex-col items-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <Smile className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              Você recomendaria {storeName}?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8">
              Sua opinião ajuda outros moradores a descobrir os melhores locais!
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={handleRecommendClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <ThumbsUp className="w-5 h-5 fill-white" />
                Sim, Recomendo!
              </button>
              <button
                onClick={handleSkipOrDontRecommend}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <ThumbsDown className="w-5 h-5" />
                Não Recomendo (ou pular)
              </button>
            </div>
          </div>
        )}

        {stage === 'recommend_details' && (
          <div className="flex flex-col animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight text-center">
              Ótimo! O que você mais gostou em {storeName}?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 text-center mx-auto">
              Selecione tags rápidas e/ou escreva um breve comentário.
            </p>

            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1">
                Comentário (opcional, máx. 80 caracteres)
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={80}
                rows={2}
                placeholder="Ex: A pizza deles é a melhor do bairro!"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm dark:text-white"
              />
              <p className="text-xs text-gray-400 text-right mt-1">{customText.length}/80</p>
            </div>

            <button
              onClick={handleSubmitRecommendation}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  Enviar Recomendação
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {stage === 'success' && (
          <div className="text-center flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 animate-bounce-short">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              Recomendação enviada!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Agradecemos sua contribuição para a comunidade da Freguesia!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
