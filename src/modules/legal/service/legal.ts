import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import type { LegalDocument } from '../types/LegalDocument';

const LEGAL_DIR = join(process.cwd(), 'src/content/legal');

const load = (
  file: string,
  meta: Omit<LegalDocument, 'html'>
): LegalDocument => ({
  ...meta,
  html: marked.parse(readFileSync(join(LEGAL_DIR, file), 'utf8'), {
    async: false,
    gfm: true,
  }),
});

export const PRIVACY_POLICY = load('privacidade.md', {
  title: 'Política de Privacidade',
  description:
    'Quais dados o Sogio coleta, para que usa, com quem compartilha e como você exerce seus direitos pela LGPD.',
  updatedAt: '2026-09-18',
});

export const TERMS_OF_USE = load('termos.md', {
  title: 'Termos de Uso',
  description:
    'As regras de uso do Sogio: conta, planos e pagamento, responsabilidades e cancelamento.',
  updatedAt: '2026-09-18',
});
