
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
  Info,
  ShieldCheck,
  Building,
  User as UserIcon,
  Search,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import { PostReport, ReportPriority, TaxonomySuggestion, AppNotification, StoreClaimRequest } from '../types';

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

const MOCK_CLAIMS: StoreClaimRequest[] = [
    {
        id: 'cl-1',
        store_id: 'f-1',
        store_name: 'Bibi Lanches',
        user_id: 'u-442',
        user_email: 'contato@bibilanches.com.br',
        method: 'manual',
        status: 'pending',
        created_at: new Date().toISOString(),
        responsible_name: 'Rodrigo Bessa',
        cnpj: '12.345.678/0001-99',
        contact_phone: '(21) 99888-7766',
        justification: 'Sou o sócio-proprietário da unidade Freguesia e quero gerenciar o cashback no app.'
    },
    {
        id: 'cl-2',
        store_id: 'f-8',
        store_name: 'Academia FitBairro',
        user_id: 'u-102',
        user_email: 'fitness@gmail.com',
        method: 'whatsapp',
        status: 'pending',
        created_at: new Date().toISOString()
    }
];

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({ onBack }) => {
  const [reports, setReports] = useState<PostReport[]>(MOCK_REPORTS);
  const [activeTab, setActiveTab] = useState<'reports' | 'taxonomy' | 'claims'>('reports');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSugForAction, setSelectedSugForAction] = useState<string | null>(null);
  
  const [claims, setClaims] = useState<StoreClaimRequest[]>(() => {
      const saved = localStorage.getItem('manual_claims_jpa');
      return saved ? JSON.parse(saved) : MOCK_CLAIMS;
  });

  const [taxonomySuggestions, setTaxonomySuggestions] = useState<TaxonomySuggestion[]>(() => {
    const saved = localStorage.getItem('taxonomy_suggestions');
    return saved ? JSON.parse(saved) : [];
  });

  const sendNotification = (userId: string, title: string, message: string, type: AppNotification['type']) => {
    const savedNotifs = localStorage.getItem('app_notifications') || '[]';
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('app_notifications', JSON.stringify([newNotif, ...JSON.parse(savedNotifs)]));
  };

  const handleClaimModerate = (id: string, action: 'approve' | 'reject') => {
    const claim = claims.find(c => c.id === id);
    if (!claim) return;

    if (action === 'approve') {
        const updated = claims.map(c => c.id === id ? { ...c, status: 'approved' as const } : c);
        setClaims(updated);
        localStorage.setItem('manual_claims_jpa', JSON.stringify(updated));
        
        // FIX: Using 'system' as notification type because 'claim_approval' is not defined in AppNotification['type']
        sendNotification(claim.user_id, 'Loja Reivindicada!', `Sua solicitação para a loja ${claim.store_name} foi aprovada.`, 'system');
        alert(`Loja transferida com sucesso para o usuário ${claim.user_email}`);
    } else {
        const updated = claims.map(c => c.id === id ? { ...c, status: 'rejected' as const } : c);
        setClaims(updated);
        localStorage.setItem('manual_claims_jpa', JSON.stringify(updated));

        // FIX: Using 'system' as notification type because 'claim_rejection' is not defined in AppNotification['type']
        sendNotification(claim.user_id, 'Reivindicação Negada', `Não pudemos aprovar sua posse da loja ${claim.store_name}. Verifique seus dados.`, 'system');
        alert('Solicitação negada.');
    }
  };

  const handleTaxonomyModerate = (id: string, action: 'approve' | 'reject') => {
    const sug = taxonomySuggestions.find(s => s.id === id);
    if (!sug) return;

    if (action === 'approve') {
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'approved' as const } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));
      
      // FIX: Using 'system' as notification type because 'taxonomy_approval' is not defined in AppNotification['type']
      sendNotification(sug.merchantId, 'Sugestão Aprovada!', `Sua sugestão de ${sug.type === 'category' ? 'categoria' : 'subcategoria'} "${sug.name}" foi aprovada.`, 'system');
      alert('Sugestão aprovada! O lojista foi notificado.');
    } else {
      if (!rejectionReason.trim()) {
        alert('Por favor, informe o motivo da rejeição.');
        return;
      }
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'rejected' as const, rejectionReason } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));

      // FIX: Using 'system' as notification type because 'taxonomy_rejection' is not defined in AppNotification['type']
      sendNotification(sug.merchantId, 'Sugestão Recusada', `Não pudemos aprovar "${sug.name}". Motivo: ${rejectionReason}`, 'system');
      alert('Sugestão rejeitada.');
      setRejectionReason('');
      setSelectedSugForAction(null);
    }
  };

  const pendingTaxonomy = taxonomySuggestions.filter(s => s.status === 'pending');
  const pendingClaims = claims.filter(c => c.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" /></button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Painel ADM</h1>
      </div>

      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'reports' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Denúncias ({reports.length})</button>
        <button onClick={() => setActiveTab('taxonomy')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'taxonomy' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Categorias ({pendingTaxonomy.length})</button>
        <button onClick={() => setActiveTab('claims')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'claims' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Reivindicações ({pendingClaims.length})</button>
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

        {activeTab === 'claims' && (
            <div className="space-y-4">
                {pendingClaims.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><ShieldCheck size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma reivindicação pendente</p></div>
                ) : (
                    pendingClaims.map((claim) => (
                        <div key={claim.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#EAF0FF] dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#1E5BFF]"><Building size={24} /></div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{claim.store_name}</h4>
                                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">ID: {claim.store_id}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${claim.method === 'manual' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{claim.method}</div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <UserIcon size={14} className="text-gray-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Solicitante</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{claim.responsible_name || 'Não informado'}</p>
                                        <p className="text-xs text-gray-400">{claim.user_email}</p>
                                    </div>
                                </div>

                                {claim.cnpj && (
                                    <div className="flex items-center gap-3">
                                        <FileText size={14} className="text-gray-400" />
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">CNPJ</p>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{claim.cnpj}</p>
                                        </div>
                                    </div>
                                )}

                                {claim.justification && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Justificativa</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">"{claim.justification}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => handleClaimModerate(claim.id, 'reject')} className="flex-1 py-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs active:scale-95 transition-all">Rejeitar</button>
                                <button onClick={() => handleClaimModerate(claim.id, 'approve')} className="flex-[2] py-3.5 rounded-xl bg-[#1E5BFF] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Aprovar e Transferir</button>
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
