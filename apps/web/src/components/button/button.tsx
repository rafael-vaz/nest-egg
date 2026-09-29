import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./button.module.css";

export type ButtonColor =
  | "green"
  | "light-gray"
  | "dark"
  | "dark-gray"
  | "purple"
  | "success"
  | "error"
  | "transparent";
type ButtonSize = "default" | "small" | "fill" | "x-small";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  color?: ButtonColor;
  size?: ButtonSize;
  className?: string;
  ref?: React.RefObject<null>;
}

const Button = ({
  text,
  icon: Icon,
  color = "green",
  size = "default",
  className,
  ...props
}: IButtonProps) => {
  const enableText = size !== "small" && size !== "x-small";
  return (
    <button
      data-color={color}
      data-size={size}
      {...props}
      className={`${styles.button} ${className ?? ""}`}
    >
      {enableText && <span>{text}</span>}
      {Icon && <Icon size={16} />}
    </button>
  );
};

export default Button;
