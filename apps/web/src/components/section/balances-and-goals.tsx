import { motion } from "motion/react";

import slideUpVariants from "../../motion/slide-up-variants";
import ActiveGoalCard from "../card/active-goal-card";
import FocalPointsCard from "../card/focal-points-card";
import WalletBalanceCard from "../card/wallet-balance-card";
import Section from "./section";
import styles from "./section.module.css";

const BalancesAndGoals = () => {
  const sectionItems = [WalletBalanceCard, ActiveGoalCard, FocalPointsCard];
  return (
    <Section id="balances-and-goals" title="Saldos e metas">
      <ul className={`${styles.sectionContentList} ${styles.mediumBasis}`}>
        {sectionItems.map((Item, index) => {
          return (
            <motion.li
              variants={slideUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index / 2}
              key={`balances-and-goals-item-${index}`}
            >
              <Item />
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
};

export default BalancesAndGoals;
