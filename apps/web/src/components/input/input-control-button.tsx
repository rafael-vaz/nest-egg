import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./input-control-button.module.css";

interface IInputControlButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

const InputControlButton = ({
  title,
  icon: Icon,
  ...props
}: IInputControlButton) => {
  return (
    <button
      tabIndex={0}
      title={title}
      aria-label={title}
      className={`${styles.inputControlButton} noVisualFocus`}
      {...props}
    >
      <Icon size={20} />
    </button>
  );
};

export default InputControlButton;
