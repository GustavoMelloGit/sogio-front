import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import { ROUTES } from '@/routes/routes';
import { LandingCta } from './LandingCta';

export const FinalCtaSection = () => {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden px-5 py-20 md:px-8 md:py-28'>
      <div
        aria-hidden
        className='bg-lp-brand pointer-events-none absolute bottom-[-14rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-[var(--lp-glow-opacity)] blur-[120px]'
      />
      <div className='relative mx-auto flex max-w-3xl flex-col items-center text-center'>
        <h2 className='text-lp-text text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'>
          {t('finalCta.title')}
        </h2>
        <p className='text-lp-muted mt-4 text-lg md:text-xl'>
          {t('finalCta.subtitle')}
        </p>
        <LandingCta
          href={ROUTES.signup}
          size='large'
          className='mt-9 w-full sm:w-auto'
          onClick={() => trackEvent('cta_click_final')}
        >
          {t('finalCta.cta')}
        </LandingCta>
      </div>
    </section>
  );
};
