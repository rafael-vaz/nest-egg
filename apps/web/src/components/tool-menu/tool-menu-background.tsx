import { ReactNode } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../store/configure-store";
import styles from "./tool-menu-background.module.css";

interface IToolMenuBackground {
  children: ReactNode;
}

const ToolMenuBackground = ({ children }: IToolMenuBackground) => {
  const { isOpen } = useSelector((state: RootState) => state.toolMenu);
  return (
    <div className={styles.toolMenuBackground} data-active={isOpen}>
      {children}
    </div>
  );
};

export default ToolMenuBackground;
