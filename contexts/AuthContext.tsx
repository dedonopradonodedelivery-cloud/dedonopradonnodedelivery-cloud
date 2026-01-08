
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'cliente' | 'lojista' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'cliente' | 'lojista' | null>(null);
  
  // UX: authResolved controla o Cold Start (boot inicial)
  const [authResolved, setAuthResolved] = useState(false);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (data) {
        setUserRole(data.role === 'lojista' ? 'lojista' : 'cliente');
      } else {
        setUserRole('cliente'); 
      }
    } catch (error) {
      console.warn('Erro ao buscar role em background:', error);
      setUserRole('cliente');
    }
  };

  useEffect(() => {
    let mounted = true;

    // Listener para eventos de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      // 1. Atualiza estado base da sessão
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // 2. Se houver usuário, BUSCA A ROLE E ESPERA
      if (currentSession?.user) {
        // Importante: await aqui garante que userRole esteja setado antes de authResolved virar true
        await fetchUserRole(currentSession.user.id);
      } else {
        setUserRole(null);
      }
      
      // 3. Só agora libera a UI
      setAuthResolved(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  // loading é true apenas durante o primeiro check de sessão (Cold Start)
  const loading = !authResolved;

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
