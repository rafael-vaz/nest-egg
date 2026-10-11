import { describe, expect, it } from "vitest";

import filterOccurrencesByRange from "./filter-occurrences-by-range";
import { ITransactionOccurrence } from "./get-transaction-occurrences";

const occurrences: ITransactionOccurrence[] = [
  { transactionId: "t1", date: "2026-01-10", value: 100, type: "credit" },
  { transactionId: "t2", date: "2026-01-31T23:00:00", value: 50, type: "debt" },
  { transactionId: "t3", date: "2026-02-01", value: 200, type: "credit" },
];

describe("filterOccurrencesByRange", () => {
  it("includes occurrences anywhere within the last day of the range", () => {
    const result = filterOccurrencesByRange(
      occurrences,
      "2026-01-01",
      "2026-01-31",
    );

    expect(result.map((occurrence) => occurrence.transactionId)).toEqual([
      "t1",
      "t2",
    ]);
  });

  it("excludes occurrences outside the range", () => {
    const result = filterOccurrencesByRange(
      occurrences,
      "2026-02-01",
      "2026-02-28",
    );

    expect(result.map((occurrence) => occurrence.transactionId)).toEqual([
      "t3",
    ]);
  });
});
