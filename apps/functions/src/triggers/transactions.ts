import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import {getNextOccurrence} from "../recurrence/engine";
import {ITransaction, ITransactionOccurrenceLog} from "../recurrence/types";
import crypto from "crypto";

/**
 * Recalculates occurrence logs based on new recurrence settings
 * @param {ITransaction} tx - Transaction with new recurrence settings
 * @param {Date} now - Current date
 * @return {Object} Updated logs and next date
 */
function recalculateOccurrenceLogs(
  tx: ITransaction,
  now: Date,
): { logs: ITransactionOccurrenceLog[] | null; nextDate: string | null } {
  if (!tx.recurrence) {
    return {logs: null, nextDate: null};
  }

  // Normalize dates to start of day in local timezone
  const normalizedNow = new Date(now);
  normalizedNow.setHours(0, 0, 0, 0);

  // Parse startDate ensuring local timezone interpretation
  const startDateStr = tx.recurrence.startDate;
  let currentDate: Date;

  // If startDate is in ISO format, parse it as local date
  if (startDateStr.includes("T")) {
    currentDate = new Date(startDateStr);
  } else {
    // Parse YYYY-MM-DD as local date to avoid timezone issues
    const [year, month, day] = startDateStr.split("-").map(Number);
    currentDate = new Date(year, month - 1, day);
  }
  currentDate.setHours(0, 0, 0, 0);

  // Parse endDate the same way
  const endDate = tx.recurrence.endDate ? (() => {
    const endDateStr = tx.recurrence.endDate;
    if (!endDateStr) return null;
    let date: Date;
    if (endDateStr.includes("T")) {
      date = new Date(endDateStr);
    } else {
      const [year, month, day] = endDateStr.split("-").map(Number);
      date = new Date(year, month - 1, day);
    }
    date.setHours(0, 0, 0, 0);
    return date;
  })() : null;

  const newLogs: ITransactionOccurrenceLog[] = [];
  let nextFutureDate: Date | null = null;
  let safety = 0;

  // Generate all occurrences from startDate up to today
  while (currentDate <= normalizedNow && safety < 500) {
    // Check if within end date range
    if (endDate && currentDate > endDate) {
      break;
    }

    // Format date as YYYY-MM-DD in local timezone
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    // Create ISO string from local date components to avoid timezone conversion
    const currentDateStr = `${year}-${month}-${day}T03:00:00.000Z`;

    newLogs.push({
      id: crypto.randomUUID(),
      date: currentDateStr,
      value: tx.value,
      type: tx.type,
    });

    // Calculate next occurrence
    const next = getNextOccurrence({
      ...tx,
      date: currentDateStr,
    });

    if (!next) break;

    next.setHours(0, 0, 0, 0);

    // If next is in the future, save it and stop
    if (next > normalizedNow) {
      // Check if future date is within end date range
      if (!endDate || next <= endDate) {
        nextFutureDate = next;
      }
      break;
    }

    currentDate = next;
    safety++;
  }

  return {
    logs: newLogs.length > 0 ? newLogs : null,
    nextDate: nextFutureDate?.toISOString() || null,
  };
}

export const onTransactionWrite = onDocumentUpdated(
  "nest-egg-users/{userId}/transactions/{id}",
  async (e) => {
    const before = e.data?.before.data();
    const after = e.data?.after.data();

    if (!after) return;

    // Check if recurrence was added, removed, or changed
    const recurrenceChanged =
      JSON.stringify(before?.recurrence) !== JSON.stringify(after.recurrence);

    if (!recurrenceChanged) return;

    // If recurrence was added or changed, recalculate all occurrence logs
    const tx = after as ITransaction;
    const {logs, nextDate} = recalculateOccurrenceLogs(tx, new Date());

    // If removed, don't update date (keep the one from frontend)
    const updateData: {
      hasRecurrence: boolean;
      occurrenceLog: ITransactionOccurrenceLog[] | null;
      updatedAt: string;
      date?: string | null;
    } = {
      hasRecurrence: !!after.recurrence,
      occurrenceLog: logs,
      updatedAt: new Date().toISOString(),
    };

    // Only update date if recurrence exists
    if (after.recurrence) {
      updateData.date = nextDate;
    }

    await e.data?.after.ref.update(updateData);
  },
);
