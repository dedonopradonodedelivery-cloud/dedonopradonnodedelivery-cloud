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

    // 1. Verificação Inicial Rápida com Timeout de Segurança
    const initAuth = async () => {
      // Cria uma promessa que "falha" (ou resolve como guest) após 3 segundos
      // Isso impede que o app fique travado no Splash se o Supabase não responder
      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => resolve({ data: { session: null }, error: 'timeout' }), 3000)
      );

      try {
        // Corrida: Quem responder primeiro (Supabase ou Timeout) ganha
        const { data } = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]) as any;
        
        if (mounted) {
          const currentSession = data?.session ?? null;
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            // Busca role em background - NÃO bloqueia o splash
            fetchUserRole(currentSession.user.id);
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

    // 2. Listener para mudanças futuras (Login/Logout em tempo real)
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
      
      // Garante liberação caso o listener dispare antes ou depois do initAuth
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