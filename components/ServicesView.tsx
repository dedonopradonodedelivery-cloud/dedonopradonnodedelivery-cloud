
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
  AlertCircle
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { ServiceRequest, ServiceUrgency } from '../types';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { ClassifiedsBannerCarousel } from './ClassifiedsBannerCarousel';

type FlowStep = 'intro' | 'form' | 'success';

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
  const [step, setStep] = useState<FlowStep>('intro');
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

  // Validação real e sincronizada
  const isClientNameValid = formData.clientName.trim().length >= 2;
  const isDescriptionValid = formData.description.trim().length >= 10;
  const isServiceTypeValid = formData.serviceType.length >= 3;
  const isNeighborhoodValid = formData.neighborhood !== "";
  const isUrgencyValid = !!formData.urgency;

  const isFormValid = useMemo(() => {
    return isClientNameValid && isServiceTypeValid && isDescriptionValid && isNeighborhoodValid && isUrgencyValid;
  }, [isClientNameValid, isServiceTypeValid, isDescriptionValid, isNeighborhoodValid, isUrgencyValid]);

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
    
    // Gerar número único do pedido
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const requestId = `REQ-${orderNumber}`;

    const newRequest: ServiceRequest = {
        id: requestId,
        userId: 'current-user-id',
        userName: formData.clientName,
        serviceType: formData.serviceType,
        description: formData.description,
        neighborhood: formData.neighborhood,
        urgency: formData.urgency,
        images: formData.images,
        status: 'open',
        createdAt: new Date().toISOString()
    };

    // Salvar no mock local
    const existing = JSON.parse(localStorage.getItem('service_requests_mock') || '[]');
    localStorage.setItem('service_requests_mock', JSON.stringify([newRequest, ...existing]));

    // Seta o ID criado para o botão de sucesso usar depois
    setCreatedRequestId(requestId);

    // Feedback de carregamento antes de mostrar a tela de sucesso
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  const filteredServices = useMemo(() => {
    return SERVICE_TYPES.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase()));
  }, [serviceSearch]);

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 animate-in fade-in duration-500">
        <header className="px-6 pt-12 pb-6 flex items-center gap-4">
          <button onClick={() => onNavigate('classifieds')} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90"><ChevronLeft size={20}/></button>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Serviços Locais</h1>
        </header>

        <main className="p-6 pt-0 space-y-12 pb-32">
          
          <ClassifiedsBannerCarousel categoryName="services" />

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#1E5BFF]">
              <Wrench size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">Precisa de um serviço?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto font-medium">Descreva o que você precisa e receba até 5 propostas gratuitas de profissionais da sua região.</p>
          </div>

          <div className="space-y-6">
            {[
                { step: 1, title: 'Descreva o serviço', sub: 'Conte o que você precisa e adicione fotos.' },
                { step: 2, title: 'Profissionais recebem', sub: 'O pedido é enviado para especialistas do bairro.' },
                { step: 3, title: 'Converse pelo chat', sub: 'Receba orçamentos e feche o serviço por aqui.' }
            ].map((item) => (
                <div key={item.step} className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-black text-[#1E5BFF] shrink-0 border border-gray-100 dark:border-gray-700">{item.step}</div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 font-medium">{item.sub}</p>
                    </div>
                </div>
            ))}
          </div>

          <div className="pt-8">
            <button 
              onClick={() => setStep('form')}
              className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              Pedir orçamento gratuito <ArrowRight size={18} />
            </button>
          </div>

          <section>
            <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Serviços" />
          </section>
        </main>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 animate-in slide-in-from-right duration-300">
        <form onSubmit={handleSubmit} className="pb-80">
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setStep('intro')} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-all active:scale-90"><ChevronLeft size={20}/></button>
              <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Solicitação de Orçamento Grátis</h1>
            </div>
          </header>

          <main className="p-6 space-y-8">
            <div className="space-y-6">

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nome do cliente *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                  placeholder="Digite seu nome"
                  className={`w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border transition-all outline-none dark:text-white font-bold ${
                    formData.clientName.length > 0 && !isClientNameValid ? 'border-amber-200' : 'border-transparent focus:border-[#1E5BFF]'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Tipo de Serviço *</label>
                <button 
                  type="button"
                  onClick={() => setIsServiceModalOpen(true)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent text-left flex items-center justify-between dark:text-white font-bold transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className={formData.serviceType ? "text-gray-900 dark:text-white" : "text-gray-400"}>
                    {formData.serviceType || "Selecione o serviço"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Descrição detalhada *</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="O que exatamente você precisa?"
                  rows={4}
                  className={`w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border transition-all outline-none dark:text-white font-medium resize-none ${
                    formData.description.length > 0 && !isDescriptionValid ? 'border-amber-200' : 'border-transparent focus:border-[#1E5BFF]'
                  }`}
                  required
                />
                {formData.description.length > 0 && !isDescriptionValid && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase mt-2 ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> Mínimo de 10 caracteres
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Bairro de Jacarepaguá *</label>
                <select 
                  value={formData.neighborhood}
                  onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-transparent focus:border-[#1E5BFF] outline-none dark:text-white font-bold appearance-none"
                  required
                >
                  <option value="">Selecione o bairro</option>
                  {NEIGHBORHOODS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Urgência *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hoje', 'Essa semana', 'Sem pressa'] as const).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({...formData, urgency: u})}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.urgency === u ? 'bg-blue-50 border-[#1E5BFF] text-[#1E5BFF]' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fotos (Máx 3)</label>
                  <span className="text-[10px] font-bold text-gray-400">{formData.images.length}/3</span>
                </div>
                <div className="flex gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
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
          </main>

          {/* FOOTER FIXO ACIMA DA BOTTOM NAV */}
          <footer className="fixed bottom-[80px] left-0 right-0 p-6 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 max-w-md mx-auto z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <button 
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full font-black py-5 rounded-[2rem] shadow-xl transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 ${
                isFormValid && !isSubmitting
                  ? 'bg-[#1E5BFF] text-white shadow-blue-500/20 active:scale-[0.98] cursor-pointer'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200'
              }`}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Solicitar orçamento gratuito 
                  <Zap size={16} fill="currentColor" />
                </>
              )}
            </button>
          </footer>
        </form>

        {/* MODAL DE SELEÇÃO DE SERVIÇO */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsServiceModalOpen(false)}>
              <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 shrink-0"></div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2 shrink-0">Tipo de Serviço</h3>
                  
                  <div className="relative mb-4 shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      placeholder="Pesquisar serviço..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3 pl-11 pr-4 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 dark:text-white"
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
                      {filteredServices.length === 0 && (
                        <div className="py-12 text-center text-gray-400">
                          <p className="text-sm font-medium uppercase tracking-widest">Nenhum serviço encontrado</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-4">Pedido Enviado!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed mb-12">
            Seu pedido foi enviado para até 5 profissionais da sua região. Em instantes, os interessados entrarão em contato via chat.
        </p>
        <button 
          onClick={() => {
            if (onOpenChat && createdRequestId) {
              onOpenChat(createdRequestId);
            } else {
              onNavigate('home');
            }
          }}
          className="w-full max-w-sm bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
        >
          Acompanhar pelo chat
        </button>
      </div>
    );
  }

  return null;
};
