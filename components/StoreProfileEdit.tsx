
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  Store as StoreIcon, 
  Mail, 
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
  Building2,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES, SPECIALTIES } from '../constants';
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
  onSuggest: () => void;
  guideText?: string;
  multiple?: boolean;
}

const TaxonomyField: React.FC<TaxonomyFieldProps> = ({ 
  label, 
  placeholder, 
  options, 
  selected, 
  onSelect, 
  onRemove, 
  onSuggest,
  guideText,
  multiple = false
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

  return (
    <div className="space-y-2 animate-in fade-in duration-300" ref={dropdownRef}>
      <div className="flex justify-between items-end px-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</label>
        {guideText && <span className="text-[9px] text-blue-500 font-bold italic leading-none">{guideText}</span>}
      </div>
      
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white dark:bg-gray-900 border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'border-[#1E5BFF] ring-4 ring-blue-500/5' : 'border-gray-100 dark:border-gray-800'}`}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {selected.length === 0 ? (
              <span className="text-gray-400 text-sm">{placeholder}</span>
            ) : (
              selected.map(item => (
                <span key={item} className="bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-100 dark:border-blue-800">
                  {item}
                  <X size={12} className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); onRemove(item); }} />
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
                placeholder="Buscar..."
                className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white"
              />
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
              {filtered.map(opt => {
                const isSelected = selected.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => { onSelect(opt.name); if(!multiple) setIsOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSelected ? 'text-[#1E5BFF] font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon && <span className="opacity-50">{opt.icon}</span>}
                      {opt.name}
                    </div>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
              <button 
                type="button"
                onClick={() => { onSuggest(); setIsOpen(false); }}
                className="w-full px-4 py-4 text-center text-[#1E5BFF] text-xs font-black uppercase tracking-widest border-t border-gray-50 dark:border-gray-800 hover:bg-blue-50 transition-colors"
              >
                + Sugerir Novo
              </button>
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
  
  // File Inputs Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [showAddAnotherModal, setShowAddAnotherModal] = useState(false);
  const [suggestionModal, setSuggestionModal] = useState<{ isOpen: boolean; type: TaxonomyType; parentName?: string } | null>(null);
  const [suggestionData, setSuggestionData] = useState({ name: '', justification: '' });

  // Form State
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
    specialties: [] as string[]
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
            specialties: data.specialties || [],
          });
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    if (!formData.logo_url) {
      alert('A Logo da empresa é obrigatória para aparecer no app.');
      return;
    }
    if (!formData.name || formData.categories.length === 0) {
      alert('Preencha os campos obrigatórios (Nome e Categorias)');
      return;
    }
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
    } catch (err) { alert('Erro ao salvar. Tente novamente.'); } finally { setIsSaving(false); }
  };

  // --- Handlers Imagens ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulação de upload gerando URL local de preview
      const previewUrl = URL.createObjectURL(file);
      if (type === 'logo') setFormData(prev => ({ ...prev, logo_url: previewUrl }));
      else setFormData(prev => ({ ...prev, banner_url: previewUrl }));
    }
  };

  const handleRemoveImage = (type: 'logo' | 'banner') => {
    if (type === 'logo') setFormData(prev => ({ ...prev, logo_url: '' }));
    else setFormData(prev => ({ ...prev, banner_url: '' }));
  };

  // --- Handlers Taxonomia ---
  const handleSelectCategory = (name: string) => {
    if (formData.categories.includes(name)) return;
    setFormData(prev => ({ ...prev, categories: [...prev.categories, name] }));
    setShowAddAnotherModal(true);
  };

  const handleRemoveCategory = (name: string) => {
    const newCats = formData.categories.filter(c => c !== name);
    const subsOfRemoved = (SUBCATEGORIES[name] || []).map(s => s.name);
    const newSubs = formData.subcategories.filter(s => !subsOfRemoved.includes(s));
    const specialtiesToKeep = newSubs.flatMap(s => SPECIALTIES[s] || []);
    const newSpecs = formData.specialties.filter(spec => specialtiesToKeep.includes(spec));
    
    setFormData(prev => ({ 
      ...prev, 
      categories: newCats, 
      subcategories: newSubs, 
      specialties: newSpecs 
    }));
  };

  const handleSelectSub = (name: string) => {
    if (formData.subcategories.includes(name)) return;
    setFormData(prev => ({ ...prev, subcategories: [...prev.subcategories, name] }));
  };

  const handleRemoveSub = (name: string) => {
    const specsOfRemoved = SPECIALTIES[name] || [];
    setFormData(prev => ({ 
      ...prev, 
      subcategories: prev.subcategories.filter(s => s !== name),
      specialties: prev.specialties.filter(s => !specsOfRemoved.includes(s))
    }));
  };

  const handleSelectSpec = (name: string) => {
    if (formData.specialties.includes(name)) return;
    setFormData(prev => ({ ...prev, specialties: [...prev.specialties, name] }));
  };

  const handleRemoveSpec = (name: string) => {
    setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== name) }));
  };

  const submitSuggestion = () => {
    if (!suggestionData.name.trim() || !suggestionModal) return;
    const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
    const suggestions = JSON.parse(saved);
    suggestions.push({
      id: Date.now().toString(),
      type: suggestionModal.type,
      name: suggestionData.name.trim(),
      parentName: suggestionModal.parentName,
      justification: suggestionData.justification.trim(),
      status: 'pending',
      storeName: formData.name,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('taxonomy_suggestions', JSON.stringify(suggestions));
    alert('Sugestão enviada para análise do ADM.');
    setSuggestionData({ name: '', justification: '' });
    setSuggestionModal(null);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-48 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Perfil da Loja</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Identidade e Classificação</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* IDENTIDADE VISUAL */}
        <section className="space-y-10">
          <div className="flex items-center gap-2 px-1">
            <Camera size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidade Visual</h2>
          </div>

          {/* LOGO */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 bg-white dark:bg-gray-800 shadow-xl transition-all ${!formData.logo_url ? 'border-dashed border-red-200' : 'border-white dark:border-gray-900'}`}>
                {formData.logo_url ? (
                  <img src={formData.logo_url} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-4 text-center">
                    <StoreIcon size={24} />
                    <span className="text-[8px] font-bold uppercase mt-1">Logo Obrigatória</span>
                  </div>
                )}
              </div>
              
              <div className="absolute -right-2 -bottom-2 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => logoInputRef.current?.click()} 
                  className="w-10 h-10 bg-[#1E5BFF] text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Pencil size={16} />
                </button>
                {formData.logo_url && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('logo')} 
                    className="w-10 h-10 bg-white dark:bg-gray-800 text-red-500 border border-red-100 dark:border-red-900 rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
            </div>
            <div className="mt-4 text-center space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo da Empresa *</p>
              <div className="text-[9px] text-gray-400 font-medium leading-relaxed">
                Tamanho recomendado: 500 × 500 px (quadrado)<br/>
                Formato: PNG ou JPG • Fundo transparente recomendado<br/>
                <span className="text-red-400 font-bold">Logo é obrigatória para aparecer no app</span>
              </div>
            </div>
          </div>

          {/* BANNER */}
          <div className="w-full space-y-4">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Banner / Capa da Loja</label>
              <span className="text-[9px] text-gray-400 font-bold uppercase">Opcional</span>
            </div>
            <div className="relative group">
              <div 
                onClick={() => !formData.banner_url && bannerInputRef.current?.click()}
                className={`w-full aspect-[3/1] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 transition-all relative ${formData.banner_url ? 'border-solid border-transparent' : 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
              >
                {formData.banner_url ? (
                  <img src={formData.banner_url} className="w-full h-full object-cover" alt="Banner" />
                ) : (
                  <>
                    <PlusCircle size={20} className="text-gray-400" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Adicionar banner de capa</span>
                  </>
                )}
              </div>

              {formData.banner_url && (
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => bannerInputRef.current?.click()} 
                    className="p-2.5 bg-white/90 backdrop-blur-md text-[#1E5BFF] rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform border border-white"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage('banner')} 
                    className="p-2.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform border border-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
            </div>
            <div className="px-1 space-y-1">
              <p className="text-[9px] text-gray-400 font-medium leading-tight">
                Tamanho recomendado: 1200 × 400 px • Formato: JPG ou PNG
              </p>
              <p className="text-[9px] text-blue-500 font-bold leading-tight italic">
                "O banner aparece no topo do seu perfil público e aumenta a conversão."
              </p>
            </div>
          </div>
        </section>

        {/* IDENTIFICAÇÃO FISCAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Building2 size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificação Fiscal</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-3">
              <Info className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                Essas informações são usadas para emissão de nota fiscal e não ficam públicas.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Fantasia *</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" placeholder="Nome no app" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Razão Social *</label>
                <input value={formData.razao_social} onChange={e => setFormData({...formData, razao_social: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ *</label>
                <input value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" placeholder="00.000.000/0001-00" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Financeiro *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={formData.email_fiscal} onChange={e => setFormData({...formData, email_fiscal: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-11 rounded-2xl border-none outline-none text-sm font-bold mt-1" placeholder="financeiro@empresa.com" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Financeiro *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={formData.whatsapp_financeiro} onChange={e => setFormData({...formData, whatsapp_financeiro: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-11 rounded-2xl border-none outline-none text-sm font-bold mt-1" placeholder="(21) 99999-9999" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAXONOMIA GUIADA */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <Hash size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classificação</h2>
          </div>

          <div className="space-y-10">
            <TaxonomyField 
              label="1. Categorias Principais"
              guideText="Selecione a categoria"
              placeholder="[ Selecione a categoria ▾ ]"
              options={CATEGORIES.map(c => ({ name: c.name, icon: c.icon }))}
              selected={formData.categories}
              onSelect={handleSelectCategory}
              onRemove={handleRemoveCategory}
              onSuggest={() => setSuggestionModal({ isOpen: true, type: 'category' })}
              multiple
            />

            {formData.categories.map(cat => (
              <TaxonomyField 
                key={cat}
                label={`2. Subcategoria de ${cat}`}
                guideText="Agora selecione a subcategoria"
                placeholder="[ Selecione a subcategoria ▾ ]"
                options={SUBCATEGORIES[cat] || []}
                selected={formData.subcategories.filter(s => (SUBCATEGORIES[cat] || []).some(opt => opt.name === s))}
                onSelect={handleSelectSub}
                onRemove={handleRemoveSub}
                onSuggest={() => setSuggestionModal({ isOpen: true, type: 'subcategory', parentName: cat })}
                multiple
              />
            ))}

            {formData.subcategories.map(sub => (
              <TaxonomyField 
                key={sub}
                label={`3. Especialidades em ${sub}`}
                guideText="Por fim, selecione a especialidade"
                placeholder="[ Selecione a especialidade ▾ ]"
                options={(SPECIALTIES[sub] || SPECIALTIES['default']).map(s => ({ name: s }))}
                selected={formData.specialties.filter(s => (SPECIALTIES[sub] || SPECIALTIES['default']).includes(s))}
                onSelect={handleSelectSpec}
                onRemove={handleRemoveSpec}
                onSuggest={() => setSuggestionModal({ isOpen: true, type: 'specialty', parentName: sub })}
                multiple
              />
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          SALVAR PERFIL
        </button>
      </div>

      {/* MODALS */}
      {showAddAnotherModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowAddAnotherModal(false)}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                    <PlusCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-tight mb-2">Adicionar outro segmento?</h3>
                <p className="text-xs text-gray-500 mb-8 leading-relaxed">Sua loja se encaixa em mais de um segmento principal?</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowAddAnotherModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest">Não</button>
                    <button onClick={() => setShowAddAnotherModal(false)} className="flex-1 py-3 bg-[#1E5BFF] text-white rounded-xl font-bold text-xs uppercase tracking-widest">Sim</button>
                </div>
            </div>
        </div>
      )}

      {suggestionModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSuggestionModal(null)}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black uppercase tracking-tighter">Sugerir Opção</h3>
                    <button onClick={() => setSuggestionModal(null)}><X size={24} /></button>
                </div>
                <div className="space-y-5">
                    {suggestionModal.parentName && <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-[10px] text-blue-700 font-bold border border-blue-100 dark:border-blue-800 uppercase tracking-widest">Vincular a: {suggestionModal.parentName}</div>}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Nome Sugerido</label>
                        <input value={suggestionData.name} onChange={e => setSuggestionData({...suggestionData, name: e.target.value})} placeholder="Ex: Eng. Mecânico" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none dark:text-white font-bold" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Justificativa (Opcional)</label>
                        <textarea value={suggestionData.justification} onChange={e => setSuggestionData({...suggestionData, justification: e.target.value})} placeholder="..." rows={2} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none dark:text-white resize-none" />
                    </div>
                    <button onClick={submitSuggestion} disabled={!suggestionData.name.trim()} className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50">ENVIAR PARA O ADM</button>
                </div>
            </div>
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
