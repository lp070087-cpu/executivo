# Pernambuco Transporte Executivo

Site de apresentação, área do cliente e central administrativa da PTE.

Esta versão foi adaptada para **Next.js + Vercel + Neon PostgreSQL + Neon Auth**.

Consulte [VERCEL-NEON.md](VERCEL-NEON.md) para configurar o banco, autenticação, administrador e publicação. A conexão real com Neon/Auth precisa estar configurada para validar o fluxo completo de agendamentos.

## Executar

Requer Node.js 24.x.

- Instalar: npm ci
- Desenvolver: npm run dev
- Compilar: npm run build
- Executar compilação: npm start
- Criar estrutura no Neon: npm run db:migrate (com DATABASE_URL definida)

Variáveis locais ficam em .env.local e não entram no Git. As tabelas são criadas por neon/001_schema.sql.

O site da apresentação anterior continua no Sites; migrar o código não transfere seus registros ou contas automaticamente. Os arquivos antigos de integração Cloudflare/Drizzle permanecem como referência e não fazem parte da execução Next.js.
