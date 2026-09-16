import type { ReactNode } from 'react';
import { AppLayout } from '@/components/layout';
import { CheckoutReturnHandler } from '@/modules/billing/components/CheckoutReturnHandler';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CheckoutReturnHandler />
      <AppLayout>{children}</AppLayout>
    </>
  );
}
