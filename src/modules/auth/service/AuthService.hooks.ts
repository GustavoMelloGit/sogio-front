import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
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
  // Sem checagem síncrona antes de perguntar: o cookie da sessão é
  // `httpOnly`, então o navegador não consegue dizer se existe. Quem
  // responde é a API, e um 401 aqui significa visitante anônimo.
  const {
    data: authData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['auth'],
    queryFn: () => AuthService.getAuthData(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });

  const isAnonymous = isAxiosError(error) && error.response?.status === 401;

  return {
    user: authData || null,
    isAuthenticated: !!authData,
    isLoading,
    isUnavailable: !!error && !isAnonymous,
    retry: () => refetch(),
    isRetrying: isFetching,
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
 * Hook para realizar logout.
 *
 * Pede à API para encerrar a sessão — é ela quem apaga o cookie — e só então
 * limpa a cache. A falha da chamada não impede a limpeza local: se a rede
 * caiu, sair da tela ainda é o que a pessoa pediu, e a sessão morre sozinha
 * na expiração.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await AuthService.signOut();
    } finally {
      queryClient.setQueryData(['auth'], null);
      await queryClient.invalidateQueries();
    }
  };

  return { logout };
};

/**
 * Hook para alterar a senha do usuário autenticado. A sessão atual sobrevive
 * à troca — a API encerra as outras —, então não há cache a invalidar aqui.
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
