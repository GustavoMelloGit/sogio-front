import api from '@/lib/api';
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginCredentials,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  SignupRequest,
  User,
} from '../types/AuthTypes';

/**
 * Serviço responsável por operações de autenticação
 * Gerencia login, registro e logout de usuários
 */
export class AuthService {
  /**
   * Realiza login do usuário
   * @param credentials - Credenciais de login (email e senha)
   * @returns Promise com dados do usuário e token de autenticação
   *
   * Um 401 aqui significa "credenciais inválidas", não sessão expirada —
   * `skipAuthRedirect` evita o logout forçado que o interceptor global
   * dispara por padrão (ver `changePassword`).
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/auth/sign-in',
      credentials,
      {
        skipAuthRedirect: true,
      }
    );
    return response.data;
  }

  /**
   * Registra um novo usuário
   * @param credentials - Dados de registro do usuário
   * @returns Promise com dados do usuário e token de autenticação
   */
  static async signup(credentials: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/users', credentials);
    return response.data;
  }

  /**
   * Encerra a sessão no servidor. Antes o logout só apagava o
   * `localStorage`, e o token continuava valendo para quem o tivesse copiado.
   */
  static async signOut(): Promise<void> {
    await api.post('/auth/sign-out', undefined, { skipAuthRedirect: true });
  }

  /**
   * Usuário da sessão atual, resolvido pela API a partir do cookie.
   */
  static async getAuthData(): Promise<User | null> {
    // `skipAuthRedirect`: aqui o 401 é a resposta esperada para quem não tem
    // sessão, e não sessão expirada. Sem isso, a tela de login se
    // redirecionaria para si mesma em laço ao perguntar quem é o usuário.
    const response = await api.get<User>('/auth/me', {
      skipAuthRedirect: true,
    });
    return response.data;
  }

  /**
   * Altera a senha do usuário autenticado. Um 401 aqui significa "senha
   * atual incorreta", não sessão expirada — `skipAuthRedirect` evita o
   * logout forçado que o interceptor global dispara por padrão.
   */
  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.post('/auth/change-password', data, {
      skipAuthRedirect: true,
    });
  }

  static async requestPasswordReset(
    data: RequestPasswordResetRequest
  ): Promise<RequestPasswordResetResponse> {
    const response = await api.post<RequestPasswordResetResponse>(
      '/auth/password-reset/request',
      data
    );
    return response.data;
  }

  /**
   * Confirma a redefinição de senha. Um 401 aqui significa token inválido,
   * expirado ou já usado — não sessão expirada, ver `changePassword`.
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await api.post('/auth/password-reset/confirm', data, {
      skipAuthRedirect: true,
    });
  }
}
