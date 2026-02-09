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
  Building2, 
  Check,
  Smartphone,
  ImageIcon,
  DollarSign,
  Video,
  Plus,
  Clock,
  Instagram,
  CheckCircle2,
  MapPin,
  Tag,
  CreditCard,
  Phone,
  AlertCircle,
  Hash,
  FileText,
  Mail,
  Info,
  // FIX: Imported ListFilter icon from lucide-react.
  ListFilter
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
// FIX: Using relative path for constants to ensure consistency and availability of exported members.
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
        className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 transition-all ${Icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
    {helperText && <p className="text-[9px] text-gray-400 italic ml-1 leading-none">{helperText}</p>}
  </div>
);

// --- Componente de Multi-Seleção (Chips) ---
const MultiSelectChips: React.FC<{
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    maxSelection: number;
    placeholder?: string;
    description?: string;
}> = ({ label, options, selected, onChange, maxSelection, placeholder, description }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelect = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            if (selected.length < maxSelection) {
                onChange([...selected, option]);
            }
        }
    };

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={containerRef}>
            <div className="flex justify-between items-end">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    {label} <span className="text-blue-500">({selected.length}/{maxSelection})</span>
                </label>
            </div>
            
            <div className="relative">
                <div 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-2 min-h-[56px] flex flex-wrap gap-2 cursor-pointer focus-within:border-[#1E5BFF]"
                    onClick={() => setIsOpen(true)}
                >
                    {selected.map(item => (
                        <span key={item} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100 dark:border-gray-700 flex items-center gap-1.5 shadow-sm">
                            {item}
                            <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); handleSelect(item); }} 
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    <input 
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setIsOpen(true); }}
                        placeholder={selected.length === 0 ? placeholder : ""}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium p-2 min-w-[120px] dark:text-white"
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
                        {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelect(opt)}
                                className={`w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center transition-colors ${
                                    selected.includes(opt) 
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {opt}
                                {selected.includes(opt) && <Check size={16} />}
                            </button>
                        )) : (
                            <div className="p-4 text-center text-xs text-gray-400">Nenhuma opção encontrada</div>
                        )}
                    </div>
                )}
            </div>
            {description && <p className="text-[9px] text-gray-400 italic ml-1 leading-tight">{description}</p>}
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

  const availableTags = ALL_TAGS.filter(tag => 
    !selectedTags.includes(tag) && tag.toLowerCase().includes(input.toLowerCase())
  );

  const handleAddTag = (tag: string) => {
    if (selectedTags.length >= 15) return;
    const cleanTag = tag.trim().toLowerCase();
    if (!selectedTags.includes(cleanTag)) {
        onChange([...selectedTags, cleanTag]);
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
      if (input.trim() && selectedTags.length < 15) {
        handleAddTag(input.trim());
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
        Tags do Negócio <span className="text-blue-500">({selectedTags.length}/15)</span>
      </label>
      
      <div className="relative">
        <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-2 flex flex-wrap gap-2 min-h-[56px] focus-within:border-[#1E5BFF]">
          {selectedTags.map(tag => (
            <span key={tag} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
              <Hash size={10} className="text-blue-500"/>
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
            </span>
          ))}
          <input 
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length < 15 ? "Digite ou selecione..." : "Limite atingido"}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium p-2 min-w-[120px] dark:text-white"
            disabled={selectedTags.length >= 15}
          />
        </div>
        
        {showSuggestions && input.length > 0 && availableTags.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-200">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Hash size={12} className="text-gray-400" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-[9px] text-gray-400 italic ml-1">
        Palavras-chave curtas para ajudar na busca (ex: entrega rápida, aceita pix, wifi grátis).
      </p>
    </div>
  );
};

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // --- STATE DO FORMULÁRIO UNIFICADO (PÚBLICO + FISCAL) ---
  const [formData, setFormData] = useState({
    // Públicos
    nome_exibido: '',
    category: '', // Categoria Principal (Obrigatória)
    secondary_categories: [] as string[], // Categorias Secundárias (Até 2)
    subcategory: '', // Subcategoria Principal (Legado/Display)
    subcategories: [] as string[], // Lista de Subcategorias (Até 5)
    
    bairro: '',
    description: '',
    whatsapp_publico: '',
    telefone_fixo_publico: '',
    instagram: '',
    email_publico: '',
    logo_url: '',
    banner_url: '',
    gallery: [] as string[],
    tags: [] as string[], // Tags (Até 15)

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
    
    // --- DADOS FISCAIS ---
    razao_social: '',
    cnpj: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    tax_regime: 'Simples Nacional',
    fiscal_address: '',
    email_fiscal: '',

    // --- ADMINISTRATIVO ---
    confirm_correct: false
  });

  // Lista de todas as categorias para seleção
  const allCategoryNames = useMemo(() => CATEGORIES.map(c => c.name), []);

  // Lista de subcategorias disponíveis baseada nas categorias selecionadas (Principal + Secundárias)
  const availableSubcategoryOptions = useMemo(() => {
      const selectedCats = [formData.category, ...formData.secondary_categories].filter(Boolean);
      let options: string[] = [];
      
      selectedCats.forEach(cat => {
          const subs = SUBCATEGORIES[cat];
          if (subs) {
              options = [...options, ...subs.map(s => s.name)];
          }
      });
      
      // Remover duplicatas
      return Array.from(new Set(options)).sort();
  }, [formData.category, formData.secondary_categories]);

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
            tags: data.tags || [],
            secondary_categories: data.secondary_categories || [],
            subcategories: data.subcategories || (data.subcategory ? [data.subcategory] : [])
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    // Validar campos obrigatórios
    if (!formData.nome_exibido) { alert('Informe o nome da loja.'); return; }
    if (!formData.whatsapp_publico) { alert('Informe o telefone/WhatsApp.'); return; }
    if (!formData.bairro) { alert('Informe o endereço/bairro.'); return; }
    
    // Validações de Categorização
    if (!formData.category) { alert('Selecione a Categoria Principal.'); return; }
    if (formData.subcategories.length === 0) { alert('Selecione pelo menos 1 subcategoria.'); return; }
    if (formData.subcategories.length > 5) { alert('Máximo de 5 subcategorias permitidas.'); return; }
    
    // Validação de alteração de categoria principal (Simulada visualmente na UI, aqui garantimos consistência)
    
    if (!formData.confirm_correct) {
      alert('Você precisa confirmar que as informações estão corretas.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').upsert({
        owner_id: user?.id,
        ...formData,
        // Define a primeira subcategoria como a "principal" para compatibilidade
        subcategory: formData.subcategories[0], 
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

  // --- Handlers de Categorização ---

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newMain = e.target.value;
      
      // Se a nova principal estava nas secundárias, remove de lá
      let newSecondaries = formData.secondary_categories.filter(c => c !== newMain);
      
      // Limpa subcategorias que não pertencem mais às categorias selecionadas
      const futureCats = [newMain, ...newSecondaries];
      const validSubs: string[] = [];
      
      futureCats.forEach(cat => {
          const catSubs = SUBCATEGORIES[cat]?.map(s => s.name) || [];
          // Mantém subs selecionadas se elas existirem na nova lista de permitidas
          formData.subcategories.forEach(sub => {
              if (catSubs.includes(sub) && !validSubs.includes(sub)) {
                  validSubs.push(sub);
              }
          });
      });

      setFormData(prev => ({
          ...prev,
          category: newMain,
          secondary_categories: newSecondaries,
          subcategories: validSubs
      }));
  };

  const handleSecondaryCategoriesChange = (selected: string[]) => {
      // Remove a principal da lista se selecionada acidentalmente
      const filtered = selected.filter(s => s !== formData.category);
      setFormData(prev => ({ ...prev, secondary_categories: filtered }));
      
      // Nota: Poderíamos limpar subcategorias inválidas aqui também, mas 
      // geralmente é melhor deixar o usuário ver e remover manualmente ou 
      // limpar apenas ao salvar/mudar a principal.
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors"><ChevronLeft size={20} className="text-gray-800 dark:text-white" /></button>
        <div className="flex-1"><h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Dados da Loja</h1></div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl active:scale-90 transition-all">{isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}</button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* BLOCO 1: INFORMAÇÕES DA LOJA */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><StoreIcon size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">1. Perfil Público (Visível)</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-blue-50 dark:bg-gray-800 border-2 border-dashed border-blue-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-blue-200" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4 text-center leading-tight">Logotipo</p>
             </div>

             <FormField label="Nome da Loja *" value={formData.nome_exibido} onChange={v => setFormData({...formData, nome_exibido: v})} required placeholder="Ex: Padaria do Bairro" />
             
             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Curta *</label>
                <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Conte um pouco sobre sua loja..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none min-h-[100px]"
                />
             </div>

             <FormField label="Telefone / WhatsApp *" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
             
             <div className="space-y-1.5">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bairro *</label>
                 <select required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none">
                    <option value="">Selecione...</option>
                    {['Freguesia', 'Taquara', 'Anil', 'Pechincha', 'Tanque', 'Curicica'].map(h => <option key={h} value={h}>{h}</option>)}
                 </select>
             </div>
          </div>
        </section>

        {/* BLOCO 2: CATEGORIZAÇÃO (NOVO) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><ListFilter size={16} className="text-blue-500" /><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">2. Categorização</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             
             {/* Categoria Principal */}
             <div className="space-y-2">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Categoria Principal <span className="text-red-500">*</span>
                 </label>
                 <select 
                    value={formData.category} 
                    onChange={handleMainCategoryChange}
                    className="w-full bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF]"
                 >
                    <option value="">Selecione a principal...</option>
                    {allCategoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <p className="text-[9px] text-gray-400 italic ml-1 leading-tight">
                    Define onde sua loja aparece primeiro. Só pode ser alterada a cada 30 dias.
                 </p>
             </div>

             {/* Categorias Secundárias (Multi-select) */}
             <MultiSelectChips 
                label="Categorias Secundárias (Opcional)"
                options={allCategoryNames.filter(c => c !== formData.category)}
                selected={formData.secondary_categories}
                onChange={handleSecondaryCategoriesChange}
                maxSelection={2}
                placeholder="Adicionar categoria extra..."
                description="Apareça em mais seções do app."
             />

             {/* Subcategorias (Multi-select) */}
             <div className={`transition-all duration-300 ${!formData.category ? 'opacity-50 pointer-events-none' : ''}`}>
                 <MultiSelectChips 
                    label="Subcategorias (O que você faz)"
                    options={availableSubcategoryOptions}
                    selected={formData.subcategories}
                    onChange={(selected) => setFormData(prev => ({ ...prev, subcategories: selected }))}
                    maxSelection={5}
                    placeholder={availableSubcategoryOptions.length === 0 ? "Selecione categorias primeiro" : "Adicionar subcategoria..."}
                    description="Escolha subcategorias que representem exatamente seus serviços."
                 />
                 {formData.category && formData.subcategories.length === 0 && (
                     <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">Selecione pelo menos uma subcategoria.</p>
                 )}
             </div>

             {/* TAGS SELECTOR */}
             <TagSelector 
                selectedTags={formData.tags || []} 
                onChange={(tags) => setFormData({...formData, tags})} 
             />
             
             <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-3">
                 <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                    Tags e subcategorias ajudam clientes certos a encontrarem seu negócio na busca e nas recomendações.
                 </p>
             </div>

          </div>
        </section>
        
        {/* --- CONFIRMAÇÃO --- */}
        <section className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm">
                <label className="flex items-center gap-4 cursor-pointer group">
                    <div onClick={() => setFormData({...formData, confirm_correct: !formData.confirm_correct})} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.confirm_correct ? 'bg-[#1E5BFF] border-[#1E5BFF]' : 'border-gray-200 group-hover:border-blue-400'}`}>
                        {formData.confirm_correct && <Check size={16} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">Confirmo que as informações acima estão corretas e atualizadas.</span>
                </label>

                <button 
                  onClick={handleSave} 
                  disabled={isSaving || !formData.confirm_correct}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm mt-8 disabled:opacity-30 disabled:grayscale"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20}/> Salvar Dados da Loja</>}
                </button>
            </div>
        </section>

      </div>
      
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 size={56} className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Loja Atualizada!</span>
        </div>
      )}
    </div>
  );
};
