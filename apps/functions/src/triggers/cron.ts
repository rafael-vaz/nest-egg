import {onSchedule} from "firebase-functions/v2/scheduler";
import {onCall} from "firebase-functions/v2/https";
import {getFirestore} from "firebase-admin/firestore";
import {getNextOccurrence} from "../recurrence/engine";
import crypto from "crypto";
import {ITransaction} from "../recurrence/types";

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

  if (!tx.date || !tx.recurrence) return;

  // Normalize dates to start of day to avoid time discrepancies
  const normalizedNow = new Date(now);
  normalizedNow.setHours(0, 0, 0, 0);

  let currentDate = new Date(tx.date);
  currentDate.setHours(0, 0, 0, 0);

  const existingLog = tx.occurrenceLog || [];
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
    await doc.ref.update({
      date: nextFutureDate?.toISOString() || null,
      occurrenceLog: [...existingLog, ...newOccurrences],
      updatedAt: new Date().toISOString(),
    });
  } else if (nextFutureDate) {
    // Only update the next date without new occurrences
    await doc.ref.update({
      date: nextFutureDate.toISOString(),
      updatedAt: new Date().toISOString(),
    });
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

    for (const doc of recurringSnap.docs) {
      await processTransactionRecurrence(doc, now);
    }

    // Process single-occurrence transactions
    const singleSnap = await db
      .collectionGroup("transactions")
      .where("hasRecurrence", "==", false)
      .get();

    for (const doc of singleSnap.docs) {
      await processSingleOccurrence(doc, now);
    }
  },
);

// Manual trigger - call from your app after creating/updating a transaction
export const processTransactionRecurrenceManual = onCall(
  {
    region: "us-central1",
  },
  async (request) => {
    const {userId, transactionId} = request.data;

    if (!userId || !transactionId) {
      throw new Error("Missing required parameters: userId, transactionId");
    }

    const db = getFirestore();
    const doc = await db
      .doc(`nest-egg-users/${userId}/transactions/${transactionId}`)
      .get();

    if (!doc.exists) {
      throw new Error("Transaction not found");
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
