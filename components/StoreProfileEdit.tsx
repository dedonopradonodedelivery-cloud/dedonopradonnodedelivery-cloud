
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
  Plus,
  FileText
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

const TAX_REGIMES = ['Simples Nacional', 'MEI', 'Lucro Presumido', 'Lucro Real', 'Pessoa Física'];

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
}> = ({ label, value, onChange, placeholder, type = "text", required, helperText, icon: Icon, disabled }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1E5BFF]" />}
      <input 
        type={type}
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all ${Icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
    {helperText && <p className="text-[9px] text-gray-400 italic ml-1 leading-none">{helperText}</p>}
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
          className={`w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between text-sm font-bold shadow-sm transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
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

// --- COMPONENTE DE TAGS ---
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
        <div className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 flex flex-wrap gap-2 min-h-[56px] focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:border-blue-500 shadow-sm transition-all">
          {selectedTags.map(tag => (
            <span key={tag} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100 dark:border-gray-600 flex items-center gap-1.5 shadow-sm">
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

            {availableTags.length === 0 && !isValidNewTag && !hasExactMatch && (
                <div className="px-4 py-6 text-center opacity-40">
                    <p className="text-xs font-bold uppercase">Nenhum resultado</p>
                </div>
            )}
          </div>
        )}
      </div>
      <p className="text-[9px] text-gray-400 font-bold uppercase ml-1 tracking-widest">
        {selectedTags.length}/15 Tags. Use termos como "pizzaria", "tênis", "oficina".
      </p>
    </div>
  );
};

// --- MODAL DE CRIAÇÃO DE TAXONOMIA ---
const CreateTaxonomyModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    type: 'category' | 'subcategory';
    parentName?: string;
    storeName: string;
    onSuccess: () => void;
    userId: string;
}> = ({ isOpen, onClose, type, parentName, storeName, onSuccess, userId }) => {
    const [name, setName] = useState('');
    const [justification, setJustification] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSubmitting(true);

        try {
            const saved = localStorage.getItem('taxonomy_suggestions') || '[]';
            const suggestions: TaxonomySuggestion[] = JSON.parse(saved);
            const exists = suggestions.find(s => s.type === type && s.name.toLowerCase() === name.toLowerCase());

            if (exists) {
                alert('Já existe uma solicitação para este nome.');
                setIsSubmitting(false);
                return;
            }

            const newSuggestion: TaxonomySuggestion = {
                id: `sug-${Date.now()}`,
                type,
                name: name.trim(),
                parentName,
                justification,
                status: 'pending',
                storeName,
                merchantId: userId,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('taxonomy_suggestions', JSON.stringify([...suggestions, newSuggestion]));
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">Nova {type === 'category' ? 'Categoria' : 'Subcategoria'}</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'subcategory' && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoria Pai</p>
                             <p className="font-bold text-gray-900 dark:text-white">{parentName}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome sugerido</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 outline-none mt-1 font-medium dark:text-white" placeholder={`Ex: ${type === 'category' ? 'Automóveis' : 'Pneus'}`} autoFocus />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição curta (Opcional)</label>
                        <textarea value={justification} onChange={e => setJustification(e.target.value)} rows={3} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 outline-none mt-1 text-sm dark:text-white resize-none" placeholder="Breve descrição..." />
                    </div>
                    <button type="submit" disabled={isSubmitting || !name} className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enviar para aprovação'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'category' | 'subcategory'>('category');
  const [pendingTaxonomyMsg, setPendingTaxonomyMsg] = useState<string | null>(null);

  const [availableCategories, setAvailableCategories] = useState(CATEGORIES.map(c => ({ name: c.name })));
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // --- DADOS PÚBLICOS ---
    nome_exibido: '',
    category: '',
    subcategory: '',
    bairro: '',
    description: '',
    whatsapp_publico: '',
    telefone_fixo_publico: '',
    instagram: '',
    email_publico: '',
    logo_url: '',
    banner_url: '',
    gallery: [] as string[],
    tags: [] as string[],

    // --- ENDEREÇO UNIDADE ---
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    is_delivery_only: false,
    
    // --- CONFIGURAÇÕES ADICIONAIS ---
    accepts_online_orders: false,
    min_order_value: '',

    // --- HORÁRIOS ---
    business_hours: WEEK_DAYS.reduce((acc, day) => ({ 
      ...acc, 
      [day.key]: { open: true, start: '09:00', end: '18:00' } 
    }), {} as Record<string, BusinessHour>),
    hours_observations: '',

    // --- DADOS FISCAIS ---
    razao_social: '',
    nome_fantasia_fiscal: '',
    cnpj: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    tax_regime: 'Simples Nacional',
    fiscal_address: '',
    billing_email: '',
    legal_representative: '',
    legal_rep_cpf: '',

    // --- ADMINISTRATIVO ---
    is_active: true,
    account_type: 'Grátis',
    registration_date: new Date().toLocaleDateString('pt-BR'),
  });

  useEffect(() => {
    const loadTaxonomies = () => {
        const savedApproved = localStorage.getItem('approved_taxonomy');
        if (savedApproved) {
            const approved = JSON.parse(savedApproved);
            const extraCats = approved.filter((a: any) => a.type === 'category').map((a: any) => ({ name: a.name }));
            setAvailableCategories([...CATEGORIES.map(c => ({ name: c.name })), ...extraCats]);
        }

        if (user) {
            const savedSuggestions = localStorage.getItem('taxonomy_suggestions');
            if (savedSuggestions) {
                const suggestions: TaxonomySuggestion[] = JSON.parse(savedSuggestions);
                const myPending = suggestions.filter(s => s.merchantId === user.id && s.status === 'pending');
                if (myPending.length > 0) {
                    setPendingTaxonomyMsg(`Você tem ${myPending.length} sugestão(ões) de categoria aguardando aprovação.`);
                }
            }
        }
    };
    loadTaxonomies();
    window.addEventListener('storage', loadTaxonomies);
    return () => window.removeEventListener('storage', loadTaxonomies);
  }, [user]);

  useEffect(() => {
    if (!formData.category) {
        setAvailableSubcategories([]);
        return;
    }
    const constSubs = SUBCATEGORIES[formData.category] || [];
    const saved = localStorage.getItem('approved_taxonomy');
    let extraSubs: any[] = [];
    if (saved) {
        const approved = JSON.parse(saved);
        extraSubs = approved
            .filter((a: any) => a.type === 'subcategory' && a.parentName === formData.category)
            .map((a: any) => ({ name: a.name }));
    }
    setAvailableSubcategories([...constSubs, ...extraSubs]);
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
            business_hours: data.business_hours || prev.business_hours,
            accepts_online_orders: data.accepts_online_orders ?? false,
            min_order_value: data.min_order_value ? String(data.min_order_value) : '',
            tags: data.tags || []
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    if (!formData.nome_exibido) { alert('Informe o nome da loja.'); return; }
    if (!formData.description) { alert('Informe uma descrição curta.'); return; }
    if (!formData.whatsapp_publico) { alert('Informe o telefone/WhatsApp.'); return; }
    if (!formData.bairro) { alert('Informe o endereço/bairro.'); return; }
    if (!formData.category) { alert('Selecione uma categoria.'); return; }
    if (!formData.subcategory) { alert('Selecione uma subcategoria.'); return; }
    if (!formData.tags || formData.tags.length === 0) { alert('Adicione pelo menos uma tag de produto ou serviço.'); return; }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').upsert({
        owner_id: user?.id,
        ...formData,
        min_order_value: formData.min_order_value ? parseFloat(formData.min_order_value) : null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'owner_id' });
      
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { 
      console.error(err);
      alert('Erro ao salvar alterações.'); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, [target]: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleCreateTaxonomy = (type: 'category' | 'subcategory') => {
      setCreateType(type);
      setShowCreateModal(true);
  };

  const onSuggestionSuccess = () => {
      setPendingTaxonomyMsg("Sua sugestão foi enviada e está aguardando aprovação.");
      setTimeout(() => setPendingTaxonomyMsg(null), 5000);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Configurar Loja</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none mt-0.5">Gestão do Perfil</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-90 transition-all">
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* BLOCO 1: INFORMAÇÕES DA LOJA */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <StoreIcon size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">1. Informações da Loja (Perfil Público)</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shadow-inner">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-gray-300" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4">Logotipo</p>
             </div>

             <FormField label="Nome da Loja *" value={formData.nome_exibido} onChange={v => setFormData({...formData, nome_exibido: v})} required placeholder="Ex: Padaria Central" />
             
             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Curta *</label>
                <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Conte um pouco sobre sua loja..."
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all resize-none min-h-[100px]"
                />
             </div>

             <FormField label="Telefone / WhatsApp *" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
             
             <div className="space-y-1.5">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Endereço Público *</label>
                 <div className="space-y-3">
                     <input value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} placeholder="CEP" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all" />
                     <div className="grid grid-cols-4 gap-3">
                        <input value={formData.rua} onChange={e => setFormData({...formData, rua: e.target.value})} placeholder="Rua" className="col-span-3 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all" />
                        <input value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Nº" className="col-span-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all" />
                     </div>
                     <input value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} placeholder="Bairro" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all" />
                 </div>
             </div>
          </div>
        </section>

        {/* BLOCO 2: RAMO DO NEGÓCIO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <ShoppingBag size={16} className="text-blue-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">2. Ramo do Negócio</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
             
             {pendingTaxonomyMsg && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
                    <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-bold leading-relaxed">{pendingTaxonomyMsg}</p>
                </div>
             )}

             <TaxonomyField 
                label="Categoria Principal *" 
                placeholder="Selecione..." 
                options={availableCategories} 
                selected={formData.category} 
                onSelect={v => setFormData({...formData, category: v, subcategory: ''})} 
             />
             
             <TaxonomyField 
                label="Subcategoria *" 
                placeholder="Selecione..." 
                options={availableSubcategories} 
                selected={formData.subcategory} 
                onSelect={v => setFormData({...formData, subcategory: v})} 
                disabled={!formData.category}
             />

             <button 
                onClick={() => handleCreateTaxonomy(formData.category ? 'subcategory' : 'category')}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
             >
                <PlusCircle size={16} /> Não encontrou? Sugerir nova categoria
             </button>
          </div>
        </section>

        {/* BLOCO 3: PRODUTOS E SERVIÇOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Tag size={16} className="text-emerald-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">3. Produtos e Serviços</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <TagSelector 
                selectedTags={formData.tags || []} 
                onChange={(tags) => setFormData({...formData, tags})} 
             />

             <div onClick={() => setFormData({...formData, accepts_online_orders: !formData.accepts_online_orders})} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm">
                 <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Aceita Pedidos Online?</span>
                 <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.accepts_online_orders ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${formData.accepts_online_orders ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </div>
             </div>

             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor de Pedido Mínimo</label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                    <input 
                        type="number"
                        value={formData.min_order_value}
                        onChange={e => setFormData({...formData, min_order_value: e.target.value})}
                        placeholder="0,00"
                        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pl-10 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all"
                    />
                </div>
             </div>
          </div>
        </section>

        {/* BLOCO 4: DADOS PARA EMISSÃO DE NOTA FISCAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <FileText size={16} className="text-purple-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">4. Dados para Emissão de Nota Fiscal</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <FormField label="Razão Social" value={formData.razao_social} onChange={v => setFormData({...formData, razao_social: v})} placeholder="Nome jurídico da empresa" />
             <FormField label="Nome Fantasia" value={formData.nome_fantasia_fiscal} onChange={v => setFormData({...formData, nome_fantasia_fiscal: v})} placeholder="Nome comercial" />
             <FormField label="CNPJ" value={formData.cnpj} onChange={v => setFormData({...formData, cnpj: v})} placeholder="00.000.000/0000-00" />
             
             <div className="grid grid-cols-2 gap-4">
                <FormField label="Insc. Estadual" value={formData.inscricao_estadual} onChange={v => setFormData({...formData, inscricao_estadual: v})} placeholder="Isento ou Nº" />
                <FormField label="Insc. Municipal" value={formData.inscricao_municipal} onChange={v => setFormData({...formData, inscricao_municipal: v})} placeholder="Nº de cadastro" />
             </div>

             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Regime Tributário</label>
                <select 
                    value={formData.tax_regime}
                    onChange={e => setFormData({...formData, tax_regime: e.target.value})}
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all"
                >
                    {TAX_REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
             </div>

             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Endereço Fiscal Completo</label>
                <textarea 
                    value={formData.fiscal_address} 
                    onChange={e => setFormData({...formData, fiscal_address: e.target.value})} 
                    placeholder="Rua, Nº, Bairro, Cidade, Estado, CEP"
                    className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all resize-none min-h-[80px]"
                />
             </div>

             <FormField label="E-mail para Nota Fiscal" value={formData.billing_email} onChange={v => setFormData({...formData, billing_email: v})} icon={Mail} placeholder="financeiro@sualoja.com" />
          </div>
        </section>

      </div>

      {/* INPUTS OCULTOS P/ UPLOAD */}
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'banner_url')} />

      {/* FEEDBACK SUCESSO */}
      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Loja Atualizada!</span>
        </div>
      )}

      {showCreateModal && user && (
          <CreateTaxonomyModal 
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              type={createType}
              parentName={createType === 'subcategory' ? formData.category : undefined}
              storeName={formData.nome_exibido || 'Loja'}
              userId={user.id}
              onSuccess={onSuggestionSuccess}
          />
      )}
    </div>
  );
};
