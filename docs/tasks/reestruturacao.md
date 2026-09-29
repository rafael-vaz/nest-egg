# Reestruturação — nest-egg (unificação em monorepo + versionamento inicial)

**Status:** Concluído
**Última atualização:** 2026-09-28
**Branch:** `main` (repositório novo)

> Escopo combinado com o usuário nesta sessão: unificar os dois repositórios
> físicos em um monorepo por produto (`apps/web` + `apps/functions` +
> `packages/shared-types`) e criar o versionamento Git do zero, com histórico
> incremental agrupado por camada arquitetural. A feature de
> incrementar/decrementar a carteira a cada transação fica fora deste plano —
> será planejada separadamente depois que o repositório estiver pronto.

## 1. Diagnóstico

### O que o projeto faz

Ferramenta de controle financeiro pessoal: o usuário registra transações
(receitas/despesas, com ou sem recorrência) ao longo do mês e acompanha o
valor da sua carteira, metas (goals) e coleções de gastos. O frontend é um
SPA React que fala diretamente com Firestore/Auth/Storage; um projeto Firebase
separado roda Cloud Functions que materializam as ocorrências de transações
recorrentes (`occurrenceLog`) por agendamento diário e por trigger de escrita.

### Stack e execução

- **Frontend:** React 19 + TypeScript + Vite 6, Redux Toolkit, React Hook Form
  + Zod, Firebase JS SDK 11, React Router 7. Gerenciador: npm (há
  `package-lock.json`). Node local: v22.x.
- **Backend (Cloud Functions):** Firebase Functions v2 + `firebase-admin` 13,
  TypeScript, compilado com `tsc` para `lib/`. `engines.node` declarado como
  `"24"` no `package.json` das functions (não confirmado se é o runtime alvo
  real de deploy — ver dúvida abaixo).
- **Comandos reais (frontend, `nest-egg/`):** `npm run dev`, `npm run build`
  (`tsc -b && vite build`), `npm run lint`, `npm run preview`.
- **Comandos reais (functions, `firebase-projects/nest-egg/functions/`):**
  `npm run build` (`tsc`), `npm run lint`, `npm run serve` (emulador),
  `npm run deploy`.
- Nenhum dos dois projetos tem script de teste.

### Estrutura atual (dois diretórios físicos separados, nenhum é repositório Git)

```
nest-egg/                          (não é repo git)
├── .env                           (config real do Firebase, NÃO ignorado)
├── .env.example
├── eslint.config.js
├── index.html
├── package.json / package-lock.json
├── public/
│   ├── img/
│   └── libs/tinymce/               (~11MB, TinyMCE vendorizado)
├── src/                            (components, services, store, hooks,
│                                    pages, schemas, utils, templates, routes)
├── tsconfig.json / .app.json / .node.json
└── vite.config.ts

firebase-projects/nest-egg/        (não é repo git)
├── .firebaserc                    (projeto Firebase: nest-egg-ef466)
├── firebase.json                  (hosting aponta para public/, que é só o
│                                    HTML padrão do `firebase init` — nunca
│                                    foi ligado ao build real do Vite)
├── firestore.rules / firestore.indexes.json
├── public/index.html              (placeholder padrão, não utilizado)
├── tsconfig.json                  (referência de projeto para functions/)
└── functions/
    ├── src/
    │   ├── index.ts
    │   ├── recurrence/{engine,types}.ts
    │   └── triggers/{cron,transactions}.ts
    ├── package.json / package-lock.json
    ├── tsconfig.json / tsconfig.dev.json
    └── .eslintrc.js
```

### Principais problemas

1. **Sem versionamento em nenhum dos dois projetos** — todo o histórico de
   como o app foi construído se perde a partir de agora se não for criado.
2. **Código do mesmo produto partido em duas pastas sem relação formal** —
   duplica o tipo `ITransaction`/`IFrequency` (o de `functions` é um
   subconjunto do de `src/@types/transaction`), sem nada que garanta que os
   dois fiquem em sincronia.
3. **`.env` real não está no `.gitignore`** do frontend — seria commitado tal
   como está na primeira versão do repositório.
4. **`npm run lint` do frontend "falha" com 426 problemas**, mas 100% vêm de
   um único arquivo: `public/libs/tinymce/tinymce.d.ts` (biblioteca
   vendorizada, não código do app) que não está no `ignores` do
   `eslint.config.js`. O código do app em si lint limpo.
5. **Hosting do Firebase nunca foi de fato ligado ao app** — `firebase.json`
   aponta `hosting.public` para uma pasta `public/` com o HTML placeholder
   padrão do `firebase init hosting`, não para o build do Vite (`dist/`).
   Isso é pré-existente e não será alterado neste plano (ver não escopo).

### Linha de base

| Verificação                  | Comando (frontend)                             | Resultado hoje                                                             |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Typecheck + build             | `npm run build`                                 | Passa (`tsc -b && vite build`), com aviso de chunk >500kB (pré-existente)   |
| Lint                          | `npm run lint`                                  | 426 problemas, 100% em `public/libs/tinymce/tinymce.d.ts` (vendorizado)     |
| Testes                        | —                                                | Não existe script/arquivo de teste                                          |

| Verificação                  | Comando (functions)                             | Resultado hoje                                                             |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Build                         | `npm run build` (dentro de `functions/`)        | Passa, sem erros                                                             |
| Lint                          | `npm run lint` (dentro de `functions/`)         | Passa, sem erros                                                             |
| Testes                        | —                                                | Não existe script/arquivo de teste (há `firebase-functions-test` instalado mas não usado) |

### Dúvidas — resolvidas com o usuário

- `engines.node: "24"` das functions não bate com o Node local (v22.x).
  **Decisão:** deixar como está; carregado tal como está no `package.json`,
  sem investigar o runtime real de deploy agora (fora do escopo deste plano).
- `firebase-projects/nest-egg/public/index.html` (placeholder padrão do
  `firebase init hosting`, nunca ligado ao build real do Vite). **Decisão:**
  descartado — não entra no monorepo.

## 2. Mapa de projetos para workspaces

(Adaptação da "mapa de capacidades para features" do padrão — aqui a unidade
de reorganização é *workspace do monorepo*, não *feature de produto*, porque
o pedido foi unificar dois repositórios físicos, não redesenhar a
organização interna do código de cada um.)

| Unidade atual                              | Workspace de destino     | Interface pública                              |
| ------------------------------------------- | ------------------------- | ------------------------------------------------ |
| `nest-egg/` (app React completo)            | `apps/web`                | Ponto de entrada Vite (`index.html`, `src/main.tsx`) |
| `firebase-projects/nest-egg/functions/`     | `apps/functions`          | `lib/index.js` (exports das Cloud Functions)     |
| Tipos duplicados (`ITransaction` etc.)      | `packages/shared-types`   | `index.ts` exportando **apenas** `TransactionType`, `FrequencyCategory` e `FrequencyOrder` — os três literais idênticos nos dois lados. `IFrequency`/`IRecurrenceDate`/`ITransaction`/`ITransactionOccurrenceLog` continuam definidos em cada app (divergem de propósito entre eles); ver [`docs/decisions/0003-shared-types-scope.md`](../decisions/0003-shared-types-scope.md) |
| Config de infraestrutura Firebase (`firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc`) | raiz do monorepo | — (config, não código) |

## 3. Destino dos arquivos

| Origem                                                              | Destino                                               | Motivo                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| `nest-egg/src/`                                                     | `apps/web/src/`                                        | Código do app, sem mudança de conteúdo                    |
| `nest-egg/public/`                                                  | `apps/web/public/`                                     | Assets estáticos do Vite                                  |
| `nest-egg/index.html`                                               | `apps/web/index.html`                                  | Entry point do Vite                                        |
| `nest-egg/vite.config.ts`                                           | `apps/web/vite.config.ts`                              | Config do bundler do workspace                             |
| `nest-egg/tsconfig.json` / `.app.json` / `.node.json`               | `apps/web/tsconfig*.json`                              | Config TS do workspace                                     |
| `nest-egg/eslint.config.js`                                         | `apps/web/eslint.config.js`, com `ignores` incluindo `public/libs` | Corrige o achado #4 (lint limpo de verdade) |
| `nest-egg/package.json`                                             | `apps/web/package.json`, `name` → `@nest-egg/web`      | Vira workspace nomeado                                     |
| `nest-egg/package-lock.json`                                        | removido                                               | Substituído pelo lockfile único da raiz do monorepo        |
| `nest-egg/.env`                                                     | `apps/web/.env`                                        | Mesma posição relativa ao `vite.config.ts` (Vite lê `.env` do seu próprio root) — **fica de fora do commit**, ver seção 4 |
| `nest-egg/.env.example`                                             | `apps/web/.env.example`                                | Documentação das variáveis                                 |
| `nest-egg/.vscode/settings.json`                                    | `.vscode/settings.json` (raiz)                         | Config de editor vale para o repo inteiro                  |
| `nest-egg/.claude/`                                                 | `.claude/` (raiz)                                      | Config do Claude Code vale para o repo inteiro              |
| `nest-egg/.github/`                                                 | `.github/` (raiz)                                      | Vazia hoje; mantida como ponto único de CI futuro           |
| `nest-egg/dist/`, `nest-egg/node_modules/`                          | não versionado                                         | Artefato de build / dependências, permanece no `.gitignore` |
| `firebase-projects/nest-egg/functions/src/`                        | `apps/functions/src/`                                  | Código das Cloud Functions, sem mudança de conteúdo        |
| `firebase-projects/nest-egg/functions/package.json`                | `apps/functions/package.json`, `name` → `@nest-egg/functions` | Vira workspace nomeado                             |
| `firebase-projects/nest-egg/functions/package-lock.json`            | removido                                               | Substituído pelo lockfile único da raiz                     |
| `firebase-projects/nest-egg/functions/tsconfig.json` / `.dev.json`  | `apps/functions/tsconfig*.json`                        | Config TS do workspace                                      |
| `firebase-projects/nest-egg/functions/.eslintrc.js`                 | `apps/functions/.eslintrc.js`                          | Config de lint do workspace                                 |
| `firebase-projects/nest-egg/functions/.gitignore`                   | mesclado no `.gitignore` da raiz                       | Um único `.gitignore` cobrindo `lib/`, `node_modules/`, etc. |
| `firebase-projects/nest-egg/functions/lib/`, `node_modules/`        | não versionado                                         | Artefato de build / dependências                            |
| `firebase-projects/nest-egg/functions/.github/`                     | descartada (vazia)                                     | Sem arquivos, nada a preservar                               |
| `firebase-projects/nest-egg/.firebaserc`                            | `.firebaserc` (raiz)                                   | Aponta o deploy para o projeto Firebase existente            |
| `firebase-projects/nest-egg/firebase.json`                          | `firebase.json` (raiz), `functions.source` → `apps/functions`, `hosting.public` mantido **como está hoje** (`public`, o placeholder — ver dúvida da seção 1) | Caminhos ajustados à nova posição relativa; comportamento de hosting não é redesenhado agora |
| `firebase-projects/nest-egg/firestore.rules`                        | `firestore.rules` (raiz)                               | Config de infraestrutura                                     |
| `firebase-projects/nest-egg/firestore.indexes.json`                 | `firestore.indexes.json` (raiz)                        | Config de infraestrutura                                     |
| `firebase-projects/nest-egg/tsconfig.json`                          | `tsconfig.json` (raiz), referência ajustada para `./apps/functions` | Mantém o project-reference que já existia            |
| `firebase-projects/nest-egg/public/index.html`                      | descartado                                             | Placeholder do `firebase init`, nunca referenciado; decisão confirmada com o usuário |
| `firebase-projects/nest-egg/.firebase/`                             | não versionado                                         | Cache local do CLI do Firebase                                |
| `firebase-projects/nest-egg/.github/appmod/`                        | descartada (vazia)                                     | Sem arquivos, nada a preservar                                |
| — (novo)                                                             | `package.json` (raiz), `"workspaces": ["apps/*", "packages/*"]` | Habilita npm workspaces, sem adicionar dependência nova |
| — (novo)                                                             | `packages/shared-types/`                               | Unifica `ITransaction`/`IFrequency`/`IRecurrenceDate` hoje duplicados |
| — (novo)                                                             | `.gitignore` (raiz), incluindo `.env`, `node_modules/`, `dist/`, `lib/`, `.firebase/` | Corrige o achado #3 antes do primeiro commit |
| — (novo)                                                             | `README.md` (raiz)                                     | Visão geral do monorepo e como rodar cada workspace          |
| — (novo)                                                             | `docs/architecture.md`, `docs/decisions/0001-monorepo-por-produto.md`, `docs/decisions/0002-historico-git-por-camada.md` | Registra as decisões tomadas nesta sessão |

Nenhum arquivo dos dois diretórios de origem fica fora desta tabela.

## 4. Fronteiras a isolar

| Fronteira                                   | Onde está hoje                                        | Destino                                                         |
| --------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Config do Firebase client (chaves públicas)   | `nest-egg/.env` (fora do `.gitignore`)                   | `apps/web/.env`, agora coberto pelo `.gitignore` da raiz; só `.env.example` é versionado |
| Tipos de transação/recorrência                | Duplicados em `src/@types/transaction` e `functions/src/recurrence/types.ts` | `packages/shared-types`, importado pelos dois workspaces |
| Config de deploy (`firebase.json`, `.firebaserc`) | Repositório separado (`firebase-projects/nest-egg`)   | Raiz do monorepo, caminhos relativos atualizados                    |

## 5. Incrementos

Ordem por camada arquitetural (aprovada). Cada incremento é um commit
próprio. Como este é um **primeiro import** (não um refactor de um repo já
versionado), não há histórico anterior para preservar com `git mv` — a
reorganização física das pastas acontece uma vez, antes do `git init`, e cada
incremento a seguir é um `git add` seletivo de um subconjunto de arquivos já
no lugar certo, seguido de commit. Só o **estado final** (incremento 12)
precisa passar em todas as verificações; commits intermediários representam
camadas parciais do app (ex.: só tipos e utils, sem componentes) e não são
buildáveis isoladamente — isso é esperado e não é regressão.

| #   | Incremento                                                        | Entrega observável                                      | Como verificar                                  | Reversão                     |
| --- | -------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------- | --------------------------------- |
| 1   | Scaffold do monorepo: `package.json` raiz (workspaces), `.gitignore` corrigido (inclui `.env`), `README.md` inicial, `git init` | Repositório Git existe, `.env` não aparece em `git status` como rastreável | `git status` não lista `.env`; `git log` tem 1 commit | `rm -rf .git`             |
| 2   | `packages/shared-types` (tipos de transação/recorrência unificados)  | Pacote compila isoladamente (`tsc --noEmit`)              | `npm run build -w packages/shared-types`           | `git revert`                      |
| 3   | `apps/web`: config e tooling (package.json, tsconfig*, vite.config.ts, eslint.config.js com `public/libs` ignorado, index.html) | Workspace instalável                                     | `npm install` não falha                             | `git revert`                      |
| 4   | `apps/web/src`: tipos, schemas e utils                                | Camada de domínio sem UI                                   | `npx tsc --noEmit -p apps/web` (parcial, sem esperar build completo) | `git revert`      |
| 5   | `apps/web/src`: store (Redux: reducers, thunks, middlewares)         | Estado global completo                                     | Revisão de diff                                      | `git revert`                      |
| 6   | `apps/web/src`: services (Firebase: auth, transaction, goal, collection, user, file)  | Camada de acesso a dados completa                          | Revisão de diff                                      | `git revert`                      |
| 7   | `apps/web/src`: hooks                                                 | Hooks completos                                             | Revisão de diff                                      | `git revert`                      |
| 8   | `apps/web/src`: components                                           | Biblioteca de componentes completa                          | Revisão de diff                                      | `git revert`                      |
| 9   | `apps/web/src`: pages, routes, motion, templates, styles, app.tsx, main.tsx | App React completo e buildável                         | `npm run build -w apps/web` e `npm run lint -w apps/web` (lint limpo após ignore do tinymce) | `git revert` |
| 10  | `apps/web/public`                                                    | Assets estáticos (inclui TinyMCE vendorizado)               | `npm run build -w apps/web` gera `dist/` com os assets | `git revert`                   |
| 11  | `apps/functions`: config, tipos e `recurrence/engine.ts`              | Motor de recorrência isolado e buildável                     | `npm run build -w apps/functions`                    | `git revert`                      |
| 12  | `apps/functions`: triggers (`cron.ts`, `transactions.ts`, `index.ts`) | Cloud Functions completas                                    | `npm run build -w apps/functions` e `npm run lint -w apps/functions` | `git revert`      |
| 13  | Infra Firebase na raiz (`firebase.json`, `firestore.rules`, `firestore.indexes.json`, `.firebaserc`, tsconfig de referência) | Deploy configurável a partir da raiz                    | `firebase deploy --only functions --dry-run` (se disponível) ou revisão manual dos caminhos | `git revert` |
| 14  | Documentação (`docs/architecture.md`, ADRs 0001 e 0002, `docs/tasks/reestruturacao.md` marcado como concluído) | Decisões e arquitetura registradas                        | Revisão de leitura                                   | `git revert`                      |

- [x] 1. Scaffold do monorepo + `.gitignore` corrigido + `git init`
- [x] 2. `packages/shared-types`
- [x] 3. `apps/web` — config e tooling
- [x] 4. `apps/web/src` — tipos, schemas, utils
- [x] 5. `apps/web/src` — store
- [x] 6. `apps/web/src` — services
- [x] 7. `apps/web/src` — hooks
- [x] 8. `apps/web/src` — components
- [x] 9. `apps/web/src` — pages, routes, motion, templates, styles, entry points
- [x] 10. `apps/web/public`
- [x] 11. `apps/functions` — config, tipos, engine de recorrência
- [x] 12. `apps/functions` — triggers
- [x] 13. Infra Firebase na raiz
- [x] 14. Documentação

## 6. Documentação a produzir

- [x] `README.md` — visão geral do monorepo, como rodar `apps/web` e
      `apps/functions`, tabela de comandos por workspace.
- [x] `docs/architecture.md` — árvore final, responsabilidade de cada
      workspace, fronteira `shared-types`.
- [x] `docs/decisions/0001-monorepo-por-produto.md` — por que unificar em um
      monorepo por produto (não um repo único entre produtos diferentes).
- [x] `docs/decisions/0002-historico-git-por-camada.md` — por que o histórico
      inicial foi reconstruído por camada arquitetural, e que ele não reflete
      a ordem cronológica real de criação do código.
- [x] `docs/decisions/0003-shared-types-scope.md` — por que `packages/shared-types`
      ficou restrito aos três literais idênticos, em vez dos tipos completos.
- Fora do escopo por agora (não pedido nesta sessão): `docs/prd.md`,
  `docs/testing.md`, `docs/integrations.md` completos — podem ser propostos
  como próxima tarefa, junto com a suíte de testes (ver seção 9).

## 7. Rede de segurança

| Comportamento crítico                          | Coberto hoje | Teste de caracterização necessário |
| ------------------------------------------------- | -------------- | -------------------------------------- |
| Build do frontend (`npm run build`)                | Sim (comando existente) | Não — é o próprio comando de build usado como verificação |
| Build/lint das functions                           | Sim (comando existente) | Não — mesmo raciocínio |
| Lógica de recorrência (`getNextOccurrence` etc.)   | Não (sem testes) | Não necessário para este plano — o código não muda de conteúdo, só de local; criar testes de caracterização fica proposto para quando a feature da carteira for planejada (vai mexer exatamente nesses triggers) |

## 8. Riscos

| Risco                                                          | Impacto                                      | Mitigação                                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| Caminhos relativos quebrarem ao mover `functions/` para `apps/functions/` (imports, `tsconfig`, `firebase.json`) | Build ou deploy falha | Rodar `npm run build -w apps/functions` a cada incremento que toca essa pasta antes de commitar |
| `.env` vazar para o histórico Git por engano                     | Exposição de config do Firebase (não é segredo de servidor, mas é boa prática) | `.gitignore` corrigido no incremento 1, antes de qualquer outro `git add`; conferir `git status` antes de cada commit |
| Workspace npm resolver dependências de forma diferente do que hoje (duas instalações independentes) | `npm install` na raiz pode alterar versões resolvidas nas lockfiles | Rodar `npm run build` e `npm run lint` em cada workspace após o `npm install` único da raiz, comparar com a linha de base da seção 1 |
| `firebase.json`/`.firebaserc` apontando para caminhos antigos após a mudança de posição | `firebase deploy` falharia (não será executado nesta sessão) | Só ajustar os campos de caminho (`functions.source`), sem mudar o que já funciona/não funciona hoje (hosting fica como está, ver dúvida) |

## 9. Não escopo

- **Feature de incrementar/decrementar a carteira a cada transação** —
  decisão do usuário: planejar separadamente depois deste plano, por
  envolver escrita atômica no Firestore, condição de corrida entre o cron e
  o trigger de update, e decisão sobre o que fazer com transações já
  existentes que nunca afetaram a carteira. Encaminhamento: nova sessão de
  planejamento (`plan-feature`/`feature-dev`) depois que este repositório
  existir.
- **Reorganização interna do código em `src/features` por domínio de
  negócio** — não foi pedida nesta sessão; a estrutura atual por camada
  técnica (`components`, `services`, `store`, `hooks`, `pages`) é preservada
  como está.
- **Correção dos 426 problemas de lint do arquivo vendorizado** além de
  excluí-lo do escopo do ESLint — o arquivo é gerado pelo pacote `tinymce`,
  não é código do time.
- **Ligar o Firebase Hosting ao build real do Vite** — pré-existente, fora
  do pedido original, requer decisão do usuário sobre onde o frontend é
  hospedado hoje.
- **Criação de suíte de testes** — não pedida nesta sessão; fica proposta
  como próximo passo natural, especialmente antes de mexer nos triggers para
  a feature da carteira.
- **Atualização de dependências, upgrade de Node/engines, correção de bugs
  de negócio** — nada disso é tocado.

## 10. Critérios de aceite

- **CA-01:** `npm run build -w apps/web` e `npm run lint -w apps/web`
  terminam com o mesmo resultado da linha de base (build verde; lint limpo
  após excluir o vendorizado — hoje era "sujo" só por causa dele).
- **CA-02:** `npm run build -w apps/functions` e `npm run lint -w apps/functions`
  terminam verdes, como na linha de base.
- **CA-03:** Todo arquivo dos dois diretórios de origem está na tabela da
  seção 3, com destino ou remoção justificada.
- **CA-04:** `.env` nunca aparece em `git log -p` — só `.env.example`.
- **CA-05:** `git log --oneline` mostra os 14 commits na ordem da seção 5,
  cada um com um `git status` limpo antes do próximo.
- **CA-06:** `packages/shared-types` é importado por `apps/web` e por
  `apps/functions` para os três literais sem risco de divergência
  (`TransactionType`, `FrequencyCategory`, `FrequencyOrder`); nenhum dos dois
  redeclara esses três literais localmente. `IFrequency`/`IRecurrenceDate`/
  `ITransaction` continuam legitimamente próprios de cada app — ver
  [`docs/decisions/0003-shared-types-scope.md`](../decisions/0003-shared-types-scope.md).

## 11a. Convenção de commit

Todos os commits deste plano (e dos seguintes, neste repositório) seguem
[Conventional Commits](https://www.conventionalcommits.org/) e são escritos
em inglês. Padrão usado nos 14 incrementos:

- `chore(repo): scaffold monorepo workspaces and fix .gitignore`
- `feat(shared-types): add unified transaction and recurrence types`
- `chore(web): add vite, typescript and eslint tooling`
- `feat(web): add domain types, schemas and utils`
- `feat(web): add redux store`
- `feat(web): add firebase services layer`
- `feat(web): add hooks`
- `feat(web): add component library`
- `feat(web): add pages, routes and entry points`
- `chore(web): add static assets`
- `feat(functions): add recurrence engine`
- `feat(functions): add scheduled and firestore triggers`
- `chore(infra): add firebase hosting, firestore and functions config`
- `docs: add architecture overview and restructuring decision records`

## 11. Decisões e motivos

| Decisão                          | Escolha                                                     | Motivo                                                                                          | Alternativa descartada                                      |
| ------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Unificação dos repositórios          | Monorepo por produto (`apps/web` + `apps/functions` + `packages/shared-types`), com npm workspaces | Frontend e functions do nest-egg são 100% acoplados (mesmo tipo de dado, mesmo Firestore, mesmo deploy); um repo por produto evita repo único misturando produtos sem relação | Repo único compartilhado entre todos os produtos Firebase do usuário (descartado — não há código genuinamente compartilhado entre produtos diferentes hoje) |
| Gerenciador de workspace             | npm workspaces (nativo do npm, já em uso nos dois projetos)       | Não adiciona dependência nova (regra do resgate); ambos os projetos já usam npm com lockfile        | pnpm/yarn workspaces ou Turborepo/Nx (descartados — dependência nova sem necessidade comprovada) |
| Estratégia de histórico Git inicial  | Commits incrementais por camada arquitetural (setup → tipos → store → services → hooks → components → pages → functions → infra → docs) | Reflete como o app é construído de baixo para cima; fica útil como referência de leitura mesmo sabendo que não é a ordem cronológica real | Por domínio de produto (descartada — o usuário preferiu a leitura técnica); poucos commits de marco (descartada — menos útil como referência) |
| Feature de saldo da carteira         | Fora deste plano, planejada depois                               | Envolve decisões de concorrência/atomicidade no Firestore que merecem planejamento próprio, sem misturar com a reorganização estrutural | Implementar já nesta sessão (descartada pelo usuário) |
