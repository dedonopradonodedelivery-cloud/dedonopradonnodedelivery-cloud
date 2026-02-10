import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  // Added missing AlertTriangle import
  AlertTriangle,
  Loader2,
  Building2,
  Info,
  Clock,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Store } from '../types';

interface StoreClaimFlowProps {
  store: Store;
  userId: string;
  onBack: () => void;
  onSuccess: () => void;
  onNavigate: (view: string) => void;
}

type Step = 'intro' | 'method_select' | 'input_data' | 'otp_verify' | 'success';
type Method = 'email' | 'whatsapp' | null;

export const StoreClaimFlow: React.FC<StoreClaimFlowProps> = ({ store, userId, onBack, onSuccess, onNavigate }) => {
  const [step, setStep] = useState<Step>('intro');
  const [method, setMethod] = useState<Method>(null);
  const [inputVal, setInputVal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleStartClaim = () => setStep('method_select');

  const handleMethodChoice = (chosen: Method) => {
    setMethod(chosen);
    setStep('input_data');
  };

  const handleSendData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    setIsLoading(true);
    // Simula envio de código
    setTimeout(() => {
        setIsLoading(false);
        setStep('otp_verify');
    }, 1500);
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 6) return;
    
    setIsLoading(true);
    setError(null);
    
    // REGRA MVP: O código correto simulado é 123456
    setTimeout(() => {
        setIsLoading(false);
        if (code === '123456') {
            setStep('success');
        } else {
            setError("Código inválido. Verifique e tente novamente.");
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        }
    }, 1500);
  };

  const goToSupport = () => {
    onBack();
    onNavigate('store_support');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-950 flex flex-col font-sans animate-in slide-in-from-right duration-300 overflow-y-auto">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Reivindicar Loja</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Identidade e Propriedade</p>
        </div>
      </header>

      <main className="p-8 flex-1 flex flex-col max-w-md mx-auto w-full pb-32">
        
        {step === 'intro' && (
          <div className="space-y-8 animate-in fade-in duration-500 text-center">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] shadow-xl shadow-blue-500/10">
                <ShieldCheck size={40} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-3">Reivindicar esta loja</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Para proteger os negócios do bairro, precisamos confirmar que você é o responsável por esta loja.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 text-left">
                <div className="flex gap-4 items-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 shrink-0">
                        <img src={store.logoUrl || "/assets/default-logo.png"} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{store.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{store.category} • {store.neighborhood}</p>
                    </div>
                </div>
            </div>

            <button 
              onClick={handleStartClaim}
              className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              Começar verificação <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 'method_select' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Escolha o método</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">Enviaremos um código de verificação para confirmar sua identidade.</p>
            </div>

            <div className="space-y-4">
                <button 
                  onClick={() => handleMethodChoice('whatsapp')}
                  className="w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-[#1E5BFF] transition-all text-left group"
                >
                    <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Verificar por WhatsApp</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Receba o código via mensagem</p>
                    </div>
                </button>

                <button 
                  onClick={() => handleMethodChoice('email')}
                  className="w-full bg-white dark:bg-gray-900 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-[#1E5BFF] transition-all text-left group"
                >
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF] group-hover:scale-110 transition-transform">
                        <Mail size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Verificar por E-mail</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Receba o código na sua caixa de entrada</p>
                    </div>
                </button>
            </div>
          </div>
        )}

        {step === 'input_data' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2">
                    {method === 'whatsapp' ? 'WhatsApp Comercial' : 'E-mail Comercial'}
                </h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Informe o {method === 'whatsapp' ? 'número' : 'e-mail'} vinculado a este estabelecimento.
                </p>
            </div>

            <form onSubmit={handleSendData} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">{method === 'whatsapp' ? 'WhatsApp' : 'E-mail'}</label>
                  <input 
                    type={method === 'whatsapp' ? 'tel' : 'email'} 
                    required 
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder={method === 'whatsapp' ? '(21) 99999-9999' : 'comercial@sualoja.com'}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all shadow-inner"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading || !inputVal.trim()}
                  className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Enviar código agora <ArrowRight size={16} /></>}
                </button>
            </form>
            
            <button onClick={() => setStep('method_select')} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 transition-colors">Voltar para escolha de método</button>
          </div>
        )}

        {step === 'otp_verify' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300 flex flex-col items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Digite o código</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Enviamos um código de 6 dígitos para {inputVal}.</p>
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
                            className="w-11 h-16 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-center text-xl font-black text-[#1E5BFF] focus:border-[#1E5BFF] outline-none transition-all shadow-inner"
                        />
                    ))}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 animate-in shake duration-300">
                        <AlertTriangle size={14} />
                        <span className="text-[10px] font-black uppercase">{error}</span>
                    </div>
                )}

                <div className="w-full space-y-4 pt-4">
                    <button 
                        onClick={handleVerifyOtp}
                        disabled={otp.some(d => !d) || isLoading}
                        className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Confirmar Verificação'}
                    </button>
                    
                    <div className="pt-8 space-y-4 w-full">
                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Não recebeu o código?</p>
                        <button onClick={goToSupport} className="w-full flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 transition-all border border-gray-100 dark:border-gray-700">
                           <HelpCircle size={16} /> Falar com o suporte
                        </button>
                    </div>
                </div>
           </div>
        )}

        {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 pb-20">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 font-display tracking-tight uppercase">Loja verificada!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-[260px] leading-relaxed font-medium">
                    Parabéns! Agora você pode gerenciar o perfil da sua loja no Localizei JPA.
                </p>

                <button 
                    onClick={onSuccess}
                    className="w-full bg-gray-900 dark:bg-white dark:text-black text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Acessar Painel do Lojista
                    <ArrowRight size={18} strokeWidth={3} />
                </button>
            </div>
        )}

      </main>

      {/* Footer Safety Info */}
      <div className="p-8 text-center opacity-30 mt-auto">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
          Ambiente Seguro Localizei <br/> Verificação Automatizada
        </p>
      </div>

    </div>
  );
};
