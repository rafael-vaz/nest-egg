import { describe, expect, it } from "vitest";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import { ITransaction } from "../../@types/transaction";
import getProfileCardValues from "./get-profile-card-values";

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

function buildCollection(overrides: Partial<ICollection>): ICollection {
  return {
    id: "c1",
    name: "Collection",
    goals: null,
    description: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

function buildTransaction(overrides: Partial<ITransaction>): ITransaction {
  return {
    id: "t1",
    name: "Transaction",
    value: 0,
    type: "debt",
    date: "2026-01-01",
    category: "other",
    description: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    recurrence: null,
    occurrenceLog: null,
    hasRecurrence: false,
    ...overrides,
  };
}

describe("getProfileCardValues", () => {
  it("counts only goals with completed status", () => {
    const goals = [
      buildGoal({ id: "g1", status: "completed" }),
      buildGoal({ id: "g2", status: "completed" }),
      buildGoal({ id: "g3", status: "waiting" }),
    ];

    const result = getProfileCardValues({
      goals,
      collections: [],
      transactions: [],
    });

    expect(result["completed-goals"]).toBe(2);
  });

  it("counts only transactions with hasRecurrence set to true", () => {
    const transactions = [
      buildTransaction({ id: "t1", hasRecurrence: true }),
      buildTransaction({ id: "t2", hasRecurrence: false }),
      buildTransaction({ id: "t3", hasRecurrence: true }),
    ];

    const result = getProfileCardValues({
      goals: [],
      collections: [],
      transactions,
    });

    expect(result["recurrence-transactions"]).toBe(2);
  });

  it("counts the total number of goals regardless of status", () => {
    const goals = [
      buildGoal({ id: "g1", status: "completed" }),
      buildGoal({ id: "g2", status: "active" }),
      buildGoal({ id: "g3", status: "waiting" }),
    ];

    const result = getProfileCardValues({
      goals,
      collections: [],
      transactions: [],
    });

    expect(result["amount-goals"]).toBe(3);
  });

  it("counts the total number of collections", () => {
    const collections = [
      buildCollection({ id: "c1" }),
      buildCollection({ id: "c2" }),
    ];

    const result = getProfileCardValues({
      goals: [],
      collections,
      transactions: [],
    });

    expect(result["amount-collections"]).toBe(2);
  });

  it("returns 0 for every key when there is no data", () => {
    const result = getProfileCardValues({
      goals: [],
      collections: [],
      transactions: [],
    });

    expect(result).toEqual({
      "completed-goals": 0,
      "recurrence-transactions": 0,
      "amount-goals": 0,
      "amount-collections": 0,
    });
  });
});
