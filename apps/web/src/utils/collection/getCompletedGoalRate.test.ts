import { describe, expect, it } from "vitest";

import { IGoal } from "../../@types/goal";
import getCompletedGoalRate from "./getCompletedGoalRate";

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

describe("getCompletedGoalRate", () => {
  it("returns the fraction of goals that are completed", () => {
    const goals = [
      buildGoal({ id: "g1", status: "completed" }),
      buildGoal({ id: "g2", status: "completed" }),
      buildGoal({ id: "g3", status: "waiting" }),
      buildGoal({ id: "g4", status: "active" }),
    ];

    expect(getCompletedGoalRate(goals)).toBe(0.5);
  });

  it("returns 0 when no goal is completed", () => {
    const goals = [buildGoal({ id: "g1", status: "waiting" })];

    expect(getCompletedGoalRate(goals)).toBe(0);
  });

  it("returns 0, not NaN, for an empty list", () => {
    expect(getCompletedGoalRate([])).toBe(0);
  });
});
