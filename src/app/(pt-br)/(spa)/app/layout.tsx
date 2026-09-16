import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PlanChoiceGate } from '@/modules/billing/components/plan-choice/PlanChoiceGate';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <PlanChoiceGate>{children}</PlanChoiceGate>
    </ProtectedRoute>
  );
}
