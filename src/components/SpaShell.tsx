'use client';

import {
  Suspense,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import i18n from '@/i18n';
import { AppUpdateToast } from '@/components/AppUpdateToast';

const subscribe = () => () => {};

/**
 * Casca das telas que só existem no navegador: o produto autenticado, login,
 * cadastro e os links enviados a hóspedes.
 *
 * Elas não renderizam no servidor. Dependem do token e do idioma salvos no
 * `localStorage`, que o servidor não enxerga — renderizar lá produziria HTML
 * de visitante anônimo em português e divergência de hidratação para todo
 * mundo que não fosse isso. Nenhuma delas tem valor de busca, então o custo de
 * esperar o JavaScript é o mesmo que o app sempre teve.
 */
export const SpaShell = ({ children }: { children: ReactNode }) => {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  // Aqui o idioma segue a preferência do usuário, e o `<html lang>` acompanha.
  // Ao sair para uma página pública, volta o idioma que o servidor declarou.
  useEffect(() => {
    const root = document.documentElement;
    const serverLang = root.lang;
    const sync = (language: string) => {
      root.lang = language;
    };

    sync(i18n.language);
    i18n.on('languageChanged', sync);

    return () => {
      i18n.off('languageChanged', sync);
      root.lang = serverLang;
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      <AppUpdateToast />
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
};
