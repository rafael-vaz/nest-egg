import { ReactNode } from "react";

import styles from "./modal.module.css";

interface IModalContainerProps {
  children: ReactNode;
}

const ModalContent = ({ children }: IModalContainerProps) => {
  return (
    <div className={`${styles.modalContent} smoothScrollbar`}>{children}</div>
  );
};

export default ModalContent;
