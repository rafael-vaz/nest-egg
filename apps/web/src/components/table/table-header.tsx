import React, { ReactNode } from "react";

import styles from "./table-header.module.css";

interface ITableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

const TableHeader = ({ children, ...props }: ITableHeaderProps) => {
  return (
    <thead className={styles.tableHeader} {...props}>
      {children}
    </thead>
  );
};

export default TableHeader;
