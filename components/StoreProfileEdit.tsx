
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
  Tag
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES } from '../constants';
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
        className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 transition-all ${Icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
  allowCreate?: boolean;
  onCreate?: () => void;
  disabled?: boolean;
}

const TaxonomyField: React.FC<TaxonomyFieldProps> = ({ label, placeholder, options, selected, onSelect, required, allowCreate, onCreate, disabled }) => {
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
  const finalOptions = [...filtered];
  if (allowCreate && onCreate) {
      finalOptions.push({ name: '+ Criar nova opção', icon: <PlusCircle size={14} className="text-[#1E5BFF]" /> });
  }

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
              {finalOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { 
                      if (opt.name === '+ Criar nova opção' && onCreate) {
                          onCreate();
                      } else {
                          onSelect(opt.name); 
                      }
                      setIsOpen(false); 
                  }}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${opt.name === '+ Criar nova opção' ? 'text-[#1E5BFF] font-bold border-t border-gray-50 dark:border-gray-800' : 'text-gray-600 dark:text-gray-300'}`}
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
            // Verificar duplicidade no localStorage
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
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 outline-none mt-1 font-medium dark:text-white" placeholder={`Ex: ${type === 'category' ? 'Automóveis' : 'Pneus'}`} autoFocus />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição curta (Opcional)</label>
                        <textarea value={justification} onChange={e => setJustification(e.target.value)} rows={3} className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 outline-none mt-1 text-sm dark:text-white resize-none" placeholder="Breve descrição..." />
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
  
  // Estados de criação de taxonomia
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'category' | 'subcategory'>('category');
  const [pendingTaxonomyMsg, setPendingTaxonomyMsg] = useState<string | null>(null);

  // Combinação de constantes e aprovados
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

    // --- ENDEREÇO UNIDADE ---
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    is_delivery_only: false,

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

  // Carregar taxonomias aprovadas do localStorage
  useEffect(() => {
    const loadTaxonomies = () => {
        const saved = localStorage.getItem('approved_taxonomy');
        if (saved) {
            const approved = JSON.parse(saved);
            // Mesclar categorias
            const extraCats = approved.filter((a: any) => a.type === 'category').map((a: any) => ({ name: a.name }));
            setAvailableCategories([...CATEGORIES.map(c => ({ name: c.name })), ...extraCats]);
        }
    };
    loadTaxonomies();
    window.addEventListener('storage', loadTaxonomies);
    return () => window.removeEventListener('storage', loadTaxonomies);
  }, []);

  // Atualizar subcategorias ao mudar categoria
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
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    if (!formData.nome_exibido || !formData.category || !formData.subcategory || !formData.bairro) {
      alert("Por favor, preencha os campos obrigatórios da seção Dados Públicos.");
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

  const handleHourChange = (day: string, field: keyof BusinessHour, value: any) => {
    setFormData({
      ...formData,
      business_hours: {
        ...formData.business_hours,
        [day]: {
          ...formData.business_hours[day],
          [field]: value
        }
      }
    });
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
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Minha Loja</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none mt-0.5">Gestão do Perfil</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-90 transition-all">
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* BLOCO 1: DADOS PÚBLICOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Eye size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">1. Dados Públicos (Visíveis no App)</h2>
          </div>

          {/* Logo e Capa */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-gray-300" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4">Logotipo da Loja</p>
             </div>

             <FormField label="Nome da Loja *" value={formData.nome_exibido} onChange={v => setFormData({...formData, nome_exibido: v})} required placeholder="Ex: Padaria Central" />
             
             {pendingTaxonomyMsg && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-100 dark:border-yellow-800 flex items-center gap-2 animate-in fade-in">
                    <Clock size={16} className="text-yellow-600" />
                    <p className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400 leading-tight">{pendingTaxonomyMsg}</p>
                </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <TaxonomyField 
                    label="Categoria Principal *" 
                    placeholder="Selecione..." 
                    options={availableCategories} 
                    selected={formData.category} 
                    onSelect={v => setFormData({...formData, category: v, subcategory: ''})} 
                    allowCreate
                    onCreate={() => handleCreateTaxonomy('category')}
                />
                <TaxonomyField 
                    label="Subcategoria *" 
                    placeholder="Selecione..." 
                    options={availableSubcategories} 
                    selected={formData.subcategory} 
                    onSelect={v => setFormData({...formData, subcategory: v})} 
                    disabled={!formData.category}
                    allowCreate={!!formData.category}
                    onCreate={() => handleCreateTaxonomy('subcategory')}
                />
             </div>

             <FormField label="Bairro *" value={formData.bairro} onChange={v => setFormData({...formData, bairro: v})} required placeholder="Ex: Freguesia" />
             
             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição da Loja *</label>
                <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Conte um pouco sobre sua loja para os clientes..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none min-h-[100px]"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <FormField label="WhatsApp *" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
                <FormField label="Telefone Fixo" value={formData.telefone_fixo_publico} onChange={v => setFormData({...formData, telefone_fixo_publico: v})} placeholder="(21) 2222-0000" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <FormField label="Instagram" value={formData.instagram} onChange={v => setFormData({...formData, instagram: v})} icon={Globe} placeholder="@sualoja" />
                <FormField label="E-mail Público" value={formData.email_publico} onChange={v => setFormData({...formData, email_publico: v})} icon={Mail} placeholder="contato@loja.com" />
             </div>
          </div>
        </section>

        {/* BLOCO 2: ENDEREÇO DA UNIDADE */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <MapPin size={16} className="text-red-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">2. Endereço da Unidade</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
             <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl cursor-pointer" onClick={() => setFormData({...formData, is_delivery_only: !formData.is_delivery_only})}>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${formData.is_delivery_only ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'bg-white border-gray-200'}`}>
                    {formData.is_delivery_only && <Check size={16} className="text-white" />}
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Atendo somente online / delivery</span>
             </div>
             
             {!formData.is_delivery_only && (
                <div className="space-y-4 pt-2">
                    <FormField label="CEP" value={formData.cep} onChange={v => setFormData({...formData, cep: v})} placeholder="00000-000" />
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3"><FormField label="Rua / Logradouro" value={formData.rua} onChange={v => setFormData({...formData, rua: v})} /></div>
                        <div className="col-span-1"><FormField label="Nº" value={formData.numero} onChange={v => setFormData({...formData, numero: v})} /></div>
                    </div>
                    <FormField label="Complemento" value={formData.complemento} onChange={v => setFormData({...formData, complemento: v})} placeholder="Ex: Loja B / Próximo ao mercado" />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Cidade" value={formData.cidade} onChange={v => setFormData({...formData, cidade: v})} disabled />
                        <FormField label="Estado" value={formData.estado} onChange={v => setFormData({...formData, estado: v})} disabled />
                    </div>
                </div>
             )}
          </div>
        </section>

        {/* BLOCO 3: HORÁRIO DE FUNCIONAMENTO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Clock size={16} className="text-emerald-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">3. Horário de Funcionamento</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              {WEEK_DAYS.map((day) => (
                <div key={day.key} className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{day.label}</span>
                    <button 
                        type="button"
                        onClick={() => handleHourChange(day.key, 'open', !formData.business_hours[day.key].open)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.business_hours[day.key].open ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.business_hours[day.key].open ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                  {formData.business_hours[day.key].open && (
                    <div className="flex items-center gap-3 animate-in fade-in">
                      <input type="time" value={formData.business_hours[day.key].start} onChange={e => handleHourChange(day.key, 'start', e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-xs font-bold dark:text-white" />
                      <span className="text-gray-300 text-xs font-bold">até</span>
                      <input type="time" value={formData.business_hours[day.key].end} onChange={e => handleHourChange(day.key, 'end', e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-xs font-bold dark:text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                 <FormField label="Observações (ex: Feriados)" value={formData.hours_observations} onChange={v => setFormData({...formData, hours_observations: v})} placeholder="Ex: Fechamos em feriados nacionais" />
              </div>
          </div>
        </section>

        {/* BLOCO 4: DADOS FISCAIS (CONFIDENCIAL) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Lock size={16} className="text-amber-500" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">4. Dados Fiscais (Confidencial)</h2>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-3 mb-4">
              <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase leading-tight">Estes dados não são exibidos no app e servem apenas para emissão de Notas Fiscais.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
             <FormField label="Razão Social *" value={formData.razao_social} onChange={v => setFormData({...formData, razao_social: v})} placeholder="Nome completo registrado" />
             <FormField label="Nome Fantasia Fiscal" value={formData.nome_fantasia_fiscal} onChange={v => setFormData({...formData, nome_fantasia_fiscal: v})} placeholder="Nome comercial" />
             <FormField label="CNPJ *" value={formData.cnpj} onChange={v => setFormData({...formData, cnpj: v})} placeholder="00.000.000/0001-00" />
             
             <div className="grid grid-cols-2 gap-4">
                <FormField label="Insc. Estadual" value={formData.inscricao_estadual} onChange={v => setFormData({...formData, inscricao_estadual: v})} />
                <FormField label="Insc. Municipal" value={formData.inscricao_municipal} onChange={v => setFormData({...formData, inscricao_municipal: v})} />
             </div>

             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Regime Tributário *</label>
                <select 
                    value={formData.tax_regime}
                    onChange={e => setFormData({...formData, tax_regime: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none"
                >
                    {TAX_REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
             </div>

             <FormField label="Endereço Fiscal (se diferente)" value={formData.fiscal_address} onChange={v => setFormData({...formData, fiscal_address: v})} placeholder="Rua, Número, Bairro..." />
             <FormField label="E-mail p/ Recebimento de Notas *" value={formData.billing_email} onChange={v => setFormData({...formData, billing_email: v})} icon={Mail} placeholder="financeiro@loja.com" />
             
             <div className="pt-4 border-t border-gray-50 dark:border-gray-800 space-y-5">
                <FormField label="Responsável Legal *" value={formData.legal_representative} onChange={v => setFormData({...formData, legal_representative: v})} placeholder="Nome do sócio administrador" />
                <FormField label="CPF do Responsável *" value={formData.legal_rep_cpf} onChange={v => setFormData({...formData, legal_rep_cpf: v})} placeholder="000.000.000-00" />
             </div>
          </div>
        </section>

        {/* BLOCO 5: INFORMAÇÕES ADMINISTRATIVAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck size={16} className="text-gray-400" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">5. Informações Administrativas</h2>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
             <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Status da Loja:</span>
                <span className={`font-black uppercase tracking-widest ${formData.is_active ? 'text-emerald-500' : 'text-red-500'}`}>
                    {formData.is_active ? 'Ativa' : 'Inativa'}
                </span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Tipo de Conta:</span>
                <span className="font-black text-[#1E5BFF] uppercase tracking-widest">{formData.account_type}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Data de Cadastro:</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">{formData.registration_date}</span>
             </div>
          </div>
        </section>

        {/* BLOCO 6: AÇÕES FINAIS */}
        <section className="space-y-4 pt-6">
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                SALVAR ALTERAÇÕES
            </button>

            <button 
                onClick={() => alert('Abrir visualização do perfil público')}
                className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                <Eye size={18} />
                Visualizar perfil público
            </button>

            <button 
                onClick={() => alert('Fluxo de reivindicação (transferência de posse)')}
                className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1E5BFF] transition-colors"
            >
                <ShieldCheck size={14} />
                Reivindicar loja para outro perfil
            </button>
        </section>

      </div>

      {/* INPUTS OCULTOS P/ UPLOAD */}
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'banner_url')} />

      {/* FEEDBACK SUCESSO */}
      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Alterações Salvas!</span>
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
