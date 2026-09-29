import { motion } from "motion/react";

import slideUpVariants from "../../motion/slide-up-variants";
import SavingsAndExpensesCard from "../card/savings-and-expenses-card";
import TransactionsMadeCard from "../card/transactions-made-card";
import Section from "./section";
import styles from "./section.module.css";

const SummaryOfOperations = () => {
  const sectionItems = [TransactionsMadeCard, SavingsAndExpensesCard];
  return (
    <Section id="balances-and-goals" title="Resumo das operações">
      <ul className={`${styles.sectionContentList} ${styles.largeBasis}`}>
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

export default SummaryOfOperations;
