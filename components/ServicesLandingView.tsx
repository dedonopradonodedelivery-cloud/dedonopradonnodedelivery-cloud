
import React, { useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { 
    ChevronLeft, 
    ArrowRight, 
    Wrench, 
    FileText, 
    MessageSquare, 
    CheckCircle2,
    Clock
} from 'lucide-react';
import { STORES } from '../constants';

interface ServicesLandingViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
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

  const handleViewRequests = () => {
    if (user) {
      onNavigate('service_messages_list');
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

      <main className="overflow-y-auto no-scrollbar pb-12 pt-6">
        
        {/* 1. New Vibrant Banner */}
        <section className="px-6 pb-6">
          <div className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/10 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-72">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 mb-6 animate-float-slow shadow-lg">
                <Wrench size={40} className="text-white drop-shadow-lg" />
              </div>
              
              <div className="space-y-4 w-full max-w-xs">
                <button 
                  onClick={handleRequestQuote} 
                  className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  Pedir orçamento grátis
                  <ArrowRight size={18} />
                </button>

                <button 
                  onClick={handleViewRequests} 
                  className="w-full bg-blue-700/40 backdrop-blur-md text-white border border-white/20 font-black py-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  <MessageSquare size={16} />
                  Minhas Solicitações
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "Como funciona" Title */}
        <section className="py-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Até 5 profissionais verificados enviam propostas pelo chat.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-5xl font-black text-blue-100 dark:text-blue-900/50">3</div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-blue-500"/>
                <h4 className="font-bold text-gray-900 dark:text-white">Escolha com confiança</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Converse, negocie e feche com o melhor profissional.</p>
            </div>
          </div>
        </section>
        
        <div className="h-16"></div>
      </main>
    </div>
  );
};
