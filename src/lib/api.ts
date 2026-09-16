import axios, { AxiosError } from 'axios';
import { env } from './env';
import { ROUTES } from '@/routes/routes';

declare module 'axios' {
  export interface AxiosRequestConfig {
    // Some 401s aren't an expired session (e.g. wrong current password,
    // invalid reset token) — set this to skip the global logout/redirect.
    skipAuthRedirect?: boolean;
  }
}

/**
 * Configuração base do Axios para a aplicação Sogio
 * Define interceptors, base URL e configurações padrão
 */
const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  /**
   * A sessão viaja num cookie `httpOnly` gravado pela API, que o navegador
   * envia sozinho. Não há token para anexar aqui — é justamente o ponto: o
   * segredo não é legível por JavaScript, então um XSS não o leva embora.
   */
  withCredentials: true,
});

/**
 * Interceptor para respostas - trata erros globais
 */
api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      // Sessão expirada, encerrada ou ausente. Quem apaga o cookie é a API;
      // aqui só resta sair da tela protegida.
      window.location.href = ROUTES.login;
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    if (
      typeof error.response?.data === 'object' &&
      error.response.data !== null &&
      'message' in error.response.data &&
      typeof error.response.data.message === 'string'
    ) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
