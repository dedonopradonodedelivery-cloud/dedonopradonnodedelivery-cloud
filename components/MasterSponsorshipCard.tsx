
import React, { useState } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Loader2, 
  Lock, 
  Clock, 
  Building2, 
  User, 
  Smartphone 
} from 'lucide-react';

interface MasterSponsorshipCardProps {
  isAvailable?: boolean; // Toggle to test "Occupied" state
}

export const MasterSponsorshipCard: React.FC<MasterSponsorshipCardProps> = ({ isAvailable = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
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
    
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      setFormStep('success');
    }, 1500);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Reset form after closing (optional delay)
    setTimeout(() => {
      setFormStep('form');
      setFormData({ name: '', company: '', whatsapp: '' });
    }, 300);
  };

  return (
    <>
      {/* --- CARD DISPLAY --- */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-1 shadow-sm border border-amber-500/30 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600"></div>
        
        <div className="p-7">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  Exclusivo
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight font-display">
                Patrocinador Master <br/> Jacarepaguá
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                Sua marca em destaque para toda a região.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {[
              "Visibilidade fixa no app (Menu & Home)",
              "Destaque institucional (Branding)",
              "Exclusividade por região"
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Price / Status Area */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50">
            {isAvailable ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Investimento</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">A partir de</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">R$ 2.000</span>
                  <span className="text-sm font-bold text-gray-500">/mês</span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                    Condição de fundador disponível
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Cota Master ocupada</p>
                  <p className="text-xs text-gray-500">Entre na lista de espera para a próxima abertura.</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all
              ${isAvailable 
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/20 hover:brightness-110' 
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
          >
            {isAvailable ? 'TENHO INTERESSE' : 'ENTRAR NA LISTA DE ESPERA'}
            <ArrowRight className="w-4 h-4" strokeWidth={3} />
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
            {/* Close Button */}
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
                    {isAvailable ? <Crown className="w-8 h-8 text-amber-500" /> : <Clock className="w-8 h-8 text-amber-500" />}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                    {isAvailable ? 'Patrocínio Master' : 'Lista de Espera'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                    {isAvailable 
                      ? 'Vamos te chamar no WhatsApp para apresentar as condições e verificar disponibilidade.' 
                      : 'Avise-me quando a cota Master estiver disponível novamente.'}
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
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
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
                  Nossa equipe entrará em contato pelo WhatsApp em breve.
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
    </>
  );
};
