import { motion } from "motion/react";

import slideUpVariants from "../../motion/slide-up-variants";
import ActiveGoalCard from "../card/active-goal-card";
import GoalStatusCard from "../card/goal-status-card";
import GoalsFeasibility from "../card/goals-feasibility";
import Section from "./section";
import styles from "./section.module.css";

const CurrentSituationGoals = () => {
  const sectionItems = [ActiveGoalCard, GoalStatusCard, GoalsFeasibility];

  return (
    <Section id="current-situation-goals" title="Situação atual">
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

export default CurrentSituationGoals;
