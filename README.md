# LucrApp 🚗💰

Painel financeiro para motoristas de aplicativo (Uber, 99, InDriver).

Acesse: [lucrapp-iota.vercel.app](https://lucrapp-iota.vercel.app)

---

## Sobre o projeto

O LucrApp permite que motoristas de app registrem sua receita e gastos diários, acompanhem sua evolução mensal e tomem decisões financeiras com base em dados reais.

---

## Funcionalidades

- Cadastro e login com email e senha
- Dashboard com receita, gastos e lucro do dia
- Registro diário de corridas e despesas
- Edição e exclusão de registros
- Resumo mensal com filtro por mês e ano
- Insights automáticos (melhor dia da semana, melhor dia do mês)
- Tela de perfil com alteração de senha
- Sistema de planos (Gratuito e Plus)
- Proteção de rotas autenticadas

---

## Tecnologias

- [Next.js 16](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- [NextAuth.js](https://next-auth.js.org/)
- Deploy na [Vercel](https://vercel.com/)

---

## Como rodar localmente

```bash
git clone https://github.com/ArthurSanches-ds/lucrapp.git
cd lucrapp
npm install
```

Crie um arquivo `.env` na raiz com as variáveis:

```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Depois rode:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Desenvolvido por

[Arthur Sanches](https://github.com/ArthurSanches-ds) — GS Soluções Digitais
