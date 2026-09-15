import Link from 'next/link';
import { ROUTES } from '@/routes/routes';
import { GUIDES_INDEX } from '@/seo/guideMetadata';
import { GUIDES } from '../service/guides';
import { GuideShell } from '../components/GuideShell';

const GuidesIndexView = () => {
  return (
    <GuideShell>
      <div className='mx-auto w-full max-w-4xl px-5 pt-28 pb-12 md:px-8 md:pt-36 md:pb-16'>
        <h1 className='text-lp-text text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'>
          {GUIDES_INDEX.title}
        </h1>
        <p className='text-lp-muted mt-4 max-w-2xl text-lg md:text-xl'>
          Contas, comparações e rotinas de quem cuida de imóveis de temporada,
          explicadas sem jargão.
        </p>

        <ul className='mt-10 flex flex-col gap-4'>
          {GUIDES.map(guide => (
            <li key={guide.slug}>
              <Link
                href={ROUTES.guide(guide.slug)}
                className='border-lp-border bg-lp-surface hover:border-lp-brand block rounded-2xl border p-6 transition-colors md:p-7'
              >
                <h2 className='text-lp-text text-xl font-semibold md:text-2xl'>
                  {guide.title}
                </h2>
                <p className='text-lp-muted mt-2 text-base md:text-lg'>
                  {guide.description}
                </p>
                <p className='text-lp-muted mt-3 text-sm'>
                  {guide.readingMinutes} min de leitura
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </GuideShell>
  );
};

export default GuidesIndexView;
