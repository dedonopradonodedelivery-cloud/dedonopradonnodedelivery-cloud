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
  AlertCircle,
  FileText,
  MapPin,
  Smartphone,
  Mail,
  Info,
  Globe,
  Image as ImageIcon,
  Eye,
  Clock,
  CreditCard,
  Banknote
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES } from '../constants';
import { TaxonomyType, BusinessHour } from '../types';

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

const DEFAULT_PAYMENT_METHODS = [
  'Dinheiro',
  'Pix',
  'Cartão de Débito',
  'Cartão de Crédito',
  'Vale Refeição / Alimentação'
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
}> = ({ label, value, onChange, placeholder, type = "text", required, helperText, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1E5BFF]" />}
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 transition-all ${Icon ? 'pl-11' : ''}`}
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
}

const TaxonomyField: React.FC<TaxonomyFieldProps> = ({ label, placeholder, options, selected, onSelect, required }) => {
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
  const finalOptions = [...filtered, { name: 'Outras... (sugerir nova)', icon: <PlusCircle size={14} />, isSuggestion: true }];

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between text-sm font-bold ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
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
                  onClick={() => { onSelect(opt.name); setIsOpen(false); }}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${(opt as any).isSuggestion ? 'text-[#1E5BFF] border-t border-gray-50 mt-1 pt-4' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    {opt.icon && <span className="opacity-50">{opt.icon}</span>}
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
    // --- FISCAL ---
    name_fantasia: '',
    razao_social: '',
    cnpj: '',
    email_fiscal: '',
    whatsapp_financeiro: '',
    telefone_fixo_fiscal: '',
    inscricao_municipal: '',
    inscricao_estadual: '',

    // --- PÚBLICO ---
    nome_exibido: '',
    whatsapp_publico: '',
    telefone_fixo_publico: '',
    email_publico: '',
    description: '',
    instagram: '',
    
    // --- IMAGENS ---
    logo_url: '',
    banner_url: '',

    // --- ENDEREÇO ---
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'RJ',
    is_delivery_only: false,

    // --- CLASSIFICAÇÃO ---
    category: '',
    subcategory: '',

    // --- NOVOS ---
    business_hours: WEEK_DAYS.reduce((acc, day) => ({ 
      ...acc, 
      [day.key]: { open: true, start: '09:00', end: '18:00' } 
    }), {} as Record<string, BusinessHour>),
    payment_methods: [] as string[],
    payment_methods_others: ''
  });

  useEffect(() => {
    if (!user) return;
    const fetchStoreData = async () => {
      try {
        const { data } = await supabase.from('merchants').select('*').eq('owner_id', user.id).maybeSingle();
        if (data) {
          setFormData({
            ...formData,
            ...data,
            name_fantasia: data.name_fantasia || data.name || '',
            nome_exibido: data.nome_exibido || data.name || '',
            business_hours: data.business_hours || formData.business_hours,
            payment_methods: data.payment_methods || [],
          });
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    // VALIDAÇÕES OBRIGATÓRIAS
    const requireds = [
      { key: 'logo_url', label: 'Logo da Loja' },
      { key: 'name_fantasia', label: 'Nome Fantasia' },
      { key: 'razao_social', label: 'Razão Social' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'email_fiscal', label: 'E-mail Fiscal' },
      { key: 'whatsapp_financeiro', label: 'WhatsApp Financeiro' },
      { key: 'nome_exibido', label: 'Nome Exibido no App' },
      { key: 'whatsapp_publico', label: 'WhatsApp da Loja (Público)' },
      { key: 'category', label: 'Categoria' },
      { key: 'subcategory', label: 'Subcategoria' },
    ];

    for (const req of requireds) {
      if (!(formData as any)[req.key]) {
        alert(`O campo "${req.label}" é obrigatório.`);
        return;
      }
    }

    if (formData.payment_methods.length === 0) {
      alert("Selecione pelo menos uma forma de pagamento.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').upsert({
        owner_id: user?.id,
        ...formData,
        name: formData.nome_exibido, 
        updated_at: new Date().toISOString()
      }, { onConflict: 'owner_id' });
      
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { alert('Erro ao salvar perfil.'); } finally { setIsSaving(false); }
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

  const togglePaymentMethod = (method: string) => {
    const current = formData.payment_methods;
    if (current.includes(method)) {
      setFormData({ ...formData, payment_methods: current.filter(m => m !== method) });
    } else {
      setFormData({ ...formData, payment_methods: [...current, method] });
    }
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
      storeName: formData.nome_exibido || 'Loja em Cadastro',
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-48 animate-in slide-in-from-right duration-300">
      
      {/* 1. HEADER FIXO */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil da Loja</h1>
        </div>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* 2. SEÇÃO IMAGENS (REORDENADA: LOGO PRIMEIRO) */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <ImageIcon size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidade Visual</h2>
          </div>

          {/* Logo (AGORA NO TOPO) */}
          <div className="flex flex-col items-center relative z-10">
             <div className="relative group">
                <div className={`w-32 h-32 rounded-[2.5rem] bg-white dark:bg-gray-800 overflow-hidden border-4 shadow-2xl flex items-center justify-center ${!formData.logo_url ? 'border-dashed border-red-200' : 'border-white dark:border-gray-900'}`}>
                    {formData.logo_url ? (
                        <img src={formData.logo_url} className="w-full h-full object-contain p-2" alt="Logo" />
                    ) : (
                        <div className="text-center p-4">
                            <StoreIcon className="w-8 h-8 text-gray-300 mx-auto" />
                            <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Logo Obrigatória</p>
                        </div>
                    )}
                </div>
                <div className="absolute -right-2 -bottom-2 flex flex-col gap-2">
                    <button onClick={() => logoInputRef.current?.click()} className="w-10 h-10 bg-[#1E5BFF] text-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-white dark:border-gray-900 active:scale-90 transition-transform"><Pencil size={18} /></button>
                    {formData.logo_url && <button onClick={() => setFormData({...formData, logo_url: ''})} className="w-10 h-10 bg-red-500 text-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-white dark:border-gray-900 active:scale-90 transition-transform"><Trash2 size={18} /></button>}
                </div>
             </div>
             <p className="text-[9px] text-gray-400 italic mt-3">Logo é obrigatória para aparecer no app. (500x500 px)</p>
          </div>

          {/* Banner / Capa (AGORA ABAIXO) */}
          <div className="space-y-3">
             <div className="relative w-full aspect-[3/1] bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden border-2 border-gray-100 dark:border-gray-900 shadow-inner group">
                {formData.banner_url ? (
                    <>
                        <img src={formData.banner_url} className="w-full h-full object-cover" alt="Banner" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => bannerInputRef.current?.click()} className="p-3 bg-white rounded-2xl text-gray-900 shadow-xl"><Pencil size={20} /></button>
                            <button onClick={() => setFormData({...formData, banner_url: ''})} className="p-3 bg-red-500 rounded-2xl text-white shadow-xl"><Trash2 size={20} /></button>
                        </div>
                    </>
                ) : (
                    <button onClick={() => bannerInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={32} strokeWidth={1.5} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Adicionar banner de capa</span>
                    </button>
                )}
             </div>
             <p className="text-[9px] text-gray-400 italic text-center">Banner aparece no topo do seu perfil público. (1200x400 px)</p>
          </div>

          <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />
          <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'banner_url')} />
        </section>

        {/* 3. SEÇÃO IDENTIFICAÇÃO FISCAL (DADOS PRIVADOS) */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Building2 size={16} className="text-[#1E5BFF]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificação Fiscal</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 flex gap-3">
                    <Info size={16} className="text-blue-500 shrink-0" />
                    <p className="text-[9px] text-blue-700 dark:text-blue-300 font-bold uppercase leading-tight">
                        Estes dados são usados para emissão de nota fiscal e não ficam públicos.
                    </p>
                </div>

                <FormField label="Nome Fantasia" value={formData.name_fantasia} onChange={v => setFormData({...formData, name_fantasia: v})} required placeholder="Ex: Padaria Estrela" />
                <FormField label="Razão Social" value={formData.razao_social} onChange={v => setFormData({...formData, razao_social: v})} required placeholder="Ex: Estrela de JPA Ltda" />
                <FormField label="CNPJ" value={formData.cnpj} onChange={v => setFormData({...formData, cnpj: v})} required placeholder="00.000.000/0001-00" />
                <FormField label="E-mail Fiscal" value={formData.email_fiscal} onChange={v => setFormData({...formData, email_fiscal: v})} required placeholder="fiscal@loja.com" type="email" icon={Mail} />
                <FormField label="WhatsApp Financeiro" value={formData.whatsapp_financeiro} onChange={v => setFormData({...formData, whatsapp_financeiro: v})} required placeholder="(21) 99999-9999" type="tel" icon={Smartphone} />
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <FormField label="Insc. Municipal" value={formData.inscricao_municipal || ''} onChange={v => setFormData({...formData, inscricao_municipal: v})} placeholder="Opcional" />
                    <FormField label="Insc. Estadual" value={formData.inscricao_estadual || ''} onChange={v => setFormData({...formData, inscricao_estadual: v})} placeholder="Opcional" />
                </div>
            </div>
        </section>

        {/* 4. SEÇÃO INFORMAÇÕES DA LOJA (DADOS PÚBLICOS) */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Sparkles size={16} className="text-amber-500" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loja no App (Público)</h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30 flex gap-3">
                    <Eye size={16} className="text-amber-500 shrink-0" />
                    <p className="text-[9px] text-amber-700 dark:text-amber-300 font-bold uppercase leading-tight">
                        Estes dados aparecerão no perfil público da sua loja.
                    </p>
                </div>

                <FormField label="Nome Exibido da Loja" value={formData.nome_exibido} onChange={v => setFormData({...formData, nome_exibido: v})} required placeholder="Nome que o cliente verá" icon={StoreIcon} />
                <FormField label="WhatsApp da Loja (Público)" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} required placeholder="(21) 99999-0000" icon={Smartphone} helperText="Este número será usado no botão 'Zap' do perfil." />
                <FormField label="E-mail Público" value={formData.email_publico || ''} onChange={v => setFormData({...formData, email_publico: v})} placeholder="contato@loja.com" icon={Mail} />
                <FormField label="Instagram" value={formData.instagram || ''} onChange={v => setFormData({...formData, instagram: v})} placeholder="@sualoja" icon={Globe} />

                <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sobre a Loja</label>
                    <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        placeholder="Descreva seu negócio para os clientes..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none min-h-[100px]"
                    />
                </div>
            </div>
        </section>

        {/* 5. NOVA SEÇÃO: HORÁRIO DE FUNCIONAMENTO */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Clock size={16} className="text-blue-500" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horário de Funcionamento</h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
                {WEEK_DAYS.map((day) => {
                  const data = formData.business_hours[day.key];
                  return (
                    <div key={day.key} className="flex flex-col gap-3 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{day.label}</span>
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] font-black uppercase ${data.open ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {data.open ? 'Aberto' : 'Fechado'}
                           </span>
                           <button 
                              type="button"
                              onClick={() => handleHourChange(day.key, 'open', !data.open)}
                              className={`w-10 h-6 rounded-full p-1 transition-colors ${data.open ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.open ? 'translate-x-4' : 'translate-x-0'}`}></div>
                           </button>
                        </div>
                      </div>
                      
                      {data.open && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex-1">
                             <input 
                                type="time" 
                                value={data.start} 
                                onChange={e => handleHourChange(day.key, 'start', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-xs font-bold dark:text-white"
                             />
                          </div>
                          <span className="text-gray-300 text-xs font-bold">até</span>
                          <div className="flex-1">
                             <input 
                                type="time" 
                                value={data.end} 
                                onChange={e => handleHourChange(day.key, 'end', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-xs font-bold dark:text-white"
                             />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
        </section>

        {/* 6. NOVA SEÇÃO: FORMAS DE PAGAMENTO ACEITAS */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <CreditCard size={16} className="text-[#1E5BFF]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formas de Pagamento Aceitas</h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div className="flex flex-wrap gap-2">
                   {DEFAULT_PAYMENT_METHODS.map(method => {
                     const isSelected = formData.payment_methods.includes(method);
                     return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => togglePaymentMethod(method)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${isSelected ? 'bg-blue-50 border-[#1E5BFF] text-[#1E5BFF] dark:bg-blue-900/30' : 'bg-gray-50 border-gray-100 text-gray-400 dark:bg-gray-800 dark:border-gray-700'}`}
                        >
                          {method}
                        </button>
                     );
                   })}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Outras (opcional)</label>
                  <input 
                    value={formData.payment_methods_others}
                    onChange={e => setFormData({...formData, payment_methods_others: e.target.value})}
                    placeholder="Ex: PicPay, Vale Refeição Sodexo..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-xs font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all"
                  />
                </div>
                
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic text-center">
                    Selecione pelo menos uma forma de pagamento.
                </p>
            </div>
        </section>

        {/* 7. ENDEREÇO E LOCALIZAÇÃO */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <MapPin size={16} className="text-red-500" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Endereço</h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl cursor-pointer" onClick={() => setFormData({...formData, is_delivery_only: !formData.is_delivery_only})}>
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${formData.is_delivery_only ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'bg-white border-gray-200'}`}>
                        {formData.is_delivery_only && <Check size={16} className="text-white" />}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Atendo somente online / delivery</span>
                </div>

                {!formData.is_delivery_only && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <FormField label="CEP" value={formData.cep || ''} onChange={v => setFormData({...formData, cep: v})} placeholder="00000-000" />
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3">
                                <FormField label="Rua / Logradouro" value={formData.rua || ''} onChange={v => setFormData({...formData, rua: v})} />
                            </div>
                            <div className="col-span-1">
                                <FormField label="Nº" value={formData.numero || ''} onChange={v => setFormData({...formData, numero: v})} />
                            </div>
                        </div>
                        <FormField label="Complemento" value={formData.complemento || ''} onChange={v => setFormData({...formData, complemento: v})} placeholder="Ex: Loja B / Bloco 2" />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Bairro" value={formData.bairro || ''} onChange={v => setFormData({...formData, bairro: v})} />
                            <FormField label="Cidade" value={formData.cidade || ''} onChange={v => setFormData({...formData, cidade: v})} />
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* 8. CLASSIFICAÇÃO */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Hash size={16} className="text-[#1E5BFF]" />
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classificação</h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <TaxonomyField 
                    label="Categoria Principal" 
                    placeholder="Selecione..." 
                    options={CATEGORIES.map(c => ({ name: c.name, icon: c.icon }))} 
                    selected={formData.category} 
                    onSelect={v => {
                        if (v.includes('Outras...')) {
                            setSuggestionModal({ isOpen: true, type: 'category' });
                        } else {
                            setFormData({...formData, category: v, subcategory: ''});
                        }
                    }} 
                    required 
                />
                
                {formData.category && (
                    <TaxonomyField 
                        label={`Subcategoria de ${formData.category}`}
                        placeholder="Selecione..." 
                        options={SUBCATEGORIES[formData.category] || []} 
                        selected={formData.subcategory} 
                        onSelect={v => {
                            if (v.includes('Outras...')) {
                                setSuggestionModal({ isOpen: true, type: 'subcategory', parentName: formData.category });
                            } else {
                                setFormData({...formData, subcategory: v});
                            }
                        }} 
                        required 
                    />
                )}
            </div>
        </section>
      </div>

      {/* 9. BOTÃO SALVAR FIXO */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto">
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          SALVAR ALTERAÇÕES
        </button>
      </div>

      {/* 10. MODAL DE SUGESTÃO */}
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
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome sugerido *</label>
                        <input value={suggestionData.name} onChange={e => setSuggestionData({...suggestionData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white font-bold" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Justificativa (Opcional)</label>
                        <textarea value={suggestionData.justification} onChange={e => setSuggestionData({...suggestionData, justification: e.target.value})} rows={3} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:border-[#1E5BFF] transition-all dark:text-white resize-none text-sm font-medium" />
                    </div>
                    <button onClick={submitSuggestion} disabled={!suggestionData.name.trim()} className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"><Send size={16} /> ENVIAR PARA ANÁLISE</button>
                    <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest font-bold">Feedback em até 48 horas</p>
                </div>
            </div>
        </div>
      )}

      {/* FEEDBACKS VISUAIS */}
      {showAnalysisFeedback && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-8 py-5 rounded-3xl shadow-2xl border border-white/20 animate-in slide-in-from-top-10 flex flex-col items-center gap-2 max-w-xs text-center">
            <CheckCircle2 className="text-emerald-400" size={28} />
            <p className="text-sm font-bold leading-tight uppercase tracking-tight">Solicitação Enviada!</p>
            <p className="text-[11px] text-gray-400">Analisaremos sua sugestão em até 48 horas.</p>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-[150] bg-white/95 dark:bg-gray-950/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter text-center">Perfil Atualizado!</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Seus dados foram salvos com segurança.</p>
        </div>
      )}
    </div>
  );
};