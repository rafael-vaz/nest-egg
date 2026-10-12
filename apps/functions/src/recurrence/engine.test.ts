import {describe, expect, it} from "vitest";

import {getNextOccurrence} from "./engine";
import {ITransaction} from "./types";

// Date-only strings ("2026-01-05") parse as UTC, but getNextOccurrence reads
// the weekday with the local-time .getDay(); a plain date-only string would
// make this test's outcome depend on the machine's timezone offset. A
// datetime string with no "Z"/offset suffix parses as local time instead, so
// every date below stays anchored to the calendar day it names.
/**
 * Builds a minimal ITransaction fixture for tests
 * @param {Partial<ITransaction>} overrides - Fields to override
 * @return {ITransaction} The built transaction
 */
function buildTransaction(overrides: Partial<ITransaction>): ITransaction {
  return {
    id: "t1",
    date: "2026-01-05T00:00:00",
    value: 1000,
    type: "debt",
    recurrence: null,
    occurrenceLog: null,
    ...overrides,
  };
}

describe("getNextOccurrence", () => {
  it("returns null when there is no recurrence", () => {
    const tx = buildTransaction({recurrence: null});

    expect(getNextOccurrence(tx)).toBeNull();
  });

  it("returns null when the recurrence has no frequency", () => {
    const tx = buildTransaction({
      recurrence: {
        startDate: "2026-01-01T00:00:00",
        endDate: null,
        frequency: null,
      },
    });

    expect(getNextOccurrence(tx)).toBeNull();
  });

  it("advances by one day for a daily recurrence with rate 1", () => {
    const tx = buildTransaction({
      date: "2026-01-05T00:00:00",
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {rate: 1, category: "day", weekDays: null, order: null},
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2026-01-06T00:00:00"));
  });

  it("advances by the configured number of days", () => {
    const tx = buildTransaction({
      date: "2026-01-05T00:00:00",
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {rate: 3, category: "day", weekDays: null, order: null},
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2026-01-08T00:00:00"));
  });

  it("advances by N weeks when no specific weekday is configured", () => {
    const tx = buildTransaction({
      date: "2026-01-05T00:00:00",
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {rate: 2, category: "week", weekDays: null, order: null},
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2026-01-19T00:00:00"));
  });

  it("finds the next configured weekday for a weekly recurrence", () => {
    // 2026-01-05 is a Monday; the next Wednesday is 2026-01-07
    const tx = buildTransaction({
      date: "2026-01-05T00:00:00",
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {
          rate: 1,
          category: "week",
          weekDays: [3], // Wednesday
          order: null,
        },
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2026-01-07T00:00:00"));
  });

  it("advances by the configured number of months", () => {
    const tx = buildTransaction({
      date: "2026-01-05T00:00:00",
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {rate: 1, category: "month", weekDays: null, order: null},
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2026-02-05T00:00:00"));
  });

  it("advances by the configured number of years", () => {
    const tx = buildTransaction({
      date: "2026-01-05T00:00:00",
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {rate: 1, category: "year", weekDays: null, order: null},
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2027-01-05T00:00:00"));
  });

  it("falls back to the recurrence start date with no transaction date", () => {
    const tx = buildTransaction({
      date: null,
      recurrence: {
        startDate: "2026-01-05T00:00:00",
        endDate: null,
        frequency: {rate: 1, category: "day", weekDays: null, order: null},
      },
    });

    expect(getNextOccurrence(tx)).toEqual(new Date("2026-01-06T00:00:00"));
  });
});
