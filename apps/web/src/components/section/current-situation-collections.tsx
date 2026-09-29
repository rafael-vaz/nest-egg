import { motion } from "motion/react";

import slideUpVariants from "../../motion/slide-up-variants";
import CollectionsProgress from "../card/collections-progress";
import CollectionValues from "../card/collections-values";
import GreatestProgressCollection from "../card/greatest-progress-collection";
import Section from "./section";
import styles from "./section.module.css";

const CurrentSituationCollections = () => {
  const sectionItems = [
    GreatestProgressCollection,
    CollectionsProgress,
    CollectionValues,
  ];

  return (
    <Section id="current-situation-collections" title="Situação atual">
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

export default CurrentSituationCollections;
