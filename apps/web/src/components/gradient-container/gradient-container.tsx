import { ReactNode } from "react";

import styles from "./gradient-container.module.css";

interface IGradientContainerProps {
  id: string;
  children: ReactNode;
}

const GradientContainer = ({ id, children }: IGradientContainerProps) => {
  return (
    <div id={id} className={styles.gradientContainer} autoFocus>
      {children}
    </div>
  );
};

export default GradientContainer;
