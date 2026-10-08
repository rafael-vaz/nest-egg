# Log de Atividades — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gravar um registro estruturado em `nest-egg-users/{userId}/activities/{activityId}` sempre que o usuário criar, editar ou excluir uma transação, meta, coleção, ou alterar a carteira/perfil — sem nenhuma Cloud Function nova, sem UI de exibição (isso é um projeto futuro separado).

**Architecture:** Um tipo `IActivity` + uma função pura `buildChanges` (calcula o diff entre o estado antes/depois de um update) + um serviço `createActivityService` (grava no Firestore, nunca lança erro) são a base compartilhada. Cada um dos 13 pontos do catálogo de eventos chama essa base logo após sua ação principal ter sucesso — dentro do próprio thunk quando o thunk é exclusivo de uma entidade (transação/meta/coleção/foto), ou no componente quando o thunk é compartilhado entre contextos diferentes (carteira e perfil usam o mesmo `updateUserThunk`).

**Tech Stack:** React 19, Redux Toolkit (`createAsyncThunk`), Firebase JS SDK (`firestore`), `uuid`. Testes novos com Vitest (ainda não existe nenhum framework de teste no projeto — ver Task 1).

**Spec:** `docs/superpowers/specs/2026-10-07-activity-log-design.md`

## Global Constraints

- Gravação 100% no cliente (React) — nenhuma Cloud Function nova.
- O log é append-only: `firestore.rules` permite `create` para o dono, mas `update`/`delete` ficam `false` para todo mundo, inclusive o dono.
- Sem política de retenção — guarda tudo.
- Só os 13 `ActivityType` do catálogo da spec. Nada de `account.created`/`account.deleted`, nada de eventos automáticos do servidor (cron, reconciliação da carteira).
- Uma falha ao gravar o log **nunca** pode fazer a ação principal (criar transação, excluir meta, etc.) parecer que falhou.

## Review Focus

- **Gravação do log falha silenciosamente, ação principal continua funcionando.** `createActivityService` nunca relança o erro — coberto no Task 2.
- **Update onde nada do que é rastreado mudou** (usuário abre o formulário de edição e salva sem alterar nada) não deve gerar um registro vazio/sem sentido. `buildChanges` retorna `undefined` quando não há diferença nas chaves rastreadas, e os pontos de instrumentação pulam a criação do registro de atividade quando isso acontece — coberto nos Tasks 3-5.
- **Excluir uma entidade cuja leitura prévia (pra capturar o nome) falha ou retorna nulo** não pode impedir a exclusão em si — a leitura do nome é melhor-esforço, a exclusão é a ação principal e sempre roda. Coberto nos Tasks 3-5.
- **Uma única submissão do formulário de perfil que muda nome/data de nascimento *e* o valor da carteira ao mesmo tempo** deve gerar dois registros (`profile.updated` e `wallet.updated`), não só um — coberto no Task 8.
- **Diff de campos não-primitivos** (ex.: `recurrence` de uma transação, `collection` de uma meta — ambos objetos, não string/number) precisa ser comparado corretamente, não só `===` (que sempre dá `false` pra objetos diferentes por referência mesmo com o mesmo conteúdo). `buildChanges` usa `JSON.stringify` pra comparar — coberto no Task 1 com teste dedicado.

---

## Task 1: Tipos de atividade e `buildChanges` (com setup do Vitest)

O projeto não tem nenhum framework de teste configurado ainda. Esta é a primeira peça de lógica pura (sem Firebase) de toda a feature, e é exatamente o tipo de função que vale a pena testar de verdade — por isso este task também configura o Vitest, que vira disponível pro resto do projeto.

**Files:**
- Modify: `apps/web/package.json` (adiciona `vitest` como devDependency e um script `test`)
- Modify: `apps/web/vite.config.ts` (adiciona config do Vitest)
- Create: `apps/web/src/@types/activity/index.ts`
- Create: `apps/web/src/utils/activity/build-changes.ts`
- Test: `apps/web/src/utils/activity/build-changes.test.ts`

**Interfaces:**
- Produces:
  - `ActivityType` (union de 13 strings), `ActivityEntityType`, `IActivityEntity { type, id, name }`, `IActivity { id, type, createdAt, entity, changes? }` — exportados de `apps/web/src/@types/activity/index.ts`
  - `buildChanges<T extends Record<string, unknown>>(before: T, after: Partial<T>, keys: (keyof T)[]): Record<string, { from: unknown; to: unknown }> | undefined` — exportado (named export) de `apps/web/src/utils/activity/build-changes.ts`

- [ ] **Step 1: Instalar o Vitest**

```bash
npm install -D vitest -w apps/web
```

- [ ] **Step 2: Configurar o Vitest no `vite.config.ts`**

Conteúdo final de `apps/web/vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 3: Adicionar o script `test` em `apps/web/package.json`**

No bloco `"scripts"`, adicionar ao lado de `"lint"`:

```json
    "test": "vitest run",
```

- [ ] **Step 4: Criar os tipos de atividade**

Criar `apps/web/src/@types/activity/index.ts`:

```ts
export type ActivityType =
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

export type ActivityEntityType =
  | "transaction"
  | "goal"
  | "collection"
  | "profile"
  | "wallet";

export interface IActivityEntity {
  type: ActivityEntityType;
  id: string | null;
  name: string | null;
}

export type ActivityChanges = Record<string, { from: unknown; to: unknown }>;

export interface IActivity {
  id: string;
  type: ActivityType;
  createdAt: string;
  entity: IActivityEntity;
  changes?: ActivityChanges;
}
```

- [ ] **Step 5: Escrever o teste de `buildChanges` (vai falhar — a função ainda não existe)**

Criar `apps/web/src/utils/activity/build-changes.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { buildChanges } from "./build-changes";

interface Sample extends Record<string, unknown> {
  name: string;
  value: number;
  recurrence: { category: string } | null;
}

describe("buildChanges", () => {
  it("returns undefined when no tracked key changed", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { name: "Mercado", value: 100 };

    expect(buildChanges(before, after, ["name", "value"])).toBeUndefined();
  });

  it("returns a single-entry map when one field changed", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { value: 150 };

    expect(buildChanges(before, after, ["name", "value"])).toEqual({
      value: { from: 100, to: 150 },
    });
  });

  it("returns multiple entries when multiple fields changed", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { name: "Mercado 2", value: 150 };

    expect(buildChanges(before, after, ["name", "value"])).toEqual({
      name: { from: "Mercado", to: "Mercado 2" },
      value: { from: 100, to: 150 },
    });
  });

  it("diffs object-valued fields by content, not reference", () => {
    const before: Sample = {
      name: "Mercado",
      value: 100,
      recurrence: { category: "month" },
    };
    const after: Partial<Sample> = {
      recurrence: { category: "week" },
    };

    expect(buildChanges(before, after, ["recurrence"])).toEqual({
      recurrence: {
        from: { category: "month" },
        to: { category: "week" },
      },
    });
  });

  it("ignores keys not present in the partial update", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { value: 150 };

    const result = buildChanges(before, after, ["name", "value"]);
    expect(result).not.toHaveProperty("name");
  });
});
```

- [ ] **Step 6: Rodar os testes pra confirmar que falham**

Run: `npm run test -w apps/web`
Expected: FAIL — `Cannot find module './build-changes'` (o arquivo ainda não existe)

- [ ] **Step 7: Implementar `buildChanges`**

Criar `apps/web/src/utils/activity/build-changes.ts`:

```ts
export function buildChanges<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>,
  keys: (keyof T)[],
): Record<string, { from: unknown; to: unknown }> | undefined {
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  for (const key of keys) {
    if (!(key in after)) continue;

    const beforeValue = before[key];
    const afterValue = after[key];

    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changes[key as string] = { from: beforeValue, to: afterValue };
    }
  }

  return Object.keys(changes).length > 0 ? changes : undefined;
}
```

- [ ] **Step 8: Rodar os testes pra confirmar que passam**

Run: `npm run test -w apps/web`
Expected: PASS — 5 testes passando

- [ ] **Step 9: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 10: Commit**

```bash
git add apps/web/package.json apps/web/package-lock.json apps/web/vite.config.ts apps/web/src/@types/activity apps/web/src/utils/activity
git commit -m "feat(web): add activity types and buildChanges, set up Vitest"
```

---

## Task 2: `createActivityService`

**Files:**
- Create: `apps/web/src/services/activity/create-activity.ts`
- Test: `apps/web/src/services/activity/create-activity.test.ts`

**Interfaces:**
- Consumes: `IActivity` de `apps/web/src/@types/activity/index.ts` (Task 1)
- Produces: `createActivityService(activity: Omit<IActivity, "id" | "createdAt">, userId: string): Promise<void>` — default export de `apps/web/src/services/activity/create-activity.ts`. Nunca lança erro (ver Global Constraints e Review Focus item 1).

Esse serviço escreve no Firestore seguindo o mesmo padrão de `apps/web/src/services/transaction/create-transaction.ts`. A diferença deliberada — e por isso a única coisa testada aqui — é que ele nunca relança o erro, porque uma falha ao gravar o log não pode derrubar uma ação principal que já teve sucesso. O resto do arquivo (chamada real ao Firestore) segue sem teste, igual a todo outro arquivo em `services/` deste projeto.

- [ ] **Step 1: Escrever o teste do comportamento de nunca lançar erro (vai falhar — o serviço ainda não existe)**

Criar `apps/web/src/services/activity/create-activity.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => ({})),
  setDoc: vi.fn(() => Promise.reject(new Error("network error"))),
}));

vi.mock("../firebase", () => ({ db: {} }));

import createActivityService from "./create-activity";

describe("createActivityService", () => {
  it("resolves instead of throwing when the Firestore write fails", async () => {
    await expect(
      createActivityService(
        {
          type: "wallet.updated",
          entity: { type: "wallet", id: null, name: null },
        },
        "user-1",
      ),
    ).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar o teste pra confirmar que falha**

Run: `npm run test -w apps/web`
Expected: FAIL — `Cannot find module './create-activity'` (o arquivo ainda não existe)

- [ ] **Step 3: Implementar o serviço**

Criar `apps/web/src/services/activity/create-activity.ts`:

```ts
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { IActivity } from "../../@types/activity";
import { db } from "../firebase";

async function createActivityService(
  activity: Omit<IActivity, "id" | "createdAt">,
  userId: string,
): Promise<void> {
  try {
    const id = uuidv4();
    const fullActivity: IActivity = {
      ...activity,
      id,
      createdAt: new Date().toISOString(),
    };
    const activityRef = doc(db, "nest-egg-users", userId, "activities", id);
    await setDoc(activityRef, fullActivity);
  } catch (error) {
    // Intencional: nunca relança. A escrita do log é melhor-esforço e não
    // pode fazer uma ação principal já bem-sucedida parecer que falhou.
    console.error("Error creating activity log entry:", error);
  }
}

export default createActivityService;
```

- [ ] **Step 4: Rodar o teste pra confirmar que passa**

Run: `npm run test -w apps/web`
Expected: PASS

- [ ] **Step 5: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/services/activity
git commit -m "feat(web): add createActivityService"
```

---

## Task 3: Instrumentar os thunks de transação

**Files:**
- Modify: `apps/web/src/store/thunks/transaction/transaction-data.ts`

**Interfaces:**
- Consumes: `createActivityService` (Task 2), `buildChanges` (Task 1), `IActivity`/`ActivityChanges` (Task 1), `readTransactionService` (já existe neste arquivo)

- [ ] **Step 1: Reescrever o arquivo com a instrumentação**

Conteúdo final de `apps/web/src/store/thunks/transaction/transaction-data.ts`:

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ITransaction } from "../../../@types/transaction";
import createActivityService from "../../../services/activity/create-activity";
import createTransactionService from "../../../services/transaction/create-transaction";
import deleteTransactionService from "../../../services/transaction/delete-transaction";
import readAllTransactionsService from "../../../services/transaction/read-all-transactions";
import readTransactionService from "../../../services/transaction/read-transaction";
import updateTransactionService from "../../../services/transaction/update-transaction";
import { buildChanges } from "../../../utils/activity/build-changes";

const TRACKED_TRANSACTION_KEYS: (keyof ITransaction)[] = [
  "value",
  "category",
  "description",
  "recurrence",
];

// create transaction
export const createTransactionThunk = createAsyncThunk<
  void,
  { transaction: ITransaction; userId: string },
  { rejectValue: string }
>("transactionData/createTransaction", async (data, { rejectWithValue }) => {
  try {
    await createTransactionService(data.transaction, data.userId);
    await createActivityService(
      {
        type: "transaction.created",
        entity: {
          type: "transaction",
          id: data.transaction.id,
          name: data.transaction.name,
        },
      },
      data.userId,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to create transaction.");
  }
});

// read transaction
export const readTransactionThunk = createAsyncThunk<
  ITransaction | null,
  { transactionId: string; userId: string },
  { rejectValue: string }
>("transactionData/readTransaction", async (data, { rejectWithValue }) => {
  try {
    const transaction = await readTransactionService(
      data.transactionId,
      data.userId,
    );
    return transaction;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read transaction.");
  }
});

// read all transactions
export const readAllTransactionsThunk = createAsyncThunk<
  ITransaction[] | null,
  { userId: string },
  { rejectValue: string }
>("transactionData/readAllTransactions", async (data, { rejectWithValue }) => {
  try {
    const transactions = await readAllTransactionsService(data.userId);
    return transactions;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to read transactions.");
  }
});

// update transaction
export const updateTransactionThunk = createAsyncThunk<
  void,
  {
    userId: string;
    transaction: Partial<ITransaction> & { id: string };
    hasAlert?: boolean;
  },
  { rejectValue: string }
>("transactionData/updateTransaction", async (data, { rejectWithValue }) => {
  try {
    // Leitura só serve para o registro de atividade — se ela falhar, a
    // atualização real precisa continuar mesmo assim, só sem log.
    let before: ITransaction | null = null;
    try {
      before = await readTransactionService(data.transaction.id, data.userId);
    } catch {
      before = null;
    }

    await updateTransactionService(
      data.transaction,
      data.userId,
      data.hasAlert ?? false,
    );

    if (before) {
      const changes = buildChanges(
        before as unknown as Record<string, unknown>,
        data.transaction as unknown as Record<string, unknown>,
        TRACKED_TRANSACTION_KEYS,
      );

      if (changes) {
        await createActivityService(
          {
            type: "transaction.updated",
            entity: {
              type: "transaction",
              id: data.transaction.id,
              name: data.transaction.name ?? before.name,
            },
            changes,
          },
          data.userId,
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error when trying to update transaction.");
  }
});

// delete transaction
export const deleteTransactionThunk = createAsyncThunk<
  void,
  { transactionId: string; userId: string },
  { rejectValue: string }
>("transactionData/deleteTransaction", async (data, { rejectWithValue }) => {
  try {
    // Leitura só serve para capturar o nome no registro de atividade — se
    // ela falhar, a exclusão real precisa continuar mesmo assim.
    let transactionName: string | null = null;
    try {
      const transaction = await readTransactionService(
        data.transactionId,
        data.userId,
      );
      transactionName = transaction?.name ?? null;
    } catch {
      transactionName = null;
    }

    await deleteTransactionService(data.transactionId, data.userId);

    await createActivityService(
      {
        type: "transaction.deleted",
        entity: {
          type: "transaction",
          id: data.transactionId,
          name: transactionName,
        },
      },
      data.userId,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      rejectWithValue(error.message);
    }
    return rejectWithValue("Error unknown when trying to delete transaction.");
  }
});
```

- [ ] **Step 2: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/store/thunks/transaction/transaction-data.ts
git commit -m "feat(web): log activity on transaction create/update/delete"
```

---

## Task 4: Instrumentar os thunks de meta (goal)

**Files:**
- Modify: `apps/web/src/store/thunks/goal/goal-data.ts`

**Interfaces:**
- Consumes: `createActivityService` (Task 2), `buildChanges` (Task 1)

`updateGoalThunk` e `deleteGoalThunk` já fazem `readGoalService`/leitura prévia por conta própria (pra lógica de troca de coleção) — reaproveitar essas leituras existentes em vez de ler de novo.

- [ ] **Step 1: Adicionar os imports e a constante de chaves rastreadas**

No topo de `apps/web/src/store/thunks/goal/goal-data.ts`, depois dos imports existentes:

```ts
import createActivityService from "../../../services/activity/create-activity";
import { buildChanges } from "../../../utils/activity/build-changes";

const TRACKED_GOAL_KEYS: (keyof IGoal)[] = ["value", "status", "collection"];
```

- [ ] **Step 2: Instrumentar `createGoalThunk`**

Dentro do `try`, logo após `await createGoalService(data.goal, data.userId);` (antes do bloco `if (data.goal.collection) { ... }`), adicionar:

```ts
    await createActivityService(
      {
        type: "goal.created",
        entity: { type: "goal", id: data.goal.id, name: data.goal.name },
      },
      data.userId,
    );
```

- [ ] **Step 3: Instrumentar `updateGoalThunk`**

Esse thunk já lê `currentGoal` via `readGoalService` no início do `try`. Logo depois de `await updateGoalService(data.goal, data.userId, data.hasAlert ?? false);` (já existente), adicionar:

```ts
      if (currentGoal) {
        const changes = buildChanges(
          currentGoal as unknown as Record<string, unknown>,
          data.goal as unknown as Record<string, unknown>,
          TRACKED_GOAL_KEYS,
        );

        if (changes) {
          await createActivityService(
            {
              type: "goal.updated",
              entity: {
                type: "goal",
                id: data.goal.id,
                name: data.goal.name ?? currentGoal.name,
              },
              changes,
            },
            data.userId,
          );
        }
      }
```

- [ ] **Step 4: Instrumentar `deleteGoalThunk`**

Esse thunk já lê `goal` via `readGoalService` no início do `try`. Logo depois de `await deleteGoalService(data.goalId, data.userId);` (já existente, última linha do `try`), adicionar:

```ts
    await createActivityService(
      {
        type: "goal.deleted",
        entity: { type: "goal", id: data.goalId, name: goal?.name ?? null },
      },
      data.userId,
    );
```

- [ ] **Step 5: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/store/thunks/goal/goal-data.ts
git commit -m "feat(web): log activity on goal create/update/delete"
```

---

## Task 5: Instrumentar os thunks de coleção

**Files:**
- Modify: `apps/web/src/store/thunks/collection/collection-data.ts`

**Interfaces:**
- Consumes: `createActivityService` (Task 2), `buildChanges` (Task 1)

Mesmo padrão do Task 4: `updateCollectionThunk` e `deleteCollectionThunk` já leem a coleção atual (`currentCollection`/`collection`) por conta própria — reaproveitar.

- [ ] **Step 1: Adicionar os imports e a constante de chaves rastreadas**

No topo de `apps/web/src/store/thunks/collection/collection-data.ts`, depois dos imports existentes:

```ts
import createActivityService from "../../../services/activity/create-activity";
import { buildChanges } from "../../../utils/activity/build-changes";

const TRACKED_COLLECTION_KEYS: (keyof ICollection)[] = ["name"];
```

- [ ] **Step 2: Instrumentar `createCollectionThunk`**

Dentro do `try`, logo após `await createCollectionService(data.collection, data.userId);` (antes do bloco `const promises = ...`), adicionar:

```ts
      await createActivityService(
        {
          type: "collection.created",
          entity: {
            type: "collection",
            id: data.collection.id,
            name: data.collection.name,
          },
        },
        data.userId,
      );
```

- [ ] **Step 3: Instrumentar `updateCollectionThunk`**

Esse thunk já lê `currentCollection` no início do `try`. Logo depois de `await updateCollectionService(data.collection, data.userId, data.hasAlert ?? false);` (já existente, última linha do `try`), adicionar:

```ts
      const changes = buildChanges(
        currentCollection as unknown as Record<string, unknown>,
        data.collection as unknown as Record<string, unknown>,
        TRACKED_COLLECTION_KEYS,
      );

      if (changes) {
        await createActivityService(
          {
            type: "collection.updated",
            entity: {
              type: "collection",
              id: data.collection.id,
              name: data.collection.name ?? currentCollection!.name,
            },
            changes,
          },
          data.userId,
        );
      }
```

- [ ] **Step 4: Instrumentar `deleteCollectionThunk`**

Esse thunk já lê `collection` no início do `try`. Logo depois de `await deleteCollectionService(data.collectionId, data.userId);` (já existente, última linha do `try`), adicionar:

```ts
      await createActivityService(
        {
          type: "collection.deleted",
          entity: {
            type: "collection",
            id: data.collectionId,
            name: collection?.name ?? null,
          },
        },
        data.userId,
      );
```

- [ ] **Step 5: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/store/thunks/collection/collection-data.ts
git commit -m "feat(web): log activity on collection create/update/delete"
```

---

## Task 6: Instrumentar os thunks de foto de perfil

**Files:**
- Modify: `apps/web/src/store/thunks/user/user-file.ts`

**Interfaces:**
- Consumes: `createActivityService` (Task 2)

Foto de perfil não tem um "id" de entidade próprio — `entity.type` é `"profile"`, `entity.id` é `null`, por definição da spec.

- [ ] **Step 1: Reescrever o arquivo com a instrumentação**

Conteúdo final de `apps/web/src/store/thunks/user/user-file.ts`:

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import createActivityService from "../../../services/activity/create-activity";
import removeFileService from "../../../services/file/remove-file";
import uploadFileService from "../../../services/file/upload-file";
import updateUserService from "../../../services/user/update-user";
import getFirebaseFileInfoFromURL from "../../../utils/file/get-firebase-file-info-from-url";
import { RootState } from "../../configure-store";
import { updateAuthUser } from "../../reducers/user/user-auth";

// delete photo
export const deletePhotoThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>(
  "userFile/deletePhoto",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { authUser } = getState().userAuth;
      if (authUser?.uid && authUser.photoURL) {
        const fileInfo = getFirebaseFileInfoFromURL(authUser.photoURL);
        if (fileInfo?.fileName) {
          await removeFileService(
            `users/${authUser.uid}/photo`,
            fileInfo.fileName
          );
        }
        await updateUserService({ uid: authUser.uid, photoURL: null }, false);
        dispatch(updateAuthUser({ ...authUser, photoURL: null }));
        await createActivityService(
          {
            type: "profile.photo_removed",
            entity: { type: "profile", id: null, name: null },
          },
          authUser.uid,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when deleting user photo.");
    }
  }
);

// update photo
export const updatePhotoThunk = createAsyncThunk<
  void,
  File,
  { state: RootState; rejectValue: string }
>(
  "userFile/updatePhoto",
  async (file, { getState, dispatch, rejectWithValue }) => {
    try {
      const { authUser } = getState().userAuth;
      if (authUser?.uid) {
        const url = await uploadFileService(
          file,
          `users/${authUser.uid}/photo`,
          file.name
        );
        await updateUserService({ uid: authUser.uid, photoURL: url }, false);
        dispatch(updateAuthUser({ ...authUser, photoURL: url }));
        await createActivityService(
          {
            type: "profile.photo_updated",
            entity: { type: "profile", id: null, name: null },
          },
          authUser.uid,
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error when update user photo.");
    }
  }
);
```

- [ ] **Step 2: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/store/thunks/user/user-file.ts
git commit -m "feat(web): log activity on profile photo update/removal"
```

---

## Task 7: Instrumentar a edição manual da carteira

**Files:**
- Modify: `apps/web/src/components/card/wallet-balance-card.tsx`

**Interfaces:**
- Consumes: `createActivityService` (Task 2)

`updateUserThunk` é compartilhado entre este componente e o formulário de perfil (Task 8) — por isso a decisão de registrar a atividade aqui, no componente, e não dentro do thunk genérico (que não sabe se quem o chamou foi a edição da carteira ou do perfil).

- [ ] **Step 1: Adicionar o import**

No topo de `apps/web/src/components/card/wallet-balance-card.tsx`, junto aos outros imports de `store`:

```ts
import createActivityService from "../../services/activity/create-activity";
```

- [ ] **Step 2: Registrar a atividade após o sucesso da atualização**

Dentro de `updateWalletValue`, logo depois de `dispatch(updateAuthUser(user));` (e antes de `setWalletValue(newWalletValue);`), adicionar:

```ts
      await createActivityService(
        {
          type: "wallet.updated",
          entity: { type: "wallet", id: null, name: null },
          changes: { value: { from: authUser.wallet, to: newWalletValue } },
        },
        authUser.uid,
      );
```

- [ ] **Step 3: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/card/wallet-balance-card.tsx
git commit -m "feat(web): log activity on manual wallet edit"
```

---

## Task 8: Instrumentar o formulário de perfil (nome/data de nascimento/carteira)

**Files:**
- Modify: `apps/web/src/components/profile/profile-form-submit-button.tsx`

**Interfaces:**
- Consumes: `createActivityService` (Task 2), `buildChanges` (Task 1)

`profile-form-submit-button.tsx` também permite alterar o valor da carteira (campo `wallet` do formulário de perfil), além de nome e data de nascimento. Uma única submissão pode mudar ambos os grupos de campos ao mesmo tempo — por isso dois registros de atividade separados e independentes, não um só.

- [ ] **Step 1: Reescrever o arquivo com a instrumentação**

Conteúdo final de `apps/web/src/components/profile/profile-form-submit-button.tsx`:

```tsx
import { CircleCheckBig, Loader } from "lucide-react";
import React from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { useSelector } from "react-redux";

import createActivityService from "../../services/activity/create-activity";
import { ProfileFormData } from "../../schemas/profile-form-schema";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import { buildChanges } from "../../utils/activity/build-changes";
import createOnError from "../../utils/form/create-on-error";
import Button from "../button/button";
import styles from "./profile-form-submit-button.module.css";

interface IProfileFormSubmitButtonProps {
  loading: boolean;
  hasAlt: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<ProfileFormData>;
}

const ProfileFormSubmitButton = ({
  loading,
  hasAlt,
  setLoading,
  handleSubmit,
}: IProfileFormSubmitButtonProps) => {
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useAppDispatch();

  async function handleUserUpdate(data: ProfileFormData) {
    const newUserData = {
      uid: authUser!.uid,
      name: data.name,
      dateOfBirth: data.dateOfBirth.toISOString(),
      wallet: data.wallet,
    };
    try {
      setLoading(true);
      await dispatch(updateUserThunk(newUserData));
      dispatch(updateAuthUser(newUserData));

      const profileChanges = buildChanges(
        authUser! as unknown as Record<string, unknown>,
        newUserData,
        ["name", "dateOfBirth"],
      );
      if (profileChanges) {
        await createActivityService(
          {
            type: "profile.updated",
            entity: { type: "profile", id: null, name: null },
            changes: profileChanges,
          },
          authUser!.uid,
        );
      }

      const walletChanges = buildChanges(
        authUser! as unknown as Record<string, unknown>,
        newUserData,
        ["wallet"],
      );
      if (walletChanges) {
        await createActivityService(
          {
            type: "wallet.updated",
            entity: { type: "wallet", id: null, name: null },
            changes: { value: walletChanges.wallet },
          },
          authUser!.uid,
        );
      }
    } catch (error) {
      console.log(`Error in registering user: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    handleUserUpdate(data);
  };

  const onError = createOnError<ProfileFormData>();

  return (
    <Button
      type="submit"
      aria-label="Salvar alterações"
      text={loading ? "Salvando..." : "Salvar alterações"}
      icon={loading ? Loader : CircleCheckBig}
      size="fill"
      className={styles.profileFormSubmitButton}
      disabled={loading || hasAlt}
      onClick={handleSubmit(onSubmit, onError)}
    />
  );
};

export default ProfileFormSubmitButton;
```

- [ ] **Step 2: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/profile/profile-form-submit-button.tsx
git commit -m "feat(web): log activity on profile form submit (name/birth/wallet)"
```

---

## Task 9: Regra do Firestore pra `activities`

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Adicionar o bloco da subcoleção**

Dentro de `match /nest-egg-users/{userId} { ... }`, ao lado dos outros `match` de subcoleção (`transactions`, `goals`, `collections`), adicionar:

```
      match /activities/{activityId} {
        allow read, create: if isOwner(userId);
        allow update, delete: if false;
      }
```

- [ ] **Step 2: Validar as regras**

Usar a ferramenta MCP do Firebase: `firebase_validate_security_rules` com `type: "firestore"` e `source_file: "firestore.rules"`.
Expected: `OK: No errors detected.`

- [ ] **Step 3: Commit**

```bash
git add firestore.rules
git commit -m "chore(infra): allow append-only activity log writes in firestore.rules"
```

Deploy (`npm run deploy:firestore-rules`) é um passo manual, fora deste plano — pedir confirmação ao usuário antes de rodar, como de costume neste projeto.

---

## Task 10: Verificação manual

Não há tela de atividades ainda (fora do escopo, ver spec) — a verificação é direta no Firestore.

- [ ] **Step 1: Rodar o app localmente**

Run: `npm run dev -w apps/web`

- [ ] **Step 2: Fazer login e realizar uma ação de cada tipo**

Pelo menos: criar uma transação, editar essa transação (mudar o valor), excluí-la; criar uma meta; criar uma coleção; editar o valor da carteira pelo card da carteira; editar o nome no formulário de perfil.

- [ ] **Step 3: Conferir os registros no Firestore**

Usar a ferramenta MCP do Firebase (`firestore_list_documents`) apontando para `nest-egg-users/{seu-uid}/activities`, ou o Console do Firebase. Confirmar:
- Um documento por ação realizada, com o `type` esperado.
- `entity.name` preenchido corretamente (ou `null` pra wallet/profile).
- `changes` presente nos updates com o `from`/`to` certos, ausente nos creates/deletes.
- Nenhum registro extra foi criado pra ações que não mudaram nenhum campo rastreado (ex.: salvar o formulário sem alterar nada).

- [ ] **Step 4: Rodar a suíte completa uma última vez**

Run: `npm run test -w apps/web && npm run lint -w apps/web && npm run build -w apps/web`
Expected: tudo verde
