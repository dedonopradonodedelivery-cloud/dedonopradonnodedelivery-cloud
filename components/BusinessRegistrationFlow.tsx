
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Building2, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare,
  Play,
  Info,
  X,
  Clock,
  Send,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessRegistrationFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'search' | 'found' | 'not_found' | 'select_method' | 'otp' | 'success' | 'manual_verify';

const CLAIM_TUTORIAL_VIDEO = "https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4";

const SupportQuestion: React.FC<{ 
  onSend: (text: string) => Promise<void>;
}> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<{question: string, status: 'sent' | 'answered'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSending(true);
    await onSend(text);
    setHistory({ question: text, status: 'sent' });
    setText('');
    setIsSending(false);
  };

  return (
    <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
      {!history ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dúvida sobre a reivindicação? Escreva aqui."
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-medium dark:text-white outline-none focus:border-[#1E5BFF] transition-all resize-none h-20"
          />
          <button 
            type="submit"
            disabled={isSending || !text.trim()}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Enviar pergunta
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-3">
          <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
          <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Recebemos sua dúvida. Responderemos em breve.</p>
        </div>
      )}
    </div>
  );
};

export const BusinessRegistrationFlow: React.FC<BusinessRegistrationFlowProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('search');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [hasSeenVideo, setHasSeenVideo] = useState(() => localStorage.getItem('claim_onboarding_seen') === 'true');
  
  const [formData, setFormData] = useState({
    cnpj: '',
    name: '',
    phone: '',
    email: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'whatsapp' | 'sms' | 'email' | null>(null);

  const shouldShowVideo = !hasSeenVideo && !isClaimed;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (supabase) {
        await supabase.from('merchant_leads').insert({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          cnpj: formData.cnpj,
          source: 'claim_flow',
          created_at: new Date().toISOString()
        });
      }
      
      // Simulação: se o CNPJ for o do mock, vai para "encontrado"
      if (formData.cnpj.replace(/\D/g, '') === '12345678000199') {
          setStep('found');
      } else {
          setStep('not_found');
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsClaimed(true);
    localStorage.setItem('claim_onboarding_seen', 'true');
    setStep('success');
  };

  const renderSearch = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">Cadastrar meu negócio</h2>
      <p className="text-gray-500 text-sm mb-6">Comece informando os dados básicos da sua loja.</p>

      {shouldShowVideo && (
        <div className="mb-8">
            <div 
                onClick={() => setShowVideoModal(true)}
                className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 relative group shadow-lg border border-gray-100 dark:border-gray-800 cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform active:scale-95 mb-3">
                        <Play className="w-6 h-6 text-indigo-600 fill-indigo-600 ml-1" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        Como reivindicar sua loja
                    </span>
                </div>
            </div>
            <div className="mt-4 flex items-start gap-3 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                    A verificação garante que apenas o dono legítimo gerencie o perfil e receba os pagamentos.
                </p>
            </div>
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="space-y-5">
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">CNPJ</label>
            <input 
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                placeholder="00.000.000/0001-00"
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                required
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Nome da Loja</label>
            <input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Padaria do Bairro"
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                required
            />
        </div>
        
        <div className="grid grid-cols-1 gap-5">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">WhatsApp</label>
                <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(21) 99999-9999"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">E-mail</label>
                <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contato@sualoja.com"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-all dark:text-white"
                    required
                />
            </div>
        </div>

        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuar cadastro'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <SupportQuestion onSend={async () => {}} />
    </div>
  );

  const renderFound = () => (
    <div className="animate-in slide-in-from-right duration-300 pt-4">
        <div className="bg-[#EAF0FF] dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-4 items-start mb-8 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-[#1E5BFF] shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                Esta loja já possui um registro básico. Para ativar as vendas e o cashback, você precisa confirmar que é o proprietário.
            </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Padaria Estrela da Freguesia</h3>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Alimentação & Produtos</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p>Perfil disponível para reivindicação</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 leading-tight">
                Estrada dos Três Rios, 1200 - Freguesia, Rio de Janeiro - RJ
            </p>
        </div>

        <button 
            onClick={() => setStep('select_method')}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            Reivindicar esta loja agora
            <ArrowRight className="w-5 h-5" />
        </button>
    </div>
  );

  const renderNotFound = () => (
    <div className="animate-in slide-in-from-right duration-300 flex flex-col items-center text-center pt-8">
        <div className="w-20 h-20 bg-[#EAF0FF] dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-[#1E5BFF] shadow-inner">
            <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Não encontramos seu negócio</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-xs leading-relaxed">
            O CNPJ informado não consta na nossa base de parceiros. Vamos criar um novo cadastro exclusivo para você.
        </p>
        <button 
            onClick={handleSuccess}
            className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
            Criar novo perfil de lojista
        </button>
        <button onClick={() => setStep('search')} className="mt-6 text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors">
            Corrigir dados informados
        </button>
    </div>
  );

  const renderSelectMethod = () => (
    <div className="animate-in slide-in-from-right duration-300 pt-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verificar Identidade</h2>
        <p className="text-gray-500 text-sm mb-8">
            Escolha como deseja receber o código de segurança para validar sua propriedade:
        </p>

        <div className="space-y-4">
            <button onClick={() => { setVerificationMethod('whatsapp'); setStep('otp'); }} className="w-full bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:border-green-500 transition-all shadow-sm group active:scale-[0.98]">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">WhatsApp</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">(21) •••••-9999</p>
                </div>
            </button>

            <button onClick={() => { setVerificationMethod('email'); setStep('otp'); }} className="w-full bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:border-[#1E5BFF] transition-all shadow-sm group active:scale-[0.98]">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                </div>
                <div className="text-left">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">E-mail de Cadastro</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">co•••••@sualoja.com</p>
                </div>
            </button>
        </div>

        <button onClick={() => setStep('manual_verify')} className="w-full mt-10 text-xs font-bold text-gray-400 text-center hover:underline">
            Não tenho acesso a esses canais
        </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center pt-10 h-full justify-center pb-20">
        <div className="w-24 h-24 bg-[#EAF0FF] dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-200 dark:shadow-none">
            <CheckCircle2 className="w-12 h-12 text-[#1E5BFF]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display tracking-tight">Sucesso!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 max-w-[260px] leading-relaxed font-medium">
            Sua loja foi reivindicada e em breve você terá acesso total ao Painel do Parceiro.
        </p>

        <button 
            onClick={onComplete}
            className="w-full bg-gray-900 dark:bg-white dark:text-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            Acessar meu painel
            <ArrowRight className="w-5 h-5" />
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col">
        {/* Header com Progresso */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
            <button onClick={onBack} className="w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 px-4">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#1E5BFF] transition-all duration-700 ease-out"
                        style={{ width: 
                            step === 'search' ? '15%' : 
                            step === 'found' ? '40%' : 
                            step === 'not_found' ? '40%' :
                            step === 'select_method' ? '60%' :
                            step === 'otp' ? '80%' :
                            step === 'manual_verify' ? '85%' :
                            '100%' 
                        }}
                    ></div>
                </div>
            </div>
            <div className="w-10"></div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6 pb-24 max-w-md mx-auto w-full">
            {step === 'search' && renderSearch()}
            {step === 'found' && renderFound()}
            {step === 'not_found' && renderNotFound()}
            {step === 'select_method' && renderSelectMethod()}
            {step === 'otp' && (
                <div className="animate-in slide-in-from-right duration-300 pt-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Digite o código</h2>
                    <p className="text-gray-500 text-sm mb-10 text-center max-w-[260px] leading-relaxed">
                        Enviamos um código de 6 dígitos para seu {verificationMethod}.
                    </p>
                    <div className="flex gap-2 mb-10">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => { otpRefs.current[idx] = el; }}
                                type="tel"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    const newOtp = [...otp];
                                    newOtp[idx] = val;
                                    setOtp(newOtp);
                                    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
                                }}
                                className="w-12 h-14 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-center text-xl font-bold focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white shadow-sm"
                            />
                        ))}
                    </div>
                    <button 
                        onClick={handleSuccess}
                        disabled={otp.some(d => !d) || isLoading}
                        className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        Validar código
                    </button>
                    <button className="mt-8 text-xs font-bold text-[#1E5BFF] uppercase tracking-widest">Reenviar código em 45s</button>
                </div>
            )}
            {step === 'manual_verify' && (
                <div className="animate-in slide-in-from-right duration-300 pt-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verificação Manual</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Envie um documento que comprove sua relação com o CNPJ (ex: Conta de luz da loja ou Contrato Social).
                    </p>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-10 flex flex-col items-center justify-center mb-8 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 transition-colors cursor-pointer group">
                        <Upload className="w-10 h-10 text-gray-300 group-hover:text-indigo-500 transition-colors mb-3" />
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Toque para selecionar arquivo</p>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase font-black">PDF, JPG ou PNG (Máx 10MB)</p>
                    </div>
                    <button 
                        onClick={handleSuccess}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all"
                    >
                        Enviar para análise humana
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
                        Nossa equipe revisa solicitações manuais em até 48h úteis.
                    </p>
                </div>
            )}
            {step === 'success' && renderSuccess()}
        </div>

        {/* Fullscreen Video Player Modal */}
        {showVideoModal && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
                <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
                    <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-[#1E5BFF]" />
                        <h3 className="text-white font-bold text-sm">Como reivindicar sua loja</h3>
                    </div>
                    <button 
                        onClick={() => { setShowVideoModal(false); setHasSeenVideo(true); localStorage.setItem('claim_onboarding_seen', 'true'); }}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <video 
                        src={CLAIM_TUTORIAL_VIDEO} 
                        className="w-full max-h-screen" 
                        controls 
                        autoPlay
                    />
                </div>
                <div className="p-6 pb-12 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 flex items-center justify-center">
                    <p className="text-white/60 text-[10px] text-center font-bold uppercase tracking-widest max-w-[240px]">
                        Localizei Parceiro • Verificação de Segurança
                    </p>
                </div>
            </div>
        )}
    </div>
  );
};
