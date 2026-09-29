import { ReactNode } from "react";

import styles from "./gradient-background.module.css";

interface IGradientBackgroundProps {
  children: ReactNode;
}

const GradientBackground = ({ children }: IGradientBackgroundProps) => {
  return <div className={styles.gradientBackground}>{children}</div>;
};

export default GradientBackground;
