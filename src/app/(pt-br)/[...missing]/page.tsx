import { notFound } from 'next/navigation';

/**
 * Com um layout raiz por idioma não existe `not-found` global: sem esta rota,
 * um endereço desconhecido cairia na página 404 padrão do Next, fora do app.
 */
export default function MissingPage() {
  notFound();
}
