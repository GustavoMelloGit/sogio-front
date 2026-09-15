import 'server-only';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import type { Guide, GuideMeta } from '../types/Guide';

/**
 * Registro dos guias.
 *
 * Lido do sistema de arquivos no servidor, durante o build: as páginas de
 * `/guias` são estáticas, então `marked` nunca chega ao cliente — ele recebe
 * só o HTML pronto de uma página cujo conteúdo não muda depois do deploy.
 */

const GUIDES_DIR = join(process.cwd(), 'src/content/guides');

const REQUIRED: (keyof GuideMeta)[] = [
  'slug',
  'title',
  'description',
  'updatedAt',
  'query',
];

/**
 * Frontmatter mínimo: uma chave por linha, valor em texto puro. Não usa YAML
 * de verdade porque o formato é nosso e uma dependência a mais só para ler
 * `chave: valor` não se paga.
 */
const parseFrontmatter = (source: string, file: string) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    throw new Error(`[guides] ${file} não tem bloco de frontmatter.`);
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const separator = line.indexOf(':');
    if (separator === -1) {
      throw new Error(
        `[guides] ${file}: linha de frontmatter inválida "${line}".`
      );
    }
    meta[line.slice(0, separator).trim()] = line
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
  }

  const missing = REQUIRED.filter(key => !meta[key]);
  if (missing.length) {
    throw new Error(
      `[guides] ${file}: faltam as chaves ${missing.join(', ')}.`
    );
  }

  return { meta, body: source.slice(match[0].length) };
};

const loadGuide = (file: string): Guide => {
  const source = readFileSync(join(GUIDES_DIR, file), 'utf8');
  const { meta, body } = parseFrontmatter(source, file);
  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    updatedAt: meta.updatedAt,
    query: meta.query,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body, { async: false, gfm: true }),
  };
};

export const GUIDES: Guide[] = readdirSync(GUIDES_DIR)
  .filter(file => file.endsWith('.md'))
  .map(loadGuide)
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export const findGuide = (slug: string | undefined): Guide | undefined =>
  GUIDES.find(guide => guide.slug === slug);
