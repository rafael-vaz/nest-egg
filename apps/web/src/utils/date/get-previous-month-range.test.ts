import { describe, expect, it, vi } from "vitest";

import getPreviousMonthRange from "./get-previous-month-range";

describe("getPreviousMonthRange", () => {
  it("returns the first and last day of the month before the current one", () => {
    vi.setSystemTime(new Date(2026, 2, 15)); // March 15, 2026

    expect(getPreviousMonthRange()).toEqual({
      firstDay: "2026-02-01",
      lastDay: "2026-02-28",
    });

    vi.useRealTimers();
  });

  it("rolls back to December of the previous year when the current month is January", () => {
    vi.setSystemTime(new Date(2026, 0, 5)); // January 5, 2026

    expect(getPreviousMonthRange()).toEqual({
      firstDay: "2025-12-01",
      lastDay: "2025-12-31",
    });

    vi.useRealTimers();
  });
});
