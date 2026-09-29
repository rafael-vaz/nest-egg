import { motion } from "motion/react";
import { ReactNode } from "react";

import slideUpVariants from "../../motion/slide-up-variants";
import Subtitle from "../subtitle/subtitle";
import styles from "./section.module.css";

interface ISectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

const Section = ({ id, title, children }: ISectionProps) => {
  return (
    <motion.section
      id={`${id}-section`}
      className={styles.section}
      variants={slideUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Subtitle text={title} variants="marked" />
      <div className={styles.sectionContent}>{children}</div>
    </motion.section>
  );
};

export default Section;
