/**
 * Tipo local representando o usuário autenticado do Supabase para evitar conflito de importação.
 */
export interface AuthUser {
  id: string;
  email?: string;
}

/**
 * Estado da autenticação do usuário.
 */
export interface AuthState {
  user: AuthUser | null;
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