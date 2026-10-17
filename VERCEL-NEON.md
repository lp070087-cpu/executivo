# Publicação da PTE — Vercel, Neon e Next.js

Esta versão utiliza Next.js nativo na Vercel, PostgreSQL do Neon e Neon Auth com código por e-mail. O site já publicado no Sites permanece na versão anterior. Os dados da antiga hospedagem não são copiados automaticamente.

## 1. Neon

Crie ou selecione um projeto dedicado à PTE. Na conexão do banco, selecione **pooled connection** e guarde a URL somente nas variáveis privadas do projeto. Execute `neon/001_schema.sql` no SQL Editor do Neon, ou execute `npm run db:migrate` com `DATABASE_URL` definida localmente. A migração cria as tabelas e os índices sem apagar registros existentes. Não execute migrações automaticamente durante cada build.

Ative **Neon Auth** nesse projeto/branch, habilite acesso por código de e-mail e copie o **Auth Base URL**. Cadastre o domínio da aplicação Vercel nas origens permitidas do Neon Auth. Para testes locais, autorize também `http://localhost:5174` e `http://127.0.0.1:5174`.

## 2. Variáveis privadas na Vercel

Em Project → Settings → Environment Variables, configure:

| Variável | Conteúdo |
| --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL pooled do Neon, com SSL. |
| `NEON_AUTH_BASE_URL` | Auth Base URL do Neon Auth, da mesma branch do banco. |
| `NEON_AUTH_COOKIE_SECRET` | Segredo aleatório de pelo menos 32 caracteres. |
| `ADMIN_USER_IDS` | IDs das contas autorizadas a administrar, separados por vírgula. |

Nenhuma dessas variáveis deve usar o prefixo `NEXT_PUBLIC_`. Não publique senhas ou URLs de conexão no GitHub. Gere o segredo localmente com `node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))"` e cole diretamente na Vercel. Não use o mesmo segredo em produção e em ambientes de teste.

Para liberar o administrador: faça o primeiro acesso com o e-mail autorizado, confirme o código, copie o ID dessa conta na lista de usuários do Neon Auth e coloque em `ADMIN_USER_IDS`. A conta precisa ter e-mail verificado. O cadastro de um cliente não concede acesso ao painel.

## 3. Vercel

Importe `lp070087-cpu/executivo`, branch `main`, diretório raiz do repositório. Framework **Next.js**, Node.js **24.x**, instalação **npm ci**, build **npm run build**, saída **.next**. `vercel.json` também declara essas configurações. Remova overrides antigos de Vinext/Vite ou de diretório de saída no painel. Após configurar as variáveis, faça **Redeploy**.

Sem conexão/Auth configurados, a página inicial funciona, mas a entrada nas contas exibe uma mensagem de configuração. O sistema não usa armazenamento temporário como substituto do banco real.

## 4. Validação após conexão

Primeiro teste no computador, depois em tamanho de celular: primeiro acesso por código, nome e contato, pedido pelo site, pedido dentro da conta, recebimento no painel, mudança de status, resposta da equipe, atualização no cliente e cancelamento. Confira que uma segunda conta não vê os pedidos da primeira e não entra no painel. Use pedidos claramente identificados como teste e cancele-os ao terminar.

O banco da demonstração anterior utiliza IDs de autenticação diferentes. Uma eventual importação de dados reais exige associar cada cliente ao ID correspondente do Neon Auth. Não remapeie todos os registros para uma única conta.

## Desenvolvimento

`npm ci` instala a versão do arquivo de lock. `npm run dev` inicia em `http://localhost:5174`. `npm run build` gera a saída Next.js; `npm start` executa a compilação. Variáveis locais devem ficar em `.env.local`, ignorado pelo Git.

Referências: https://neon.com/docs/guides/neon-auth e https://vercel.com/docs/frameworks/full-stack/nextjs.
