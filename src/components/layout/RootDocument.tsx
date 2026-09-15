import type { ReactNode } from 'react';
import '@/index.css';
import { AppProviders } from '@/components/AppProviders';

interface RootDocumentProps {
  /** Valor de `<html lang>`. */
  lang: string;
  children: ReactNode;
}

/**
 * Documento compartilhado pelos layouts raiz.
 *
 * Existe um layout raiz por idioma porque `<html lang>` é decidido no servidor
 * e precisa bater com a URL: `/en` sai em inglês no HTML estático, e não depois
 * que o JavaScript roda. `suppressHydrationWarning` é exigência do
 * `next-themes`, que escreve a classe do tema no `<html>` antes de hidratar.
 */
export const RootDocument = ({ lang, children }: RootDocumentProps) => (
  <html lang={lang} suppressHydrationWarning data-scroll-behavior='smooth'>
    <body>
      <AppProviders>{children}</AppProviders>
    </body>
  </html>
);
