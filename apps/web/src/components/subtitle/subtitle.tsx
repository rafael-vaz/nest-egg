import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./subtitle.module.css";

interface ISubtitleProps {
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  align?: "left" | "right" | "center";
  variants?: "default" | "marked";
  text: string;
}

const Subtitle = ({
  icon: Icon,
  align,
  variants = "default",
  text,
}: ISubtitleProps) => {
  return (
    <h3 data-variants={variants} data-align={align} className={styles.subtitle}>
      {Icon && <Icon size={32} />}
      <span>{text}</span>
    </h3>
  );
};

export default Subtitle;
