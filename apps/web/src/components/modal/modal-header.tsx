import { ArrowLeft } from "lucide-react";

import Button from "../button/button";
import Title from "../title/title";
import styles from "./modal-header.module.css";

interface IModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader = ({ title, onClose }: IModalHeaderProps) => {
  return (
    <div className={styles.modalHeader}>
      <Button
        icon={ArrowLeft}
        size="small"
        aria-label="Voltar"
        color="light-gray"
        onClick={() => onClose()}
      />
      <Title text={title} />
    </div>
  );
};

export default ModalHeader;
