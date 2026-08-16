import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../service/AuthService';
import {
  type AuthResponse,
  type ChangePasswordRequest,
  type LoginCredentials,
  type RequestPasswordResetRequest,
  type ResetPasswordRequest,
  type SignupRequest,
} from '../types/AuthTypes';

/**
 * Hook para obter dados de autenticação
 * Fornece dados do usuário e estado de autenticação
 */
export const useAuthData = () => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: () => AuthService.getAuthData(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: AuthService.isAuthenticated(),
  });

  return {
    user: authData || null,
    isAuthenticated: !!authData,
    isLoading,
  };
};

/**
 * Hook para realizar login de usuário
 * Fornece função de login e estados relacionados
 */
export const useSignin = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      AuthService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      AuthService.saveAuthData(data);
      queryClient.setQueryData(['auth'], data.user);
    },
  });

  return {
    signin: loginMutation.mutate,
    isSigninLoading: loginMutation.isPending,
    signinError: loginMutation.error,
  };
};

/**
 * Hook para realizar cadastro de usuário
 * Fornece função de signup e estados relacionados
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: (credentials: SignupRequest) => AuthService.signup(credentials),
    onSuccess: (data: AuthResponse) => {
      AuthService.saveAuthData(data);
      queryClient.setQueryData(['auth'], data.user);
    },
  });

  return {
    signup: signupMutation.mutate,
    isSignupLoading: signupMutation.isPending,
    signupError: signupMutation.error,
  };
};

/**
 * Hook para realizar logout
 * Fornece função de logout que invalida todas as queries
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    AuthService.logout();
    queryClient.setQueryData(['auth'], null);
    queryClient.invalidateQueries();
  };

  return { logout };
};

/**
 * Hook para alterar a senha do usuário autenticado. Não mexe na sessão nem
 * na cache de auth — a troca não afeta o token nem os dados do usuário.
 */
export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      AuthService.changePassword(data),
  });

  return {
    changePassword: mutation.mutate,
    isChangePasswordLoading: mutation.isPending,
    changePasswordError: mutation.error,
  };
};

/**
 * Hook para solicitar o email de redefinição de senha (fluxo público).
 */
export const useRequestPasswordReset = () => {
  const mutation = useMutation({
    mutationFn: (data: RequestPasswordResetRequest) =>
      AuthService.requestPasswordReset(data),
  });

  return {
    requestPasswordReset: mutation.mutate,
    isRequestPasswordResetLoading: mutation.isPending,
    requestPasswordResetError: mutation.error,
  };
};

/**
 * Hook para confirmar a redefinição de senha via token (fluxo público).
 * Não autentica o usuário em caso de sucesso.
 */
export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
  });

  return {
    resetPassword: mutation.mutate,
    isResetPasswordLoading: mutation.isPending,
    resetPasswordError: mutation.error,
  };
};
