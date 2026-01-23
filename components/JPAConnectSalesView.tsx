
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Users, 
  Handshake, 
  ArrowRight,
  Lock,
  Target,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock as ClockIcon,
  Quote,
  Sparkles,
  UserCheck,
  Award,
  Coffee,
  Building,
  BarChart2,
  X,
  Loader2,
  Send
} from 'lucide-react';

interface JPAConnectSalesViewProps {
  onBack: () => void;
}

const BenefitItem: React.FC<{ icon: React.ElementType, title: string, description: string, iconColor: string }> = ({ icon: Icon, title, description, iconColor }) => (
  <div className="flex items-start gap-4">
    <div className={`w-10 h-10 rounded-2xl bg-${iconColor}-50 dark:bg-${iconColor}-900/20 flex items-center justify-center shrink-0 border border-${iconColor}-100 dark:border-${iconColor}-800/50`}>
        <Icon className={`w-5 h-5 text-${iconColor}-600 dark:text-${iconColor}-400`} />
    </div>
    <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
);

const ApplicationModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
    const [formData, setFormData] = useState({ name: '', company: '', segment: '', whatsapp: '', email: '', reason: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulação de envio
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-900 w-full max-w-md h-[90vh] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
                onClick={e => e.stopPropagation()}
            >
              {/* Cabeçalho Persistente */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0 relative flex items-center justify-center">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full absolute top-2 left-1/2 -translate-x-1/2"></div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white pt-4">
                      {isSuccess ? "Confirmação" : "Formulário de Aplicação"}
                  </h2>
                  <button 
                      onClick={onClose} 
                      className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
                  >
                      <X size={20} />
                  </button>
              </div>

              {isSuccess ? (
                  <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Aplicação enviada com sucesso ✅</h3>
                      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 max-w-sm leading-relaxed">
                        <p>Sua aplicação para o Freguesia Connect foi enviada com sucesso.</p>
                        <p>Nossa equipe irá analisar seus dados e entraremos em contato pelo WhatsApp em até 72 horas.</p>
                        <p>Agradecemos seu interesse em fazer parte desse grupo exclusivo de empresários.</p>
                      </div>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
                      <input name="name" type="text" placeholder="Nome completo" required onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-white" />
                      <input name="company" type="text" placeholder="Nome fantasia da empresa" required onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-white" />
                      <input name="segment" type="text" placeholder="Segmento de atuação" required onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-white" />
                      <input name="whatsapp" type="tel" placeholder="WhatsApp" required onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-white" />
                      <input name="email" type="email" placeholder="E-mail" required onChange={handleChange} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium dark:text-white" />
                      <textarea name="reason" placeholder="Por que você acredita que deveria fazer parte desse seleto grupo de empresários?" required onChange={handleChange} rows={5} className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium resize-none dark:text-white"></textarea>
                      <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} Enviar aplicação
                      </button>
                  </form>
              )}
            </div>
        </div>
    );
};

export const JPAConnectSalesView: React.FC<JPAConnectSalesViewProps> = ({ onBack }) => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative">
      
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Freguesia Connect</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <section className="p-8 text-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-gray-900 shadow-xl">
                <Handshake className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight mb-3">
                Freguesia Connect
            </h2>
            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 max-w-sm mx-auto">
                Networking exclusivo entre empresários do seu bairro
            </p>
            <div className="max-w-md mx-auto mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
              <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed font-semibold">
                  O Freguesia Connect não é um grupo de vendas. É um ambiente exclusivo de relacionamento, troca e conexão real entre donos de negócios do mesmo bairro.
              </p>
            </div>
        </section>

        <div className="px-6 space-y-12">
            <section>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  O Freguesia Connect foi criado para empresários que querem conhecer outros donos de negócios relevantes da sua região, criar laços reais e fazer parte de um círculo seleto de confiança local.
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-bold mt-4">
                  Aqui, você não conhece estranhos. Você conhece empresários que constroem, investem e crescem no mesmo bairro que você.
              </p>
            </section>
            
            <section className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Exclusividade do Grupo</h3>
                <div className="space-y-5">
                    <BenefitItem icon={Users} title="20 a 30 empresários" description="Grupos seletos para garantir conexões de qualidade." iconColor="blue"/>
                    <BenefitItem icon={Lock} title="Apenas 1 por nicho" description="Garantimos exclusividade, sem concorrência interna." iconColor="purple"/>
                    <BenefitItem icon={UserCheck} title="Entrada via Aplicação" description="Membros escolhidos para garantir a seriedade e o foco do grupo." iconColor="emerald"/>
                </div>
            </section>

            <section>
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Como funcionam os encontros</h3>
                 <div className="space-y-3">
                    <BenefitItem icon={Calendar} title="Encontros semanais" description="Reuniões presenciais para manter a conexão ativa e gerar oportunidades." iconColor="blue"/>
                    <BenefitItem icon={MapPin} title="Local: auditório" description="Nossos encontros acontecem em um local parceiro e profissional." iconColor="blue"/>
                    <BenefitItem icon={ClockIcon} title="Duração: ~1h30min" description="Tempo otimizado para networking e apresentações." iconColor="blue"/>
                 </div>
            </section>
            
            <section className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/50">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-5 text-center">Dinâmica do Encontro</h3>
                <div className="space-y-4">
                    <BenefitItem icon={Coffee} title="Recepção (20 min)" description="Coffee break para conversas informais e primeiras conexões." iconColor="indigo"/>
                    <BenefitItem icon={Award} title="Apresentações (5 min/cada)" description="Cada membro apresenta seu negócio e o cliente que procura." iconColor="indigo"/>
                    <BenefitItem icon={Handshake} title="Networking Final (20 min)" description="Troca de contatos e conversas estratégicas." iconColor="indigo"/>
                </div>
            </section>

            <section>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-sm font-bold text-center mb-3">Valor do Investimento</h3>
                    <p className="text-4xl font-black text-center text-gray-900 dark:text-white">R$ 200,00</p>
                    <p className="text-center text-sm font-bold text-gray-400">mensais</p>
                </div>
            </section>
            
            <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-center border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    O maior valor do grupo não está na venda direta. Está em conviver, conversar e criar proximidade com outros donos de negócios relevantes da sua região.
                </p>
            </section>
        </div>
      </main>

      <footer className="fixed bottom-[80px] left-0 right-0 p-5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-30 max-w-md mx-auto">
        <div className="text-center mb-3">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Vagas limitadas e participação sujeita à aprovação.</p>
        </div>
        <button 
            onClick={() => setIsApplicationOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base py-5 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            Quero fazer minha aplicação
            <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </footer>

      {isApplicationOpen && <ApplicationModal onClose={() => setIsApplicationOpen(false)} />}
    </div>
  );
};
