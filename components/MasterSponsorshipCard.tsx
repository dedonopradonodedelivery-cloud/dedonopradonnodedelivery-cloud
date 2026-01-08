
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
  isAvailable?: boolean; 
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
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-xl border border-gray-800 relative overflow-hidden group">
        
        {/* Shine Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-700"></div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-black text-white font-display leading-tight mb-1">
                        Patrocinador Master
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                        Destaque máximo em toda a região.
                    </p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
                    <Crown className="w-6 h-6 text-amber-500" />
                </div>
            </div>

            <ul className="space-y-2 mb-6">
                {[
                    "Logo no topo do app (Menu & Home)",
                    "Banner fixo na tela Explorar",
                    "Exclusividade no seu segmento"
                ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 font-medium">
                        <Check className="w-3.5 h-3.5 text-green-500 mt-0.5" strokeWidth={3} />
                        {item}
                    </li>
                ))}
            </ul>

            <div className="flex gap-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
                >
                    Tenho interesse
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <button 
                    onClick={() => setShowVideo(true)}
                    className="px-3 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
                    title="Ver como funciona"
                >
                    <PlayCircle className="w-5 h-5" />
                </button>
            </div>
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
