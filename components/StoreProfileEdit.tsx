
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
  FileText,
  Instagram,
  DollarSign
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
        className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all ${Icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
    {helperText && <p className="text-[9px] text-gray-400 italic ml-1 leading-none">{helperText}</p>}
  </div>
);

const TaxonomyField: React.FC<any> = ({ label, placeholder, options, selected, onSelect, required, disabled }) => {
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

  const filtered = options.filter((opt: any) => opt.name.toLowerCase().includes(search.toLowerCase()));

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
          className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between text-sm font-bold shadow-sm transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
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
              {filtered.map((opt: any, i: number) => (
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
  const handleAddTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase();
    if (!cleanTag) return;
    if (selectedTags.length >= 15) return;
    if (!selectedTags.includes(cleanTag)) onChange([...selectedTags, cleanTag]);
    setInput('');
  };
  const handleRemoveTag = (tagToRemove: string) => onChange(selectedTags.filter(tag => tag !== tagToRemove));
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(input);
    }
  };
  const suggestions = useMemo(() => ALL_TAGS.filter(tag => !selectedTags.includes(tag.toLowerCase())).slice(0, 15), [selectedTags]);

  return (
    <div className="space-y-4" ref={null}>
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Produtos / Serviços (Tags) *</label>
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map(tag => (
              <button key={tag} type="button" onClick={() => handleRemoveTag(tag)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E5BFF] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors group">
                {tag} <X size={12} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
              </button>
            ))}
          </div>
        )}
        <div className="relative group">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1E5BFF]" />
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Digite e aperte Enter para adicionar..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 pl-11 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-900 shadow-sm transition-all" />
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="space-y-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sugestões de Tags</p>
           <div className="flex flex-wrap gap-2">
              {suggestions.map(tag => (
                <button key={tag} type="button" onClick={() => handleAddTag(tag)} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:border-[#1E5BFF] hover:text-[#1E5BFF] transition-all active:scale-95 flex items-center gap-1">
                  <PlusCircle size={10} /> {tag}
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
    telefone_fixo_publico: '',
    instagram: '',
    email_publico: '',
    logo_url: '',
    banner_url: '',
    gallery: [] as string[],
    tags: [] as string[],
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    is_delivery_only: false,
    accepts_online_orders: false,
    min_order_value: '',
    business_hours: WEEK_DAYS.reduce((acc, day) => ({ 
      ...acc, 
      [day.key]: { open: true, start: '09:00', end: '18:00' } 
    }), {} as Record<string, BusinessHour>),
    hours_observations: '',
    razao_social: '',
    cnpj: '',
    tax_regime: 'Simples Nacional',
    fiscal_address: '',
    billing_email: '',
  });

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

  useEffect(() => {
    if (!formData.category) { setAvailableSubcategories([]); return; }
    setAvailableSubcategories(SUBCATEGORIES[formData.category] || []);
  }, [formData.category]);

  const handleSave = async () => {
    if (!formData.nome_exibido || !formData.whatsapp_publico || !formData.bairro || !formData.category) {
      alert('Preencha os campos obrigatórios (*)');
      return;
    }

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
      alert('Erro ao salvar.'); 
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, [target]: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Minha Loja</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none mt-0.5">Sincronização Ativa</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-90 transition-all">
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <StoreIcon size={16} className="text-[#1E5BFF]" />
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">1. Perfil Público</h2>
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
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Pública *</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Conte um pouco sobre sua loja..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:bg-white dark:focus:bg-gray-950 shadow-sm transition-all resize-none min-h-[120px]" />
             </div>
             <div className="grid grid-cols-1 gap-4">
               <FormField label="Telefone / WhatsApp *" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
               <FormField label="Instagram (@)" value={formData.instagram} onChange={v => setFormData({...formData, instagram: v})} icon={Instagram} placeholder="@sualoja" />
               <FormField label="E-mail Público" value={formData.email_publico} onChange={v => setFormData({...formData, email_publico: v})} icon={Mail} placeholder="contato@sualoja.com" />
             </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Building2 size={16} className="text-purple-500" /><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">2. Localização Pública</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
             <FormField label="Bairro *" value={formData.bairro} onChange={v => setFormData({...formData, bairro: v})} placeholder="Ex: Freguesia" />
             <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3"><FormField label="Rua" value={formData.rua} onChange={v => setFormData({...formData, rua: v})} placeholder="Ex: Estrada dos Três Rios" /></div>
                <div className="col-span-1"><FormField label="Nº" value={formData.numero} onChange={v => setFormData({...formData, numero: v})} placeholder="100" /></div>
             </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><ShoppingBag size={16} className="text-emerald-500" /><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">3. Regras de Pedidos</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div onClick={() => setFormData({...formData, accepts_online_orders: !formData.accepts_online_orders})} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer shadow-sm">
                 <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Aceita Pedidos Online?</span>
                 <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.accepts_online_orders ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${formData.accepts_online_orders ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </div>
             </div>
             <FormField label="Valor de Pedido Mínimo" value={formData.min_order_value} onChange={v => setFormData({...formData, min_order_value: v})} icon={DollarSign} placeholder="0,00" type="number" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Clock size={16} className="text-amber-500" /><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">4. Horários</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
             {WEEK_DAYS.map(day => (
               <div key={day.key} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-50 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-500 uppercase">{day.label}</span>
                  <div className="flex items-center gap-2">
                     <input type="time" value={formData.business_hours[day.key].start} onChange={e => setFormData({...formData, business_hours: {...formData.business_hours, [day.key]: {...formData.business_hours[day.key], start: e.target.value}}})} className="bg-gray-50 dark:bg-gray-800 p-1 rounded-lg text-xs font-bold" />
                     <span className="text-gray-400">-</span>
                     <input type="time" value={formData.business_hours[day.key].end} onChange={e => setFormData({...formData, business_hours: {...formData.business_hours, [day.key]: {...formData.business_hours[day.key], end: e.target.value}}})} className="bg-gray-50 dark:bg-gray-800 p-1 rounded-lg text-xs font-bold" />
                     <button type="button" onClick={() => setFormData({...formData, business_hours: {...formData.business_hours, [day.key]: {...formData.business_hours[day.key], open: !formData.business_hours[day.key].open}}})} className={`p-1.5 rounded-lg border ${formData.business_hours[day.key].open ? 'text-emerald-500 border-emerald-100 bg-emerald-50' : 'text-red-500 border-red-100 bg-red-50'}`}><Check size={12} strokeWidth={4} /></button>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Tag size={16} className="text-blue-500" /><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">5. Classificação</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <TaxonomyField label="Categoria Principal *" options={availableCategories} selected={formData.category} onSelect={(v: string) => setFormData({...formData, category: v, subcategory: ''})} placeholder="Selecione..." />
             <TaxonomyField label="Subcategoria *" options={availableSubcategories} selected={formData.subcategory} onSelect={(v: string) => setFormData({...formData, subcategory: v})} disabled={!formData.category} placeholder="Selecione..." />
             <TagSelector selectedTags={formData.tags || []} onChange={tags => setFormData({...formData, tags})} />
          </div>
        </section>

      </div>
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />
      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Loja Atualizada!</span>
        </div>
      )}
    </div>
  );
};
