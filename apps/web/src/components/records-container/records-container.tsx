import { motion } from "motion/react";
import { ReactNode } from "react";

import slideUpVariants from "../../motion/slide-up-variants";
import styles from "./records-container.module.css";

interface IRecordsContainerProps {
  children: ReactNode;
}

const RecordsContainer = ({ children }: IRecordsContainerProps) => {
  return (
    <motion.div
      children={children}
      className={styles.recordsContainer}
      variants={slideUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0.5}
    ></motion.div>
  );
};

export default RecordsContainer;
