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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
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
      setError(err?.message || 'Erro ao autenticar');
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
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h2>

        {mode === 'register' && (
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setProfileType('cliente')}
              className={`flex-1 py-2 rounded ${
                profileType === 'cliente' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setProfileType('store')}
              className={`flex-1 py-2 rounded ${
                profileType === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200'
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
            className="w-full p-3 rounded bg-gray-100"
            required
          />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-100"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            {isLoading ? '...' : 'Continuar'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
          <button onClick={toggleMode} className="ml-1 text-blue-600 font-bold">
            {mode === 'login' ? 'Cadastrar' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
};
