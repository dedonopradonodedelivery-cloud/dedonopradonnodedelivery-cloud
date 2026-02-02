
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Building2, 
  Tag, 
  User as UserIcon,
  FileText,
  Search,
  Filter,
  Check,
  ShieldCheck
} from 'lucide-react';
import { PostReport, TaxonomySuggestion, StoreClaimRequest } from '../types';

interface AdminModerationPanelProps {
  onBack: () => void;
}

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
    },
    {
        id: 'sug-2',
        type: 'subcategory',
        name: 'Açaíteria',
        parentName: 'Comida',
        justification: 'Já tem pizzaria e lanchonete, falta açaí específico.',
        status: 'pending',
        storeName: 'Açaí do Zé',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        merchantId: 'm-456'
    }
];

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'taxonomy' | 'claims'>('taxonomy');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [reports, setReports] = useState<PostReport[]>(MOCK_REPORTS);
  const [claims, setClaims] = useState<StoreClaimRequest[]>(MOCK_CLAIMS);
  const [taxonomySuggestions, setTaxonomySuggestions] = useState<TaxonomySuggestion[]>([]);

  // Action States
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedItemForAction, setSelectedItemForAction] = useState<string | null>(null);

  // Load Initial Data from LocalStorage (Mock Persistence)
  useEffect(() => {
    // Carregar sugestões
    const savedSug = localStorage.getItem('taxonomy_suggestions');
    if (savedSug) {
        setTaxonomySuggestions(JSON.parse(savedSug));
    } else {
        setTaxonomySuggestions(MOCK_SUGGESTIONS);
        localStorage.setItem('taxonomy_suggestions', JSON.stringify(MOCK_SUGGESTIONS));
    }

    // Carregar reivindicações
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
      
      // Adicionar à lista oficial (persistida no local storage para o merchant ler)
      const savedApproved = JSON.parse(localStorage.getItem('approved_taxonomy') || '[]');
      const newEntry = { type: sug.type, name: sug.name, parentName: sug.parentName };
      
      // Evitar duplicação
      if (!savedApproved.find((a: any) => a.type === newEntry.type && a.name === newEntry.name)) {
          localStorage.setItem('approved_taxonomy', JSON.stringify([...savedApproved, newEntry]));
      }
      
      alert(`Sugestão "${sug.name}" aprovada e adicionada ao catálogo!`);
    } else {
      if (!rejectionReason.trim()) {
        alert('Por favor, informe o motivo da rejeição.');
        return;
      }
      const updated = taxonomySuggestions.map(s => s.id === id ? { ...s, status: 'rejected' as const, rejectionReason } : s);
      setTaxonomySuggestions(updated);
      localStorage.setItem('taxonomy_suggestions', JSON.stringify(updated));

      alert('Sugestão rejeitada.');
      setRejectionReason('');
      setSelectedItemForAction(null);
    }
  };

  const handleClaimModerate = (id: string, action: 'approve' | 'reject') => {
      // Simplificado para demo
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" /></button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Aprovações</h1>
      </div>

      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('taxonomy')} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'taxonomy' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Categorias ({filteredSuggestions.length})</button>
        <button onClick={() => setActiveTab('claims')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'claims' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Lojistas ({claims.filter(c => c.status === 'pending').length})</button>
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'reports' ? 'text-[#1E5BFF] border-b-2 border-[#1E5BFF]' : 'text-gray-400'}`}>Denúncias ({reports.filter(r => r.status === 'open').length})</button>
      </div>

      <div className="p-5 pb-24">
        {/* Barra de Busca */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou lojista..." 
                className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF]"
            />
        </div>

        {/* TAB: TAXONOMIA (CATEGORIAS) */}
        {activeTab === 'taxonomy' && (
            <div className="space-y-4">
                {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><CheckCircle2 size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Tudo aprovado por aqui</p></div>
                ) : (
                    filteredSuggestions.map((sug) => (
                        <div key={sug.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]"><Tag size={20} /></div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
                                                NOVA {sug.type === 'category' ? 'CATEGORIA' : 'SUBCATEGORIA'}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mt-1">{sug.name}</h4>
                                    </div>
                                </div>
                            </div>

                            {sug.parentName && (
                                <div className="mb-4 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dentro de:</span>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{sug.parentName}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                                <Building2 size={14} className="text-gray-400" />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Solicitado por: <span className="text-gray-800 dark:text-white">{sug.storeName}</span></p>
                            </div>
                            
                            {sug.justification && <p className="text-xs text-gray-500 italic mb-6">"{sug.justification}"</p>}

                            {selectedItemForAction === sug.id ? (
                                <div className="space-y-3 animate-in zoom-in-95 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-red-600 uppercase">Motivo da Rejeição</p>
                                    <textarea 
                                        value={rejectionReason}
                                        onChange={e => setRejectionReason(e.target.value)}
                                        placeholder="Explique ao lojista..."
                                        className="w-full bg-white dark:bg-gray-900 p-3 rounded-lg border border-red-100 dark:border-red-900/30 text-xs outline-none"
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedItemForAction(null)} className="flex-1 py-2 text-[10px] font-bold uppercase text-gray-500 bg-white dark:bg-gray-800 rounded-lg border">Cancelar</button>
                                        <button onClick={() => handleTaxonomyModerate(sug.id, 'reject')} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-[10px] font-black uppercase">Confirmar Rejeição</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button onClick={() => setSelectedItemForAction(sug.id)} className="flex-1 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all">
                                        <XCircle size={16} /> Rejeitar
                                    </button>
                                    <button onClick={() => handleTaxonomyModerate(sug.id, 'approve')} className="flex-[2] py-3 rounded-xl bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-500/20">
                                        <CheckCircle2 size={16} /> Aprovar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        )}

        {/* TAB: REIVINDICAÇÕES */}
        {activeTab === 'claims' && (
            <div className="space-y-4">
                 {claims.filter(c => c.status === 'pending').length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center"><ShieldCheck size={48} className="mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Nenhuma reivindicação pendente</p></div>
                 ) : (
                    claims.filter(c => c.status === 'pending').map((claim) => (
                        <div key={claim.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{claim.store_name}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">ID: {claim.store_id}</p>
                                </div>
                             </div>
                             
                             <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <UserIcon size={14} className="text-gray-400" /> 
                                    <span className="font-bold">{claim.responsible_name}</span> ({claim.user_email})
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                    <FileText size={14} className="text-gray-400" /> 
                                    CNPJ: <span className="font-mono">{claim.cnpj}</span>
                                </div>
                                {claim.justification && (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs text-gray-500 italic mt-2">
                                        "{claim.justification}"
                                    </div>
                                )}
                             </div>

                             <div className="flex gap-3">
                                <button onClick={() => handleClaimModerate(claim.id, 'reject')} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">Rejeitar</button>
                                <button onClick={() => handleClaimModerate(claim.id, 'approve')} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20">Aprovar Transferência</button>
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
