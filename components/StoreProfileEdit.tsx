import React, { useState, useEffect, useRef } from 'react';
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
  // Added missing Hash and FileText icon imports
  Hash,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES } from '../constants';
import { BusinessHour } from '../types';

interface StoreProfileEditProps {
  onBack: () => void;
}

const WEEK_DAYS = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quarta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const PAYMENT_METHODS = [
    { id: 'dinheiro', label: 'Dinheiro' },
    { id: 'pix', label: 'PIX' },
    { id: 'credito', label: 'Cartão de Crédito' },
    { id: 'debito', label: 'Cartão de Débito' },
];

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // --- STATE DO FORMULÁRIO COMPLETO ---
  const [formData, setFormData] = useState({
    nome_exibido: '',
    category: '',
    subcategory: '',
    bairro: '',
    rua: '',
    numero: '',
    cidade: 'Rio de Janeiro',
    description: '',
    whatsapp_publico: '',
    telefone_fixo_publico: '',
    instagram: '',
    email_publico: '',
    logo_url: '',
    banner_url: '',
    tags: [] as string[],
    payment_methods: [] as string[],
    payment_other: '',
    accepts_online_orders: false,
    min_order_value: '',
    business_hours: WEEK_DAYS.reduce((acc, day) => ({ 
      ...acc, 
      [day.key]: { open: true, start: '09:00', end: '18:00' } 
    }), {} as Record<string, BusinessHour>),
    confirm_correct: false
  });

  const [tagInput, setTagInput] = useState('');

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
            tags: data.tags || [],
            payment_methods: data.payment_methods || [],
            min_order_value: data.min_order_value ? String(data.min_order_value) : ''
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  // --- LÓGICA DE TAGS (ENTER PARA CRIAR) ---
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = tagInput.trim().toLowerCase();
        if (val && !formData.tags.includes(val) && formData.tags.length < 15) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
            setTagInput('');
        }
    }
  };

  const removeTag = (t: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== t) }));
  };

  const togglePayment = (id: string) => {
    setFormData(prev => ({
        ...prev,
        payment_methods: prev.payment_methods.includes(id) 
            ? prev.payment_methods.filter(m => m !== id)
            : [...prev.payment_methods, id]
    }));
  };

  const handleSave = async () => {
    if (!formData.nome_exibido || !formData.whatsapp_publico || !formData.bairro || !formData.category) {
      alert('Preencha os campos obrigatórios (*)');
      return;
    }
    if (!formData.confirm_correct) {
      alert('Você precisa confirmar que as informações estão corretas.');
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
    } catch (err) { alert('Erro ao salvar.'); } finally { setIsSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData({ ...formData, logo_url: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors"><ChevronLeft size={20} className="text-gray-800 dark:text-white" /></button>
        <div className="flex-1"><h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil Público</h1></div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl active:scale-90 transition-all">{isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}</button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* 1. IDENTIFICAÇÃO DA LOJA */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><StoreIcon size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">1. Identificação</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-blue-50 dark:bg-gray-800 border-2 border-dashed border-blue-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-blue-200" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4">Logotipo Quadrado</p>
             </div>
             
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Nome Fantasia *</label>
                <input required value={formData.nome_exibido} onChange={e => setFormData({...formData, nome_exibido: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF]" placeholder="Como o cliente conhece sua loja" />
                <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">Este nome e a logo aparecerão no perfil e nos resultados de busca.</p>
             </div>
          </div>
        </section>

        {/* 2. INFORMAÇÕES DE CONTATO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Smartphone size={16} className="text-emerald-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">2. Contato</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-5">
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">WhatsApp *</label>
                <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required value={formData.whatsapp_publico} onChange={e => setFormData({...formData, whatsapp_publico: e.target.value})} className="w-full p-4 pl-12 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="(21) 99999-0000" />
                </div>
                <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">Gera um botão de contato rápido no seu perfil.</p>
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Telefone Fixo (Opcional)</label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={formData.telefone_fixo_publico} onChange={e => setFormData({...formData, telefone_fixo_publico: e.target.value})} className="w-full p-4 pl-12 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="(21) 2222-0000" />
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Instagram (@)</label>
                <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full p-4 pl-12 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="@sualoja" />
                </div>
             </div>
          </div>
        </section>

        {/* 3. ENDEREÇO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><MapPin size={16} className="text-rose-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">3. Endereço</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-4">
             <div className="grid grid-cols-4 gap-3">
                 <div className="col-span-3">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Rua *</label>
                    <input required value={formData.rua} onChange={e => setFormData({...formData, rua: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Av. Geremário Dantas" />
                 </div>
                 <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Nº *</label>
                    <input required value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="100" />
                 </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Bairro *</label>
                    <input required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Freguesia" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Cidade *</label>
                    <input required value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Rio de Janeiro" />
                 </div>
             </div>
             <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">O endereço ajuda clientes próximos a encontrar sua loja fisicamente.</p>
          </div>
        </section>

        {/* 4. HORÁRIO DE FUNCIONAMENTO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Clock size={16} className="text-amber-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">4. Horários</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-4">
             {WEEK_DAYS.map(day => (
                 <div key={day.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                        <div onClick={() => setFormData(prev => ({...prev, business_hours: {...prev.business_hours, [day.key]: {...prev.business_hours[day.key], open: !prev.business_hours[day.key].open}}}))} className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${formData.business_hours[day.key].open ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {formData.business_hours[day.key].open && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{day.label}</span>
                    </div>
                    <div className={`flex items-center gap-2 transition-opacity ${!formData.business_hours[day.key].open && 'opacity-20 pointer-events-none'}`}>
                        <input type="time" value={formData.business_hours[day.key].start} onChange={e => setFormData(prev => ({...prev, business_hours: {...prev.business_hours, [day.key]: {...prev.business_hours[day.key], start: e.target.value}}}))} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-xs font-bold" />
                        <span className="text-gray-400">-</span>
                        <input type="time" value={formData.business_hours[day.key].end} onChange={e => setFormData(prev => ({...prev, business_hours: {...prev.business_hours, [day.key]: {...prev.business_hours[day.key], end: e.target.value}}}))} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-xs font-bold" />
                    </div>
                 </div>
             ))}
          </div>
        </section>

        {/* 5. FORMAS DE PAGAMENTO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><CreditCard size={16} className="text-purple-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">5. Pagamento</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-4">
             <div className="grid grid-cols-2 gap-3">
                 {PAYMENT_METHODS.map(m => (
                     <div key={m.id} onClick={() => togglePayment(m.id)} className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${formData.payment_methods.includes(m.id) ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.payment_methods.includes(m.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {formData.payment_methods.includes(m.id) && <Check size={10} className="text-white" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight text-gray-700 dark:text-gray-300">{m.label}</span>
                     </div>
                 ))}
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 mt-4">Outras Formas</label>
                <input value={formData.payment_other} onChange={e => setFormData({...formData, payment_other: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none" placeholder="Ex: VR, Sodexo, Ame..." />
             </div>
             <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">Isso ajuda o cliente na decisão de entrar em contato.</p>
          </div>
        </section>

        {/* 6. CATEGORIA E SUBCATEGORIA */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Tag size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">6. Classificação</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-5">
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Categoria Principal *</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none">
                    <option value="">Selecione...</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Subcategoria *</label>
                <select disabled={!formData.category} value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none disabled:opacity-30">
                    <option value="">Selecione...</option>
                    {(SUBCATEGORIES[formData.category] || []).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
             </div>
             <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">Define em qual área do app sua loja aparecerá nas buscas.</p>
          </div>
        </section>

        {/* 7. TAGS (COMPORTAMENTO ENTER) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Hash size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">7. Tags de Busca</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-4">
             <div className="space-y-3">
                 <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Digite e pressione ENTER" 
                    className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF]" 
                 />
                 <div className="flex flex-wrap gap-2">
                    {formData.tags.map(t => (
                        <div key={t} className="bg-[#1E5BFF]/10 text-[#1E5BFF] px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border border-blue-200">
                            {t}
                            <button onClick={() => removeTag(t)}><X size={12} /></button>
                        </div>
                    ))}
                 </div>
             </div>
             <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                 <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed font-bold uppercase tracking-tight">
                    As tags ajudam sua loja a aparecer na barra de busca. <br/>
                    Exemplo: pizzaria, lanche, delivery, massa, comida italiana.
                 </p>
             </div>
             <p className="text-[9px] text-gray-400 mt-1 ml-1 text-right">{formData.tags.length}/15 tags</p>
          </div>
        </section>

        {/* 8. DESCRIÇÃO DA LOJA */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><FileText size={16} className="text-indigo-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">8. Descrição</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm">
             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Escreva uma breve apresentação da sua loja..." className="w-full p-4 bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-800 rounded-2xl text-sm font-medium dark:text-white outline-none min-h-[150px] resize-none" />
             <p className="text-[9px] text-gray-400 mt-4 ml-1 italic">Uma boa descrição gera confiança e melhora o posicionamento.</p>
          </div>
        </section>

        {/* 9. CONFIRMAÇÃO E SALVAR */}
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
                    {isSaving ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20}/> Salvar Perfil Público</>}
                </button>
            </div>
        </section>

      </div>
      
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 size={56} className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Perfil Atualizado!</span>
        </div>
      )}
    </div>
  );
};
