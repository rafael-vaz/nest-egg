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

  it("treats empty string, null and undefined as equivalent (no change)", () => {
    const before: Sample = { name: "Mercado", value: 100, recurrence: null };
    const after: Partial<Sample> = { name: "Mercado", value: 100 };

    interface WithDescription extends Record<string, unknown> {
      name: string;
      value: number;
      recurrence: { category: string } | null;
      description: string | null | undefined;
    }

    const beforeWithDescription: WithDescription = { ...before, description: "" };
    const afterWithDescription: Partial<WithDescription> = {
      ...after,
      description: null,
    };

    expect(
      buildChanges(beforeWithDescription, afterWithDescription, [
        "description",
      ]),
    ).toBeUndefined();
  });

  it("diffs object-valued fields by content regardless of key order", () => {
    const before: Sample = {
      name: "Mercado",
      value: 100,
      recurrence: { category: "month" },
    };
    const afterReordered = { category: "month" } as const;
    const after: Partial<Sample> = {
      // Same content as `before.recurrence`, different key insertion order —
      // simulates Firestore returning fields in a different order than the
      // client-built object.
      recurrence: JSON.parse(JSON.stringify(afterReordered)),
    };

    expect(buildChanges(before, after, ["recurrence"])).toBeUndefined();
  });

  it("coerces undefined to null so the result is always Firestore-safe", () => {
    interface WithOptional extends Record<string, unknown> {
      name: string;
      value: number;
      recurrence: { category: string } | null;
      wallet?: number;
    }

    const before: WithOptional = {
      name: "Mercado",
      value: 100,
      recurrence: null,
      wallet: undefined,
    };
    const after: Partial<WithOptional> = { wallet: 500 };

    expect(buildChanges(before, after, ["wallet"])).toEqual({
      wallet: { from: null, to: 500 },
    });
  });
});
