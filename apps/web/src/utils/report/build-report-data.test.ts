import { describe, expect, it } from "vitest";

import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import { ITransaction } from "../../@types/transaction";
import {
  buildCollectionReportRows,
  buildGoalReportRows,
  buildTransactionReportRows,
  buildWalletSummary,
} from "./build-report-data";

function buildTransaction(overrides: Partial<ITransaction>): ITransaction {
  return {
    id: "t1",
    name: "Transaction",
    value: 10000,
    type: "credit",
    date: "2026-01-10",
    category: "other",
    description: null,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    recurrence: null,
    occurrenceLog: null,
    hasRecurrence: false,
    ...overrides,
  };
}

function buildGoal(overrides: Partial<IGoal>): IGoal {
  return {
    id: "g1",
    name: "Goal",
    value: 100000,
    status: "waiting",
    collection: null,
    description: null,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    ...overrides,
  };
}

function buildCollection(overrides: Partial<ICollection>): ICollection {
  return {
    id: "c1",
    name: "Collection",
    goals: null,
    description: null,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    ...overrides,
  };
}

describe("buildTransactionReportRows", () => {
  it("maps a transaction with no occurrence log into one formatted row", () => {
    const transaction = buildTransaction({
      id: "t1",
      name: "Salário",
      value: 500000,
      type: "credit",
      date: "2026-01-10",
      category: "income",
    });

    expect(buildTransactionReportRows([transaction])).toEqual([
      {
        date: "10/01/26",
        name: "Salário",
        category: "Renda",
        type: "Crédito",
        value: "R$ 5.000,00",
      },
    ]);
  });

  it("expands a recurring transaction into one row per occurrence", () => {
    const transaction = buildTransaction({
      id: "t2",
      name: "Aluguel",
      category: "housing",
      hasRecurrence: true,
      occurrenceLog: [
        { id: "o1", date: "2026-01-05", value: 150000, type: "debt" },
        { id: "o2", date: "2026-02-05", value: 150000, type: "debt" },
      ],
    });

    expect(buildTransactionReportRows([transaction])).toEqual([
      {
        date: "05/01/26",
        name: "Aluguel",
        category: "Moradia",
        type: "Débito",
        value: "R$ 1.500,00",
      },
      {
        date: "05/02/26",
        name: "Aluguel",
        category: "Moradia",
        type: "Débito",
        value: "R$ 1.500,00",
      },
    ]);
  });

  it("sorts rows by date ascending across transactions", () => {
    const transactions = [
      buildTransaction({ id: "t1", name: "Later", date: "2026-03-01" }),
      buildTransaction({ id: "t2", name: "Earlier", date: "2026-01-01" }),
    ];

    const rows = buildTransactionReportRows(transactions);

    expect(rows.map((row) => row.name)).toEqual(["Earlier", "Later"]);
  });
});

describe("buildGoalReportRows", () => {
  it("resolves status label, viability from the wallet, and collection name", () => {
    const collection = buildCollection({ id: "c1", name: "Viagem" });
    const goal = buildGoal({
      id: "g1",
      name: "Economizar",
      value: 100000,
      status: "active",
      collection: { id: "c1" },
      description: "Descrição da meta",
    });

    expect(buildGoalReportRows([goal], [collection], 50000)).toEqual([
      {
        name: "Economizar",
        value: "R$ 1.000,00",
        status: "Ativa",
        viability: "50%",
        collection: "Viagem",
        description: "Descrição da meta",
      },
    ]);
  });

  it("falls back to placeholders when the goal has no collection or description", () => {
    const goal = buildGoal({
      id: "g1",
      collection: null,
      description: null,
    });

    const [row] = buildGoalReportRows([goal], [], 0);

    expect(row.collection).toBe("-");
    expect(row.description).toBe("-");
  });

  it("caps viability at 100%", () => {
    const goal = buildGoal({ id: "g1", value: 50000 });

    const [row] = buildGoalReportRows([goal], [], 200000);

    expect(row.viability).toBe("100%");
  });
});

describe("buildCollectionReportRows", () => {
  it("counts the goals linked to each collection", () => {
    const collection = buildCollection({
      id: "c1",
      name: "Viagem",
      goals: [{ id: "g1" }, { id: "g2" }],
      description: "Fundo para viagem",
    });

    expect(buildCollectionReportRows([collection])).toEqual([
      {
        name: "Viagem",
        goalsCount: 2,
        description: "Fundo para viagem",
      },
    ]);
  });

  it("reports zero goals and a placeholder description when both are absent", () => {
    const collection = buildCollection({
      id: "c1",
      goals: null,
      description: null,
    });

    const [row] = buildCollectionReportRows([collection]);

    expect(row.goalsCount).toBe(0);
    expect(row.description).toBe("-");
  });
});

describe("buildWalletSummary", () => {
  it("formats the wallet value as a labeled summary row", () => {
    expect(buildWalletSummary(123456)).toEqual([
      { label: "Valor na carteira", value: "R$ 1.234,56" },
    ]);
  });
});
