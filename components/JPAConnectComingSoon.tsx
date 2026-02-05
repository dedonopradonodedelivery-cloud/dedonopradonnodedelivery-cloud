
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Handshake, 
  CheckCircle2, 
  Users, 
  Zap, 
  MessageSquare, 
  Star,
  Info,
  ArrowRight,
  X,
  Loader2,
  Check,
  Sparkles
} from 'lucide-react';

interface JPAConnectComingSoonProps {
  onBack: () => void;
}

export const JPAConnectComingSoon: React.FC<JPAConnectComingSoonProps> = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    responsibleName: '',
    segment: '',
    whatsapp: '',
    email: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">JPA Connect</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Networking Empresarial</p>
        </div>
      </header>

      <main className="p-6 space-y-10 max-w-md mx-auto w-full">
        
        <section className="text-center space-y-4">
            <div className="w-20 h-20 bg-white dark:bg-indigo-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400 shadow-xl border-4 border-blue-50 dark:border-gray-900">
                <Handshake size={40} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-200">
               <Zap size={10} fill="currentColor" /> Em Breve
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter uppercase">
                Crescendo Juntos.
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Um espaço exclusivo para networking entre lojistas da região.
            </p>
        </section>

        <section className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
            <div className="space-y-5">
                {[
                    { icon: Users, text: "Grupo exclusivo de lojistas parceiros" },
                    { icon: Handshake, text: "Troca de indicações e parcerias" },
                    { icon: Sparkles, text: "Ações especiais e eventos" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-indigo-500">
                            <item.icon size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.text}</span>
                    </div>
                ))}
            </div>
        </section>

        <section className="text-center py-8">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
                Quero fazer parte
                <ArrowRight size={18} strokeWidth={3} />
            </button>
        </section>

      </main>

      {/* FORM MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
              <div 
                className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom relative max-h-[90vh] overflow-y-auto no-scrollbar" 
                onClick={e => e.stopPropagation()}
              >
                  <button onClick={handleCloseModal} className="absolute top-6 right-6 p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">
                    <X size={20} />
                  </button>

                  {isSuccess ? (
                      <div className="text-center py-10">
                          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                              <CheckCircle2 size={48} />
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Sucesso!</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                              Recebemos sua aplicação! Entraremos em contato em breve.
                          </p>
                      </div>
                  ) : (
                      <div className="space-y-6">
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Aplicação</h3>
                          <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da loja</label>
                                  <input required type="text" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} className="w-full bg-blue-50/50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                                  <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-blue-50/50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Por que participar?</label>
                                  <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} rows={3} className="w-full bg-blue-50/50 dark:bg-gray-800 border-none rounded-xl p-4 text-sm font-medium dark:text-white focus:ring-2 focus:ring-blue-500 resize-none" />
                              </div>
                              <button type="submit" className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-4">
                                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Enviar Aplicação'}
                              </button>
                          </form>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
