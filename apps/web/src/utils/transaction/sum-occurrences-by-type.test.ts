import { describe, expect, it } from "vitest";

import { ITransactionOccurrence } from "./get-transaction-occurrences";
import sumOccurrencesByType from "./sum-occurrences-by-type";

const occurrences: ITransactionOccurrence[] = [
  { transactionId: "t1", date: "2026-01-10", value: 100, type: "credit" },
  { transactionId: "t2", date: "2026-01-15", value: 50, type: "debt" },
  { transactionId: "t3", date: "2026-02-01", value: 200, type: "credit" },
  { transactionId: "t4", date: "2026-01-20", value: 30, type: "credit" },
];

describe("sumOccurrencesByType", () => {
  it("sums only occurrences of the given type within the date range", () => {
    expect(
      sumOccurrencesByType(occurrences, "credit", "2026-01-01", "2026-01-31"),
    ).toBe(130);
  });

  it("excludes occurrences outside the date range", () => {
    expect(
      sumOccurrencesByType(occurrences, "credit", "2026-02-01", "2026-02-28"),
    ).toBe(200);
  });

  it("returns 0 when nothing matches", () => {
    expect(
      sumOccurrencesByType(occurrences, "debt", "2026-03-01", "2026-03-31"),
    ).toBe(0);
  });
});
