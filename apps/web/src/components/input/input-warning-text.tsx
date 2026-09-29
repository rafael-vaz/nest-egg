import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./input-warning-text.module.css";

interface IInputWarningText {
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  text: string;
  type: "success" | "error" | "alert";
}

const InputWarningText = ({ icon: Icon, text, type }: IInputWarningText) => {
  return (
    <div
      className={styles.inputWarningText}
      data-type={type}
      role="alert"
      aria-live="assertive"
    >
      {Icon && <Icon size={14} />}
      <span>{text}</span>
    </div>
  );
};

export default InputWarningText;
