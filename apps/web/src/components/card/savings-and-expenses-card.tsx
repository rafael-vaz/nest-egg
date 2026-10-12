import { DatesRangeValue } from "@mantine/dates";
import { Coins } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import getLastMonthsRanges from "../../utils/date/get-last-months-ranges";
import getMonthRangesBetween from "../../utils/date/get-month-ranges-between";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
import StackedBarChart from "../charts/stacked-bar-chart";
import Card from "./card";

const MONTHS_TO_SHOW = 6;

const SavingsAndExpensesCard = () => {
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [monthInterval, setMonthInterval] = React.useState<
    DatesRangeValue<string>
  >([null, null]);

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
    const [startDate, endDate] = monthInterval;
    const ranges =
      startDate || endDate
        ? getMonthRangesBetween(startDate ?? endDate!, endDate ?? startDate!)
        : getLastMonthsRanges(MONTHS_TO_SHOW);

    // values are stored as centavos; convert to reais for the chart
    return ranges.map((range) => ({
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
  }, [transactions, monthInterval]);

  return (
    <Card
      id="savings-and-expenses"
      title="Poupanças e gastos"
      icon={Coins}
      hasFilter={true}
      onFilterChange={setMonthInterval}
    >
      <StackedBarChart keys={keys} data={data} translations={translations} />
    </Card>
  );
};

export default SavingsAndExpensesCard;
