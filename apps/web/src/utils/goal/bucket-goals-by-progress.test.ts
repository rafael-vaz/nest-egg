import { describe, expect, it } from "vitest";

import { IGoal } from "../../@types/goal";
import bucketGoalsByProgress from "./bucket-goals-by-progress";

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

describe("bucketGoalsByProgress", () => {
  it("buckets each goal by its wallet-based progress percentage", () => {
    const goals = [
      buildGoal("a", 1000), // wallet 100 -> 10% -> 0-25
      buildGoal("b", 250), // wallet 100 -> 40% -> 25-50
      buildGoal("c", 150), // wallet 100 -> 66.6% -> 50-75
      buildGoal("d", 100), // wallet 100 -> 100% -> 75-100
    ];

    expect(bucketGoalsByProgress(goals, 100)).toEqual({
      "0 - 25%": 1,
      "25 - 50%": 1,
      "50 - 75%": 1,
      "75 - 100%": 1,
    });
  });

  it("returns all-zero buckets for an empty goal list", () => {
    expect(bucketGoalsByProgress([], 100)).toEqual({
      "0 - 25%": 0,
      "25 - 50%": 0,
      "50 - 75%": 0,
      "75 - 100%": 0,
    });
  });
});
