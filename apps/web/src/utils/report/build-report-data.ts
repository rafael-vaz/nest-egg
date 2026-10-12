import { ICollection } from "../../@types/collection";
import { IGoal } from "../../@types/goal";
import { ITransaction } from "../../@types/transaction";
import goalStatusMap from "../../templates/goal-status-map";
import transactionCategoryMap from "../../templates/transaction-category-map";
import transactionTypesMap from "../../templates/transaction-type-map";
import formatShortDate from "../date/format-short-date";
import calculateGoalProgress from "../goal/calculate-goal-progress";
import formatCurrency from "../text/format-currency";
import getTransactionOccurrences from "../transaction/get-transaction-occurrences";

export interface ITransactionReportRow {
  date: string;
  name: string;
  category: string;
  type: string;
  value: string;
}

export interface IGoalReportRow {
  name: string;
  value: string;
  status: string;
  viability: string;
  collection: string;
  description: string;
}

export interface ICollectionReportRow {
  name: string;
  goalsCount: number;
  description: string;
}

export interface IReportSummaryRow {
  label: string;
  value: string;
}

export interface IReportData {
  summary: IReportSummaryRow[];
  transactions?: ITransactionReportRow[];
  goals?: IGoalReportRow[];
  collections?: ICollectionReportRow[];
}

export function buildTransactionReportRows(
  transactions: ITransaction[],
): ITransactionReportRow[] {
  const transactionsById = new Map(
    transactions.map((transaction) => [transaction.id, transaction]),
  );

  return getTransactionOccurrences(transactions)
    .map((occurrence) => {
      const transaction = transactionsById.get(occurrence.transactionId);
      if (!transaction) return null;

      const categoryLabel =
        transactionCategoryMap.find((c) => c.id === transaction.category)
          ?.value ?? transaction.category;
      const typeLabel =
        transactionTypesMap.find((t) => t.id === occurrence.type)?.value ??
        occurrence.type;

      return {
        sortDate: new Date(occurrence.date).getTime(),
        row: {
          date: formatShortDate(occurrence.date),
          name: transaction.name,
          category: categoryLabel,
          type: typeLabel,
          value: formatCurrency(`${occurrence.value}`),
        },
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => a.sortDate - b.sortDate)
    .map((entry) => entry.row);
}

export function buildGoalReportRows(
  goals: IGoal[],
  collections: ICollection[],
  walletValue: number,
): IGoalReportRow[] {
  return goals.map((goal) => {
    const statusLabel =
      goalStatusMap.find((status) => status.id === goal.status)?.value ??
      goal.status;
    const collectionName = goal.collection
      ? (collections.find((collection) => collection.id === goal.collection!.id)
          ?.name ?? "-")
      : "-";
    const viability = Math.round(
      calculateGoalProgress(walletValue, goal.value),
    );

    return {
      name: goal.name,
      value: formatCurrency(`${goal.value}`),
      status: statusLabel,
      viability: `${viability}%`,
      collection: collectionName,
      description: goal.description ?? "-",
    };
  });
}

export function buildCollectionReportRows(
  collections: ICollection[],
): ICollectionReportRow[] {
  return collections.map((collection) => ({
    name: collection.name,
    goalsCount: collection.goals?.length ?? 0,
    description: collection.description ?? "-",
  }));
}

export function buildWalletSummary(walletValue: number): IReportSummaryRow[] {
  return [
    { label: "Valor na carteira", value: formatCurrency(`${walletValue}`) },
  ];
}
