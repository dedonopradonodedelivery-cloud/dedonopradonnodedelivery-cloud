import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  Store as StoreIcon, 
  Loader2, 
  Save, 
  X, 
  ChevronDown, 
  Search, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Building2, 
  Check,
  Hash,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Send,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES } from '../constants';
import { TaxonomyType } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

interface TaxonomyFieldProps {
  label: string;
  placeholder: string;
  options: { name: string; icon?: React.ReactNode }[];
  selected: string[];
  onSelect: (name: string) => void;
  onRemove: (name: string) => void;
  guideText?: string;
}

const TaxonomyField: React.FC<TaxonomyFieldProps> = ({ 
  label, 
  placeholder, 
  options, 
  selected, 
  onSelect, 
  onRemove, 
  guideText 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase()));
  
  // Adiciona a opção "Outras..." ao final
  const finalOptions = [...filtered, { name: 'Outras... (sugerir nova)', icon: <PlusCircle size={14} />, isSuggestion: true }];

  return (
    <div className="space-y-2 animate-in fade-in duration-300" ref={dropdownRef}>
      <div className="flex justify-between items-end px-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</label>
        {guideText && <span className="text-[9px] text-blue-500 font-bold italic leading-none">{guideText}</span>}
      </div>
      
      <div className="relative">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white dark:bg-gray-900 border-2 rounded-2xl p-4 flex items-center justify-between transition-all ${isOpen ? 'border-[#1E5BFF] ring-4 ring-blue-500/5' : 'border-gray-100 dark:border-gray-800'}`}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {selected.length === 0 ? (
              <span className="text-gray-400 text-sm font-medium">{placeholder}</span>
            ) : (
              selected.map(item => (
                <span key={item} className="bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border border-blue-100 dark:border-blue-800 animate-in zoom-in-95">
                  {item}
                  <X size={12} className="hover:text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); onRemove(item); }} />
                </span>
              ))
            )}
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2">
            <div className="p-3 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50">
              <Search size={16} className="text-gray-400" />
              <input 
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar na lista..."
                className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white"
              />
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
              {finalOptions.map((opt, i) => {
                const isSelected = selected.includes(opt.name);
                const isSug = (opt as any).isSuggestion;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onSelect(opt.name); setIsOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSelected ? 'text-[#1E5BFF] font-bold bg-blue-50/30' : isSug ? 'text-blue-500 font-bold border-t border-gray-50 dark:border-gray-800 mt-1 pt-4' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon && <span className="opacity-50">{opt.icon}</span>}
                      {opt.name}
                    </div>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAnalysisFeedback, setShowAnalysisFeedback] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [suggestionModal, setSuggestionModal] = useState<{ isOpen: boolean; type: TaxonomyType; parentName?: string } | null>(null);
  const [suggestionData, setSuggestionData] = useState({ name: '', justification: '' });

  const [formData, setFormData] = useState({
    name: '',
    razao_social: '',
    cnpj: '',
    email_fiscal: '',
    whatsapp_financeiro: '',
    logo_url: '',
    banner_url: '',
    categories: [] as string[],
    subcategories: [] as string[],
  });

  useEffect(() => {
    if (!user) return;
    const fetchStoreData = async () => {
      try {
        const { data } = await supabase.from('merchants').select('*').eq('owner_id', user.id).maybeSingle();
        if (data) {
          setFormData({
            name: data.name || '',
            razao_social: data.razao_social || '',
            cnpj: data.cnpj || '',
            email_fiscal: data.email_fiscal || data.email || '',
            whatsapp_financeiro: data.whatsapp_financeiro || data.whatsapp || '',
            logo_url: data.logo_url || '',
            banner_url: data.banner_url || '',
            categories: data.categories || [],
            subcategories: data.subcategories || [],
          });
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    if (!formData.logo_url) { alert('A Logo da empresa é obrigatória.'); return; }
    if (!formData.name || !formData.cnpj || formData.categories.length === 0) { alert('Preencha os campos obrigatórios.'); return; }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').upsert({
        owner_id: user?.id,
        ...formData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'owner_id' });
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { alert('Erro ao salvar.'); } finally { setIsSaving(false); }
  };

  const submitSuggestion = async () => {
    if (!suggestionData.name.trim() || !suggestionModal) return;
    
    const suggestion = {
      id: Date.now().toString(),
      type: suggestionModal.type,
      name: suggestionData.name.trim(),
      parentName: suggestionModal.parentName,
      justification: suggestionData.justification.trim(),
      status: 'pending',
      storeName: formData.name || 'Loja em Cadastro',
      merchantId: user?.id,
      createdAt: new Date().toISOString()
    };

    const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
    localStorage.setItem('taxonomy_suggestions', JSON.stringify([...JSON.parse(saved), suggestion]));
    
    setSuggestionModal(null);
    setSuggestionData({ name: '', justification: '' });
    setShowAnalysisFeedback(true);
    setTimeout(() => setShowAnalysisFeedback(false), 4000);
  };

  const handleSelectCategory = (name: string) => {
    if (name.includes('Outras...')) {
      setSuggestionModal({ isOpen: true, type: 'category' });
      return;
    }
    if (formData.categories.includes(name)) return;
    setFormData(prev => ({ ...prev, categories: [...prev.categories, name] }));
  };

  const handleRemoveCategory = (name: string) => {
    const newCats = formData.categories.filter(c => c !== name);
    const validSubs = (SUBCATEGORIES[name] || []).map(s => s.name);
    const newSubs = formData.subcategories.filter(s => !validSubs.includes(s));
    setFormData(prev => ({ ...prev, categories: newCats, subcategories: newSubs }));
  };

  const handleSelectSub = (name: string, parentName: string) => {
    if (name.includes('Outras...')) {
      setSuggestionModal({ isOpen: true, type: 'subcategory', parentName });
      return;
    }
    if (formData.subcategories.includes(name)) return;
    setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, name] }));
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-48 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil da Loja</h1>
        </div>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        <section className="space-y-10">
          <div className="flex items-center gap-2 px-1">
            <Camera size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidade Visual</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 bg-white dark:bg-gray-800 shadow-xl ${!formData.logo_url ? 'border-dashed border-red-200' : 'border-white dark:border-gray-900'}`}>
                {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" alt="Logo" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-4 text-center"><StoreIcon size={24} /><span className="text-[8px] font-bold uppercase mt-1">Logo Obrigatória</span></div>}
              </div>
              <div className="absolute -right-2 -bottom-2 flex gap-2">
                <button type="button" onClick={() => logoInputRef.current?.click()} className="w-10 h-10 bg-[#1E5BFF] text-white rounded-2xl shadow-lg flex items-center justify-center"><Pencil size={16} /></button>
              </div>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r=new FileReader(); r.onload=()=>setFormData({...formData, logo_url: r.result as string}); r.readAsDataURL(f); } }} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Building2 size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificação Fiscal</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Fantasia *</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
            <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ *</label><input value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <Hash size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classificação</h2>
          </div>
          <div className="space-y-10">
            <TaxonomyField 
              label="1. Categorias Principais"
              guideText="Selecione o segmento"
              placeholder="[ Selecione ▾ ]"
              options={CATEGORIES.map(c => ({ name: c.name, icon: c.icon }))}
              selected={formData.categories}
              onSelect={handleSelectCategory}
              onRemove={handleRemoveCategory}
            />
            {formData.categories.map(cat => (
              <TaxonomyField 
                key={`sub-${cat}`}
                label={`2. Subcategoria de ${cat}`}
                guideText="Selecione o tipo de negócio"
                placeholder="[ Selecione ▾ ]"
                options={SUBCATEGORIES[cat] || []}
                selected={formData.subcategories.filter(s => (SUBCATEGORIES[cat] || []).some(opt => opt.name === s))}
                onSelect={(name) => handleSelectSub(name, cat)}
                onRemove={(name) => setFormData(prev => ({ ...prev, subcategories: prev.subcategories.filter(s => s !== name) }))}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        <button onClick={handleSave} disabled={isSaving} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          SALVAR PERFIL
        </button>
      </div>

      {suggestionModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black uppercase tracking-tighter leading-none">Sugerir {suggestionModal.type === 'category' ? 'Categoria' : 'Subcategoria'}</h3>
                    <button onClick={() => setSuggestionModal(null)} className="p-2 text-gray-400"><X size={24} /></button>
                </div>
                <div className="space-y-5">
                    {suggestionModal.parentName && <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-[10px] text-blue-700 font-bold border border-blue-100 dark:border-blue-800 uppercase">Vincular a: {suggestionModal.parentName}</div>}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome *</label>
                        <input value={suggestionData.name} onChange={e => setSuggestionData({...suggestionData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white font-bold" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Justificativa (Opcional)</label>
                        <textarea value={suggestionData.justification} onChange={e => setSuggestionData({...suggestionData, justification: e.target.value})} rows={3} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white resize-none text-sm" />
                    </div>
                    <button onClick={submitSuggestion} disabled={!suggestionData.name.trim()} className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"><Send size={16} /> ENVIAR PARA ANÁLISE</button>
                </div>
            </div>
        </div>
      )}

      {showAnalysisFeedback && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-8 py-5 rounded-3xl shadow-2xl border border-white/20 animate-in slide-in-from-top-10 flex flex-col items-center gap-2 max-w-xs text-center">
            <CheckCircle2 className="text-emerald-400" size={28} />
            <p className="text-sm font-bold leading-tight">Enviado para análise. Você terá uma resposta em até 48 horas.</p>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[150] bg-white/95 dark:bg-gray-950/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter text-center">Perfil Atualizado!</h2>
        </div>
      )}
    </div>
  );
};