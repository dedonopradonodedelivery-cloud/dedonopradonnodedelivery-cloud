import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Mail, Lock, User, Loader2, Store, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  signupContext?: 'default' | 'merchant_lead_qr';
  onLoginSuccess?: () => void;
}

// Lista básica de domínios descartáveis para bloqueio simples
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'mailinator.com',
  'throwawaymail.com',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  signupContext = 'default',
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [profileType, setProfileType] = useState<'cliente' | 'store'>('cliente');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Honeypot field: invisible to users, filled by bots
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
      if (signupContext === 'merchant_lead_qr') {
        setMode('register');
        setProfileType('store');
      }
    }
  }, [isOpen, signupContext]);

  if (!isOpen) return null;

  const isDisposableEmail = (value: string) => {
    const domain = value.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    return DISPOSABLE_DOMAINS.includes(domain);
  };

  const goAfterAuth = (role: 'lojista' | 'cliente') => {
    // ✅ Nunca use reload aqui. Sempre redireciona.
    if (onLoginSuccess) onLoginSuccess();
    window.location.href = role === 'lojista' ? '/painel-parceiro' : '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- ANTI-SPAM CHECKS ---
    // 1) Honeypot check
    if (website) {
      setIsLoading(false);
      onClose();
      return;
    }

    // 2) Disposable Email check
    if (mode === 'register' && isDisposableEmail(email)) {
      setError('Por favor, utilize um e-mail corporativo ou pessoal válido.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        // Decide rota pós-login baseado no profile (role)
        const userId = data.user?.id;
        if (!userId) {
          // fallback seguro
          onClose();
          goAfterAuth('cliente');
          return;
        }

        const { data: profile, error: profErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profErr) {
          // se não achou profile, manda pra home e pronto (não trava)
          onClose();
          goAfterAuth('cliente');
          return;
        }

        const role = (profile?.role === 'lojista' ? 'lojista' : 'cliente') as 'lojista' | 'cliente';
        onClose();
        goAfterAuth(role);
      } else {
        // --- CADASTRO (Confirm email OFF) ---

        const role = profileType === 'store' ? 'lojista' : 'cliente';

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              verification_status: 'verified',
              signup_source: 'web_modal',
            },
          },
        });

        if (signUpError) throw signUpError;

        // Se confirm email estiver OFF, deve vir session
        if (authData.session) {
          setSuccessMsg('Conta criada com sucesso! Entrando...');

          // Backup ao trigger: garante profile
          const userId = authData.user?.id;
          if (userId) {
            const { error: upsertErr } = await supabase
              .from('profiles')
              .upsert(
                {
                  id: userId,
                  email,
                  role,
                  verification_status: 'verified',
                },
                { onConflict: 'id' }
              );

            // Não trava o fluxo por erro de upsert, apenas loga
            if (upsertErr) console.error('profiles upsert error:', upsertErr);
          }

          // ✅ REDIRECT DIRETO (SEM reload)
          setTimeout(() => {
            onClose();
            goAfterAuth(role);
          }, 300);
        } else {
          // fallback: se não vier session, muda pro login
          setSuccessMsg('Conta criada. Faça login para continuar.');
          setMode('login');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          type="button"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {mode === 'login' ? 'Acesse para continuar' : 'Comece agora'}
        </p>

        {mode === 'register' && signupContext !== 'merchant_lead_qr' && (
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setProfileType('cliente')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                profileType === 'cliente'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              <User className="w-4 h-4" /> Cliente
            </button>
            <button
              type="button"
              onClick={() => setProfileType('store')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                profileType === 'store'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              <Store className="w-4 h-4" /> Lojista
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* HONEYPOT FIELD */}
          <div className="hidden opacity-0 absolute -z-10">
            <input
              type="text"
              name="website_url_check"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3.5 pl-12 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                placeholder="******"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-xs font-bold text-center">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-green-600 dark:text-green-400 text-xs font-bold text-center">{successMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2D6DF6] hover:bg-[#2558D4] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Entrar' : 'Entrar Agora'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button onClick={toggleMode} className="ml-1 text-[#2D6DF6] font-bold hover:underline" type="button">
              {mode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
