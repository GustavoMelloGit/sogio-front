import { z } from 'zod';

/**
 * Schema de validação para variáveis de ambiente
 * `NEXT_PUBLIC_*` é embutida no bundle do cliente no build; cada variável
 * precisa ser lida por nome literal em `process.env` para isso acontecer.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default('http://localhost:3030'),
  /** URL pública do site, usada nos canonical/hreflang e no sitemap. */
  NEXT_PUBLIC_SITE_URL: z.url().default('https://www.sogio.app'),
  /** Project ID do Microsoft Clarity. Vazio desliga o analytics. */
  NEXT_PUBLIC_CLARITY_ID: z.string().trim().optional(),
  /**
   * Token do Google Search Console. Só o conteúdo, sem a tag: a meta sai no
   * `<head>` do HTML estático pela Metadata API do layout raiz.
   */
  NEXT_PUBLIC_GSC_VERIFICATION: z.string().trim().optional(),
  /**
   * Nome do cookie de sessão gravado pela API. O front não lê o valor — é
   * `httpOnly` —, só verifica a presença no `proxy.ts` para decidir
   * redirecionamento.
   *
   * Precisa bater com o nome que a API emite: em produção ela prefixa com
   * `__Secure-` (defesa contra um subdomínio sobrescrever a sessão), então
   * ali o valor é `__Secure-sogio_session`. Localmente, sem o prefixo.
   */
  NEXT_PUBLIC_SESSION_COOKIE_NAME: z.string().trim().default('sogio_session'),
  NEXT_PUBLIC_BUILD_ID: z.string().trim().default('development'),
});

/**
 * Tipo inferido das variáveis de ambiente validadas
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Valida e retorna as variáveis de ambiente com type-safety
 * Lança erro se a variável obrigatória estiver ausente ou inválida
 */
function validateEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
      NEXT_PUBLIC_GSC_VERIFICATION: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
      NEXT_PUBLIC_SESSION_COOKIE_NAME:
        process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
      NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`
      );

      throw new Error(
        `❌ Variáveis de ambiente inválidas:\n${errorMessages.join('\n')}\n\n` +
          'Verifique o arquivo .env e certifique-se de que NEXT_PUBLIC_API_URL está definida.'
      );
    }
    throw error;
  }
}

/**
 * Instância validada das variáveis de ambiente
 * Disponível globalmente na aplicação com type-safety completo
 */
export const env = validateEnv();
