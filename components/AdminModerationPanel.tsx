
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Tag, 
  User as UserIcon,
  FileText,
  Search,
  Flag
} from 'lucide-react';
import { PostReport, TaxonomySuggestion, StoreClaimRequest } from '../types';

export type AdminModerationPanelProps = Record<string, never>;

// Mock inicial para visualização
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
    }
];

const MOCK_SUGGESTIONS: TaxonomySuggestion[] = [
    {
        id: 'sug-1',
        type: 'category',
        name: 'Games & Geek',
        justification: 'Muitas lojas de jogos abrindo no bairro.',
        status: 'pending',
        storeName: 'Geek Zone JPA',
        createdAt: new Date().toISOString(),
        merchantId: 'm-123'
    }
];

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'taxonomy' | 'claims'>('taxonomy');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [reports] = useState<PostReport[]>(MOCK_REPORTS);
  const [claims, setClaims] = useState<StoreClaimRequest[]>(MOCK_CLAIMS);
  const [taxonomySuggestions, setTaxonomySuggestions] = useState<TaxonomySuggestion[]>([]);

  // Action States
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedItemForAction, setSelectedItemForAction] = useState<string | null>(null);

  useEffect(() => {
    const savedSug = localStorage.getItem('taxonomy_suggestions');
    if (savedSug) {
        setTaxonomySuggestions(JSON.parse(savedSug));
    } else {
        setTaxonomySuggestions(MOCK_SUGGESTIONS);
        localStorage.setItem('taxonomy_suggestions', JSON.stringify(MOCK_SUGGESTIONS));
    }
    const savedClaims = localStorage.getItem('manual_claims_jpa');
    if (savedClaims) {
        setClaims(JSON.parse(savedClaims));
    }
  }, []);

  const handleTaxonomyModerate = (id: string, action: 'approve' | 'reject') => {
    const sug = taxonomySuggestions.find(s => s.id === id);
    if (!sug) return;

    if (action === 'approve') {
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'approved' as const } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));
      const savedApproved = JSON.parse(localStorage.getItem('approved_taxonomy') || '[]');
      const newEntry = { type: sug.type, name: sug.name, parentName: sug.parentName };
      if (!savedApproved.find((a: any) => a.type === newEntry.type && a.name === newEntry.name)) {
          localStorage.setItem('approved_taxonomy', JSON.stringify([...savedApproved, newEntry]));
      }
      alert(`Sugestão "${sug.name}" aprovada!`);
    } else {
      if (!rejectionReason.trim()) {
        alert('Por favor, informe o motivo da rejeição.');
        return;
      }
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'rejected' as const, rejectionReason } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));
      setRejectionReason('');
      setSelectedItemForAction(null);
    }
  };

  const handleClaimModerate = (id: string, action: 'approve' | 'reject') => {
      const updated = claims.map(c => c.id === id ? { ...c, status: action === 'approve' ? 'approved' as const : 'rejected' as const } : c);
      setClaims(updated);
      localStorage.setItem('manual_claims_jpa', JSON.stringify(updated));
      alert(`Reivindicação ${action === 'approve' ? 'aprovada' : 'rejeitada'}.`);
  };

  const filteredSuggestions = taxonomySuggestions.filter(s => 
    s.status === 'pending' && 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.storeName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('taxonomy')} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 rounded-xl ${activeTab === 'taxonomy' ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400'}`}>Categorias ({filteredSuggestions.length})</button>
        <button onClick={() => setActiveTab('claims')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 rounded-xl ${activeTab === 'claims' ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400'}`}>Lojistas ({claims.filter(c => c.status === 'pending').length})</button>
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 rounded-xl ${activeTab === 'reports' ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400'}`}>Denúncias ({reports.filter(r => r.status === 'open').length})</button>
      </div>

      <div>
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar solicitações..." 
                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#1E5BFF] shadow-inner"
            />
        </div>

        {activeTab === 'taxonomy' && (
            <div className="space-y-4">
                {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><CheckCircle2 size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Tudo aprovado por aqui</p></div>
                ) : (
                    filteredSuggestions.map((sug) => (
                        <div key={sug.id} className="bg-slate-900 rounded-[2rem] p-6 shadow-md border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#1E5BFF]"><Tag size={20} /></div>
                                    <div>
                                        <span className="text-[9px] font-black bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded uppercase tracking-wider border border-blue-500/20">
                                            NOVA {sug.type === 'category' ? 'CATEGORIA' : 'SUBCATEGORIA'}
                                        </span>
                                        <h4 className="font-bold text-white text-lg mt-1">{sug.name}</h4>
                                    </div>
                                </div>
                            </div>
                            {sug.parentName && (
                                <div className="mb-4 px-3 py-2 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dentro de:</span>
                                    <span className="text-xs font-bold text-slate-200">{sug.parentName}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 size={14} className="text-slate-500" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solicitado por: <span className="text-white">{sug.storeName}</span></p>
                            </div>
                            {sug.justification && <p className="text-xs text-slate-400 italic mb-6">"{sug.justification}"</p>}
                            {selectedItemForAction === sug.id ? (
                                <div className="space-y-3 animate-in zoom-in-95 bg-red-950/20 p-4 rounded-2xl border border-red-500/20">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Motivo da Rejeição</p>
                                    <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Explique ao lojista..." className="w-full bg-black/40 p-3 rounded-xl border border-white/10 text-xs text-white outline-none" rows={2} />
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedItemForAction(null)} className="flex-1 py-2 text-[10px] font-black uppercase text-slate-400 bg-slate-800 rounded-xl">Cancelar</button>
                                        <button onClick={() => handleTaxonomyModerate(sug.id, 'reject')} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-[10px] font-black uppercase">Confirmar Rejeição</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button onClick={() => setSelectedItemForAction(sug.id)} className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-500/20 active:scale-95 transition-all">Rejeitar</button>
                                    <button onClick={() => handleTaxonomyModerate(sug.id, 'approve')} className="flex-[2] py-3 rounded-xl bg-green-600 text-white font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-green-500/20">Aprovar</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        )}

        {activeTab === 'claims' && (
            <div className="space-y-4">
                 {claims.filter(c => c.status === 'pending').length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><ShieldCheck size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma reivindicação pendente</p></div>
                 ) : (
                    claims.filter(c => c.status === 'pending').map((claim) => (
                        <div key={claim.id} className="bg-slate-900 rounded-[2rem] p-6 shadow-md border border-white/5">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20"><Building2 size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-white leading-tight">{claim.store_name}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">ID: {claim.store_id}</p>
                                </div>
                             </div>
                             <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-slate-300"><UserIcon size={14} className="text-slate-500" /> <span className="font-bold">{claim.responsible_name}</span> ({claim.user_email})</div>
                                <div className="flex items-center gap-2 text-xs text-slate-300"><FileText size={14} className="text-slate-500" /> CNPJ: <span className="font-mono">{claim.cnpj}</span></div>
                                {claim.justification && <div className="p-3 bg-black/20 rounded-xl text-xs text-slate-500 italic mt-2 border border-white/5">"{claim.justification}"</div>}
                             </div>
                             <div className="flex gap-3">
                                <button onClick={() => handleClaimModerate(claim.id, 'reject')} className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Rejeitar</button>
                                <button onClick={() => handleClaimModerate(claim.id, 'approve')} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Aprovar Propriedade</button>
                             </div>
                        </div>
                    ))
                 )}
            </div>
        )}

        {activeTab === 'reports' && (
            <div className="space-y-4">
                {reports.filter(r => r.status === 'open').length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><CheckCircle2 size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Sem denúncias pendentes</p></div>
                ) : (
                    reports.filter(r => r.status === 'open').map(report => (
                        <div key={report.id} className="bg-slate-900 rounded-[2rem] p-6 shadow-md border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"><Flag size={20} /></div>
                                    <div>
                                        <span className="text-[9px] font-black bg-red-900/50 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider border border-red-500/20">Denúncia Ativa</span>
                                        <h4 className="font-bold text-white text-base mt-1">Autor: @{report.authorUsername}</h4>
                                    </div>
                                </div>
                                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border ${report.priority === 'high' ? 'bg-red-500 text-white border-red-400' : 'bg-slate-800 text-slate-400 border-white/5'}`}>Prioridade {report.priority}</span>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                                <p className="text-xs text-slate-400 leading-relaxed italic">"{report.postContentSnippet}"</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Ignorar</button>
                                <button className="flex-[2] py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">Remover Post</button>
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
