import {onSchedule} from "firebase-functions/v2/scheduler";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {getNextOccurrence} from "../recurrence/engine";
import crypto from "crypto";
import {ITransaction} from "../recurrence/types";
import {reconcileWallet} from "../wallet/reconcile-wallet";

/**
 * Process a single-occurrence (non-recurring) transaction
 * @param {FirebaseFirestore.DocumentSnapshot} doc - Transaction document
 * @param {Date} now - Current date
 */
async function processSingleOccurrence(
  doc: FirebaseFirestore.DocumentSnapshot,
  now: Date,
) {
  const tx = doc.data() as ITransaction;
  const userId = doc.ref.parent.parent?.id;

  try {
    if (!tx.date || tx.recurrence) return;

    // Normalize dates to start of day
    const normalizedNow = new Date(now);
    normalizedNow.setHours(0, 0, 0, 0);

    const txDate = new Date(tx.date);
    txDate.setHours(0, 0, 0, 0);

    // Only process if the transaction date has arrived or passed
    if (txDate > normalizedNow) return;

    const existingLog = tx.occurrenceLog || [];

    // Check if already logged (should only have one log for single occurrence)
    if (existingLog.length > 0) return;

    // Generate single occurrence log
    const singleLog = {
      id: crypto.randomUUID(),
      date: tx.date,
      value: tx.value,
      type: tx.type,
    };

    await doc.ref.update({
      occurrenceLog: [singleLog],
      updatedAt: new Date().toISOString(),
    });

    if (userId) {
      await reconcileWallet(userId, doc.id, [singleLog]);
    }
  } catch (error) {
    logger.error("failed to process single occurrence", {
      userId,
      transactionId: doc.id,
      error,
    });
    throw error;
  }
}

/**
 * Process a single transaction's recurrences
 * @param {FirebaseFirestore.DocumentSnapshot} doc - Transaction document
 * @param {Date} now - Current date
 */
async function processTransactionRecurrence(
  doc: FirebaseFirestore.DocumentSnapshot,
  now: Date,
) {
  const tx = doc.data() as ITransaction;
  const userId = doc.ref.parent.parent?.id;

  try {
    if (!tx.date || !tx.recurrence) return;

    // Normalize dates to start of day to avoid time discrepancies
    const normalizedNow = new Date(now);
    normalizedNow.setHours(0, 0, 0, 0);

    const existingLog = tx.occurrenceLog || [];

    // With no recorded history, rebuild from the recurrence's true start
    // date instead of the `tx.date` pointer — otherwise a log that got reset
    // (e.g. by an unrelated edit resetting occurrenceLog client-side) would
    // only pick up occurrences going forward and reconcileWallet would read
    // that truncated log as "the earlier ones no longer happened".
    let currentDate = existingLog.length > 0 ?
      new Date(tx.date) :
      new Date(tx.recurrence.startDate);
    currentDate.setHours(0, 0, 0, 0);

    const newOccurrences: typeof existingLog = [];
    let nextFutureDate: Date | null = null;

    let safety = 0; // prevents infinite loops

    // Include occurrences from the start date up to and including today
    while (currentDate <= normalizedNow && safety < 500) {
      const currentDateStr = currentDate.toISOString();

      // Check if this occurrence is already in the log
      const alreadyLogged = existingLog.some(
        (log) => log.date === currentDateStr,
      );

      // Only register if not already logged
      if (!alreadyLogged) {
        newOccurrences.push({
          id: crypto.randomUUID(),
          date: currentDateStr,
          value: tx.value,
          type: tx.type,
        });
      }

      // Calculate the next occurrence
      const next = getNextOccurrence({
        ...tx,
        date: currentDate.toISOString(),
      });

      if (!next) break;

      // Normalize the next date
      next.setHours(0, 0, 0, 0);

      // If the next is in the future, save it and stop
      if (next > normalizedNow) {
        nextFutureDate = next;
        break;
      }

      currentDate = next;
      safety++;
    }

    // Only update if there are new occurrences or a future date
    if (newOccurrences.length > 0) {
      const fullLog = [...existingLog, ...newOccurrences];
      await doc.ref.update({
        date: nextFutureDate?.toISOString() || null,
        occurrenceLog: fullLog,
        updatedAt: new Date().toISOString(),
      });

      if (userId) {
        await reconcileWallet(userId, doc.id, fullLog);
      }
    } else if (nextFutureDate) {
      // Only update the next date without new occurrences
      await doc.ref.update({
        date: nextFutureDate.toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error("failed to process transaction recurrence", {
      userId,
      transactionId: doc.id,
      error,
    });
    throw error;
  }
}

export const processRecurrences = onSchedule(
  {
    schedule: "every day 00:05",
    timeZone: "America/Sao_Paulo",
    region: "us-central1",
    memory: "256MiB",
  },
  async () => {
    const db = getFirestore();
    const now = new Date();

    // Process recurring transactions
    const recurringSnap = await db
      .collectionGroup("transactions")
      .where("hasRecurrence", "==", true)
      .get();

    logger.info("processing recurring transactions", {
      count: recurringSnap.size,
    });

    for (const doc of recurringSnap.docs) {
      try {
        await processTransactionRecurrence(doc, now);
      } catch {
        // Already logged with context inside processTransactionRecurrence;
        // one bad transaction must not stop the rest of the batch.
      }
    }

    // Process single-occurrence transactions
    const singleSnap = await db
      .collectionGroup("transactions")
      .where("hasRecurrence", "==", false)
      .get();

    logger.info("processing single-occurrence transactions", {
      count: singleSnap.size,
    });

    for (const doc of singleSnap.docs) {
      try {
        await processSingleOccurrence(doc, now);
      } catch {
        // Already logged with context inside processSingleOccurrence;
        // one bad transaction must not stop the rest of the batch.
      }
    }
  },
);

// Manual trigger - call from your app after creating/updating a transaction
export const processTransactionRecurrenceManual = onCall(
  {
    region: "us-central1",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in");
    }

    const userId = request.auth.uid;
    const {transactionId} = request.data;

    if (!transactionId || typeof transactionId !== "string") {
      throw new HttpsError("invalid-argument", "Missing transactionId");
    }

    const db = getFirestore();
    const doc = await db
      .doc(`nest-egg-users/${userId}/transactions/${transactionId}`)
      .get();

    if (!doc.exists) {
      throw new HttpsError("not-found", "Transaction not found");
    }

    const tx = doc.data() as ITransaction;

    // Process based on transaction type
    if (tx.recurrence) {
      await processTransactionRecurrence(doc, new Date());
    } else {
      await processSingleOccurrence(doc, new Date());
    }

    return {success: true, message: "Transaction processed successfully"};
  },
);
