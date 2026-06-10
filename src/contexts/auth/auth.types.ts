import { User } from '@supabase/supabase-js';

/**
 * Estado da autenticação do usuário.
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Dados necessários para login.
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Dados necessários para o novo cadastro de usuário.
 */
export interface RegisterCredentials extends AuthCredentials {
  fullName: string;
}