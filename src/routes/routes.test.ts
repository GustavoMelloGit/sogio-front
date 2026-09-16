import { describe, expect, it } from 'vitest';
import { config } from '../proxy';
import { GUEST_ONLY_PATHS, ROUTES } from './routes';

describe('proxy matcher', () => {
  it('cobre todas as rotas que só fazem sentido sem sessão', () => {
    for (const path of GUEST_ONLY_PATHS) {
      expect(config.matcher).toContain(path);
    }
  });

  it('cobre o produto autenticado', () => {
    expect(config.matcher).toContain(`${ROUTES.home}/:path*`);
  });
});
