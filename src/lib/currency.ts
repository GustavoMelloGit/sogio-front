type FormatOptions = {
  isCents: boolean;
  locale: string;
};
const defaultOptions: FormatOptions = {
  isCents: true,
  locale: 'pt-BR',
};

export class Currency {
  static format(amount: number, options: Partial<FormatOptions> = {}): string {
    const { isCents, locale } = { ...defaultOptions, ...options };
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BRL',
    }).format(isCents ? amount / 100 : amount);
  }

  static toCents(amount: number): number {
    return Math.round(amount * 100);
  }

  static fromCents(amount: number): number {
    return amount / 100;
  }
}
