# Arquitetura — nest-egg

## Visão geral

nest-egg é uma ferramenta de controle financeiro pessoal: o usuário registra
transações (receitas/despesas, únicas ou recorrentes) e acompanha o saldo da
carteira, metas (goals) e coleções de gastos. O produto é composto por um SPA
React que fala diretamente com Firestore/Auth/Storage, e por Cloud Functions
que materializam as ocorrências de transações recorrentes por agendamento
diário e por trigger de escrita no Firestore.

Este repositório é um monorepo com npm workspaces, unificando o que antes
eram dois diretórios físicos sem relação formal nem versionamento (ver
[`docs/decisions/0001-monorepo-por-produto.md`](decisions/0001-monorepo-por-produto.md)).

## Árvore

```
nest-egg/
├── apps/
│   ├── web/                 # SPA React (produto)
│   │   ├── src/
│   │   │   ├── @types/      # tipos de domínio do frontend
│   │   │   ├── components/  # biblioteca de componentes (por assunto, não por página)
│   │   │   ├── hooks/
│   │   │   ├── pages/       # uma página por rota
│   │   │   ├── routes/      # definição de rotas (react-router)
│   │   │   ├── schemas/     # validação (zod) dos formulários
│   │   │   ├── services/    # acesso a dados (Firebase: auth, firestore, storage)
│   │   │   ├── store/       # Redux Toolkit (reducers, thunks, middlewares)
│   │   │   ├── templates/   # mapas/constantes de UI
│   │   │   └── utils/
│   │   └── public/          # assets estáticos servidos pelo Vite (inclui TinyMCE vendorizado)
│   └── functions/           # Cloud Functions (Firebase Functions v2)
│       └── src/
│           ├── recurrence/  # motor de cálculo de próximas ocorrências
│           └── triggers/    # cron diário + trigger de escrita no Firestore
├── packages/
│   └── shared-types/        # literais compartilhados sem risco de divergência
├── firebase.json / firestore.rules / firestore.indexes.json / storage.rules / .firebaserc
└── docs/
```

## Responsabilidade de cada workspace

- **`apps/web`** — todo o produto voltado ao usuário final. Organizado por
  camada técnica (não por feature de domínio) — decisão preservada como
  estava, reorganizar em `src/features` não fez parte deste resgate.
- **`apps/functions`** — lógica de servidor que roda sem interação direta do
  usuário: o motor de recorrência (`recurrence/engine.ts`) calcula a próxima
  data de ocorrência de uma transação recorrente; os triggers
  (`triggers/cron.ts`, `triggers/transactions.ts`) chamam esse motor a partir
  de um agendamento diário e de mudanças no documento da transação,
  respectivamente, e gravam o resultado em `occurrenceLog`.
- **`packages/shared-types`** — ver
  [`docs/decisions/0003-shared-types-scope.md`](decisions/0003-shared-types-scope.md).
  Não é uma camada de domínio completa: existe só para eliminar a duplicação
  de três tipos literais que são idênticos por acidente nenhum (fazem parte
  do mesmo contrato de dados) entre os dois apps.
- **Raiz** — configuração de infraestrutura do Firebase (hosting, Firestore,
  functions) que necessariamente cruza os dois apps, e o `package.json` de
  workspaces.

## Fronteira entre `apps/web` e `apps/functions`

Os dois apps não se importam um ao outro. A única coisa que compartilham é
`packages/shared-types`. Cada um mantém sua própria definição de
`ITransaction`/`IFrequency`/`IRecurrenceDate` porque essas formas divergem de
propósito: `apps/functions` trata datas de recorrência como `string` pura
(usa métodos como `.includes("T")`/`.split("-")`, exclusivos de string);
`apps/web` as trata como `Date | string` e usa um tipo de dia da semana
próprio (`WeekDaysId`) em vez de `number` puro. Unificar essas formas seria
redesenhar contrato de dados, não apenas reorganizar — fora do escopo deste
resgate.

## Estado atual conhecido, não alterado neste resgate

- `apps/functions/package.json` declara `engines.node: "24"` — confirmado
  como runtime real de deploy (as 4 Cloud Functions rodam em `nodejs24` em
  produção).
- Não há suíte de testes em nenhum dos dois apps.
- O saldo da carteira (`IUser.wallet`) é reconciliado automaticamente a cada
  ocorrência de transação (`apps/functions/src/wallet/reconcile-wallet.ts`),
  além de continuar editável manualmente. Em produção, publicado e sem
  transações herdadas para reconciliar — o script de backfill
  (`apps/functions/src/scripts/backfill-wallet-ledger.ts`) continua existindo
  para um cenário futuro com dados históricos reais.
- `firebase.json`'s `hosting.public` aponta para `apps/web/dist`, com um
  `predeploy` que roda `npm run build` antes de cada deploy de hosting —
  corrigido em 2026-09-30 (antes apontava para uma pasta `public/`
  inexistente, herdada do placeholder do `firebase init hosting`).
