import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Search, Building2, Smartphone, Mail, CheckCircle2, AlertTriangle, Upload, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BusinessRegistrationFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'search' | 'found' | 'not_found' | 'select_method' | 'otp' | 'success' | 'manual_verify';

// Mock Data for "Existing Store" simulation
const EXISTING_STORE_MOCK = {
  cnpj: '12345678000199', // Trigger for existing store flow
  name: 'Padaria Estrela da Freguesia',
  address: 'Estrada dos Três Rios, 1200 - Freguesia',
  category: 'Alimentação'
};

export const BusinessRegistrationFlow: React.FC<BusinessRegistrationFlowProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('search');
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

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // NOVO FLUXO: Apenas capturar o lead, sem criar usuário ou avançar etapas de OTP.
    try {
      if (supabase) {
        const { error } = await supabase.from('merchant_leads').insert({
          email: formData.email,
          phone: formData.phone,
          name: formData.name, // Nome do responsável ou da loja
          cnpj: formData.cnpj,
          source: 'qr_code', // Identificador da origem
          created_at: new Date().toISOString()
        });

        if (error) throw error;
      } else {
        // Simulação caso Supabase não esteja configurado no ambiente
        console.log("Modo Demo: Lead capturado", formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Sucesso
      alert("Pronto! Recebemos seu e-mail e vamos entrar em contato em breve.");
      
      // Limpar formulário
      setFormData({
        cnpj: '',
        name: '',
        phone: '',
        email: ''
      });

      // NÃO avançamos para setStep('found') ou 'otp'. O fluxo encerra aqui como captura de lead.

    } catch (err) {
      console.error("Erro ao salvar lead:", err);
      alert("Não conseguimos salvar seu e-mail agora, tente novamente em alguns minutos.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = (method: 'whatsapp' | 'sms' | 'email') => {
    setVerificationMethod(method);
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multi-char paste for simplicity
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        // Simulate success for "123456", fail for anything else to show manual flow
        if (otp.join('') === '123456') {
            setStep('success');
        } else {
            alert("Código incorreto (use 123456 para testar). Se falhar novamente, iremos para verificação manual.");
            // In a real app, track attempts. Here we redirect to manual for demo if user wants
        }
    }, 1500);
  };

  // --- Render Steps ---

  const renderSearch = () => (
    <div className="animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">Cadastrar meu negócio</h2>
      <p className="text-gray-500 text-sm mb-8">Preencha os dados abaixo para entrarmos em contato.</p>

      <form onSubmit={handleSearchSubmit} className="space-y-5">
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CNPJ</label>
            <input 
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                placeholder="00.000.000/0001-00"
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-colors"
                required
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Loja</label>
            <input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Padaria do Bairro"
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-colors"
                required
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone (WhatsApp)</label>
            <input 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(21) 99999-9999"
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-colors"
                required
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail Comercial</label>
            <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contato@loja.com.br"
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 outline-none focus:border-[#1E5BFF] transition-colors"
                required
            />
        </div>

        <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
            {isLoading ? 'Enviando...' : 'Cadastrar interesse'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-4">
            Ao clicar em cadastrar, você concorda em receber nosso contato comercial.
        </p>
      </form>
    </div>
  );

  // Manteve-se os renders abaixo caso a lógica de "Claim" (Reivindicar) precise ser reativada no futuro, 
  // mas o step inicial 'search' agora encerra o fluxo sem transitar para eles.

  const renderNotFound = () => (
    <div className="animate-in slide-in-from-right duration-300 flex flex-col items-center text-center pt-8">
        <div className="w-20 h-20 bg-[#EAF0FF] dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-[#1E5BFF]">
            <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Não encontramos sua loja</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xs">
            O CNPJ informado não consta na nossa base. Vamos criar um novo cadastro do zero para você.
        </p>
        <button 
            onClick={() => onComplete()} // For demo purposes, just finish
            className="w-full bg-[#1E5BFF] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20"
        >
            Criar novo cadastro
        </button>
        <button onClick={() => setStep('search')} className="mt-4 text-sm text-gray-500 font-bold">
            Voltar e corrigir dados
        </button>
    </div>
  );

  const renderFound = () => (
    <div className="animate-in slide-in-from-right duration-300 pt-4">
        <div className="bg-[#EAF0FF] dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex gap-3 items-start mb-6">
            <AlertTriangle className="w-6 h-6 text-[#1E5BFF] shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                Esta loja já está cadastrada no Localizei Freguesia. Para administrar o perfil, você precisa reivindicar a propriedade.
            </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-4 mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{EXISTING_STORE_MOCK.name}</h3>
                    <p className="text-xs text-gray-500">{EXISTING_STORE_MOCK.category}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p>Perfil Ativo</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">{EXISTING_STORE_MOCK.address}</p>
        </div>

        <button 
            onClick={() => setStep('select_method')}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
            Reivindicar esta loja
        </button>
    </div>
  );

  const renderSelectMethod = () => (
    <div className="animate-in slide-in-from-right duration-300 pt-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirmação de Identidade</h2>
        <p className="text-gray-500 text-sm mb-6">
            Precisamos garantir que você é o proprietário. Escolha como deseja receber o código de verificação:
        </p>

        <div className="space-y-3">
            <button onClick={() => sendVerificationCode('whatsapp')} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:border-green-500 transition-colors shadow-sm group">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">WhatsApp</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enviar para {formData.phone}**</p>
                </div>
            </button>
            <button onClick={() => sendVerificationCode('email')} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:border-blue-500 transition-colors shadow-sm group">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">E-mail</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enviar para {formData.email}**</p>
                </div>
            </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
            **Apenas os 2 últimos dígitos do número/e-mail cadastrado serão exibidos para sua segurança.
        </p>
    </div>
  );

  const renderOtp = () => (
    <div className="animate-in slide-in-from-right duration-300 pt-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Insira o Código</h2>
        <p className="text-gray-500 text-sm mb-6 text-center max-w-xs mx-auto">
            Enviamos um código de 6 dígitos para o seu {verificationMethod === 'whatsapp' ? 'WhatsApp' : 'e-mail'}.
        </p>

        <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    // Fix: Ensure ref callback returns void
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-16 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-2xl font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                />
            ))}
        </div>

        <button 
            onClick={verifyOtp}
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            {isLoading ? 'Verificando...' : 'Verificar Código'}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
            Não recebeu? <button onClick={() => setStep('manual_verify')} className="text-[#1E5BFF] font-bold">Tentar verificação manual</button>
        </p>
    </div>
  );

  const renderManualVerify = () => (
    <div className="animate-in slide-in-from-right duration-300 pt-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verificação Manual</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto text-center">
            Ops, se a verificação automática falhou, vamos te ajudar por WhatsApp.
        </p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 text-green-600">
                <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Fale com o Suporte</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Clique no botão para iniciar um chat com nossa equipe.
            </p>
            <button 
                onClick={() => alert("Abrir WhatsApp com suporte.")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                Abrir WhatsApp
            </button>
        </div>
        <button onClick={() => setStep('search')} className="mt-6 text-sm text-gray-500 font-bold">
            Voltar ao início
        </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="animate-in zoom-in duration-300 flex flex-col items-center justify-center text-center h-full">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parabéns!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-8">
            Sua loja <strong>{EXISTING_STORE_MOCK.name}</strong> foi reivindicada com sucesso.
        </p>
        <button 
            onClick={onComplete}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
            Acessar Painel do Lojista
        </button>
    </div>
  );


  // --- MAIN RENDER ---
  const getHeaderTitle = () => {
    switch (step) {
      case 'search': return 'Cadastrar Negócio';
      case 'found': return 'Loja Encontrada';
      case 'not_found': return 'Ops!';
      case 'select_method': return 'Confirmar Identidade';
      case 'otp': return 'Verificar Código';
      case 'manual_verify': return 'Verificação Manual';
      case 'success': return 'Cadastro Concluído';
      default: return 'Cadastro';
    }
  };

  const showBackButton = step !== 'search' && step !== 'success';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        {showBackButton ? (
          <button onClick={() => setStep('search')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
        ) : (
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
        )}
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">{getHeaderTitle()}</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 pb-24 flex flex-col justify-center">
        {step === 'search' && renderSearch()}
        {step === 'found' && renderFound()}
        {step === 'not_found' && renderNotFound()}
        {step === 'select_method' && renderSelectMethod()}
        {step === 'otp' && renderOtp()}
        {step === 'manual_verify' && renderManualVerify()}
        {step === 'success' && renderSuccess()}
      </div>

    </div>
  );
};