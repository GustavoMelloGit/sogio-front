import type { LegalDocument } from '@/modules/legal/types/LegalDocument';
import { ROUTES } from '@/routes/routes';
import { buildGuideMetadata } from './guideMetadata';

export const buildLegalMetadata = (document: LegalDocument, path: string) =>
  buildGuideMetadata({
    title: document.title,
    description: document.description,
    path,
    breadcrumb: [
      { name: 'Início', path: ROUTES.landing },
      { name: document.title, path },
    ],
  });
