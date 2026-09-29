import { motion } from "motion/react";

import rotateVariants from "../../motion/rotate-variants";
import styles from "./spinner.module.css";

interface ISpinnerProps {
  size?: "normal" | "small";
}

const Spinner = ({ size = "normal" }: ISpinnerProps) => {
  return (
    <motion.div
      variants={rotateVariants}
      className={`${styles.spinner}`}
      initial="initial"
      animate="animate"
      data-size={size}
    ></motion.div>
  );
};

export default Spinner;
