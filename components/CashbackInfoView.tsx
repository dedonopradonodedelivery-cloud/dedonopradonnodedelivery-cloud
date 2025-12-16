
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { ChevronLeft, Store, Sparkles, ArrowRight, Lock, Clock, ShoppingBag, QrCode, Coins, Zap, MapPin, ShieldCheck, RefreshCw } from 'lucide-react';
import { CashbackIcon } from './CashbackIcon';

interface CashbackInfoViewProps {
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
  hasActiveStore?: boolean;
  onBack: () => void;
  onLogin: () => void;
  onNavigate: (view: string) => void;
}

const CASHBACK_LAUNCH = new Date('2025-12-20T12:00:00-03:00');

const CountdownDisplay = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +CASHBACK_LAUNCH - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl w-14 h-14 flex items-center justify-center mb-1.5 shadow-sm">
        <span className="font-mono text-xl font-bold text-gray-900 dark:text-white">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="w-full max-w-sm mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-center gap-2 mb-4 text-orange-600 dark:text-orange-400">
        <RocketIcon className="w-4 h-4 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest">O cashback local está chegando</span>
      </div>
      <div className="flex justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="Dias" />
        <TimeUnit value={timeLeft.hours} label="H" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="S" />
      </div>
    </div>
  );
};

// Helper icon
const RocketIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

export const CashbackInfoView: React.FC<CashbackInfoViewProps> = ({ 
  user, 
  userRole, 
  hasActiveStore = true, 
  onBack, 
  onLogin, 
  onNavigate 
}) => {

  const renderContent = () => {
    // CASO 1: LOJISTA (Mantém a visão de negócios existente)
    if (userRole === 'lojista' && hasActiveStore) {
      return (
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-xl text-indigo-600 dark:text-indigo-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Área do Parceiro</h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-400">Fidelize seus clientes com cashback</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Como vai funcionar para o seu negócio
          </h3>

          <div className="space-y-4">
            {[
              { id: 1, text: "Ativar o cashback no painel da loja." },
              { id: 2, text: "Definir a porcentagem de cashback (ex: 5%, 10%)." },
              { id: 3, text: "Clientes compram e acumulam saldo automaticamente." },
              { id: 4, text: "O lojista recebe o valor devido e pode pedir resgate via Pix." }
            ].map((step) => (
              <div key={step.id} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm text-gray-600 dark:text-gray-300 shrink-0 border border-gray-200 dark:border-gray-700">
                  {step.id}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 pt-1.5 leading-snug">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 mb-2">Status da ferramenta:</p>
            <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
              <Lock className="w-3 h-3" />
              Em desenvolvimento
            </span>
          </div>
        </div>
      );
    }

    // CASO 2: CLIENTE / VISITANTE (Nova Tela de Educação e Pré-Lançamento)
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto">
        
        {/* 0. Countdown (Moved to top) */}
        <CountdownDisplay />

        {/* 1. Impact Header */}
        <div className="text-center mb-10 mt-2">
            <h1 className="text-[26px] font-extrabold text-gray-900 dark:text-white leading-tight mb-3 font-display">
                O único cashback que circula no bairro e fortalece o comércio local.
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-2">
                Aqui, você economiza nas suas compras e ainda apoia as lojas da Freguesia.
            </p>
        </div>

        {/* 2. How it Works (Cards) */}
        <div className="w-full space-y-4 mb-10">
            {/* Step 1 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#1E5BFF] dark:text-blue-400 flex items-center justify-center shrink-0 z-10">
                    <Store className="w-5 h-5" />
                </div>
                <div className="z-10">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Compre nas lojas do bairro</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Ganhe até <span className="font-bold text-[#1E5BFF]">8% de cashback</span> para usar em qualquer outra loja da Freguesia.
                    </p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 dark:bg-purple-900/10 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 z-10">
                    <QrCode className="w-5 h-5" />
                </div>
                <div className="z-10">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Escaneie o QR Code</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Simples, rápido e direto. Em poucos segundos, sua compra é registrada no app.
                    </p>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 dark:bg-green-900/10 rounded-bl-full -mr-4 -mt-4"></div>
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 z-10">
                    <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="z-10">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Receba na hora</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Cashback disponível imediatamente para usar onde quiser, sem espera.
                    </p>
                </div>
            </div>
        </div>

        {/* 3. Differentiator Block */}
        <div className="w-full bg-gradient-to-br from-[#1E5BFF] to-[#1040C1] rounded-[24px] p-6 text-white shadow-lg shadow-blue-500/20 mb-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-white/20">
                    <RefreshCw className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="text-lg font-bold mb-2">Esse cashback não existe em nenhum outro lugar.</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                    Diferente de programas tradicionais, aqui você pode usar o cashback entre <strong>diferentes lojas</strong> do próprio bairro, criando um ciclo de benefícios para todos.
                </p>
            </div>
        </div>

        {/* 5. CTA */}
        <div className="w-full space-y-3">
            {!user ? (
                <button 
                    onClick={onLogin}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Avise-me quando liberar
                    <ArrowRight className="w-5 h-5" />
                </button>
            ) : (
                <button 
                    onClick={() => onNavigate('explore')}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Ver lojas participantes
                    <Store className="w-5 h-5" />
                </button>
            )}
            
            <p className="text-[10px] text-gray-400 text-center">
                O lançamento será gradual por categorias.
            </p>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-gray-900 dark:text-white text-sm">Cashback Local</span>
        <div className="w-8"></div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 pb-24">
        {renderContent()}
      </div>

    </div>
  );
};
