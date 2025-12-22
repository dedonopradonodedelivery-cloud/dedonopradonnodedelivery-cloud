
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase } from '../lib/supabaseClient'; // Adjust path as needed based on project root
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Componente para lidar com o redirecionamento OAuth em um pop-up.
 * Ele detecta a sessão do Supabase, notifica a janela principal e fecha o pop-up.
 */
export const AuthCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando login com Google...');

  useEffect(() => {
    let sessionListener: { data: { subscription: { unsubscribe: () => void; }; }; } | null = null;
    let timeoutId: number | null = null; // To clear the timeout

    const handleOAuthRedirect = async () => {
      // Use onAuthStateChange para capturar a sessão de forma robusta
      sessionListener = supabase.auth.onAuthStateChange((event, currentSession) => {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && currentSession) {
          setStatus('success');
          setMessage('Login bem-sucedido! Redirecionando...');
          
          // Clear any pending timeout
          if (timeoutId) clearTimeout(timeoutId);

          // Notifica a janela principal que o auth está completo
          if (window.opener) {
            window.opener.postMessage({ type: 'SUPABASE_OAUTH_DONE' }, window.location.origin);
          }
          // Fecha o pop-up após um pequeno atraso
          setTimeout(() => {
            window.close();
          }, 500);
        } else if (event === 'SIGNED_OUT') { // Only check for SIGNED_OUT here
            setStatus('error');
            setMessage('Login cancelado ou falhou.');
        } else { // Catch all other events or cases where session is null/undefined, indicating a failure
            setStatus('error');
            setMessage('Erro de autenticação ou sessão não estabelecida.');
        }
      });

      // Adiciona um timeout de segurança caso o `onAuthStateChange` não dispare
      // ou a sessão não seja estabelecida por algum motivo.
      timeoutId = window.setTimeout(() => {
        if (status === 'loading') { // Only if still loading
          setStatus('error');
          setMessage('Tempo esgotado: Não foi possível obter a sessão. Tente novamente.');
        }
      }, 7000); // 7 segundos para timeout
    };

    handleOAuthRedirect();

    // Limpeza: desinscreve o listener e limpa o timeout ao desmontar o componente
    return () => {
      if (sessionListener) {
        sessionListener.data.subscription.unsubscribe();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h1>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle2 className="w-10 h-10 text-green-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h1>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle className="w-10 h-10 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h1>
          <button 
            onClick={() => window.close()}
            className="mt-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </>
      )}
    </div>
  );
};

// Este script será executado no contexto do pop-up.
// Ele assume que o pop-up é um documento HTML mínimo que inclui o React e um elemento #root.
// Se o elemento #root não existir, a lógica de `onAuthStateChange` ainda tenta rodar
// para garantir que a sessão seja capturada e o `postMessage` enviado.
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthCallbackPage />
    </React.StrictMode>
  );
} else {
    // Fallback para ambientes onde o #root não é garantido em um pop-up mínimo.
    // Garante que o listener do Supabase rode mesmo sem React mount completo.
    console.warn("AuthCallbackPage: Elemento #root não encontrado. Rodando lógica de sessão diretamente.");
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            if (session && window.opener) {
                window.opener.postMessage({ type: 'SUPABASE_OAUTH_DONE' }, window.location.origin);
                window.close();
            }
        }
    });
}