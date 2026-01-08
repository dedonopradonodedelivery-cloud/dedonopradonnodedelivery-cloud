
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'cliente' | 'lojista' | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  retryAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  error: null,
  signOut: async () => {},
  retryAuth: () => {},
});

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'cliente' | 'lojista' | null>(null);
  
  // Controls the loading state exposed to the app
  const [authResolved, setAuthResolved] = useState(false);
  // Controls critical failures that require user retry
  const [authError, setAuthError] = useState<Error | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      const fetchPromise = supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
      const data = result?.data;
      
      if (data) {
        setUserRole(data.role === 'lojista' ? 'lojista' : 'cliente');
      } else {
        setUserRole('cliente'); 
      }
    } catch (error) {
      console.warn('Erro ou timeout ao buscar role. Usando fallback:', error);
      setUserRole('cliente'); // Soft fail: let user in as client
    }
  };

  const initAuth = useCallback(async () => {
    setAuthResolved(false);
    setAuthError(null);
    let mounted = true;

    // Failsafe Global: 8 seconds max for the whole process
    const safetyTimeout = setTimeout(() => {
      if (mounted && !authResolved) {
        console.warn("⚠️ Auth initialization timed out. Triggering failsafe.");
        // If we have no session by now, assumes error/offline
        setAuthError(new Error("O carregamento demorou muito. Verifique sua conexão."));
        setAuthResolved(true);
      }
    }, 8000);

    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (mounted) {
        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          await fetchUserRole(data.session.user.id);
        }
      }
    } catch (err: any) {
      console.error("Critical Auth Error:", err);
      if (mounted) {
        setAuthError(err);
      }
    } finally {
      if (mounted) {
        clearTimeout(safetyTimeout);
        setAuthResolved(true);
      }
    }
  }, []);

  useEffect(() => {
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_IN' && currentSession?.user) {
        setAuthResolved(false); // Briefly lock to fetch role
        await fetchUserRole(currentSession.user.id);
        setAuthResolved(true);
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setAuthResolved(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initAuth]);

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

  const loading = !authResolved;

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, error: authError, signOut, retryAuth: initAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
