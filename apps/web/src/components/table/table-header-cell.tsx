import React, { ReactNode } from "react";

import styles from "./table-header-cell.module.css";

interface ITableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

const TableHeaderCell = ({ children, ...props }: ITableHeaderCellProps) => {
  return (
    <th className={styles.tableHeaderCell} {...props}>
      {children}
    </th>
  );
};

export default TableHeaderCell;
