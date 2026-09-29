# 0003 — Escopo restrito de `packages/shared-types`

**Status:** Aceita
**Data:** 2026-09-28

## Contexto

`apps/web` e `apps/functions` cada um definia seu próprio `ITransaction`,
`IFrequency`, `IRecurrenceDate` e `ITransactionOccurrenceLog`, aparentemente
duplicados. A intenção original, ao decidir criar `packages/shared-types`
(ver [`0001-monorepo-por-produto.md`](0001-monorepo-por-produto.md)), era
unificar esses tipos por completo. Uma leitura mais atenta dos dois arquivos
mostrou que a duplicação não é acidental por completo:

- `apps/functions/src/recurrence/types.ts` tipa `IRecurrenceDate.startDate` e
  `.endDate` como `string` pura — o código do motor de recorrência chama
  `.includes("T")` e `.split("-")` diretamente sobre esses campos, métodos
  que só existem em `string`.
- `apps/web/src/@types/recurrence-date/index.ts` tipa os mesmos campos como
  `Date | string`, e `IFrequency.weekDays` como `WeekDaysId[]` (um subtipo
  próprio de número usado pela UI), não `number[]` puro como em
  `apps/functions`.

Forçar uma forma única quebraria as chamadas de método específicas de
`string` no lado das functions, ou perderia a precisão de tipo do lado do
frontend — nenhuma das duas é um acidente de duplicação, são decisões de
tipagem propositais para o contexto de cada lado.

## Decisão

`packages/shared-types` exporta somente os três tipos literais que são
idênticos, byte a byte, nos dois lados, sem nenhum risco de divergência:

- `TransactionType` (`"credit" | "debt"`)
- `FrequencyCategory` (`"day" | "week" | "month" | "year"`)
- `FrequencyOrder` (`"day-number" | "week-order" | null`)

`IFrequency`, `IRecurrenceDate`, `ITransaction` e `ITransactionOccurrenceLog`
continuam definidos separadamente em cada app, mas cada definição local
importa os três tipos literais do pacote compartilhado em vez de
redeclará-los inline.

## Motivo

Unificar tipos que divergem de propósito seria redesenhar um contrato de
dados por baixo da reestruturação — o tipo de mudança que este resgate
explicitamente evita (ver "não escopo" em
[`docs/tasks/reestruturacao.md`](../tasks/reestruturacao.md)). Compartilhar
só o que é genuinamente idêntico elimina o risco real de duplicação (os três
literais desalinharem silenciosamente) sem forçar nenhum lado a abrir mão de
uma tipagem que serve ao seu próprio código.

## Consequências

- `apps/web/src/@types/transaction/index.ts` e
  `apps/web/src/@types/recurrence-date/index.ts` importam de
  `@nest-egg/shared-types`, mas continuam exportando os mesmos nomes de
  sempre — nenhum dos 23 arquivos que os consomem precisou mudar.
- `apps/functions/src/recurrence/types.ts` faz o mesmo pelos seus 3
  consumidores (`engine.ts`, `cron.ts`, `transactions.ts`).
- Se, no futuro, os dois lados decidirem deliberadamente tratar datas de
  recorrência da mesma forma (por exemplo, ao implementar a feature da
  carteira, que vai mexer nesses mesmos triggers), essa unificação é uma
  decisão de design nova, com seu próprio ADR — não uma consequência
  automática desta.
