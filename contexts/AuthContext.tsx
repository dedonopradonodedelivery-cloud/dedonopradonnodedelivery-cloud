import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

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
          fetchUserRole(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        // Garantia redundante de limpeza via Listener
        setUser(null);
        setSession(null);
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
    // 1. Limpeza Imediata de Estado (Memória)
    // Isso garante que a UI reaja instantaneamente, removendo o acesso e voltando para "Visitante"
    setUser(null);
    setSession(null);
    setUserRole(null);

    try {
      // 2. Invalidação de Sessão (Backend + LocalStorage do Client)
      // O Supabase remove o token do localStorage e invalida a sessão no servidor
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      // Mesmo com erro de rede, o estado local já foi limpo (passo 1), 
      // impedindo que o usuário continue navegando como logado.
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
