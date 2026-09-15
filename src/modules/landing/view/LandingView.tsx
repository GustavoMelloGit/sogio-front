'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import i18n from '@/i18n';
import { I18nPageProvider } from '@/i18n/I18nPageProvider';
import type { Language } from '@/i18n/language';
import { ROUTES } from '@/routes/routes';
import { setupClarity } from '@/lib/clarity';
import { LandingRoute } from '@/components/LandingRoute';
import { useLandingTheme } from '../lib/useLandingTheme';
import { LandingHeader } from '../components/LandingHeader';
import { HeroSection } from '../components/HeroSection';
import { DemoSection } from '../components/DemoSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { AnswersSection } from '../components/AnswersSection';
import { FounderSection } from '../components/FounderSection';
import { FaqSection } from '../components/FaqSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { LandingFooter } from '../components/LandingFooter';

interface LandingViewProps {
  /** Idioma que a URL representa: `/` é pt-BR e `/en` é inglês. */
  pageLanguage: Language;
}

const LandingView = ({ pageLanguage }: LandingViewProps) => {
  const { theme, toggleTheme } = useLandingTheme();
  const router = useRouter();

  // A URL manda no idioma, sem exceção: é o que o `hreflang` e o `canonical`
  // prometem, e é a única regra que vale igual para gente e para rastreador.
  // O conteúdo da página já sai no idioma dela por `I18nPageProvider`; aqui a
  // preferência global acompanha, para que login e app abram no mesmo idioma.
  //
  // Havia aqui um redirecionamento de `/` para `/en` quando o navegador estava
  // em inglês. O Googlebot renderiza com locale en-US, então ele caía nesse
  // desvio e indexava a home com o conteúdo inglês: era o que aparecia na
  // busca para quem pesquisava em português. Detectar idioma para redirecionar
  // é justamente o que a documentação do Google desaconselha. Quem chega com o
  // navegador em outro idioma troca pelo seletor do cabeçalho.
  useEffect(() => {
    if (i18n.language !== pageLanguage) void i18n.changeLanguage(pageLanguage);
  }, [pageLanguage]);

  useEffect(() => {
    setupClarity();
  }, []);

  // O `<body>` usa os tokens do app; sem isto o fundo dele aparece no overscroll
  // e nas bordas em telas altas.
  //
  // A `theme-color` também é escrita aqui, e não deixada para o
  // `ThemeColorMeta` global: aquele lê o fundo do `body` e roda antes deste
  // efeito, então capturava o fundo do app em vez do da landing.
  //
  // Os valores são hexadecimais, e não os tokens `--lp-bg`, porque
  // `theme-color` em `oklch()` não é lido de forma confiável por todos os
  // navegadores. São o mesmo tom, resolvido para sRGB.
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

  const selectLanguage = useCallback(
    (next: Language) => {
      if (next === pageLanguage) return;
      void i18n.changeLanguage(next);
      router.push(next === 'en' ? ROUTES.landingEn : ROUTES.landing);
    },
    [pageLanguage, router]
  );

  return (
    <I18nPageProvider language={pageLanguage}>
      <div className='landing min-h-screen' data-lp-theme={theme}>
        <LandingRoute />
        <LandingHeader
          theme={theme}
          onToggleTheme={toggleTheme}
          language={pageLanguage}
          onSelectLanguage={selectLanguage}
        />

        <main id='conteudo'>
          <HeroSection />
          <DemoSection />
          <HowItWorksSection />
          <AnswersSection />
          <FounderSection />
          <FaqSection />
          <FinalCtaSection />
        </main>

        <LandingFooter
          language={pageLanguage}
          onSelectLanguage={selectLanguage}
        />
      </div>
    </I18nPageProvider>
  );
};

export default LandingView;
