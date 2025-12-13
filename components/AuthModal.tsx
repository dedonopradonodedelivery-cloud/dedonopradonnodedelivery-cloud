import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
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
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  signupContext?: 'default' | 'merchant_lead_qr';
  onLoginSuccess?: () => void;
}

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
      setIsLoading(false); // Reset loading state when opening
      if (signupContext === 'merchant_lead_qr') {
        setMode('register');
        setProfileType('store');
      }
    }
  }, [isOpen, signupContext]);

  if (!isOpen) return null;

  const isDisposableEmail = (value: string) => {
    const domain = value.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_DOMAINS.includes(domain) : false;
  };

  /** 🚫 NUNCA redireciona URL
   *  ✅ Deixa o App.tsx decidir via onAuthStateChange
   */
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
      setError('Use um e-mail válido.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        // Race condition timeout to prevent infinite loading
        const { error } = await Promise.race([
            supabase.auth.signInWithPassword({
                email,
                password,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('O login demorou muito. Verifique sua conexão e tente novamente.')), 10000))
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
            await supabase.from('profiles').upsert(
              {
                id: userId,
                email,
                role,
              },
              { onConflict: 'id' }
            );
          }

          setSuccessMsg('Conta criada! Entrando...');
          setTimeout(() => finishAuth(), 300);
        } else {
          setMode('login');
          setSuccessMsg('Conta criada. Faça login.');
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro ao autenticar';
      
      // Auto-switch to login if user exists
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

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h2>

        {mode === 'register' && (
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setProfileType('cliente')}
              className={`flex-1 py-2 rounded transition-colors ${
                profileType === 'cliente' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setProfileType('store')}
              className={`flex-1 py-2 rounded transition-colors ${
                profileType === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Lojista
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="hidden" value={website} onChange={() => {}} />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white border border-transparent focus:border-blue-500 outline-none"
            required
          />

          <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white border border-transparent focus:border-blue-500 outline-none pr-10"
                required
            />
            <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
                <span className="mt-0.5 font-bold">⚠️</span>
                <span>{error}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === 'login' ? 'Entrando...' : 'Criando...'}
                </>
            ) : (
                mode === 'login' ? 'Continuar' : 'Cadastrar'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
          <button onClick={toggleMode} className="ml-1 text-blue-600 dark:text-blue-400 font-bold hover:underline">
            {mode === 'login' ? 'Cadastrar' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
};