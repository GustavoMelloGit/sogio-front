import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/layout';
import { PlanChoiceGate } from '@/modules/billing/components/plan-choice/PlanChoiceGate';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <PlanChoiceGate>
        <AppLayout>{children}</AppLayout>
      </PlanChoiceGate>
    </ProtectedRoute>
  );
}
