import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

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

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (mounted) {
          const currentSession = data?.session ?? null;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await fetchUserRole(currentSession.user.id);
          }
        }
      } catch (err) {
        console.error("Erro na inicialização do Auth:", err);
      } finally {
        if (mounted) setAuthResolved(true);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setUser(currentSession?.user ?? null);
      setSession(currentSession);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (currentSession?.user) {
          fetchUserRole(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setUserRole(null);
      }
      
      setAuthResolved(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setUserRole(null);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  const loading = !authResolved;

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
