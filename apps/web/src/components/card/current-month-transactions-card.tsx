import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

import { TransactionType } from "../../@types/transaction";
import getCurrentMonthRange from "../../utils/date/get-current-month-range";
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
  const currentMonthRange = getCurrentMonthRange();
  const transactionsMap = {
    credit: {
      value: "R$ 7.200,00",
      recurrence: 2,
      updated: "1 semana",
    },
    debt: {
      value: "R$ 800,00",
      recurrence: 14,
      updated: "3 semanas",
    },
  };

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
          {transactionsMap[type].value}
        </h3>
        <p className={styles.currentMonthTransactionsCardRecurringTransactions}>
          {`${transactionsMap[type].recurrence} transações realizadas`}
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
