import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import type { Language } from '@/i18n/language';
import type { LandingTheme } from '../lib/useLandingTheme';
import { LanguageToggle } from './LanguageToggle';
import { LandingCta } from './LandingCta';

interface LandingHeaderProps {
  theme: LandingTheme;
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (language: Language) => void;
}

const NAV_ITEMS = [
  { href: '#como-funciona', key: 'nav.howItWorks' },
  { href: '#respostas', key: 'nav.answers' },
  { href: '#duvidas', key: 'nav.faq' },
] as const;

export const LandingHeader = ({
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
}: LandingHeaderProps) => {
  const { t } = useTranslation('landing');

  return (
    <header className='fixed inset-x-0 top-0 z-50 px-4 py-3 md:px-6 md:py-4'>
      <a
        href='#conteudo'
        className='bg-lp-brand text-lp-on-brand sr-only rounded-b-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-0 focus:left-4'
      >
        {t('nav.skipToContent')}
      </a>

      {/* A pílula flutua com margem da borda da tela, como no cabeçalho da
          Magie. O `lp-glass` traz o desfoque e o brilho especular. */}
      <div className='lp-glass mx-auto flex w-full max-w-6xl items-center gap-3 rounded-full py-2 pr-2 pl-4 md:pl-6'>
        <Link
          href={ROUTES.landing}
          className='text-lp-text text-xl font-bold tracking-tight md:text-2xl'
        >
          Sogio
        </Link>

        {/* Os links de seção ficam centrados, e idioma e tema ficam no grupo
            da direita com o mesmo formato de pílula: sem isso "English" lê como
            mais um link de seção em vez de um controle. */}
        <nav
          aria-label='Menu'
          className='mx-auto hidden items-center gap-6 lg:flex'
        >
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className='text-lp-muted hover:text-lp-text text-base transition-colors'
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className='ml-auto flex items-center gap-2 lg:ml-0'>
          <LanguageToggle language={language} onSelect={onSelectLanguage} />

          <button
            type='button'
            onClick={onToggleTheme}
            aria-label={t(
              theme === 'dark' ? 'footer.themeToLight' : 'footer.themeToDark'
            )}
            className={cn(
              'border-lp-border text-lp-muted hover:text-lp-text hover:border-lp-brand',
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-colors'
            )}
          >
            {theme === 'dark' ? (
              <Sun className='size-5' aria-hidden />
            ) : (
              <Moon className='size-5' aria-hidden />
            )}
          </button>

          <LandingCta
            href='#lista'
            size='compact'
            className='ml-1 hidden md:inline-flex'
            onClick={() => trackEvent('cta_click_header')}
          >
            {t('nav.cta')}
          </LandingCta>
        </div>
      </div>
    </header>
  );
};
