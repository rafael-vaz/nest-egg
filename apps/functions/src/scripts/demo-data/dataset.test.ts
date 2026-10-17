import {describe, expect, it} from "vitest";
import {buildDemoDataset} from "./dataset";

const NOW = new Date("2026-10-17T12:00:00.000Z");

describe("buildDemoDataset", () => {
  it("returns exactly the Viagens and Casa nova collections", () => {
    const {collections} = buildDemoDataset(NOW);

    expect(collections).toHaveLength(2);
    expect(collections.map((c) => c.name).sort()).toEqual([
      "Casa nova",
      "Viagens",
    ]);
  });

  it("returns exactly 4 goals, exactly one completed", () => {
    const {goals} = buildDemoDataset(NOW);

    expect(goals).toHaveLength(4);
    expect(goals.filter((g) => g.status === "completed")).toHaveLength(1);
  });

  it("the Viagens goal lands between 65% and 75% progress", () => {
    const {goals, collections, walletBaselineCentavos} =
      buildDemoDataset(NOW);
    const viagens = collections.find((c) => c.name === "Viagens")!;
    const goal = goals.find((g) => g.collection?.id === viagens.id)!;

    const progress = (walletBaselineCentavos / goal.value) * 100;

    expect(progress).toBeGreaterThanOrEqual(65);
    expect(progress).toBeLessThanOrEqual(75);
  });

  it("the Casa nova goal lands between 30% and 40% progress", () => {
    const {goals, collections, walletBaselineCentavos} =
      buildDemoDataset(NOW);
    const casaNova = collections.find((c) => c.name === "Casa nova")!;
    const goal = goals.find((g) => g.collection?.id === casaNova.id)!;

    const progress = (walletBaselineCentavos / goal.value) * 100;

    expect(progress).toBeGreaterThanOrEqual(30);
    expect(progress).toBeLessThanOrEqual(40);
  });

  it("links every goal's collection back to that goal, both directions", () => {
    const {goals, collections} = buildDemoDataset(NOW);

    for (const goal of goals) {
      if (!goal.collection) continue;
      const collection = collections.find((c) => c.id === goal.collection!.id);
      expect(collection?.goals ?? []).toContainEqual({id: goal.id});
    }

    for (const collection of collections) {
      for (const goalRef of collection.goals ?? []) {
        const goal = goals.find((g) => g.id === goalRef.id);
        expect(goal?.collection?.id).toBe(collection.id);
      }
    }
  });

  it("has at least 3 recurring transactions", () => {
    const {transactions} = buildDemoDataset(NOW);

    expect(
      transactions.filter((t) => t.hasRecurrence).length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("the signed occurrenceLog total across all transactions equals the wallet baseline", () => {
    const {transactions, walletBaselineCentavos} = buildDemoDataset(NOW);

    const total = transactions
      .flatMap((t) => t.occurrenceLog ?? [])
      .reduce(
        (sum, occ) => sum + (occ.type === "credit" ? occ.value : -occ.value),
        0,
      );

    expect(total).toBe(walletBaselineCentavos);
  });

  it("every document id is unique across collections, goals, and transactions", () => {
    const {collections, goals, transactions} = buildDemoDataset(NOW);
    const ids = [
      ...collections.map((c) => c.id),
      ...goals.map((g) => g.id),
      ...transactions.map((t) => t.id),
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is deterministic for a fixed now", () => {
    const first = buildDemoDataset(NOW);
    const second = buildDemoDataset(NOW);

    expect(first).toEqual(second);
  });
});
