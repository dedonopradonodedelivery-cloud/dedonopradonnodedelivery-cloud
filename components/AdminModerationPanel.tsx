import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Archive, 
  ShieldAlert, 
  Check, 
  MessageSquare,
  Sparkles,
  Layers,
  Building2,
  Tag,
  Clock,
  Send,
  Bell,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PostReport, ReportPriority, TaxonomySuggestion, AppNotification } from '../types';

interface AdminModerationPanelProps {
  onBack: () => void;
}

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
  const [activeTab, setActiveTab] = useState<'reports' | 'taxonomy'>('reports');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSugForAction, setSelectedSugForAction] = useState<string | null>(null);

  const [taxonomySuggestions, setTaxonomySuggestions] = useState<TaxonomySuggestion[]>(() => {
    const saved = localStorage.getItem('taxonomy_suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  const sendMerchantNotification = (merchantId: string, title: string, message: string) => {
    const savedNotifs = localStorage.getItem('app_notifications') || '[]';
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      userId: merchantId,
      title,
      message,
      type: title.includes('aprovada') ? 'taxonomy_approval' : 'taxonomy_rejection',
      read: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('app_notifications', JSON.stringify([newNotif, ...JSON.parse(savedNotifs)]));
    
    // Simular disparo PUSH no console
    console.log(`[PUSH SIMULATED] To: ${merchantId} | ${title}: ${message}`);
  };

  const handleTaxonomyModerate = (id: string, action: 'approve' | 'reject') => {
    const sug = taxonomySuggestions.find(s => s.id === id);
    if (!sug) return;

    if (action === 'approve') {
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'approved' as const } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));
      
      sendMerchantNotification(sug.merchantId, 'Sugestão Aprovada!', `Sua sugestão de ${sug.type === 'category' ? 'categoria' : 'subcategoria'} "${sug.name}" foi aprovada.`);
      alert('Sugestão aprovada! O lojista foi notificado.');
    } else {
      if (!rejectionReason.trim()) {
        alert('Por favor, informe o motivo da rejeição.');
        return;
      }
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'rejected' as const, rejectionReason } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));

      sendMerchantNotification(sug.merchantId, 'Sugestão Recusada', `Não pudemos aprovar "${sug.name}". Motivo: ${rejectionReason}`);
      alert('Sugestão rejeitada.');
      setRejectionReason('');
      setSelectedSugForAction(null);
    }
  };

  const pendingTaxonomy = taxonomySuggestions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" /></button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Painel ADM</h1>
      </div>

      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <button onClick={() => setActiveTab('reports')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Denúncias ({reports.length})</button>
        <button onClick={() => setActiveTab('taxonomy')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'taxonomy' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Classificação ({pendingTaxonomy.length})</button>
      </div>

      <div className="p-5 pb-24">
        {activeTab === 'reports' && (
            <div className="space-y-4">
                {reports.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><Info size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma denúncia pendente</p></div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${report.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{report.priority} • {report.reason}</div>
                                <span className="text-[10px] text-gray-400 font-medium">{report.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4 line-clamp-2">"{report.postContentSnippet}"</p>
                            <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => setReports(reports.filter(r => r.id !== report.id))} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-2">Ignorar</button>
                                <button onClick={() => setReports(reports.filter(r => r.id !== report.id))} className="flex-1 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2">Remover</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {activeTab === 'taxonomy' && (
            <div className="space-y-4">
                {pendingTaxonomy.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><Layers size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma sugestão pendente</p></div>
                ) : (
                    pendingTaxonomy.map((sug) => (
                        <div key={sug.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]"><Tag size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{sug.name}</h4>
                                        <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">Sugerir {sug.type === 'category' ? 'Categoria' : 'Subcategoria'}</p>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{new Date(sug.createdAt).toLocaleDateString()}</span>
                            </div>

                            {sug.parentName && (
                                <div className="mb-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg text-[10px] text-gray-500 font-bold uppercase tracking-wider border border-gray-100 dark:border-gray-700">Vincular à Categoria: {sug.parentName}</div>
                            )}

                            {sug.justification && (
                                <div className="mb-5 p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30"><p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">"{sug.justification}"</p></div>
                            )}

                            <div className="flex items-center gap-2 mb-6 border-t border-gray-50 dark:border-gray-700 pt-4"><Building2 size={12} className="text-gray-400" /><p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Loja: {sug.storeName}</p></div>
                            
                            {selectedSugForAction === sug.id ? (
                                <div className="space-y-3 animate-in zoom-in-95">
                                    <textarea 
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                        placeholder="Motivo da rejeição (será enviado ao lojista)..."
                                        className="w-full bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 outline-none font-bold"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedSugForAction(null)} className="flex-1 py-2 text-[10px] font-bold uppercase text-gray-400">Cancelar</button>
                                        <button onClick={() => handleTaxonomyModerate(sug.id, 'reject')} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-red-500/20">Confirmar Rejeição</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setSelectedSugForAction(sug.id)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"><XCircle size={16} /> Rejeitar</button>
                                    <button onClick={() => handleTaxonomyModerate(sug.id, 'approve')} className="flex-[2] py-3 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-500/20"><CheckCircle2 size={16} /> Aprovar</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};