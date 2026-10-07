# Log de atividades do usuário — desenho de dados

**Status:** Aprovado para virar plano de implementação
**Data:** 2026-10-07

## Contexto

O nest-egg ainda não tem nenhuma tela de histórico/atividades. A ideia é
trazer, no futuro, uma tela parecida com a aba "Atividades" do Zenkit:
um feed cronológico mostrando o que o próprio usuário fez na plataforma —
criou uma transação, excluiu uma coleção, alterou o valor da carteira, etc.

Este documento cobre **só o desenho de dados**: onde esses registros ficam
guardados, qual o formato de cada um, e o catálogo completo de eventos que
geram um registro. A tela que vai consumir esses dados, e a implementação
em si, são uma etapa separada e posterior (ver "Próximos passos").

## Princípios

1. **Só ações diretas do usuário** pela interface — criar, editar, excluir.
   Nada automático do servidor (cron, reconciliação da carteira) entra
   neste desenho.
2. **Gravação 100% pelo cliente** (React), feita logo depois que a ação
   principal já teve sucesso (ex.: depois que `createTransactionThunk`
   resolve). Nenhuma Cloud Function nova é necessária.
3. **Log é append-only**: a aplicação só cria registros novos, nunca edita
   ou apaga um já existente — isso vale mesmo sendo gravado pelo cliente,
   garantido pelas regras do Firestore (seção seguinte).
4. **Sem política de retenção por enquanto.** Guarda tudo; se o volume
   virar problema real, é uma mudança futura e isolada.

## Onde os dados ficam

Nova subcoleção do documento do usuário, no mesmo padrão de
`transactions`, `goals`, `collections`:

```
nest-egg-users/{userId}/activities/{activityId}
```

Regra do Firestore (`firestore.rules`), seguindo o padrão `isOwner()` já
usado no resto do arquivo:

```
match /activities/{activityId} {
  allow read, create: if isOwner(userId);
  allow update, delete: if false;
}
```

Mesmo gravado pelo cliente, isso garante a propriedade de "log de
verdade": ninguém, nem o próprio dono, consegue alterar ou apagar um
registro já criado — só criar novos.

## Formato do documento

Campos **estruturados**, não uma frase já pronta. A tela de atividades
(quando for construída) decide como formatar e pode deixar o nome da
entidade como link clicável — e registros antigos não precisam ser
regravados se o texto de exibição mudar um dia.

```ts
type ActivityType =
  | "transaction.created"
  | "transaction.updated"
  | "transaction.deleted"
  | "goal.created"
  | "goal.updated"
  | "goal.deleted"
  | "collection.created"
  | "collection.updated"
  | "collection.deleted"
  | "wallet.updated"
  | "profile.updated"
  | "profile.photo_updated"
  | "profile.photo_removed";

interface IActivity {
  id: string; // uuid, gerado no cliente (mesmo padrão de ITransaction.id)
  type: ActivityType;
  createdAt: string; // ISO timestamp de quando o evento aconteceu
  entity: {
    type: "transaction" | "goal" | "collection" | "profile" | "wallet";
    id: string | null; // id da entidade afetada; null para "profile"/"wallet", que não têm doc próprio
    name: string | null; // nome da entidade NO MOMENTO do evento (snapshot — renomear a entidade depois não altera o histórico)
  };
  changes?: Record<string, { from: unknown; to: unknown }>; // opcional: só em updates onde faz sentido descrever o que mudou
}
```

Não há campo `actor`: hoje não existe conceito de conta compartilhada ou
múltiplos usuários no mesmo documento — o dono é sempre implícito pelo
caminho (`nest-egg-users/{userId}/...`). Se isso mudar no futuro (conta
compartilhada), o campo pode ser adicionado sem quebrar nada que já
existe, já que `changes` e os demais campos continuam válidos.

## Catálogo de eventos

| Entidade | `type` | Quando dispara | `changes` relevantes |
| --- | --- | --- | --- |
| Transação | `transaction.created` | `createTransactionThunk` resolve com sucesso | — |
| Transação | `transaction.updated` | `updateTransactionThunk` resolve com sucesso | campos que mudaram: valor, categoria, descrição, recorrência (adicionada/removida/alterada) |
| Transação | `transaction.deleted` | `deleteTransactionThunk` resolve com sucesso | — |
| Meta | `goal.created` | `createGoalThunk` resolve com sucesso | — |
| Meta | `goal.updated` | `updateGoalThunk` resolve com sucesso | campos que mudaram: valor, status, coleção |
| Meta | `goal.deleted` | `deleteGoalThunk` resolve com sucesso | — |
| Coleção | `collection.created` | `createCollectionThunk` resolve com sucesso | — |
| Coleção | `collection.updated` | `updateCollectionThunk` resolve com sucesso | campos que mudaram |
| Coleção | `collection.deleted` | `deleteCollectionThunk` resolve com sucesso | — |
| Carteira | `wallet.updated` | edição manual do saldo em `wallet-balance-card.tsx` | `{ value: { from, to } }` |
| Perfil | `profile.updated` | `updateUserThunk` resolve com sucesso (nome, data de nascimento, capa) | campos que mudaram |
| Perfil | `profile.photo_updated` | `updatePhotoThunk` resolve com sucesso | — |
| Perfil | `profile.photo_removed` | `deletePhotoThunk` resolve com sucesso | — |

Recorrência não é um evento próprio: o formulário de recorrência só altera
estado local do Redux (`recurrenceDate`), persistido junto quando a
transação em si é salva — por isso ela aparece dentro de `changes` de
`transaction.created`/`transaction.updated`, não como um `type` separado.

## Decisões e motivos

| Decisão | Escolha | Motivo | Alternativa descartada |
| --- | --- | --- | --- |
| Onde gravar o registro | 100% no cliente, logo após a ação principal | Mais simples de construir agora (zero Cloud Functions novas); cada ação já sabe exatamente o que descrever, sem precisar inferir de um diff genérico de documento | Gravar via trigger do Firestore no servidor (mais confiável, mas exige criar triggers novos para `goals`/`collections`/usuário, que hoje não têm nenhum, e perder a riqueza de descrição que só o ponto de ação conhece) |
| Eventos automáticos (reconciliação da carteira pelo cron) | Ficam de fora deste desenho | Coerente com gravação 100% pelo cliente — incluir exigiria `apps/functions` também escrever na coleção, o que muda a decisão acima | Registrar também os ajustes automáticos (adiado para uma decisão futura, se fizer falta) |
| `account.created` / `account.deleted` | Nenhum dos dois vira evento | Criação da conta aconteceria antes de existir qualquer histórico útil; exclusão da conta apaga o próprio documento do usuário (e a subcoleção de atividades junto), então o registro não teria onde "sobreviver" para ser lido depois | Registrar `account.created` como marco inicial do histórico |
| Formato do registro | Campos estruturados (`type`, `entity`, `changes`) | Permite que a tela decida a formatação (inclusive links clicáveis, como no Zenkit) sem precisar regravar histórico se o texto mudar | Guardar uma frase já pronta (`summary: string`) — mais simples de renderizar, mas engessa o texto e perde a possibilidade de link clicável por entidade |

## Fora do escopo deste desenho

- A tela de atividades em si (UI) — fica para uma etapa separada.
- Eventos automáticos do servidor (cron, reconciliação da carteira).
- Abas "Comentário"/"Alterações" do Zenkit — não foram pedidas.
- Paginação, retenção ou limpeza de registros antigos.
- Login/logout — não é uma ação sobre dados, é autenticação.

## Próximos passos

Este documento cobre só o desenho de dados. Construir a feature de fato —
criar `apps/web/src/@types/activity`, o serviço de escrita, instrumentar
os 13 pontos do catálogo acima, atualizar `firestore.rules`, e (depois) a
tela de atividades — é trabalho de implementação, com seu próprio plano
(via a skill `writing-plans`), não incluído aqui.
