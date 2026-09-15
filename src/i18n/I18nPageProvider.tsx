'use client';

import { useMemo, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './index';
import type { Language } from './language';

interface I18nPageProviderProps {
  /** Idioma que a URL representa: `/` é pt-BR e `/en` é inglês. */
  language: Language;
  children: ReactNode;
}

/**
 * Fixa o idioma de uma página pública, no servidor e no cliente.
 *
 * A URL manda no idioma, sem exceção: é o que o `hreflang` e o `canonical`
 * prometem. Uma cópia da instância, e não `changeLanguage` na global, porque
 * no servidor a global é compartilhada entre requisições e no cliente ela
 * reflete a preferência salva — que pode ser outra e causaria divergência de
 * hidratação. A cópia divide os recursos com a global, então não carrega nada
 * de novo.
 */
export const I18nPageProvider = ({
  language,
  children,
}: I18nPageProviderProps) => {
  const instance = useMemo(
    () => i18n.cloneInstance({ lng: language, initAsync: false }),
    [language]
  );

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};
