
import React, { useState } from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle, XCircle, Trash2, Archive, Filter, ShieldAlert } from 'lucide-react';
import { PostReport, ReportPriority, ReportStatus } from '../types';

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
  },
  {
    id: 'rep-2',
    postId: 'post-spam-2',
    postAuthorId: 'u-spam',
    authorUsername: 'ganhedinheiro',
    reporterUserId: 'u88',
    postNeighborhood: 'Taquara',
    reporterNeighborhood: 'Taquara',
    reason: 'fraud',
    status: 'open',
    priority: 'high',
    timestamp: '2h atrás',
    postContentSnippet: 'Invista R$ 50 e ganhe R$ 500 hoje! Link na bio.',
  },
  {
    id: 'rep-3',
    postId: 'post-wrong-3',
    postAuthorId: 'u7',
    authorUsername: 'pedro.dias',
    reporterUserId: 'u66',
    postNeighborhood: 'Pechincha',
    reporterNeighborhood: 'Freguesia',
    reason: 'wrong_neighborhood',
    status: 'open',
    priority: 'low',
    timestamp: '1d atrás',
    postContentSnippet: 'Vendo sofá, retirar na Barra da Tijuca.',
  }
];

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({ onBack }) => {
  const [reports, setReports] = useState<PostReport[]>(MOCK_REPORTS);
  const [filter, setFilter] = useState<ReportPriority | 'all'>('all');

  const getPriorityColor = (priority: ReportPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      spam: 'Spam',
      offensive: 'Ofensivo',
      fraud: 'Fraude',
      wrong_neighborhood: 'Bairro Errado',
      other: 'Outro'
    };
    return labels[reason] || reason;
  };

  const handleAction = (id: string, action: 'dismiss' | 'remove') => {
    // In real app: call API to update status or delete post
    // Here: remove from list
    setReports(prev => prev.filter(r => r.id !== id));
    alert(action === 'remove' ? 'Post removido e denúncia resolvida.' : 'Denúncia arquivada.');
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.priority === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Moderação
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{reports.length} pendentes</p>
        </div>
      </div>

      <div className="p-5 pb-24">
        
        {/* Filter Tabs */}
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

        {/* Reports List */}
        <div className="space-y-4">
            {filteredReports.map((report) => (
                <div key={report.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    
                    {/* Header: Priority & Reason */}
                    <div className="flex justify-between items-start mb-3">
                        <div className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${getPriorityColor(report.priority)}`}>
                            {report.priority} • {getReasonLabel(report.reason)}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{report.timestamp}</span>
                    </div>

                    {/* Content Preview */}
                    <div className="flex gap-3 mb-4">
                        {report.postThumbnail ? (
                            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                <img src={report.postThumbnail} className="w-full h-full object-cover" alt="Post" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 text-gray-400 font-bold text-xs">
                                Texto
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                                @{report.authorUsername}
                                <span className="text-gray-400 font-normal ml-1">• {report.postNeighborhood}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic">
                                "{report.postContentSnippet}"
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button 
                            onClick={() => handleAction(report.id, 'dismiss')}
                            className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Archive className="w-4 h-4" />
                            Ignorar
                        </button>
                        <button 
                            onClick={() => handleAction(report.id, 'remove')}
                            className="flex-1 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remover Post
                        </button>
                    </div>
                </div>
            ))}

            {filteredReports.length === 0 && (
                <div className="text-center py-20">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
                    <p className="text-gray-400 text-sm">Nenhuma denúncia encontrada.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
