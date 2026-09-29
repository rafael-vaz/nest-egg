import React, { ReactNode } from "react";

import styles from "./table-data-cell.module.css";

interface ITableDataCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

const TableDataCell = ({ children, ...props }: ITableDataCellProps) => {
  return (
    <td className={styles.tableDataCell} {...props}>
      {children}
    </td>
  );
};

export default TableDataCell;
