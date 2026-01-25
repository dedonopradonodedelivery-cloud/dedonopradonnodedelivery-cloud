
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  Star, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  // Added missing AlertTriangle icon to fix "Cannot find name" errors.
  AlertTriangle,
  Send, 
  Loader2,
  Filter,
  User as UserIcon,
  CornerDownRight,
  X
} from 'lucide-react';
import { StoreReview } from '../types';

interface MerchantReviewsModuleProps {
  onBack: () => void;
}

// MOCK DE DADOS PARA TESTE DO PRAZO
const MOCK_MERCHANT_REVIEWS: StoreReview[] = [
  {
    id: 'rev-m1',
    user_id: 'u100',
    user_name: 'Marcos Oliveira',
    rating: 5,
    comment: 'Melhor atendimento que já tive no Anil. Parabéns!',
    created_at: new Date().toISOString(), // AGORA - PENDENTE
  },
  {
    id: 'rev-m2',
    user_id: 'u101',
    user_name: 'Carla Dias',
    rating: 2,
    comment: 'O pedido veio errado e demorou muito.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 DIA ATRÁS - PENDENTE
  },
  {
    id: 'rev-m3',
    user_id: 'u102',
    user_name: 'Anônimo',
    rating: 4,
    comment: 'Lugar limpo e agradável.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 DIAS ATRÁS - EXPIRADA
  },
  {
    id: 'rev-m4',
    user_id: 'u103',
    user_name: 'Sérgio Reis',
    rating: 5,
    comment: 'Excelente custo benefício.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 DIAS ATRÁS
    merchant_response: {
      text: 'Obrigado Sérgio! Esperamos te ver de novo.',
      responded_at: new Date().toISOString()
    }
  }
];

export const MerchantReviewsModule: React.FC<MerchantReviewsModuleProps> = ({ onBack }) => {
  const [reviews, setReviews] = useState<StoreReview[]>(MOCK_MERCHANT_REVIEWS);
  const [filter, setFilter] = useState<'pending' | 'replied' | 'all'>('pending');
  const [selectedReview, setSelectedReview] = useState<StoreReview | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getReviewStatus = (rev: StoreReview) => {
    if (rev.merchant_response) return 'replied';
    const createdDate = new Date(rev.created_at);
    const diffDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 5) return 'expired';
    return 'pending';
  };

  const filteredReviews = useMemo(() => {
    if (filter === 'all') return reviews;
    if (filter === 'replied') return reviews.filter(r => r.merchant_response);
    return reviews.filter(r => !r.merchant_response && getReviewStatus(r) === 'pending');
  }, [reviews, filter]);

  const handlePublishResponse = () => {
    if (!selectedReview || !responseText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      const updatedReviews = reviews.map(r => 
        r.id === selectedReview.id 
        ? { ...r, merchant_response: { text: responseText, responded_at: new Date().toISOString() } } 
        : r
      );
      setReviews(updatedReviews);
      setIsSubmitting(false);
      setSelectedReview(null);
      setResponseText('');
      alert("Resposta publicada com sucesso!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Avaliações
          </h1>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-1">Gestão de Reputação</p>
        </div>
      </header>

      <main className="p-5">
        
        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
            {[
                { id: 'pending', label: 'Pendentes' },
                { id: 'replied', label: 'Respondidas' },
                { id: 'all', label: 'Todas' }
            ].map(f => (
                <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                        filter === f.id 
                        ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' 
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-400'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>

        {/* Notificação / Alerta Prazo */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
            <Clock className="w-5 h-5 text-[#1E5BFF] shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                Você tem até <strong>5 dias</strong> para responder novas avaliações. Respostas rápidas aumentam sua nota média.
            </p>
        </div>

        {/* Lista de Avaliações */}
        <div className="space-y-4">
            {filteredReviews.length > 0 ? filteredReviews.map((rev) => {
                const status = getReviewStatus(rev);
                const isPending = status === 'pending';
                const isExpired = status === 'expired';
                const isReplied = status === 'replied';

                return (
                    <div 
                        key={rev.id}
                        onClick={() => setSelectedReview(rev)}
                        className="bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <UserIcon size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-none">{rev.user_name}</h4>
                                    <div className="flex items-center gap-0.5 mt-1">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={8} className={`${s <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic mb-4">"{rev.comment}"</p>

                        <div className="pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                            {isReplied ? (
                                <div className="flex items-center gap-1.5 text-emerald-600">
                                    <CheckCircle2 size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Respondida</span>
                                </div>
                            ) : isExpired ? (
                                <div className="flex items-center gap-1.5 text-rose-500">
                                    {/* Fix: Added AlertTriangle to imports to resolve "Cannot find name" error */}
                                    <AlertTriangle size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Prazo Expirado</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-[#1E5BFF]">
                                    <Clock size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Aguardando resposta</span>
                                </div>
                            )}
                            
                            {!isReplied && !isExpired && (
                                <button className="bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest group-hover:bg-[#1E5BFF] group-hover:text-white transition-colors">
                                    Responder
                                </button>
                            )}
                        </div>
                    </div>
                );
            }) : (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                    <Star size={48} className="text-gray-400 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Nenhuma avaliação encontrada.</p>
                </div>
            )}
        </div>
      </main>

      {/* MODAL DE RESPOSTA (DETALHE) */}
      {selectedReview && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
            <div 
                className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhe da Avaliação</h3>
                    <button onClick={() => setSelectedReview(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-6">
                    {/* Card da Avaliação Original */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-300">
                                <UserIcon size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{selectedReview.user_name}</h4>
                                <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className={`${s <= selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">"{selectedReview.comment}"</p>
                    </div>

                    {/* Lógica de Resposta */}
                    {selectedReview.merchant_response ? (
                        <div className="space-y-3 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 ml-1">
                                <CornerDownRight size={16} className="text-blue-500" />
                                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Sua Resposta</h4>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{selectedReview.merchant_response.text}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-4 text-right">
                                    Enviada em {new Date(selectedReview.merchant_response.responded_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ) : getReviewStatus(selectedReview) === 'expired' ? (
                        <div className="p-5 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex gap-4 items-start">
                            {/* Fix: Added AlertTriangle to imports to resolve "Cannot find name" error */}
                            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-rose-600 text-sm">Prazo expirado</h4>
                                <p className="text-xs text-rose-500/80 leading-relaxed mt-1">
                                    Esta avaliação foi publicada sem possibilidade de resposta pois o prazo de 5 dias foi excedido.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2">
                             <div className="flex items-center justify-between px-1">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Responder Cliente</h4>
                                <div className="flex items-center gap-1.5 text-[#1E5BFF]">
                                    <Clock size={10} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Aberto para resposta</span>
                                </div>
                             </div>
                             <textarea 
                                value={responseText}
                                onChange={e => setResponseText(e.target.value)}
                                placeholder="Agradeça o elogio ou esclareça o problema..."
                                className="w-full h-32 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[1.5rem] p-4 text-sm dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none"
                             />
                             <button 
                                onClick={handlePublishResponse}
                                disabled={isSubmitting || !responseText.trim()}
                                className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                             >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                                Publicar Resposta
                             </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
