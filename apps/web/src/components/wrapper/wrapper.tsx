import { ReactNode } from "react";

import styles from "./wrapper.module.css";

interface IWrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;
