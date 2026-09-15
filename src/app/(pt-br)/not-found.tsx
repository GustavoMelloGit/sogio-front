import { SpaShell } from '@/components/SpaShell';
import { NotFoundView } from '@/modules/error/view/NotFoundView';

export default function NotFound() {
  return (
    <SpaShell>
      <NotFoundView />
    </SpaShell>
  );
}
