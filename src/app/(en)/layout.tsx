import type { ReactNode } from 'react';
import { RootDocument } from '@/components/layout/RootDocument';
import { rootMetadata, rootViewport } from '@/seo/rootMetadata';

export const metadata = rootMetadata;
export const viewport = rootViewport;

/**
 * Layout raiz da versão em inglês. Trocar entre `/` e `/en` recarrega a
 * página inteira, porque cada idioma tem o seu `<html lang>`.
 */
export default function EnglishRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RootDocument lang='en'>{children}</RootDocument>;
}
