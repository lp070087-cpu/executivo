# Pernambuco Transporte Executivo

Apresentação navegável da PTE, com site institucional, área do cliente e central administrativa. Identidade em preto, branco e grafite, veículos ilustrativos, cartões animados e interface responsiva. Não exibe preços.

## Fluxo de atendimento

O cliente acessa a conta pelo serviço nativo de autenticação, informa seus dados e solicita trajetos pelo site ou diretamente pela sua área. Cada pedido recebe um protocolo, histórico e conversa com a equipe. O painel reúne solicitações, filtros, agenda, notas internas e respostas ao cliente. Uma solicitação depende da confirmação da equipe para virar reserva.

## Desenvolvimento

Requer Node.js 22.13 ou superior. Instale as dependências com `npm run install:ci`, inicie com `npm run dev` e gere a versão de produção com `npm run build`. O projeto usa Vinext, Cloudflare Workers, D1 e migrações Drizzle em `drizzle/`. A identidade local de teste é fornecida somente pelo ambiente de desenvolvimento; produção utiliza os cabeçalhos de autenticação do Sites.

`app/` contém as rotas, `lib/` o conteúdo e regras do atendimento e `public/` estilos, interações e imagens. Dados locais, credenciais, dependências e resultados de compilação são ignorados pelo Git. `QA.md` registra o escopo dos testes desta rodada.

## Imagem SW4

A imagem fornecida pelo usuário foi recortada com a ferramenta integrada de edição de imagens e exportada para `public/assets/sw4-fast.webp`. Instrução: remover fundo e sombra, preservar o veículo preto, ângulo e proporções, refinar bordas sem halo e entregar transparência real. A imagem é ilustrativa; modelo, configuração e disponibilidade dependem da equipe PTE.
