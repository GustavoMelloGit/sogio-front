import { describe, expect, it } from 'vitest';
import { median } from './median';

describe('median', () => {
  it('é zero quando não há valores', () => {
    expect(median([])).toBe(0);
  });

  it('é o valor do meio quando a quantidade é ímpar', () => {
    expect(median([30000, 10000, 20000])).toBe(20000);
  });

  it('é a média dos dois do meio quando a quantidade é par', () => {
    expect(median([40000, 10000, 20000, 30000])).toBe(25000);
  });

  it('arredonda para o centavo inteiro', () => {
    expect(median([10000, 10001])).toBe(10001);
  });
});
