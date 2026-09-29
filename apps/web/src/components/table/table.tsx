import { ReactNode } from "react";

import styles from "./table.module.css";

interface ITableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  id: string;
  children: ReactNode;
}

const Table = ({ children, ...props }: ITableProps) => {
  return (
    <div className={`${styles.tableWrapper} smoothScrollbar`}>
      <table className={styles.table} {...props} tabIndex={0}>
        {children}
      </table>
    </div>
  );
};

export default Table;
