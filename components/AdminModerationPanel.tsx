
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
  Sparkles,
  Layers,
  Building2,
  Tag
} from 'lucide-react';
import { PostReport, ReportPriority, ReportStatus, CommunitySuggestion, TaxonomySuggestion } from '../types';

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
  const [activeTab, setActiveTab] = useState<'reports' | 'suggestions' | 'taxonomy'>('reports');

  // Carregando sugestões do localStorage
  const [communitySuggestions, setCommunitySuggestions] = useState<CommunitySuggestion[]>(() => {
    const saved = localStorage.getItem('neighborhood_suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  const [taxonomySuggestions, setTaxonomySuggestions] = useState<TaxonomySuggestion[]>(() => {
    const saved = localStorage.getItem('taxonomy_suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('neighborhood_suggestions', JSON.stringify(communitySuggestions));
  }, [communitySuggestions]);

  useEffect(() => {
    localStorage.setItem('taxonomy_suggestions', JSON.stringify(taxonomySuggestions));
  }, [taxonomySuggestions]);

  const handleAction = (id: string, action: 'dismiss' | 'remove') => {
    setReports(prev => prev.filter(r => r.id !== id));
    alert(action === 'remove' ? 'Post removido e denúncia resolvida.' : 'Denúncia arquivada.');
  };

  const handleSuggestionModerate = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setCommunitySuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
      alert('Sugestão aprovada!');
    } else {
      setCommunitySuggestions(prev => prev.filter(s => s.id !== id));
      alert('Sugestão reprovada.');
    }
  };

  const handleTaxonomyModerate = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setTaxonomySuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
      alert('Sugestão aprovada! Agora deve ser incluída nos arquivos de constantes pelo time técnico.');
    } else {
      setTaxonomySuggestions(prev => prev.filter(s => s.id !== id));
      alert('Sugestão reprovada.');
    }
  };

  const pendingCommunity = communitySuggestions.filter(s => s.status === 'pending');
  const pendingTaxonomy = taxonomySuggestions.filter(s => s.status === 'pending');
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
      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 min-w-[120px] py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}
        >
            Denúncias ({reports.length})
        </button>
        <button 
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 min-w-[120px] py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'suggestions' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}
        >
            Enquetes ({pendingCommunity.length})
        </button>
        <button 
            onClick={() => setActiveTab('taxonomy')}
            className={`flex-1 min-w-[120px] py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'taxonomy' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}
        >
            Classificação ({pendingTaxonomy.length})
        </button>
      </div>

      <div className="p-5 pb-24">
        {activeTab === 'reports' && (
            <div className="space-y-4">
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                    {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${
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
        )}

        {activeTab === 'suggestions' && (
            <div className="space-y-4">
                {pendingCommunity.length === 0 ? (
                    <div className="text-center py-20">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhuma enquete pendente.</p>
                    </div>
                ) : (
                    pendingCommunity.map((sug) => (
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
                                    <CheckCircle className="w-4 h-4" /> Aprovar Enquete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {activeTab === 'taxonomy' && (
            <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 mb-6 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                        Sugestões de Classificação enviadas por lojistas. Após aprovadas, devem ser atualizadas nos arquivos de constantes do app.
                    </p>
                </div>

                {pendingTaxonomy.length === 0 ? (
                    <div className="text-center py-20">
                        <Layers className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-20" />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhuma sugestão de classificação.</p>
                    </div>
                ) : (
                    pendingTaxonomy.map((sug) => (
                        <div key={sug.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]`}>
                                        <Tag size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{sug.name}</h4>
                                        <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">
                                            Sugerir {sug.type === 'category' ? 'Categoria' : sug.type === 'subcategory' ? 'Subcategoria' : 'Especialidade'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{new Date(sug.createdAt).toLocaleDateString()}</span>
                            </div>

                            {sug.parentName && (
                                <div className="mb-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-[10px] text-gray-500 font-bold uppercase tracking-wider border border-gray-100 dark:border-gray-700">
                                    Pai: {sug.parentName}
                                </div>
                            )}

                            {sug.justification && (
                                <div className="mb-5 p-3 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{sug.justification}"</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-5 border-t border-gray-50 dark:border-gray-700 pt-4">
                                <Building2 size={12} className="text-gray-400" />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Loja: {sug.storeName}</p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleTaxonomyModerate(sug.id, 'reject')}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <XCircle className="w-4 h-4" /> Rejeitar
                                </button>
                                <button 
                                    onClick={() => handleTaxonomyModerate(sug.id, 'approve')}
                                    className="flex-[2] py-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <CheckCircle className="w-4 h-4" /> Aprovar Sugestão
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
