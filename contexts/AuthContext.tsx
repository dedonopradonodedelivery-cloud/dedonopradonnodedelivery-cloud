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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'cliente' | 'lojista' | null>(null);
  // O estado loading começa explicitamente como TRUE
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
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
      console.error('Erro ao buscar role:', error);
      setUserRole('cliente');
    }
  };

  useEffect(() => {
    let mounted = true;

    // Função de inicialização robusta
    const initAuth = async () => {
      try {
        // Tenta obter a sessão inicial
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            await fetchUserRole(initialSession.user.id);
          }
        }
      } catch (err) {
        console.error("Erro na verificação de sessão inicial:", err);
      } finally {
        // GARANTE que o loading seja falso após a verificação inicial, independente do resultado
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listener para mudanças de estado (Login, Logout, Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setUser(null);
        setSession(null);
      }
      
      // Garante que o loading saia caso o onAuthStateChange dispare antes ou depois do init
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);