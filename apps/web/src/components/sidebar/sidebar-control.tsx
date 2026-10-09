import { Menu } from "lucide-react";
import React from "react";

import { useAppDispatch } from "../../store/configure-store";
import { openToolMenuState } from "../../store/reducers/tool-menu/tool-menu";
import sidebarItemStyles from "./sidebar-item.module.css";

const SidebarControl = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dispatch = useAppDispatch();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    dispatch(openToolMenuState());
    event.currentTarget.blur();
  }

  return (
    <li className={sidebarItemStyles.sidebarItem}>
      <button aria-label="Acessar Menu" {...props} onClick={handleClick}>
        <Menu size={20} />
      </button>
      <span className={sidebarItemStyles.sidebarItemTooltip} role="tooltip">
        Menu
      </span>
    </li>
  );
};

export default SidebarControl;
