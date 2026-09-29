import { ReactNode } from "react";

import styles from "./grid-container.module.css";

interface IGridContainerProps {
  className?: string;
  columns: 1 | 2 | 3;
  children: ReactNode;
  rowGap?: boolean;
}

const GridContainer = ({
  className,
  columns,
  rowGap = true,
  children,
}: IGridContainerProps) => {
  return (
    <div
      className={`${styles.grid} ${!rowGap && styles.noRowGap} ${
        className ?? ""
      }`}
      data-columns={columns}
    >
      {children}
    </div>
  );
};

export default GridContainer;
