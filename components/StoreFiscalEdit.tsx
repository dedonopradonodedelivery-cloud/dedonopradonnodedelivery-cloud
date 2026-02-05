
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Loader2, 
  Save, 
  Building,
  CreditCard,
  Mail,
  Smartphone,
  Phone,
  CheckCircle2,
  AlertCircle,
  // Added missing icon import
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const TAX_REGIMES = ['Simples Nacional', 'MEI', 'Lucro Presumido', 'Lucro Real', 'Pessoa Física'];

const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ElementType;
}> = ({ label, value, onChange, placeholder, type = "text", required, icon: Icon }) => (
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
        className={`w-full bg-blue-50/50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF] transition-all ${Icon ? 'pl-11' : ''}`}
      />
    </div>
  </div>
);

export const StoreFiscalEdit: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    email_fiscal: '',
    whatsapp_financeiro: '',
    telefone_fixo_fiscal: '',
    inscricao_municipal: '',
    inscricao_estadual: '',
    tax_regime: 'Simples Nacional'
  });

  useEffect(() => {
    if (!user) return;
    const fetchFiscalData = async () => {
      try {
        const { data } = await supabase.from('merchants').select('*').eq('owner_id', user.id).maybeSingle();
        if (data) {
          setFormData({
            razao_social: data.razao_social || '',
            cnpj: data.cnpj || '',
            email_fiscal: data.email_fiscal || '',
            whatsapp_financeiro: data.whatsapp_financeiro || '',
            telefone_fixo_fiscal: data.telefone_fixo_fiscal || '',
            inscricao_municipal: data.inscricao_municipal || '',
            inscricao_estadual: data.inscricao_estadual || '',
            tax_regime: data.tax_regime || 'Simples Nacional'
          });
        }
      } catch (e) { console.warn(e); } finally { setIsLoading(false); }
    };
    fetchFiscalData();
  }, [user]);

  const handleSave = async () => {
    if (!formData.razao_social || !formData.cnpj || !formData.email_fiscal) {
      alert('Razão Social, CNPJ e E-mail Fiscal são obrigatórios.');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('merchants').update(formData).eq('owner_id', user?.id);
      if (error) throw error;
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { alert('Erro ao salvar dados fiscais.'); } finally { setIsSaving(false); }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950"><Loader2 className="animate-spin text-[#1E5BFF]" /></div>;

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors"><ChevronLeft size={20} className="text-gray-800 dark:text-white" /></button>
        <div className="flex-1"><h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Dados para Nota Fiscal</h1></div>
        <button onClick={handleSave} disabled={isSaving} className="p-3 bg-[#1E5BFF] text-white rounded-2xl shadow-xl active:scale-90 transition-all">{isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}</button>
      </div>

      <div className="p-6 space-y-12 max-w-md mx-auto">
        
        {/* INFO JURÍDICA */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><Building size={16} className="text-[#1E5BFF]" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">1. Informações Jurídicas</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <FormField label="Razão Social *" value={formData.razao_social} onChange={v => setFormData({...formData, razao_social: v})} required placeholder="NOME EMPRESARIAL LTDA" />
             <FormField label="CNPJ *" value={formData.cnpj} onChange={v => setFormData({...formData, cnpj: v})} required placeholder="00.000.000/0001-00" />
             <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Regime Tributário</label>
                <select 
                    value={formData.tax_regime}
                    onChange={e => setFormData({...formData, tax_regime: e.target.value})}
                    className="w-full bg-blue-50/50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-[#1E5BFF]"
                >
                    {TAX_REGIMES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <FormField label="Insc. Estadual" value={formData.inscricao_estadual} onChange={v => setFormData({...formData, inscricao_estadual: v})} placeholder="Opcional" />
                <FormField label="Insc. Municipal" value={formData.inscricao_municipal} onChange={v => setFormData({...formData, inscricao_municipal: v})} placeholder="Opcional" />
             </div>
          </div>
        </section>

        {/* CONTATO FINANCEIRO */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-1"><CreditCard size={16} className="text-emerald-500" /><h2 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">2. Contato Financeiro</h2></div>
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
             <FormField label="E-mail para Faturas *" value={formData.email_fiscal} onChange={v => setFormData({...formData, email_fiscal: v})} icon={Mail} required placeholder="financeiro@empresa.com" />
             <FormField label="WhatsApp Financeiro" value={formData.whatsapp_financeiro} onChange={v => setFormData({...formData, whatsapp_financeiro: v})} icon={Smartphone} placeholder="(21) 99999-0000" />
             <FormField label="Telefone Fixo" value={formData.telefone_fixo_fiscal} onChange={v => setFormData({...formData, telefone_fixo_fiscal: v})} icon={Phone} placeholder="(21) 2222-0000" />
          </div>
        </section>

        {/* Fix: Added Info icon import to the header of the file */}
        <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
          <Info size={20} className="text-blue-500 shrink-0 mt-1" />
          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
            Essas informações são utilizadas exclusivamente para emissão de notas fiscais de serviços (Ads, Patrocínios) e comunicações de cobrança.
          </p>
        </div>

      </div>

      {showSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span className="font-black text-xs uppercase tracking-widest">Dados Fiscais Salvos!</span>
        </div>
      )}
    </div>
  );
};
