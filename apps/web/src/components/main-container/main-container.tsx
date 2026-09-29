import { ReactNode } from "react";

import Wrapper from "../wrapper/wrapper";
import styles from "./main-container.module.css";

interface IMainContainerProps {
  children: ReactNode;
}

const MainContainer = ({ children }: IMainContainerProps) => {
  return (
    <main className={styles.mainContainer}>
      <Wrapper>{children}</Wrapper>
    </main>
  );
};

export default MainContainer;
