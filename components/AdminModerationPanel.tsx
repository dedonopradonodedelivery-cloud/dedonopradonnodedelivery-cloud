import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Archive, 
  Filter, 
  ShieldAlert, 
  Plus, 
  Check, 
  Vote, 
  MessageSquare,
  /* Added missing Sparkles icon import */
  Sparkles 
} from 'lucide-react';
import { PostReport, ReportPriority, ReportStatus, CommunitySuggestion } from '../types';

interface AdminModerationPanelProps {
  onBack: () => void;
}

// MOCK DATA FOR MVP
const MOCK_REPORTS: PostReport[] = [
  {
    id: 'rep-1',
    postId: 'post-video-1',
    postAuthorId: 'u5',
    authorUsername: 'fernandalima',
    reporterUserId: 'u99',
    postNeighborhood: 'Freguesia',
    reporterNeighborhood: 'Freguesia',
    reason: 'offensive',
    status: 'open',
    priority: 'high',
    timestamp: '10 min atrás',
    postContentSnippet: 'Gente, odiei esse lugar! Atendimento lixo, comida podre...',
    postThumbnail: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=100&auto=format&fit=crop'
  }
];

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({ onBack }) => {
  const [reports, setReports] = useState<PostReport[]>(MOCK_REPORTS);
  const [filter, setFilter] = useState<ReportPriority | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'reports' | 'suggestions'>('reports');

  // Carregando sugestões do localStorage para sincronia com a aba Comunidade
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>(() => {
    const saved = localStorage.getItem('neighborhood_suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('neighborhood_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  const handleAction = (id: string, action: 'dismiss' | 'remove') => {
    setReports(prev => prev.filter(r => r.id !== id));
    alert(action === 'remove' ? 'Post removido e denúncia resolvida.' : 'Denúncia arquivada.');
  };

  const handleSuggestionModerate = (id: string, action: 'approve' | 'reject') => {
    const sug = suggestions.find(s => s.id === id);
    if (!sug) return;

    if (action === 'approve') {
      // Regra de Agrupamento: Se já existir uma aprovada com o mesmo nome
      const existingApproved = suggestions.find(s => 
        s.status === 'approved' && 
        s.name.toLowerCase() === sug.name.toLowerCase() && 
        s.id !== sug.id
      );

      if (existingApproved) {
        // Incrementa o voto na existente e remove a nova (agrupa)
        setSuggestions(prev => prev
          .map(s => s.id === existingApproved.id ? { ...s, votes: s.votes + 1 } : s)
          .filter(s => s.id !== id)
        );
        alert(`Sugestão "${sug.name}" agrupada a uma já existente.`);
      } else {
        // Apenas aprova
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
        alert(`Sugestão "${sug.name}" aprovada para a enquete pública.`);
        // Simulação de notificação push enviada aqui
        console.log(`Push sent to user ${sug.creatorId}: Sua recomendação foi aprovada...`);
      }
    } else {
      // Reprova (remove da lista)
      setSuggestions(prev => prev.filter(s => s.id !== id));
      alert('Sugestão reprovada.');
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.priority === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 leading-none">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Painel ADM
            </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}
        >
            Denúncias ({reports.length})
        </button>
        <button 
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'suggestions' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}
        >
            Sugestões ({pendingSuggestions.length})
        </button>
      </div>

      <div className="p-5 pb-24">
        {activeTab === 'reports' ? (
            <div className="space-y-4">
                {/* Filter Tabs Reports */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                    {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                                filter === f 
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black' 
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {f === 'all' ? 'Todos' : f === 'high' ? '🔴 Alta' : f === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                        </button>
                    ))}
                </div>

                {filteredReports.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                                report.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                            }`}>
                                {report.priority} • {report.reason}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{report.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4 line-clamp-2">"{report.postContentSnippet}"</p>
                        <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button onClick={() => handleAction(report.id, 'dismiss')} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                <Archive className="w-4 h-4" /> Ignorar
                            </button>
                            <button onClick={() => handleAction(report.id, 'remove')} className="flex-1 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                                <Trash2 className="w-4 h-4" /> Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 mb-6 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                        Sugestões aprovadas entram para a enquete pública na aba Comunidade. Nomes idênticos serão agrupados.
                    </p>
                </div>

                {pendingSuggestions.length === 0 ? (
                    <div className="text-center py-20">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
                        <p className="text-gray-400 text-sm">Nenhuma sugestão pendente.</p>
                    </div>
                ) : (
                    pendingSuggestions.map((sug) => (
                        <div key={sug.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <MessageSquare size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{sug.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sugerido por ID: {sug.creatorId.slice(0,8)}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleSuggestionModerate(sug.id, 'reject')}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <XCircle className="w-4 h-4" /> Reprovar
                                </button>
                                <button 
                                    onClick={() => handleSuggestionModerate(sug.id, 'approve')}
                                    className="flex-[2] py-3 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                                >
                                    <CheckCircle className="w-4 h-4" /> Aprovar para Enquete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};
