import { describe, expect, it, vi } from "vitest";

import getLastMonthsRanges from "./get-last-months-ranges";

describe("getLastMonthsRanges", () => {
  it("returns the given number of months, oldest first, ending in the current month", () => {
    vi.setSystemTime(new Date(2026, 2, 15)); // March 15, 2026

    const ranges = getLastMonthsRanges(3);

    expect(ranges).toEqual([
      { label: "jan.", firstDay: "2026-01-01", lastDay: "2026-01-31" },
      { label: "fev.", firstDay: "2026-02-01", lastDay: "2026-02-28" },
      { label: "mar.", firstDay: "2026-03-01", lastDay: "2026-03-31" },
    ]);

    vi.useRealTimers();
  });

  it("rolls back across a year boundary", () => {
    vi.setSystemTime(new Date(2026, 1, 1)); // February 1, 2026

    const ranges = getLastMonthsRanges(3);

    expect(ranges.map((range) => range.label)).toEqual([
      "dez.",
      "jan.",
      "fev.",
    ]);
    expect(ranges[0].firstDay).toBe("2025-12-01");

    vi.useRealTimers();
  });
});
