import { ReactNode } from "react";

interface ITableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

const TableRow = ({ children, ...props }: ITableRowProps) => {
  return (
    <tr {...props} tabIndex={0}>
      {children}
    </tr>
  );
};

export default TableRow;
