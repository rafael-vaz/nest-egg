import {addDays, addMonths, addYears} from "date-fns";
import {ITransaction} from "./types";

/**
 * Converts weekDays to number[] (0–6)
 * @param {(string | number)[] | null} days - Array of weekdays
 * @return {number[] | null} Normalized array of weekday numbers (0-6)
 */
function normalizeWeekDays(days: (string | number)[] | null): number[] | null {
  if (!days) return null;

  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  return days
    .map((d) => {
      if (typeof d === "number") return d;
      return map[String(d).toLowerCase()];
    })
    .filter((d) => d !== undefined);
}

/**
 * Gets the next occurrence date for a recurring transaction
 * @param {ITransaction} tx - The transaction object
 * @return {Date | null} The next occurrence date or null
 */
export function getNextOccurrence(tx: ITransaction): Date | null {
  if (!tx.recurrence || !tx.recurrence.frequency) return null;

  const baseDate = tx.date ? new Date(tx.date) :
    new Date(tx.recurrence.startDate);

  const {rate, category, weekDays} = tx.recurrence.frequency;

  const normalizedWeekDays = normalizeWeekDays(weekDays);

  switch (category) {
  case "day":
    return addDays(baseDate, rate);

  case "week":
    return getNextWeekDate(baseDate, rate, normalizedWeekDays);

  case "month":
    return addMonths(baseDate, rate);

  case "year":
    return addYears(baseDate, rate);

  default:
    return null;
  }
}

/**
 * Gets the next valid weekday occurrence
 * @param {Date} base - The base date
 * @param {number} rate - The recurrence rate
 * @param {number[] | null} days - Valid weekdays
 * @return {Date} The next valid weekday date
 */
function getNextWeekDate(base: Date, rate: number, days: number[] | null) {
  // if no specific weekdays → behave like every N weeks
  if (!days || days.length === 0) {
    return addDays(base, 7 * rate);
  }

  // Start from the next day after base to find the next occurrence
  let d = addDays(base, 1);

  // find next valid weekday
  while (!days.includes(d.getDay())) {
    d = addDays(d, 1);
  }

  return d;
}
