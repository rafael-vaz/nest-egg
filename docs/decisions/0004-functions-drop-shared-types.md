# 0004 — `apps/functions` para de depender de `packages/shared-types`

**Status:** Aceita
**Data:** 2026-09-30

## Contexto

[`0003-shared-types-scope.md`](0003-shared-types-scope.md) restringiu
`packages/shared-types` a três tipos literais idênticos nos dois lados
(`TransactionType`, `FrequencyCategory`, `FrequencyOrder`), consumidos tanto
por `apps/web` quanto por `apps/functions` via `@nest-egg/shared-types`.

Ao publicar uma nova versão das Cloud Functions, o deploy falhou duas vezes
seguidas com o mesmo erro, mesmo depois de mover `@nest-egg/shared-types`
para `devDependencies`:

```
npm error 404 Not Found - GET https://registry.npmjs.org/@nest-egg%2fshared-types
```

O ambiente de build do Cloud Functions (Cloud Build, via buildpacks) não tem
nenhum contexto do npm workspace deste monorepo — ele empacota só o
conteúdo de `apps/functions` e roda `npm install` isoladamente, então
qualquer pacote interno do workspace listado no `package.json`, seja em
`dependencies` ou `devDependencies`, é procurado no registro público do npm
e falha com 404. Como `apps/functions/package.json` declara um script
`"build": "tsc"`, o buildpack do Cloud Functions também o detecta e o roda
como "passo de build customizado" — e, segundo a documentação do Firebase,
isso faz com que `devDependencies` também sejam instaladas antes desse
passo, não só `dependencies`. Não há como desativar esse comportamento por
`firebase.json`.

## Decisão

`apps/functions` deixa de depender de `@nest-egg/shared-types`.
`apps/functions/src/recurrence/types.ts` volta a declarar
`TransactionType`, `FrequencyCategory` e `FrequencyOrder` localmente, como
antes de `0003`. `@nest-egg/shared-types` continua existindo e sendo
consumido por `apps/web` (que não tem essa restrição de deploy).

## Motivo

Não existe hoje uma forma suportada pelo Firebase CLI de fazer o deploy de
Cloud Functions consumir um pacote interno de um npm workspace sem
ferramentas adicionais (múltiplos `codebase` em `firebase.json`, empacotar o
pacote como tarball via script `gcp-build`, etc.) — desproporcional para
compartilhar três aliases de tipo de uma linha cada. Duplicar esses três
tipos em `apps/functions` custa muito menos do que lutar contra essa
limitação de infraestrutura.

## Consequências

- `packages/shared-types` agora tem um único consumidor (`apps/web`).
  Mantido mesmo assim nesta decisão — removê-lo por completo (voltando a
  duplicar os três literais também em `apps/web`) é uma limpeza válida, mas
  fora do escopo desta correção pontual do deploy; pode ser proposta como
  incremento separado se a indireção de um pacote com um consumidor só não
  se justificar.
- `apps/functions/src/recurrence/types.ts` não importa mais de
  `@nest-egg/shared-types`; seus 3 consumidores (`engine.ts`, `cron.ts`,
  `transactions.ts`) continuam importando de `./types` sem nenhuma mudança.
- Qualquer novo pacote de `packages/*` que `apps/functions` venha a
  precisar no futuro esbarra na mesma limitação — a menos que seja só tipos
  (contornável duplicando, como aqui) ou que se invista na configuração de
  múltiplos `codebase`/`gcp-build`.
