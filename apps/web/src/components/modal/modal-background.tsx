import { motion } from "motion/react";
import { ReactNode } from "react";

import { ModalCategory } from "../../@types/modal";
import fadeInVariants from "../../motion/fade-in-variants";
import styles from "./modal-background.module.css";

interface IModalProps {
  id: string;
  children: ReactNode;
  category?: ModalCategory;
}

const ModalBackground = ({
  id,
  children,
  category = "default",
}: IModalProps) => {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      id={id}
      className={styles.modalBackground}
      data-category={category}
    >
      {children}
    </motion.div>
  );
};

export default ModalBackground;
