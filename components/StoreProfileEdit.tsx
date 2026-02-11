
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
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
  CheckCircle2,
  Send,
  AlertCircle,
  MapPin,
  Smartphone,
  Mail,
  Info,
  Globe,
  Image as ImageIcon,
  Eye,
  Clock,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Lock,
  Tag,
  ShoppingBag,
  Plus
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES, ALL_TAGS } from '../constants';
import { TaxonomyType, BusinessHour, TaxonomySuggestion } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

const WEEK_DAYS = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quinta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

// --- Componente Auxiliar de Input ---
const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helperText?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  error?: string;
}> = ({ label, value, onChange, placeholder, type = "text", required, helperText, icon: Icon, disabled, error }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#1E5BFF]'}`} />}
      <input 
        type={type}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-50 dark:bg-gray-900 border rounded-2xl p-4 text-sm font-bold dark:text-white outline-none transition-all ${Icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-100 dark:border-gray-800 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5'}`}
      />
    </div>
    {error ? (
        <p className="text-[10px] text-red-500 font-bold ml-1 animate-in slide-in-from-top-1">{error}</p>
    ) : helperText ? (
        <p className="text-[9px] text-gray-400 italic ml-1 leading-none">{helperText}</p>
    ) : null}
  </div>
);

// --- Componente de Classificação ---
interface TaxonomyFieldProps {
  label: string;
  placeholder: string;
  options: { name: string; icon?: React.ReactNode }[];
  selected: string;
  onSelect: (name: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const TaxonomyField: React.FC<TaxonomyFieldProps> = ({ label, placeholder, options, selected, onSelect, required, disabled }) => {
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
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button 
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between text-sm font-bold transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
        >
          {selected || placeholder}
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2">
            <div className="p-3 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2 bg-gray-50/50">
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
              {filtered.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { 
                      onSelect(opt.name); 
                      setIsOpen(false); 
                  }}
                  className="w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <div className="flex items-center gap-3">
                    {opt.icon && <span className="opacity-70">{opt.icon}</span>}
                    {opt.name}
                  </div>
                  {selected === opt.name && <Check size={16} className="text-[#1E5BFF]" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TagSelector: React.FC<{
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}> = ({ selectedTags, onChange }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, ' ');

  const availableTags = ALL_TAGS.filter(tag => 
    !selectedTags.some(st => normalize(st) === normalize(tag)) && 
    tag.toLowerCase().includes(input.toLowerCase())
  );

  const normalizedInput = useMemo(() => normalize(input), [input]);
  const isValidNewTag = normalizedInput.length >= 2 && normalizedInput.length <= 30;
  
  const hasExactMatch = useMemo(() => {
    return availableTags.some(t => normalize(t) === normalizedInput) || 
           selectedTags.some(t => normalize(t) === normalizedInput);
  }, [availableTags, selectedTags, normalizedInput]);

  const handleAddTag = (tag: string) => {
    if (selectedTags.length >= 15) return;
    const finalTag = tag.trim().replace(/\s+/g, ' '); 
    if (!selectedTags.some(st => normalize(st) === normalize(finalTag))) {
        onChange([...selectedTags, finalTag]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isValidNewTag && !hasExactMatch && selectedTags.length < 15) {
        handleAddTag(input);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        Produtos / Serviços (TAGS) <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-2 flex flex-wrap gap-2 min-h-[56px] focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500 transition-all">
          {selectedTags.map(tag => (
            <span key={tag} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100 dark:border-gray-700 flex items-center gap-1.5 shadow-sm">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
            </span>
          ))}
          <input 
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length < 15 ? "Digite para adicionar..." : "Limite atingido"}
            className="flex-1 bg-transparent border-none outline-none text-sm font-bold p-2 min-w-[120px] dark:text-white"
            disabled={selectedTags.length >= 15}
          />
        </div>
        
        {showSuggestions && (input.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto no-scrollbar py-2">
            {isValidNewTag && !hasExactMatch && selectedTags.length < 15 && (
                <button
                  type="button"
                  onClick={() => handleAddTag(input)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 bg-blue-50/30 hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-50 dark:border-gray-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                    <Plus size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Adicionar tag: "{input.trim()}"</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Nova palavra-chave</p>
                  </div>
                </button>
            )}

            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <Tag size={14} />
                </div>
                {tag}
              </button>
            ))}
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
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [availableCategories, setAvailableCategories] = useState(CATEGORIES.map(c => ({ name: c.name })));
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome_exibido: '',
    category: '',
    subcategory: '',
    bairro: '',
    description: '',
    whatsapp_publico: '',
    logo_url: '',
    banner_url: '',
    tags: [] as string[],
    accepts_online_orders: false,
    min_order_value: '',
  });

  useEffect(() => {
    const loadTaxonomies = () => {
        const savedApproved = localStorage.getItem('approved_taxonomy');
        if (savedApproved) {
            const approved = JSON.parse(savedApproved);
            const extraCats = approved.filter((a: any) => a.type === 'category').map((a: any) => ({ name: a.name }));
            setAvailableCategories([...CATEGORIES.map(c => ({ name: c.name })), ...extraCats]);
        }
    };
    loadTaxonomies();
  }, []);

  useEffect(() => {
    if (!formData.category) {
        setAvailableSubcategories([]);
        return;
    }
    const constSubs = SUBCATEGORIES[formData.category] || [];
    setAvailableSubcategories(constSubs);
  }, [formData.category]);

  useEffect(() => {
    if (!user) return;
    const fetchStoreData = async () => {
      try {
        const { data } = await supabase.from('merchants').select('*').eq('owner_id', user.id).maybeSingle();
        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data,
            tags: data.tags || []
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    setErrors({});
    
    // REGRA DE VALIDAÇÃO: Apenas Nome da Loja é obrigatório
    if (!formData.nome_exibido.trim()) {
      setErrors({ nome_exibido: 'O nome da loja é obrigatório para identificação no bairro.' });
      const el = document.getElementById('nome_exibido_field');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSaving(true);
    try {
      // 1. Salvar na tabela de merchants
      const { error: dbError } = await supabase.from('merchants').upsert({
        owner_id: user?.id,
        ...formData,
        min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'owner_id' });
      
      if (dbError) throw dbError;
      
      // 2. Sincronizar com os metadados de autenticação para atualizar o Header instantaneamente
      await supabase.auth.updateUser({
          data: { store_name: formData.nome_exibido.trim() }
      });
      
      // 3. Feedback visual moderno
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) { 
      console.error(err);
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, [target]: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300 relative">
      
      {/* TOAST DE SUCESSO MODERNO */}
      {showSuccessToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[3000] animate-in slide-in-from-top-4 duration-500">
            <div className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" strokeWidth={4} />
                </div>
                <span className="text-sm font-bold tracking-tight">Loja atualizada com sucesso</span>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Configurar Loja</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none mt-0.5">Gestão do Perfil</p>
        </div>
        <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-90 transition-all flex items-center justify-center min-w-[50px]"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* BLOCO 1: INFORMAÇÕES DA LOJA */}
        <section className="space-y-6" id="nome_exibido_field">
          <div className="flex items-center gap-2 px-1">
            <StoreIcon size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">1. Identificação</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden transition-colors hover:border-blue-300">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-gray-300" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900 active:scale-90 transition-transform"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4">Logotipo da Empresa</p>
             </div>

             <FormField 
                label="Nome da Loja *" 
                value={formData.nome_exibido} 
                onChange={v => setFormData({...formData, nome_exibido: v})} 
                required 
                placeholder="Ex: Padaria do Zé" 
                error={errors.nome_exibido}
             />
             
             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Curta (Opcional)</label>
                <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Conte um pouco sobre o que sua loja oferece..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none min-h-[100px]"
                />
             </div>

             <FormField label="WhatsApp Público" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
          </div>
        </section>

        {/* BLOCO 2: CATEGORIAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <ShoppingBag size={16} className="text-blue-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">2. Segmento</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
             <TaxonomyField 
                label="Categoria" 
                placeholder="Selecione..." 
                options={availableCategories} 
                selected={formData.category} 
                onSelect={v => setFormData({...formData, category: v, subcategory: ''})} 
             />
             
             <TaxonomyField 
                label="Subcategoria" 
                placeholder="Selecione..." 
                options={availableSubcategories} 
                selected={formData.subcategory} 
                onSelect={v => setFormData({...formData, subcategory: v})} 
                disabled={!formData.category}
             />

             <TagSelector 
                selectedTags={formData.tags || []} 
                onChange={(tags) => setFormData({...formData, tags})} 
             />
          </div>
        </section>

      </div>

      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />

      <footer className="fixed bottom-[85px] left-0 right-0 p-5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Salvar Alterações</>}
          </button>
      </footer>
    </div>
  );
};
