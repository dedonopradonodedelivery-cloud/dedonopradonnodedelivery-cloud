
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  Store as StoreIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Save, 
  Info,
  Clock,
  Globe,
  Instagram,
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
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES, SPECIALTIES } from '../constants';
import { TaxonomyType, TaxonomyStatus } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

const DAYS_OF_WEEK = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
];

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Suggestion Modal State
  const [suggestionModal, setSuggestionModal] = useState<{ isOpen: boolean; type: TaxonomyType; parentId?: string; parentName?: string } | null>(null);
  const [suggestionName, setSuggestionName] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    whatsapp: '',
    phone: '',
    website: '',
    instagram: '',
    logo_url: '',
    banner_url: '',
    categories: [] as string[],
    subcategories: [] as string[],
    specialties: [] as string[],
    description: '',
    notes: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'Rio de Janeiro',
    state: 'RJ',
    is_online_only: false,
  });

  const [hours, setHours] = useState<BusinessHour[]>(
    DAYS_OF_WEEK.map(day => ({ day, open: '09:00', close: '18:00', closed: false }))
  );

  useEffect(() => {
    if (!user) return;

    const fetchStoreData = async () => {
      try {
        const { data, error } = await supabase
          .from('merchants')
          .select('*, merchant_hours(*)')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (data) {
          setFormData({
            ...formData,
            name: data.name || '',
            cnpj: data.cnpj || '',
            email: data.email || '',
            whatsapp: data.whatsapp || '',
            phone: data.phone || '',
            website: data.website || '',
            instagram: data.instagram || '',
            logo_url: data.logo_url || '',
            banner_url: data.banner_url || '',
            categories: data.categories || (data.category ? [data.category] : []),
            subcategories: data.subcategories || [],
            specialties: data.specialties || [],
            description: data.description || '',
            notes: data.notes || '',
            cep: data.cep || '',
            street: data.street || '',
            number: data.number || '',
            complement: data.complement || '',
            neighborhood: data.neighborhood || '',
            is_online_only: data.is_online_only || false,
          });

          if (data.merchant_hours && data.merchant_hours.length > 0) {
            setHours(data.merchant_hours);
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar dados da loja:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.logo_url) {
      alert('A Logo da loja é obrigatória para aparecer no aplicativo.');
      return;
    }

    if (!formData.name || !formData.cnpj || !formData.email || !formData.whatsapp || formData.categories.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios marcados com *');
      return;
    }

    setIsSaving(true);
    try {
      const { error: merchantError } = await supabase
        .from('merchants')
        .upsert({
          owner_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'owner_id' });

      if (merchantError) throw merchantError;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Image Handlers (Simulated) ---
  const handleEditLogo = () => {
    // Em prod: abriria picker de arquivos
    const mockUrl = `https://ui-avatars.com/api/?name=${formData.name || 'Loja'}&background=1E5BFF&color=fff&size=512`;
    setFormData({ ...formData, logo_url: mockUrl });
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo_url: '' });
  };

  const handleEditBanner = () => {
    // Em prod: abriria picker de arquivos
    const mockBanner = `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop`;
    setFormData({ ...formData, banner_url: mockBanner });
  };

  const handleRemoveBanner = () => {
    setFormData({ ...formData, banner_url: '' });
  };

  // --- Taxonomy Handlers ---

  const toggleCategory = (catName: string) => {
    const current = formData.categories;
    if (current.includes(catName)) {
        const newCats = current.filter(c => c !== catName);
        const subsOfRemoved = (SUBCATEGORIES[catName] || []).map(s => s.name);
        const newSubs = formData.subcategories.filter(s => !subsOfRemoved.includes(s));
        const specialtiesToKeep = newSubs.flatMap(s => SPECIALTIES[s] || []);
        const newSpecs = formData.specialties.filter(spec => specialtiesToKeep.includes(spec));
        setFormData({ ...formData, categories: newCats, subcategories: newSubs, specialties: newSpecs });
    } else {
        setFormData({ ...formData, categories: [...current, catName] });
    }
  };

  const toggleSubcategory = (subName: string, catName: string) => {
    const current = formData.subcategories;
    if (current.includes(subName)) {
        const newSubs = current.filter(s => s !== subName);
        const specsOfRemoved = SPECIALTIES[subName] || [];
        const newSpecs = formData.specialties.filter(s => !specsOfRemoved.includes(s));
        setFormData({ ...formData, subcategories: newSubs, specialties: newSpecs });
    } else {
        setFormData({ ...formData, subcategories: [...current, subName] });
    }
  };

  const toggleSpecialty = (spec: string) => {
    const current = formData.specialties;
    if (current.includes(spec)) {
        setFormData({ ...formData, specialties: current.filter(s => s !== spec) });
    } else {
        setFormData({ ...formData, specialties: [...current, spec] });
    }
  };

  const submitSuggestion = async () => {
    if (!suggestionName.trim() || !suggestionModal) return;
    const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
    const suggestions = JSON.parse(saved);
    suggestions.push({
        id: Date.now().toString(),
        type: suggestionModal.type,
        name: suggestionName.trim(),
        parentId: suggestionModal.parentId,
        status: 'pending',
        storeName: formData.name,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('taxonomy_suggestions', JSON.stringify(suggestions));
    alert('Sua sugestão foi enviada para o ADM e está pendente de aprovação.');
    setSuggestionName('');
    setSuggestionModal(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando Perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-48">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil da Loja</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Identidade Visual e Dados</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* 1. IMAGENS DA LOJA (LOGO E BANNER) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Camera size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Imagens da Loja</h2>
          </div>

          <div className="space-y-6">
            {/* SLOT LOGO */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 bg-white dark:bg-gray-800 shadow-xl transition-all ${!formData.logo_url ? 'border-dashed border-red-200 dark:border-red-900/30' : 'border-white dark:border-gray-900'}`}>
                  {formData.logo_url ? (
                    <img src={formData.logo_url} className="w-full h-full object-cover" alt="Logo preview" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1 p-4 text-center">
                      <StoreIcon size={24} />
                      <span className="text-[8px] font-black uppercase leading-tight">Logo Obrigatória</span>
                    </div>
                  )}
                </div>

                {/* Actions Logo */}
                <div className="absolute -right-2 -bottom-2 flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={handleEditLogo}
                      className="w-10 h-10 bg-[#1E5BFF] text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Pencil size={16} />
                    </button>
                    {formData.logo_url && (
                        <button 
                          type="button"
                          onClick={handleRemoveLogo}
                          className="w-10 h-10 bg-white dark:bg-gray-800 text-red-500 rounded-2xl shadow-lg border border-red-50 flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                    )}
                </div>
              </div>
              <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logo da Empresa *</p>
              {!formData.logo_url && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500">
                    <AlertTriangle size={10} />
                    <span className="text-[9px] font-bold uppercase">Logo é obrigatória para aparecer no app</span>
                </div>
              )}
            </div>

            {/* SLOT BANNER */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner / Capa (Opcional)</label>
              <div className="relative group w-full aspect-[3/1] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/80">
                {formData.banner_url ? (
                  <>
                    <img src={formData.banner_url} className="w-full h-full object-cover" alt="Banner preview" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={handleEditBanner}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2"
                  >
                    <PlusCircle size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Adicionar Banner de Capa</span>
                  </button>
                )}

                {/* Actions Banner */}
                {formData.banner_url && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      type="button"
                      onClick={handleEditBanner}
                      className="p-2.5 bg-white/90 backdrop-blur-md text-gray-900 rounded-xl shadow-md active:scale-90 transition-transform"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      type="button"
                      onClick={handleRemoveBanner}
                      className="p-2.5 bg-red-500 text-white rounded-xl shadow-md active:scale-90 transition-transform"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[9px] text-gray-400 font-medium leading-relaxed italic ml-1">
                "O banner aparece no topo do seu perfil público, gerando mais desejo de compra."
              </p>
            </div>
          </div>
        </section>

        {/* 2. DADOS PRINCIPAIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Info size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Identificação *</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Fantasia *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ *</label>
                <input required value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="00.000.000/0001-00" />
              </div>
          </div>
        </section>

        {/* 3. TAXONOMIA GUIADA */}
        <section className="space-y-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Hash size={16} /></div>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Classificação</h2>
            </div>
          </div>

          <div className="space-y-10">
            {/* CATEGORIAS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">1. Categorias Principais *</label>
                <button 
                  type="button" 
                  onClick={() => setSuggestionModal({ isOpen: true, type: 'category' })}
                  className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg"
                >
                  <Plus size={10} /> Sugerir nova
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`p-3.5 rounded-2xl border text-[11px] font-bold transition-all flex items-center gap-3 ${
                      formData.categories.includes(cat.name)
                        ? 'bg-[#1E5BFF] text-white border-transparent shadow-lg shadow-blue-500/20'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    {React.cloneElement(cat.icon as any, { size: 16 })}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBCATEGORIAS */}
            {formData.categories.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">2. Subcategorias por Segmento *</label>
                <div className="space-y-6">
                    {formData.categories.map(catName => (
                        <div key={catName} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center justify-between mb-3 border-b border-gray-50 dark:border-gray-800 pb-2">
                                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.15em]">{catName}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setSuggestionModal({ isOpen: true, type: 'subcategory', parentId: catName, parentName: catName })}
                                  className="p-1 text-gray-300 hover:text-blue-500"
                                >
                                  <Plus size={14} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(SUBCATEGORIES[catName] || []).map(sub => (
                                    <button
                                        key={sub.name}
                                        type="button"
                                        onClick={() => toggleSubcategory(sub.name, catName)}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                            formData.subcategories.includes(sub.name)
                                                ? 'bg-blue-500 text-white border-transparent'
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent'
                                        }`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* ESPECIALIDADES */}
            {formData.subcategories.length > 0 && (
               <div className="animate-in fade-in slide-in-from-top-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">3. Especialidades Técnicas</label>
                 <div className="space-y-5">
                    {formData.subcategories.map(subName => (
                        <div key={subName} className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-800">
                             <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{subName}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setSuggestionModal({ isOpen: true, type: 'specialty', parentId: subName, parentName: subName })}
                                  className="text-[9px] font-bold text-gray-400 flex items-center gap-1"
                                >
                                  <Plus size={10} /> Sugerir
                                </button>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {(SPECIALTIES[subName] || SPECIALTIES['default']).map(spec => (
                                    <button
                                        key={spec}
                                        type="button"
                                        onClick={() => toggleSpecialty(spec)}
                                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition-all border ${
                                            formData.specialties.includes(spec)
                                                ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] border-[#1E5BFF] shadow-sm'
                                                : 'bg-transparent text-gray-400 border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        {spec}
                                    </button>
                                ))}
                             </div>
                        </div>
                    ))}
                 </div>
               </div>
            )}
          </div>
        </section>

        {/* 4. CONTATO OFICIAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Phone size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contato Oficial</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de Vendas *</label>
                <input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="(21) 99999-9999" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instagram</label>
                <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="@sua.loja" />
              </div>
          </div>
        </section>

      </form>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        {showSuccess && (
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm mb-4 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-5 h-5" /> Perfil atualizado com sucesso!
            </div>
        )}
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          SALVAR PERFIL DA LOJA
        </button>
      </div>

      {/* SUGGESTION MODAL */}
      {suggestionModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Sugerir Nova Opção</h3>
                    <button onClick={() => setSuggestionModal(null)}><X size={24} /></button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl mb-6 flex gap-3">
                    <HelpCircle size={18} className="text-blue-600 shrink-0 mt-1" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        Sua sugestão será analisada pelo ADM antes de ficar disponível para seleção.
                    </p>
                </div>

                <div className="space-y-5">
                    {suggestionModal.parentName && (
                        <div className="px-1">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vincular a: {suggestionModal.parentName}</span>
                        </div>
                    )}
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Nome sugerido</label>
                        <input 
                            autoFocus
                            value={suggestionName}
                            onChange={(e) => setSuggestionName(e.target.value)}
                            placeholder={`Ex: ${suggestionModal.type === 'category' ? 'Automóveis' : 'Pintor Predial'}`}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white text-sm font-bold"
                        />
                    </div>
                    <button 
                        onClick={submitSuggestion}
                        disabled={!suggestionName.trim()}
                        className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                        ENVIAR SUGESTÃO
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
