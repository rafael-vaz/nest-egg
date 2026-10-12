import { describe, expect, it } from "vitest";

import { ITransactionOccurrenceLog } from "../../@types/transaction";
import getLatestOccurrenceDate from "./get-last-occurrence-date";

function buildLog(
  overrides: Partial<ITransactionOccurrenceLog>,
): ITransactionOccurrenceLog {
  return {
    id: "o1",
    date: "2026-01-01",
    value: 100,
    type: "credit",
    ...overrides,
  };
}

describe("getLatestOccurrenceDate", () => {
  it("returns the only date when there is a single occurrence", () => {
    const logs = [buildLog({ date: "2026-03-10" })];

    expect(getLatestOccurrenceDate(logs)).toEqual(new Date("2026-03-10"));
  });

  it("returns the latest date regardless of input order", () => {
    const logs = [
      buildLog({ id: "o1", date: "2026-01-15" }),
      buildLog({ id: "o2", date: "2026-05-01" }),
      buildLog({ id: "o3", date: "2026-03-20" }),
    ];

    expect(getLatestOccurrenceDate(logs)).toEqual(new Date("2026-05-01"));
  });
});
