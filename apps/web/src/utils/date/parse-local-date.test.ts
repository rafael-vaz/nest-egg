import { describe, expect, it } from "vitest";

import parseLocalDate from "./parse-local-date";

describe("parseLocalDate", () => {
  it("parses a plain YYYY-MM-DD string as local midnight, not UTC", () => {
    const result = parseLocalDate("2026-01-31");

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(31);
    expect(result.getHours()).toBe(0);
  });

  it("returns a Date instance unchanged", () => {
    const date = new Date(2026, 0, 31, 23, 0, 0);

    expect(parseLocalDate(date)).toBe(date);
  });

  it("delegates to the native Date constructor for full timestamps", () => {
    const result = parseLocalDate("2026-01-31T23:00:00");

    expect(result.getHours()).toBe(23);
  });
});
