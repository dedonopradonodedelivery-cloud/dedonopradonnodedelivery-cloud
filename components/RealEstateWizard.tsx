
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
    ChevronLeft, X, ArrowRight, Camera, CheckCircle2, 
    AlertTriangle, ShieldCheck, MapPin, Building2, 
    CreditCard, QrCode, Copy, Loader2, Info, Check, 
    Maximize2, Car, DollarSign, FileText, Smartphone,
    Plus, Star, LayoutGrid, Award,
    // Fix: Added missing Crown icon import
    Crown
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

interface RealEstateWizardProps {
  user: User | null;
  onBack: () => void;
  onComplete: () => void;
  onNavigate?: (view: string) => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const RealEstateWizard: React.FC<RealEstateWizardProps> = ({ user, onBack, onComplete, onNavigate }) => {
  const [step, setStep] = useState<WizardStep>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHighVisibilitySelected, setIsHighVisibilitySelected] = useState(false);
  
  // Lógica de Monetização
  const [adsPublishedCount] = useState(2); // Simulação: Usuário já atingiu o limite de 2
  const [isAdditionalFeeApplied, setIsAdditionalFeeApplied] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    type: '',
    images: [] as string[],
    negotiation: 'Alugar', // 'Alugar' | 'Vender'
    area: '',
    parking: '0',
    condo: '',
    iptu: '',
    details: [] as string[],
    title: '',
    description: '',
    cep: '',
    neighborhood: '',
    contactWhatsapp: '',
    contactPhone: '',
    contactEmail: user?.email || '',
    price: '',
    paymentMethod: 'pix' as 'pix' | 'card'
  });

  const nextStep = () => {
      if (step === 8 && isHighVisibilitySelected) {
          setStep(10);
      } else {
          setStep(prev => (prev + 1) as WizardStep);
      }
  };

  const prevStep = () => setStep(prev => (prev - 1) as WizardStep);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const toggleDetail = (detail: string) => {
    setFormData(prev => ({
        ...prev,
        details: prev.details.includes(detail) 
            ? prev.details.filter(d => d !== detail) 
            : [...prev.details, detail]
    }));
  };

  const handlePublishClick = () => {
      const isPaid = isAdditionalFeeApplied || isHighVisibilitySelected;
      
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          if (isPaid) {
              setStep(11); // Tela de pagamento
          } else {
              setStep(12); // Sucesso direto
          }
      }, 2000);
  };

  const handlePaymentConfirmed = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setStep(12); // Sucesso
      }, 1500);
  };

  const formatPrice = (val: string | number) => {
    const numeric = typeof val === 'string' ? parseFloat(val || '0') : val;
    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const isLowPrice = useMemo(() => {
      const p = parseFloat(formData.price || '0');
      if (formData.negotiation === 'Alugar') return p < 500 && p > 0;
      return p < 50000 && p > 0;
  }, [formData.price, formData.negotiation]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anunciante';

  const renewalDate = useMemo(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    return nextMonth.toLocaleDateString('pt-BR');
  }, []);

  const totalToPay = useMemo(() => {
      let total = 0;
      if (isAdditionalFeeApplied) total += 19.90;
      if (isHighVisibilitySelected) total += 49.99;
      return total;
  }, [isAdditionalFeeApplied, isHighVisibilitySelected]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col font-sans animate-in fade-in duration-500 overflow-x-hidden">
      
      {step < 12 && (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={step === 1 ? onBack : prevStep} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div className="flex-1 text-center">
             <h1 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Anunciar Imóvel Comercial</h1>
          </div>
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-red-500"><X size={20}/></button>
        </header>
      )}

      <main className="flex-1 p-6 max-w-md mx-auto w-full pb-40 overflow-y-auto no-scrollbar">
        
        {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                        Olá, {userName}!
                    </h2>
                    <p className="text-lg font-bold text-gray-500 dark:text-gray-400">O que você gostaria de anunciar hoje?</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {['Sala comercial', 'Escritório', 'Loja', 'Galpão', 'Depósito', 'Fábrica', 'Garagem / Vaga', 'Outros'].map(type => (
                        <button 
                            key={type}
                            onClick={() => { setFormData({...formData, type}); nextStep(); }}
                            className={`p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all group active:scale-[0.98] ${formData.type === type ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300'}`}
                        >
                            <span className="font-bold text-sm">{type}</span>
                            <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Adicione fotos do seu imóvel</h2>
                    <p className="text-sm text-gray-500 font-medium">Anúncios com fotos têm muito mais visualizações.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100">
                            <img src={img} className="w-full h-full object-cover" />
                            <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full"><X size={14}/></button>
                        </div>
                    ))}
                    {formData.images.length < 10 && (
                        <label className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm">
                                <Plus />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Adicionar Fotos</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>

                <div className="pt-8">
                    <button 
                        onClick={nextStep}
                        disabled={formData.images.length === 0}
                        className="w-full bg-[#1E5BFF] disabled:bg-gray-100 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        Continuar <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Informações básicas do imóvel</h2>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tipo de negociação</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Alugar', 'Vender'].map(n => (
                                <button key={n} onClick={() => setFormData({...formData, negotiation: n})} className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.negotiation === n ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-400'}`}>{n}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Área (m²)</label>
                            <div className="relative">
                                <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="00" className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-12 rounded-2xl border-none outline-none font-bold" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Vagas</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select value={formData.parking} onChange={e => setFormData({...formData, parking: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-12 rounded-2xl border-none outline-none font-bold appearance-none">
                                    {['0','1','2','3','4','5+'].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Condomínio (R$)</label>
                            <input type="number" value={formData.condo} onChange={e => setFormData({...formData, condo: e.target.value})} placeholder="Opcional" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">IPTU (R$)</label>
                            <input type="number" value={formData.iptu} onChange={e => setFormData({...formData, iptu: e.target.value})} placeholder="Opcional" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold" />
                        </div>
                    </div>
                </div>

                <button onClick={nextStep} disabled={!formData.area} className="w-full mt-6 bg-[#1E5BFF] disabled:bg-gray-100 disabled:text-gray-400 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">Avançar</button>
            </div>
        )}

        {step === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Detalhes do imóvel</h2>
                
                <div className="grid grid-cols-1 gap-3">
                    {['Garagem', 'Segurança 24h', 'Câmeras de segurança', 'Elevador', 'Portaria', 'Acesso para deficientes'].map(detail => {
                        const isSelected = formData.details.includes(detail);
                        return (
                            <button 
                                key={detail} 
                                onClick={() => toggleDetail(detail)}
                                className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${isSelected ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-400'}`}
                            >
                                <span className="text-sm font-bold">{detail}</span>
                                {isSelected ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-100"></div>}
                            </button>
                        );
                    })}
                </div>

                <button onClick={nextStep} className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">Continuar</button>
            </div>
        )}

        {(step === 5 || step === 6) && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">Capriche no seu anúncio</h2>
                    <p className="text-sm text-gray-500 font-medium">Anúncios mais completos geram mais contatos e fecham mais rápido.</p>
                </div>

                <div className="space-y-5">
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Título (Ex: Excelente Sala Comercial 40m²)" className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white" />
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descrição completa do imóvel..." rows={5} className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-medium dark:text-white resize-none" />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} placeholder="CEP" className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white" />
                        <select value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold dark:text-white appearance-none">
                            <option value="">Bairro</option>
                            {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contato para interessados</h4>
                        <div className="relative">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={formData.contactWhatsapp} onChange={e => setFormData({...formData, contactWhatsapp: e.target.value})} placeholder="WhatsApp" className="w-full bg-gray-50 dark:bg-gray-800 p-4 pl-12 rounded-2xl border-none outline-none font-bold" />
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-3xl border border-yellow-200 dark:border-yellow-800/30 flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs text-amber-800 dark:text-amber-200 font-black uppercase tracking-widest">Atenção</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                            O Localizei JPA não solicita códigos, pagamentos ou comprovantes por ligação, chat ou WhatsApp. Desconfie de contatos fora da plataforma.
                        </p>
                    </div>
                </div>

                <button onClick={nextStep} disabled={!formData.title || !formData.neighborhood} className="w-full bg-[#1E5BFF] disabled:bg-gray-100 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">Continuar</button>
            </div>
        )}

        {step === 7 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Defina o preço do seu imóvel</h2>
                
                <div className="space-y-6">
                    <div className="relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400 group-focus-within:text-blue-600 transition-colors">R$</span>
                        <input 
                            type="number" 
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            placeholder="0,00" 
                            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 py-6 pl-16 pr-5 text-4xl font-black text-gray-900 dark:text-white outline-none focus:border-blue-600 rounded-3xl shadow-inner" 
                        />
                    </div>

                    {isLowPrice && (
                        <div className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-3xl border border-rose-200 dark:border-rose-800/30 animate-in zoom-in duration-300">
                            <div className="flex gap-3">
                                <AlertTriangle className="text-rose-600 shrink-0" />
                                <div>
                                    <p className="text-xs text-rose-800 dark:text-rose-200 font-bold leading-relaxed">Esse valor está abaixo do mercado. Deseja revisar antes de continuar?</p>
                                    <div className="flex gap-4 mt-3">
                                        <button onClick={() => setFormData({...formData, price: ''})} className="text-[10px] font-black uppercase text-rose-600 underline">Ajustar valor</button>
                                        <button onClick={nextStep} className="text-[10px] font-black uppercase text-gray-400">Continuar mesmo assim</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!isLowPrice && (
                    <button onClick={nextStep} disabled={!formData.price} className="w-full bg-[#1E5BFF] disabled:bg-gray-100 text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs">Próximo</button>
                )}
            </div>
        )}

        {step === 8 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300 py-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#1E5BFF] shadow-sm border border-blue-100">
                        <Info size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Limite gratuito atingido</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-4 leading-relaxed">
                        Você já utilizou seus 2 anúncios gratuitos neste mês.<br/>
                        Sua cota renova em <strong className="text-gray-900 dark:text-white">{renewalDate}</strong>.
                    </p>
                </div>

                <div className="space-y-4 pt-6">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">Para continuar anunciando agora:</p>
                    
                    {/* PLANOS MENSAIS (UPSELL) */}
                    <button 
                        onClick={() => onNavigate?.('plan_selection')}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-black p-6 rounded-3xl border-2 border-slate-700 flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                <Crown size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-sm">Assinar Plano Mensal</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Anúncios Ilimitados + Selo</p>
                            </div>
                        </div>
                        <ArrowRight size={18} />
                    </button>

                    <button 
                        onClick={() => { setIsAdditionalFeeApplied(true); setIsHighVisibilitySelected(false); nextStep(); }}
                        className="w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
                                <LayoutGrid size={24} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-sm dark:text-white">Publicação Avulsa</h3>
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Apenas 1 anúncio adicional</p>
                            </div>
                        </div>
                        <div className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">R$ 19,90</div>
                    </button>
                </div>
            </div>
        )}

        {step === 9 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Quer mais visibilidade?</h2>
                    <p className="text-sm text-gray-500 font-medium">Acelere o fechamento do seu negócio.</p>
                </div>

                <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group cursor-pointer ${isHighVisibilitySelected ? 'bg-indigo-950 border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800'}`} onClick={() => setIsHighVisibilitySelected(!isHighVisibilitySelected)}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg">
                                <Star size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className={`font-black text-lg leading-tight uppercase tracking-tight ${isHighVisibilitySelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Destaque do bairro</h3>
                                <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mt-1 animate-pulse">Apareça no topo de JPA</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isHighVisibilitySelected ? 'bg-emerald-50 border-emerald-500 text-white' : 'border-gray-200'}`}>
                            {isHighVisibilitySelected && <Check size={14} strokeWidth={4} />}
                        </div>
                    </div>

                    <p className={`text-xs leading-relaxed font-medium mb-8 ${isHighVisibilitySelected ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        Seu imóvel aparece fixo no topo da categoria, com muito mais visualizações e o selo de destaque.
                    </p>

                    <div className="flex items-baseline gap-3 relative z-10">
                        <span className="text-xs text-gray-400 line-through font-bold">De R$ 89,99</span>
                        <span className={`text-2xl font-black ${isHighVisibilitySelected ? 'text-white' : 'text-[#1E5BFF]'}`}>Por R$ 49,99</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button onClick={nextStep} className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Continuar para resumo</button>
                </div>
            </div>
        )}

        {step === 10 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Resumo do Anúncio</h2>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <img src={formData.images[0]} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{formData.title}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formData.type} • {formData.neighborhood}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-medium">Negociação:</span>
                            <span className="font-bold text-gray-900 dark:text-white uppercase">{formData.negotiation}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400 font-medium">Preço Imóvel:</span>
                            <span className="font-black text-[#1E5BFF] italic">{formatPrice(formData.price)}</span>
                        </div>
                        
                        {isAdditionalFeeApplied && (
                             <div className="flex justify-between text-xs text-gray-500">
                                <span className="font-medium uppercase tracking-widest">Publicação Adicional:</span>
                                <span className="font-black">R$ 19,90</span>
                            </div>
                        )}

                        {isHighVisibilitySelected && (
                            <div className="flex justify-between text-xs text-amber-500">
                                <span className="font-bold uppercase tracking-widest">⭐ Destaque do Bairro:</span>
                                <span className="font-black">R$ 49,99</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase">Total a pagar:</span>
                        <span className="text-2xl font-black text-emerald-600">
                            {formatPrice(totalToPay)}
                        </span>
                    </div>
                </div>

                <button 
                    onClick={handlePublishClick}
                    disabled={isProcessing}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Publicar Anúncio'}
                </button>
            </div>
        )}

        {step === 11 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Pagamento</h2>
                
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                   <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total do Pedido</p>
                        <p className="text-4xl font-black text-emerald-600">{formatPrice(totalToPay)}</p>
                   </div>

                   <div className="space-y-3">
                       <button onClick={() => setFormData({...formData, paymentMethod: 'pix'})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.paymentMethod === 'pix' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'}`}>
                           <div className="flex items-center gap-3"><QrCode size={20}/><span className="font-bold text-sm">PIX (Imediato)</span></div>
                           {formData.paymentMethod === 'pix' && <CheckCircle2 size={18} />}
                       </button>
                       <button onClick={() => setFormData({...formData, paymentMethod: 'card'})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'}`}>
                           <div className="flex items-center gap-3"><CreditCard size={20}/><span className="font-bold text-sm">Cartão de Crédito</span></div>
                           {formData.paymentMethod === 'card' && <CheckCircle2 size={18} />}
                       </button>
                   </div>
                </div>

                <button 
                    onClick={handlePaymentConfirmed}
                    disabled={isProcessing}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirmar Pagamento'}
                </button>
            </div>
        )}

        {step === 12 && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                    Anúncio publicado com sucesso! 🎉
                </h2>
                {isHighVisibilitySelected && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full border border-amber-100 dark:border-amber-800/30 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-8">
                        Seu imóvel já está em destaque no bairro
                    </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12">
                    Moradores e empresários do bairro agora podem encontrar seu imóvel comercial.
                </p>

                <div className="w-full space-y-4">
                    <button 
                        onClick={onComplete}
                        className="w-full bg-gray-900 dark:bg-white dark:text-black text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-[0.98] transition-all"
                    >
                        Ver meus anúncios
                    </button>
                    <button 
                        onClick={onComplete}
                        className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest"
                    >
                        Voltar para início
                    </button>
                </div>
            </div>
        )}

      </main>

      <div className="h-20"></div>
    </div>
  );
};
