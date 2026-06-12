export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: unknown;
  };
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