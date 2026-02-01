import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  Clock, 
  MapPin, 
  X,
  Zap,
  Loader2,
  Search,
  Check,
  ChevronDown,
  AlertCircle,
  ShieldCheck,
  Star,
  Award,
  Building2
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { ServiceRequest, ServiceUrgency, Store, AdType } from '../types';
import { STORES } from '../constants';

type FlowStep = 'form' | 'success';

interface ServicesViewProps {
  onNavigate: (view: string, data?: any) => void;
  onOpenChat?: (requestId: string) => void;
}

const SERVICE_TYPES = [
  "Eletricista",
  "Encanador",
  "Pintor",
  "Pedreiro",
  "Técnico em Informática",
  "Montador de Móveis",
  "Marido de Aluguel",
  "Faxina / Limpeza Residencial",
  "Diarista",
  "Dedetização",
  "Chaveiro",
  "Segurança",
  "Assistência Técnica",
  "Instalações",
  "Mecânico",
  "Funilaria e Pintura",
  "Auto Elétrica",
  "Borracharia",
  "Banho e Tosa",
  "Veterinário",
  "Fretes e Mudanças",
  "Jardinagem",
  "Costureira",
  "Outros"
];

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onOpenChat }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [step, setStep] = useState<FlowStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    serviceType: '',
    description: '',
    neighborhood: currentNeighborhood === "Jacarepaguá (todos)" ? "" : currentNeighborhood,
    urgency: 'Essa semana' as ServiceUrgency,
    images: [] as string[]
  });

  // Validação
  const isFormValid = useMemo(() => {
    return formData.serviceType.length >= 3 && 
           formData.description.trim().length >= 10 && 
           formData.neighborhood !== "";
  }, [formData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && formData.images.length < 3) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    
    const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: ServiceRequest = {
        id: requestId,
        userId: 'current-user-id',
        userName: formData.clientName || 'Morador Local',
        serviceType: formData.serviceType,
        description: formData.description,
        neighborhood: formData.neighborhood,
        urgency: formData.urgency,
        images: formData.images,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    localStorage.setItem('service_requests_mock', JSON.stringify([newRequest, ...existing]));

    setCreatedRequestId(requestId);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  const filteredServices = useMemo(() => {
    return SERVICE_TYPES.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase()));
  }, [serviceSearch]);

  // Mock de profissionais para a tela de sucesso
  const featuredPros = useMemo(() => {
    return STORES.filter(s => s.category === 'Serviços' || s.category === 'Pro').slice(0, 3);
  }, []);

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 animate-in fade-in duration-500 flex flex-col">
        <header className="px-6 pt-12 pb-4 flex items-center gap-4 border-b border-gray-50 dark:border-gray-900 bg-white dark:bg-gray-950 sticky top-0 z-40">
          <button onClick={() => onNavigate('classifieds')} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 active:scale-90 transition-all"><ChevronLeft size={20}/></button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Pedir Orçamento</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Receba respostas de profissionais do bairro</p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-8 no-scrollbar overflow-y-auto">
          {/* Bloco Informativo Topo */}
          <section className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold leading-relaxed">
              Seu pedido será enviado para profissionais verificados do bairro. Até 5 profissionais podem responder.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">O que você precisa? *</label>
                <button 
                  type="button"
                  onClick={() => setIsServiceModalOpen(true)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-left flex items-center justify-between dark:text-white font-bold transition-all"
                >
                  <span className={formData.serviceType ? "text-gray-900 dark:text-white" : "text-gray-400"}>
                    {formData.serviceType || "Selecione o serviço"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Seu Bairro *</label>
                  <select 
                    value={formData.neighborhood}
                    onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none dark:text-white font-bold appearance-none"
                    required
                  >
                    <option value="">Onde você está?</option>
                    {NEIGHBORHOODS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Prazo *</label>
                  <select 
                    value={formData.urgency}
                    onChange={e => setFormData({...formData, urgency: e.target.value as any})}
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none dark:text-white font-bold appearance-none"
                    required
                  >
                    <option value="Hoje">Hoje</option>
                    <option value="Essa semana">Essa semana</option>
                    <option value="Sem pressa">Sem pressa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Descrição do problema *</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Minha descarga está vazando..."
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 focus:border-[#1E5BFF] outline-none dark:text-white font-medium resize-none"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fotos (Opcional - Máx 3)</label>
                  <span className="text-[10px] font-bold text-gray-400">{formData.images.length}/3</span>
                </div>
                <div className="flex gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                      <img src={img} className="w-full h-full object-cover" alt="Service" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"><X size={10}/></button>
                    </div>
                  ))}
                  {formData.images.length < 3 && (
                    <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-50 transition-all">
                      <Camera size={24} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full font-black py-5 rounded-[2rem] shadow-xl transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 ${
                isFormValid && !isSubmitting
                  ? 'bg-[#1E5BFF] text-white shadow-blue-500/20 active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200'
              }`}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Enviar pedido agora <ArrowRight size={18} /></>}
            </button>
          </form>
        </main>

        {/* MODAL DE SELEÇÃO DE SERVIÇO */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsServiceModalOpen(false)}>
              <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2 shrink-0 text-center">Qual serviço você precisa?</h3>
                  
                  <div className="relative mb-4 shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      placeholder="Pesquisar..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                      {filteredServices.map(service => (
                          <button 
                            key={service} 
                            type="button"
                            onClick={() => {
                              setFormData({...formData, serviceType: service});
                              setIsServiceModalOpen(false);
                              setServiceSearch('');
                            }} 
                            className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${formData.serviceType === service ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
                          >
                              <span>{service}</span>
                              {formData.serviceType === service && <Check className="w-4 h-4" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col p-8 animate-in zoom-in duration-500">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl">
            <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Pedido Enviado!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed mb-8">
                Pedido enviado com sucesso. Profissionais do bairro já foram notificados.
            </p>

            {/* Destaque de Profissionais Pós-Envio */}
            <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-2 px-1">
                    <Award size={14} className="text-amber-500" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profissionais Verificados</h3>
                </div>
                <div className="space-y-3">
                    {featuredPros.map(pro => (
                        <div key={pro.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-1">
                                <img src={pro.logoUrl || pro.image} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white text-xs truncate">{pro.name}</h4>
                                <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                    <Star size={10} fill="currentColor" /> {pro.rating}
                                </div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-2 py-1 rounded text-[8px] font-black uppercase border border-emerald-100 dark:border-emerald-800">
                                Destaque
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[9px] text-gray-400 italic text-center pt-2">
                    Profissionais em destaque costumam responder mais rápido.
                </p>
            </div>
        </div>

        <div className="pt-10 space-y-4">
            <button 
            onClick={() => {
                if (onOpenChat && createdRequestId) {
                onOpenChat(createdRequestId);
                } else {
                onNavigate('service_messages_list');
                }
            }}
            className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
            >
            Acompanhar orçamentos
            </button>
            <button 
            onClick={() => onNavigate('home')}
            className="w-full py-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]"
            >
                Voltar ao início
            </button>
        </div>
      </div>
    );
  }

  return null;
};