import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/**
 * Keeps <meta name="theme-color"> in sync with the active theme so the mobile
 * browser chrome matches the page background instead of a fixed color. Reads
 * the computed body background so it always tracks the CSS variables.
 */
export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = getComputedStyle(document.body).backgroundColor;
    if (!color) return;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [resolvedTheme]);

  return null;
}
