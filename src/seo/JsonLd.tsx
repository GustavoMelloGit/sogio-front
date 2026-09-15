interface JsonLdProps {
  /** Blocos JSON-LD, serializados juntos em um único `<script>`. */
  data: unknown[];
}

/**
 * Dados estruturados da página, renderizados no HTML do servidor.
 *
 * `<` vira escape unicode para que nenhum valor possa fechar o `<script>`.
 */
export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);
