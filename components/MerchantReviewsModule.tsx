
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
  }
];

export const MerchantReviewsModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [reviews, setReviews] = useState<MerchantReview[]>(MOCK_REVIEWS);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'replied'>('all');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'lowest' | 'pending_first'>('recent');
  
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [reportingReview, setReportingReview] = useState<MerchantReview | null>(null);
  const [reportReason, setReportReason] = useState('');

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      percent: total > 0 ? (reviews.filter(r => r.rating === star).length / total) * 100 : 0
    }));
    return { avg: avg.toFixed(1), total, distribution };
  }, [reviews]);

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
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'replied', response: responseText } : r));
    setRespondingTo(null);
    setResponseText('');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 active:scale-90 transition-all"><ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /></button>
        <div><h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Avaliações</h1><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gestão de reputação</p></div>
      </header>

      <main className="p-5 pb-32 space-y-8">
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border border-blue-50 dark:border-gray-800">
            <div className="flex items-center gap-6">
                <div className="text-center">
                    <p className="text-4xl font-black text-gray-900 dark:text-white leading-none">{stats.avg}</p>
                    <div className="flex items-center justify-center gap-0.5 mt-2 text-yellow-400">
                        <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" className="opacity-30" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-2 tracking-widest">{stats.total} avaliações</p>
                </div>
                <div className="flex-1 space-y-1.5">
                    {stats.distribution.map(item => (
                        <div key={item.star} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 w-2">{item.star}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.percent}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="space-y-4">
            <div className="flex bg-blue-100/50 dark:bg-gray-900 p-1 rounded-2xl">
                {['all', 'pending', 'replied'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-800 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>
                        {tab === 'all' ? 'Todas' : tab === 'pending' ? 'Pendentes' : 'Respondidas'}
                    </button>
                ))}
            </div>
        </section>

        <section className="space-y-4">
            {filteredReviews.map((rev) => (
                <div key={rev.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-blue-50 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-[#1E5BFF]"><UserIcon size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{rev.userName}</h4>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (<Star key={i} size={10} className={i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'} />))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{new Date(rev.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">{rev.comment}</p>
                        
                        {rev.response && (
                            <div className="mt-4 p-4 bg-blue-50/50 dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-gray-800">
                                <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest mb-1">Sua Resposta:</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{rev.response}"</p>
                            </div>
                        )}

                        {!respondingTo || respondingTo !== rev.id ? (
                            <div className="mt-6 flex gap-3 pt-4 border-t border-blue-50 dark:border-gray-800">
                                <button onClick={() => setRespondingTo(rev.id)} className="flex-1 bg-[#1E5BFF] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-95 transition-all"><MessageSquare size={14} /> {rev.response ? 'Editar Resposta' : 'Responder'}</button>
                            </div>
                        ) : (
                            <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300">
                                <textarea autoFocus value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Escreva sua resposta profissional..." className="w-full p-4 bg-blue-50/30 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition-all h-24 resize-none" />
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => setRespondingTo(null)} className="flex-1 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancelar</button>
                                    <button onClick={() => handlePublishResponse(rev.id)} className="flex-[2] bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Publicar Resposta</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </section>
      </main>
    </div>
  );
};
