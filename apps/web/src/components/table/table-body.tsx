import React, { ReactNode } from "react";

interface ITableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

const TableBody = ({ children, ...props }: ITableBodyProps) => {
  return <tbody {...props}>{children}</tbody>;
};

export default TableBody;
