import { GUIDES } from '@/modules/guides/service/guides';
import { ROUTES } from '@/routes/routes';
import { SITE_URL } from '@/seo/site';

export const dynamic = 'force-static';

export function GET() {
  const guias = GUIDES.map(
    guide =>
      `- [${guide.title}](${SITE_URL}${ROUTES.guide(guide.slug)}): ${guide.description}`
  ).join('\n');

  const llms = `# Sogio

> Gestão de imóveis de aluguel por temporada por conversa. O anfitrião manda um áudio, uma foto da nota ou uma pergunta, e Sogio lança a receita, arquiva a despesa e responde quanto cada imóvel deu de lucro, sem planilha e sem aprender um sistema novo.

Para quem: pessoas que cuidam de 1 a 10 imóveis de temporada (Airbnb, Booking ou aluguel direto), incluindo quem não tem familiaridade com software de gestão.

Estado atual: Sogio está em produção e aberto a qualquer pessoa. A conversa acontece no WhatsApp, e o painel web mostra tudo numa tela para quem preferir.

Preço: o plano Grátis cobre 1 imóvel no painel web. O plano Pro custa R$ 25 por mês, inclui Sogio no WhatsApp, até 10 imóveis, exportação de relatórios e importação em lote, e tem 14 dias grátis. A assinatura é mensal e pode ser cancelada pelo painel.

## Páginas

- [Landing page (pt-BR)](${SITE_URL}/): proposta, demonstração da conversa, objeções e perguntas frequentes.
- [Landing page (en)](${SITE_URL}${ROUTES.landingEn}): a mesma página em inglês.
- [Criar conta](${SITE_URL}${ROUTES.signup}): cadastro no Sogio.
- [Entrar no painel](${SITE_URL}${ROUTES.login}): acesso ao produto para quem já é cliente.
- [Guias](${SITE_URL}${ROUTES.guides}): conteúdo aberto sobre gestão de aluguel por temporada.
${guias}

## O que Sogio faz

- Registra receitas e despesas a partir de áudio, foto de comprovante ou mensagem de texto.
- Concilia reservas de Airbnb, Booking e aluguel direto.
- Responde perguntas sobre lucro, ocupação, despesas e valores a receber, com números.
- Confirma o que entendeu antes de gravar qualquer valor.
- Exporta os dados e permite apagar a conta a qualquer momento.
`;

  return new Response(llms, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
