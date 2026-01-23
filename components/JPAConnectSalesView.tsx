
import React from 'react';
import { ChevronLeft, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface JPAConnectSalesViewProps {
  onBack: () => void;
}

export const JPAConnectSalesView: React.FC<JPAConnectSalesViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans flex flex-col">
       <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0 shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none">JPA Connect</h1>
      </header>

      <main className="flex-1 p-6 pb-24 overflow-y-auto">
        <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl mx-auto mb-6 flex items-center justify-center text-indigo-600 dark:text-indigo-400 rotate-6 shadow-lg">
                <Users size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-4">
                Networking que <br/><span className="text-indigo-600 dark:text-indigo-400">Gera Negócios</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                Conecte-se com os principais empresários da região e feche parcerias estratégicas.
            </p>
        </div>

        <div className="space-y-4 mb-10">
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl flex gap-4 items-center">
                <CheckCircle2 className="text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Acesso a grupos exclusivos de WhatsApp</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl flex gap-4 items-center">
                <CheckCircle2 className="text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Encontros presenciais mensais</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl flex gap-4 items-center">
                <CheckCircle2 className="text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Descontos B2B entre membros</span>
            </div>
        </div>
        
        <div className="bg-indigo-600 text-white p-8 rounded-3xl text-center shadow-xl shadow-indigo-500/30">
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Plano Anual</p>
            <div className="flex justify-center items-baseline gap-1 mb-6">
                <span className="text-2xl opacity-80">R$</span>
                <span className="text-5xl font-black">299</span>
                <span className="text-xl">/ano</span>
            </div>
            <button onClick={() => alert('Em breve!')} className="w-full bg-white text-indigo-700 font-black py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                Quero Participar <ArrowRight size={18} />
            </button>
        </div>
      </main>
    </div>
  );
};
