
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'cliente' | 'lojista' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
  isAdmin: () => false,
});

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // UX: authResolved controla o Cold Start (boot inicial)
  // Uma vez resolvido (true), ele NUNCA mais volta a ser false durante a sessão do browser.
  const [authResolved, setAuthResolved] = useState(false);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (data) {
        // Suporta estritamente 'admin', 'lojista' ou 'cliente'
        const role = data.role as UserRole;
        if (['admin', 'lojista', 'cliente'].includes(role)) {
          setUserRole(role);
        } else {
          setUserRole('cliente');
        }
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
        // Busca sessão atual sem bloquear o app por muito tempo
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

    // Listener para eventos de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      // Importante: Apenas atualizamos os objetos de estado.
      // O React cuida de re-renderizar apenas o que depende desses objetos.
      setUser(currentSession?.user ?? null);
      setSession(currentSession);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
      }
      
      // Se por algum motivo o initAuth falhou, o primeiro evento do listener garante a liberação do Splash
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
      // O listener onAuthStateChange cuidará de limpar os estados.
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  const isAdmin = () => userRole === 'admin';

  // loading é true apenas durante o primeiro check de sessão (Cold Start)
  const loading = !authResolved;

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
