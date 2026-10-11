import { describe, expect, it } from "vitest";

import { ITransaction } from "../../@types/transaction";
import getTransactionOccurrences from "./get-transaction-occurrences";

function buildTransaction(overrides: Partial<ITransaction>): ITransaction {
  return {
    id: "t1",
    name: "Transaction",
    value: 100,
    type: "credit",
    date: "2026-01-10",
    category: "other",
    description: null,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    recurrence: null,
    occurrenceLog: null,
    hasRecurrence: false,
    ...overrides,
  };
}

describe("getTransactionOccurrences", () => {
  it("uses the transaction's own date/value/type when it has no occurrence log", () => {
    const transaction = buildTransaction({
      id: "t1",
      value: 200,
      type: "debt",
      date: "2026-03-05",
    });

    expect(getTransactionOccurrences([transaction])).toEqual([
      { transactionId: "t1", date: "2026-03-05", value: 200, type: "debt" },
    ]);
  });

  it("uses each entry in the occurrence log when present, ignoring the transaction's own date/value", () => {
    const transaction = buildTransaction({
      id: "t2",
      value: 999,
      type: "credit",
      date: "2026-01-01",
      hasRecurrence: true,
      occurrenceLog: [
        { id: "o1", date: "2026-01-10", value: 50, type: "credit" },
        { id: "o2", date: "2026-02-10", value: 50, type: "credit" },
      ],
    });

    expect(getTransactionOccurrences([transaction])).toEqual([
      { transactionId: "t2", date: "2026-01-10", value: 50, type: "credit" },
      { transactionId: "t2", date: "2026-02-10", value: 50, type: "credit" },
    ]);
  });

  it("flattens occurrences across multiple transactions", () => {
    const transactions = [
      buildTransaction({ id: "t1", date: "2026-01-01" }),
      buildTransaction({ id: "t2", date: "2026-01-02" }),
    ];

    expect(getTransactionOccurrences(transactions)).toHaveLength(2);
  });

  it("skips a transaction with no date and no occurrence log", () => {
    const transaction = buildTransaction({ id: "t1", date: null });

    expect(getTransactionOccurrences([transaction])).toEqual([]);
  });
});
