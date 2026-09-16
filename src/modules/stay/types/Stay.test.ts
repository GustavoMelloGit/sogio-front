import { describe, expect, it } from 'vitest';
import { isDirectSource, staySchema } from './Stay';

const stay = {
  id: 'stay-1',
  check_in: '2026-09-01T14:00:00.000Z',
  check_out: '2026-09-05T11:00:00.000Z',
  entrance_code: '1234567',
  guests: 2,
  price: 120_000,
  created_at: '2026-09-01T14:00:00.000Z',
  updated_at: '2026-09-01T14:00:00.000Z',
};

describe('staySchema', () => {
  it('aceita qualquer rótulo de origem, porque a API guarda texto livre', () => {
    for (const source of ['INTERNAL', 'DIRECT', 'AIRBNB', 'TEMPORADA_LIVRE']) {
      expect(staySchema.parse({ ...stay, source }).source).toBe(source);
    }
  });
});

describe('isDirectSource', () => {
  it('reconhece os rótulos que a API usa para reserva sem plataforma', () => {
    expect(isDirectSource('INTERNAL')).toBe(true);
    expect(isDirectSource('direct')).toBe(true);
  });

  it('trata plataforma como origem externa', () => {
    expect(isDirectSource('AIRBNB')).toBe(false);
    expect(isDirectSource('TEMPORADA_LIVRE')).toBe(false);
  });
});
