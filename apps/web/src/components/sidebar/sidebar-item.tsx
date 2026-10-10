import { LucideProps } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import styles from "./sidebar-item.module.css";

interface ISidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  label: string;
  descritiption: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

const SidebarItem = ({
  id,
  label,
  descritiption,
  icon: Icon,
  ...props
}: ISidebarItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentModalId = useSelector((state: RootState) => state.modal.id);
  const currentPage = location.pathname;
  const normalizePath = currentPage.replace(/^\/+/, "");
  const isActive = normalizePath === id || currentModalId === id;

  const dispatch = useAppDispatch();
  const icon = <Icon size={20} />;
  function handleSidebarItemClick(id: string) {
    switch (id) {
      case "goals":
        navigate("/goals");
        break;
      case "collections":
        navigate("/collections");
        break;
      case "transactions":
        navigate("/transactions");
        break;
      case "wallet":
        navigate("/wallet");
        break;
      case "activities":
        dispatch(openModalState({ id: "activities" }));
        break;
      case "search":
        navigate("/search");
        break;
      case "create":
        dispatch(openModalState({ id: "create" }));
        break;
      case "help":
        dispatch(openModalState({ id: "help" }));
        break;
      case "home":
        navigate("/home");
        break;
    }
  }

  return (
    <li className={styles.sidebarItem} data-active={isActive}>
      <button
        id={`sidebar-item-${id}`}
        aria-label={descritiption}
        {...props}
        onClick={(event) => {
          handleSidebarItemClick(id);
          event.currentTarget.blur();
        }}
      >
        {id === "home" ? <div>{icon}</div> : icon}
      </button>
      <span className={styles.sidebarItemTooltip} role="tooltip">
        {label}
      </span>
    </li>
  );
};

export default SidebarItem;
