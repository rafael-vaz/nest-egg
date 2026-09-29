import React, { ReactNode } from "react";

import styles from "./tool-menu-group-list.module.css";

interface IToolMenuGroupListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

const ToolMenuGroupList = ({ children }: IToolMenuGroupListProps) => {
  return <ul className={styles.toolMenuGroupList}>{children}</ul>;
};

export default ToolMenuGroupList;
