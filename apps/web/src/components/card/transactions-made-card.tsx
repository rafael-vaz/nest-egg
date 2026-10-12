import { DatesRangeValue } from "@mantine/dates";
import { ChartCandlestick } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import getLastMonthsRanges from "../../utils/date/get-last-months-ranges";
import getMonthRangesBetween from "../../utils/date/get-month-ranges-between";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
import StackedAreaChart from "../charts/stacked-area-chart";
import Card from "./card";

const MONTHS_TO_SHOW = 6;

const TransactionsMadeCard = () => {
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const [monthInterval, setMonthInterval] = React.useState<
    DatesRangeValue<string>
  >([null, null]);

  const keys = [
    { id: "credit", color: "#15f5ba" },
    { id: "debt", color: "#e74c3c" },
  ] as const;

  const translations = {
    debt: "Débito",
    credit: "Crédito",
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
      credit:
        sumOccurrencesByType(
          occurrences,
          "credit",
          range.firstDay,
          range.lastDay,
        ) / 100,
      debt:
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
      id="transactions-made"
      title="Transações realizadas"
      icon={ChartCandlestick}
      hasFilter={true}
      onFilterChange={setMonthInterval}
    >
      <StackedAreaChart keys={keys} data={data} translations={translations} />
    </Card>
  );
};

export default TransactionsMadeCard;
