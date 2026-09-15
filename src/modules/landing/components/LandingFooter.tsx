import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/language';
import { ROUTES } from '@/routes/routes';
import { LanguageToggle } from './LanguageToggle';

interface LandingFooterProps {
  language: Language;
  onSelectLanguage: (language: Language) => void;
}

export const LandingFooter = ({
  language,
  onSelectLanguage,
}: LandingFooterProps) => {
  const { t } = useTranslation('landing');

  return (
    <footer className='border-lp-border border-t px-5 py-10 md:px-8 md:py-12'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-lp-text text-xl font-bold'>Sogio</p>
          <p className='text-lp-muted mt-1 text-base'>{t('footer.tagline')}</p>
        </div>

        <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
          <Link
            href={ROUTES.guides}
            className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center text-base transition-colors'
          >
            {t('footer.guides')}
          </Link>
          <Link
            href={ROUTES.login}
            className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center text-base transition-colors'
          >
            {t('footer.login')}
          </Link>
          <LanguageToggle language={language} onSelect={onSelectLanguage} />
        </div>
      </div>

      <p className='text-lp-muted mx-auto mt-8 w-full max-w-6xl text-sm'>
        {t('footer.rights', { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
};
