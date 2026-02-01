import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Star, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Filter,
  User as UserIcon,
  X,
  MoreVertical,
  Flag,
  EyeOff,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MerchantReview {
  id: string;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'replied' | 'moderation';
  response?: string;
  isReported?: boolean;
  isHidden?: boolean;
  reportReason?: string;
}

const MOCK_REVIEWS: MerchantReview[] = [
  {
    id: 'rev-1',
    userName: 'Marcos Oliveira',
    rating: 5,
    comment: 'Melhor atendimento que já tive no Anil. Parabéns pela agilidade e pelo capricho no pacote! Com certeza vou pedir mais vezes e recomendar para todos os meus vizinhos aqui do condomínio.',
    date: '2024-03-20T10:30:00Z',
    status: 'pending'
  },
  {
    id: 'rev-2',
    userName: 'Carla Dias',
    rating: 2,
    comment: 'O pedido veio errado e demorou muito mais do que o prometido. Tentei ligar e ninguém atendeu. Uma pena, pois a qualidade costumava ser melhor.',
    date: '2024-03-18T14:20:00Z',
    status: 'replied',
    response: 'Olá Carla, pedimos desculpas pelo ocorrido. Tivemos um problema com nosso entregador naquele dia. Gostaríamos de te enviar um cupom de desconto para uma nova experiência.'
  },
  {
    id: 'rev-3',
    userName: 'Sérgio Reis',
    rating: 4,
    comment: 'Excelente custo benefício. Recomendo para quem busca praticidade no bairro.',
    date: '2024-03-15T09:15:00Z',
    status: 'pending'
  },
  {
    id: 'rev-4',
    userName: 'Usuário',
    rating: 1,
    comment: 'CONTEÚDO INADEQUADO COM PALAVRAS DE BAIXO CALÃO E PROPAGANDA DE OUTRA LOJA CONCORRENTE QUE NÃO TEM NADA A VER COM O SERVIÇO PRESTADO.',
    date: '2024-03-10T20:45:00Z',
    status: 'moderation',
    isReported: true,
    isHidden: true,
    reportReason: 'Linguagem ofensiva / Spam'
  }
];

export const MerchantReviewsModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [reviews, setReviews] = useState<MerchantReview[]>(MOCK_REVIEWS);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'replied'>('all');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'lowest' | 'pending_first'>('recent');
  
  // States para Modais e Respostas
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [reportingReview, setReportingReview] = useState<MerchantReview | null>(null);
  const [reportReason, setReportReason] = useState('');

  // Resumo estatístico
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / total;
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      percent: (reviews.filter(r => r.rating === star).length / total) * 100
    }));
    return { avg: avg.toFixed(1), total, distribution };
  }, [reviews]);

  // Filtros e Ordenação
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    
    if (activeTab === 'pending') list = list.filter(r => r.status === 'pending');
    if (activeTab === 'replied') list = list.filter(r => r.status === 'replied');
    if (starFilter) list = list.filter(r => r.rating === starFilter);

    list.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'pending_first') {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
      }
      return 0;
    });

    return list;
  }, [reviews, activeTab, starFilter, sortBy]);

  const handlePublishResponse = (id: string) => {
    setReviews(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'replied', response: responseText } : r
    ));
    setRespondingTo(null);
    setResponseText('');
  };

  const handleSendReport = () => {
    if (!reportingReview) return;
    setReviews(prev => prev.map(r => 
      r.id === reportingReview.id ? { 
        ...r, 
        status: 'moderation', 
        isReported: true, 
        reportReason: reportReason,
        isHidden: true 
      } : r
    ));
    setReportingReview(null);
    setReportReason('');
  };

  const toggleHideReview = (id: string) => {
    setReviews(prev => prev.map(r => 
      r.id === id ? { ...r, isHidden: !r.isHidden } : r
    ));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-gray-950 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Avaliações</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gerencie sua reputação local</p>
        </div>
      </header>

      <main className="p-5 pb-32 space-y-8">
        
        {/* RESUMO NO TOPO */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                    <p className="text-4xl font-black text-gray-900 dark:text-white leading-none">{stats.avg}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-2 text-yellow-400">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" className="opacity-30" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-2 tracking-widest">{stats.total} avaliações</p>
                </div>
                <div className="flex-1 space-y-1.5">
                    {stats.distribution.map(item => (
                        <div key={item.star} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 w-2">{item.star}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000" 
                                    style={{ width: `${item.percent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CONTROLES E FILTROS */}
        <section className="space-y-4">
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
                <button onClick={() => setActiveTab('all')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>Ver Todas</button>
                <button onClick={() => setActiveTab('pending')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>Pendentes</button>
                <button onClick={() => setActiveTab('replied')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'replied' ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>Respondidas</button>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button onClick={() => setStarFilter(null)} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${starFilter === null ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'}`}>Todas</button>
                    {[5, 4, 3, 2, 1].map(s => (
                        <button key={s} onClick={() => setStarFilter(s)} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1 ${starFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-800'}`}>
                            {s} <Star size={10} fill={starFilter === s ? 'white' : 'currentColor'} />
                        </button>
                    ))}
                </div>
                <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest outline-none border-none cursor-pointer"
                >
                    <option value="recent">Recentes</option>
                    <option value="lowest">Menor Nota</option>
                    <option value="pending_first">Pendentes</option>
                </select>
            </div>
        </section>

        {/* LISTA DE CARDS */}
        <section className="space-y-4">
            {filteredReviews.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center opacity-40">
                    <Star size={48} className="text-gray-300 mb-4" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {activeTab === 'pending' ? 'Você está em dia com as respostas!' : 'Sua loja ainda não recebeu avaliações.'}
                    </p>
                </div>
            ) : (
                filteredReviews.map((rev) => (
                    <ReviewCard 
                        key={rev.id} 
                        review={rev} 
                        onResponder={() => setRespondingTo(rev.id)}
                        isResponding={respondingTo === rev.id}
                        responseText={responseText}
                        setResponseText={setResponseText}
                        onCancelResponse={() => {setRespondingTo(null); setResponseText('');}}
                        onPublishResponse={() => handlePublishResponse(rev.id)}
                        onReport={() => setReportingReview(rev)}
                        onToggleHide={() => toggleHideReview(rev.id)}
                    />
                ))
            )}
        </section>
      </main>

      {/* MODAL DE REPORT */}
      {reportingReview && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Reportar Avaliação</h3>
                      <button onClick={() => setReportingReview(null)} className="p-2 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <p className="text-xs text-gray-500 font-medium">Por que você deseja reportar esta avaliação?</p>
                      <div className="space-y-2">
                          {['Linguagem ofensiva', 'Spam / Propaganda', 'Informação falsa', 'Conteúdo impróprio', 'Outro'].map(m => (
                              <button 
                                key={m} 
                                onClick={() => setReportReason(m)}
                                className={`w-full p-4 rounded-2xl text-left text-sm font-bold transition-all border ${reportReason === m ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-400'}`}
                              >
                                {m}
                              </button>
                          ))}
                      </div>
                      <textarea 
                        placeholder="Descreva o motivo (opcional)"
                        className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-medium h-24 resize-none dark:text-white"
                      />
                      <button 
                        onClick={handleSendReport}
                        disabled={!reportReason}
                        className="w-full bg-red-500 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
                      >
                        Enviar para Moderação
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const ReviewCard: React.FC<{ 
    review: MerchantReview, 
    onResponder: () => void,
    isResponding: boolean,
    responseText: string,
    setResponseText: (val: string) => void,
    onCancelResponse: () => void,
    onPublishResponse: () => void,
    onReport: () => void,
    onToggleHide: () => void
}> = ({ review, onResponder, isResponding, responseText, setResponseText, onCancelResponse, onPublishResponse, onReport, onToggleHide }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = review.comment.length > 150;

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-[2.5rem] border transition-all overflow-hidden ${review.isReported ? 'border-red-100 dark:border-red-900/30' : 'border-gray-100 dark:border-gray-800'}`}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            {review.avatar ? <img src={review.avatar} className="w-full h-full rounded-full" /> : <UserIcon size={20}/>}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.userName}</h4>
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{new Date(review.date).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="mb-4">
                    <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${!isExpanded && 'line-clamp-4'}`}>
                        {review.comment}
                    </p>
                    {isLongText && (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-[10px] font-black text-blue-600 uppercase mt-2 tracking-widest">
                            {isExpanded ? 'Ver menos' : 'Ver mais'}
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                        {review.status === 'pending' && (
                            <span className="bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800">Pendente</span>
                        )}
                        {review.status === 'replied' && (
                            <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800">Respondida</span>
                        )}
                        {review.status === 'moderation' && (
                            <span className="bg-red-50 dark:bg-red-900/20 text-red-600 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-800">Em Moderação</span>
                        )}
                    </div>
                </div>

                {/* Resposta do Lojista (Se houver) */}
                {review.response && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2">
                        <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest mb-1">Sua Resposta:</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{review.response}"</p>
                    </div>
                )}

                {/* Moderação Info (Se houver) */}
                {review.isReported && (
                    <div className="mt-4 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-500" />
                            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Aguardando Análise do Time JPA</p>
                        </div>
                        <button onClick={onToggleHide} className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                            {review.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                            <span className="text-[9px] font-black uppercase tracking-widest">{review.isHidden ? 'Exibir' : 'Ocultar'}</span>
                        </button>
                    </div>
                )}

                {/* Ações */}
                {!isResponding && review.status !== 'moderation' && (
                    <div className="mt-6 flex gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <button 
                            onClick={onResponder}
                            className="flex-1 bg-[#1E5BFF] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-500/10"
                        >
                            <MessageSquare size={14} /> {review.status === 'replied' ? 'Editar Resposta' : 'Responder'}
                        </button>
                        <button 
                            onClick={onReport}
                            className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl hover:text-red-500 transition-colors"
                        >
                            <Flag size={18} />
                        </button>
                    </div>
                )}

                {/* Campo de Resposta Ativo */}
                {isResponding && (
                    <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300">
                        <textarea 
                            autoFocus
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Escreva sua resposta de forma profissional..."
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all h-24 resize-none"
                        />
                        <div className="flex gap-2 mt-3">
                            <button onClick={onCancelResponse} className="flex-1 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancelar</button>
                            <button 
                                onClick={onPublishResponse} 
                                disabled={!responseText.trim()}
                                className="flex-[2] bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                <CheckCircle2 size={14} /> Publicar Resposta
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};