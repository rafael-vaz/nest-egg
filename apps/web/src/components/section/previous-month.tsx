import { motion } from "motion/react";
import React from "react";
import { useSelector } from "react-redux";

import slideUpVariants from "../../motion/slide-up-variants";
import { RootState } from "../../store/configure-store";
import previousMonthCardsMap from "../../templates/previous-month-cards-map";
import getPreviousMonthRange from "../../utils/date/get-previous-month-range";
import formatCurrency from "../../utils/text/format-currency";
import getTransactionOccurrences from "../../utils/transaction/get-transaction-occurrences";
import sumOccurrencesByType from "../../utils/transaction/sum-occurrences-by-type";
import Card from "../card/card";
import cardStyles from "../card/card.module.css";
import Section from "./section";
import styles from "./section.module.css";

const PreviousMonth = () => {
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );

  const totalsByType = React.useMemo(() => {
    const { firstDay, lastDay } = getPreviousMonthRange();
    const occurrences = getTransactionOccurrences(transactions);
    return {
      credit: sumOccurrencesByType(occurrences, "credit", firstDay, lastDay),
      debt: sumOccurrencesByType(occurrences, "debt", firstDay, lastDay),
    };
  }, [transactions]);

  const cards = previousMonthCardsMap.map((card, index) => {
    return (
      <motion.li
        key={card.id}
        variants={slideUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={index / 2}
      >
        <Card
          id={card.id}
          title={card.title}
          icon={card.icon}
          iconColor={card.transactionType === "credit" ? "green" : "red"}
        >
          <div className={cardStyles.cardEmphasisContainer}>
            <h3 className={cardStyles.cardEmphasisText}>
              {formatCurrency(`${totalsByType[card.transactionType]}`)}
            </h3>
          </div>
        </Card>
      </motion.li>
    );
  });

  return (
    <Section id="previous-month" title="Mês anterior">
      <ul className={`${styles.sectionContentList} ${styles.smallBasis}`}>
        {cards}
      </ul>
    </Section>
  );
};

export default PreviousMonth;
