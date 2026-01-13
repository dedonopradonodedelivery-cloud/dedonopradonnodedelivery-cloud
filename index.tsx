
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { ConfigProvider } from './contexts/ConfigContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
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
      <ConfigProvider>
        <NeighborhoodProvider>
          <AuthProvider>
            <AuthSync />
          </AuthProvider>
        </NeighborhoodProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
