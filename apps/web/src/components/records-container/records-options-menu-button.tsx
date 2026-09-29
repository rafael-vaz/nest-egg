import { Ellipsis, X } from "lucide-react";

import Button from "../button/button";
import styles from "./records-options-menu-button.module.css";

interface IRecordsOptionsMenuButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

const RecordsOptionsMenuButton = ({
  active,
  ...props
}: IRecordsOptionsMenuButton) => {
  return (
    <Button
      {...props}
      icon={active ? X : Ellipsis}
      title={`${active ? "Fechar" : "Abrir"} opções do registro`}
      size="small"
      data-active={active}
      aria-controls="options-menu-list"
      aria-expanded={active}
      color="light-gray"
      className={styles.recordsOptionsMenuButton}
    />
  );
};

export default RecordsOptionsMenuButton;
