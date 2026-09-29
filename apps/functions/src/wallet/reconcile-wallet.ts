import {getFirestore, FieldValue} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {TransactionType} from "../recurrence/types";

interface OccurrenceLike {
  date: string;
  value: number;
  type: TransactionType;
}

/**
 * Computes the wallet delta needed to move from what was already applied
 * (`existing`) to what the current occurrence log demands (`desired`).
 * Pure function, no Firestore dependency — the seam for future unit tests.
 * @param {Record<string, number>} existing - Signed value already applied,
 *   keyed by occurrence date
 * @param {OccurrenceLike[] | null} occurrenceLog - Current occurrence log
 * @return {Object} The signed delta to apply and the new desired ledger state
 */
export function computeWalletDelta(
  existing: Record<string, number>,
  occurrenceLog: OccurrenceLike[] | null,
): { delta: number; desired: Record<string, number> } {
  const desired: Record<string, number> = {};
  for (const occ of occurrenceLog ?? []) {
    desired[occ.date] = occ.type === "credit" ? occ.value : -occ.value;
  }

  const keys = new Set([...Object.keys(existing), ...Object.keys(desired)]);
  let delta = 0;
  for (const key of keys) {
    delta += (desired[key] ?? 0) - (existing[key] ?? 0);
  }

  return {delta, desired};
}

/**
 * Reconciles a user's wallet balance against a transaction's occurrence log.
 *
 * Keyed by occurrence *date* (stable across recalculations) rather than the
 * occurrence log entry's random id (regenerated every time the log is
 * rebuilt), and driven by the log's final desired state rather than
 * incremental events, so it is safe to call redundantly (cron, the manual
 * callable, and the recurrence-change trigger can all call this for the same
 * transaction without double-counting).
 * @param {string} userId - Owning user id
 * @param {string} transactionId - Transaction id
 * @param {OccurrenceLike[] | null} occurrenceLog - Current occurrence log
 * @return {Promise<void>} Resolves once the wallet and ledger are reconciled
 */
export async function reconcileWallet(
  userId: string,
  transactionId: string,
  occurrenceLog: OccurrenceLike[] | null,
): Promise<void> {
  const db = getFirestore();
  const userRef = db.doc(`nest-egg-users/${userId}`);
  const ledgerRef = db.doc(
    `nest-egg-users/${userId}/walletLedger/${transactionId}`,
  );

  const {delta, desired} = await db.runTransaction(async (tx) => {
    const ledgerSnap = await tx.get(ledgerRef);
    const existing = ledgerSnap.exists ?
      ((ledgerSnap.data()?.appliedOccurrences as Record<string, number>) ??
        {}) :
      {};

    const result = computeWalletDelta(existing, occurrenceLog);
    const nowIso = new Date().toISOString();

    if (result.delta !== 0) {
      tx.update(userRef, {
        wallet: FieldValue.increment(result.delta),
        walletUpdatedAt: nowIso,
      });
    }

    if (Object.keys(result.desired).length === 0) {
      tx.delete(ledgerRef);
    } else {
      const totalApplied = Object.values(result.desired)
        .reduce((sum, v) => sum + v, 0);
      tx.set(ledgerRef, {
        transactionId,
        appliedOccurrences: result.desired,
        totalApplied,
        updatedAt: nowIso,
      });
    }

    return result;
  });

  logger.info("wallet reconciled", {
    userId,
    transactionId,
    delta,
    occurrenceCount: Object.keys(desired).length,
  });
}
