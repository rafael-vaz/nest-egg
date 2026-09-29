# 0001 — Monorepo por produto

**Status:** Aceita
**Data:** 2026-09-28

## Contexto

O nest-egg existia em dois diretórios físicos sem relação formal: o SPA
React (`Projetos/nest-egg`) e as Cloud Functions do mesmo produto
(`Projetos/firebase-projects/nest-egg/functions`). Nenhum dos dois tinha
versionamento. Os dois compartilham o mesmo banco Firestore, o mesmo projeto
Firebase (`nest-egg-ef466`) e, em parte, o mesmo contrato de dados
(`ITransaction`). O usuário também mantém (ou pretende manter) outros
produtos com suas próprias Cloud Functions, e perguntou se um único
repositório deveria reunir as functions de todos eles.

## Decisão

Unificar frontend e functions do nest-egg em **um monorepo por produto**:
`apps/web` + `apps/functions` + `packages/shared-types`, usando npm
workspaces. Cada produto que o usuário mantém, se e quando ganhar
versionamento, segue o mesmo padrão de forma independente — não existe (nem
foi criado) um repositório compartilhado entre produtos diferentes.

## Motivo

Frontend e functions do nest-egg são 100% acoplados: mesmo tipo de dado,
mesmo Firestore, mesmo deploy Firebase. Não há nada, hoje, genuinamente
compartilhado entre as functions do nest-egg e as de qualquer outro produto
do usuário — cada Cloud Function existente só conhece a coleção e o schema
do seu próprio produto. Um repositório único entre produtos misturaria
código sem relação nenhuma, só porque ambos "rodam no Firebase".

## Alternativas descartadas

- **Repositório único para todos os produtos Firebase do usuário** —
  descartada: não há código genuinamente compartilhado entre produtos
  diferentes hoje; se isso mudar no futuro (ex.: uma lib comum de e-mail ou
  autenticação reutilizada por vários produtos), a solução correta é um
  pacote publicado ou um repositório à parte só para essa lib compartilhada,
  não fundir produtos inteiros.
- **Manter os dois diretórios separados, cada um com seu próprio
  versionamento** — descartada pelo usuário: perpetuaria a duplicação do
  tipo de transação e a falta de garantia de que os dois lados evoluem
  juntos.

## Consequências

- `firebase.json`, `firestore.rules`, `.firebaserc` e `firestore.indexes.json`
  passam a viver na raiz do monorepo, fora de qualquer app específico, já que
  cruzam `apps/web` (hosting) e `apps/functions` (functions/firestore).
- Dependências são geridas por um único lockfile na raiz (npm workspaces),
  sem adicionar ferramenta nova (Turborepo, Nx, pnpm) — ver também a decisão
  de estratégia de commit em
  [`0002-historico-git-por-camada.md`](0002-historico-git-por-camada.md).
