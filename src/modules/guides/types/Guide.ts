export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  /** Data ISO da última revisão, usada no `Article` e no sitemap. */
  updatedAt: string;
  /** Consulta principal que a página persegue, para conferência futura. */
  query: string;
}

export interface Guide extends GuideMeta {
  html: string;
  /** Minutos estimados de leitura, a 200 palavras por minuto. */
  readingMinutes: number;
}
