
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Copy, 
  CheckCircle2, 
  Send, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StoreSupportModuleProps {
  onBack: () => void;
}

export const StoreSupportModule: React.FC<StoreSupportModuleProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const supportEmail = "contato.localizeijpa@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-blue-100 dark:border-gray-800 shadow-sm">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Suporte</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Atendimento ao lojista</p>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-blue-50 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF]">
              <Mail size={28} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              Dúvidas sobre o funcionamento do app? Entre em contato.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <div className="bg-blue-50/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-blue-100 dark:border-gray-800 flex flex-col items-center">
              <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest mb-1">E-mail de Suporte</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{supportEmail}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => window.location.href=`mailto:${supportEmail}`} className="bg-[#1E5BFF] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Enviar E-mail</button>
              <button onClick={handleCopyEmail} className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-2xl text-xs uppercase tracking-widest border border-blue-50 dark:border-gray-700 active:scale-95 transition-all">
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
