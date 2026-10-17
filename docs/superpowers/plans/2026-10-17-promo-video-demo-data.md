# Promo Video Demo Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and run the reset/seed scripts that populate `ferreira.vaz@live.com`'s production account with the demo dataset approved in the design spec, so the promo video can be recorded against realistic, reproducible data.

**Architecture:** A pure, unit-tested dataset builder (`buildDemoDataset`) produces the collections/goals/transactions as plain typed objects. Two thin, untested admin-SDK scripts — `reset-demo-user.ts` and `seed-demo-user.ts` — follow the project's existing `apps/functions/src/scripts/backfill-wallet-ledger.ts` convention (one-off, not exported, not deployed, run manually with `npx ts-node`) to wipe and then write that dataset for the single email-verified user, reusing the existing `reconcileWallet()` function so the wallet balance is produced by production logic, never hand-set.

**Tech Stack:** TypeScript, Vitest (apps/functions already uses it), `firebase-admin` (already a dependency), `npx ts-node` (already the project's convention for this kind of script, see `backfill-wallet-ledger.ts`).

**Spec:** `docs/superpowers/specs/2026-10-17-linkedin-demo-video-design.md` (§1 "Demo data strategy" — this plan implements that section only; recording scripts and the Remotion project are separate follow-up plans, written after real footage exists so their scene timings aren't guesses).

## Global Constraints

- Scripts must resolve the target user by email (`ferreira.vaz@live.com`) via `admin.auth().getUserByEmail`, never a hardcoded uid, and must refuse to run (throw, no writes) if the resolved email is not an exact match.
- Final wallet balance after seeding must equal exactly R$4.250,00 (425000 centavos), produced via `reconcileWallet()` — never written directly to the `wallet` field.
- Exactly 4 goals, exactly 1 with `status: "completed"`; the goal in the "Viagens" collection must land at ~70% progress (`wallet / goal.value * 100`), the goal in "Casa nova" at ~35%.
- Reset must only touch the four demo-user subcollections (`transactions`, `goals`, `collections`, `walletLedger`) plus `wallet`/`walletUpdatedAt` on the user doc — every other user-doc field (name, photoURL, etc.) is left untouched.
- Scripts live under `apps/functions/src/scripts/demo-data/`, are not exported from `apps/functions/src/index.ts`, and are not deployed — same convention as `backfill-wallet-ledger.ts`.
- No changes to any deployed/exported function, trigger, or web app code.

## Review Focus

- **Wrong user resolved (typo, wrong Firebase project, stale auth cache):** the email guard must throw before any write happens — this is the single highest-blast-radius failure mode since it runs against production. Covered in Task 2's tests.
- **Wallet math drifts from the documented baseline:** a silent centavos rounding or sign error would seed a wallet balance that doesn't match what's shown on camera. Covered in Task 1 by asserting the dataset's total signed occurrence delta equals 425000 exactly.
- **Goal progress outside the promised band:** if a goal's `value` is off, scene 5 of the video script shows the wrong progress bar. Covered in Task 1 by asserting both linked goals' computed progress falls in their documented range.
- **One-sided collection↔goal links:** a goal referencing a collection that doesn't list it back (or vice versa) renders inconsistently in the UI. Covered in Task 1.
- **Re-running reset/seed without a clean state in between:** since scenes may need retakes, running seed twice (or reset twice) must not leave duplicate or orphaned documents. Covered in Task 3's design (delete-by-query, not delete-by-fixed-id-list) and called out explicitly in Task 5's manual verification.

---

## Task 1: Demo dataset builder

**Files:**
- Create: `apps/functions/src/scripts/demo-data/types.ts`
- Create: `apps/functions/src/scripts/demo-data/dataset.ts`
- Test: `apps/functions/src/scripts/demo-data/dataset.test.ts`

**Interfaces:**
- Consumes: nothing (pure, no Firestore dependency).
- Produces (for Task 3 and Task 4):
  - `DemoCollection { id: string; name: string; goals: {id: string}[] | null; description: string | null; createdAt: string; updatedAt: string }`
  - `DemoGoal { id: string; name: string; value: number; status: "active" | "waiting" | "completed" | "confirm" | "unintended"; collection: {id: string} | null; description: string | null; createdAt: string; updatedAt: string }`
  - `DemoTransaction { id: string; name: string; value: number; type: "credit" | "debt"; date: string; category: string; description: string | null; createdAt: string; updatedAt: string; recurrence: {startDate: string; endDate: string | null; frequency: {rate: number; category: "month"; weekDays: null; order: null}} | null; occurrenceLog: {id: string; date: string; value: number; type: "credit" | "debt"}[] | null; hasRecurrence: boolean }`
  - `DemoDataset { walletBaselineCentavos: number; collections: DemoCollection[]; goals: DemoGoal[]; transactions: DemoTransaction[] }`
  - `buildDemoDataset(now: Date): DemoDataset`

These interfaces mirror the Firestore document shape apps/web reads (see `apps/web/src/@types/{collection,goal,transaction}/index.ts`), defined locally here rather than imported — `apps/functions` deliberately doesn't depend on apps/web or `@nest-egg/shared-types` for deploy-environment reasons already documented in `docs/decisions/0003-shared-types-scope.md`.

- [ ] **Step 1: Write the failing tests in `dataset.test.ts`**

Cover, each as its own `it`:
- Returns exactly 2 collections, named `"Viagens"` and `"Casa nova"`.
- Returns exactly 4 goals, of which exactly 1 has `status: "completed"`.
- The goal whose `collection.id` matches the `"Viagens"` collection, given `walletBaselineCentavos`, yields `(walletBaselineCentavos / goal.value) * 100` between 65 and 75.
- The goal whose `collection.id` matches `"Casa nova"` yields that same formula between 30 and 40.
- For every goal with a non-null `collection`, the referenced collection's `goals` array contains `{id: goal.id}`, and for every collection, every id in its `goals` array belongs to a goal whose `collection.id` is that collection's id (bidirectional integrity, both directions).
- At least 3 transactions have `hasRecurrence: true`.
- The sum of every transaction's `occurrenceLog` entries, signed (`+value` for `"credit"`, `-value` for `"debt"`), across the whole dataset, equals `walletBaselineCentavos` exactly.
- Every id across `collections`, `goals`, and `transactions` combined is unique (no two documents share an id).
- `buildDemoDataset` is deterministic for a fixed `now` (calling it twice with the same `Date` produces deep-equal output) — pins down that "now" is the only non-literal input, so a retake re-run of the seed script (same `now` instant) is reproducible.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/functions && npx vitest run src/scripts/demo-data/dataset.test.ts`
Expected: FAIL — `dataset.ts` doesn't exist yet.

- [ ] **Step 3: Implement `buildDemoDataset(now: Date): DemoDataset` in `dataset.ts`, with the types in `types.ts`**

Author the literal dataset per the spec's §1 example (wallet baseline R$4.250,00 / 425000 centavos; collections "Viagens" and "Casa nova"; goals "Curso online" (completed), one goal per collection at the progress bands above, one `waiting` goal with no collection; ~3 recurring transactions — salary/credit, rent/debt, a streaming subscription/debt, each with 2 past monthly `occurrenceLog` entries computed relative to `now`; ~10 one-off transactions spread across food/transport/leisure/shopping/gifts/health categories over the last ~60 days from `now`). Choose the one-off transactions' literal values so the total signed `occurrenceLog` sum across the whole dataset equals exactly 425000 — this is what Step 1's sum test pins down; adjust literals until it holds, there's no formula to derive them from.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/functions && npx vitest run src/scripts/demo-data/dataset.test.ts`
Expected: PASS, all cases green.

- [ ] **Step 5: Commit**

```bash
git add apps/functions/src/scripts/demo-data/types.ts apps/functions/src/scripts/demo-data/dataset.ts apps/functions/src/scripts/demo-data/dataset.test.ts
git commit -m "feat(functions): add demo dataset builder for promo video"
```

---

## Task 2: Email-safety guard

**Files:**
- Create: `apps/functions/src/scripts/demo-data/assert-demo-user-email.ts`
- Test: `apps/functions/src/scripts/demo-data/assert-demo-user-email.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (for Task 3 and Task 4): `assertDemoUserEmail(resolvedEmail: string, expectedEmail: string): void` — throws `Error` on any mismatch, including a case-only difference; returns normally (no value) when they match exactly.

- [ ] **Step 1: Write the failing tests in `assert-demo-user-email.test.ts`**

- Throws when `resolvedEmail` differs from `expectedEmail`.
- Throws when they differ only in case (exact match required, not case-insensitive).
- Does not throw when they match exactly.
- The thrown error's message includes both the resolved and expected email, so a failed run is debuggable from the log alone.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/functions && npx vitest run src/scripts/demo-data/assert-demo-user-email.test.ts`
Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Implement `assertDemoUserEmail(resolvedEmail: string, expectedEmail: string): void` in `assert-demo-user-email.ts`**

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/functions && npx vitest run src/scripts/demo-data/assert-demo-user-email.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/functions/src/scripts/demo-data/assert-demo-user-email.ts apps/functions/src/scripts/demo-data/assert-demo-user-email.test.ts
git commit -m "feat(functions): add email-match safety guard for demo-data scripts"
```

---

## Task 3: Reset script

**Files:**
- Create: `apps/functions/src/scripts/demo-data/reset-demo-user.ts`

**Interfaces:**
- Consumes: `assertDemoUserEmail` (Task 2).
- Produces: nothing other modules import — this is a leaf, manually-run script, same category as `backfill-wallet-ledger.ts` (no test file, per that file's own established precedent: Firestore I/O glue isn't unit tested in this codebase, only the pure logic around it is).

- [ ] **Step 1: Write `reset-demo-user.ts`**

Follow `backfill-wallet-ledger.ts`'s header-comment convention exactly: what it does, that it's idempotent, that it's not exported/deployed, the exact `npx ts-node` invocation, and the credentials precondition. Behavior: `initializeApp()`, resolve `const user = await getAuth().getUserByEmail("ferreira.vaz@live.com")`, call `assertDemoUserEmail(user.email ?? "", "ferreira.vaz@live.com")`, then for each of `transactions`, `goals`, `collections`, `walletLedger`, query every doc under `nest-egg-users/${user.uid}/<subcollection>` and batch-delete them (delete-by-query over the live subcollection contents, not a fixed id list — this is what makes a second reset run on an already-empty subcollection a safe no-op per the Review Focus item on re-running), then `update` the user doc's `wallet` to `0` and `walletUpdatedAt` to `new Date().toISOString()`. Log the per-subcollection count deleted.

- [ ] **Step 2: Add the `reset:demo` script to `apps/functions/package.json`**

```json
"reset:demo": "ts-node src/scripts/demo-data/reset-demo-user.ts"
```

- [ ] **Step 3: Commit**

```bash
git add apps/functions/src/scripts/demo-data/reset-demo-user.ts apps/functions/package.json
git commit -m "feat(functions): add reset script for the promo video demo user"
```

(Not run yet — see Task 5.)

---

## Task 4: Seed script

**Files:**
- Create: `apps/functions/src/scripts/demo-data/seed-demo-user.ts`

**Interfaces:**
- Consumes: `buildDemoDataset` (Task 1), `assertDemoUserEmail` (Task 2), the existing `reconcileWallet(userId: string, transactionId: string, occurrenceLog: OccurrenceLike[] | null): Promise<void>` from `apps/functions/src/wallet/reconcile-wallet.ts`.
- Produces: nothing other modules import — leaf script, same no-test convention as Task 3.

- [ ] **Step 1: Write `seed-demo-user.ts`**

Same header-comment convention as Task 3. Behavior: `initializeApp()`, resolve and verify the user exactly as Task 3 does, call `const dataset = buildDemoDataset(new Date())`, write every collection and every goal with `db.doc(\`nest-egg-users/${uid}/collections/${c.id}\`).set(c)` / `.../goals/${g.id}` (collections and goals have no write-order dependency on each other since the links are just id references, but write collections first for readability), write every transaction the same way under `.../transactions/${t.id}`, then call `await reconcileWallet(uid, t.id, t.occurrenceLog)` for each transaction in sequence (reuses the exact production code path, so the resulting wallet balance is never hand-set). After all writes, re-read the user doc and log the final `wallet` value so the operator can compare it against the expected 425000 centavos before opening the app.

- [ ] **Step 2: Add the `seed:demo` script to `apps/functions/package.json`**

```json
"seed:demo": "ts-node src/scripts/demo-data/seed-demo-user.ts"
```

- [ ] **Step 3: Commit**

```bash
git add apps/functions/src/scripts/demo-data/seed-demo-user.ts apps/functions/package.json
git commit -m "feat(functions): add seed script for the promo video demo user"
```

(Not run yet — see Task 5.)

---

## Task 5: Run against production and verify

This is the first task that touches real data — **confirm with the user immediately before running either command**, naming the exact email again, even though the plan was already approved; the hard gate from brainstorming applies to data-mutating execution, not just to writing the scripts.

- [ ] **Step 1: Confirm credentials are available**

Either `GOOGLE_APPLICATION_CREDENTIALS` points at a service account for the `nest-egg-ef466` project, or the Firebase MCP plugin is connected and can be used instead for the equivalent auth-lookup and Firestore writes. If neither is available, stop and tell the user what's missing rather than guessing.

- [ ] **Step 2: Run the reset script**

Run: `cd apps/functions && npm run reset:demo`
Expected output: per-subcollection deleted counts (0 on a first run against a fresh account, non-zero if demo data from a prior take already existed).

- [ ] **Step 3: Run the seed script**

Run: `cd apps/functions && npm run seed:demo`
Expected output: a final logged wallet value of exactly `425000`.

- [ ] **Step 4: Visually verify in the app**

Log in as `ferreira.vaz@live.com` (or ask the user to) and confirm: dashboard wallet balance shows R$4.250,00, the goals page shows 4 goals with the expected progress spread and one marked completed, "Viagens" and "Casa nova" collections exist with the right goal in each, and the profile summary cards (fixed earlier this session) show `1` completed goal, `3`+ recurring transactions, `4` total goals, `2` total collections.

- [ ] **Step 5: Report back**

Tell the user the account is seeded and ready for recording, or report exactly what didn't match so the dataset (Task 1) can be adjusted and re-seeded (Steps 2–3 are idempotent, safe to re-run as many times as needed).
