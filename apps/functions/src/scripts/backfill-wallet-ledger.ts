/**
 * One-off backfill: seeds the wallet ledger for every transaction that
 * already existed before wallet reconciliation was introduced, applying
 * each transaction's already-materialized occurrence log to its owner's
 * wallet exactly once.
 *
 * Idempotent — reuses `reconcileWallet`, the same function every trigger
 * calls going forward, so running this more than once is harmless (the
 * second run finds the ledger already matches the occurrence log and
 * applies a zero delta).
 *
 * NOT exported from `src/index.ts` and NOT deployed as a Cloud Function.
 * Run manually, once, against the real project:
 *
 *   npx ts-node src/scripts/backfill-wallet-ledger.ts
 *
 * with `GOOGLE_APPLICATION_CREDENTIALS` pointing at a service account for
 * the target Firebase project (or any other way of providing
 * firebase-admin with default credentials for that project). This script
 * was written but deliberately never executed as part of this change —
 * it touches live production data and requires credentials this
 * environment does not have.
 */
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {reconcileWallet} from "../wallet/reconcile-wallet";
import {ITransaction} from "../recurrence/types";

/**
 * Applies every existing transaction's occurrence log to its owner's wallet.
 * @return {Promise<void>} Resolves once every transaction has been reconciled
 */
async function backfillWalletLedger() {
  initializeApp();
  const db = getFirestore();

  const snapshot = await db.collectionGroup("transactions").get();
  console.log(`Backfilling wallet ledger for ${snapshot.size} transactions`);

  for (const doc of snapshot.docs) {
    const userId = doc.ref.parent.parent?.id;
    if (!userId) continue;

    const tx = doc.data() as ITransaction;
    await reconcileWallet(userId, doc.id, tx.occurrenceLog ?? null);
  }

  console.log("Backfill complete");
}

backfillWalletLedger().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});
