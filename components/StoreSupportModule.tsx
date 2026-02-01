import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Copy, 
  CheckCircle2, 
  Send, 
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StoreSupportModuleProps {
  onBack: () => void;
}

export const StoreSupportModule: React.FC<StoreSupportModuleProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const supportEmail = "contato.localizeijpa@gmail.com";
  const storeName = user?.user_metadata?.store_name || "Sua Loja";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const mailSubject = `Suporte Localizei JPA – ${storeName}`;
    const mailBody = `Nome da loja: ${storeName}\nBairro: ${user?.user_metadata?.neighborhood || ''}\nAssunto: \nDescrição do problema: \nPrints (se houver):`;
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Registro local simulado
    console.log("Chamado aberto:", { subject, category, description, store: storeName, date: new Date().toISOString() });
    setFormSubmitted(true);
    setSubject('');
    setCategory('');
    setDescription('');
  };

  const faqItems = [
    {
      q: "Como atualizo as informações da minha loja?",
      a: "Acesse “Minha Loja (Perfil Público)” no painel e salve as alterações."
    },
    {
      q: "Como funcionam os leads de serviços?",
      a: "Você escolhe participar e libera contatos conforme os pedidos do bairro."
    },
    {
      q: "Onde vejo meus pagamentos?",
      a: "Acesse “Pagamentos” no painel para histórico, faturas e assinaturas."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Suporte</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Precisa de ajuda? Fale com a gente.</p>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        
        {/* Bloco de Contato Direto */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF]">
              <Mail size={28} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              Nos conte o que você precisa e nossa equipe vai te responder o mais rápido possível.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Canal Oficial</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{supportEmail}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleSendEmail}
                className="bg-[#1E5BFF] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={14} /> Enviar e-mail
              </button>
              <button 
                onClick={handleCopyEmail}
                className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-2xl text-xs uppercase tracking-widest border border-gray-100 dark:border-gray-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />} 
                {copied ? 'Copiado' : 'Copiar e-mail'}
              </button>
            </div>
          </div>
        </section>

        {/* Formulário Interno */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Abrir Solicitação</h3>
          
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
            {formSubmitted ? (
              <div className="py-6 flex flex-col items-center text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Solicitação enviada</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Em breve entraremos em contato por e-mail.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="mt-8 text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest underline"
                >
                  Enviar outra dúvida
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1.5">Categoria</label>
                  <select 
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#1E5BFF]/50"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="Pagamentos">Pagamentos</option>
                    <option value="Banners / ADS">Banners / ADS</option>
                    <option value="Cupons">Cupons</option>
                    <option value="Leads de Serviços">Leads de Serviços</option>
                    <option value="Perfil da loja">Perfil da loja</option>
                    <option value="Avaliações">Avaliações</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1.5">Assunto</label>
                  <input 
                    type="text" 
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Resumo do seu pedido"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#1E5BFF]/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1.5">Descrição</label>
                  <textarea 
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Nos conte detalhadamente o que houve..."
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <Send size={14} /> Enviar solicitação
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FAQ Rápido */}
        <section className="space-y-4 pb-12">
          <div className="flex items-center gap-2 px-1">
            <HelpCircle size={16} className="text-gray-400" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Dúvidas Rápidas</h3>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      <div className="mt-12 text-center opacity-30 px-10">
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Localizei JPA Suporte <br/> v1.5.0
        </p>
      </div>
    </div>
  );
};