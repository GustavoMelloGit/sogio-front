import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import { ROUTES } from '@/routes/routes';
import { LandingSection } from './LandingSection';
import { LandingCta } from './LandingCta';

const PLANS = [
  {
    key: 'free',
    highlighted: false,
    features: ['feature1', 'feature2'],
  },
  {
    key: 'pro',
    highlighted: true,
    features: ['feature1', 'feature2', 'feature3', 'feature4'],
  },
] as const;

export const PlansSection = () => {
  const { t } = useTranslation('landing');

  return (
    <LandingSection
      id='planos'
      eyebrow={t('plans.eyebrow')}
      title={t('plans.title')}
      subtitle={t('plans.subtitle')}
    >
      <div className='grid gap-6 md:grid-cols-2 md:gap-8'>
        {PLANS.map(({ key, highlighted, features }) => (
          <article
            key={key}
            className={cn(
              'flex flex-col rounded-2xl border p-6 md:p-8',
              highlighted
                ? 'border-lp-brand bg-lp-brand-soft'
                : 'border-lp-border bg-lp-surface'
            )}
          >
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h3 className='text-lp-text text-2xl font-bold md:text-3xl'>
                {t(`plans.${key}.name`)}
              </h3>
              {highlighted ? (
                <span className='bg-lp-brand text-lp-on-brand rounded-full px-3 py-1 text-sm font-semibold'>
                  {t('plans.pro.badge')}
                </span>
              ) : null}
            </div>

            <p className='text-lp-muted mt-2 text-base md:text-lg'>
              {t(`plans.${key}.description`)}
            </p>

            <p className='mt-6 flex items-baseline gap-1'>
              <span
                className={cn(
                  'text-4xl font-bold md:text-5xl',
                  highlighted ? 'text-lp-brand' : 'text-lp-text'
                )}
              >
                {t(`plans.${key}.price`)}
              </span>
              <span className='text-lp-text text-lg md:text-xl'>
                {t(`plans.${key}.period`)}
              </span>
            </p>

            <ul className='mt-8 flex flex-1 flex-col gap-4'>
              {features.map(feature => (
                <li key={feature} className='flex items-start gap-3'>
                  <span className='flex h-[1.6em] shrink-0 items-center text-base md:text-lg'>
                    <span className='bg-lp-brand text-lp-on-brand flex size-6 items-center justify-center rounded-full'>
                      <Check className='size-4' aria-hidden />
                    </span>
                  </span>
                  <span className='text-lp-text text-base md:text-lg'>
                    {t(`plans.${key}.${feature}`)}
                  </span>
                </li>
              ))}
            </ul>

            <LandingCta
              href={ROUTES.signup}
              size={highlighted ? 'large' : 'default'}
              className={cn(
                'mt-8 w-full',
                !highlighted &&
                  'bg-lp-surface text-lp-text border-lp-border border shadow-none'
              )}
              onClick={() => trackEvent('cta_click_plans', { plan: key })}
            >
              {t(`plans.${key}.cta`)}
            </LandingCta>
          </article>
        ))}
      </div>

      <p className='text-lp-muted mt-6 text-base'>{t('plans.disclaimer')}</p>
    </LandingSection>
  );
};
