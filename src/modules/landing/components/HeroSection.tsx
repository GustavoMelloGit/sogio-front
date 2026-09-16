import type { CSSProperties } from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import { ROUTES } from '@/routes/routes';
import { LandingCta } from './LandingCta';

const WAVEFORM = [26, 58, 40, 82, 50, 92, 36, 68, 96, 54, 32, 76, 44, 88, 34];

/**
 * A entrada escalonada do herói vive na classe `lp-rise` (`src/index.css`), que
 * também trata `prefers-reduced-motion`. O atraso de cada elemento entra por
 * `--lp-delay`.
 */
export const HeroSection = () => {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24'>
      {/* Brilho de marca atrás do texto. Puramente decorativo. */}
      <div
        aria-hidden
        className='bg-lp-brand pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-[var(--lp-glow-opacity)] blur-[120px] md:h-[40rem] md:w-[40rem]'
      />

      <div className='relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16'>
        <div>
          <p
            className='lp-rise border-lp-border bg-lp-brand-soft text-lp-text mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium md:text-base'
            style={{ '--lp-delay': '0ms' } as CSSProperties}
          >
            <span className='bg-lp-brand size-2 rounded-full' aria-hidden />
            {t('hero.badge')}
          </p>

          <h1 className='text-lp-text text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[4.1rem]'>
            <span
              className='lp-rise block'
              style={{ '--lp-delay': '80ms' } as CSSProperties}
            >
              {t('hero.titleLine1')}
            </span>
            {/* O espaço é explícito: sem ele os dois `span` ficam colados no
                HTML e quem extrai texto por regex, como boa parte dos crawlers
                de IA, lê "reservaem planilha". O `display: block` só resolve
                para quem interpreta CSS. */}{' '}
            <span
              className='lp-rise text-lp-brand block'
              style={{ '--lp-delay': '180ms' } as CSSProperties}
            >
              {t('hero.titleLine2')}
            </span>
          </h1>

          <p
            className='lp-rise text-lp-muted mt-6 max-w-xl text-lg md:mt-8 md:text-2xl'
            style={{ '--lp-delay': '300ms' } as CSSProperties}
          >
            {t('hero.subtitle')}
          </p>

          <div
            className='lp-rise mt-8 md:mt-10'
            style={{ '--lp-delay': '420ms' } as CSSProperties}
          >
            <LandingCta
              href={ROUTES.signup}
              size='large'
              className='w-full sm:w-auto'
              onClick={() => trackEvent('cta_click_hero')}
            >
              {t('hero.cta')}
            </LandingCta>
            <p className='text-lp-muted mt-3 text-base'>
              {t('hero.ctaTrigger')}
            </p>
          </div>
        </div>

        <div
          className='lp-rise relative'
          style={{ '--lp-delay': '500ms' } as CSSProperties}
        >
          <HeroTeaser />
        </div>
      </div>
    </section>
  );
};

/**
 * Prévia de um único par pergunta/resposta. A demonstração completa, com os
 * três atos em laço, vive na seção seguinte — aqui é só o gancho visual.
 */
const HeroTeaser = () => {
  const { t } = useTranslation('landing');

  return (
    <div className='border-lp-border bg-lp-surface mx-auto w-full max-w-md rounded-3xl border p-4 shadow-[0_40px_90px_-50px_var(--lp-glow)] md:p-5'>
      <div className='bg-lp-bubble-out ml-auto w-fit max-w-[92%] rounded-2xl rounded-br-md px-4 py-3'>
        <div className='flex items-center gap-3'>
          <span className='bg-lp-brand text-lp-on-brand flex size-9 shrink-0 items-center justify-center rounded-full'>
            <Play className='size-4 fill-current' aria-hidden />
          </span>
          <span className='flex h-7 items-end gap-[3px]' aria-hidden>
            {WAVEFORM.map((height, index) => (
              <span
                key={index}
                className='bg-lp-text/55 w-[3px] rounded-full'
                style={{ height: `${Math.max(height * 0.26, 4)}px` }}
              />
            ))}
          </span>
          <span className='text-lp-text shrink-0 text-sm'>
            {t('demo.acts.audio.duration')}
          </span>
        </div>
        <p className='text-lp-text mt-2 text-sm italic md:text-base'>
          “{t('demo.acts.audio.transcript')}”
        </p>
      </div>

      <div className='bg-lp-bubble-in border-lp-border text-lp-text mt-3 w-fit max-w-[92%] rounded-2xl rounded-bl-md border px-4 py-3 text-base md:text-lg'>
        {t('demo.acts.audio.reply')}
      </div>
    </div>
  );
};
