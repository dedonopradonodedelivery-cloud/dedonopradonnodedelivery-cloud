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
  Briefcase
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
  const [website, setWebsite] = useState(''); // HoneyPot field for bots

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
      // Se o contexto for cadastro de lead via QR, forçar modo registro de loja
      if (signupContext === 'merchant_lead_qr') {
        setMode('register');
        setProfileType('store');
      } else {
        // Reset padrão
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
      onClose(); // Bot detected
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
        // --- LOGIN FLOW ---
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
        // --- REGISTER FLOW ---
        const role = profileType === 'store' ? 'lojista' : 'cliente';

        // 1. Criar usuário no Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }, // Salva metadata importante
          },
        });

        if (error) throw error;

        if (data.session) {
          const userId = data.user?.id;
          if (userId) {
            // 2. Garantir criação do perfil na tabela 'profiles'
            // Isso é crucial para o App.tsx decidir qual tela mostrar
            const { error: profileError } = await supabase.from('profiles').upsert(
              {
                id: userId,
                email,
                role, // 'cliente' ou 'lojista'
                created_at: new Date().toISOString()
              },
              { onConflict: 'id' }
            );

            if (profileError) {
                console.error("Erro ao criar perfil:", profileError);
                // Não bloqueamos o fluxo, mas logamos. O App.tsx tentará corrigir/criar depois.
            }
          }

          setSuccessMsg(role === 'lojista' ? 'Conta de Lojista criada! Acessando painel...' : 'Conta criada! Entrando...');
          
          // Pequeno delay para usuário ler a mensagem
          setTimeout(() => finishAuth(), 1000);
        } else {
          // Caso de confirmação de email obrigatória (se ativado no Supabase)
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

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-gray-100 dark:border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <X />
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {mode === 'login' ? 'Acesse para continuar' : 'Escolha seu tipo de perfil'}
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

        {/* Visual Cue for Merchant Mode */}
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
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">E-mail</label>
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