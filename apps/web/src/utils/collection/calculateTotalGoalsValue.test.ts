import { describe, expect, it } from "vitest";

import { IGoal } from "../../@types/goal";
import calculateTotalGoalsValue from "./calculateTotalGoalsValue";

function buildGoal(overrides: Partial<IGoal>): IGoal {
  return {
    id: "g1",
    name: "Goal",
    value: 0,
    status: "waiting",
    collection: null,
    description: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

describe("calculateTotalGoalsValue", () => {
  it("sums the value of every goal", () => {
    const goals = [
      buildGoal({ id: "g1", value: 10000 }),
      buildGoal({ id: "g2", value: 25000 }),
      buildGoal({ id: "g3", value: 5000 }),
    ];

    expect(calculateTotalGoalsValue(goals)).toBe(40000);
  });

  it("returns 0 for an empty list", () => {
    expect(calculateTotalGoalsValue([])).toBe(0);
  });
});
