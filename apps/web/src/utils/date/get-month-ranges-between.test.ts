import { describe, expect, it } from "vitest";

import getMonthRangesBetween from "./get-month-ranges-between";

describe("getMonthRangesBetween", () => {
  it("returns one range per month between start and end, inclusive", () => {
    const ranges = getMonthRangesBetween("2026-01-15", "2026-03-02");

    expect(ranges).toEqual([
      { label: "jan.", firstDay: "2026-01-01", lastDay: "2026-01-31" },
      { label: "fev.", firstDay: "2026-02-01", lastDay: "2026-02-28" },
      { label: "mar.", firstDay: "2026-03-01", lastDay: "2026-03-31" },
    ]);
  });

  it("returns a single range when start and end fall in the same month", () => {
    const ranges = getMonthRangesBetween("2026-05-01", "2026-05-20");

    expect(ranges).toEqual([
      { label: "mai.", firstDay: "2026-05-01", lastDay: "2026-05-31" },
    ]);
  });

  it("rolls across a year boundary", () => {
    const ranges = getMonthRangesBetween("2025-12-10", "2026-01-05");

    expect(ranges.map((range) => range.label)).toEqual(["dez.", "jan."]);
    expect(ranges[0].firstDay).toBe("2025-12-01");
    expect(ranges[1].lastDay).toBe("2026-01-31");
  });

  it("swaps the bounds when start is after end", () => {
    const ranges = getMonthRangesBetween("2026-03-02", "2026-01-15");

    expect(ranges.map((range) => range.label)).toEqual(["jan.", "fev.", "mar."]);
  });
});
