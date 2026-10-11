import { describe, expect, it } from "vitest";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import findGreatestProgressCollection from "./find-greatest-progress-collection";

function buildGoal(
  id: string,
  value: number,
  status: IGoal["status"],
): IGoal {
  return {
    id,
    name: `Goal ${id}`,
    value,
    status,
    collection: null,
    description: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };
}

function buildCollection(
  id: string,
  goalIds: string[],
): ICollection {
  return {
    id,
    name: `Collection ${id}`,
    goals: goalIds.map((goalId) => ({ id: goalId })),
    description: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };
}

describe("findGreatestProgressCollection", () => {
  it("picks the collection with the highest completed-goal ratio", () => {
    const goals = [
      buildGoal("a", 1000, "completed"),
      buildGoal("b", 1000, "waiting"),
      buildGoal("c", 1000, "completed"),
      buildGoal("d", 1000, "completed"),
    ];
    const collections = [
      buildCollection("low", ["a", "b"]), // 1/2 = 50%
      buildCollection("high", ["c", "d"]), // 2/2 = 100%
    ];

    const result = findGreatestProgressCollection(collections, goals, 0);

    expect(result?.collection.id).toBe("high");
    expect(result?.completedCount).toBe(2);
    expect(result?.totalCount).toBe(2);
  });

  it("sums the remaining amount needed across the collection's incomplete goals", () => {
    const goals = [
      buildGoal("a", 1000, "waiting"),
      buildGoal("b", 500, "waiting"),
      buildGoal("c", 1000, "completed"),
    ];
    const collections = [buildCollection("only", ["a", "b", "c"])];

    const result = findGreatestProgressCollection(collections, goals, 300);

    // a: 1000-300=700, b: 500-300=200, c: completed, excluded
    expect(result?.remaining).toBe(900);
  });

  it("never lets remaining go negative for a goal already covered by the wallet", () => {
    const goals = [buildGoal("a", 100, "waiting")];
    const collections = [buildCollection("only", ["a"])];

    const result = findGreatestProgressCollection(collections, goals, 500);

    expect(result?.remaining).toBe(0);
  });

  it("ignores collections with no goals", () => {
    const goals = [buildGoal("a", 1000, "completed")];
    const collections = [
      buildCollection("empty", []),
      buildCollection("has-goals", ["a"]),
    ];

    const result = findGreatestProgressCollection(collections, goals, 0);

    expect(result?.collection.id).toBe("has-goals");
  });

  it("returns null when there are no collections with goals", () => {
    expect(findGreatestProgressCollection([], [], 0)).toBeNull();
  });
});
