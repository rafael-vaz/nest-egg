import { LucideProps } from "lucide-react";
import React from "react";

import styles from "./title.module.css";

interface ITitleProps {
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  align?: "left" | "right" | "center";
  text: string;
}

const Title = ({ icon: Icon, text, align = "left" }: ITitleProps) => {
  return (
    <h1 className={styles.title} data-align={align}>
      {Icon && <Icon size={32} />}
      <span>{text}</span>
    </h1>
  );
};

export default Title;
