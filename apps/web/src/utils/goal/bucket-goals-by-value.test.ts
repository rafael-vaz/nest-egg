import { describe, expect, it } from "vitest";

import { IGoal } from "../../@types/goal";
import bucketGoalsByValue from "./bucket-goals-by-value";

function buildGoal(id: string, value: number): IGoal {
  return {
    id,
    name: `Goal ${id}`,
    value,
    status: "waiting",
    collection: null,
    description: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };
}

// goal.value is stored in cents (see parse-currency.ts), so a goal worth
// R$400 is persisted as 40_000, R$1.500 as 150_000, and so on.
describe("bucketGoalsByValue", () => {
  it("buckets each goal by its target value range, in reais", () => {
    const goals = [
      buildGoal("a", 40_000), // R$ 400
      buildGoal("b", 150_000), // R$ 1.500
      buildGoal("c", 300_000), // R$ 3.000
      buildGoal("d", 600_000), // R$ 6.000
    ];

    expect(bucketGoalsByValue(goals)).toEqual({
      "0 - 500": 1,
      "501 - 2.000": 1,
      "2.001 - 5.000": 1,
      "5.001 acima": 1,
    });
  });

  it("returns all-zero buckets for an empty goal list", () => {
    expect(bucketGoalsByValue([])).toEqual({
      "0 - 500": 0,
      "501 - 2.000": 0,
      "2.001 - 5.000": 0,
      "5.001 acima": 0,
    });
  });
});
