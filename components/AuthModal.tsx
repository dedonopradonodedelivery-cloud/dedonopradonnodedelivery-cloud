import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  X,
  Mail,
  Lock,
  User,
  Loader2,
  Store,
  Eye,
  EyeOff,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  signupContext?: 'default' | 'merchant_lead_qr';
  onLoginSuccess?: () => void;
  customTitle?: string;
  customSubtitle?: string;
}

const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'mailinator.com',
  'throwawaymail.com',
];

const GoogleIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2311_190)">
        <path d="M19.99 10.225C19.99 9.535 19.93 8.925 19.82 8.365H10.21V11.835H15.64C15.42 12.895 14.81 13.785 14.005 14.345V18.105H18.795C19.53 17.345 19.99 16.295 19.99 15.015C19.99 13.915 19.78 12.855 19.41 11.915C19.03 10.975 19.53 10.225 19.99 10.225Z" fill="#4285F4"/>
        <path d="M10.21 19.99C12.82 19.99 15.02 19.115 16.59 17.345L14.005 14.345C13.255 14.895 12.33 15.225 11.215 15.225C9.43 15.225 7.91 14.035 7.39 12.445H2.42V16.215C3.39 18.175 5.715 19.99 10.21 19.99Z" fill="#34A853"/>
        <path d="M5.005 12.445C4.765 11.755 4.645 10.975 4.645 10.225C4.645 9.475 4.765 8.695 5.005 8.005V4.235H0.035V8.005C-0.015 9.175 0.175 10.425 0.495 11.915C0.815 13.405 0.035 12.445 5.005 12.445Z" fill="#FBBC04"/>
        <path d="M10.21 4.645C12.1 4.645 13.625 5.395 14.855 6.495L17.41 4.235C15.545 2.505 13.065 0.015 10.21 0.015C5.715 0.015 3.39 1.835 2.42 3.795L7.39 7.565C7.91 5.975 9.43 4.645 11.215 4.645H10.21Z" fill="#EA4335"/>
        </g>
        <defs>
        <clipPath id="clip0_2311_190">
        <rect width="20" height="20" fill="white"/>
        </clipPath>
        </defs>
    </svg>
);


export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  signupContext = 'default',
  onLoginSuccess,
  customTitle,
  customSubtitle
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [profileType, setProfileType] = useState<'cliente' | 'store'>('cliente');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setWebsite('');
      setIsLoading(false);
      if (signupContext === 'merchant_lead_qr') {
        setMode('register');
        setProfileType('store');
      } else {
        setProfileType('cliente'); 
      }
    }
  }, [isOpen, signupContext]);

  if (!isOpen) return null;

  const isDisposableEmail = (value: string) => {
    const domain = value.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_DOMAINS.includes(domain) : false;
  };

  const finishAuth = () => {
    onClose();
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (website) {
      onClose();
      return;
    }

    if (mode === 'register' && isDisposableEmail(email)) {
      setError('Use um e-mail válido (não temporário).');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const { error } = await Promise.race([
            supabase.auth.signInWithPassword({
                email,
                password,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('O login demorou muito. Verifique sua conexão.')), 10000))
        ]) as any;

        if (error) throw error;
        finishAuth();

      } else {
        const role = profileType === 'store' ? 'lojista' : 'cliente';

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });

        if (error) throw error;

        if (data.session) {
          const userId = data.user?.id;
          if (userId) {
            const { error: profileError } = await supabase.from('profiles').upsert(
              {
                id: userId,
                email,
                role,
                created_at: new Date().toISOString()
              },
              { onConflict: 'id' }
            );

            if (profileError) {
                console.error("Erro ao criar perfil:", profileError);
            }
          }

          setSuccessMsg(role === 'lojista' ? 'Conta de Lojista criada! Acessando painel...' : 'Conta criada! Entrando...');
          
          setTimeout(() => finishAuth(), 1000);
        } else {
          setMode('login');
          setSuccessMsg('Conta criada. Verifique seu e-mail para confirmar.');
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro ao autenticar';
      if (msg.includes('User already registered') || msg.includes('already registered')) {
        setMode('login');
        setError('E-mail já cadastrado. Por favor, faça login.');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccessMsg('');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Error signing in with Google:", err);
      setError(err.message || 'Erro ao entrar com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-gray-100 dark:border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <X />
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
            {customTitle ? customTitle : (mode === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {customSubtitle ? customSubtitle : (mode === 'login' ? 'Acesse para continuar' : 'Escolha seu tipo de perfil')}
            </p>
        </div>

        {mode === 'register' && (
          <div className="flex gap-3 mb-6 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setProfileType('cliente')}
              className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold ${
                profileType === 'cliente' 
                ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              <User size={18} />
              Sou Cliente
            </button>
            <button
              type="button"
              onClick={() => setProfileType('store')}
              className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold ${
                profileType === 'store' 
                ? 'bg-[#1E5BFF] text-white shadow-md' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              <Store size={18} />
              Sou Lojista
            </button>
          </div>
        )}

        {mode === 'register' && profileType === 'store' && (
            <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex gap-3 items-center border border-blue-100 dark:border-blue-800">
                <Briefcase className="w-5 h-5 text-[#1E5BFF]" />
                <p className="text-xs text-blue-700 dark:text-blue-200 leading-tight">
                    Você terá acesso ao <strong>Painel do Parceiro</strong> para gerenciar sua loja, anúncios e cashback.
                </p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="hidden" value={website} onChange={() => {}} />

          <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-12 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    required
                />
              </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Senha</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha secreta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 pr-12 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    required
                    minLength={6}
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2 border border-red-100 dark:border-red-800">
                <span className="mt-0.5 font-bold">⚠️</span>
                <span>{error}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-xl flex items-center gap-2 border border-green-100 dark:border-green-800">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
          >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                </>
            ) : (
                mode === 'login' ? 'Entrar na conta' : (profileType === 'store' ? 'Criar Conta de Lojista' : 'Criar Conta Grátis')
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OU</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        >
            <GoogleIcon />
            Entrar com Google
        </button>


        <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === 'login' ? 'Novo por aqui?' : 'Já tem uma conta?'}
            <button onClick={toggleMode} className="ml-1 text-[#1E5BFF] font-bold hover:underline">
                {mode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
            </button>
            </p>
        </div>
      </div>
    </div>
  );
};