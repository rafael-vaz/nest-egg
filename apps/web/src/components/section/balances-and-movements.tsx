import { motion } from "motion/react";

import slideUpVariants from "../../motion/slide-up-variants";
import CurrentMonthTransactionsCard from "../card/current-month-transactions-card";
import WalletBalanceCard from "../card/wallet-balance-card";
import Section from "./section";
import styles from "./section.module.css";

const BalancesAndMovements = () => {
  const sectionItems = [
    <WalletBalanceCard />,
    <CurrentMonthTransactionsCard type="credit" />,
    <CurrentMonthTransactionsCard type="debt" />,
  ];
  return (
    <Section id="balances-and-movements" title="Saldos e movimentações">
      <ul className={`${styles.sectionContentList} ${styles.mediumBasis}`}>
        {sectionItems.map((item, index) => {
          return (
            <motion.li
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index / 2}
              key={`balances-and-goals-item-${index}`}
            >
              {item}
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
};

export default BalancesAndMovements;
