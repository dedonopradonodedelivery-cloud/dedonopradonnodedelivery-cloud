
import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, Copy, CheckCircle2, Ticket, History } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface UserCupomScreenProps {
  user: User | null;
  onBack: () => void;
  onHistory: () => void;
}

export const UserCupomScreen: React.FC<UserCupomScreenProps> = ({ user, onBack, onHistory }) => {
  const [token, setToken] = useState('...');
  const [qrUrl, setQrUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos para o código
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateToken();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateToken(); // Regenera ao expirar
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateToken = () => {
    const newToken = `CUP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setToken(newToken);
    
    const qrData = JSON.stringify({
        userId: user?.id || 'guest',
        couponCode: newToken,
        timestamp: Date.now()
    });
    
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff`);
    setTimeLeft(300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col">
      <header className="bg-white dark:bg-gray-900 px-5 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Seu Cupom</h1>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Apresente no caixa</span>
        </div>
        <button onClick={onHistory} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <History className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E5BFF] to-[#00C853]"></div>

            <div className="bg-white p-4 rounded-3xl shadow-inner border border-gray-50 mb-6 relative">
                {qrUrl ? <img src={qrUrl} alt="QR Code" className="w-48 h-48 object-contain mix-blend-multiply" /> : <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-2xl"></div>}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="w-full mb-6">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Código do Cupom</p>
                <button onClick={handleCopy} className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-[#1E5BFF]/30 hover:border-[#1E5BFF] rounded-2xl p-4 flex items-center justify-between group transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-[#1E5BFF]"><Ticket className="w-5 h-5" /></div>
                        <span className="font-mono text-2xl font-black text-gray-800 dark:text-white tracking-wider">{token}</span>
                    </div>
                    <div className="text-gray-400 group-hover:text-[#1E5BFF] transition-colors">
                        {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </div>
                </button>
                {copied && <p className="text-[10px] text-green-500 font-bold mt-2 animate-in fade-in slide-in-from-top-1">Código copiado!</p>}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[240px]">
                O lojista irá escanear este código ou digitar o token para validar seu desconto.
            </p>
        </div>

        <button onClick={generateToken} className="mt-8 text-sm font-bold text-[#1E5BFF] hover:text-blue-600 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Gerar novo código
        </button>
      </div>
    </div>
  );
};
