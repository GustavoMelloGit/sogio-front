import type { ReactNode } from 'react';
import { SpaShell } from '@/components/SpaShell';

export default function SpaLayout({ children }: { children: ReactNode }) {
  return <SpaShell>{children}</SpaShell>;
}
