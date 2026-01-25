
import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Smartphone, 
  AlertCircle,
  FileText,
  Upload,
  Loader2,
  Building2,
  Info,
  // Added Store and Clock to fix "Cannot find name" errors
  Store as StoreIcon,
  Clock
} from 'lucide-react';
import { Store, StoreClaimRequest } from '../types';
import { sendClaimOTP, validateClaimOTP, submitManualClaim } from '../backend/services';

interface StoreClaimFlowProps {
  store: Store;
  userId: string;
  onBack: () => void;
  onSuccess: () => void;
}

type ClaimStep = 'method' | 'otp' | 'manual_form' | 'processing' | 'success' | 'manual_success';

export const StoreClaimFlow: React.FC<StoreClaimFlowProps> = ({ store, userId, onBack, onSuccess }) => {
  const [step, setStep] = useState<ClaimStep>('method');
  const [method, setMethod] = useState<'whatsapp' | 'email' | 'manual'>('whatsapp');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dados para formulário manual
  const [manualData, setManualData] = useState({
    responsible_name: '',
    cnpj: '',
    contact_phone: '',
    justification: ''
  });

  const handleSendOTP = async (chosenMethod: 'whatsapp' | 'email') => {
    setMethod(chosenMethod);
    setIsLoading(true);
    setError(null);
    try {
      await sendClaimOTP(store.id, chosenMethod);
      setStep('otp');
    } catch (e: any) {
      setError(e.message || "Erro ao enviar código.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await validateClaimOTP(store.id, userId, code);
      setStep('success');
      setTimeout(() => onSuccess(), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await submitManualClaim({
        ...manualData,
        store_id: store.id,
        store_name: store.name,
        user_id: userId,
        method: 'manual'
      });
      setStep('manual_success');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERS ---

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Reivindicar Loja</h1>
      </header>

      <div className="p-6 flex-1 flex flex-col max-w-md mx-auto w-full pb-24">
        
        {step === 'method' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#1E5BFF]">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Você é o proprietário?</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Escolha um método para receber o código de verificação.</p>
            </div>

            <div className="space-y-4">
                <button 
                  onClick={() => handleSendOTP('whatsapp')}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-[#1E5BFF] transition-all text-left group"
                >
                    <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">WhatsApp do Negócio</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">(21) 9****-**88</p>
                    </div>
                </button>

                <button 
                  onClick={() => handleSendOTP('email')}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-[#1E5BFF] transition-all text-left group"
                >
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF] group-hover:scale-110 transition-transform">
                        <Mail size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Email do Negócio</h3>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">c****@dominio.com</p>
                    </div>
                </button>
            </div>

            <button 
              onClick={() => setStep('manual_form')}
              className="w-full py-4 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors uppercase tracking-widest"
            >
              Não consigo receber o código
            </button>
          </div>
        )}

        {step === 'otp' && (
           <div className="space-y-8 animate-in slide-in-from-right duration-500 flex flex-col items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Digite o código</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Enviamos um código de 6 dígitos para seu {method}.</p>
                </div>

                <div className="flex gap-2">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => { otpRefs.current[idx] = el; }}
                            type="tel"
                            maxLength={1}
                            value={digit}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                const newOtp = [...otp];
                                newOtp[idx] = val;
                                setOtp(newOtp);
                                if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
                            }}
                            className="w-12 h-16 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center text-2xl font-black text-[#1E5BFF] focus:border-[#1E5BFF] outline-none transition-all shadow-inner"
                        />
                    ))}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100">
                        <AlertCircle size={14} />
                        <span className="text-xs font-bold">{error}</span>
                    </div>
                )}

                <div className="w-full space-y-4">
                    <button 
                        onClick={handleValidateOTP}
                        disabled={otp.some(d => !d) || isLoading}
                        className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Confirmar Código'}
                    </button>
                    <button onClick={() => setStep('method')} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:underline">Alterar método de envio</button>
                </div>
           </div>
        )}

        {step === 'manual_form' && (
           <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                        Não se preocupe. Nossa equipe analisará seus dados manualmente e transferirá o controle da loja em até 48 horas.
                    </p>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Responsável *</label>
                        <input required value={manualData.responsible_name} onChange={e => setManualData({...manualData, responsible_name: e.target.value})} className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:border-[#1E5BFF] dark:text-white font-bold" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CNPJ da Loja *</label>
                        <input required value={manualData.cnpj} onChange={e => setManualData({...manualData, cnpj: e.target.value})} placeholder="00.000.000/0001-00" className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:border-[#1E5BFF] dark:text-white font-bold" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de Contato *</label>
                        <input required value={manualData.contact_phone} onChange={e => setManualData({...manualData, contact_phone: e.target.value})} className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:border-[#1E5BFF] dark:text-white font-bold" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Anexar Prova (Opcional)</label>
                        <div className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 transition-colors cursor-pointer group">
                            <Upload className="text-gray-300" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cartão CNPJ, Fachada ou NF</span>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Solicitar Verificação'}
                    </button>
                </form>
           </div>
        )}

        {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 pb-20">
                <div className="w-24 h-24 bg-[#EAF0FF] dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-200 dark:shadow-none">
                    <CheckCircle2 className="w-12 h-12 text-[#1E5BFF]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display tracking-tight">Sucesso!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-[260px] leading-relaxed font-medium">
                    Sua loja foi reivindicada e em breve você terá acesso total ao Painel do Parceiro.
                </p>

                <button 
                    onClick={onSuccess}
                    className="w-full bg-gray-900 dark:bg-white dark:text-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Acessar meu painel
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )}

        {step === 'manual_success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 pb-20">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-500/10">
                    {/* Fixed "Cannot find name 'Clock'" by adding it to imports */}
                    <Clock size={48} className="text-[#1E5BFF]" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Pedido Enviado</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[280px]">
                    Recebemos seus dados. Nossa equipe fará a verificação e você receberá uma notificação em até 48 horas.
                </p>
                <button 
                    onClick={onBack}
                    className="w-full mt-10 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                    Voltar ao Perfil
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
