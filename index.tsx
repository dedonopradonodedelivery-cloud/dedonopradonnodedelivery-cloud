
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { supabase } from './lib/supabaseClient';
import './index.css';

const FCM_TOKEN_MOCK = "fcm_token_device_local_123456";

const AuthSync: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      registerFcmToken(user.id);
    }
  }, [user]);

  const registerFcmToken = async (userId: string) => {
    try {
      // Busca perfil atual para ver se token já existe
      const { data } = await supabase.from('profiles').select('fcmTokens').eq('id', userId).single();
      if (data) {
        const tokens = data.fcmTokens || [];
        if (!tokens.includes(FCM_TOKEN_MOCK)) {
          await supabase.from('profiles').update({
            fcmTokens: [...tokens, FCM_TOKEN_MOCK]
          }).eq('id', userId);
        }
      }
    } catch (e) {
      console.warn("FCM registration simulation failed", e);
    }
  };

  return <App />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <AuthSync />
      </AuthProvider>
    </React.StrictMode>
  );
}
