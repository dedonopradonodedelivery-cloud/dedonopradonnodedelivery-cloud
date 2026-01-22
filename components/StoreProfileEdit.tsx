
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  Store as StoreIcon, 
  Phone, 
  CheckCircle2, 
  Loader2, 
  Save, 
  Info,
  Hash,
  X,
  Plus,
  AlertTriangle,
  ChevronDown,
  Search,
  PlusCircle,
  HelpCircle,
  Pencil,
  Trash2,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES, SPECIALTIES } from '../constants';
import { TaxonomyType } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

// --- Componente de Seleção Customizado (Campo + Dropdown) ---
const TaxonomySelect: React.FC<{
  label: string;
  placeholder: string;
  options: { name: string; icon?: React.ReactNode }[];
  selected: string[];
  onSelect: (name: string) => void;
  onRemove: (name: string) => void;
  multiple?: boolean;
  onSuggest: () => void;
  helperText?: string;
}> = ({ label, placeholder, options, selected, onSelect, onRemove, multiple = false, onSuggest, helperText }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(opt => 
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-2 relative animate-in fade-in duration-300">
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                {helperText && <span className="text-[9px] text-[#1E5BFF] font-bold">{helperText}</span>}
            </div>
            
            <div className="relative">
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full p-4 bg-white dark:bg-gray-900 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-[#1E5BFF] ring-4 ring-blue-500/5' : 'border-gray-100 dark:border-gray-800'}`}
                >
                    <div className="flex flex-wrap gap-2 flex-1">
                        {selected.length === 0 ? (
                            <span className="text-gray-400 text-sm">{placeholder}</span>
                        ) : (
                            selected.map(item => (
                                <span key={item} className="bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-100 dark:border-blue-800 animate-in zoom-in-95">
                                    {item}
                                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); onRemove(item); }} />
                                </span>
                            ))
                        )}
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2">
                        <div className="p-3 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2">
                            <Search size={16} className="text-gray-400" />
                            <input 
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Filtrar opções..."
                                className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
                            {filteredOptions.length > 0 ? filteredOptions.map(opt => {
                                const isSelected = selected.includes(opt.name);
                                return (
                                    <button
                                        key={opt.name}
                                        type="button"
                                        onClick={() => { onSelect(opt.name); if (!multiple) setIsOpen(false); }}
                                        className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSelected ? 'text-[#1E5BFF] font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {opt.icon && <span className="opacity-50 scale-75">{opt.icon}</span>}
                                            {opt.name}
                                        </div>
                                        {isSelected && <Check size={16} />}
                                    </button>
                                );
                            }) : (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-xs text-gray-400">Nenhum resultado encontrado.</p>
                                    <button 
                                        type="button"
                                        onClick={() => { onSuggest(); setIsOpen(false); }}
                                        className="mt-2 text-[#1E5BFF] text-xs font-bold hover:underline flex items-center gap-1 mx-auto"
                                    >
                                        <Plus size={12} /> Sugerir nova opção
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {isOpen && <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Modals
  const [suggestionModal, setSuggestionModal] = useState<{ isOpen: boolean; type: TaxonomyType; parentName?: string } | null>(null);
  const [suggestionName, setSuggestionName] = useState('');
  const [showMultiCatPrompt, setShowMultiCatPrompt] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    whatsapp: '',
    logo_url: '',
    banner_url: '',
    categories: [] as string[],
    subcategories: [] as string[],
    specialties: [] as string[]
  });

  useEffect(() => {
    if (!user) return;
    const fetchStoreData = async () => {
      try {
        const { data } = await supabase.from('merchants').select('*').eq('owner_id', user.id).maybeSingle();
        if (data) {
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            cnpj: data.cnpj || '',
            email: data.email || '',
            whatsapp: data.whatsapp || '',
            logo_url: data.logo_url || '',
            banner_url: data.banner_url || '',
            categories: data.categories || [],
            subcategories: data.subcategories || [],
            specialties: data.specialties || [],
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.logo_url || !formData.name || formData.categories.length === 0) {
      alert('Preencha os campos obrigatórios (Logo, Nome e pelo menos 1 Categoria)');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').upsert({ owner_id: user?.id, ...formData }, { onConflict: 'owner_id' });
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { alert('Erro ao salvar. Tente novamente.'); } finally { setIsSaving(false); }
  };

  // --- Lógica de Taxonomia Cascata ---
  
  const addCategory = (name: string) => {
    if (formData.categories.includes(name)) return;
    setFormData(prev => ({ ...prev, categories: [...prev.categories, name] }));
    setShowMultiCatPrompt(true);
  };

  const removeCategory = (name: string) => {
    const subsOfRemoved = (SUBCATEGORIES[name] || []).map(s => s.name);
    const newSubs = formData.subcategories.filter(s => !subsOfRemoved.includes(s));
    const specialtiesToKeep = newSubs.flatMap(s => SPECIALTIES[s] || []);
    const newSpecs = formData.specialties.filter(spec => specialtiesToKeep.includes(spec));
    setFormData(prev => ({ 
        ...prev, 
        categories: prev.categories.filter(c => c !== name),
        subcategories: newSubs,
        specialties: newSpecs
    }));
  };

  const addSubcategory = (name: string) => {
    if (formData.subcategories.includes(name)) return;
    setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, name] }));
  };

  const removeSubcategory = (name: string) => {
    const specsOfRemoved = SPECIALTIES[name] || [];
    const newSpecs = formData.specialties.filter(s => !specsOfRemoved.includes(s));
    setFormData(prev => ({ 
        ...prev, 
        subcategories: prev.subcategories.filter(s => s !== name),
        specialties: newSpecs
    }));
  };

  const addSpecialty = (name: string) => {
    if (formData.specialties.includes(name)) return;
    setFormData(prev => ({ ...prev, specialties: [...prev.specialties, name] }));
  };

  const removeSpecialty = (name: string) => {
    setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== name) }));
  };

  const submitSuggestion = () => {
    if (!suggestionName.trim() || !suggestionModal) return;
    const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
    const suggestions = JSON.parse(saved);
    suggestions.push({
        id: Date.now().toString(),
        type: suggestionModal.type,
        name: suggestionName.trim(),
        parentName: suggestionModal.parentName,
        status: 'pending',
        storeName: formData.name,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('taxonomy_suggestions', JSON.stringify(suggestions));
    alert('Sugestão enviada para análise do ADM.');
    setSuggestionName('');
    setSuggestionModal(null);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
      <p className="text-gray-400 font-bold uppercase text-[10px]">Carregando Perfil...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-48 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Perfil da Loja</h1>
        </div>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* IDENTIDADE VISUAL */}
        <section className="space-y-8">
            <div className="flex items-center gap-2 px-1">
                <Camera size={16} className="text-[#1E5BFF]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidade Visual</h2>
            </div>
            
            <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                    <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 bg-white dark:bg-gray-800 shadow-xl ${!formData.logo_url ? 'border-dashed border-red-200' : 'border-white dark:border-gray-900'}`}>
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-4 text-center"><StoreIcon size={24} /><span className="text-[8px] font-bold uppercase mt-1">Logo Obrigatória</span></div>}
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, logo_url: 'https://ui-avatars.com/api/?background=1E5BFF&color=fff&name=Loja'})} className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#1E5BFF] text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform"><Pencil size={16} /></button>
                </div>

                <div className="w-full space-y-3">
                    <div className="w-full aspect-[3/1] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 group cursor-pointer" onClick={() => setFormData({...formData, banner_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800'})}>
                        {formData.banner_url ? <img src={formData.banner_url} className="w-full h-full object-cover" /> : <><PlusCircle size={20} className="text-gray-400" /><span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Adicionar Capa (Banner)</span></>}
                    </div>
                </div>
            </div>
        </section>

        {/* DADOS BÁSICOS */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Info size={16} className="text-[#1E5BFF]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações Básicas</h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Fantasia *</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" />
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de Vendas *</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-12 rounded-2xl border-none outline-none text-sm font-bold mt-1" placeholder="(21) 99999-9999" />
                    </div>
                </div>
            </div>
        </section>

        {/* CLASSIFICAÇÃO GUIADA */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Hash size={16} className="text-[#1E5BFF]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classificação do Negócio</h2>
            </div>

            <div className="space-y-8">
                {/* CATEGORIAS */}
                <TaxonomySelect 
                    label="1. Categorias Principais"
                    placeholder="Selecione o segmento principal..."
                    options={CATEGORIES.map(c => ({ name: c.name, icon: c.icon }))}
                    selected={formData.categories}
                    onSelect={addCategory}
                    onRemove={removeCategory}
                    multiple
                    onSuggest={() => setSuggestionModal({ isOpen: true, type: 'category' })}
                    helperText="Obrigatório"
                />

                {/* SUBCATEGORIAS */}
                {formData.categories.length > 0 && (
                    <TaxonomySelect 
                        label="2. Subcategorias"
                        placeholder="Selecione como sua loja é conhecida..."
                        options={formData.categories.flatMap(cat => SUBCATEGORIES[cat] || [])}
                        selected={formData.subcategories}
                        onSelect={addSubcategory}
                        onRemove={removeSubcategory}
                        multiple
                        onSuggest={() => setSuggestionModal({ isOpen: true, type: 'subcategory', parentName: formData.categories.join(', ') })}
                        helperText="Selecione pelo menos uma"
                    />
                )}

                {/* ESPECIALIDADES */}
                {formData.subcategories.length > 0 && (
                    <TaxonomySelect 
                        label="3. Especialidades Técnicas"
                        placeholder="Quais serviços específicos você faz?"
                        options={formData.subcategories.flatMap(sub => (SPECIALTIES[sub] || SPECIALTIES['default']).map(s => ({ name: s })))}
                        selected={formData.specialties}
                        onSelect={addSpecialty}
                        onRemove={removeSpecialty}
                        multiple
                        onSuggest={() => setSuggestionModal({ isOpen: true, type: 'specialty', parentName: formData.subcategories.join(', ') })}
                        helperText="Aumente seus filtros de busca"
                    />
                )}
            </div>
        </section>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        <button 
          onClick={() => handleSave()} 
          disabled={isSaving}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          SALVAR ALTERAÇÕES
        </button>
      </div>

      {/* MODAL: ADICIONAR OUTRA CATEGORIA? */}
      {showMultiCatPrompt && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                    <PlusCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-tight mb-2">Adicionar outro segmento?</h3>
                <p className="text-xs text-gray-500 mb-8 leading-relaxed">Sua loja se encaixa em mais de uma categoria? (Ex: Comida e Mercado)</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowMultiCatPrompt(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest">Não</button>
                    <button onClick={() => setShowMultiCatPrompt(false)} className="flex-1 py-3 bg-[#1E5BFF] text-white rounded-xl font-bold text-xs uppercase tracking-widest">Sim</button>
                </div>
            </div>
        </div>
      )}

      {/* SUGGESTION MODAL */}
      {suggestionModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black uppercase tracking-tighter">Sugerir Opção</h3>
                    <button onClick={() => setSuggestionModal(null)}><X size={24} /></button>
                </div>
                <div className="space-y-5">
                    {suggestionModal.parentName && <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-[10px] text-blue-700 font-bold border border-blue-100 dark:border-blue-800 uppercase tracking-widest leading-relaxed">Vincular a: {suggestionModal.parentName}</div>}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nome Sugerido</label>
                        <input value={suggestionName} onChange={e => setSuggestionName(e.target.value)} placeholder="Ex: Engenheiro Mecânico" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none dark:text-white font-bold" />
                    </div>
                    <button onClick={submitSuggestion} disabled={!suggestionName.trim()} className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50">ENVIAR PARA O ADM</button>
                </div>
            </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[150] bg-white/95 dark:bg-gray-950/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-6 animate-bounce-short shadow-xl shadow-emerald-500/20"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Perfil Atualizado!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center max-w-[200px]">As mudanças já estão visíveis para os moradores do bairro.</p>
        </div>
      )}
    </div>
  );
};
