import { ChartCandlestick } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import getLastMonthsRanges from "../../utils/date/get-last-months-ranges";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
import StackedAreaChart from "../charts/stacked-area-chart";
import Card from "./card";

const MONTHS_TO_SHOW = 6;

const TransactionsMadeCard = () => {
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );

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
    return getLastMonthsRanges(MONTHS_TO_SHOW).map((range) => ({
      name: range.label,
      credit: sumOccurrencesByType(
        occurrences,
        "credit",
        range.firstDay,
        range.lastDay,
      ),
      debt: sumOccurrencesByType(
        occurrences,
        "debt",
        range.firstDay,
        range.lastDay,
      ),
    }));
  }, [transactions]);

  return (
    <Card
      id="transactions-made"
      title="Transações realizadas"
      icon={ChartCandlestick}
      hasFilter={true}
    >
      <StackedAreaChart keys={keys} data={data} translations={translations} />
    </Card>
  );
};

export default TransactionsMadeCard;
