import type { ReactNode } from 'react';
import { RootDocument } from '@/components/layout/RootDocument';
import { rootMetadata, rootViewport } from '@/seo/rootMetadata';

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang='pt-BR'>{children}</RootDocument>;
}
