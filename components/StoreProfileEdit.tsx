
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
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES, SPECIALTIES } from '../constants';
import { TaxonomyType } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

// Componente de Campo com Dropdown (Barra com Seta)
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
              {filtered.length > 0 ? filtered.map(opt => {
                const isSelected = selected.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => { onSelect(opt.name); setIsOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSelected ? 'text-[#1E5BFF] font-bold bg-blue-50/30' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon && <span className="opacity-50">{opt.icon}</span>}
                      {opt.name}
                    </div>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              }) : (
                <div className="p-4 text-center text-xs text-gray-400">Nenhuma opção encontrada</div>
              )}
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
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [showAddAnotherModal, setShowAddAnotherModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    razao_social: '',
    cnpj: '',
    email_fiscal: '',
    whatsapp_financeiro: '',
    telefone_fixo: '',
    inscricao_municipal: '',
    inscricao_estadual: '',
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
            telefone_fixo: data.telefone_fixo || '',
            inscricao_municipal: data.inscricao_municipal || '',
            inscricao_estadual: data.inscricao_estadual || '',
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
    if (!formData.name || !formData.razao_social || !formData.cnpj || !formData.email_fiscal || !formData.whatsapp_financeiro || formData.categories.length === 0) {
      alert('Preencha todos os campos obrigatórios da Identificação Fiscal e Categorias.');
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, logo_url: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, banner_url: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // --- Lógica de Taxonomia Guiada ---
  
  const handleSelectCategory = (name: string) => {
    if (formData.categories.includes(name)) return;
    setFormData(prev => ({ ...prev, categories: [...prev.categories, name] }));
    setShowAddAnotherModal(true);
  };

  const handleRemoveCategory = (name: string) => {
    const newCats = formData.categories.filter(c => c !== name);
    // Limpar subcategorias dependentes
    const validSubs = (SUBCATEGORIES[name] || []).map(s => s.name);
    const newSubs = formData.subcategories.filter(s => !validSubs.includes(s));
    // Limpar especialidades dependentes
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
    const validSpecs = SPECIALTIES[name] || [];
    setFormData(prev => ({ 
      ...prev, 
      subcategories: prev.subcategories.filter(s => s !== name),
      specialties: prev.specialties.filter(s => !validSpecs.includes(s))
    }));
  };

  const handleSelectSpec = (name: string) => {
    if (formData.specialties.includes(name)) return;
    setFormData(prev => ({ ...prev, specialties: [...prev.specialties, name] }));
  };

  const handleRemoveSpec = (name: string) => {
    setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== name) }));
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
        
        {/* IDENTIDADE VISUAL */}
        <section className="space-y-10">
          <div className="flex items-center gap-2 px-1">
            <Camera size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidade Visual</h2>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 bg-white dark:bg-gray-800 shadow-xl ${!formData.logo_url ? 'border-dashed border-red-200' : 'border-white dark:border-gray-900'}`}>
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
                <button type="button" onClick={() => logoInputRef.current?.click()} className="w-10 h-10 bg-[#1E5BFF] text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform"><Pencil size={16} /></button>
                {formData.logo_url && <button type="button" onClick={() => setFormData({...formData, logo_url: ''})} className="w-10 h-10 bg-white dark:bg-gray-800 text-red-500 border border-red-100 dark:border-red-900 rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform"><Trash2 size={16} /></button>}
              </div>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </div>
            <div className="mt-4 text-center space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo da Empresa *</p>
                <div className="text-[9px] text-gray-400 font-medium leading-tight">500x500 px • PNG/JPG<br/>Fundo transparente recomendado</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Banner / Capa da Loja</label>
                <span className="text-[9px] text-gray-400 font-bold uppercase">Opcional</span>
            </div>
            <div className="relative group">
              <div onClick={() => !formData.banner_url && bannerInputRef.current?.click()} className={`w-full aspect-[3/1] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 transition-all relative ${formData.banner_url ? 'border-solid border-transparent' : 'cursor-pointer hover:bg-gray-200'}`}>
                {formData.banner_url ? <img src={formData.banner_url} className="w-full h-full object-cover" alt="Banner" /> : <><PlusCircle size={20} className="text-gray-400" /><span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Adicionar banner de capa</span></>}
              </div>
              {formData.banner_url && (
                <div className="absolute right-3 bottom-3 flex gap-2">
                    <button type="button" onClick={() => bannerInputRef.current?.click()} className="p-2.5 bg-white/90 backdrop-blur-md text-[#1E5BFF] rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform border border-white"><Pencil size={14} /></button>
                    <button type="button" onClick={() => setFormData({...formData, banner_url: ''})} className="p-2.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform border border-white"><Trash2 size={14} /></button>
                </div>
              )}
              <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
            </div>
            <div className="px-1"><p className="text-[9px] text-gray-400 font-medium">1200x400 px • JPG/PNG</p></div>
          </div>
        </section>

        {/* IDENTIFICAÇÃO FISCAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Building2 size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificação Fiscal</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <p className="text-[9px] text-gray-400 font-bold italic mb-2 leading-relaxed">“Esses dados são usados para emissão de nota fiscal e não ficam públicos.”</p>
            <div className="space-y-4">
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Fantasia *</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Razão Social *</label><input value={formData.razao_social} onChange={e => setFormData({...formData, razao_social: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ *</label><input value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Fiscal *</label><input value={formData.email_fiscal} onChange={e => setFormData({...formData, email_fiscal: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Financeiro *</label><input value={formData.whatsapp_financeiro} onChange={e => setFormData({...formData, whatsapp_financeiro: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none text-sm font-bold mt-1" /></div>
            </div>
          </div>
        </section>

        {/* CLASSIFICAÇÃO (REFATORADO) */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <Hash size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classificação</h2>
          </div>

          <div className="space-y-10">
            {/* 1. CATEGORIA */}
            <TaxonomyField 
              label="1. Categorias Principais"
              guideText="Selecione a categoria"
              placeholder="[ Selecione a categoria ▾ ]"
              options={CATEGORIES.map(c => ({ name: c.name, icon: c.icon }))}
              selected={formData.categories}
              onSelect={handleSelectCategory}
              onRemove={handleRemoveCategory}
            />

            {/* 2. SUBCATEGORIA (DINÂMICO POR CATEGORIA) */}
            {formData.categories.map(cat => (
              <TaxonomyField 
                key={`sub-${cat}`}
                label={`2. Subcategoria de ${cat}`}
                guideText="Agora selecione a subcategoria"
                placeholder="[ Selecione a subcategoria ▾ ]"
                options={SUBCATEGORIES[cat] || []}
                selected={formData.subcategories.filter(s => (SUBCATEGORIES[cat] || []).some(opt => opt.name === s))}
                onSelect={handleSelectSub}
                onRemove={handleRemoveSub}
              />
            ))}

            {/* 3. ESPECIALIDADES (DINÂMICO POR SUBCATEGORIA) */}
            {formData.subcategories.map(sub => (
              <TaxonomyField 
                key={`spec-${sub}`}
                label={`3. Especialidades em ${sub}`}
                guideText="Por fim, selecione as especialidades"
                placeholder="[ Selecione as especialidades ▾ ]"
                options={(SPECIALTIES[sub] || SPECIALTIES['default']).map(s => ({ name: s }))}
                selected={formData.specialties.filter(s => (SPECIALTIES[sub] || SPECIALTIES['default']).includes(s))}
                onSelect={handleSelectSpec}
                onRemove={handleRemoveSpec}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        <button onClick={handleSave} disabled={isSaving} className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          SALVAR PERFIL
        </button>
      </div>

      {/* POPUP: ADICIONAR OUTRA CATEGORIA? */}
      {showAddAnotherModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center border border-white/10">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                    <PlusCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-tight mb-2 tracking-tighter">Outra Categoria?</h3>
                <p className="text-xs text-gray-500 mb-8 leading-relaxed font-medium">Sua loja se encaixa em mais de um segmento principal?</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowAddAnotherModal(false)} className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform">Não</button>
                    <button onClick={() => setShowAddAnotherModal(false)} className="flex-1 py-3.5 bg-[#1E5BFF] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">Sim, adicionar</button>
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
