
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
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SUBCATEGORIES } from '../constants';

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
    category: '',
    subcategories: [] as string[],
    specialties: [] as string[],
    description: '',
    notes: '',
    // Address
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

  const [tempTag, setTempTag] = useState('');

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
            category: data.category || '',
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

    // Validations
    if (!formData.name || !formData.cnpj || !formData.email || !formData.whatsapp || !formData.logo_url || !formData.category) {
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

      // Em um cenário real, salvaríamos também as 'hours' em uma tabela relacionada
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecialty = () => {
    if (tempTag.trim() && !formData.specialties.includes(tempTag.trim())) {
      setFormData({ ...formData, specialties: [...formData.specialties, tempTag.trim()] });
      setTempTag('');
    }
  };

  const removeSpecialty = (tag: string) => {
    setFormData({ ...formData, specialties: formData.specialties.filter(t => t !== tag) });
  };

  const toggleSubcategory = (sub: string) => {
    const current = formData.subcategories;
    if (current.includes(sub)) {
      setFormData({ ...formData, subcategories: current.filter(s => s !== sub) });
    } else {
      setFormData({ ...formData, subcategories: [...current, sub] });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Carregando Perfil da Loja...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 pb-40">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div>
            <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Perfil da Loja</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Configurações do Estabelecimento</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-10 max-w-md mx-auto">
        
        {/* 1. DADOS PRINCIPAIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Info size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Dados Principais</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div 
                className="w-24 h-24 rounded-[2rem] bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden relative group cursor-pointer"
                onClick={() => setFormData({...formData, logo_url: 'https://ui-avatars.com/api/?name=Loja&background=1E5BFF&color=fff'})}
              >
                {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera /></div>}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-[8px] font-black text-white uppercase">Logo *</span></div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Logo da Loja *</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Empresa *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="Ex: Padaria Freguesia" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ *</label>
                <input required value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="00.000.000/0001-00" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Público *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="contato@empresa.com" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Oficial *</label>
                <input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1" placeholder="(21) 99999-9999" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. CATEGORIAS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Hash size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Categorias e Especialidades</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria Principal *</label>
              <select 
                required 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value, subcategories: []})} 
                className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none text-sm font-bold dark:text-white mt-1"
              >
                <option value="">Selecione...</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            {formData.category && (
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Subcategorias</label>
                <div className="flex flex-wrap gap-2">
                  {(SUBCATEGORIES[formData.category] || []).map(sub => (
                    <button 
                      key={sub.name} 
                      type="button"
                      onClick={() => toggleSubcategory(sub.name)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.subcategories.includes(sub.name) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Especialidades (Tags)</label>
              <div className="flex gap-2 mb-3">
                <input value={tempTag} onChange={e => setTempTag(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSpecialty())} className="flex-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-transparent focus:border-[#1E5BFF] outline-none text-xs font-bold dark:text-white" placeholder="Ex: Entrega Grátis" />
                <button type="button" onClick={addSpecialty} className="bg-[#1E5BFF] text-white p-3 rounded-xl active:scale-95 transition-transform"><Save size={18} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map(tag => (
                  <span key={tag} className="bg-blue-50 dark:bg-blue-900/30 text-[#1E5BFF] px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-blue-100 dark:border-blue-800">
                    {tag} <X size={10} className="cursor-pointer" onClick={() => removeSpecialty(tag)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ENDEREÇO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><MapPin size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Localização</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-4">
              <input type="checkbox" checked={formData.is_online_only} onChange={e => setFormData({...formData, is_online_only: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-blue-600" id="online_only" />
              <label htmlFor="online_only" className="text-xs font-bold text-gray-700 dark:text-gray-300">Atendo somente online / Delivery</label>
            </div>

            {!formData.is_online_only && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CEP</label>
                    <input value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="22775-000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bairro</label>
                    <input value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="Freguesia" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logradouro (Rua/Av)</label>
                  <input value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="Estrada dos Três Rios" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nº</label>
                    <input value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="100" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complemento</label>
                    <input value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="Sala 204" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. HORÁRIOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Horário de Funcionamento</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            {hours.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                <div className="w-24">
                  <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase">{h.day.slice(0,3)}</span>
                </div>
                
                <div className="flex-1 flex items-center gap-2">
                  <input type="time" disabled={h.closed} value={h.open} onChange={e => {
                    const newHours = [...hours];
                    newHours[idx].open = e.target.value;
                    setHours(newHours);
                  }} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-xs font-bold dark:text-white outline-none disabled:opacity-30" />
                  <span className="text-gray-300">/</span>
                  <input type="time" disabled={h.closed} value={h.close} onChange={e => {
                    const newHours = [...hours];
                    newHours[idx].close = e.target.value;
                    setHours(newHours);
                  }} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg text-xs font-bold dark:text-white outline-none disabled:opacity-30" />
                </div>

                <div className="flex items-center gap-1">
                   <input type="checkbox" checked={h.closed} onChange={e => {
                     const newHours = [...hours];
                     newHours[idx].closed = e.target.checked;
                     setHours(newHours);
                   }} className="w-4 h-4 rounded border-gray-300 text-red-600" />
                   <span className="text-[9px] font-black uppercase text-gray-400">Fechado</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INFORMAÇÕES ADICIONAIS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Descrição e Redes</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição da Loja</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-medium dark:text-white mt-1 resize-none" placeholder="Conte um pouco sobre sua história e produtos..." />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Instagram size={12} /> Instagram</label>
              <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="@sua.loja" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Globe size={12} /> Website</label>
              <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent outline-none text-sm font-bold dark:text-white mt-1" placeholder="www.sualoja.com.br" />
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
    </div>
  );
};
