
import React from 'react';
import { User } from '@supabase/supabase-js';
import { 
    ChevronLeft, 
    ArrowRight, 
    Wrench, 
    FileText, 
    MessageSquare, 
    CheckCircle2 
} from 'lucide-react';

interface ServicesLandingViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const ServicesLandingView: React.FC<ServicesLandingViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  
  const handleRequestQuote = () => {
    if (user) {
      onNavigate('services');
    } else {
      onRequireLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans animate-in fade-in duration-500">
      
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Orçamento de Serviços</h1>
      </header>

      <main className="overflow-y-auto no-scrollbar pb-12">
        
        {/* 1. New Vibrant Banner */}
        <section className="p-6">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/10 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-64">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 mb-8 animate-float-slow shadow-lg">
                <Wrench size={48} className="text-white drop-shadow-lg" />
              </div>
              <button 
                onClick={handleRequestQuote} 
                className="w-full max-w-xs bg-white text-blue-600 font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                Pedir orçamento gratuito
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* 3. "Como funciona" Title */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display tracking-tight">
            Como funciona
          </h2>
        </section>

        {/* 4. Redesigned Steps */}
        <section className="px-6 space-y-6">
          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-5xl font-black text-blue-100 dark:text-blue-900/50">1</div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-blue-500"/>
                <h4 className="font-bold text-gray-900 dark:text-white">Descreva o serviço</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Conte o que você precisa e adicione fotos para ajudar os profissionais.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-5xl font-black text-blue-100 dark:text-blue-900/50">2</div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-blue-500"/>
                <h4 className="font-bold text-gray-900 dark:text-white">Receba propostas</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Até 5 profissionais verificados enviam orçamentos pelo chat interno do Localizei JPA.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-5xl font-black text-blue-100 dark:text-blue-900/50">3</div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-blue-500"/>
                <h4 className="font-bold text-gray-900 dark:text-white">Escolha com confiança</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Converse, negocie e feche com o melhor profissional para você.</p>
            </div>
          </div>
        </section>
        
        <div className="h-16"></div>
      </main>
    </div>
  );
};
