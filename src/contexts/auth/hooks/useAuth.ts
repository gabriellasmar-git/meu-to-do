"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, AuthCredentials } from '../auth.types';
import { toast } from 'sonner';

/**
 * Hook que gerencia o estado de autenticação e fornece métodos de ação.
 * 
 * @returns Objeto com estado do usuário e funções de login/logout/cadastro.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    // Verifica sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        isLoading: false,
        isAuthenticated: !!session?.user,
      });
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        isLoading: false,
        isAuthenticated: !!session?.user,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }: AuthCredentials) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(`Erro ao entrar: ${error.message}`);
      throw error;
    }
    toast.success("Bem-vindo de volta!");
    router.push('/');
  };

  const register = async ({ email, password }: AuthCredentials) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(`Erro ao cadastrar: ${error.message}`);
      throw error;
    }
    toast.success("Cadastro realizado! Verifique seu e-mail.");
    router.push('/login');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Até logo!");
    router.push('/login');
  };

  return { ...state, login, register, logout };
}