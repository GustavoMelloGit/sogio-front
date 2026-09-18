import { GuideShell } from '@/modules/guides/components/GuideShell';
import type { LegalDocument } from '../types/LegalDocument';

interface LegalViewProps {
  document: LegalDocument;
}

const LegalView = ({ document }: LegalViewProps) => {
  return (
    <GuideShell>
      <article className='mx-auto w-full max-w-3xl px-5 pt-28 pb-12 md:px-8 md:pt-36 md:pb-16'>
        <h1 className='text-lp-text text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'>
          {document.title}
        </h1>

        <p className='text-lp-muted mt-4 text-sm'>
          <time dateTime={document.updatedAt}>
            Atualizada em{' '}
            {new Date(`${document.updatedAt}T12:00:00`).toLocaleDateString(
              'pt-BR',
              { day: '2-digit', month: 'long', year: 'numeric' }
            )}
          </time>
        </p>

        <div
          className='lp-prose mt-10'
          dangerouslySetInnerHTML={{ __html: document.html }}
        />
      </article>
    </GuideShell>
  );
};

export default LegalView;
