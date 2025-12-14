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
  
  // ESTADO DE SEGURANÇA: authResolved
  // true = O sistema já verificou se há ou não usuário (logado ou deslogado).
  // false = Ainda não sabemos nada (Splash Screen).
  const [authResolved, setAuthResolved] = useState(false);

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

    // 1. Verificação Inicial Rápida (LocalStorage)
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          
          if (data.session?.user) {
            // Busca role em background - NÃO bloqueia o splash
            fetchUserRole(data.session.user.id);
          }
        }
      } catch (err) {
        console.error("Erro no getSession:", err);
      } finally {
        // REGRA DE OURO: Sempre libera o app após a checagem inicial
        if (mounted) setAuthResolved(true);
      }
    };

    initAuth();

    // 2. Listener para mudanças futuras
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (currentSession?.user) {
          fetchUserRole(currentSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setUser(null);
        setSession(null);
      }
      
      // Garante liberação caso o listener dispare antes do initAuth
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
      setUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Se authResolved for true, loading é false (app liberado)
  const loading = !authResolved;

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);