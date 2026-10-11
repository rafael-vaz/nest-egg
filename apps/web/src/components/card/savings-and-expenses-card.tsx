import { Coins } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import getLastMonthsRanges from "../../utils/date/get-last-months-ranges";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
import StackedBarChart from "../charts/stacked-bar-chart";
import Card from "./card";

const MONTHS_TO_SHOW = 6;

const SavingsAndExpensesCard = () => {
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );

  const keys = [
    { id: "savings", color: "#15f5ba" },
    { id: "expenses", color: "#e74c3c" },
  ] as const;

  const translations = {
    savings: "Poupado",
    expenses: "Gasto",
  } as const;

  const data = React.useMemo(() => {
    const occurrences = getTransactionOccurrences(transactions);
    // values are stored as centavos; convert to reais for the chart
    return getLastMonthsRanges(MONTHS_TO_SHOW).map((range) => ({
      name: range.label,
      savings:
        sumOccurrencesByType(
          occurrences,
          "credit",
          range.firstDay,
          range.lastDay,
        ) / 100,
      expenses:
        sumOccurrencesByType(
          occurrences,
          "debt",
          range.firstDay,
          range.lastDay,
        ) / 100,
    }));
  }, [transactions]);

  return (
    <Card
      id="savings-and-expenses"
      title="Poupanças e gastos"
      icon={Coins}
      hasFilter={true}
    >
      <StackedBarChart keys={keys} data={data} translations={translations} />
    </Card>
  );
};

export default SavingsAndExpensesCard;
