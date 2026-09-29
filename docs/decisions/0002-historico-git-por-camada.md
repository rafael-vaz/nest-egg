# 0002 — Histórico Git inicial por camada arquitetural

**Status:** Aceita
**Data:** 2026-09-28

## Contexto

Nenhum dos dois diretórios de origem do nest-egg jamais teve controle de
versão. Todo o código já existia, pronto, no momento em que o versionamento
foi criado — não há uma ordem cronológica real de criação para o Git
reconstruir. Era preciso escolher como agrupar o primeiro commit em algo mais
útil do que um único commit gigante.

## Decisão

O histórico inicial foi criado como 14 commits, cada um adicionando uma
camada arquitetural completa, na ordem em que o app é construído de baixo
para cima: scaffold do monorepo → `packages/shared-types` → tooling de
`apps/web` → tipos/schemas/utils → store → services → hooks → components →
pages/routes/entry points → assets estáticos → engine de recorrência das
functions → triggers das functions → infraestrutura Firebase na raiz →
documentação. Ver a lista completa de mensagens em
[`docs/tasks/reestruturacao.md`](../tasks/reestruturacao.md), seção 11a.

Mensagens de commit seguem [Conventional Commits](https://www.conventionalcommits.org/)
e são escritas em inglês — convenção do usuário para este repositório,
independente do idioma usado no resto da documentação.

## Motivo

Esta ordem reflete como o app realmente se sustenta (uma camada depende da
anterior), o que facilita a leitura de `git log -p` por qualquer pessoa que
queira entender a arquitetura lendo o histórico. Só o commit final precisa
necessariamente compilar/lintar sem erros — commits intermediários são
camadas parciais e propositalmente não são buildáveis isoladamente (por
exemplo, o commit de "tipos, schemas e utils" não tem nenhum componente React
ainda).

## Alternativas descartadas

- **Por domínio de produto** (autenticação → perfil → carteira → metas →
  coleções → busca) — descartada: o usuário preferiu a leitura técnica de
  como o app é montado camada por camada.
- **Poucos commits de marco** (4-6 commits grandes) — descartada: menos útil
  como referência de arquitetura do que a sequência por camada.

## Consequências

- O histórico não deve ser lido como "isso foi construído nesta ordem no
  tempo real" — é uma reconstrução didática, feita e documentada como tal.
- Novas mudanças, a partir de agora, seguem o fluxo normal de um repositório
  já versionado (um commit por mudança de comportamento real, não mais por
  camada de import).
