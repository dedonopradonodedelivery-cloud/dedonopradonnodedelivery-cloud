
import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  ArrowRight, 
  X, 
  Loader2, 
  Building2, 
  User, 
  Smartphone,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import { ExplanatoryVideoModal } from './ExplanatoryVideoModal';

interface MasterSponsorshipCardProps {
  isAvailable?: boolean; // Toggle to test "Occupied" state
}

export const MasterSponsorshipCard: React.FC<MasterSponsorshipCardProps> = ({ isAvailable = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [formStep, setFormStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    whatsapp: ''
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1) $2');
    }
    setFormData({ ...formData, whatsapp: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || formData.whatsapp.length < 14) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFormStep('success');
    }, 1500);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setFormStep('form');
      setFormData({ name: '', company: '', whatsapp: '' });
    }, 300);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
        
        {/* Badge Discreto */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-md mb-3 border border-amber-100 dark:border-amber-800/30">
            <Crown className="w-3 h-3" strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-widest">Exclusivo</span>
        </div>

        {/* Títulos */}
        <h3 className="text-lg font-black text-gray-900 dark:text-white font-display leading-tight mb-1">
            Patrocinador Master – Jacarepaguá
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-5">
            Sua marca em destaque para toda a região.
        </p>

        {/* 3 Bullets Curtos */}
        <ul className="space-y-2 mb-6">
            {[
                "Logo no topo do app (Menu & Home)",
                "Banner fixo na tela Explorar",
                "Exclusividade no seu segmento"
            ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    <div className="mt-0.5 w-3.5 h-3.5 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" strokeWidth={3} />
                    </div>
                    {item}
                </li>
            ))}
        </ul>

        {/* Bloco de Investimento */}
        {isAvailable && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">A partir de</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">R$ 2.000</span>
                    <span className="text-xs text-gray-500 font-bold">/ mês</span>
                </div>
                <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-wide mt-1">
                    Condição de fundador disponível
                </p>
            </div>
        )}

        {/* Ações */}
        <div className="flex flex-col gap-3">
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
            >
                Tenho interesse
                <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
                onClick={() => setShowVideo(true)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors py-2"
            >
                <PlayCircle className="w-4 h-4" />
                Ver como funciona
            </button>
        </div>
      </div>

      {/* --- INTEREST MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl relative flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {formStep === 'form' ? (
              <>
                <div className="text-center mb-8 pt-4">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100 dark:border-amber-800/50">
                    <Crown className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                    Patrocínio Master
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    Vamos te chamar no WhatsApp para apresentar as condições e verificar disponibilidade.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Seu Nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Nome completo"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">Nome da Empresa</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Nome do seu negócio"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 ml-1">WhatsApp</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel" 
                        required
                        value={formData.whatsapp}
                        onChange={handlePhoneChange}
                        placeholder="(21) 99999-9999"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Interesse'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recebido!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
                  Obrigado, {formData.name.split(' ')[0]}. <br/>
                  Nossa equipe comercial entrará em contato pelo WhatsApp em breve.
                </p>
                <button 
                  onClick={handleClose}
                  className="text-amber-600 dark:text-amber-400 font-bold text-sm hover:underline"
                >
                  Voltar ao painel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ExplanatoryVideoModal 
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl="https://videos.pexels.com/video-files/853835/853835-sd_640_360_25fps.mp4"
        title="Benefícios do Patrocinador Master"
      />
    </>
  );
};
