import { motion } from "motion/react";

import slideUpVariants from "../../motion/slide-up-variants";
import previousMonthCardsMap from "../../templates/previous-month-cards-map";
import Card from "../card/card";
import cardStyles from "../card/card.module.css";
import Section from "./section";
import styles from "./section.module.css";

const PreviousMonth = () => {
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
            <h3 className={cardStyles.cardEmphasisText}>R$ 0.000,00</h3>
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
