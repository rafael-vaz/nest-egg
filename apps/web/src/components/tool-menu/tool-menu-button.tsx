import { Menu } from "lucide-react";

import { useAppDispatch } from "../../store/configure-store";
import { openToolMenuState } from "../../store/reducers/tool-menu/tool-menu";
import Button from "../button/button";
import styles from "./tool-menu-button.module.css";

const ToolMenuButton = () => {
  const dispatch = useAppDispatch();

  function handleClick() {
    dispatch(openToolMenuState());
  }

  return (
    <Button
      icon={Menu}
      color={"dark"}
      size="small"
      aria-label="Acessar menu de ferramentas"
      className={styles.toolMenuButton}
      onClick={handleClick}
    />
  );
};

export default ToolMenuButton;
