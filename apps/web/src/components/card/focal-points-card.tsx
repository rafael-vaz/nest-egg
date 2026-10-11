import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CirclePause,
  ListChecks,
  Target,
  Trophy,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import getCurrentMonthRange from "../../utils/date/get-current-month-range";
import formatCurrency from "../../utils/text/format-currency";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
import StatusTag from "../status-tag/status-tag";
import Card from "./card";
import styles from "./focal-points-card.module.css";

const FocalPointsCard = () => {
  const { goals, transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );

  const totalGoals = goals.length;
  const waitingGoals = goals.filter((goal) => goal.status === "waiting");
  const completedGoals = goals.filter((goal) => goal.status === "completed");

  const monthlyCredit = React.useMemo(() => {
    const { firstDay, lastDay } = getCurrentMonthRange();
    const occurrences = getTransactionOccurrences(transactions);
    return sumOccurrencesByType(occurrences, "credit", firstDay, lastDay);
  }, [transactions]);

  const monthlyDebt = React.useMemo(() => {
    const { firstDay, lastDay } = getCurrentMonthRange();
    const occurrences = getTransactionOccurrences(transactions);
    return sumOccurrencesByType(occurrences, "debt", firstDay, lastDay);
  }, [transactions]);

  return (
    <Card id="focal-points" title="Pontos focais" icon={Target}>
      <div className={styles.focalPointsCardMainContent}>
        <div className={styles.focalPointsCardCategory}>
          <p>Visão das metas</p>
          <ul className={styles.focalPointsList}>
            <li>
              <StatusTag
                name="Total"
                value={`${totalGoals}`}
                icon={ListChecks}
              />
            </li>
            <li>
              <StatusTag
                name="Em espera"
                value={`${waitingGoals.length}`}
                icon={CirclePause}
              />
            </li>
            <li>
              <StatusTag
                name="Concluídas"
                value={`${completedGoals.length}`}
                icon={Trophy}
              />
            </li>
          </ul>
        </div>
        <div className={styles.focalPointsCardCategory}>
          <p>Atividades do mês</p>
          <ul
            className={`${styles.focalPointsList} ${styles.transactionsInfo}`}
          >
            <li data-type="credit">
              <BanknoteArrowUp size={14} />
              <p>
                Créditos: <span>+ {formatCurrency(`${monthlyCredit}`)}</span>
              </p>
            </li>
            <li data-type="debt">
              <BanknoteArrowDown size={14} />
              <p>
                Débito: <span>- {formatCurrency(`${monthlyDebt}`)}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default FocalPointsCard;
