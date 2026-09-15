'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/routes';
import { useLandingTheme } from '@/modules/landing/lib/useLandingTheme';
import { LandingCta } from '@/modules/landing/components/LandingCta';

/**
 * Moldura das páginas de conteúdo.
 *
 * Reaproveita os tokens `--lp-*` e a preferência de tema da landing, mas tem
 * cabeçalho próprio: guias existem só em português, então o seletor de idioma
 * não faz sentido aqui, e o CTA aponta de volta para a lista de espera.
 */
export const GuideShell = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useLandingTheme();

  // Mesmo motivo da landing: o `ThemeColorMeta` global lê o fundo do `body`
  // antes deste efeito e capturaria o fundo do app.
  useEffect(() => {
    const color = theme === 'light' ? '#f9fdfc' : '#030908';
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );

    const previousBackground = document.body.style.backgroundColor;
    const previousMeta = meta?.content;

    document.body.style.backgroundColor = color;
    if (meta) meta.content = color;

    return () => {
      document.body.style.backgroundColor = previousBackground;
      if (meta && previousMeta) meta.content = previousMeta;
    };
  }, [theme]);

  return (
    <div className='landing min-h-screen' data-lp-theme={theme}>
      <header className='fixed inset-x-0 top-0 z-50 px-4 py-3 md:px-6 md:py-4'>
        <div className='lp-glass mx-auto flex w-full max-w-6xl items-center gap-3 rounded-full py-2 pr-2 pl-4 md:pl-6'>
          <Link
            href={ROUTES.landing}
            className='text-lp-text mr-auto text-xl font-bold tracking-tight md:text-2xl'
          >
            Sogio
          </Link>

          <button
            type='button'
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Mudar para o tema claro'
                : 'Mudar para o tema escuro'
            }
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
            href={`${ROUTES.landing}#lista`}
            size='compact'
            className='hidden md:inline-flex'
          >
            Largar a planilha
          </LandingCta>
        </div>
      </header>

      <main id='conteudo'>{children}</main>

      <footer className='border-lp-border border-t px-5 py-10 md:px-8 md:py-12'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <p className='text-lp-muted text-base'>
            Gestão de imóveis de temporada, em uma conversa.
          </p>
          <div className='flex flex-wrap gap-x-6 gap-y-2'>
            <Link
              href={ROUTES.guides}
              className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center text-base transition-colors'
            >
              Todos os guias
            </Link>
            <Link
              href={ROUTES.landing}
              className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center text-base transition-colors'
            >
              Página inicial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
