
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
  // Added missing icon imports
  MapPin,
  ShoppingBag
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
        className={`w-full bg-blue-50/50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/5 transition-all ${Icon ? 'pl-11' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
    {helperText && <p className="text-[9px] text-gray-400 italic ml-1 leading-none">{helperText}</p>}
  </div>
);

export const StoreProfileEdit: React.FC<StoreProfileEditProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
    videos: [] as string[]
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
            videos: data.videos || []
          }));
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchStoreData();
  }, [user]);

  const handleSave = async () => {
    if (!formData.nome_exibido || !formData.whatsapp_publico || !formData.bairro) {
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
    } catch (err) { alert('Erro ao salvar.'); } finally { setIsSaving(false); }
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
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors"><ChevronLeft size={20} className="text-gray-800 dark:text-white" /></button>
        <div className="flex-1"><h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil Público</h1></div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl active:scale-90 transition-all">{isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}</button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* SEÇÃO 1: IDENTIDADE VISUAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><StoreIcon size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">1. Identidade Visual</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex flex-col items-center">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-[2rem] bg-blue-50 dark:bg-gray-800 border-2 border-dashed border-blue-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                        {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-contain p-2" /> : <StoreIcon className="text-blue-200" size={32} />}
                    </div>
                    <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#1E5BFF] text-white p-2.5 rounded-xl shadow-lg border-2 border-white dark:border-gray-900"><Pencil size={16} /></button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-4">Logotipo</p>
             </div>
             <FormField label="Nome da Loja *" value={formData.nome_exibido} onChange={v => setFormData({...formData, nome_exibido: v})} required placeholder="Ex: Padaria Central" />
             <div className="space-y-1.5"><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Curta *</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Breve resumo da sua loja..." className="w-full bg-blue-50/50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1E5BFF] transition-all resize-none min-h-[100px]" /></div>
          </div>
        </section>

        {/* SEÇÃO 2: CONTATOS E LOCALIZAÇÃO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Smartphone size={16} className="text-emerald-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">2. Contatos e Local</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <FormField label="WhatsApp / Celular *" value={formData.whatsapp_publico} onChange={v => setFormData({...formData, whatsapp_publico: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
             <FormField label="Instagram (@)" value={formData.instagram} onChange={v => setFormData({...formData, instagram: v})} icon={Instagram} placeholder="@sualoja" />
             {/* Fix: Added missing MapPin usage for the Bairro field */}
             <FormField label="Bairro *" value={formData.bairro} onChange={v => setFormData({...formData, bairro: v})} icon={MapPin} placeholder="Ex: Freguesia" />
          </div>
        </section>

        {/* SEÇÃO 3: REGRAS DE PEDIDO */}
        <section className="space-y-6">
          {/* Fix: Added missing ShoppingBag icon usage for the section header */}
          <div className="flex items-center gap-2 px-1"><ShoppingBag size={16} className="text-amber-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">3. Regras de Pedido</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <div onClick={() => setFormData({...formData, accepts_online_orders: !formData.accepts_online_orders})} className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-gray-800 rounded-2xl cursor-pointer border border-blue-100 dark:border-gray-700">
                 <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Aceita Pedidos Online?</span>
                 <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.accepts_online_orders ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${formData.accepts_online_orders ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </div>
             </div>
             <FormField label="Valor de Pedido Mínimo" value={formData.min_order_value} onChange={v => setFormData({...formData, min_order_value: v})} icon={DollarSign} placeholder="0,00" type="number" />
          </div>
        </section>

        {/* SEÇÃO 4: VÍDEOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Video size={16} className="text-purple-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">4. Vídeos da Loja</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm">
             <p className="text-xs text-gray-500 mb-6 font-medium">Habilite até 2 vídeos curtos para seu perfil.</p>
             <div className="grid grid-cols-2 gap-4">
                {[0, 1].map(i => (
                    <div key={i} className="aspect-[9/16] bg-blue-50/30 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-blue-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors">
                        <Plus className="text-blue-300" />
                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Vídeo {i + 1}</span>
                    </div>
                ))}
             </div>
          </div>
        </section>

      </div>
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo_url')} />
      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Perfil Atualizado!</span>
        </div>
      )}
    </div>
  );
};
