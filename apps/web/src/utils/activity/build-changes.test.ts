import { describe, expect, it } from "vitest";

import { buildChanges } from "./build-changes";

interface Sample extends Record<string, unknown> {
  name: string;
  value: number;
  recurrence: { category: string } | null;
}

describe("buildChanges", () => {
  it("returns undefined when no tracked key changed", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { name: "Mercado", value: 100 };

    expect(buildChanges(before, after, ["name", "value"])).toBeUndefined();
  });

  it("returns a single-entry map when one field changed", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { value: 150 };

    expect(buildChanges(before, after, ["name", "value"])).toEqual({
      value: { from: 100, to: 150 },
    });
  });

  it("returns multiple entries when multiple fields changed", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { name: "Mercado 2", value: 150 };

    expect(buildChanges(before, after, ["name", "value"])).toEqual({
      name: { from: "Mercado", to: "Mercado 2" },
      value: { from: 100, to: 150 },
    });
  });

  it("diffs object-valued fields by content, not reference", () => {
    const before: Sample = {
      name: "Mercado",
      value: 100,
      recurrence: { category: "month" },
    };
    const after: Partial<Sample> = {
      recurrence: { category: "week" },
    };

    expect(buildChanges(before, after, ["recurrence"])).toEqual({
      recurrence: {
        from: { category: "month" },
        to: { category: "week" },
      },
    });
  });

  it("ignores keys not present in the partial update", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { value: 150 };

    const result = buildChanges(before, after, ["name", "value"]);
    expect(result).not.toHaveProperty("name");
  });
});
