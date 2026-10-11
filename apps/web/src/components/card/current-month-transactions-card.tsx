import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { TransactionType } from "../../@types/transaction";
import { RootState } from "../../store/configure-store";
import getCurrentMonthRange from "../../utils/date/get-current-month-range";
import formatCurrency from "../../utils/text/format-currency";
import filterOccurrencesByRange from "../../utils/transaction/filter-occurrences-by-range";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import getTransactionTypeById from "../../utils/transaction/get-transaction-type-by-id";
import Card from "./card";
import cardStyles from "./card.module.css";
import circularProgressStyles from "./circular-progress-card.module.css";
import styles from "./current-month-transactions-card.module.css";

interface ICurrentMonthTransactionsCardProps {
  type: TransactionType;
}

const CurrentMonthTransactionsCard = ({
  type,
}: ICurrentMonthTransactionsCardProps) => {
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );
  const currentMonthRange = getCurrentMonthRange();

  const { total, count } = React.useMemo(() => {
    const occurrences = filterOccurrencesByRange(
      getTransactionOccurrences(transactions),
      currentMonthRange.firstDay,
      currentMonthRange.lastDay,
    ).filter((occurrence) => occurrence.type === type);

    return {
      total: occurrences.reduce((sum, occurrence) => sum + occurrence.value, 0),
      count: occurrences.length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, type]);

  return (
    <Card
      id={`current-month-${type}-transactions`}
      title={`${getTransactionTypeById(type)} do mês`}
      icon={type === "credit" ? BanknoteArrowUp : BanknoteArrowDown}
      iconColor={type === "credit" ? "green" : "red"}
    >
      <div className={styles.currentMonthTransactionsCardMainContent}>
        <h3
          className={`${cardStyles.cardEmphasisText} ${styles.currentMonthTransactionsCardTitle}`}
        >
          {formatCurrency(`${total}`)}
        </h3>
        <p className={styles.currentMonthTransactionsCardRecurringTransactions}>
          {`${count} transações realizadas`}
        </p>
      </div>
      <Link
        to={`/transactions?status=${type}&startDate=${currentMonthRange.firstDay}&endDate=${currentMonthRange.lastDay}`}
        className={circularProgressStyles.circularProgressLink}
      >
        {`Ver ${getTransactionTypeById(type)?.toLocaleLowerCase()}s do mês 🡢`}
      </Link>
    </Card>
  );
};

export default CurrentMonthTransactionsCard;
