import { ReactNode } from "react";

import styles from "./chart-container.module.css";

export type ContainerHeight = "small" | "medium" | "large";

interface IChartContainerProps {
  type: string;
  children: ReactNode;
  height?: ContainerHeight;
}

const ChartContainer = ({
  type,
  children,
  height = "medium",
}: IChartContainerProps) => {
  return (
    <div
      data-type={type}
      className={styles.chartContainer}
      data-height={height}
    >
      {children}
    </div>
  );
};

export default ChartContainer;
